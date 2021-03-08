import {atom, selectorFamily} from "recoil";

export interface Student {
    _id: string;
    name: string;
}

/*
 *  A selectorFamily that returns the student object for a given student id
 */
export const studentState = selectorFamily<Student | undefined, string>({
    key: "student",
    get: (id) => ({get}) => {
        const students = get(studentsState);
        return students.find((student) => student._id === id);
    }
});

/*
 *  A selector that returns a list of all students
 */
export const studentsState = atom<Student[]>({
    key: "students",
    default: []
});
