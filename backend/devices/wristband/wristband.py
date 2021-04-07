import socket
from datamodels.wristband import AccDataPoint, BVPDataPoint, EDADataPoint, TempDataPoint, IBIDataPoint, HRDataPoint

# Data types to retrieve
DATA_TYPES = ["acc", "bvp", "gsr", "tmp", "ibi" "hr"]

# E4 Streaming server connection details
SERVER_ADDRESS = "127.0.0.1"
SERVER_PORT = 28000
BUFFER_SIZE = 4096

# Empatica E4 wristband ID
DEVICE_ID = "1451CD"


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

    def __init__():
        try:
            self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            print("Connecting to server")
            self.s.connect((SERVER_ADDRESS, SERVER_PORT))
            print("Connected to server\n")

            print("Connecting to device")
            self.s.send(("device_connect " + DEVICE_ID + "\r\n").encode())
            response = self.s.recv(BUFFER_SIZE)
            print(response.decode("utf-8"))

            print("Pausing data receiving")
            self.s.send("pause ON\r\n".encode())
            response = self.s.recv(BUFFER_SIZE)
            print(response.decode("utf-8"))
        except:
            print("ERROR: Could not connect to Empatica E4 wristband.")
            self.s = None
            return

    def subscribe():
        if self.s != None:
            try:
                for data_type in DATA_TYPES:
                    print("Subcribing to " + data_type.upper())
                    self.s.send(
                        ("device_subscribe " + data_type + " ON\r\n").encode())
                    response = self.s.recv(BUFFER_SIZE)
                    print(response.decode("utf-8"))

                print("Resuming data receiving")
                self.s.send("pause OFF\r\n".encode())
                response = self.s.recv(bufferSize)
                print(response.decode("utf-8"))

                # Start stream of data
                self.stream()
            except:
                print(
                    "ERROR: Connection lost to Empatica E4 wristband / E4 Streaming Server.")

    def unsubscribe():
        if self.s != None:
            self.s.send("device_disconnect\r\n".encode())
            self.s.close()

    def stream():
        print("Streaming...")
        while True:
            try:
                response = self.s.recv(bufferSize).decode("utf-8")
                print(response)

                if "connection lost to device" in response:
                    print(response.decode("utf-8"))
                    break

                samples = response.replace(",", ".").split("\n")

                for sample in samples:
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
                        self.current_temp_data.append(
                            TempDataPoint([float(payload[2])]))

                    elif stream_type == "E4_Ibi":
                        self.current_ibi_data.append(IBIDataPoint(
                            [float(payload[1]), float(payload[2])]))

                    elif stream_type == "E4_Hr":
                        self.current_hr_data.append(
                            HRDataPoint([float(payload[2])]))

            except socket.timeout:
                print("ERROR: Socket timeout")
                break

    def get_current_acc_data():
        return self.current_acc_data

    def get_current_bvp_data():
        return self.current_bvp_data

    def get_current_gsr_data():
        return self.current_gsr_data

    def get_current_tmp_data():
        return self.current_tmp_data

    def get_current_ibi_data():
        return self.current_ibi_data

    def get_current_hr_data():
        return self.current_hr_data

    def clear_current_data():
        self.current_acc_data.clear()
        self.current_bvp_data.clear()
        self.current_gsr_data.clear()
        self.current_tmp_data.clear()
        self.current_ibi_data.clear()
        self.current_hr_data.clear()
