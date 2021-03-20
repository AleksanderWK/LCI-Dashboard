import math
import statistics
import time
from calculators.mmdvcalc import MMDVCalculator
from datamodels.eye_tracking import EyeTrackingDataPoint
from typing import List


class InformationProcessingIndexCalculator(MMDVCalculator):

    
    prev_ipi = 0.5 # Equal ratio local/global processing
    prev_data_point = []
    last_end_time = 0
    local_count = []
    global_count = []
    timeframe_ms = 10000
    min_ipi = 0
    med_ipi = 0.5
    max_ipi = 1

    def __init__(self):
        pass

    def calculate_dataset(self, data: List[EyeTrackingDataPoint]):
        # Return last index if insufficient data is provided
        if len(data) == 0:
            return self.prev_ipi
        elif len(data) == 1 and not self.prev_data_point:
            self.prev_data_point = data[0]
            return self.prev_ipi
        # Update the index ratio using the last
        else:
            if self.prev_data_point:
                data.insert(0, self.prev_data_point)
            for i in range(1, len(data)):
                prev_init_time = data[i-1].initTime
                prev_end_time = data[i-1].endTime
                new_init_time = data[i].initTime
                #new_end_time = data[i][2]
                self.update_ipi(prev_init_time, prev_end_time, new_init_time)

            self.prev_data_point = data[-1]

        # Remove counts older than timeframe
        while self.local_count and self.last_end_time - self.local_count[0] > self.timeframe_ms:
            self.local_count.pop()
        while self.global_count and self.last_end_time - self.global_count[0] > self.timeframe_ms:
            self.global_count.pop()
            

        # Calculate ratio
        if not self.local_count and not self.global_count:
            self.last_ipi = self.med_ipi
        elif not self.global_count:
            self.last_ipi = self.max_ipi
        elif not self.local_count:
            self.last_ipi = self.min_ipi
        else:
            self.last_ipi = len(self.local_count)/(len(self.local_count)+len(self.global_count))
        return self.last_ipi

    def update_ipi(self, prev_init_time, prev_end_time, new_init_time):
        fixation_duration = prev_end_time - prev_init_time
        saccade_duration = new_init_time - prev_end_time
        end_time = new_init_time

        if fixation_duration > saccade_duration:
            self.local_count.append(end_time)
        elif fixation_duration < saccade_duration:
            self.global_count.append(end_time)
        self.last_end_time = end_time

# ------------------------------------------------------#
# The following is for testing purposes
# Table columns: fixationID, init_time, end_time, fixationX, fixationY
""" data_sample1 = [
    [386, 111, 203, 1054, 720],
    [387, 309, 399, 1166, 672],
    [388, 467, 539, 1087, 653],
    [389, 809, 1219, 1052, 599],
    [390, 1308, 1499, 1048, 621]]

data_sample2 = [
    [391, 1609, 1701, 1069, 664],
    [392, 1927, 2044, 717, 566],
    [393, 2088, 2239, 856, 636],
    [394, 2267, 2358, 821, 652]
]


def main_ipi():
    # This is used for testing purposes
    print(InformationProcessingIndexCalculator().calculate_dataset(data_sample1))
    print(InformationProcessingIndexCalculator().calculate_dataset(data_sample2)) """