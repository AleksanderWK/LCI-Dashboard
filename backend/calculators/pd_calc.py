import numpy as np
import statistics
from calculators.mmdvcalc import MMDVCalculator
from datamodels.eye_tracking import EyeTrackingDataPoint
from typing import List


class PerceivedDifficultyCalculator(MMDVCalculator):

    prev_data_point = None
    prev_pd = 0

    def __init__(self):
        pass

    def calculate_dataset(self, data: List[EyeTrackingDataPoint]):
        # Insufficient data
        if len(data) == 0 or (len(data) == 1 and self.prev_data_point == None):
            return self.prev_pd
        # One datapoint
        elif len(data) == 1:
            return self.calculate(self.prev_data_point.fx, self.prev_data_point.fy, data[0].fx, data[0].fy, self.prev_data_point.endTime, data[0].initTime)
        # Multiple datapoints:

        pd_points = []
        # Loop through all subsequent pairs of datapoints (fixations)
        for i in range(1, len(data)):
            # Get the x and y of both fixations
            prev_fx = data[i-1].fx
            prev_fy = data[i-1].fy
            new_fx = data[i].fx
            new_fy = data[i].fy
            # Get the time between the fixations
            prev_end_time = data[i-1].endTime
            new_init_time = data[i].initTime
            # Calculate PD
            pd_points.append(self.calculate(prev_fx, prev_fy,
                                            new_fx, new_fy, prev_end_time, new_init_time))
        self.prev_data_point = data[-1]
        # Get the average PD (if multiple fixations occured between two calculations)
        current_pd = statistics.mean(pd_points)
        self.prev_pd = current_pd
        return current_pd

    # Takes the arguments fixation-0 x and y, fixation-1 x and y,
    # end time of the first and init time of the second
    def calculate(self, fx0, fy0, fx1, fy1, et0, it1): 
        # The Euclidian distance between two points
        saccade_length = np.linalg.norm(
            np.array([fx0, fy0]) - np.array([fx1, fy1]))

        # Duration between end time of previous fixation and start time of the new fixation
        saccade_duration = it1 - et0

        # Defintion of velocity i.e. speed
        saccade_speed = saccade_length / saccade_duration

        # Formula for perceived difficulty
        perceived_difficulty = 1 / (1 + saccade_speed)
        return perceived_difficulty * 100
