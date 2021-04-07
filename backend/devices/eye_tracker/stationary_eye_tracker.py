import tobii_research as tr


class StationaryEyeTracker():

    def __init__(self):
        connected_eye_trackers = tr.find_all_eyetrackers()

        for eye_tracker in connected_eye_trackers:
            if eye_tracker.model == "Tobii Pro X3-120":
                self.stationary_eye_tracker = eye_tracker
                break

        if hasattr(self, "stationary_eye_tracker"):
            print("Connected to stationary eye tracker " +
                  self.stationary_eye_tracker.model + ".")
        else:
            print("ERROR: Could not connect to stationary eye tracker.")
            quit()

    def subscribe(self):
        self.stationary_eye_tracker.subscribe_to(tr.EYETRACKER_GAZE_DATA,
                                                 self.gaze_data_callback, as_dictionary=True)

    def unsubsribe(self):
        self.stationary_eye_tracker.unsubscribe_from(
            tr.EYETRACKER_GAZE_DATA, self.gaze_data_callback)

    def gaze_data_callback(self, gaze_data):
        # Print gaze points of left and right eye
        print(gaze_data)
