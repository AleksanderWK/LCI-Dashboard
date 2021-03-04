import React from "react";
import ReactDOM from "react-dom";
import {Variable} from "../../../constants";
import {RecoilRoot} from "recoil";
import LineChart from "../LineChart";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <LineChart variable={Variable.CognitiveLoad} />
        </RecoilRoot>,
        div
    );
});
