import React from "react";
import ReactDOM from "react-dom";
import {RecoilRoot} from "recoil";
import Header from "../Header";
import {EyeTrackingDevice} from "../../../constants";
import {RecordedSessionInfo, recordedSessionInfoState} from "../../../state/recordedSession";

const testRecordedSessionInfo: RecordedSessionInfo = {
    date: "Mar 23 2021",
    duration: "0h 1m 19s",
    eyeTrackingDevice: EyeTrackingDevice.Stationary,
    sessionId: 1,
    sessionName: "Educational Game",
    startTime: "17:07",
    studentId: "iint0vjVPV0Wiv2U",
    studentName: "Aleksander"
};

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(recordedSessionInfoState, testRecordedSessionInfo);
            }}
        >
            <Header />
        </RecoilRoot>,
        div
    );
});
