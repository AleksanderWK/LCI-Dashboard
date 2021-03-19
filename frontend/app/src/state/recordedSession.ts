import {atom, selector} from "recoil";
import {Variable} from "../constants";

/**
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
    data: RecordedData;
}

export interface RecordedData {
    timestamp: number;
    [Variable.CognitiveLoad]: [number, number][];
    [Variable.PerceivedDifficulty]: [number, number][];
    [Variable.Familiarity]: [number, number][];
    [Variable.InformationProcessingIndex]: [number, number][];
    [Variable.PhysiologicalArousal]: [number, number][];
    [Variable.Engagement]: [number, number][];
    [Variable.PhysiologicalStress]: [number, number][];
    [Variable.EmotionalRegulation]: [number, number][];
    [Variable.MotionStability]: [number, number][];
    [Variable.EnergySpentFatigue]: [number, number][];
}

/**
 * An atom that stores the data for the currently selected recorded sessoion
 */
export const recordedSession = atom<RecordedSession>({
    key: "recordedSession",
    default: {
        sessionId: 0,
        startTime: 0,
        endTime: 100,
        data: {
            timestamp: 0,
            [Variable.CognitiveLoad]: [],
            [Variable.PerceivedDifficulty]: [],
            [Variable.Familiarity]: [],
            [Variable.InformationProcessingIndex]: [],
            [Variable.PhysiologicalArousal]: [],
            [Variable.Engagement]: [],
            [Variable.PhysiologicalStress]: [],
            [Variable.EmotionalRegulation]: [],
            [Variable.MotionStability]: [],
            [Variable.EnergySpentFatigue]: []
        }
    }
});

export interface TimeInterval {
    start: number;
    end: number;
}

/**
 * A selector that gives the time interval of the selected recording
 */
export const recordingInterval = selector({
    key: "recordingInterval1",
    get: ({get}) => {
        const data = get(recordedSession);
        const interval = {start: data?.startTime, end: data?.endTime};
        return interval;
    }
});

/**
 * An atom that stores the current interval
 */
export const currentRecordingInterval = atom<TimeInterval>({
    key: "currentRecordingInterval",
    default: recordingInterval
});
