import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import {useRecoilState} from "recoil";
import {selectedSessionRecordingState} from "../../state/session";
import {createStyles, makeStyles, Theme} from "@material-ui/core";

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
    const [interval, setRecordingInterval] = useState<NodeJS.Timeout>();

    function handleStartRecordingClick(): void {
        const startTime = new Date();
        setRecording({status: true, startTime: startTime});

        const interval = setInterval(() => {
            const d = new Date().getTime();
            let distance = d - startTime.getTime();
            const hours = Math.floor(distance / 3600000);
            distance -= hours * 3600000;
            const minutes = Math.floor(distance / 60000);
            distance -= minutes * 60000;
            const seconds = Math.floor(distance / 1000);
            setDuration(`${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`);
        }, 1000);

        setRecordingInterval(interval);
    }

    function handleStopRecordingClick(): void {
        setRecording({status: false, startTime: null});
    }

    useEffect(() => {
        if (!recording.status) {
            if (interval) {
                clearInterval(interval);
                setDuration("0:00:00");
            }
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
