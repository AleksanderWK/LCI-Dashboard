import {atom} from "recoil";

/*
 *  An atom that stores the current callback function ID (increased by 1 for each new callback)
 */
export const callbackFunctionIdState = atom<number>({
    key: "callbackFunctionId",
    default: 0
});

interface CallbackFunctions {
    [key: number]: () => void;
}

/*
 *  An atom that stores all functions to be called on every chart update
 */
export const callbackFunctionsState = atom<CallbackFunctions>({
    key: "callbackFunctions",
    default: {}
});
