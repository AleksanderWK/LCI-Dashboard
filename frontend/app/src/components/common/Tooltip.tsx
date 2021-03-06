import React from "react";
import {createStyles, makeStyles, Theme, Tooltip as MUITooltip, Typography} from "@material-ui/core";
import {Device, Variable} from "../../constants";
import {MMDVariables} from "../../constants";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import WatchIcon from "@material-ui/icons/Watch";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import FaceIcon from "@material-ui/icons/Face";
import {useRecoilValue} from "recoil";
import {selectedSessionIdState} from "../../state/session";

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
            width: "20px",
            height: "20px",
            verticalAlign: "text-bottom",
            marginRight: theme.spacing(1)
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

/**
 * An icon displaying type of device
 * @param {object} props - Component props
 * @param {Device} props.device - The device to display
 * @param {string} props.color - The color of the icon
 */
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

/**
 * A tooltip showing variable information
 * @param {object} props - Component props
 * @param {JSX.Element} props.children - The contents the tooltip applies to
 * @param {Variable} props.variable - The variable the tooltip applies to
 */
export default function Tooltip(props: Props): JSX.Element {
    const classes = useStyles();

    const variableInfo = MMDVariables[props.variable];
    const selectedSession = useRecoilValue(selectedSessionIdState);

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
            placement={selectedSession == null ? "bottom-start" : "bottom"}
        >
            {props.children}
        </MUITooltip>
    );
}
