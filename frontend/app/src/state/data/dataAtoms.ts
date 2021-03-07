import {atom, atomFamily, selector, selectorFamily} from "recoil";
import {EyeTrackingDevice, Variable} from "../../constants";
import {studentState, User} from "./studentAtoms";

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
    [Variable.EducationalSpecificEmotions]: [number, number][];
}

/*
 *  An atom that stores which session is selected
 */
export const selectedSessionIdState = atom<number | null>({
    key: "selectedSessionId",
    default: null
});

/*
 *  An atom that stores all ids for sessions
 */
export const sessionIdsState = atom<number[]>({
    key: "sessionIds",
    default: []
});

export interface Session {
    sessionId: number;
    studentId: number;
    eyeTrackingDevice: EyeTrackingDevice;
    recording: boolean;
}

/*
 *  An atomFamily that stores session information for each session
 */
export const sessionState = atomFamily<Session | undefined, number | null>({
    key: "session",
    default: undefined
});

export interface SessionWithStudent {
    sessionId: number;
    student: User;
    eyeTrackingDevice: EyeTrackingDevice;
    recording: boolean;
}

/*
 *  A selector that returns the session info of all sessions
 */
export const sessionsState = selector<SessionWithStudent[]>({
    key: "sessions",
    get: ({get}) => {
        const sessions: SessionWithStudent[] = [];
        const sessionIds = get(sessionIdsState);

        sessionIds.forEach((sessionId) => {
            const session = get(sessionState(sessionId));
            if (session) {
                const student = get(studentState(session?.studentId));

                if (student) {
                    sessions.push({
                        sessionId: sessionId,
                        student: student,
                        eyeTrackingDevice: session.eyeTrackingDevice,
                        recording: session.recording
                    });
                }
            }
        });

        return sessions;
    }
});

/*
 *   An atomFamily that stores the data for each session
 */
export const dataState = atomFamily<Data, number | null>({
    key: "data",
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

        return get(dataState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);

        set(dataState(id), newValue);
    }
});

/*
 *  A selector that returns the last value for a given variable from the selected session's data
 */
export const selectedSessionLastValueState = selectorFamily<number | null, Variable>({
    key: "selectedSessionLastValue",
    get: (variable: Variable) => ({get}) => {
        const id = get(selectedSessionIdState);

        const data = get(dataState(id))[variable];

        if (data.length > 0) {
            return data.slice(-1)[0][1];
        } else {
            return null;
        }
    }
});
