from datastreams.datastreams import Datastreams
from devices.openface.openface import OpenFaceInstance
from devices.eye_tracker.stationary_eye_tracker import StationaryEyeTracker
from datamodels.skeletal import SkeletalNodeCollection


class DeviceDatastreams(Datastreams):

    openface = None
    stationary_eye_tracker = None

    def __init__(self):
        self.openface = OpenFaceInstance()
        self.openface.startProcess()
        self.stationary_eye_tracker = StationaryEyeTracker()

    def start(self):
        self.openface.startDataRead()
        self.stationary_eye_tracker.subscribe()

    def terminate(self):
        self.openface.stopDataRead()
        self.openface.terminateProcess()
        self.stationary_eye_tracker.unsubsribe()

    def clear_current_data(self):
        self.openface.clearCurrentData()
        self.stationary_eye_tracker.clear_current_data()

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
        return self.stationary_eye_tracker.get_current_data()
