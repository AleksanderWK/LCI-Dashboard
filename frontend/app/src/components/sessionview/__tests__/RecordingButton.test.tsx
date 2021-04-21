import React from "react";
import ReactDOM from "react-dom";
import {render, screen} from "@testing-library/react";
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
    expect(screen.getByText("Start recording")).toBeInTheDocument();
    userEvent.click(screen.getByText("Start recording"));
    expect(screen.getByText("Stop recording", {exact: false})).toBeInTheDocument();
    userEvent.click(screen.getByText("Stop recording", {exact: false}));
    expect(screen.getByText("Start recording")).toBeInTheDocument();
});
