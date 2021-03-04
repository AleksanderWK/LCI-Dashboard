import React from "react";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import {useRecoilState} from "recoil";
import {selectedStudentRecordingState} from "../../state/recording/recordingAtoms";

export default function RecordingButton(): JSX.Element {
    const [isRecording, setIsRecording] = useRecoilState(selectedStudentRecordingState);

    function handleStartRecordingClick(): void {
        //ADD START SIGNAL
        setIsRecording(true);
    }

    function handleStopRecordingClick(): void {
        //ADD STOP SIGNAL
        setIsRecording(false);
    }

    if (!isRecording) {
        return (
            <Button
                variant="contained"
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
                color="primary"
                startIcon={<StopIcon />}
                onClick={() => {
                    handleStopRecordingClick();
                }}
            >
                Stop recording
            </Button>
        );
    }
}
