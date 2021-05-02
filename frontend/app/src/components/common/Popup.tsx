import React from "react";
import {Card, CardContent, createStyles, makeStyles, Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            backgroundColor: theme.palette.background.default
        },
        cardContent: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: theme.spacing(4),
            width: 322
        }
    })
);

interface Props {
    children: JSX.Element;
}

/**
 * A popup wrapper component
 * @param {object} props - Component props
 * @param {JSX.Element} props.children - The content of the popup
 */
export default function Popup(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <Card className={classes.card} onClick={(e) => e.stopPropagation()}>
            <CardContent className={classes.cardContent}>{props.children}</CardContent>
        </Card>
    );
}
