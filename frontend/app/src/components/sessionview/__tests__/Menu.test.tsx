import React from "react";
import ReactDOM from "react-dom";
import {render, screen} from "@testing-library/react";
import {RecoilRoot} from "recoil";
import {EyeTrackingDevice} from "../../../constants";
import Menu from "../Menu/Menu";
import {selectedSessionIdState, sessionIdsState, sessionRecordingState, sessionState} from "../../../state/session";
import {studentsState} from "../../../state/student";

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
        eyeTrackingDevice: EyeTrackingDevice.Mobile
    },
    2: {
        sessionId: 2,
        sessionName: "Test2",
        studentId: "2",
        eyeTrackingDevice: EyeTrackingDevice.Stationary
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
            <Menu />
        </RecoilRoot>,
        div
    );
});

it("matches snapshot", () => {
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
            <Menu />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("renders correct based on state", () => {
    render(
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
            <Menu />
        </RecoilRoot>
    );

    expect(screen.getByText(/JD/i)).toBeInTheDocument();
    expect(screen.getByText(/JS/i)).toBeInTheDocument();
    expect(screen.getByText(/REC/i)).toBeInTheDocument();
    expect(screen.getAllByText(/REC/i)).toHaveLength(1);
});
