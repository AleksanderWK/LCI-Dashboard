import socket
from datamodels.wristband import AccDataPoint, BVPDataPoint, EDADataPoint, TempDataPoint, IBIDataPoint, HRDataPoint

# Data types to retrieve
DATA_TYPES = ["acc", "bvp", "gsr", "tmp", "ibi"]

# E4 Streaming server connection details
SERVER_ADDRESS = "127.0.0.1"
SERVER_PORT = 28000
BUFFER_SIZE = 4096


class Wristband():

    # The communication socket
    s = None

    # Lists of data retrieved in this batch
    current_acc_data = []
    current_bvp_data = []
    current_gsr_data = []
    current_tmp_data = []
    current_ibi_data = []
    current_hr_data = []

    def __init__(self):
        try:
            self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            self.s.connect((SERVER_ADDRESS, SERVER_PORT))

            # Get the first device ID that is connected to the streaming server
            self.s.send(("device_list\r\n").encode())
            response = self.s.recv(BUFFER_SIZE).decode("utf-8").split(" | ")

            if (len(response) > 1):
                device_id = response[1].split()[0]

                self.s.send(("device_connect " + device_id + "\r\n").encode())
                self.s.recv(BUFFER_SIZE)

                self.s.send("pause ON\r\n".encode())
                self.s.recv(BUFFER_SIZE)

                # Subscribe to all data types
                for data_type in DATA_TYPES:
                    self.s.send(
                        ("device_subscribe " + data_type + " ON\r\n").encode())
                    self.s.recv(BUFFER_SIZE)

                print("Connected to Empatica E4 wristband.")
            else:
                raise Exception
        except:
            print("ERROR: Could not connect to Empatica E4 wristband.")
            self.s = None
            return

    def subscribe(self):
        if self.s != None:
            try:
                self.s.send("pause OFF\r\n".encode())
                self.s.recv(BUFFER_SIZE)

                # Start stream of data
                self.stream()
            except:
                print(
                    "ERROR: Connection lost to Empatica E4 wristband / E4 Streaming Server.")

    def unsubscribe(self):
        if self.s != None:
            self.s.send("device_disconnect\r\n".encode())
            self.s.close()

    def stream(self):
        while True:
            try:
                response = self.s.recv(BUFFER_SIZE).decode("utf-8")

                if "connection lost to device" in response:
                    break

                samples = response.replace(",", ".").split("\n")

                for sample in samples:
                    if (len(sample) > 0):
                        payload = sample.split()
                        stream_type = payload[0]

                        if stream_type == "E4_Acc":
                            self.current_acc_data.append(AccDataPoint([int(payload[2]), int(
                                payload[3]), int(payload[4])]))

                        elif stream_type == "E4_Bvp":
                            self.current_bvp_data.append(
                                BVPDataPoint([float(payload[2])]))

                        elif stream_type == "E4_Gsr":
                            self.current_gsr_data.append(
                                EDADataPoint([float(payload[2])]))

                        elif stream_type == "E4_Temperature":
                            self.current_tmp_data.append(
                                TempDataPoint([float(payload[2])]))

                        elif stream_type == "E4_Ibi":
                            self.current_ibi_data.append(IBIDataPoint(
                                [float(payload[1]), float(payload[2])]))

                        elif stream_type == "E4_Hr":
                            self.current_hr_data.append(
                                HRDataPoint([float(payload[2])]))

            except socket.timeout:
                print("ERROR: E4 Streaming Server socket timeout")
                break

    def get_current_acc_data(self):
        return self.current_acc_data

    def get_current_bvp_data(self):
        return self.current_bvp_data

    def get_current_gsr_data(self):
        return self.current_gsr_data

    def get_current_tmp_data(self):
        return self.current_tmp_data

    def get_current_ibi_data(self):
        return self.current_ibi_data

    def get_current_hr_data(self):
        return self.current_hr_data

    def clear_current_data(self):
        self.current_acc_data.clear()
        self.current_bvp_data.clear()
        self.current_gsr_data.clear()
        self.current_tmp_data.clear()
        self.current_ibi_data.clear()
        self.current_hr_data.clear()
