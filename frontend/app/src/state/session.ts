import {Layouts} from "react-grid-layout";
import {atom, atomFamily, selector, selectorFamily, useRecoilValue} from "recoil";
import {EyeTrackingDevice, Variable} from "../constants";
import {studentState, Student} from "./student";

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

export interface SessionWithStudent {
    _id: number;
    sessionName: string;
    student: Student;
    eyeTrackingDevice: EyeTrackingDevice;
    recording: Recording;
    startTime: number;
    endTime: number | null;
    sessionCode: string;
}

/*
 *  A selector that returns the session info of the selected session
 */
export const selectedSessionState = selector<SessionWithStudent | undefined>({
    key: "selectedSession",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        const session = get(sessionState(id));

        if (id && session) {
            const student = get(studentState(session.studentId));

            if (student) {
                return {
                    _id: id,
                    sessionName: session.sessionName,
                    student: student,
                    eyeTrackingDevice: session.eyeTrackingDevice,
                    recording: get(sessionRecordingState(id)),
                    startTime: session.startTime,
                    endTime: session.endTime,
                    sessionCode: session.sessionCode
                };
            }
        }
    }
});

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
                const student = get(studentState(session.studentId));

                if (student) {
                    sessions.push({
                        _id: sessionId,
                        sessionName: session.sessionName,
                        student: student,
                        eyeTrackingDevice: session.eyeTrackingDevice,
                        recording: get(sessionRecordingState(sessionId)),
                        startTime: session.startTime,
                        endTime: session.endTime,
                        sessionCode: session.sessionCode
                    });
                }
            }
        });

        return sessions;
    }
});

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
        [Variable.EnergySpentFatigue]: []
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
export const selectedSessionDataLengthVariableState = selectorFamily<number, Variable>({
    key: "selectedSessionDataLengthVariable",
    get: (variable: Variable) => ({get}) => {
        return get(selectedSessionDataState)[variable].length;
    }
});

/*
 *  A selectorFamily that returns the last value for a given variable from the selected session's data
 */
export const selectedSessionLastValueState = selectorFamily<number | null, Variable>({
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

export interface VariableDisplay {
    active: boolean;
    display: "line" | "numeric";
}

export interface ActiveContainers {
    [Variable.CognitiveLoad]: VariableDisplay;
    [Variable.PerceivedDifficulty]: VariableDisplay;
    [Variable.Familiarity]: VariableDisplay;
    [Variable.InformationProcessingIndex]: VariableDisplay;
    [Variable.PhysiologicalArousal]: VariableDisplay;
    [Variable.Engagement]: VariableDisplay;
    [Variable.PhysiologicalStress]: VariableDisplay;
    [Variable.EmotionalRegulation]: VariableDisplay;
    [Variable.MotionStability]: VariableDisplay;
    [Variable.EnergySpentFatigue]: VariableDisplay;
}

/*
 *   An atomFamily that stores the active containers for each session
 */
export const sessionActiveContainersState = atomFamily<ActiveContainers, number | null>({
    key: "sessionActiveContainers",
    default: {
        [Variable.CognitiveLoad]: {active: false, display: "line"},
        [Variable.PerceivedDifficulty]: {active: false, display: "line"},
        [Variable.Familiarity]: {active: false, display: "line"},
        [Variable.InformationProcessingIndex]: {active: false, display: "line"},
        [Variable.PhysiologicalArousal]: {active: false, display: "line"},
        [Variable.Engagement]: {active: false, display: "line"},
        [Variable.PhysiologicalStress]: {active: false, display: "line"},
        [Variable.EmotionalRegulation]: {active: false, display: "line"},
        [Variable.MotionStability]: {active: false, display: "line"},
        [Variable.EnergySpentFatigue]: {active: false, display: "line"}
    }
});

/*
 *  A selector for getting and setting display object for all containers in a session
 */
export const selectedSessionActiveContainersState = selector<ActiveContainers>({
    key: "selectedSessionActiveContainers",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        return get(sessionActiveContainersState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(sessionActiveContainersState(id), newValue);
    }
});

/*
 *  A selectorFamily that accesses a sessions containers active state
 */

export const selectedSessionVariableContainerVisibleState = selectorFamily<VariableDisplay, Variable>({
    key: "selectedSessionVariableContainer",
    get: (variable: Variable) => ({get}) => {
        const id = get(selectedSessionIdState);
        return get(sessionActiveContainersState(id))[variable];
    },
    set: (variable: Variable) => ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(sessionActiveContainersState(id), (activeContainerPrevState) => {
            return {
                ...activeContainerPrevState,
                [variable]: newValue
            };
        });
    }
});

export const snackOpenState = atom<boolean>({
    key: "snackOpen",
    default: false
});

/**
 * An atom family that stores the layouts for all current sessions
 */

export const dashboardLayoutsState = atomFamily<Layouts | undefined, number | null>({
    key: "dashboardLayouts",
    default: undefined
});

/*
 *  A selector for getting and setting dashboard layout for the currently selected session
 */
export const selectedSessionDashboardLayoutsState = selector<Layouts | undefined>({
    key: "selectedSessionDashboardLayouts",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        return get(dashboardLayoutsState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(dashboardLayoutsState(id), newValue);
    }
});

/**
 * An atom family that stores the column count for each session dashboard
 */

export const dashboardColumnsState = atomFamily<number | undefined, number>({
    key: "dashboardColumns",
    default: () => {
        let cols = 1;
        if (window.innerWidth >= 1200) {
            cols = 6;
        } else if (window.innerWidth >= 996) {
            cols = 4;
        } else if (window.innerWidth >= 480) {
            cols = 2;
        }
        return cols;
    }
});

/*
 *  A selector for getting and setting the number of dashboard columns for the currently selected session
 */
export const selectedSessionDashboardColumnsState = selector<number | undefined>({
    key: "selectedSessionDashboardColumns",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        if (id) {
            return get(dashboardColumnsState(id));
        }
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        if (id) {
            set(dashboardColumnsState(id), newValue);
        }
    }
});

export interface allsessionsObject {
    sessionId: number;
    studentName: string;
    data: [number, number][];
}

/*
 *  A selectorFamily that returns the data for a given variable and session id
 */
export const sessionVariableDataState = selectorFamily<[number, number][], [Variable, number]>({
    key: "sessionVariableData",
    get: (Parameters: [Variable, number]) => ({get}) => {
        return get(sessionDataState(Parameters[1]))[Parameters[0]];
    }
});

/*
 *  An atom that stores which variable is selected for the all sessions view
 */
export const selectedAllSessionVariableState = atom<Variable | null>({
    key: "selectedAllSessionVariable",
    default: null
});

/*
 *  A selector that returns array of objects that each contain student name and session data for
 *  the currently selected variable.
 */
export const allSessionsState = selector<allsessionsObject[]>({
    key: "allSessions",
    get: ({get}) => {
        const result: allsessionsObject[] = [];
        const sessions = get(sessionsState);
        const selectedVariable = get(selectedAllSessionVariableState);
        sessions.forEach((session) => {
            if (selectedVariable != null) {
                const data = get(sessionVariableDataState([selectedVariable, session._id]));
                result.push({sessionId: session._id, studentName: session.student.name, data: data});
            }
        });
        return result;
    }
});
