import React from "react";
import {
    Card,
    CardContent,
    createStyles,
    IconButton,
    makeStyles,
    SvgIcon,
    SvgIconProps,
    Theme,
    Typography
} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Variable} from "../../constants";
import InfoTooltip from "./InfoTooltip";

function ResizeIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props}>
            <path d="M24 24H19.2V19.2H24V24ZM24 14.4H19.2V9.6H24V14.4ZM14.4 24H9.6V19.2H14.4V24ZM14.4 14.4H9.6V9.6H14.4V14.4ZM4.8 24H0V19.2H4.8V24ZM24 4.8H19.2V0H24V4.8Z" />
        </SvgIcon>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            position: "relative"
        },
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
        resizeIcon: {
            position: "absolute",
            right: "4px",
            bottom: "4px",
            width: "10px",
            height: "10px",
            "&:hover": {
                cursor: "nw-resize"
            }
        }
    })
);

interface Props {
    variable: Variable;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent>
                <div className={classes.header}>
                    <Typography variant="h2" noWrap={true}>
                        {props.variable}
                    </Typography>
                    <div className={classes.menu}>
                        <InfoTooltip variable={props.variable}>
                            <InfoOutlinedIcon color="action" />
                        </InfoTooltip>
                        <IconButton aria-label="settings" className={classes.iconButton}>
                            <MoreVertIcon color="action" />
                        </IconButton>
                    </div>
                </div>

                {/* Insert chart/value component here */}
            </CardContent>
            <ResizeIcon className={classes.resizeIcon} color="action" />
        </Card>
    );
}
