import {makeStyles, createStyles, Theme} from "@material-ui/core";
import react from "react";
import IntervalSlider from "./IntervalSlider";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menu: {
            position: "fixed",
            bottom: 0,
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

export default function Footer(): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.menu}>
            <IntervalSlider />
        </div>
    );
}
