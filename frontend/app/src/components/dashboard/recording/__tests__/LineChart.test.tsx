import React from "react";
import {Variable} from "../../../../constants";
import {RecoilRoot} from "recoil";
import LineChart from "../LineChart";
import {recordedSessionState} from "../../../../state/recordedSession";
import {selectedRecordedSessionIdState} from "../../../../state/recordedSession";
import {render} from "@testing-library/react";

it("renders without crashing", () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(selectedRecordedSessionIdState, 1);
                snap.set(recordedSessionState, {
                    sessionId: 1,
                    startTime: 0,
                    endTime: 100,
                    data: {
                        "1": {
                            timestamps: [0, 50, 100],
                            cl: [0.55, 0.22, 0.33],
                            pd: [0.55, 0.22, 0.33],
                            fam: [0.55, 0.22, 0.33],
                            ipd: [0.55, 0.22, 0.33],
                            pa: [0.55, 0.22, 0.33],
                            eng: [0.55, 0.22, 0.33],
                            ps: [0.55, 0.22, 0.33],
                            er: [0.55, 0.22, 0.33],
                            ms: [0.55, 0.22, 0.33],
                            esf: [0.55, 0.22, 0.33]
                        }
                    }
                });
            }}
        >
            <LineChart variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );
});
