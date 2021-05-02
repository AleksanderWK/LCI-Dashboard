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

/**
 * A container for displaying popups and adding a backdrop behind the popups
 * @param {object} props - Component props
 * @param {JSX.Element} props.children - The popup
 * @param {boolean} props.open - Whether the popup is visible or not
 * @param {(e: React.MouseEvent<HTMLElement>) => void} props.onClose - Callback function called
 * when clicking on the backdrop
 */
export default function PopupContainer(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <Backdrop
            className={classes.backdrop}
            open={props.open}
            onClick={(e) => {
                // Close popup when backdrop is clicked
                props.onClose(e);
            }}
        >
            {props.children}
        </Backdrop>
    );
}
