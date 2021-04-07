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
        if len(data) == 0 or (len(data) == 1 and self.prev_data_point == None):
            return self.prev_pd
        elif len(data) == 1:
            return self.calculate(self.prev_data_point.fx, self.prev_data_point.fy, data[0].fx, data[0].fy, self.prev_data_point.endTime, data[0].initTime)

        pd_points = []
        for i in range(1, len(data)):
            prev_fx = data[i-1].fx
            prev_fy = data[i-1].fy
            new_fx = data[i].fx
            new_fy = data[i].fy
            prev_end_time = data[i-1].endTime
            new_init_time = data[i].initTime
            pd_points.append(self.calculate(prev_fx, prev_fy,
                                            new_fx, new_fy, prev_end_time, new_init_time))
        self.prev_data_point = data[-1]
        current_pd = statistics.mean(pd_points)
        self.prev_pd = current_pd
        return current_pd

    def calculate(self, fx0, fy0, fx1, fy1, et0, it1):
        # The Euclidian distance between two fixations
        saccade_length = np.linalg.norm(
            np.array([fx0, fy0]) - np.array([fx1, fy1]))

        # Duration between end time of previous fixation and start time of the new fixation
        saccade_duration = it1 - et0

        # Defintion of speed/velocity
        saccade_speed = saccade_length / saccade_duration

        # Forumla for perceived difficulty
        perceived_difficulty = 1 / (1 + saccade_speed)
        return perceived_difficulty * 100


# ------------------------------------------------------#
# The following is for testing purposes
# Table columns: fixationID, init_time, end_time, fixationX, fixationY
data_sample = [
    [386, 111, 203, 1054, 720],
    [387, 309, 399, 1166, 672],
    [388, 467, 539, 1087, 653],
    [389, 809, 1219, 1052, 599],
    [390, 1308, 1499, 1048, 621],
    [391, 1609, 1701, 1069, 664],
    [392, 1927, 2044, 717, 566],
    [393, 2088, 2239, 856, 636],
    [394, 2267, 2358, 821, 652]
]


def main_pd(data):
    """ This is used for testing purposes """
    for i in range(1, len(data)):
        prev_fx = data[i-1][-2]
        prev_fy = data[i-1][-1]
        new_fx = data[i][-2]
        new_fy = data[i][-1]
        # prev_init_time = data[i-1][1]
        prev_end_time = data[i-1][2]
        new_init_time = data[i][1]
        # new_end_time = data[i][2]
        print(PerceivedDifficultyCalculator().calculate(prev_fx, prev_fy, new_fx,
                                                        new_fy, prev_end_time, new_init_time))
