import React from "react";
import ReactDOM from "react-dom";
import {render, screen} from "@testing-library/react";
import QuitSession from "../QuitSession";
import {RecoilRoot} from "recoil";
import {quitSessionPopupOpenState} from "../../../state/popup";
import {selectedSessionRecordingState} from "../../../state/session";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(quitSessionPopupOpenState, true);
            }}
        >
            <QuitSession sessionName="name" studentName="name" />
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
            <QuitSession sessionName="name" studentName="name" />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("Recording prompt renders", () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(quitSessionPopupOpenState, true);
                snap.set(selectedSessionRecordingState, true);
            }}
        >
            <QuitSession sessionName="name" studentName="name" />
        </RecoilRoot>
    );
    expect(screen.getByText("This will also stop the ongoing recording")).toBeInTheDocument();
});

it("Displays session name and student name correctly", () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(quitSessionPopupOpenState, true);
                snap.set(selectedSessionRecordingState, true);
            }}
        >
            <QuitSession sessionName="Educational Game" studentName="Aleksander" />
        </RecoilRoot>
    );
    expect(screen.getByText("Educational Game")).toBeInTheDocument();
    expect(screen.getByText(/Aleksander/i)).toBeInTheDocument();
});
