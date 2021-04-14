import {atom, atomFamily} from "recoil";
import {DataPoints} from "../pages/SessionView";

export const sessionCodesState = atom<string[]>({
    key: "sessionCodes",
    default: []
});

/*
 *  An atomFamily that stores buffer data for each session
 */
export const bufferState = atomFamily<{active: boolean; data: DataPoints[]}, string>({
    key: "buffer",
    default: {active: false, data: []}
});
