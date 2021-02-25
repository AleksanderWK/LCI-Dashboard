import pandas as pd

acc = pd.read_csv("./data/empatica/S001/ACC.csv")
bvp = pd.read_csv("./data/empatica/S001/BVP.csv")
eda = pd.read_csv("./data/empatica/S001/EDA.csv")
hr = pd.read_csv("./data/empatica/S001/HR.csv")
ibi = pd.read_csv("./data/empatica/S001/IBI.csv")
temp = pd.read_csv("./data/empatica/S001/TEMP.csv")
eye_tracking = pd.read_csv("./data/eye-tracking/ET-data-S001.csv")
skeleton = pd.read_csv("./data/skeleton/skeleton-S001.csv")

current_acc_data = []
current_bvp_data = []
current_eda_data = []
current_hr_data = []
current_ibi_data = []
current_temp_data = []
current_eye_tracking_data = []
current_skeleton_data = []


def generate_frequency_datastream(data, time, current_data, loop):
    freq = data.loc[0][0]
    #print(data.loc[time][0])
    current_data.append(data.loc[time])
    loop.call_later(1 / freq, generate_frequency_datastream, data, time + 1, current_data, loop)


def generate_eye_tracking_datastream(data, row, current_data, loop):
    data_row = data.loc[row]
    end_time = data_row[2]
    next_end_time = data.loc[row + 1][2]
    current_data.append(data_row)
    #print(data_row)
    loop.call_later((next_end_time - end_time) / 1000, generate_eye_tracking_datastream, data, row + 1, current_data, loop)


def generate_skeleton_datastream(data, row, current_data, loop):
    row_counter = row
    time = data.loc[row][4]
    init_time = time
    while True:
        data_row = data.loc[row_counter]
        time = data_row[4]
        if time != init_time: break
        current_data.append(data_row)
        row_counter += 1
    loop.call_later(time - init_time, generate_skeleton_datastream, data, row_counter, current_data, loop)


def add_all_to_event_loop(loop):
    loop.call_soon(generate_eye_tracking_datastream, eye_tracking, 1, current_eye_tracking_data, loop)
    loop.call_soon(generate_skeleton_datastream, skeleton, 1, current_skeleton_data, loop)
    loop.call_soon(generate_frequency_datastream, acc, 1, current_acc_data, loop)
    loop.call_soon(generate_frequency_datastream, bvp, 1, current_bvp_data, loop)
    loop.call_soon(generate_frequency_datastream, eda, 1, current_eda_data, loop)
    loop.call_soon(generate_frequency_datastream, hr, 1, current_hr_data, loop)
    loop.call_soon(generate_frequency_datastream, temp, 1, current_temp_data, loop)


def clear_current_data():
    current_acc_data.clear()
    current_bvp_data.clear()
    current_eda_data.clear()
    current_hr_data.clear()
    current_ibi_data.clear()
    current_temp_data.clear()
    current_eye_tracking_data.clear()
    current_skeleton_data.clear()