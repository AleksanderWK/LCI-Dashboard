import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import {useRecoilState, useSetRecoilState} from "recoil";
import {selectedSessionRecordingState} from "../../state/session";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {useInterval} from "../../utils/useInterval";
import {duration} from "../../utils/duration";
import {snackOpenState} from "../../state/popup";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            height: 35,
            color: theme.palette.text.default,
            marginRight: 12
        }
    })
);

export default function RecordingButton(): JSX.Element {
    const classes = useStyles();

    const [recording, setRecording] = useRecoilState(selectedSessionRecordingState);
    const [dur, setDuration] = useState<string>("0:00:00");
    const setSnackOpen = useSetRecoilState(snackOpenState);

    useEffect(() => {
        if (recording.status && recording.startTime) {
            setDuration(duration(recording.startTime.getTime(), undefined, 1));
        }
    }, [recording]);

    useInterval(
        () => {
            if (recording.startTime) {
                setDuration(duration(recording.startTime.getTime(), undefined, 1));
            }
        },
        recording.status ? 1000 : null
    );

    function handleStartRecordingClick(): void {
        const startTime = new Date();
        setRecording((prevVal) => ({
            status: true,
            startTime: startTime,
            recordingId: prevVal.recordingId !== null ? prevVal.recordingId + 1 : 0
        }));
    }

    function handleStopRecordingClick(): void {
        setSnackOpen(true);
        setRecording((prevVal) => ({...prevVal, status: false, startTime: null}));
        setTimeout(() => {
            setSnackOpen(false);
        }, 3000);
    }

    useEffect(() => {
        if (!recording.status) {
            setDuration("0:00:00");
        }
    }, [recording]);

    if (!recording.status) {
        return (
            <Button
                variant="contained"
                className={classes.button}
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={() => {
                    handleStartRecordingClick();
                }}
            >
                Start recording
            </Button>
        );
    } else {
        return (
            <Button
                variant="contained"
                className={classes.button}
                color="primary"
                startIcon={<StopIcon />}
                onClick={() => {
                    handleStopRecordingClick();
                }}
            >
                Stop recording ({dur})
            </Button>
        );
    }
}
