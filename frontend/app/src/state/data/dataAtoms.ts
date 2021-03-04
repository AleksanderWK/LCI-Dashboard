import {atom, atomFamily, selector} from "recoil";
import {Variable} from "../../constants";

interface Data {
    [Variable.CognitiveLoad]: [number, number][];
    [Variable.PerceivedDifficulty]: [number, number][];
    [Variable.Familiarity]: [number, number][];
    [Variable.InformationProcessingIndex]: [number, number][];
    [Variable.PhysiologicalArousal]: [number, number][];
    [Variable.Engagement]: [number, number][];
    [Variable.PhysiologicalStress]: [number, number][];
    [Variable.EmotionalRegulation]: [number, number][];
    [Variable.MotionStability]: [number, number][];
    [Variable.EnergySpentFatigue]: [number, number][];
    [Variable.EducationalSpecificEmotions]: [number, number][];
}

/*
 *  An atom that stores which student is selected
 */
const selectedStudentIdState = atom<number | null>({
    key: "selectedStudentId",
    default: null
});

/*
 *   An atomFamily that stores the data for each student
 */
const dataState = atomFamily<Data, number | null>({
    key: "data",
    default: {
        [Variable.CognitiveLoad]: [],
        [Variable.PerceivedDifficulty]: [],
        [Variable.Familiarity]: [],
        [Variable.InformationProcessingIndex]: [],
        [Variable.PhysiologicalArousal]: [],
        [Variable.Engagement]: [],
        [Variable.PhysiologicalStress]: [],
        [Variable.EmotionalRegulation]: [],
        [Variable.MotionStability]: [],
        [Variable.EnergySpentFatigue]: [],
        [Variable.EducationalSpecificEmotions]: []
    }
});

/*
 *  A selector that returns the selected student's data
 */
const selectedStudentDataState = selector<Data>({
    key: "selectedStudentData",
    get: ({get}) => {
        const id = get(selectedStudentIdState);

        return get(dataState(id));
    },
    set: ({get, set}, newValue) => {
        const id = get(selectedStudentIdState);

        set(dataState(id), newValue);
    }
});

export {selectedStudentIdState, dataState, selectedStudentDataState};
