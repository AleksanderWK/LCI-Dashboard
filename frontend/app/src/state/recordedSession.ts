import {atom, atomFamily, selector} from "recoil";
import {EyeTrackingDevice, Variable} from "../constants";

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

export interface RecordedSessionInfo {
    sessionId: number;
    sessionName: string;
    studentId: string;
    eyeTrackingDevice: EyeTrackingDevice;
    date: string;
    startTime: string;
    duration: string;
    studentName: string;
}

/**
 * An atom that stores information about the currently selected recorded session
 */
export const recordedSessionInfoState = atom<RecordedSessionInfo | null>({
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

/*
 * State for recorded sessions active containers / select charts
 */

export interface RecordingActiveContainers {
    [Variable.CognitiveLoad]: boolean;
    [Variable.PerceivedDifficulty]: boolean;
    [Variable.Familiarity]: boolean;
    [Variable.InformationProcessingIndex]: boolean;
    [Variable.PhysiologicalArousal]: boolean;
    [Variable.Engagement]: boolean;
    [Variable.PhysiologicalStress]: boolean;
    [Variable.EmotionalRegulation]: boolean;
    [Variable.MotionStability]: boolean;
    [Variable.EnergySpentFatigue]: boolean;
}

export const recordingActiveContainersState = atomFamily<RecordingActiveContainers, number | null>({
    key: "recordingActiveContainers",
    default: {
        [Variable.CognitiveLoad]: true,
        [Variable.PerceivedDifficulty]: true,
        [Variable.Familiarity]: true,
        [Variable.InformationProcessingIndex]: true,
        [Variable.PhysiologicalArousal]: true,
        [Variable.Engagement]: true,
        [Variable.PhysiologicalStress]: true,
        [Variable.EmotionalRegulation]: true,
        [Variable.MotionStability]: true,
        [Variable.EnergySpentFatigue]: true
    }
});

export const selectedRecordingActiveContainersState = selector<RecordingActiveContainers>({
    key: "selectedRecordingActiveContainers",
    get: ({get}) => {
        const id = get(selectedRecordedSessionIdState);
        return get(recordingActiveContainersState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedRecordedSessionIdState);
        set(recordingActiveContainersState(id), newValue);
    }
});
