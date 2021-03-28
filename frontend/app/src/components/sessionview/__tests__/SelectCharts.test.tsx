import React from "react";
import ReactDOM from "react-dom";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {RecoilRoot} from "recoil";
import SelectCharts from "../SelectCharts";
import {act} from "react-dom/test-utils";

/*  Selected containers at start are changing frequently during development,
    snapshot testing isn't applicable'
it("popup matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot>
            <SelectCharts />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});
*/

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <SelectCharts />
        </RecoilRoot>,
        div
    );
});

it("select all button works properly", () => {
    act(() => {
        render(
            <RecoilRoot>
                <SelectCharts />
            </RecoilRoot>
        );
    });

    const selectAllBtn = screen.getByTestId("btn-select-all");
    //screen.getByTestId("btn-remove-all")

    expect(selectAllBtn).toBeInTheDocument();
    act(() => userEvent.click(selectAllBtn));
    expect(screen.getByTestId("btn-remove-all")).toBeInTheDocument();
    act(() => userEvent.click(screen.getByText("Cognitive Load")));
    expect(selectAllBtn).toBeInTheDocument();
});
