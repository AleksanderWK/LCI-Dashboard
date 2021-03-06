import {atom} from "recoil";

export interface CreateSessionValues {
    sessionName: string;
    studentName: string;
    eyeTracker: string;
}

export const createSessionValuesState = atom<CreateSessionValues>({
    key: "createSessionValues",
    default: {
        sessionName: "",
        studentName: "",
        eyeTracker: ""
    }
});

export const addStudentPopupOpenState = atom<boolean>({
    key: "addStudentPopupOpen",
    default: false
});
