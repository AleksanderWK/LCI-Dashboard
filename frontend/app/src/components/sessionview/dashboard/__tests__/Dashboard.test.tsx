import React from "react";
import ReactDOM from "react-dom";
import {RecoilRoot} from "recoil";
import Dashboard from "../Dashboard";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <Dashboard />
        </RecoilRoot>,
        div
    );
});
