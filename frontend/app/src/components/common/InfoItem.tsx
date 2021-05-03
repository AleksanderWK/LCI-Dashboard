import React from "react";
import {createStyles, makeStyles, Typography, Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        infoItem: {
            display: "grid",
            gridTemplateColumns: "24px max-content",
            gap: theme.spacing(1)
        },
        icon: {
            color: theme.palette.text.default
        }
    })
);

interface Props {
    icon: JSX.Element;
    text: string | undefined;
}

/**
 * An info item with an icon and text
 * @param {object} props - Component props
 * @param {JSX.Element} props.icon - Icon element
 * @param {string | undefined} props.text - Text
 */
export default function InfoItem(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.infoItem}>
            {React.cloneElement(props.icon, {className: classes.icon})}
            <Typography>{props.text}</Typography>
        </div>
    );
}
