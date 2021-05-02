/*
 *  State for popups and snackbars; if they are shown or not
 */

import {atom} from "recoil";

export const quitSessionPopupOpenState = atom<boolean>({
    key: "quitSessionPopupOpen",
    default: false
});

export const createSessionPopupOpenState = atom<boolean>({
    key: "createSessionPopupOpen",
    default: false
});

export const addStudentPopupOpenState = atom<boolean>({
    key: "addStudentPopupOpen",
    default: false
});

export const selectChartsPopupOpenState = atom<boolean>({
    key: "selectChartsPopupOpen",
    default: false
});

export const snackOpenState = atom<boolean>({
    key: "snackOpen",
    default: false
});
