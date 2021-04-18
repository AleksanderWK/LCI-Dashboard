import React from "react";
import ReactDOM from "react-dom";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MMDVariables, Variable} from "../../../../constants";
import Container from "../Container";
import {RecoilRoot} from "recoil";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <Container variable={Variable.CognitiveLoad} />
        </RecoilRoot>,
        div
    );
});

it("renders title", () => {
    render(
        <RecoilRoot>
            <Container variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );
    expect(screen.getByText(MMDVariables[Variable.CognitiveLoad].name)).toBeInTheDocument();
});

it("tooltip displays variable info", async () => {
    render(
        <RecoilRoot>
            <Container variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );
    userEvent.hover(screen.getByLabelText("info"));
    await waitFor(() => {
        expect(screen.getByText(MMDVariables[Variable.CognitiveLoad].description)).toBeInTheDocument();
        expect(screen.getByText(MMDVariables[Variable.CognitiveLoad].device, {exact: false})).toBeInTheDocument();
    });
});

it("menu displays remove view button", async () => {
    render(
        <RecoilRoot>
            <Container variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );

    userEvent.click(screen.getByLabelText("settings"));
    expect(screen.getAllByText(/remove view/i)[0]).toBeInTheDocument();
});
