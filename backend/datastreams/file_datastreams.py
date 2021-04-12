import pandas as pd
from datastreams.datastreams import Datastreams
from datamodels.wristband import *
from datamodels.skeletal import *
from datamodels.eye_tracking import *


class FileDatastreams(Datastreams):

    """
    This class takes the data stored in the csv-files and simulates the datastreams as if they were streamed in real-time by the devices.
    It does this by using an event loop, and scheduling data extraction at the appropriate time intervals (in the frequency of the data).
    The data that is extracted will be stored in the current_data variables as can be seen bellow.
    This data can be cleared, and is supposed to be cleared after it has been used to calculate the MMD Variables and sent to the dashboard (so it is cleared every half a second right now).
    """

    # Arrays that holds all the currently generated data before it is cleared by the main loop
    current_acc_data = []
    current_bvp_data = []
    current_eda_data = []
    current_hr_data = []
    current_ibi_data = []
    current_temp_data = []
    current_eye_tracking_data = []
    current_skeleton_data = []

    # The actual data sources (i.e. the csv files)
    acc = None
    bvp = None
    eda = None
    hr = None
    ibi = None
    temp = None
    eye_tracking = None
    skeleton = None

    terminated = False
    loop = None

    file_path = "./dataset"

    def __init__(self, studentID, loop):
        """
        studnetID is needed for reading the appropriate files. For example "S001".
        """
        self.acc = pd.read_csv(
            self.file_path + "/empatica/" + studentID + "/ACC.csv"
        )
        self.bvp = pd.read_csv(
            self.file_path + "/empatica/" + studentID + "/BVP.csv"
        )
        self.eda = pd.read_csv(
            self.file_path + "/empatica/" + studentID + "/EDA.csv"
        )
        self.hr = pd.read_csv(
            self.file_path + "/empatica/" + studentID + "/HR.csv"
        )
        self.ibi = pd.read_csv(
            self.file_path + "/empatica/" + studentID + "/IBI.csv"
        )
        self.temp = pd.read_csv(
            self.file_path + "/empatica/" + studentID + "/TEMP.csv"
        )
        self.eye_tracking = pd.read_csv(
            self.file_path + "/eye-tracking/ET-data-" + studentID + ".csv"
        )
        self.skeleton = pd.read_csv(
            self.file_path + "/skeleton/skeleton-" + studentID + ".csv"
        )
        self.loop = loop

    def generate_frequency_datastream(self, data, time, current_data, loop):
        if self.terminated:
            return
        freq = data.loc[0][0]
        current_data.append(data.loc[time])
        loop.call_later(
            1 / freq, self.generate_frequency_datastream, data, time + 1, current_data, loop
        )

    def generate_eye_tracking_datastream(self, data, row, current_data, loop):
        if self.terminated:
            return
        data_row = data.loc[row]
        end_time = data_row[2]
        next_end_time = data.loc[row + 1][2]
        current_data.append(data_row)
        loop.call_later(
            (next_end_time - end_time) /
            1000, self.generate_eye_tracking_datastream, data, row + 1, current_data, loop
        )

    def generate_skeleton_datastream(self, data, row, current_data, loop):
        if self.terminated:
            return
        row_counter = row
        time = data.loc[row][4]
        init_time = time
        while True:
            data_row = data.loc[row_counter]
            time = data_row[4]
            if time != init_time:
                break
            current_data.append(data_row)
            row_counter += 1
        loop.call_later(
            time - init_time, self.generate_skeleton_datastream, data, row_counter, current_data, loop
        )

    def start(self):
        self.loop.call_soon(
            self.generate_eye_tracking_datastream, self.eye_tracking, 1, self.current_eye_tracking_data, self.loop
        )
        self.loop.call_soon(
            self.generate_skeleton_datastream, self.skeleton, 1, self.current_skeleton_data, self.loop
        )
        self.loop.call_soon(
            self.generate_frequency_datastream, self.acc, 1, self.current_acc_data, self.loop
        )
        self.loop.call_soon(
            self.generate_frequency_datastream, self.bvp, 1, self.current_bvp_data, self.loop
        )
        self.loop.call_soon(
            self.generate_frequency_datastream, self.eda, 1, self.current_eda_data, self.loop
        )
        self.loop.call_soon(
            self.generate_frequency_datastream, self.hr, 1, self.current_hr_data, self.loop
        )
        self.loop.call_soon(
            self.generate_frequency_datastream, self.temp, 1, self.current_temp_data, self.loop
        )

    def terminate(self):
        self.clear_current_data()
        self.terminated = True

    def clear_current_data(self):
        self.current_acc_data.clear()
        self.current_bvp_data.clear()
        self.current_eda_data.clear()
        self.current_hr_data.clear()
        self.current_ibi_data.clear()
        self.current_temp_data.clear()
        self.current_eye_tracking_data.clear()
        self.current_skeleton_data.clear()

    # ----------------------------------------------------------------------
    # The following methods are getters so that you get the data as data classes we have made, not the raw data rows.

    def get_current_acc_data(self):
        return list(map(lambda row: AccDataPoint(row), self.current_acc_data))

    def get_current_bvp_data(self):
        return list(map(lambda row: BVPDataPoint(row), self.current_bvp_data))

    def get_current_eda_data(self):
        return list(map(lambda row: EDADataPoint(row), self.current_eda_data))

    def get_current_hr_data(self):
        return list(map(lambda row: HRDataPoint(row), self.current_hr_data))

    def get_current_ibi_data(self):
        return list(map(lambda row: IBIDataPoint(row), self.current_ibi_data))

    def get_current_temp_data(self):
        return list(map(lambda row: TempDataPoint(row), self.current_temp_data))

    def get_current_eye_tracking_data(self):
        return list(map(lambda row: EyeTrackingDataPoint(row), self.current_eye_tracking_data))

    def get_current_skeleton_data(self):
        return SkeletalNodeCollection(self.current_skeleton_data)

    def get_current_au_data(self):
        return []
