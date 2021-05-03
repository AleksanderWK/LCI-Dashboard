import React from "react";
import {createStyles, makeStyles, Theme, Typography, Button, CardActions} from "@material-ui/core";
import {useRecoilCallback, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {quitSessionPopupOpenState} from "../../state/popup";
import {
    allSessionsRecordingState,
    selectedSessionIdState,
    selectedSessionRecordingState,
    selectedSessionState,
    sessionDataState,
    sessionESEXRangeDataState,
    sessionIdsState,
    sessionRecordingState,
    sessionsState
} from "../../state/session";
import {useHistory} from "react-router-dom";
import {ipcSend} from "../../ipc";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grid: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18
        },
        btn: {
            color: theme.palette.text.default
        },
        btnGroup: {
            marginLeft: "auto"
        },
        cardContent: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "210px"
        }
    })
);

/**
 * A component notifying and asking for confirmation that one or more sessions are going to be quitted.
 */
export default function QuitSesson(): JSX.Element {
    const classes = useStyles();

    const history = useHistory();

    const setPopupOpen = useSetRecoilState(quitSessionPopupOpenState);
    const recording = useRecoilValue(selectedSessionRecordingState);

    const selectedSession = useRecoilValue(selectedSessionState);
    const sessions = useRecoilValue(sessionsState);

    const selectedSessionId = useRecoilValue(selectedSessionIdState);
    const allSessions = useRecoilValue(sessionIdsState);
    const resetSessionIds = useResetRecoilState(sessionIdsState);

    const allSessionsRecording = useRecoilValue(allSessionsRecordingState);

    /**
     * Stops recording, closes popup, sets session end time, terminates session and goes to the StartView
     */
    const quitSession = () => {
        setPopupOpen(false);

        if (selectedSession) {
            ipcSend("updateSessionEndTime", {
                _id: selectedSession._id,
                timestamp: new Date().getTime()
            });

            removeSession(selectedSession._id);
        }
    };

    /**
     * Remove session from application state
     */
    const removeSession = useRecoilCallback(({set, reset}) => (sessionId: number) => {
        // Remove this sessionId from the sessionIdsState
        set(sessionIdsState, (prevValue) => {
            const newValue: number[] = [...prevValue];
            newValue.splice(newValue.indexOf(sessionId), 1);
            return newValue;
        });

        // If there are more sessions, set the selectedSessionId to some of them, else go to StartView
        if (sessions.length > 1) {
            set(selectedSessionIdState, sessions.find((session) => session._id != sessionId)?._id as number | null);
        } else {
            history.push("/");
            reset(selectedSessionIdState);
        }

        reset(sessionDataState(sessionId));
        reset(sessionESEXRangeDataState(sessionId));
        reset(sessionRecordingState(sessionId));

        // Send terminate signal to the backend with this sessionId
        ipcSend("terminateSession", sessions.find((session) => session._id == sessionId)?.sessionCode);
    });

    /**
     * Quits all live sessions and goes to the StartView
     */
    const quitAllSessions = () => {
        resetAllSessionsData();
        allSessions.forEach((id) => {
            ipcSend("updateSessionEndTime", {
                _id: id,
                timestamp: new Date().getTime()
            });
        });
        removeAllSessions();
        setPopupOpen(false);

        // Navigate to the StartView
        history.push("/");
    };

    /**
     * Reset all session related state
     */
    const resetAllSessionsData = useRecoilCallback(({reset}) => () => {
        allSessions.forEach((id) => {
            reset(sessionDataState(id));
            reset(sessionESEXRangeDataState(id));
            reset(sessionRecordingState(id));
        });
    });

    /**
     * Terminate and remove all sessions
     */
    const removeAllSessions = () => {
        // For each session id send a terminate message to the backend with that id's session code
        allSessions.forEach((id) => {
            ipcSend("terminateSession", sessions.find((session) => session._id == id)?.sessionCode);
        });

        // Set the list of session ids back to default (an empty list)
        resetSessionIds();
    };

    return (
        <div className={classes.grid}>
            <Typography variant="h1">
                Quit {selectedSessionId == null && "All"} Session{selectedSessionId == null && "s"}
            </Typography>
            <div>
                <Typography>
                    {selectedSessionId == null
                        ? "Are you sure you want to quit all the sessions?"
                        : `Are you sure you want to quit ${selectedSession?.sessionName} with ${selectedSession?.studentName}?`}
                </Typography>

                {recording.status && (
                    <>
                        <br />
                        <Typography>This will also stop the ongoing recording.</Typography>
                    </>
                )}
                {selectedSessionId == null && allSessionsRecording.some((rec) => rec.status) && (
                    <>
                        <br />
                        <Typography>This will also stop all the ongoing recordings.</Typography>
                    </>
                )}
            </div>
            <CardActions className={classes.btnGroup}>
                <Button
                    className={classes.btn}
                    onClick={() => {
                        setPopupOpen(false);
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={selectedSessionId == null ? quitAllSessions : quitSession}
                    className={classes.btn}
                >
                    Quit session{selectedSessionId == null && "s"}
                </Button>
            </CardActions>
        </div>
    );
}
