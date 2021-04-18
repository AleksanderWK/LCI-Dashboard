import {createStyles, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {useRecoilValue} from "recoil";
import {selectedSessionActiveContainersState} from "../../../state/dashboard";
import {selectedSessionIdState} from "../../../state/session";
import AllSessionsGrid from "./allsessions/AllSessionsGrid";
import SessionGrid from "./session/SessionGrid";

const useStyles = makeStyles(() =>
    createStyles({
        dashboard: {
            position: "relative",
            width: "100%",
            padding: "30px 0",
            boxSizing: "border-box"
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

    const selectedSessionId = useRecoilValue(selectedSessionIdState);
    const selectedSessionActiveContainers = useRecoilValue(selectedSessionActiveContainersState);

    return selectedSessionActiveContainers.length == 0 ? (
        <div className={classes.feedback}>
            <Typography>No variables selected</Typography>
        </div>
    ) : (
        <div className={classes.dashboard}>{selectedSessionId != null ? <SessionGrid /> : <AllSessionsGrid />}</div>
    );
}

export default Dashboard;
