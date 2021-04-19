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
    EnergySpentFatigue = "esf",
    EducationalSpecificEmotions = "ese"
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
    enabled: boolean;
}

export const MMDVariables: {[key in Variable]: MMDVariableInfo} = {
    [Variable.CognitiveLoad]: {
        name: "Cognitive Load",
        device: Device.EyeTracker,
        description:
            "Cognitive load refers to the amount of information that the working memory of a person can hold at once. In an educational setting, it is the effort needed for a learner to learn new information.",
        calculationTime: 30,
        enabled: true
    },
    [Variable.PerceivedDifficulty]: {
        name: "Perceived Difficulty",
        device: Device.EyeTracker,
        description:
            "Perceived difficulty is the perception of the ease or difficulty of performing in an educational context.",
        maxValue: 100,
        enabled: true
    },
    [Variable.Familiarity]: {
        name: "Familiarity",
        device: Device.EyeTracker,
        description: "",
        enabled: false
    },
    [Variable.InformationProcessingIndex]: {
        name: "Information Processing Index",
        device: Device.EyeTracker,
        description:
            "The ratio of local (100) and global (0) information processing. Staring at one point is local processing, while rapidly scanning a larger area is global processing.",
        maxValue: 100,
        enabled: true
    },
    [Variable.PhysiologicalArousal]: {
        name: "Physiological Arousal",
        device: Device.Wristband,
        description:
            "Physiological Arousal is how strong the current emotions are. It is calculated by the average EDA in a time interval of 8 seconds.",
        calculationTime: 8,
        enabled: true
    },
    [Variable.Engagement]: {
        name: "Engagement",
        device: Device.Wristband,
        description:
            "Engagement is a measure of involvement and enthusiasm for the activity. It is calculated by the area under the graph of tonic EDA, in a time interval of 4 seconds.",
        calculationTime: 4,
        enabled: true
    },
    [Variable.PhysiologicalStress]: {
        name: "Physiological Stress",
        device: Device.Wristband,
        description:
            "Physioloigcal Stress is indicated by LF/HF, the relative strengths of the low frequency and high frequency waves of the heart pulse signal.",
        calculationTime: 300,
        enabled: true
    },
    [Variable.EmotionalRegulation]: {
        name: "Emotional Regulation",
        device: Device.Wristband,
        description: "",
        enabled: false
    },
    [Variable.MotionStability]: {
        name: "Motion Stability",
        device: Device.VideoBody,
        description: "",
        enabled: false
    },
    [Variable.EnergySpentFatigue]: {
        name: "Energy Spent/Fatigue",
        device: Device.VideoBody,
        description:
            "The amount of energy spent by the student, also an indicator of fatigue. This is determined by calculating the jerk, the third derivative of the position skeletal body.",
        calculationTime: 3,
        enabled: true
    },
    [Variable.EducationalSpecificEmotions]: {
        name: "Educational-specific Emotions",
        device: Device.VideoFace,
        description: "Emotions that the student is experiencing in an educational setting.",
        enabled: true
    }
};

export const emotionsColorMapper: {[key: string]: string} = {
    boredom: "#F15025",
    frustration: "#191919",
    confusion: "#FFE45E",
    delight: "#6782B7"
};

export const emotionsIndexMapper: {[key: string]: number} = {
    boredom: 0,
    frustration: 1,
    confusion: 2,
    delight: 3
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
