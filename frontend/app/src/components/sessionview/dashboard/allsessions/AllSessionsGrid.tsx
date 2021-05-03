import {createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {useRecoilValue} from "recoil";
import {selectedSessionActiveContainersState} from "../../../../state/dashboard";
import Container from "./Container";

const useStyles = makeStyles(() =>
    createStyles({
        grid: {
            position: "relative",
            display: "grid",
            width: "100%",
            gridAutoColumns: "1fr",
            gridAutoFlow: "column",
            gap: 10
        }
    })
);

/**
 * The grid layout for the all sessions view.
 * Renders each variable/container in its own column.
 */
export default function AllSessionsGrid(): JSX.Element {
    const classes = useStyles();

    const selectedSessionActiveContainers = useRecoilValue(selectedSessionActiveContainersState);

    return (
        <div className={classes.grid}>
            {selectedSessionActiveContainers.map((variable) => (
                <Container key={variable} variable={variable} />
            ))}
        </div>
    );
}
