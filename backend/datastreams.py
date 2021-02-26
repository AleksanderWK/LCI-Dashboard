import pandas as pd

class Datastreams:
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

    def __init__(self, studentID):
        self.acc = pd.read_csv("./data/empatica/" + studentID + "/ACC.csv")
        self.bvp = pd.read_csv("./data/empatica/" + studentID + "/BVP.csv")
        self.eda = pd.read_csv("./data/empatica/" + studentID + "/EDA.csv")
        self.hr = pd.read_csv("./data/empatica/" + studentID + "/HR.csv")
        self.ibi = pd.read_csv("./data/empatica/" + studentID + "/IBI.csv")
        self.temp = pd.read_csv("./data/empatica/" + studentID + "/TEMP.csv")
        self.eye_tracking = pd.read_csv("./data/eye-tracking/ET-data-" + studentID + ".csv")
        self.skeleton = pd.read_csv("./data/skeleton/skeleton-" + studentID + ".csv")


    
    def generate_frequency_datastream(self, data, time, current_data, loop):
        if self.terminated: return
        freq = data.loc[0][0]
        #print(data.loc[time][0])
        current_data.append(data.loc[time])
        loop.call_later(1 / freq, self.generate_frequency_datastream, data, time + 1, current_data, loop)


    def generate_eye_tracking_datastream(self, data, row, current_data, loop):
        if self.terminated: return
        data_row = data.loc[row]
        end_time = data_row[2]
        next_end_time = data.loc[row + 1][2]
        current_data.append(data_row)
        #print(data_row)
        loop.call_later((next_end_time - end_time) / 1000, self.generate_eye_tracking_datastream, data, row + 1, current_data, loop)


    def generate_skeleton_datastream(self, data, row, current_data, loop):
        if self.terminated: return
        row_counter = row
        time = data.loc[row][4]
        init_time = time
        while True:
            data_row = data.loc[row_counter]
            time = data_row[4]
            if time != init_time: break
            current_data.append(data_row)
            row_counter += 1
        loop.call_later(time - init_time, self.generate_skeleton_datastream, data, row_counter, current_data, loop)


    def add_all_to_event_loop(self, loop):
        loop.call_soon(self.generate_eye_tracking_datastream, self.eye_tracking, 1, self.current_eye_tracking_data, loop)
        loop.call_soon(self.generate_skeleton_datastream, self.skeleton, 1, self.current_skeleton_data, loop)
        loop.call_soon(self.generate_frequency_datastream, self.acc, 1, self.current_acc_data, loop)
        loop.call_soon(self.generate_frequency_datastream, self.bvp, 1, self.current_bvp_data, loop)
        loop.call_soon(self.generate_frequency_datastream, self.eda, 1, self.current_eda_data, loop)
        loop.call_soon(self.generate_frequency_datastream, self.hr, 1, self.current_hr_data, loop)
        loop.call_soon(self.generate_frequency_datastream, self.temp, 1, self.current_temp_data, loop)


    def clear_current_data(self):
        self.current_acc_data.clear()
        self.current_bvp_data.clear()
        self.current_eda_data.clear()
        self.current_hr_data.clear()
        self.current_ibi_data.clear()
        self.current_temp_data.clear()
        self.current_eye_tracking_data.clear()
        self.current_skeleton_data.clear()

    def terminate(self):
        self.clear_current_data()
        self.terminated = True