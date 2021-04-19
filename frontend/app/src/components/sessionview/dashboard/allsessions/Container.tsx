import {useRef, useState} from "react";
import {MMDVariables, Variable} from "../../../../constants";
import Menu from "../Menu";
import ContainerCard from "../../../common/ContainerCard";
import Tooltip from "../../../common/Tooltip";
import {makeStyles, Theme, createStyles, IconButton, Typography} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {sessionIdsState} from "../../../../state/session";
import {selectedSessionActiveContainersState, selectedSessionLayoutState, viewState} from "../../../../state/dashboard";
import ContainerItem from "./ContainerItem";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            display: "grid",
            gridTemplateColumns: "1fr 56px",
            gap: theme.spacing(2)
        },
        menu: {
            display: "grid",
            gridTemplateColumns: "24px 24px",
            gap: theme.spacing(1)
        },
        iconButton: {
            padding: 0
        },
        infoIcon: {
            cursor: "default"
        },
        items: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: theme.spacing(3)
        }
    })
);

interface Props {
    variable: Variable;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    const sessionIds = useRecoilValue(sessionIdsState);

    const [view, setView] = useRecoilState(viewState([null, props.variable]));

    const setActiveContainers = useSetRecoilState(selectedSessionActiveContainersState);
    const setSelectedSessionLayout = useSetRecoilState(selectedSessionLayoutState);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const menuAnchorElement = useRef<HTMLDivElement | null>(null);

    function removeContainer(): void {
        setActiveContainers((prevState) => {
            const newState = [...prevState];
            return newState.filter((item) => item != props.variable);
        });

        // Remove from layout
        setSelectedSessionLayout((prevValue) => {
            const layout = [...prevValue];
            return layout.filter((item) => item.i != props.variable);
        });
    }

    return (
        <ContainerCard>
            <>
                <div className={classes.header}>
                    <Typography variant="h2" noWrap={true}>
                        {MMDVariables[props.variable].name}
                    </Typography>

                    <div className={`${classes.menu} noDrag`} ref={menuAnchorElement}>
                        <Tooltip variable={props.variable}>
                            <IconButton
                                aria-label="info"
                                disableFocusRipple={true}
                                disableRipple={true}
                                disableTouchRipple={true}
                                className={`${classes.iconButton} ${classes.infoIcon}`}
                            >
                                <InfoOutlinedIcon color="action" />
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            aria-label="settings"
                            className={classes.iconButton}
                            onClick={() => setMenuOpen(true)}
                        >
                            <MoreVertIcon color="action" />
                        </IconButton>
                    </div>

                    <Menu
                        open={menuOpen}
                        anchorEl={menuAnchorElement.current}
                        isDetailedView={view === "chart"}
                        onShowMore={() => setView("chart")}
                        onShowLess={() => setView("numeric")}
                        onRemoveView={() => removeContainer()}
                        onMenuClose={() => setMenuOpen(false)}
                    />
                </div>

                <div className={classes.items}>
                    {sessionIds.map((id) => (
                        <ContainerItem key={id} id={id} variable={props.variable} view={view} />
                    ))}
                </div>
            </>
        </ContainerCard>
    );
}
