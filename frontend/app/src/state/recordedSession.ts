import {atom, selector} from "recoil";
import {Variable} from "../constants";

/*
 * An atom that stores the id of a session that has been recorded and selected
 */
export const selectedRecordedSessionId = atom<number | null>({
    key: "selectedRecordedSessionId",
    default: null
});

export interface RecordedSession {
    sessionId: number;
    startTime: number;
    endTime: number;
    data: RecordingIntervals;
}

export interface RecordingIntervals {
    [key: string]: RecordedData;
}

export interface RecordedData {
    timestamps: number[];
    [Variable.CognitiveLoad]: number[];
    [Variable.PerceivedDifficulty]: number[];
    [Variable.Familiarity]: number[];
    [Variable.InformationProcessingIndex]: number[];
    [Variable.PhysiologicalArousal]: number[];
    [Variable.Engagement]: number[];
    [Variable.PhysiologicalStress]: number[];
    [Variable.EmotionalRegulation]: number[];
    [Variable.MotionStability]: number[];
    [Variable.EnergySpentFatigue]: number[];
}

/*
 * An atom that stores the data for the currently selected recorded sessoion
 */
export const recordedSessionState = atom<RecordedSession | null>({
    key: "recordedSession",
    default: null
});
