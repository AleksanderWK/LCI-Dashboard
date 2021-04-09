import json


class MMDVCollection:

    """
    Class that represents a collection of all the MMD Variables.
    """

    cl = None  # Cognitive Load
    pd = None  # Precieved Difficulty
    fam = None  # Familiarity
    ipi = None  # Information Processing Index
    pa = None  # Physical Arousal
    eng = None  # Engagement
    ps = None  # Physological Stress
    er = None  # Emotional Regulation
    ms = None  # Motion Stability
    esf = None  # Energy Spent/Fatigue
    ese = None  # Education Specific Emotions

    def __init__(self):
        self.cl = -1
        self.pd = -1
        self.fam = -1
        self.ipi = -1
        self.pa = -1
        self.eng = -1
        self.ps = -1
        self.er = -1
        self.ms = -1
        self.esf = -1
        self.ese = {"boredom": False, "frustration": False,
                    "confusion": False, "delight": False}

    def get_json(self):
        return json.dumps(self.__dict__)
