/*
 *  State for creating a session
 */

import {atom} from "recoil";

export interface CreateSessionValues {
    sessionName: string;
    studentId: string;
    studentName: string;
    eyeTracker: string;
    sessionCode: string;
    studentConnected: boolean;
}

/*
 *  An atom that stores the values entered when creating a new session
 */
export const createSessionValuesState = atom<CreateSessionValues>({
    key: "createSessionValues",
    default: {
        sessionName: "",
        studentId: "",
        studentName: "",
        eyeTracker: "",
        sessionCode: "",
        studentConnected: false
    }
});
