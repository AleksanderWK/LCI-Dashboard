// Frequency in Hz (cycles per second)
export const FREQUENCY = 1;

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
}

export const MMDVariables: {[key in Variable]: MMDVariableInfo} = {
    [Variable.CognitiveLoad]: {
        name: "Cognitive Load",
        device: Device.EyeTracker,
        description:
            "Cognitive load refers to the amount of information that the working memory of a person can hold at once. In an educational setting, it is the effort needed for a learner to learn new information."
    },
    [Variable.PerceivedDifficulty]: {
        name: "Perceived Difficulty",
        device: Device.EyeTracker,
        description:
            "Perceived difficulty is the perception of the ease or difficulty of performing in an educational context."
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
            "The ratio of local (100) and global (0) information processing. Staring at one point is local processing, while rapidly scanning a larger area is global processing."
    },
    [Variable.PhysiologicalArousal]: {
        name: "Physiological Arousal",
        device: Device.Wristband,
        description: ""
    },
    [Variable.Engagement]: {
        name: "Engagement",
        device: Device.Wristband,
        description: ""
    },
    [Variable.PhysiologicalStress]: {
        name: "Physiological Stress",
        device: Device.Wristband,
        description: ""
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
        description: ""
    }
};
