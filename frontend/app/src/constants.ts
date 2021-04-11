// Frequency in Hz (cycles per second)
export const FREQUENCY = 2;

// Maximum time interval to show on live charts in seconds
export const LIVE_CHART_RANGE = 30;

export enum Variable {
    CognitiveLoad = "cl",
    PerceivedDifficulty = "pd",
    Familiarity = "fam",
    InformationProcessingIndex = "ipi",
    PhysiologicalArousal = "pa",
    Engagement = "eng",
    PhysiologicalStress = "ps",
    EmotionalRegulation = "er",
    MotionStability = "ms",
    EnergySpentFatigue = "esf"
}

export enum Device {
    EyeTracker = "Eye Tracker",
    Wristband = "Wristband",
    VideoBody = "Video of Body",
    VideoFace = "Video of Face"
}

export enum EyeTrackingDevice {
    Mobile = "Mobile",
    Stationary = "Stationary"
}

export interface MMDVariableInfo {
    name: string;
    device: Device;
    description: string;
    maxValue?: number;
    calculationTime?: number;
}

export const MMDVariables: {[key in Variable]: MMDVariableInfo} = {
    [Variable.CognitiveLoad]: {
        name: "Cognitive Load",
        device: Device.EyeTracker,
        description:
            "Cognitive load refers to the amount of information that the working memory of a person can hold at once. In an educational setting, it is the effort needed for a learner to learn new information.",
        calculationTime: 30
    },
    [Variable.PerceivedDifficulty]: {
        name: "Perceived Difficulty",
        device: Device.EyeTracker,
        description:
            "Perceived difficulty is the perception of the ease or difficulty of performing in an educational context.",
        maxValue: 100
    },
    [Variable.Familiarity]: {
        name: "Familiarity",
        device: Device.EyeTracker,
        description: ""
    },
    [Variable.InformationProcessingIndex]: {
        name: "Information Processing Index",
        device: Device.EyeTracker,
        description:
            "The ratio of local (100) and global (0) information processing. Staring at one point is local processing, while rapidly scanning a larger area is global processing.",
        maxValue: 100
    },
    [Variable.PhysiologicalArousal]: {
        name: "Physiological Arousal",
        device: Device.Wristband,
        description:
            "Physiological Arousal is how strong the current emotions are. This is calculated by taking the average EDA in the current time interval, which is currently 8 seconds.",
        calculationTime: 8
    },
    [Variable.Engagement]: {
        name: "Engagement",
        device: Device.Wristband,
        description:
            "Area under the graph of 16 tonic EDA values. Although the empatica measures at 4Hz, the sampling rate is set to 8 because neurokit does not allow sampling rates under 7.",
        calculationTime: 8
    },
    [Variable.PhysiologicalStress]: {
        name: "Physiological Stress",
        device: Device.Wristband,
        description:
            "Physioloigcal Stress is indicated by LF/HF, the relative strengths of the low frequency and high frequency waves of the heart pulse signal.",
        calculationTime: 300
    },
    [Variable.EmotionalRegulation]: {
        name: "Emotional Regulation",
        device: Device.Wristband,
        description: ""
    },
    [Variable.MotionStability]: {
        name: "Motion Stability",
        device: Device.VideoBody,
        description: ""
    },
    [Variable.EnergySpentFatigue]: {
        name: "Energy Spent/Fatigue",
        device: Device.VideoBody,
        description:
            "The amount of energy spent by the student, also an indicator of fatigue. This is determined by calculating the jerk, the third derivative of the position skeletal body.",
        calculationTime: 4
    }
};

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
