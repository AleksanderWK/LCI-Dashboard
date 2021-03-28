import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Typography, IconButton, Theme} from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";
import RecordingButton from "./RecordingButton";
import {selectedSessionState} from "../../state/session";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {quitSessionPopupOpenState} from "../../state/popup";
import HeaderWrapper from "../common/HeaderWrapper";
import InfoItem from "../common/InfoItem";
import {AddChartIcon, CloseIcon} from "../common/Icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        indicatorContainer: {
            display: "grid",
            gridTemplateColumns: "8px max-content",
            gap: theme.spacing(1)
        },
        indicatorIcon: {
            alignSelf: "center",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#7BAF62"
        }
    })
);

export default function Header(): JSX.Element {
    const classes = useStyles();

    const setQuitSessionPopupOpen = useSetRecoilState(quitSessionPopupOpenState);

    const selectedSessionInfo = useRecoilValue(selectedSessionState);
    const [duration, setDuration] = useState<string>("");

    useEffect(() => {
        // Set the current duration initially when the compnent loads
        setCurrentDuration();

        // Interval that updates the duration state every second
        let intervalId: NodeJS.Timeout | null = null;
        intervalId = setInterval(() => {
            setCurrentDuration();
        }, 1000);

        return function cleanup() {
            if (intervalId) clearInterval(intervalId);
        };
    }, [selectedSessionInfo, setCurrentDuration]);

    // This function finds the current duration based on startTime in selectedSessionInfo and by using the current time
    function setCurrentDuration() {
        if (selectedSessionInfo) {
            const d = new Date().getTime();
            let distance = d - selectedSessionInfo.startTime;
            const hours = Math.floor(distance / 3600000);
            distance -= hours * 3600000;
            const minutes = Math.floor(distance / 60000);
            distance -= minutes * 60000;
            const seconds = Math.floor(distance / 1000);
            setDuration(`${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`);
        }
    }

    return (
        <>
            {selectedSessionInfo && (
                <HeaderWrapper
                    title={selectedSessionInfo.sessionName}
                    infoBar={
                        <>
                            <div className={classes.indicatorContainer}>
                                <div className={classes.indicatorIcon}></div>
                                <Typography>{selectedSessionInfo.student.name}</Typography>
                            </div>
                            <InfoItem icon={<TimerIcon />} text={duration} />
                        </>
                    }
                    buttonGroup={
                        <>
                            <RecordingButton />
                            <IconButton aria-label="add new chart">
                                <AddChartIcon />
                            </IconButton>
                            <IconButton
                                aria-label="quit student session"
                                onClick={() => {
                                    setQuitSessionPopupOpen(true);
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                />
            )}
        </>
    );
}
