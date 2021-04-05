import React from "react";
import {createStyles, makeStyles, Theme, Tooltip as MUITooltip, Typography} from "@material-ui/core";
import {Device, Variable} from "../../constants";
import {MMDVariables} from "../../constants";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import WatchIcon from "@material-ui/icons/Watch";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import FaceIcon from "@material-ui/icons/Face";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tooltip: {
            maxWidth: "200px",
            padding: theme.spacing(1)
        },
        description: {
            display: "block",
            marginBottom: theme.spacing(1)
        },
        icon: {
            width: "16px",
            height: "16px",
            verticalAlign: "text-bottom",
            marginRight: theme.spacing(1),
            marginTop: "4px"
        },
        device: {
            color: theme.palette.primary.main
        }
    })
);

interface IconProps {
    device: Device;
    color?: string;
}

export function Icon(props: IconProps): JSX.Element {
    const classes = useStyles();

    switch (props.device) {
        case Device.EyeTracker:
            return <VisibilityOutlinedIcon className={classes.icon} style={{color: props.color}} />;
        case Device.Wristband:
            return <WatchIcon className={classes.icon} style={{color: props.color}} />;
        case Device.VideoBody:
            return <AccessibilityNewIcon className={classes.icon} style={{color: props.color}} />;
        default:
            return <FaceIcon className={classes.icon} style={{color: props.color}} />;
    }
}

interface Props {
    children: JSX.Element;
    variable: Variable;
}

export default function Tooltip(props: Props): JSX.Element {
    const classes = useStyles();

    const variableInfo = MMDVariables[props.variable];

    return (
        <MUITooltip
            classes={{tooltip: classes.tooltip}}
            title={
                <div>
                    <Typography variant="caption" className={classes.description}>
                        {variableInfo.description}
                    </Typography>
                    <Typography variant="caption">
                        <Icon device={variableInfo.device} />
                        Derived from <span className={classes.device}>{variableInfo.device.toLowerCase()}</span>
                    </Typography>
                </div>
            }
            arrow={true}
        >
            {props.children}
        </MUITooltip>
    );
}
