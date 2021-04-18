import React from "react";
import ReactDOM from "react-dom";
import {RecoilRoot} from "recoil";
import Header from "../Header";
import {
    selectedSessionIdState,
    Session,
    sessionIdsState,
    sessionRecordingState,
    sessionState
} from "../../../state/session";
import {studentsState} from "../../../state/student";
import {EyeTrackingDevice} from "../../../constants";

const testSessionIds = [1, 2];

const testStudents = [
    {_id: "1", name: "John Doe"},
    {_id: "2", name: "Jane Smith"}
];

const testSessions: {[key: number]: Session} = {
    1: {
        _id: 1,
        sessionName: "Test1",
        studentId: "1",
        studentName: "John Doe",
        eyeTrackingDevice: EyeTrackingDevice.Mobile,
        startTime: 0,
        endTime: 100,
        sessionCode: "abc"
    },
    2: {
        _id: 2,
        sessionName: "Test2",
        studentId: "2",
        studentName: "Jane Smith",
        eyeTrackingDevice: EyeTrackingDevice.Stationary,
        startTime: 200,
        endTime: 300,
        sessionCode: "def"
    }
};

const testSelectedSessionId = 1;

const testRecording = {
    1: {status: false, startTime: null, recordingId: 0},
    2: {status: true, startTime: new Date(), recordingId: 0}
};

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(sessionIdsState, testSessionIds);
                snap.set(studentsState, testStudents);
                snap.set(sessionState(1), testSessions[1]);
                snap.set(sessionState(2), testSessions[2]);
                snap.set(selectedSessionIdState, testSelectedSessionId);
                snap.set(sessionRecordingState(1), testRecording[1]);
                snap.set(sessionRecordingState(2), testRecording[2]);
            }}
        >
            <Header />
        </RecoilRoot>,
        div
    );
});

// Snapshot test not possible due to duration of mocked session will always be different (since current date is used)
/*
it("Header matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(sessionIdsState, testSessionIds);
                snap.set(studentsState, testStudents);
                snap.set(sessionState(1), testSessions[1]);
                snap.set(sessionState(2), testSessions[2]);
                snap.set(selectedSessionIdState, testSelectedSessionId);
                snap.set(sessionRecordingState(1), testRecording[1]);
                snap.set(sessionRecordingState(2), testRecording[2]);
            }}
        >
            <Header />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});
*/
