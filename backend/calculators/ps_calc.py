from calculators.mmdvcalc import MMDVCalculator
from datamodels.wristband import BVPDataPoint
from typing import List
import heartpy as hp
import numpy
import warnings
import math


class PhysiologicalStressCalculator(MMDVCalculator):

    default_ps = 50
    data_interval = numpy.array([])
    BVP_FREQUENCY = 64
    TIME_INTERVAL = 120 # in seconds
    INTERVAL_SIZE = BVP_FREQUENCY * TIME_INTERVAL

    def __init__(self):
        pass

    warnings.filterwarnings("ignore")

    def calculate_dataset(self, data: List[BVPDataPoint]):
        try:
            self.updateInterval(data)
            # If the added data is insufficient
            if self.data_interval.size < self.INTERVAL_SIZE:
                # DEBUG: print(self.data_interval.size, "/", self.INTERVAL_SIZE)
                return -1
            # Load a HeartPy heart signal using the data interval, its frequency, and enable frequency domain measures
            wd, m = hp.process(self.data_interval,
                               self.BVP_FREQUENCY, calc_freq=True)
            # Transform the heart signal to the frequency domain
            wd, m = hp.analysis.calc_fd_measures(
                method='fft', measures=m, working_data=wd)¨
            # Get the LF and HF measures
            lf = m["lf"]
            hf = m["hf"]
            # If both LF and HF is zero return default value
            if(lf + hf == 0):
                return self.default_ps
            # Normalize LF/HF to value between 0 and 100
            lfhf = (lf/(lf+hf))*100

            # Ensure the calculated number is valid
            if (not math.isnan(lfhf)):
                return lfhf
            else:
                return -1
        except:
            return -1

    def updateInterval(self, data: List[BVPDataPoint]):
        # Add the new data to the data interval
        data_array = numpy.array(list(map(lambda bvp: bvp.value, data)))
        self.data_interval = numpy.append(
            self.data_interval, data_array).flatten()

        # If the interval is too big, remove oldest elements so it becomes the appropriate size
        if self.data_interval.size > self.INTERVAL_SIZE:
            self.data_interval = self.data_interval[self.data_interval.size -
                                                    self.INTERVAL_SIZE:]
