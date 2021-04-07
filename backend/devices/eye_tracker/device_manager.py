from devices.eye_tracker.stationary_eye_tracker import StationaryEyeTracker


class DeviceManager():

    def __init__(self):
        self.stationary_eye_tracker = StationaryEyeTracker()

    def subscribe_to_all_devices(self):
        self.stationary_eye_tracker.subscribe()

    def unsubscribe_to_all_devices(self):
        self.stationary_eye_tracker.unsubscribe()
