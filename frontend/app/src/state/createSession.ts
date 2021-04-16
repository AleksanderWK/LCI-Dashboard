/*
 *  State for creating a session
 */

import {atom} from "recoil";

export interface CreateSessionValues {
    sessionName: string;
    studentId: string;
    eyeTracker: string;
    sessionCode: string;
    studentConnected: boolean;
}

export const createSessionValuesState = atom<CreateSessionValues>({
    key: "createSessionValues",
    default: {
        sessionName: "",
        studentId: "",
        eyeTracker: "",
        sessionCode: "",
        studentConnected: false
    }
});
