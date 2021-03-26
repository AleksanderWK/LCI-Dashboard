import React from "react";
import ReactDOM from "react-dom";
import {RecoilRoot} from "recoil";
import IntervalSlider from "../IntervalSlider";
import {RecordedSession, recordedSessionState} from "../../../state/recordedSession";
import {screen} from "@testing-library/react";

const testRecordedSession: RecordedSession = {
    sessionId: 1,
    startTime: 1616515685019,
    endTime: 1616515749179,
    data: {
        "0": {
            timestamps: [],
            cl: [],
            pd: [],
            fam: [],
            ipi: [],
            pa: [],
            eng: [],
            ps: [],
            er: [],
            ms: [],
            esf: []
        },
        "1": {
            timestamps: [],
            cl: [],
            pd: [],
            fam: [],
            ipi: [],
            pa: [],
            eng: [],
            ps: [],
            er: [],
            ms: [],
            esf: []
        }
    }
};

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(recordedSessionState, testRecordedSession);
            }}
        >
            <IntervalSlider />
        </RecoilRoot>,
        div
    );
});

// Converts milliseconds to the hh:mm:ss format to display on the labels
function valuetext(value: number) {
    const d = new Date(value);
    return `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
}

it("Label values convert correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(recordedSessionState, testRecordedSession);
            }}
        >
            <IntervalSlider />
        </RecoilRoot>,
        div
    );
    expect(screen.getAllByRole("tooltip", {name: valuetext(testRecordedSession.startTime)}).pop()).toBeInTheDocument();
});
