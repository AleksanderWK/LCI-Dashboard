/*
 *  State for recorded session view
 */

import {atom, atomFamily, selector} from "recoil";
import {emotionsColorMapper, emotionsIndexMapper, EyeTrackingDevice, FREQUENCY, Variable} from "../constants";
import {EducationalSpecificEmotions} from "./session";

/*
 *  An atom that stores the id of a session that has been recorded and selected
 */
export const selectedRecordedSessionIdState = atom<number | null>({
    key: "selectedRecordedSessionId",
    default: null
});

export interface RecordedSession {
    sessionId: number;
    startTime: number;
    endTime: number;
    data: RecordingIntervals;
}

export interface RecordingIntervals {
    [key: string]: RecordedData;
}

export interface RecordedData {
    timestamps: number[];
    [Variable.CognitiveLoad]: number[];
    [Variable.PerceivedDifficulty]: number[];
    [Variable.Familiarity]: number[];
    [Variable.InformationProcessingIndex]: number[];
    [Variable.PhysiologicalArousal]: number[];
    [Variable.Engagement]: number[];
    [Variable.PhysiologicalStress]: number[];
    [Variable.EmotionalRegulation]: number[];
    [Variable.MotionStability]: number[];
    [Variable.EnergySpentFatigue]: number[];
    [Variable.EducationalSpecificEmotions]: EducationalSpecificEmotions[];
}

/*
 *  An atom that stores the data for the currently selected recorded session
 */
export const recordedSessionState = atom<RecordedSession | null>({
    key: "recordedSession",
    default: null
});

/*
 *  A selector that returns the ESE data in x-range format for the curently selected recorded session
 */
export const recordedSessionESEXRangeDataState = selector<Highcharts.XrangePointOptionsObject[] | null>({
    key: "recordedSessionESEXRangeData",
    get: ({get}) => {
        const recordedSession = get(recordedSessionState);

        if (recordedSession) {
            const data: Highcharts.XrangePointOptionsObject[] = [];

            const prevEmotionsIndex: {[key: string]: number} = {
                boredom: 0,
                frustration: 0,
                confusion: 0,
                delight: 0
            };

            Object.values(recordedSession.data).forEach((intervalData) => {
                intervalData.timestamps.forEach((timestamp, index) => {
                    Object.entries(intervalData.ese[index]).forEach(([emotion, value]) => {
                        if (value) {
                            if (prevEmotionsIndex[emotion] > 0) {
                                // If student already has emotion, expand last point for emotion
                                data[prevEmotionsIndex[emotion]] = {
                                    ...data[prevEmotionsIndex[emotion]],
                                    ...{x2: timestamp + 1000 / FREQUENCY}
                                };
                            } else {
                                // If student does not have emotion, add new point
                                prevEmotionsIndex[emotion] =
                                    data.push({
                                        x: timestamp,
                                        x2: timestamp + 1000 / FREQUENCY,
                                        y: emotionsIndexMapper[emotion],
                                        color: emotionsColorMapper[emotion]
                                    } as Highcharts.XrangePointOptionsObject) - 1;
                            }
                        } else {
                            prevEmotionsIndex[emotion] = 0;
                        }
                    });
                });
            });

            return data;
        } else {
            return null;
        }
    }
});

export interface RecordedSessionInfo {
    sessionId: number;
    sessionName: string;
    studentId: string;
    eyeTrackingDevice: EyeTrackingDevice;
    date: string;
    startTime: string;
    duration: string;
    studentName: string;
}

/*
 *  An atom that stores information about the currently selected recorded session
 */
export const recordedSessionInfoState = atom<RecordedSessionInfo | null>({
    key: "recordedSessionInfo",
    default: null
});

export interface TimeInterval {
    start: number;
    end: number;
}

/*
 *  A selector that gives the time interval of the selected recording
 */
export const recordingInterval = selector<TimeInterval | undefined>({
    key: "recordingInterval1",
    get: ({get}) => {
        const data = get(recordedSessionState);
        if (data) {
            const interval = {start: data.startTime, end: data.endTime};
            return interval;
        }
    }
});

/*
 *  An atom that stores the current interval
 */
export const currentRecordingInterval = atom<TimeInterval | undefined>({
    key: "currentRecordingInterval",
    default: recordingInterval
});

/*
 *   An atomFamily that stores a list of all active containers/variables for each recording
 */
export const recordingActiveContainersState = atomFamily<Variable[], number | null>({
    key: "recordingActiveContainers",
    default: []
});

/*
 *   A selector that returns/updates the selected recorded session's active containers (variables)
 */
export const selectedRecordingActiveContainersState = selector<Variable[]>({
    key: "selectedRecordingActiveContainers",
    get: ({get}) => {
        const id = get(selectedRecordedSessionIdState);
        return get(recordingActiveContainersState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedRecordedSessionIdState);
        set(recordingActiveContainersState(id), newValue);
    }
});
