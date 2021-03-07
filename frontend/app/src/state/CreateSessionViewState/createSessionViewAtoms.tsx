import {atom} from "recoil";

export interface CreateSessionValues {
    sessionName: string;
    studentName: string;
    eyeTracker: string;
    sessionCode: string;
    studentConnected: boolean;
}

export const createSessionValuesState = atom<CreateSessionValues>({
    key: "createSessionValues",
    default: {
        sessionName: "",
        studentName: "",
        eyeTracker: "",
        sessionCode: "",
        studentConnected: false
    }
});

export const addStudentPopupOpenState = atom<boolean>({
    key: "addStudentPopupOpen",
    default: false
});
