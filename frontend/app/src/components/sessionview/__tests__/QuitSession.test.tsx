import React from "react";
import ReactDOM from "react-dom";
import {render, screen, waitFor} from "@testing-library/react";
import QuitSession from "../QuitSession";
import {RecoilRoot} from "recoil";
import {quitSessionPopupOpenState} from "../../../state/popup";
import {selectedSessionIdState, selectedSessionRecordingState, sessionState} from "../../../state/session";
import {EyeTrackingDevice} from "../../../constants";
import {studentsState} from "../../../state/student";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(quitSessionPopupOpenState, true);
            }}
        >
            <QuitSession />
        </RecoilRoot>,
        div
    );
});

it("QuitSession matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(quitSessionPopupOpenState, true);
            }}
        >
            <QuitSession />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("Recording prompt renders", () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(quitSessionPopupOpenState, true);
                snap.set(selectedSessionRecordingState, {status: true, startTime: new Date(), recordingId: 0});
            }}
        >
            <QuitSession />
        </RecoilRoot>
    );
    expect(screen.getByText("This will also stop the ongoing recording.")).toBeInTheDocument();
});

it("Displays session name and student name correctly", () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(quitSessionPopupOpenState, true);
                snap.set(selectedSessionRecordingState, {status: true, startTime: new Date(), recordingId: 0});
                snap.set(studentsState, [{_id: "1", name: "Aleksander"}]);
                snap.set(sessionState(1), {
                    _id: 1,
                    eyeTrackingDevice: EyeTrackingDevice.Mobile,
                    sessionName: "Educational Game",
                    studentId: "1",
                    studentName: "Aleksander",
                    startTime: 0,
                    endTime: 0,
                    sessionCode: "abc"
                });
                snap.set(selectedSessionIdState, 1);
            }}
        >
            <QuitSession />
        </RecoilRoot>
    );
    waitFor(() => {
        expect(screen.getByText("Educational Game")).toBeInTheDocument();
        expect(screen.getByText(/Aleksander/i)).toBeInTheDocument();
    });
});
