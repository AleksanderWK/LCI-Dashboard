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
import {useRecoilState, useRecoilValue} from "recoil";
import {selectedSessionActiveContainersState, selectedSessionDataLengthVariableState} from "../../../state/session";

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
        drag: {}
    })
);

interface Props {
    variable: Variable;
    display: "line" | "numeric";
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    const dataLength = useRecoilValue(selectedSessionDataLengthVariableState(props.variable));

    const [containerOptions, setContainerOptions] = useRecoilState(selectedSessionActiveContainersState);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const menuAnchorElement = useRef<HTMLDivElement | null>(null);

    function setChartType(chartType: "line" | "numeric"): void {
        const newContainerOptions = {...containerOptions};
        newContainerOptions[props.variable] = {...containerOptions[props.variable], display: chartType};
        setContainerOptions(newContainerOptions);
    }

    function removeView(): void {
        const newContainerOptions = {...containerOptions};
        newContainerOptions[props.variable] = {...containerOptions[props.variable], active: false};
        setContainerOptions(newContainerOptions);
    }

    return (
        <ContainerCard>
            <>
                <div className={classes.header}>
                    <Typography variant="h2" noWrap={true}>
                        {MMDVariables[props.variable].name}
                    </Typography>

                    <div className={`${classes.menu} ${"noDrag"}`} ref={menuAnchorElement}>
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
                        isDetailedView={containerOptions[props.variable].display === "line"}
                        onShowMore={() => setChartType("line")}
                        onShowLess={() => setChartType("numeric")}
                        onRemoveView={() => removeView()}
                        onMenuClose={() => setMenuOpen(false)}
                    />
                </div>
                <div className={`${"noDrag"}`}>
                    {MMDVariables[props.variable].calculationTime && dataLength === 0 ? (
                        <CalculatingIndicator variable={props.variable} />
                    ) : containerOptions[props.variable].display === "line" ? (
                        <LineChart variable={props.variable} />
                    ) : (
                        <Numeric variable={props.variable} />
                    )}
                </div>
            </>
        </ContainerCard>
    );
}
