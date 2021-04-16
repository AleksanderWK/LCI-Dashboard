import tobii_research as tr
import math
import numpy as np
import ctypes
from datamodels.eye_tracking import EyeTrackingDataPoint
import warnings


# A gaze point is added to the fixation if its distance
# to the previous gaze point is below DISTANCE_THRESHOLD.
# Active Display Coordinate System (ADCS) is used, going from
# (0,0) in top left corner to (1,1) in bottom right corner.

# ASSUMPTION: Screen size is 14" with 16:9 aspect ratio (width: 322 mm)

# ASSUMPTION: Fixation happens within a radius of 26 mm to the previous point.
# This assumption can be made because the subject sits at the same distance from
# the screen no matter how big the screen is.

# DISTANCE_THRESHOLD = 26 mm / (screen width in millimeters)
# For 14" 16:9 screen: 26 mm / 322 mm = 0.08
DISTANCE_THRESHOLD = 0.08

# A fixation is kept if it contains at least GAZE_POINT_THRESHOLD number of
# gaze points (filters small wrongly classified fixations during saccades)
GAZE_POINT_THRESHOLD = 5

# Screen resolution is just to scale up the values calculated for fx and fy, and should not be changed
SCREEN_RESOLUTION = 1920, 1080


class StationaryEyeTracker():

    # A list of all fixations calculated in this batch
    current_fixations = []

    current_fixation_id = 0
    current_fixation_init_time = None
    # A list of gaze points in the fixation, with format: [lpup, rpup, fx, fy]
    current_fixation_points = []

    # Previous gaze data, with format: [timestamp, lpup, rpup, fx, fy]
    prev_gaze_data = None

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

            if (self.prev_gaze_data != None):

                # Calculate Euclidean distance between current point and previous point
                distance = np.linalg.norm(
                    np.array([self.prev_gaze_data[3], self.prev_gaze_data[4]]) - np.array([fx, fy]))

                # If distance is below the threshold, the point is part of the fixation
                if (distance < DISTANCE_THRESHOLD):
                    if (self.current_fixation_init_time == None):
                        # Initialization of fixation
                        self.current_fixation_init_time = round(
                            self.prev_gaze_data[0] / 1000)

                        # Add prev point to fixation points list
                        self.current_fixation_points.append(
                            [self.prev_gaze_data[1], self.prev_gaze_data[2],  self.prev_gaze_data[3], self.prev_gaze_data[4]])

                    # Add current point to fixation points list
                    self.current_fixation_points.append([lpup, rpup, fx, fy])

                else:
                    if (self.current_fixation_init_time != None):
                        # Fixation is over

                        # Keep fixation if it has enough gaze points
                        if (len(self.current_fixation_points) >= GAZE_POINT_THRESHOLD):
                            self.current_fixation_id += 1
                            end_time = round(self.prev_gaze_data[0] / 1000)

                            # Suppress warnings that come from for example all left pupil diameters being NaN
                            with warnings.catch_warnings():
                                warnings.simplefilter(
                                    "ignore", category=RuntimeWarning)
                                mean_values = np.nanmean(
                                    np.asarray(self.current_fixation_points), axis=0)

                            mean_fx_screen, mean_fy_screen = self.map_to_screen_resolution(
                                mean_values[2], mean_values[3])

                            fixation = [self.current_fixation_id, self.current_fixation_init_time,
                                        end_time, mean_values[0], mean_values[1], mean_fx_screen, mean_fy_screen]

                            self.current_fixations.append(
                                EyeTrackingDataPoint(fixation))

                            # Clear fixation data
                            self.current_fixation_init_time = None
                            self.current_fixation_points = []
                            self.prev_gaze_data = None
                            return

            self.prev_gaze_data = [timestamp, lpup, rpup, fx, fy]

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

    def map_to_screen_resolution(self, x, y):
        return round(x * SCREEN_RESOLUTION[0]), round(y * SCREEN_RESOLUTION[1])

    def get_current_data(self):
        return self.current_fixations

    def clear_current_data(self):
        self.current_fixations.clear()
