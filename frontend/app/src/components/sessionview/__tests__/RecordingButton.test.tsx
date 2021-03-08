import React from "react";
import ReactDOM from "react-dom";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {RecoilRoot} from "recoil";
import RecordingButton from "../RecordingButton";

it("button matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot>
            <RecordingButton />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <RecordingButton />
        </RecoilRoot>,
        div
    );
});

it("toggles between start recording / stop recording on click", () => {
    render(
        <RecoilRoot>
            <RecordingButton />
        </RecoilRoot>
    );
    expect(screen.getAllByText("Start recording").pop()).toBeInTheDocument();
    userEvent.click(screen.getByText("Start recording"));
    expect(screen.getAllByText("Stop recording").pop()).toBeInTheDocument();
    userEvent.click(screen.getByText("Stop recording"));
    expect(screen.getAllByText("Start recording").pop()).toBeInTheDocument();
});
