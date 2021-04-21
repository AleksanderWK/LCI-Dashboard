"""
    Classifies and keeps track of fixations
"""

import numpy as np
import warnings
from datamodels.eye_tracking import EyeTrackingDataPoint

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


class FixationClassifier():

    # A list of all fixations calculated in this batch
    current_fixations = []

    current_fixation_id = 0
    current_fixation_init_time = None
    # A list of gaze points in the fixation, with format: [lpup, rpup, fx, fy]
    current_fixation_points = []

    # Previous gaze data, with format: [timestamp, lpup, rpup, fx, fy]
    prev_gaze_data = None

    def check_fixation(self, timestamp, lpup, rpup, fx, fy):
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

    def map_to_screen_resolution(self, x, y):
        return round(x * SCREEN_RESOLUTION[0]), round(y * SCREEN_RESOLUTION[1])

    def get_current_fixations(self):
        print(self.current_fixations)
        return self.current_fixations

    def clear_current_fixations(self):
        self.current_fixations.clear()
