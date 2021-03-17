import {atom} from "recoil";

/**
 * An atom that stores the id of a session that has been recorded and selected
 */
export const selectedRecordedSessionId = atom<number | null>({
    key: "selectedRecordedSessionId",
    default: null
});
