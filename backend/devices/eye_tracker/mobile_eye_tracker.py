'''
    Live data stream from Tobii Glasses 2

    Code in this file is inspired by Tobii Glasses 2 API example code and the
     following repos :
     https://github.com/ddetommaso/TobiiProGlasses2_PyCtrl
     https://github.com/grebtsew/Tobii_Glasses_2_Python3_And_C/

'''

import asyncio
import requests
import json
import time
import threading
import socket
import numpy as np
import cv2
from threading import Thread
import os
import sys
import warnings
from datamodels.eye_tracking import EyeTrackingDataPoint


# A gaze point is added to the fixation if it's distance
# to the previous gaze point is below DISTANCE_THRESHOLD.
# Active Display Coordinate System (ADCS) is used, going from
# (0,0) in top left corner to (1,1) in bottom right corner.
DISTANCE_THRESHOLD = 0.08

# A fixation is kept if it contains at least GAZE_POINT_THRESHOLD number of
# gaze points (filters small wrongly classified fixations during saccades)
GAZE_POINT_THRESHOLD = 5

screen_size = 1920, 1080


class MobileEyeTracker():

    # A list of all fixations calculated in this batch
    current_fixations = []

    current_fixation_id = 0
    current_fixation_init_time = None
    # A list of gaze points in the fixation, with format: [lpup, rpup, fx, fy]
    current_fixation_points = []

    # Previous gaze data, with format: [timestamp, lpup, rpup, fx, fy]
    prev_gaze_data = None

    current_gaze_data = None

    temp_data = {}

    GLASSES_IP = "192.168.71.50"  # IPv4 address
    PORT = 49152
    base_url = 'http://' + GLASSES_IP
    timeout = 1
    pr_id = None
    pr_name = "project_name"
    pa_id = None
    pa_name = "participant_name"
    ca_id = None
    ca_name = "calibration_name"

    # Keep-alive message content used to request live data and live video streams
    KA_DATA_MSG = "{\"type\": \"live.data.unicast\", \"key\": \"some_GUID\", \"op\": \"start\"}"
    # KA_EYES_MSG = "{\"type\": \"live.eyes.unicast\", \"key\": \"some_GUID\", \"op\": \"start\"}" # used to sync eyes
    # KA_VIDEO_MSG = "{\"type\": \"live.video.unicast\", \"key\": \"some_other_GUID\", \"op\": \"start\"}"

    def mksock(self, peer):
        '''
        Create UDP Socket
        '''
        iptype = socket.AF_INET
        if ':' in peer[0]:
            iptype = socket.AF_INET6
        return socket.socket(iptype, socket.SOCK_DGRAM)

    def send_keepalive_msg(self, socket, msg, peer):
        '''
        Callback function
        '''
        while self.running:
            socket.sendto(msg.encode(), peer)
            time.sleep(self.timeout)

    def put_request(self, api_action, data, in_id, name):
        url = self.base_url + api_action + "/" + project_name
        data = {"pr_info": {"name": pr_name}}
        json_data = json.dumps(data)
        response = requests.put(url, json_data, headers={
                                'Content-Type': 'application/json'})
        json_data = response.json()
        return json_data

    def get_request(self, api_action):
        url = self.base_url + api_action
        response = requests.get(
            url, headers={'Content-Type': 'application/json'})
        json_data = response.json()
        return json_data

    def post_request(self, api_action, data=None):
        url = self.base_url + api_action
        data = json.dumps(data)
        response = requests.post(
            url, data, headers={'Content-Type': 'application/json'})
        json_data = response.json()
        return json_data

    def wait_for_status(self, api_action, key, values):
        url = self.base_url + api_action
        running = True
        max_tries = 20
        count = 0
        while running:

            response = requests.get(
                url, headers={'Content-Type': 'application/json'})
            json_data = response.json()

            print(" Status: " + json_data[key])

            if json_data[key] in values or count >= max_tries:
                running = False
            time.sleep(1)
            count += 1
        return json_data[key]

    def create_project(self, name):
        data = {'pr_info': {'Name': name}}
        json_data = self.post_request(api_action='/api/projects', data=data)
        return json_data['pr_id']

    def create_participant(self, project_id):
        data = {'pa_project': project_id, 'pa_info': {'Name': self.pa_name}}
        json_data = self.post_request('/api/participants', data)
        return json_data['pa_id']

    def create_calibration(self, project_id, participant_id):
        data = {'ca_project': project_id, 'ca_type': 'default',
                'ca_participant': participant_id, 'ca_info': {'Name': self.ca_name}}
        json_data = self.post_request('/api/calibrations', data)
        return json_data['ca_id']

    def start_calibration(self, calibration_id):
        self.post_request('/api/calibrations/' + calibration_id + '/start')

    def create_recording(self, participant_id):
        data = {'rec_participant': participant_id}
        json_data = self.post_request('/api/recordings', data)
        return json_data['rec_id']

    def project_exists(self, new_id):
        url = self.base_url + "/api/projects"
        response = requests.get(
            url, headers={'Content-Type': 'application/json'})
        data = json.loads(response.text)
        for projects in data:
            if (projects["pr_id"] == new_id):
                return True
        return False

    def is_not_Valid(self, s_val):
        return s_val != 0

    def get_jsonitem(self, json_id, end_url):
        url = self.base_url + self.end_url
        response = requests.get(
            url, headers={'Content-Type': 'application/json'})
        data = json.loads(response.text)
        count = 0
        for projects in data:
            if (projects["pr_id"] == new_id):
                return data
            count += 1
        return

    def get_ids(self):
        '''
        Get all ids from rest api
        This is a startup routine
        '''
        '''
        Project
        '''
        # Get project id 'pr_id'
        all_projects = self.get_request(api_action='/api/projects')
        found_project = False
        # Loop and find our project
        print("Searching for Project...")
        for project in all_projects:
            if(str(project).__contains__("pr_info")):

                # print(str(project['pr_info']).__contains__("Name"))
                if(str(project['pr_info']).__contains__("Name")):
                    if(project['pr_info']['Name'] == self.pr_name):
                        self.pr_id = project['pr_id']
                        found_project = True
                        break

        if(not found_project):
            print("Project not found, creating new...")
            self.pr_id = self.create_project(self.pr_name)
            print("Project created!")
        else:
            print("Project found!")

        '''
        Participant
        '''
        all_participants = self.get_request(api_action='/api/participants/')
        found_participant = False

        print("Searching for Participant...")
        for participant in all_participants:
            if(str(participant).__contains__(self.pr_id)):
                if(str(participant).__contains__("pa_info")):
                    if(str(participant['pa_info']).__contains__('Name')):
                        if(participant['pa_info']['Name'] == self.pa_name):
                            self.pa_id = participant['pa_id']
                            found_participant = True
                            break

        if(not found_participant):
            print("Participant not found, creating new...")
            self.pa_id = self.create_participant(self.pr_id)
            print("Participant created!")
        else:
            print("Participant found!")

        '''
        Calibrations
        '''
        all_calibrations = self.get_request(api_action='/api/calibrations/')
        found_calibration = False

        print("Searching for Calibration...")
        for calibration in all_calibrations:

            if(str(calibration).__contains__(self.pa_id)):
                if(str(calibration).__contains__(self.pr_id)):
                    if(str(calibration).__contains__("ca_info")):
                        if(str(calibration['ca_info']).__contains__('Name')):
                            if(calibration['ca_info']['Name'] == self.pa_name):
                                self.ca_id = calibration['ca_id']
                                found_calibration = True
                                break
        if(not found_calibration):
            print("Calibration not found, creating new...")
            self.ca_id = self.create_calibration(self.pr_id, self.pa_id)
            print("Calibration created!")
        else:
            print("Calibration found!")

        return

    def add_to_temp_data_point(self, data):

        if(data["s"] != 0):
            return

        if ("ts" not in self.temp_data):  # timestamp
            self.temp_data["ts"] = data["ts"]

        elif ("pd" in str(data)):  # pupil-diameter
            if ("left" in str(data)):
                self.temp_data["lpup"] = data["pd"]
            else:
                self.temp_data["rpup"] = data["pd"]

        if ("'gp'" in str(data)):  # gaze position
            self.temp_data["fx"] = data["gp"][0]
            self.temp_data["fy"] = data["gp"][1]

    def check_temp_data(self):
        return (None not in self.temp_data.values() and len(self.temp_data.values()) == 5)

    def fixation_check(self):
        fx, fy = self.current_gaze_data[3], self.current_gaze_data[4]

        if (fx != None and fy != None):
            lpup, rpup = self.current_gaze_data[1], self.current_gaze_data[2]

            timestamp = self.current_gaze_data[0]

            if (self.prev_gaze_data != None):

                # Calculate Euclidean distance between current point and previous point
                distance = np.linalg.norm(
                    np.array([self.prev_gaze_data[3], self.prev_gaze_data[4]]) - np.array([fx, fy]))

                # If distance is below the threshold, the point is part of the fixation
                if (distance < DISTANCE_THRESHOLD):
                    if (self.current_fixation_init_time == None):

                        # Initialization of fixation
                        self.current_fixation_init_time = round(
                            self.prev_gaze_data[0] / 1000)

                        # Add prev point to fixation points list
                        self.current_fixation_points.append(
                            [self.prev_gaze_data[1], self.prev_gaze_data[2],  self.prev_gaze_data[3], self.prev_gaze_data[4]])

                    # Add current point to fixation points list
                    self.current_fixation_points.append(
                        [lpup, rpup, fx, fy])

                else:
                    if (self.current_fixation_init_time != None):
                        # Fixation is over
                        # Keep fixation if it has enough gaze points
                        if (len(self.current_fixation_points) >= GAZE_POINT_THRESHOLD):
                            self.current_fixation_id += 1
                            end_time = round(self.prev_gaze_data[0] / 1000)

                            # Suppress warnings that come from for example all left pupil diameters being NaN
                            with warnings.catch_warnings():
                                warnings.simplefilter(
                                    "ignore", category=RuntimeWarning)
                                mean_values = np.nanmean(
                                    np.asarray(self.current_fixation_points), axis=0)

                            mean_fx_screen, mean_fy_screen = self.map_to_screen_resolution(
                                mean_values[2], mean_values[3])

                            fixation = [self.current_fixation_id, self.current_fixation_init_time,
                                        end_time, mean_values[0], mean_values[1], mean_fx_screen, mean_fy_screen]

                            self.current_fixations.append(
                                EyeTrackingDataPoint(fixation))

                            # Clear fixation data
                            self.current_fixation_init_time = None
                            self.current_fixation_points = []
                            self.prev_gaze_data = None
                            return

            self.prev_gaze_data = [timestamp, lpup, rpup, fx, fy]

    async def data_stream_loop(self, args, loop):
        '''
        Loop and post datavalues
        See Developerguide Appendix C for value information.
        '''
        sensor = ""
        data_gp = (0, [0.0, 0.0])
        data_pts = (0, 0)
        while(self.running):
            try:
                raw_data, address = await loop.run_in_executor(None, args.recvfrom, 1024)
                # raw_data, address = args.recvfrom(1024)
                raw_data = raw_data.decode('ascii')
                raw_data = raw_data.replace("\\n", "")
                raw_data = raw_data.replace("b", "")
                data = json.loads(raw_data)

                # print(data)

                self.add_to_temp_data_point(data)
                if (self.check_temp_data()):
                    self.prev_gaze_data = self.current_gaze_data
                    self.current_gaze_data = [self.temp_data["ts"], self.temp_data["lpup"],
                                              self.temp_data["rpup"], self.temp_data["fx"], self.temp_data["fy"]]
                    self.temp_data.clear()

                    # print(self.temp_data)
                    self.fixation_check()
            except Exception as e:
                print(e)
                time.sleep(.1)

        # self.data_socket.close()

    def calibrate(self):
        # Get all id
        self.get_ids()

        # Show config data
        print("Project: " + self.pr_id, ", Participant: ",
              self.pa_id, ", Calibration: ", self.ca_id, " ")

        # Start calibration
        print()
        input_var = input("Press enter to calibrate")

        print("Calibration started waiting for calibration...")
        print("Status polling...")
        self.start_calibration(self.ca_id)
        status = self.wait_for_status(
            '/api/calibrations/' + self.ca_id + '/status', 'ca_state', ['failed', 'calibrated'])

        # Show calibration result
        if status == 'failed':
            print('Calibration failed, using default calibration instead')
        else:
            print('Calibration successful')

    async def run(self, loop):
        self.running = True
        peer = (self.GLASSES_IP, self.PORT)
        project_id = None
        participant_id = None
        calibration_id = None

        # Create socket which will send a keep alive message for the live data stream
        self.data_socket = self.mksock(peer)
        try:
            td = threading.Timer(0, self.send_keepalive_msg, [
                self.data_socket, self.KA_DATA_MSG, peer])
            td.start()

            # Create socket which will send a keep alive message for the live video stream
            # self.video_socket = self.mksock(peer)
            # tv = threading.Timer(0, self.send_keepalive_msg, [
            #                      self.video_socket, self.KA_VIDEO_MSG, peer])
            # tv.start()

            # Start data_stream
            await self.data_stream_loop(self.data_socket, loop)

        except Exception as e:
            print(e.with_traceback())
            self.running = False

    def map_to_screen_resolution(self, x, y):
        return round(x * screen_size[0]), round(y * screen_size[1])

    def get_current_data(self):
        return self.current_fixations

    def clear_current_data(self):
        self.current_fixations.clear()

    def terminate(self):
        self.running = False
