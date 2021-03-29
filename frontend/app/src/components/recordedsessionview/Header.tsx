import React, {useEffect} from "react";
import {IconButton} from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";
import PersonIcon from "@material-ui/icons/Person";
import EventIcon from "@material-ui/icons/Event";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {
    currentRecordingInterval,
    RecordedSessionInfo,
    recordedSessionInfoState,
    recordedSessionState,
    selectedRecordedSessionIdState
} from "../../state/recordedSession";
import {useHistory} from "react-router";
import {ipcInvoke} from "../../ipc";
import {Session} from "../../state/session";
import {Student} from "../../state/student";
import HeaderWrapper from "../common/HeaderWrapper";
import InfoItem from "../common/InfoItem";
import {AddChartIcon, ExitIcon} from "../common/Icons";
import {StyledTooltipBottom} from "../common/Tooltips";

export default function Header(): JSX.Element {
    const history = useHistory();

    const recordedSessionId = useRecoilValue(selectedRecordedSessionIdState);
    const resetRecordedSessionId = useResetRecoilState(selectedRecordedSessionIdState);
    const [recordedSessionInfo, setRecordedSessionInfo] = useRecoilState(recordedSessionInfoState);
    const resetRecordedSessionInfo = useResetRecoilState(recordedSessionInfoState);
    const resetRecordedSession = useResetRecoilState(recordedSessionState);
    const resetInterval = useResetRecoilState(currentRecordingInterval);

    useEffect(() => {
        if (recordedSessionId) {
            ipcInvoke("getSession", recordedSessionId).then((session) => {
                const sessionInfo = session as Session;
                const studentID = sessionInfo.studentId;

                ipcInvoke("getUserByID", studentID).then((student) => {
                    const studentObj = student as Student;
                    const name = studentObj.name;

                    if (sessionInfo.endTime) {
                        const info: RecordedSessionInfo = {
                            sessionId: sessionInfo._id,
                            sessionName: sessionInfo.sessionName,
                            studentId: sessionInfo.studentId,
                            eyeTrackingDevice: sessionInfo.eyeTrackingDevice,
                            date: new Date(sessionInfo.startTime).toDateString().slice(4),
                            startTime: `${("0" + new Date(sessionInfo.startTime).getHours()).slice(-2)}:${(
                                "0" + new Date(sessionInfo.startTime).getMinutes()
                            ).slice(-2)}`,
                            duration: calcDuration(sessionInfo.startTime, sessionInfo.endTime),
                            studentName: name
                        };

                        setRecordedSessionInfo(info);
                    }
                });
            });
        }
    }, [recordedSessionId]);

    const calcDuration = (start: number, end: number) => {
        let distance = end - start;
        const hours = Math.floor(distance / 3600000);
        distance -= hours * 3600000;
        const minutes = Math.floor(distance / 60000);
        distance -= minutes * 60000;
        const seconds = Math.floor(distance / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <>
            <HeaderWrapper
                title={recordedSessionInfo?.sessionName}
                infoBar={
                    <>
                        <InfoItem icon={<PersonIcon />} text={recordedSessionInfo?.studentName} />
                        <InfoItem icon={<EventIcon />} text={recordedSessionInfo?.date} />
                        <InfoItem icon={<QueryBuilderIcon />} text={recordedSessionInfo?.startTime} />
                        <InfoItem icon={<TimerIcon />} text={recordedSessionInfo?.duration} />
                    </>
                }
                buttonGroup={
                    <>
                        <StyledTooltipBottom title="Select views">
                            <IconButton aria-label="select views">
                                <AddChartIcon />
                            </IconButton>
                        </StyledTooltipBottom>
                        <StyledTooltipBottom title="Exit">
                            <IconButton
                                aria-label="exit recording view"
                                onClick={() => {
                                    resetRecordedSessionId();
                                    resetRecordedSessionInfo();
                                    resetRecordedSession();
                                    resetInterval();
                                    history.push("/");
                                }}
                            >
                                <ExitIcon />
                            </IconButton>
                        </StyledTooltipBottom>
                    </>
                }
            />
        </>
    );
}
