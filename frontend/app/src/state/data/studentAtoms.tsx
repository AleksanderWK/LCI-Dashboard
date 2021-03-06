import {atom} from "recoil";

export interface User {
    _id: string;
    name: string;
}

export const students = atom({
    key: "students",
    default: ["John Doe", "Jane Smith"]
});
