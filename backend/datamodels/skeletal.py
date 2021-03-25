
class SkeletalNodeDataPoint:

    jointType = None
    x = None
    y = None
    z = None
    time = None

    def __init__(self, dataRow):
        self.jointType = dataRow[0]
        self.x = dataRow[1]
        self.y = dataRow[2]
        self.z = dataRow[3]
        self.time = dataRow[4]

    def __str__(self):
        return str(self.jointType) + " " + str(self.x) + " " + str(self.y) + " " + str(self.z) + " " + str(self.time)


JOINT_AMOUNT = 25
class SkeletalNodeCollection:

    time = None
    nodes = []

    def __init__(self, dataRowList):
        self.nodes = []
        self.time = None
        if len(dataRowList) != 0:
            for dataRow in dataRowList:
                node = SkeletalNodeDataPoint(dataRow)
                self.nodes.append(node)
            self.time = self.nodes[-1].time
