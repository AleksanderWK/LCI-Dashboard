import React from "react";
import {createStyles, makeStyles, Theme, Typography, Button, CardActions} from "@material-ui/core";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {quitSessionPopupOpenState} from "../../state/popup";
import {selectedSessionRecordingState, selectedSessionState} from "../../state/session";
import {useHistory} from "react-router-dom";

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

export default function QuitSesson(): JSX.Element {
    const classes = useStyles();

    const history = useHistory();

    const setPopupOpen = useSetRecoilState(quitSessionPopupOpenState);
    const [recording, setRecording] = useRecoilState(selectedSessionRecordingState);

    const selectedSession = useRecoilValue(selectedSessionState);

    // Stops recording, closes popup, terminates session and goes to the startview
    const quitSession = () => {
        setRecording({status: false, startTime: null, recordingId: null});
        setPopupOpen(false);

        // TERMINATE SESSION HERE

        history.push("/");
    };

    return (
        <div className={classes.grid}>
            <Typography variant="h1">Quit Session</Typography>
            <div>
                <Typography>
                    Are you sure you want to quit <i>{selectedSession?.sessionName}</i> with{" "}
                    <i>{selectedSession?.student.name}</i>?
                </Typography>

                {recording.status && (
                    <>
                        <br />
                        <Typography>This will also stop the ongoing recording.</Typography>
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

                <Button variant="contained" color="primary" onClick={quitSession} className={classes.btn}>
                    Quit session
                </Button>
            </CardActions>
        </div>
    );
}
