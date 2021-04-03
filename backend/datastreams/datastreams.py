
class Datastreams:

    """
        This class works as a interface where the datastreams subclasses need to implement the empty methods.
    """

    def start(self):
        pass

    def terminate(self):
        pass

    def clear_current_data(self):
        pass

    def get_current_acc_data(self):
        pass

    def get_current_bvp_data(self):
        pass

    def get_current_eda_data(self):
        pass

    def get_current_hr_data(self):
        pass

    def get_current_ibi_data(self):
        pass

    def get_current_temp_data(self):
        pass

    def get_current_eye_tracking_data(self):
        pass

    def get_current_skeleton_data(self):
        pass

    def get_curent_au_data(self):
        pass
