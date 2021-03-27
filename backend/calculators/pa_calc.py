from calculators.mmdvcalc import MMDVCalculator
from datamodels.wristband import EDADataPoint
from typing import List


class PhysiologicalArousalCalculator(MMDVCalculator):

    EDA_FREQUENCY = 4 # in Hz (i.e. times per second)
    TIME_INTERVAL = 8 # in seconds

    dataInterval = []

    def calculate_dataset(self, data: List[EDADataPoint]):
        self.updateInterval(data)

        # Find and return the average of the eda points in the data interval
        average_eda = sum(list(map(lambda eda : eda.value , self.dataInterval))) / len(self.dataInterval)
        return average_eda

    def updateInterval(self, data: List[EDADataPoint]):
        # Add the new data to the data interval
        self.dataInterval.extend(data)

        # If the interval is too big, remove the first elements so it becomes the size it should be
        interval_size = self.EDA_FREQUENCY * self.TIME_INTERVAL
        if len(self.dataInterval) > interval_size:
            self.dataInterval = self.dataInterval[len(self.dataInterval) - interval_size:]