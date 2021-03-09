import React from "react";
import ReactDOM from "react-dom";
import {render} from "@testing-library/react";
import StartView from "../StartView";

// Snapshot test does not work due to dynamic MUI id's in the MUI table
// it("creating start view matches snapshot", () => {
//     const {baseElement} = render(<StartView />);
//     expect(baseElement).toMatchSnapshot();
// });

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<StartView />, div);
});
