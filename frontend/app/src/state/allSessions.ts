/*
 *  State used in the all sessions view
 */

import {atom, selector} from "recoil";
import {Variable} from "../constants";
import {EducationalSpecificEmotions, sessionsState, sessionVariableDataState} from "./session";

export interface allsessionsObject {
    sessionId: number;
    studentName: string;
    data: [number, number | EducationalSpecificEmotions][];
}

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
