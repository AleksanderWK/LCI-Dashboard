/*
 *  State for dashboard (containers and layout)
 */

import {Layout, Layouts} from "react-grid-layout";
import {atom, atomFamily, selector, selectorFamily} from "recoil";
import {Variable} from "../constants";
import {selectedSessionIdState} from "./session";

export type View = "chart" | "numeric";

/*
 *   An atomFamily that stores the container state for each variable for each session
 */
export const containerState = atomFamily<View, [number | null, Variable]>({
    key: "container",
    default: "chart"
});

/*
 *   An atomFamily that stores a list of all active containers/variables for each session
 */
export const sessionActiveContainersState = atomFamily<Variable[], number | null>({
    key: "sessionActiveContainers",
    default: []
});

/*
 *   A selector that returns the selected sessions active containers/variables
 */
export const selectedSessionActiveContainersState = selector<Variable[]>({
    key: "selectedSessionActiveContainers",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        return get(sessionActiveContainersState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(sessionActiveContainersState(id), newValue);
    }
});

/*
 *  An atom that stores the current breakpoint
 */
export const breakpointState = atom<string>({
    key: "breakpoint",
    default: "lg"
});

/*
 *  An atomFamily that stores the layout for each breakpoint for each session
 */
export const layoutsState = atomFamily<Layouts, number | null>({
    key: "layouts",
    default: {}
});

/*
 *  A selector for getting and setting the layouts for the selected session
 */
export const selectedSessionLayoutsState = selector<Layouts>({
    key: "selectedSessionLayouts",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        return get(layoutsState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(layoutsState(id), newValue);
    }
});

/*
 *  A selectorFamily to get the layout item for a specific variable, for the selected session and current breakpoint
 */
export const selectedSessionLayoutItemState = selectorFamily<Layout | undefined, Variable>({
    key: "selectedSessionLayoutItem",
    get: (variable) => ({get}) => {
        return get(selectedSessionLayoutsState)[get(breakpointState)]?.find((layout) => layout.i == variable);
    }
});
