import math
import statistics
import time
from calculators.mmdvcalc import MMDVCalculator
from datamodels.eye_tracking import EyeTrackingDataPoint
from typing import List


class InformationProcessingIndexCalculator(MMDVCalculator):

    prev_data_point = []
    local_count = []
    global_count = []
    # Default values
    last_end_time = 0
    min_ipi = 0
    med_ipi = 0.5
    max_ipi = 1
    # Default local/global processing ratio
    prev_ipi = med_ipi
    # The timeframe in which the ratio is calculated, older values should be discarded
    timeframe_ms = 5000



    def __init__(self):
        pass

    def calculate_dataset(self, data: List[EyeTrackingDataPoint]):
        # If no data is provided, return previous/default IPI
        if len(data) == 0:
            return self.prev_ipi * 100
        # If only a single datapoint is provided and it is the first, store it and return previous/defualt IPI
        elif len(data) == 1 and not self.prev_data_point:
            self.prev_data_point = data[0]
            return self.prev_ipi * 100
        else:
            # Add the previous datapoint to the start of the data
            if self.prev_data_point:
                data.insert(0, self.prev_data_point)
            # Loop through all subsequent pairs of datapoints, i and i-1
            for i in range(1, len(data)):
                # Get the three time values we need for calculating fixation and saccade duration
                prev_init_time = data[i-1].initTime
                prev_end_time = data[i-1].endTime
                new_init_time = data[i].initTime

                self.update_ipi(prev_init_time, prev_end_time, new_init_time)
            
            self.prev_data_point = data[-1]

         # The lists of time values are ordered, remove first element until it's within the timeframe
        while self.local_count and self.last_end_time - self.local_count[0] > self.timeframe_ms:
            self.local_count.pop(0)
        while self.global_count and self.last_end_time - self.global_count[0] > self.timeframe_ms:
            self.global_count.pop(0)

        # Calculate ratio of local processings to the sum of both local and global processings
        if not self.local_count and not self.global_count:
            self.last_ipi = self.med_ipi
        elif not self.global_count:
            self.last_ipi = self.max_ipi
        elif not self.local_count:
            self.last_ipi = self.min_ipi
        else:
            self.last_ipi = (len(self.local_count)/(len(self.local_count)+len(self.global_count)))
        
        return self.last_ipi * 100

    # Calculate fixation and saccade duration and decide local or global processing
    def update_ipi(self, prev_init_time, prev_end_time, new_init_time):
        # Duration of fixation is from init_time to same end_time
        fixation_duration = prev_end_time - prev_init_time
        # Duration of saccada is from end_time to next init_time
        saccade_duration = new_init_time - prev_end_time
        # The last time value that was processed
        end_time = new_init_time

        # Store end time in either local or global count
        if fixation_duration > saccade_duration:
            self.local_count.append(end_time)
        elif fixation_duration < saccade_duration:
            self.global_count.append(end_time)
        self.last_end_time = end_time
