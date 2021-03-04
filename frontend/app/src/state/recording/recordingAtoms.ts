import {atom, atomFamily, selector} from "recoil";

/*
 *  An atom that stores which student is selected
 */
const selectedStudentIdState = atom<number | null>({
    key: "selectedStudentId",
    default: null
});

/*
 *   An atomFamily that stores the recording status of each student
 */
const recordingState = atomFamily<boolean, number | null>({
    key: "recording",
    default: false
});

/*
 *   A selector that returns whether the selected student is being recorded
 */
const selectedStudentRecordingState = selector<boolean>({
    key: "selectedStudentRecording",
    get: ({get}) => {
        const id = get(selectedStudentIdState);

        return get(recordingState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedStudentIdState);
        set(recordingState(id), newValue);
    }
});

export {selectedStudentIdState, recordingState, selectedStudentRecordingState};
