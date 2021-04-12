import {Variable} from "../../../constants";
import {createStyles, makeStyles, Typography} from "@material-ui/core";
import Container from "./Container";
import React from "react";
import {useRecoilValue} from "recoil";
import {selectedRecordingActiveContainersState} from "../../../state/recordedSession";

const useStyles = makeStyles(() =>
    createStyles({
        dashboard: {
            position: "relative",
            width: "100%",
            padding: "30px 0",
            boxSizing: "border-box",

            // Temporary grid
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gridAutoRows: "200px",
            gap: 40
        }
    })
);

function Dashboard(): JSX.Element {
    const classes = useStyles();

    const activeContainers = useRecoilValue(selectedRecordingActiveContainersState);

    return (
        <div className={classes.dashboard}>
            {Object.values(Variable).every((variable) => activeContainers[variable] === false) && (
                <Typography>No charts added</Typography>
            )}
            {Object.values(Variable)
                .filter((variable) => activeContainers[variable])
                .map((variable) => {
                    return <Container key={variable} variable={variable} />;
                })}
        </div>
    );
}

export default Dashboard;
