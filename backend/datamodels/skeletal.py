
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


class SkeletalNodeCollection:

    time = None
    nodes = []

    def __init__(self, dataRowList):
        for dataRow in dataRowList:
            self.nodes.append(SkeletalNodeDataPoint(dataRowList))
        self.time = self.nodes[0].time

    def getJoint(self, jointType):
        for node in self.nodes:
            if node.jointType == jointType:
                return node
