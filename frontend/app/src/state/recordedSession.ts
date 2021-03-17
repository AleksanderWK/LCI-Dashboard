import {atom} from "recoil";

/**
 * An atom that stores the id of a session that has been recorded and selected
 */
export const selectedRecordedSessionId = atom<number | null>({
    key: "selectedRecordedSessionId",
    default: null
});

export interface Interval {
    start: number;
    end: number;
}

/**
 * An atom that stores the currently selected recording interval
 */
export const intervalState = atom<Interval | null>({
    key: "interval",
    default: null
});
