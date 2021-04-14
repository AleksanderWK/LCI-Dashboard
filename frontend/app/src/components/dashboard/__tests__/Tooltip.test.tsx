import React from "react";
import ReactDOM from "react-dom";
import Tooltip from "../Tooltip";
import {Variable} from "../../../constants";
import {RecoilRoot} from "recoil";

it("renders without crashing for each device", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <Tooltip variable={Variable.CognitiveLoad}>
                <div>Tooltip render test</div>
            </Tooltip>
            <Tooltip variable={Variable.PhysiologicalArousal}>
                <div>Tooltip render test</div>
            </Tooltip>
            <Tooltip variable={Variable.MotionStability}>
                <div>Tooltip render test</div>
            </Tooltip>
        </RecoilRoot>,
        div
    );
});
