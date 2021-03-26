import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import {useRecoilState, useSetRecoilState} from "recoil";
import {selectedSessionRecordingState, snackOpenState} from "../../state/session";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {useInterval} from "../../utils";

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
    const [duration, setDuration] = useState<string>("0:00:00");
    const setSnackOpen = useSetRecoilState(snackOpenState);

    useEffect(() => {
        if (recording.status) {
            calculateDuration();
        }
    }, [recording]);

    useInterval(
        () => {
            calculateDuration();
        },
        recording.status ? 1000 : null
    );

    function calculateDuration() {
        if (recording.startTime) {
            const d = new Date().getTime();
            let distance = d - recording.startTime.getTime();
            const hours = Math.floor(distance / 3600000);
            distance -= hours * 3600000;
            const minutes = Math.floor(distance / 60000);
            distance -= minutes * 60000;
            const seconds = Math.floor(distance / 1000);
            setDuration(`${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`);
        }
    }

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
                Stop recording ({duration})
            </Button>
        );
    }
}
