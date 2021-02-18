import pandas as pd
import asyncio

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

def generate_frequency_datastream(data, time, current_data):
    freq = data.loc[0][0]
    print(data.loc[time][0])
    current_data.append(data.loc[time])
    loop.call_later(1 / freq, generate_frequency_datastream, data, time + 1, current_data)

def generate_eye_tracking_datastream(data, end_time, current_data):
    pass

def generate_skeleton_datastream(data, time, current_data):
    pass

def process_current_data():
    print(current_temp_data)

    # Code for calculating variables based on current_data will be done here.

    current_acc_data.clear()
    current_bvp_data.clear()
    current_eda_data.clear()
    current_hr_data.clear()
    current_ibi_data.clear()
    current_temp_data.clear()
    current_eye_tracking_data.clear()
    current_skeleton_data.clear()
    loop.call_later(1, process_current_data)

loop = asyncio.get_event_loop()
loop.call_soon(generate_frequency_datastream, temp, 1, current_temp_data)
loop.call_later(1, process_current_data)
loop.run_forever()