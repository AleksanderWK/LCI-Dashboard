from datastreams import Datastreams
from datamodels.mmdvcollection import MMDVCollection
from calculators.pdcalc import PerceivedDifficultyCalculator
from calculators.engcalc import EngagementDifficultyCalculator


class MMDVCollectionCalculator:

    """
        This class calculates a MMD Variable Collection based on the data from the datastream it gets.
        It delegates the actual calculations to the MMDVCalculator-subclasses.
    """

    pd_calc = None
    eng_calc = None
    ds = None

    def __init__(self, ds: Datastreams):
        self.ds = ds
        self.pd_calc = PerceivedDifficultyCalculator()
        self.eng_calc = EngagementDifficultyCalculator()

    def calculate_all(self):
        result = MMDVCollection()
        result.pd = self.pd_calc.calculate_dataset(
            self.ds.get_current_eye_tracking_data())
        result.eng = self.eng_calc.calculate_dataset(
            self.ds.get_current_eda_data())
        return result
