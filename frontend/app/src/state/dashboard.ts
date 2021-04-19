/*
 *  State for dashboard (selected variables, container views and layout)
 */

import {Layout} from "react-grid-layout";
import {atomFamily, selector, selectorFamily} from "recoil";
import {Variable} from "../constants";
import {selectedSessionIdState} from "./session";

export type View = "chart" | "numeric";

/*
 *   An atomFamily that stores the view state for each variable for each session
 */
export const viewState = atomFamily<View, [number | null, Variable]>({
    key: "view",
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
 *  An atomFamily that stores the layout for each session
 */
export const layoutState = atomFamily<Layout[], number | null>({
    key: "layout",
    default: []
});

/*
 *  A selector for getting and setting the layout for the selected session
 */
export const selectedSessionLayoutState = selector<Layout[]>({
    key: "selectedSessionLayout",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        return get(layoutState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(layoutState(id), newValue);
    }
});

/*
 *  A selectorFamily to get the layout item for a specific variable, for the selected session
 */
export const selectedSessionLayoutItemState = selectorFamily<Layout | undefined, Variable>({
    key: "selectedSessionLayoutItem",
    get: (variable) => ({get}) => {
        return get(selectedSessionLayoutState).find((layout) => layout.i == variable);
    }
});
