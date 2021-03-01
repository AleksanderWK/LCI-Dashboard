import json

class MMDVVector:
    
    cl  = None  # Cognitive Load
    pd  = None  # Precieved Difficulty
    fam = None  # Familiarity
    ipd = None  # Information Processing Index
    pa  = None  # Physical Arousal
    eng = None  # Engagement
    ps  = None  # Physological Stress
    er  = None  # Emotional Regulation
    ms  = None  # Motion Stability
    esf = None  # Energy Spent/Fatigue

    def __init__(self):
        self.cl  = 0
        self.pd  = 0
        self.fam = 0
        self.ipd = 0
        self.pa  = 0
        self.eng = 0
        self.ps  = 0
        self.er  = 0
        self.ms  = 0
        self.esf = 0

    def get_json(self):
        return json.dumps(self.__dict__)