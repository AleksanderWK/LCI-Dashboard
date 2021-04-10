import asyncio
from datamodels.wristband import AccDataPoint, BVPDataPoint, EDADataPoint, TempDataPoint, IBIDataPoint, HRDataPoint

# Data types to retrieve
DATA_TYPES = ["acc", "bvp", "gsr", "tmp", "ibi"]

# E4 Streaming server connection details
SERVER_ADDRESS = "127.0.0.1"
SERVER_PORT = 28000
BUFFER_SIZE = 4096


class Wristband():

    reader = None
    writer = None
    loop = None

    # Lists of data retrieved in this batch
    current_acc_data = []
    current_bvp_data = []
    current_gsr_data = []
    current_tmp_data = []
    current_ibi_data = []
    current_hr_data = []

    def __init__(self, loop):
        self.loop = loop
        asyncio.run_coroutine_threadsafe(self.setup(), self.loop)

    async def setup(self):
        try:
            self.reader, self.writer = await asyncio.open_connection('127.0.0.1', 8888)

            # Get the first device ID that is connected to the streaming server
            self.writer.write(("device_list\r\n").encode())
            await self.writer.drain()

            response = await self.reader.readline().decode("utf-8").split(" | ")

            if (len(response) > 1):
                device_id = response[1].split()[0]

                self.writer.write(("device_connect " + device_id + "\r\n").encode())
                await self.writer.drain()

                await self.reader.readline()

                self.writer.write("pause ON\r\n".encode())
                await self.writer.drain()
                
                await self.reader.readline()

                # Subscribe to all data types
                for data_type in DATA_TYPES:
                    self.writer.write(("device_subscribe " + data_type + " ON\r\n").encode())
                    await self.writer.drain()
                    await self.reader.readline()

                print("Connected to Empatica E4 wristband.")
            else:
                raise Exception
        except:
            print("ERROR: Could not connect to Empatica E4 wristband.")
            self.reader, self.writer = None, None
            return

    async def subscribe(self):
        if self.writer != None and self.reader != None:
            try:
                self.writer.write("pause OFF\r\n".encode())
                await self.writer.drain()
                await self.reader.readline()

                # Start stream of data
                await self.stream()
            except:
                print(
                    "ERROR: Connection lost to Empatica E4 wristband / E4 Streaming Server.")

    async def unsubscribe(self):
        if self.s != None:
            self.writer.write("device_disconnect\r\n".encode())
            await self.writer.drain()
            self.writer.close()
            await self.writer.wait_closed()

    async def stream(self):
        while True:
            response = await self.reader.readline()
            if "connection lost to device" in response:
                break

            samples = response.replace(",", ".").split("\n")

            for sample in samples:
                if len(sample) > 0:
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
