import React from "react";
import {Variable} from "../../../../constants";
import {RecoilRoot} from "recoil";
import LineChart from "../LineChart";
import {render} from "@testing-library/react";
import {Data, selectedSessionIdState, sessionDataState} from "../../../../state/session";

it("renders without crashing for different data lenghts", () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(selectedSessionIdState, 1);
                snap.set(sessionDataState(1), {
                    cl: [
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5],
                        [0, 0.5]
                    ],
                    pd: [[0, 0.5]],
                    fam: [[0, 0.5]],
                    ipd: [[0, 0.5]],
                    pa: [[0, 0.5]],
                    eng: [[0, 0.5]],
                    ps: [[0, 0.5]],
                    er: [[0, 0.5]],
                    ms: [[0, 0.5]],
                    esf: [[0, 0.5]]
                } as Data);
            }}
        >
            <LineChart variable={Variable.CognitiveLoad} />
            <LineChart variable={Variable.PerceivedDifficulty} />
        </RecoilRoot>
    );
});
