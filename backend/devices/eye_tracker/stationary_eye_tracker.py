import tobii_research as tr
import math
from utils.fixation_classifier import FixationClassifier


class StationaryEyeTracker():

    fixation_classifier = FixationClassifier()

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

    def subscribe(self):
        if hasattr(self, "stationary_eye_tracker"):
            self.stationary_eye_tracker.subscribe_to(tr.EYETRACKER_GAZE_DATA,
                                                     self.gaze_data_callback, as_dictionary=True)

    def unsubscribe(self):
        if hasattr(self, "stationary_eye_tracker"):
            self.stationary_eye_tracker.unsubscribe_from(
                tr.EYETRACKER_GAZE_DATA, self.gaze_data_callback)

    def gaze_data_callback(self, gaze_data):
        fx, fy = self.get_coordinate(gaze_data)

        if (fx != None and fy != None):
            lpup, rpup = self.get_pupil_diameters(gaze_data)

            timestamp = gaze_data["system_time_stamp"]

            self.fixation_classifier.check_fixation(
                timestamp, lpup, rpup, fx, fy)

    def get_coordinate(self, gaze_data):
        left_x = gaze_data["left_gaze_point_on_display_area"][0]
        left_y = gaze_data["left_gaze_point_on_display_area"][1]
        right_x = gaze_data["right_gaze_point_on_display_area"][0]
        right_y = gaze_data["right_gaze_point_on_display_area"][1]

        left_valid = False
        right_valid = False

        if (gaze_data["left_gaze_point_validity"] == 1 and
            (not math.isnan(left_x) and
             not math.isnan(left_y))):
            left_valid = True

        if (gaze_data["right_gaze_point_validity"] == 1 and
            (not math.isnan(right_x) and
             not math.isnan(right_y))):
            right_valid = True

        if (left_valid and right_valid):
            coordinate_x = left_x + right_x / 2
            coordinate_y = left_y + right_y / 2
        elif (left_valid and not right_valid):
            coordinate_x = left_x
            coordinate_y = left_y
        elif (right_valid and not left_valid):
            coordinate_x = right_x
            coordinate_y = right_y
        else:
            return None, None

        # Clamp the coordinates to stay inside screen
        coordinate_x = max(0, min(coordinate_x, 1))
        coordinate_y = max(0, min(coordinate_y, 1))

        return coordinate_x, coordinate_y

    def get_pupil_diameters(self, gaze_data):
        left_d = gaze_data["left_pupil_diameter"]
        right_d = gaze_data["right_pupil_diameter"]

        return left_d, right_d

    def get_current_data(self):
        return self.fixation_classifier.get_current_fixations()

    def clear_current_data(self):
        self.fixation_classifier.clear_current_fixations()
