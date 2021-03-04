// Frequency in Hz (cycles per second)
export const FREQUENCY = 2;

// Maximum time interval to show on live charts in seconds
export const LIVE_CHART_RANGE = 30;

export enum Variable {
    CognitiveLoad = "Cognitive Load",
    PerceivedDifficulty = "Perceived Difficulty",
    Familiarity = "Familiarity",
    InformationProcessingIndex = "Information Processing Index",
    PhysiologicalArousal = "Physiological Arousal",
    Engagement = "Engagement",
    PhysiologicalStress = "Physiological Stress",
    EmotionalRegulation = "Emotional Regulation",
    MotionStability = "Motion Stability",
    EnergySpentFatigue = "Energy Spent/Fatigue",
    EducationalSpecificEmotions = "Educational-specific Emotions"
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
    device: Device;
    description: string;
}

export const MMDVariables: {[key in Variable]: MMDVariableInfo} = {
    [Variable.CognitiveLoad]: {
        device: Device.EyeTracker,
        description:
            "Cognitive load refers to the amount of information that the working memory of a person can hold at once. In an educational setting, it is the effort needed for a learner to learn new information."
    },
    [Variable.PerceivedDifficulty]: {
        device: Device.EyeTracker,
        description:
            "Perceived difficulty is the perception of the ease or difficulty of performing in an educational context."
    },
    [Variable.Familiarity]: {
        device: Device.EyeTracker,
        description: ""
    },
    [Variable.InformationProcessingIndex]: {
        device: Device.EyeTracker,
        description: ""
    },
    [Variable.PhysiologicalArousal]: {
        device: Device.Wristband,
        description: ""
    },
    [Variable.Engagement]: {
        device: Device.Wristband,
        description: ""
    },
    [Variable.PhysiologicalStress]: {
        device: Device.Wristband,
        description: ""
    },
    [Variable.EmotionalRegulation]: {
        device: Device.Wristband,
        description: ""
    },
    [Variable.MotionStability]: {
        device: Device.VideoBody,
        description: ""
    },
    [Variable.EnergySpentFatigue]: {
        device: Device.VideoBody,
        description: ""
    },
    [Variable.EducationalSpecificEmotions]: {
        device: Device.VideoFace,
        description: ""
    }
};
