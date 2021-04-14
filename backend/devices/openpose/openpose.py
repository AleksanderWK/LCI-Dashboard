from subprocess import Popen
from datamodels.camera import OpenFaceDataPoint
from datamodels.skeletal import SkeletalNodeCollection
import os
import shutil
import json
import time


class OpenPoseInstance:

    process = None
    out_dir = "output_json/"

    file = None
    current_frame = 0
    current_data = None

    def __init__(self):
        self.clearOutputDirectory()

    def clearOutputDirectory(self):
        try:
            shutil.rmtree("./devices/openpose/bin/" + self.out_dir)
        except:
            pass

    def startProcess(self):
        try:
            self.process = Popen("bin\OpenPoseDemo.exe" +
                                 " --net_resolution -1x80" +
                                 " --tracking 1" +
                                 " --number_people_max 1" +
                                 " --process_real_time" +
                                 " --write_json " + self.out_dir +
                                 " --keypoint_scale 4",
                                 cwd=os.getcwd() + "\devices\openpose\\bin",
                                 shell=True)
        except FileNotFoundError:
            self.process = None
            print(
                "Couldn't find the OpenPose binaries, make sure they are installed correctly.")

    def terminateProcess(self):
        if self.process:
            self.process.terminate()

    def readNextData(self):
        try:
            while True:
                self.file = open(
                    "./devices/openpose/bin/" + self.out_dir + self.getCurrentFileName(),
                )
                data = json.load(self.file)
                keypoints = data["people"][0]["pose_keypoints_2d"]
                dataRows = self.keypointsToDataRows(keypoints)
                self.current_data = SkeletalNodeCollection(dataRows)
                self.current_frame += 1
                self.file.close()
        except (FileNotFoundError, json.decoder.JSONDecodeError):
            pass

    def getCurrentFileName(self):
        """
            following format for frame 0: "000000000000_keypoints.json"
            following format for frame 1: "000000000001_keypoints.json"
            etc.
        """
        return str(self.current_frame).zfill(12) + "_keypoints.json"

    def keypointsToDataRows(self, keypoints):
        dataRows = []
        for i in range(0, len(keypoints), 3):
            jointType = i / 3
            x = keypoints[i + 0]
            y = keypoints[i + 1]
            z = 0
            c = keypoints[i + 2]
            t = time.time()
            dataRows.append([jointType, x, y, z, t])
        return dataRows

    def getCurrentData(self):
        self.readNextData()
        return self.current_data

    def clearCurrentData(self):
        self.current_data = SkeletalNodeCollection([])
