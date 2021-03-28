import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        pageContainer: {
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "30px",
            boxSizing: "border-box"
        },
        pageContent: {
            position: "relative",
            width: "100%",
            height: "100%"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "100px auto",
            position: "relative",
            width: "100%",
            height: "100%"
        }
    })
);

interface Props {
    children: JSX.Element;
    menu?: JSX.Element;
}

function Container(props: {children: JSX.Element}): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.pageContainer}>
            <div className={classes.pageContent}>{props.children}</div>
        </div>
    );
}

export default function PageContainer(props: Props): JSX.Element {
    const classes = useStyles();

    if (props.menu) {
        return (
            <div className={classes.grid}>
                {props.menu}
                <Container>{props.children}</Container>
            </div>
        );
    }

    return <Container>{props.children}</Container>;
}
