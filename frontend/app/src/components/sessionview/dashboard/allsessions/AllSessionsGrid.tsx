import {createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {useRecoilValue} from "recoil";
import {selectedSessionActiveContainersState} from "../../../../state/dashboard";
import Container from "./Container";

const useStyles = makeStyles(() =>
    createStyles({
        grid: {
            display: "grid",
            width: "100%",
            gridAutoColumns: "1fr",
            gridAutoFlow: "column",
            gap: 10
        }
    })
);

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
