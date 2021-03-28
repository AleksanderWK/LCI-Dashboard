import React, {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import Header from "../components/recordedsessionview/Header";
import {ipcInvoke} from "../ipc";
import {selectedRecordedSessionIdState, RecordedSession, recordedSessionState} from "../state/recordedSession";
import Footer from "../components/recordedsessionview/Footer";
import Dashboard from "../components/dashboard/recording/Dashboard";
import PageContainer from "../components/common/PageContainer";

export default function RecordedSessionView(): JSX.Element {
    const recordedSessionId = useRecoilValue(selectedRecordedSessionIdState);
    const setRecordedSession = useSetRecoilState(recordedSessionState);

    useEffect(() => {
        if (recordedSessionId) {
            ipcInvoke("getSessionRecording", recordedSessionId).then((session) => {
                setRecordedSession(session as RecordedSession);
            });
        }
    }, [recordedSessionId]);

    return (
        <>
            <PageContainer footer={<Footer />}>
                <>
                    <Header />
                    <Dashboard />
                </>
            </PageContainer>
        </>
    );
}
