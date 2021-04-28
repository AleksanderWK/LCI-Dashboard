
class Datastreams:

    """
        This class works as a interface where the datastreams subclasses need to implement the empty methods.
        The Datastream-class contains start-method, terminate-method, getters for the current raw data that have been streamed before it has been cleared by the clear-method.
        All the getters will return lists of objects for the raw data, look at the datamodels folder for details of these classes.
    """

    def __init__(self):
        """
        The constructor should contain all code that needs to be run before the start-method. This could be all sorts of setup, either if its related to devices or files or any other implementation.
        """
        pass

    def start(self):
        """
        This method starts the data streaming, i.e. the current_data lists will start getting populated.
        """
        pass

    def terminate(self):
        """
        This method terminates the data streaming, i.e. the current_data lists will stop getting populated.
        """
        pass

    def clear_current_data(self):
        """
        This method will clear all the current_data lists. This means that all get_current_data-methods should return empty lists shortly after this has been called.
        """
        pass


    # -----------------------------------------------------------------------------------------------------
    #           All the rest of the methods are getters for the current raw data
    # -----------------------------------------------------------------------------------------------------
    def get_current_acc_data(self):
        """
        Gets the current raw data for wristband acceleration. Will return a list of AccDataPoint-objects found in datamodels/wristband.py.
        """
        pass

    def get_current_bvp_data(self):
        """
        Gets the current raw data for wristband BVP (Blood Volume Pulse). Will return a list of BVPDataPoint-objects found in datamodels/wristband.py.
        """
        pass

    def get_current_eda_data(self):
        """
        Gets the current raw data for wristband EDA. Will return a list of EDADataPoint-objects found in datamodels/wristband.py.
        """
        pass

    def get_current_hr_data(self):
        """
        Gets the current raw data for wristband Heart Rate. Will return a list of HRDataPoint-objects found in datamodels/wristband.py.
        """
        pass

    def get_current_ibi_data(self):
        """
        Gets the current raw data for wristband IBI. Will return a list of IBIDataPoint-objects found in datamodels/wristband.py.
        """
        pass

    def get_current_temp_data(self):
        """
        Gets the current raw data for wristband Temperature. Will return a list of TempDataPoint-objects found in datamodels/wristband.py.
        """
        pass

    def get_current_eye_tracking_data(self):
        """
        Gets the current raw data for Eye Tracking, which includes fixation and pupil data. Will return a list of EyeTrackingDataPoint-objects found in datamodels/eye_tracking.py.
        """
        pass

    def get_current_skeleton_data(self):
        """
        Gets the current raw data for Skeletal body, which includes position of each skeletal node. Will a single (not a list) SkeletalNodeCollection-object found in datamodels/skeletal.py.
        """
        pass

    def get_current_au_data(self):
        """
        Gets the current raw data for Emotion Action Units. Will return a list of OpenFaceDataPoint-objects found in datamodels/camera.py.
        """
        pass
