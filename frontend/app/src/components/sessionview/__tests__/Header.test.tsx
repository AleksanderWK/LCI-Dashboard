import React from "react";
import ReactDOM from "react-dom";
import {fireEvent, render, screen} from "@testing-library/react";
import {RecoilRoot} from "recoil";
import Header from "../Header";
import {selectedSessionIdState, sessionIdsState, sessionRecordingState, sessionState} from "../../../state/session";
import {studentsState} from "../../../state/student";
import {EyeTrackingDevice} from "../../../constants";

const testSessionIds = [1, 2];

const testStudents = [
    {_id: "1", name: "John Doe"},
    {_id: "2", name: "Jane Smith"}
];

const testSessions = {
    1: {
        sessionId: 1,
        sessionName: "Test1",
        studentId: "1",
        eyeTrackingDevice: EyeTrackingDevice.Mobile,
        startTime: new Date()
    },
    2: {
        sessionId: 2,
        sessionName: "Test2",
        studentId: "2",
        eyeTrackingDevice: EyeTrackingDevice.Stationary,
        startTime: new Date()
    }
};

const testSelectedSessionId = 1;

const testRecording = {
    1: false,
    2: true
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
