import React from "react";
import ReactDOM from "react-dom";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSessionView from "../../../pages/CreateSessionView";
import CreateSession from "../CreateSession";
import {RecoilRoot} from "recoil";

it("create session view matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot>
            <CreateSessionView />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <CreateSessionView />
        </RecoilRoot>,
        div
    );
});
