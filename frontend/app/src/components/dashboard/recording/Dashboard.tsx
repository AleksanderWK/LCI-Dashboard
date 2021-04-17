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
        },
        feedback: {
            position: "relative",
            margin: "30px 0",
            width: "100%",
            height: "calc(100% - 86px - 30px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    })
);

function Dashboard(): JSX.Element {
    const classes = useStyles();

    const selectedRecordingActiveContainers = useRecoilValue(selectedRecordingActiveContainersState);

    return selectedRecordingActiveContainers.length == 0 ? (
        <div className={classes.feedback}>
            <Typography>No variables selected</Typography>
        </div>
    ) : (
        <div className={classes.dashboard}>
            {selectedRecordingActiveContainers.map((variable) => {
                return <Container key={variable} variable={variable} />;
            })}
        </div>
    );
}

export default Dashboard;
