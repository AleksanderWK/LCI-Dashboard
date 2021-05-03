import React, {useEffect} from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import Header from "../components/recordedsessionview/Header";
import {ipcInvoke} from "../ipc";
import {selectedRecordedSessionIdState, RecordedSession, recordedSessionState} from "../state/recordedSession";
import Footer from "../components/recordedsessionview/Footer";
import Dashboard from "../components/recordedsessionview/dashboard/Dashboard";
import PageContainer from "../components/common/PageContainer";
import Popup from "../components/common/Popup";
import PopupContainer from "../components/common/PopupContainer";
import {selectChartsPopupOpenState} from "../state/popup";
import SelectCharts from "../components/recordedsessionview/SelectCharts";

/**
 *  The view for showing a recorded session.
 *  Gets the data stored for the selected session
 *  and renders the header, a dashboard and popups.
 */
export default function RecordedSessionView(): JSX.Element {
    const [selectChartsPopupOpen, setSelectChartsPopupOpen] = useRecoilState(selectChartsPopupOpenState);

    const recordedSessionId = useRecoilValue(selectedRecordedSessionIdState);
    const setRecordedSession = useSetRecoilState(recordedSessionState);

    useEffect(() => {
        if (recordedSessionId) {
            // When a session is selected, get the data stored for that session ID and store it in the state
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
            <PopupContainer
                open={selectChartsPopupOpen}
                onClose={(e) => {
                    if (selectChartsPopupOpen) {
                        e.preventDefault();
                        setSelectChartsPopupOpen(false);
                    }
                }}
            >
                <>
                    {selectChartsPopupOpen ? (
                        <Popup>
                            <SelectCharts />
                        </Popup>
                    ) : null}
                </>
            </PopupContainer>
        </>
    );
}
