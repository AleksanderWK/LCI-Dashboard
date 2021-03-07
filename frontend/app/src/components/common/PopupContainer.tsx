import React from "react";
import {Backdrop, Card, CardContent, createStyles, makeStyles, Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            alignItems: "center",
            overflowY: "auto",
            zIndex: 20
        },
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
    open: boolean;
    onClose: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function PopupContainer(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <Backdrop
            className={classes.backdrop}
            open={props.open}
            onClick={(e) => {
                props.onClose(e);
            }}
        >
            <Card className={classes.card} onClick={(e) => e.stopPropagation()}>
                <CardContent className={classes.cardContent}>{props.children}</CardContent>
            </Card>
        </Backdrop>
    );
}
