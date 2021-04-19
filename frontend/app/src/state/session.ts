/*
 *  State for all live sessions (information, recording state and data)
 */

import * as Highcharts from "highcharts";
import {atom, atomFamily, selector, selectorFamily} from "recoil";
import {EyeTrackingDevice, Variable} from "../constants";

/*
 *  SESSION INFORMATION
 */

/*
 *  An atom that stores which session is selected
 */
export const selectedSessionIdState = atom<number | null>({
    key: "selectedSessionId",
    default: null
});

/*
 *  An atom that stores ids for all sessions
 */
export const sessionIdsState = atom<number[]>({
    key: "sessionIds",
    default: []
});

export interface Session {
    _id: number;
    sessionName: string;
    studentId: string;
    studentName: string;
    eyeTrackingDevice: EyeTrackingDevice;
    startTime: number;
    endTime: number | null;
    sessionCode: string;
}

/*
 *  An atomFamily that stores session information for each session
 */
export const sessionState = atomFamily<Session | undefined, number | null>({
    key: "session",
    default: undefined
});

/*
 *  A selector that returns the selected session's session info
 */
export const selectedSessionState = selector<Session | undefined>({
    key: "selectedSession",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        return get(sessionState(id));
    }
});

/*
 *  A selector that returns the session info of all sessions
 */
export const sessionsState = selector<Session[]>({
    key: "sessions",
    get: ({get}) => {
        const sessions: Session[] = [];
        const sessionIds = get(sessionIdsState);

        sessionIds.forEach((id) => {
            const session = get(sessionState(id));
            if (session) {
                sessions.push(session);
            }
        });

        return sessions;
    }
});

/*
 *  RECORDING INFORMATION
 */

interface Recording {
    status: boolean;
    startTime: Date | null;
    recordingId: number | null;
}

/*
 *   An atomFamily that stores the recording status of each session
 */
export const sessionRecordingState = atomFamily<Recording, number | null>({
    key: "sessionRecording",
    default: {
        status: false,
        startTime: null,
        recordingId: null
    }
});

/*
 *   A selector that returns whether the selected session is being recorded
 */
export const selectedSessionRecordingState = selector<Recording>({
    key: "selectedSessionRecording",
    get: ({get}) => {
        const id = get(selectedSessionIdState);

        return get(sessionRecordingState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(sessionRecordingState(id), newValue);
    }
});

/*
 *  DATA
 */

export interface EducationalSpecificEmotions {
    [key: string]: boolean;
    boredom: boolean;
    frustration: boolean;
    confusion: boolean;
    delight: boolean;
}

export interface Data {
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
    [Variable.EducationalSpecificEmotions]: [number, EducationalSpecificEmotions][];
}

/*
 *   An atomFamily that stores the data for each session
 */
export const sessionDataState = atomFamily<Data, number | null>({
    key: "sessionData",
    default: {
        [Variable.CognitiveLoad]: [],
        [Variable.PerceivedDifficulty]: [],
        [Variable.Familiarity]: [],
        [Variable.InformationProcessingIndex]: [],
        [Variable.PhysiologicalArousal]: [],
        [Variable.Engagement]: [],
        [Variable.PhysiologicalStress]: [],
        [Variable.EmotionalRegulation]: [],
        [Variable.MotionStability]: [],
        [Variable.EnergySpentFatigue]: [],
        [Variable.EducationalSpecificEmotions]: []
    }
});

/*
 *  A selector that returns the selected session's data
 */
export const selectedSessionDataState = selector<Data>({
    key: "selectedSessionData",
    get: ({get}) => {
        const id = get(selectedSessionIdState);

        return get(sessionDataState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);

        set(sessionDataState(id), newValue);
    }
});

/*
 *  A selectorFamily that returns the data for a given variable from the selected session's data
 */
export const selectedSessionVariableDataState = selectorFamily<
    [number, number | EducationalSpecificEmotions][],
    Variable
>({
    key: "selectedSessionVariableData",
    get: (variable: Variable) => ({get}) => {
        return get(selectedSessionDataState)[variable];
    }
});

/*
 *  A selectorFamily that returns the data for a given variable and session id
 */
export const sessionVariableDataState = selectorFamily<
    [number, number | EducationalSpecificEmotions][],
    [Variable, number]
>({
    key: "sessionVariableData",
    get: (param) => ({get}) => {
        return get(sessionDataState(param[1]))[param[0]];
    }
});

/*
 *  A selector that returns the length of the data for a given variable and session id
 */
export const sessionVariableDataLengthState = selectorFamily<number, [Variable, number]>({
    key: "sessionVariableDataLength",
    get: (param) => ({get}) => {
        return get(sessionDataState(param[1]))[param[0]].length;
    }
});

export interface ESEXRangeData {
    prevEmotionsIndex: {
        [key: string]: number;
        boredom: number;
        frustration: number;
        confusion: number;
        delight: number;
    };
    data: Highcharts.XrangePointOptionsObject[];
}

/*
 *  An atomFamily that stores ESE data in the correct format for X-range charts, for each session
 */
export const sessionESEXRangeDataState = atomFamily<ESEXRangeData, number | null>({
    key: "sessionESEXRangeData",
    default: {
        prevEmotionsIndex: {
            boredom: 0,
            frustration: 0,
            confusion: 0,
            delight: 0
        },
        data: []
    }
});

/*
 *  A selector that returns the ESE data for the selected session
 */
export const selectedSessionESEXRangeDataState = selector<ESEXRangeData>({
    key: "selectedSessionESEXRangeData",
    get: ({get}) => {
        const id = get(selectedSessionIdState);

        return get(sessionESEXRangeDataState(id));
    }
});

/*
 *  A selectorFamily that returns the data length for a given variable from the selected session's data
 */
export const selectedSessionDataLengthVariableState = selectorFamily<number, Variable>({
    key: "selectedSessionDataLengthVariable",
    get: (variable: Variable) => ({get}) => {
        return get(selectedSessionDataState)[variable].length;
    }
});

/*
 *  A selectorFamily that returns the last value for a given variable from the selected session's data
 */
export const selectedSessionLastValueState = selectorFamily<number | EducationalSpecificEmotions | null, Variable>({
    key: "selectedSessionLastValue",
    get: (variable: Variable) => ({get}) => {
        const data = get(selectedSessionDataState)[variable];

        if (data.length > 0) {
            return data.slice(-1)[0][1];
        } else {
            return null;
        }
    }
});

export const selectedSessionLastPointState = selectorFamily<
    [number, EducationalSpecificEmotions | number] | null,
    Variable
>({
    key: "selectedSessionLastPoint",
    get: (variable: Variable) => ({get}) => {
        const data = get(selectedSessionDataState)[variable];

        if (data.length > 0) {
            return data.slice(-1)[0];
        } else {
            return null;
        }
    }
});
