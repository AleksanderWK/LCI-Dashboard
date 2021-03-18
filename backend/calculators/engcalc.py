from calculators.mmdvcalc import MMDVCalculator
from datamodels.wristband import EDADataPoint
from typing import List


class EngagementDifficultyCalculator(MMDVCalculator):

    EDA_frequency = 4

    def __init__(self):
        pass

    def calculate_dataset(self, data: List[EDADataPoint]):
        area = 0

        # Sum all the rectangles in the time interval of the data
        for point in data:
            area += point.value * 1 / self.EDA_frequency

        # Normalize by the lenght of the interval (so that the length of the interval doesn't matter)
        return area / (len(data) / self.EDA_frequency)
