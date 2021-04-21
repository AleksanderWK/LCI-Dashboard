import {createStyles, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {useRecoilValue} from "recoil";
import {selectedSessionActiveContainersState} from "../../../state/dashboard";
import {selectedSessionIdState} from "../../../state/session";
import {AddChartIcon} from "../../common/Icons";
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        },
        icon: {
            margin: "0 3px 0 2px",
            width: "18px",
            height: "18px",
            transform: "translate(0, 2px)"
        }
    })
);

function Dashboard(): JSX.Element {
    const classes = useStyles();

    const selectedSessionId = useRecoilValue(selectedSessionIdState);
    const selectedSessionActiveContainers = useRecoilValue(selectedSessionActiveContainersState);

    return selectedSessionActiveContainers.length == 0 ? (
        <div className={classes.feedback}>
            <Typography align="center" color="textSecondary" gutterBottom>
                No variables selected.
            </Typography>
            <Typography align="center" color="textSecondary">
                Click on <AddChartIcon className={classes.icon} htmlColor="#FFFFFF" /> to select variables.
            </Typography>
        </div>
    ) : (
        <div className={classes.dashboard}>{selectedSessionId != null ? <SessionGrid /> : <AllSessionsGrid />}</div>
    );
}

export default Dashboard;
