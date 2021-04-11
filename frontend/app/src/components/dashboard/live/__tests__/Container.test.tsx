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
            <Container variable={Variable.CognitiveLoad} display="line" />
        </RecoilRoot>,
        div
    );
});

// it("renders title", () => {
//     render(
//         <RecoilRoot>
//             <Container variable={Variable.CognitiveLoad} display="line" />
//         </RecoilRoot>
//     );
//     expect(screen.getByText(MMDVariables[Variable.CognitiveLoad].name)).toBeInTheDocument();
// });

it("tooltip displays variable info", async () => {
    render(
        <RecoilRoot>
            <Container id={1} variable={Variable.CognitiveLoad} display="line" />
        </RecoilRoot>
    );
    userEvent.hover(screen.getByLabelText("info"));
    await waitFor(() => {
        expect(screen.getByText(MMDVariables[Variable.CognitiveLoad].description)).toBeInTheDocument();
        expect(screen.getByText(MMDVariables[Variable.CognitiveLoad].device, {exact: false})).toBeInTheDocument();
    });
});

it("menu toggle between show more/less", async () => {
    render(
        <RecoilRoot>
            <Container variable={Variable.CognitiveLoad} display="line" />
        </RecoilRoot>
    );

    userEvent.click(screen.getByLabelText("settings"));
    await screen.findAllByTestId("dropdown-menu").then(async (elements) => {
        expect(elements[elements.length - 1]).toBeVisible();
    });

    userEvent.click(screen.getAllByLabelText("show less")[screen.getAllByLabelText("show less").length - 1]);
    await waitFor(() => {
        expect(screen.getAllByLabelText("show more").pop()).toBeInTheDocument();
    });

    userEvent.click(screen.getAllByLabelText("show more")[screen.getAllByLabelText("show more").length - 1]);
    await waitFor(() => {
        expect(screen.getAllByLabelText("show less").pop()).toBeInTheDocument();
    });
});
