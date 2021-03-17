from datastreams import Datastreams
from datamodels.mmdvcollection import MMDVCollection
from calculators.pdcalc import PerceivedDifficultyCalculator
from calculators.cl_calc import CognitiveLoadCalculator


class MMDVCollectionCalculator:

    """
        This class calculates a MMD Variable Collection based on the data from the datastream it gets.
        It delegates the actual calculations to the MMDVCalculator-subclasses.
    """

    pd_calc = None
    ds = None

    def __init__(self, ds: Datastreams):
        self.ds = ds
        self.cl_calc = CognitiveLoadCalculator()
        self.pd_calc = PerceivedDifficultyCalculator()

    def calculate_all(self):
        result = MMDVCollection()
        result.cl = self.cl_calc.calculate_dataset(
            self.ds.get_current_eye_tracking_data())
        result.pd = self.pd_calc.calculate_dataset(
            self.ds.get_current_eye_tracking_data())
        return result
