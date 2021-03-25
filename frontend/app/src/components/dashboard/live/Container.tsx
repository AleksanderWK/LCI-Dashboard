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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            display: "grid",
            gridTemplateColumns: "1fr 56px",
            gap: theme.spacing(2),
            marginBottom: theme.spacing(2)
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
    display: string;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    const [isDetailedView, setIsDetailedView] = useState<boolean>(props.display == "line");

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const menuAnchorElement = useRef<HTMLDivElement | null>(null);

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
                        isDetailedView={isDetailedView}
                        onShowMore={() => setIsDetailedView(true)}
                        onShowLess={() => setIsDetailedView(false)}
                        onRemoveView={() => null}
                        onMenuClose={() => setMenuOpen(false)}
                    />
                </div>

                {isDetailedView ? <LineChart variable={props.variable} /> : <Numeric variable={props.variable} />}
            </>
        </ContainerCard>
    );
}
