import neurokit2 as nk
import numpy as np
from datamodels.wristband import EDADataPoint
from calculators.mmdvcalc import MMDVCalculator
import pandas as pd
from typing import List


class EngagementCalculator(MMDVCalculator):
    dataList = []

    def __init__(self):
        pass

    def check_length(self, data):
        if len(data) == 16:
            return True
        return False

    def calculate_dataset(self, data):
        for i in data:
            self.dataList.append(i.value)

        print(self.dataList)
        if len(self.dataList) >= 16:
            cleanEDA = nk.eda_clean(self.dataList[:16])
            phasicEDA = nk.eda_phasic(cleanEDA, sampling_rate=8)
            tonicEDA = sorted(phasicEDA.get("EDA_Tonic").values)
            area = np.trapz(y=tonicEDA, dx=0.125)
            print(area)
            for i in range(len(self.dataList.copy())):
                if len(self.dataList) == 16:
                    break
                self.dataList.pop(0)
            return area/100

        return -1
