import {atom} from "recoil";

export const students = atom({
    key: "students",
    default: ["John Doe", "Jane Smith"]
});
