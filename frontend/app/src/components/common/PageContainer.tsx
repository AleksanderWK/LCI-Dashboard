import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        pageContainer: {
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "30px",
            boxSizing: "border-box",
            overflow: "auto"
        },
        pageContent: {
            position: "relative",
            width: "100%",
            height: "100%"
        },
        menuGrid: {
            display: "grid",
            gridTemplateColumns: "100px auto",
            position: "relative",
            height: "100%"
        },
        footerGrid: {
            display: "grid",
            gridTemplateRows: "1fr auto",
            position: "relative",
            width: "100%",
            height: "100%"
        }
    })
);

interface Props {
    children: JSX.Element;
    menu?: JSX.Element;
    footer?: JSX.Element;
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
            <div className={classes.menuGrid}>
                {props.menu}
                <Container>{props.children}</Container>
            </div>
        );
    }

    if (props.footer) {
        return (
            <div className={classes.footerGrid}>
                <Container>{props.children}</Container>
                {props.footer}
            </div>
        );
    }

    return <Container>{props.children}</Container>;
}
