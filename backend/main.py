import pandas as pd

temp = pd.read_csv("./data/empatica/S001/TEMP.csv")
eye_tracking = pd.read_csv("./data/eye-tracking/ET-data-S001.csv")
skeleton = pd.read_csv("./data/skeleton/skeleton-S001.csv")
print(temp)
print(eye_tracking)
print(skeleton)