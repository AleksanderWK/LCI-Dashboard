/*
 *  State for dashboard (containers and layout)
 */

import {Layouts} from "react-grid-layout";
import {atomFamily, selector} from "recoil";
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
 * An atomFamily that stores the layouts for all current sessions
 */
export const dashboardLayoutsState = atomFamily<Layouts | undefined, number | null>({
    key: "dashboardLayouts",
    default: undefined
});

/*
 *  A selector for getting and setting dashboard layout for the currently selected session
 */
export const selectedSessionDashboardLayoutsState = selector<Layouts | undefined>({
    key: "selectedSessionDashboardLayouts",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        return get(dashboardLayoutsState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        set(dashboardLayoutsState(id), newValue);
    }
});

/**
 * An atom family that stores the column count for each session dashboard
 */
export const dashboardColumnsState = atomFamily<number | undefined, number>({
    key: "dashboardColumns",
    default: () => {
        let cols = 1;
        if (window.innerWidth >= 1200) {
            cols = 6;
        } else if (window.innerWidth >= 996) {
            cols = 4;
        } else if (window.innerWidth >= 480) {
            cols = 2;
        }
        return cols;
    }
});

/*
 *  A selector for getting and setting the number of dashboard columns for the currently selected session
 */
export const selectedSessionDashboardColumnsState = selector<number | undefined>({
    key: "selectedSessionDashboardColumns",
    get: ({get}) => {
        const id = get(selectedSessionIdState);
        if (id) {
            return get(dashboardColumnsState(id));
        }
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedSessionIdState);
        if (id) {
            set(dashboardColumnsState(id), newValue);
        }
    }
});
