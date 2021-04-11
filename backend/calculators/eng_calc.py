import neurokit2 as nk
import numpy as np
from calculators.mmdvcalc import MMDVCalculator
import pandas as pd


class EngagementCalculator(MMDVCalculator):

    EDA_FREQUENCY = 4  # in Hz (i.e. times per second)
    TIME_INTERVAL = 4  # in seconds

    data_interval = []

    prev_eng = None

    def __init__(self):
        pass

    def calculate_dataset(self, data):
        if len(data) == 0:
            return -1

        self.updateInterval(data)

        if (len(self.data_interval) >= self.EDA_FREQUENCY * self.TIME_INTERVAL):
            cleanEDA = nk.eda_clean(self.data_interval[:16])
            phasicEDA = nk.eda_phasic(cleanEDA, sampling_rate=8)
            tonicEDA = sorted(phasicEDA.get("EDA_Tonic").values)

            area = np.trapz(y=tonicEDA, dx=0.125)

            if (area > 0):
                self.prev_eng = area
                return area
            elif (area < 0 and self.prev_eng != None):
                return self.prev_eng

        return -1

    def updateInterval(self, data):
        # Add the new data to the data interval
        self.data_interval.extend(map(lambda x: x.value, data))

        # If the interval is too big, remove the first elements so it becomes the size it should be
        interval_size = self.EDA_FREQUENCY * self.TIME_INTERVAL
        if len(self.data_interval) > interval_size:
            self.data_interval = self.data_interval[len(
                self.data_interval) - interval_size:]
