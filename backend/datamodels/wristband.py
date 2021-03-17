
class AccDataPoint:

    x = None
    y = None
    z = None

    def __init__(self, dataRow):
        self.x = dataRow[0]
        self.y = dataRow[1]
        self.z = dataRow[2]


class IBIDataPoint:

    initTime = None
    duration = None

    def __init__(self, dataRow):
        self.initTime = dataRow[0]
        self.duration = dataRow[1]


class EDADataPoint:

    value = None

    def __init__(self, dataRow):
        self.value = dataRow[0]


class BVPDataPoint:

    value = None

    def __init__(self, dataRow):
        self.value = dataRow[0]


class HRDataPoint:

    value = None

    def __init__(self, dataRow):
        self.value = dataRow[0]


class TempDataPoint:

    value = None

    def __init__(self, dataRow):
        self.value = dataRow[0]
