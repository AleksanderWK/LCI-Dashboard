from datastreams.datastreams import Datastreams
from datastreams.openface.openface import OpenFaceInstance
from datamodels.skeletal import SkeletalNodeCollection


class DeviceDatastreams(Datastreams):

    openface = None  # OpenFace Instance

    def __init__(self):
        self.openface = OpenFaceInstance()
        self.openface.startProcess()

    def start(self):
        self.openface.startDataRead()

    def terminate(self):
        self.openface.stopDataRead()
        self.openface.terminateProcess()

    def clear_current_data(self):
        self.openface.clearCurrentData()

    def get_current_au_data(self):
        return self.openface.getCurrentData()

    def get_current_acc_data(self):
        return []

    def get_current_bvp_data(self):
        return []

    def get_current_eda_data(self):
        return []

    def get_current_hr_data(self):
        return []

    def get_current_ibi_data(self):
        return []

    def get_current_temp_data(self):
        return []

    def get_current_skeleton_data(self):
        return SkeletalNodeCollection([])

    def get_current_eye_tracking_data(self):
        return []
