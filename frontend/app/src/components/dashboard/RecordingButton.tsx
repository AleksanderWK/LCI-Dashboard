import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";

export default function RecordingButton(): JSX.Element {
    const [isRecording, setIsRecording] = useState<boolean>(false);

    function handleStartRecordingClick(): void {
        //ADD START SIGNAL
        setIsRecording(true);
    }

    function handleStopRecordingClick(): void {
        //ADD STOP SIGNAL
        setIsRecording(false);
    }

    return (
        <div>
            {!isRecording ? (
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
            ) : (
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
            )}
        </div>
    );
}
