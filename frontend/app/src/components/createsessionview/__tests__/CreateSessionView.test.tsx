import React from "react";
import ReactDOM from "react-dom";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSessionView from "../../../pages/CreateSessionView";
import CreateSession from "../CreateSession";

it("create session view matches snapshot", () => {
    const {baseElement} = render(<CreateSessionView />);
    expect(baseElement).toMatchSnapshot();
});

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<CreateSessionView />, div);
});
