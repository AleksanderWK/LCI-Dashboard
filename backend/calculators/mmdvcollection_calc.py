from datastreams import Datastreams
from datamodels.mmdvcollection import MMDVCollection
from calculators.pd_calc import PerceivedDifficultyCalculator
from calculators.ipi_calc import InformationProcessingIndexCalculator
from calculators.esf_calc import EnergySpentFatigue
from calculators.cl_calc import CognitiveLoadCalculator
from calculators.pa_calc import PhysiologicalArousalCalculator


class MMDVCollectionCalculator:

    """
        This class calculates a MMD Variable Collection based on the data from the datastream it gets.
        It delegates the actual calculations to the MMDVCalculator-subclasses.
    """

    ds = None
    cl_calc = None
    pd_calc = None
    ipi_calc = None

    def __init__(self, ds: Datastreams):
        self.ds = ds
        self.cl_calc = CognitiveLoadCalculator()
        self.pd_calc = PerceivedDifficultyCalculator()
        self.ipi_calc = InformationProcessingIndexCalculator()
        self.esf_calc = EnergySpentFatigue()
        self.pa_calc = PhysiologicalArousalCalculator()

    def calculate_all(self):
        result = MMDVCollection()
        eye_tracking_data = self.ds.get_current_eye_tracking_data()
        result.cl = self.cl_calc.calculate_dataset(eye_tracking_data)
        result.pd = self.pd_calc.calculate_dataset(eye_tracking_data)
        result.ipi = self.ipi_calc.calculate_dataset(eye_tracking_data)
        result.esf = self.esf_calc.calculate_dataset(self.ds.get_current_skeleton_data())
        result.pa = self.pa_calc.calculate_dataset(self.ds.get_current_eda_data())
        return result
