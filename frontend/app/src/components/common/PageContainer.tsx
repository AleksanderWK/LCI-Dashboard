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
            gridTemplateRows: "1fr",
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

interface ContainerProps {
    children: JSX.Element;
}

/**
 * A container that expands to 100% width and height and adds padding
 * @param {object} props - Component props
 * @param {JSX.Element} props.children - The children to be wrapped in the container
 */
function Container(props: ContainerProps): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.pageContainer}>
            <div className={classes.pageContent}>{props.children}</div>
        </div>
    );
}

interface PageContainerProps {
    children: JSX.Element;
    menu?: JSX.Element;
    footer?: JSX.Element;
}

/**
 * A page container component that renderes a container with either a menu, footer or nothing
 * @param {object} props - Component props
 * @param {JSX.Element} props.children - The children to be wrapped in the container
 * @param {JSX.Element?} props.menu - The menu component of the page
 * @param {JSX.Element?} props.footer - The footer component of the page
 */
export default function PageContainer(props: PageContainerProps): JSX.Element {
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
