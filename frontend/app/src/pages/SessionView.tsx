import React from "react";
import Container from "../components/dashboard/Container";
import {Variable} from "../constants";
import {createStyles, makeStyles, Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: window.innerHeight,
            display: "grid",
            gridTemplateColumns: "100px 25px auto 25px",
            gridTemplateRows: "125px auto"
        },
        menu: {
            backgroundColor: "grey",
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 5
        },
        header: {
            backgroundColor: "grey",
            gridColumnStart: 2,
            gridColumnEnd: 5,
            gridRowStart: 1,
            gridRowEnd: 2
        },
        dashboard: {
            backgroundColor: "grey",
            gridColumnStart: 3,
            gridColumnEnd: 4,
            gridRowStart: 2,
            gridRowEnd: 5
        }
    })
);

export default function SessionView(): JSX.Element {
    const classes = useStyles();
    return (
        <div className={classes.pageContainer}>
            <div className={classes.menu}>menu space</div>
            <div className={classes.header}>header space</div>
            <div className={classes.dashboard}>dashboard space</div>
        </div>
    );
}
