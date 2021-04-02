import {Card, CardContent, createStyles, makeStyles, SvgIcon, SvgIconProps, Theme} from "@material-ui/core";
import {useState} from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            width: "100%",
            height: "100%",
            position: "relative"
        },
        content: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto 1fr",
            gap: theme.spacing(2),
            position: "relative",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            "$:hover": {
                cursor: "default"
            }
        }
    })
);

interface Props {
    children: JSX.Element;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.content}>{props.children}</CardContent>
        </Card>
    );
}
