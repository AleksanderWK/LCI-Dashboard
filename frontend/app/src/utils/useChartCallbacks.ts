import {useState} from "react";
import {useRecoilCallback} from "recoil";
import {callbackFunctionIdState, callbackFunctionsState} from "../state/chart";

/*
 *  A hook that manages the callback functions to be called on every chart update
 */
export function useChartCallbacks(): [number | undefined, (callback: () => void) => void, (id: number) => void] {
    const [chartId, setChartId] = useState<number>();

    /*
     *  Inserts a callback function with a new ID in the callback functions object
     */
    const insertCallback = useRecoilCallback(({set}) => (callback: () => void): void => {
        set(callbackFunctionIdState, (prevId) => {
            const id = prevId + 1;
            setChartId(id);
            set(callbackFunctionsState, (prevValues) => ({...prevValues, [id]: callback}));
            return id;
        });
    });

    /*
     *  Removes a callback function from the callback functions object by ID
     */
    const removeCallback = useRecoilCallback(({set}) => (id: number): void => {
        set(callbackFunctionsState, (prevValues) => {
            const cbFns = {...prevValues};
            delete cbFns[id];
            return cbFns;
        });
    });

    return [chartId, insertCallback, removeCallback];
}
