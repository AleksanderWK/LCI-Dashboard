import {atom, selector} from "recoil";
import {Variable} from "../constants";
import {Session} from "./session";

/*
 * An atom that stores the id of a session that has been recorded and selected
 */
export const selectedRecordedSessionIdState = atom<number | null>({
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

/**
 * An atom that stores information about the currently selected recorded session
 */
export const recordedSessionInfo = atom<Session | null>({
    key: "recordedSessionInfo",
    default: null
});

export interface TimeInterval {
    start: number;
    end: number;
}

/**
 * A selector that gives the time interval of the selected recording
 */
export const recordingInterval = selector<TimeInterval | undefined>({
    key: "recordingInterval1",
    get: ({get}) => {
        const data = get(recordedSessionState);
        if (data) {
            const interval = {start: data.startTime, end: data.endTime};
            return interval;
        }
    }
});

/**
 * An atom that stores the current interval
 */
export const currentRecordingInterval = atom<TimeInterval | undefined>({
    key: "currentRecordingInterval",
    default: recordingInterval
});
