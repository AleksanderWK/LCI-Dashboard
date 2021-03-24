
class EyeTrackingDataPoint:
    """
    Class that represents a row in the eye-tracking dataset.
    """

    # Columns as can be seen in the csv data files for eye-tracking
    eyeMovementTypeIndex = None
    initTime = None
    endTime = None
    lpup = None
    rpup = None
    fx = None
    fy = None

    def __init__(self, dataRow):
        self.eyeMovementTypeIndex = dataRow[0]
        self.initTime = dataRow[1]
        self.endTime = dataRow[2]
        self.lpup = dataRow[3]
        self.rpup = dataRow[4]
        self.fx = dataRow[5]
        self.fy = dataRow[6]
