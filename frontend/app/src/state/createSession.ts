import {atom} from "recoil";

export interface CreateSessionValues {
    sessionName: string;
    studentId: number | null;
    studentName: string;
    eyeTracker: string;
    sessionCode: string;
    studentConnected: boolean;
}

export const createSessionValuesState = atom<CreateSessionValues>({
    key: "createSessionValues",
    default: {
        sessionName: "",
        studentId: null,
        studentName: "",
        eyeTracker: "",
        sessionCode: "",
        studentConnected: false
    }
});
