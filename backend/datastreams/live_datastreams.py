from datastreams.datastreams import Datastreams
from datastreams.openface.openface import OpenFaceInstance


class LiveDatastreams(Datastreams):

    openface = None  # OpenFace Instance

    def __init__(self):
        self.openface = OpenFaceInstance()

    def start(self):
        self.openface.startProcess()
