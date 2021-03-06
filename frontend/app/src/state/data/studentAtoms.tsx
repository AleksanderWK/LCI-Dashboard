import {atom, atomFamily} from "recoil";

export interface User {
    _id: number;
    name: string;
}

export const students = atom({
    key: "students",
    default: ["John Doe", "Jane Smith"]
});

export const studentIdsState = atom<number[]>({
    key: "studentIds",
    default: []
});

export const studentState = atomFamily<User | undefined, number>({
    key: "student",
    default: undefined
});
