from datastreams import Datastreams
from datamodels.mmdvvector import MMDVVector
from calculators.pdcalc import PerceivedDifficultyCalculator


class MMDVVectorCalculator:

    """
        This class calculates a MMD Variable Vector based on the data from the datastream it gets.
        It delegates the actual calculations to the MMDVCalculator-subclasses.
    """

    pd_calc = None
    ds = None

    def __init__(self, ds: Datastreams):
        self.ds = ds
        self.pd_calc = PerceivedDifficultyCalculator()

    def calc_pd(self):
        return self.pd_calc.calculate_dataset(self.ds.current_eye_tracking_data)

    def calculate_all(self):
        result = MMDVVector()
        result.pd = self.calc_pd()
        return result
