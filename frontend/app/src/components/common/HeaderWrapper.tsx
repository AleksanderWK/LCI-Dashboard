import React from "react";
import {createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import Logo from "./Logo";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            width: "100%",
            height: "86px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 30
        },
        sessionInfo: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },
        infoBar: {
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "min-content",
            gap: theme.spacing(3),
            marginTop: theme.spacing(1)
        },
        buttonGroup: {
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "auto",
            gridTemplateRows: "50px",
            alignContent: "center",
            alignItems: "center",
            gap: theme.spacing(1)
        }
    })
);

interface Props {
    title: string | undefined;
    infoBar: JSX.Element;
    buttonGroup: JSX.Element;
}

/**
 * A header wrapper component containing the logo, a title, an info bar and buttons
 * @param {object} props - Component props
 * @param {string | undefined} props.title - Title
 * @param {JSX.Element} props.infoBar - An element containing InfoItem components to be rendered under the title
 * @param {JSX.Element} props.buttonGroup - An element containing buttons to be rendered to the right
 */
export default function HeaderWrapper(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.header}>
            <Logo />

            <div className={classes.sessionInfo}>
                <Typography variant="h1" noWrap>
                    {props.title}
                </Typography>

                <div className={classes.infoBar}>{props.infoBar}</div>
            </div>

            <div className={classes.buttonGroup}>{props.buttonGroup}</div>
        </div>
    );
}
