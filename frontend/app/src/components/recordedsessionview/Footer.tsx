import React from "react";
import {makeStyles, createStyles, Theme} from "@material-ui/core";
import IntervalSlider from "./IntervalSlider";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menu: {
            position: "relative",
            height: "75px",
            boxSizing: "border-box",
            width: "100%",
            backgroundColor: theme.palette.background.default,
            boxShadow: "2px 0px 10px 0px rgba(0,0,0,0.25)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    })
);

/**
 * The footer of the recorded session view.
 * Displays an interval slider.
 */
export default function Footer(): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.menu}>
            <IntervalSlider />
        </div>
    );
}
