from datastreams.datastreams import Datastreams
from datamodels.mmdvcollection import MMDVCollection
from calculators.pd_calc import PerceivedDifficultyCalculator
from calculators.eng_calc import EngagementCalculator
from calculators.ipi_calc import InformationProcessingIndexCalculator
from calculators.esf_calc import EnergySpentFatigue
from calculators.cl_calc import CognitiveLoadCalculator
from calculators.pa_calc import PhysiologicalArousalCalculator
from calculators.ese_calc import EducationSpecificEmotionsCalculator
from calculators.ps_calc import PhysiologicalStressCalculator


class MMDVCollectionCalculator:

    """
        This class calculates a MMD Variable Collection based on the data from the datastream it gets.
        It delegates the actual calculations to the MMDVCalculator-subclasses.
    """

    ds = None

    def __init__(self, ds: Datastreams):
        """
            ds - is the datastreams that can either be implemented (currently) as a FileDatastream-object or a DeviceDatastream-object, see the datastreams folder for more info.
            Rest of the constructor sets up the calculators. The calculators have state so they have to be initialized, and the same calculator-instances needs to be used each time.
        """
        self.ds = ds
        self.cl_calc = CognitiveLoadCalculator()
        self.pd_calc = PerceivedDifficultyCalculator()
        self.ipi_calc = InformationProcessingIndexCalculator()
        self.esf_calc = EnergySpentFatigue()
        self.pa_calc = PhysiologicalArousalCalculator()
        self.eng_calc = EngagementCalculator()
        self.ese_calc = EducationSpecificEmotionsCalculator()
        self.ps_calc = PhysiologicalStressCalculator()

    def calculate_all(self):
        """
            Gets the current data from the datastream-object, then calculates all the variables with the calculators.
            It returns the result as a MMDVCollection-object, see this datamodels/mmdvcollection.py for more info. 
        """
        result = MMDVCollection()
        
        # Get data
        eye_tracking_data = self.ds.get_current_eye_tracking_data()
        skeleton_data = self.ds.get_current_skeleton_data()
        eda_data = self.ds.get_current_eda_data()
        bvp_data = self.ds.get_current_bvp_data()
        au_data = self.ds.get_current_au_data()
        
        # Calculate variables
        result.cl = self.cl_calc.calculate_dataset(eye_tracking_data)
        result.pd = self.pd_calc.calculate_dataset(eye_tracking_data)
        result.ipi = self.ipi_calc.calculate_dataset(eye_tracking_data)
        result.pa = self.pa_calc.calculate_dataset(eda_data)
        result.eng = self.eng_calc.calculate_dataset(eda_data)
        result.ese = self.ese_calc.calculate_dataset(au_data)
        result.esf = self.esf_calc.calculate_dataset(skeleton_data)
        result.ps = self.ps_calc.calculate_dataset(bvp_data)

        return result
