import {useRef, useState} from "react";
import {createStyles, IconButton, makeStyles, Theme, Typography} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {MMDVariables, Variable} from "../../../constants";
import Tooltip from "../../common/Tooltip";
import Menu from "./Menu";
import LineChart from "./LineChart";
import ContainerCard from "../../common/ContainerCard";
import XRangeChart from "./XRangeChart";
import {
    selectedRecordedSessionLayoutState,
    selectedRecordingActiveContainersState
} from "../../../state/recordedSession";
import {useSetRecoilState} from "recoil";

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

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const menuAnchorElement = useRef<HTMLDivElement | null>(null);

    const setSelectedRecordingActiveContainers = useSetRecoilState(selectedRecordingActiveContainersState);
    const setSelectedRecordingLayout = useSetRecoilState(selectedRecordedSessionLayoutState);

    function removeContainer(): void {
        setSelectedRecordingActiveContainers((prevState) => {
            const newState = [...prevState];
            return newState.filter((item) => item != props.variable);
        });

        // Remove from layout
        setSelectedRecordingLayout((prevValue) => {
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
                        onRemoveView={() => removeContainer()}
                        onMenuClose={() => setMenuOpen(false)}
                    />
                </div>
                {props.variable == Variable.EducationalSpecificEmotions ? (
                    <XRangeChart variable={props.variable} />
                ) : (
                    <LineChart variable={props.variable} />
                )}
            </>
        </ContainerCard>
    );
}
