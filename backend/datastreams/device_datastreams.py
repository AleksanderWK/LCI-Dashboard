from devices.openpose.openpose import OpenPoseInstance
from datastreams.datastreams import Datastreams
from devices.openface.openface import OpenFaceInstance
from devices.eye_tracker.stationary_eye_tracker import StationaryEyeTracker
from datamodels.skeletal import SkeletalNodeCollection


class DeviceDatastreams(Datastreams):

    openface = None
    openpose = None
    stationary_eye_tracker = None

    device_mode = "stationary"

    def __init__(self, device_mode):
        self.device_mode = device_mode
        if self.device_mode == "stationary":
            self.openface = OpenFaceInstance()
            self.openface.startProcess()
            self.stationary_eye_tracker = StationaryEyeTracker()
        elif self.device_mode == "mobile": 
            self.openpose = OpenPoseInstance()
            self.openpose.startProcess()

    def start(self):
        if self.device_mode == "stationary":
            self.openface.startDataRead()
            self.stationary_eye_tracker.subscribe()

    def terminate(self):
        if self.device_mode == "stationary":
            self.openface.stopDataRead()
            self.openface.terminateProcess()
            self.stationary_eye_tracker.unsubsribe()
        elif self.device_mode == "mobile":
            self.openpose.terminateProcess()

    def clear_current_data(self):
        if self.device_mode == "stationary":
            self.openface.clearCurrentData()
            self.stationary_eye_tracker.clear_current_data()
        elif self.device_mode == "mobile":
            self.openpose.clearCurrentData()

    def get_current_au_data(self):
        if self.device_mode == "stationary":
            return self.openface.getCurrentData()
        else:
            return []

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
        return self.openpose.getCurrentData()

    def get_current_eye_tracking_data(self):
        if self.device_mode == "stationary":
            return self.stationary_eye_tracker.get_current_data()
        else:
            return []
