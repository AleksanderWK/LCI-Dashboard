from calculators.mmdvcalc import MMDVCalculator
from datamodels.wristband import EDADataPoint
from typing import List


class PhysiologicalArousalCalculator(MMDVCalculator):

    EDA_FREQUENCY = 4  # in Hz (i.e. times per second)
    TIME_INTERVAL = 8  # in seconds

    data_interval = []

    def calculate_dataset(self, data: List[EDADataPoint]):
        if len(data) == 0:
            return -1

        self.updateInterval(data)

        if (len(self.data_interval) >= self.EDA_FREQUENCY * self.TIME_INTERVAL):
            # Find and return the average of the eda points in the data interval
            average_eda = sum(
                list(map(lambda eda: eda.value, self.data_interval))) / len(self.data_interval)

            return average_eda
        else:
            return -1

    def updateInterval(self, data: List[EDADataPoint]):
        # Add the new data to the data interval
        self.data_interval.extend(data)

        # If the interval is too big, remove the first elements so it becomes the size it should be
        interval_size = self.EDA_FREQUENCY * self.TIME_INTERVAL
        if len(self.data_interval) > interval_size:
            self.data_interval = self.data_interval[len(
                self.data_interval) - interval_size:]
