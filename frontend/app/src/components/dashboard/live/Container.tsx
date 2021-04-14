import React, {useRef, useState} from "react";
import {MMDVariables, Variable} from "../../../constants";
import Menu from "./Menu";
import LineChart from "./LineChart";
import Numeric from "./Numeric";
import ContainerCard from "../ContainerCard";
import Tooltip from "../Tooltip";
import {makeStyles, Theme, createStyles, IconButton, Typography} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CalculatingIndicator from "./CalculatingIndicator";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    containerState,
    selectedSessionActiveContainersState,
    selectedSessionDataLengthVariableState,
    selectedSessionIdState,
    View
} from "../../../state/session";

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
        }
    })
);

interface Props {
    variable: Variable;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    const dataLength = useRecoilValue(selectedSessionDataLengthVariableState(props.variable));

    const selectedSessionId = useRecoilValue(selectedSessionIdState);
    const [container, setContainer] = useRecoilState(containerState([selectedSessionId, props.variable]));
    const setActiveContainers = useSetRecoilState(selectedSessionActiveContainersState);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const menuAnchorElement = useRef<HTMLDivElement | null>(null);

    function setView(view: View): void {
        setContainer(view);
    }

    function removeView(): void {
        setActiveContainers((prevState) => {
            return prevState.splice(prevState.indexOf(props.variable), 1);
        });
    }

    return (
        <ContainerCard>
            <>
                <div className={classes.header}>
                    <Typography variant="h2" noWrap={true}>
                        {MMDVariables[props.variable].name}
                    </Typography>

                    <div className={classes.menu} ref={menuAnchorElement}>
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
                        isDetailedView={container === "chart"}
                        onShowMore={() => setView("chart")}
                        onShowLess={() => setView("numeric")}
                        onRemoveView={() => removeView()}
                        onMenuClose={() => setMenuOpen(false)}
                    />
                </div>
                {MMDVariables[props.variable].calculationTime && dataLength === 0 ? (
                    <CalculatingIndicator variable={props.variable} />
                ) : container === "chart" ? (
                    <LineChart variable={props.variable} />
                ) : (
                    <Numeric variable={props.variable} />
                )}
            </>
        </ContainerCard>
    );
}
