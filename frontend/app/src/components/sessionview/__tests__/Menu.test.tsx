import React from "react";
import ReactDOM from "react-dom";
import {render, screen} from "@testing-library/react";
import {RecoilRoot} from "recoil";
import {selectedSessionIdState, sessionIdsState, sessionState} from "../../../state/data/dataAtoms";
import {studentIdsState, studentState} from "../../../state/data/studentAtoms";
import {EyeTrackingDevice} from "../../../constants";
import Menu from "../Menu/Menu";

const testSessionIds = [1, 2];
const testStudentIds = [1, 2];

const testStudents = {1: {_id: 1, name: "John Doe"}, 2: {_id: 2, name: "Jane Smith"}};

const testSessions = {
    1: {sessionId: 1, studentId: 1, eyeTrackingDevice: EyeTrackingDevice.Mobile, recording: false},
    2: {sessionId: 2, studentId: 2, eyeTrackingDevice: EyeTrackingDevice.Stationary, recording: true}
};

const testSelectedSessionId = 1;

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(sessionIdsState, testSessionIds);
                snap.set(studentIdsState, testStudentIds);
                snap.set(studentState(1), testStudents[1]);
                snap.set(studentState(2), testStudents[2]);
                snap.set(sessionState(1), testSessions[1]);
                snap.set(sessionState(2), testSessions[2]);
                snap.set(selectedSessionIdState, testSelectedSessionId);
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
                snap.set(studentIdsState, testStudentIds);
                snap.set(studentState(1), testStudents[1]);
                snap.set(studentState(2), testStudents[2]);
                snap.set(sessionState(1), testSessions[1]);
                snap.set(sessionState(2), testSessions[2]);
                snap.set(selectedSessionIdState, testSelectedSessionId);
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
                snap.set(studentIdsState, testStudentIds);
                snap.set(studentState(1), testStudents[1]);
                snap.set(studentState(2), testStudents[2]);
                snap.set(sessionState(1), testSessions[1]);
                snap.set(sessionState(2), testSessions[2]);
                snap.set(selectedSessionIdState, testSelectedSessionId);
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
