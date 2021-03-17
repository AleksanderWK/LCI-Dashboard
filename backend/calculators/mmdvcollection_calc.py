from datastreams import Datastreams
from datamodels.mmdvcollection import MMDVCollection
from calculators.pdcalc import PerceivedDifficultyCalculator


class MMDVCollectionCalculator:

    """
        This class calculates a MMD Variable Collection based on the data from the datastream it gets.
        It delegates the actual calculations to the MMDVCalculator-subclasses.
    """

    pd_calc = None
    ds = None

    def __init__(self, ds: Datastreams):
        self.ds = ds
        self.pd_calc = PerceivedDifficultyCalculator()

    def calc_pd(self):
        return self.pd_calc.calculate_dataset(self.ds.get_current_eye_tracking_data())

    def calculate_all(self):
        result = MMDVCollection()
        result.pd = self.calc_pd()
        return result
