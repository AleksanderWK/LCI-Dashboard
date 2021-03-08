import React from "react";
import ReactDOM from "react-dom";
import {render, screen} from "@testing-library/react";
import Numeric from "../Numeric";
import {RecoilRoot} from "recoil";
import {Variable} from "../../../constants";
import {sessionDataState} from "../../../state/session";

it("matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot>
            <Numeric variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot>
            <Numeric variable={Variable.CognitiveLoad} />
        </RecoilRoot>,
        div
    );
});

it("shows correct value when no data received", () => {
    render(
        <RecoilRoot>
            <Numeric variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );

    expect(screen.getByText(/no data received/i)).toBeInTheDocument();
});

it("shows correct value", () => {
    render(
        <RecoilRoot
            initializeState={(snap) =>
                snap.set(sessionDataState(null), {
                    [Variable.CognitiveLoad]: [[new Date().getTime(), 50]],
                    [Variable.PerceivedDifficulty]: [],
                    [Variable.Familiarity]: [],
                    [Variable.InformationProcessingIndex]: [],
                    [Variable.PhysiologicalArousal]: [],
                    [Variable.Engagement]: [],
                    [Variable.PhysiologicalStress]: [],
                    [Variable.EmotionalRegulation]: [],
                    [Variable.MotionStability]: [],
                    [Variable.EnergySpentFatigue]: []
                })
            }
        >
            <Numeric variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );

    expect(screen.getByText(/50/i)).toBeInTheDocument();
});
