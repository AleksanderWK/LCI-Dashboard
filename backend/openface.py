from subprocess import Popen
from datamodels.camera import OpenFaceDataPoint
import csv


class OpenFaceInstance:

    process = None
    out_filename = "data"
    device_id = 0

    file = None
    reader = None
    current_data = []
    header_data = []

    def __init__(self, out_dir, out_filename, device_id):
        self.out_filename = out_filename
        self.device_id = device_id

    def __init__(self):
        pass

    def start(self):
        self.process = Popen("\".\openface2\FeatureExtraction.exe\"" +
                             " -device " + str(self.device_id) +
                             " -of " + "\"" + self.out_filename + "\"")

    def terminate(self):
        self.process.terminate()

    def startDataRead(self):
        self.file = open("./processed/data.csv", newline="")
        self.reader = csv.reader(self.file)
        self.header_data = next(self.reader)

    def stopDataRead(self):
        self.file.close()

    def readNextData(self):
        while True:
            try:
                row = next(self.reader)
                self.current_data.append(
                    OpenFaceDataPoint(self.header_data, row)
                )
                print(row[0])
            except StopIteration:
                break

    def getCurrentData(self):
        self.readNextData()
        return self.current_data

    def clearCurrentData(self):
        self.current_data.clear()
