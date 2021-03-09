import React from "react";
import {Backdrop, createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        backdrop: {
            alignItems: "center",
            overflowY: "auto",
            zIndex: 20
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
            {props.children}
        </Backdrop>
    );
}
