import asyncio
import sys
import click
import time
from datastreams.datastreams import Datastreams
from datastreams.device_datastreams import DeviceDatastreams
from datastreams.file_datastreams import FileDatastreams
from datamodels.mmdvcollection import MMDVCollection
from datamodels.datapayload import DataPayload
from calculators.mmdvcollection_calc import MMDVCollectionCalculator
from wsclient import WebSocketClient
from tokendecode import decodeToken


class Main():

    def process_current_data(self):
        """
        This function will get executed every half a second, and is the main part of the program when the session has started.
        """
        # Code for calculating variables based on current_data will be done here.
        mmdv_collection = self.mmdv_calc.calculate_all()

        # Get the final payload that will be sent to the dashboard
        data_payload = DataPayload(
            mmdv_collection, self.session_code).get_json()

        # Sending the data payload to dashboard
        asyncio.run_coroutine_threadsafe(self.ws.send(data_payload), self.loop)

        # Clearing up data
        self.ds.clear_current_data()

        # Scheduling this function for 0.5 second later
        self.loop.call_later(0.5, self.process_current_data)

    def setup(self):
        """
        Sets up the websocket connection with the dashboard and starts the event loop
        """
        asyncio.run_coroutine_threadsafe(
            self.ws.connect("ws://" + self.getHost() + ":8080/" + self.session_code), self.loop)
        print(self.getHost())
        self.ws.onMessage = self.onMessage
        self.loop.run_forever()

    def getHost(self):
        """
        Gets the dashboard host ip address based on the session code gotten. If no code is used it will use localhost.
        """

        if self.session_code != None:
            ip, code = decodeToken(self.session_code)
            return ip
        else:
            return "localhost"

    def onMessage(self, ws, message):
        """
        The function that runs when the websocket connection gets a message from the dashboard.
        """
        self.checkTerminate(ws, message)
        self.checkStartDatastream(ws, message)

    def checkStartDatastream(self, ws, message):
        """
        Checks if a start signal has been sent by the dashboard on the websocket connection. If so, it should start the datastreams and start the main event loop.
        """
        if message == "Start":
            self.ds.start()
            self.loop.call_later(1, self.process_current_data)

    def checkTerminate(self, ws, message):
        """
        Checks if a terminate signal has been sent by the dashboard on the websocket connection. If so, it should stop the datastreams and close the websocket connection.
        """
        if message == "Terminate":
            self.ds.terminate()
            asyncio.run_coroutine_threadsafe(self.ws.close(), self.loop)
            self.loop.stop()

    def init_session_with_dataset(self, session_code, dataset):
        """
        Initializes a session using the provided dataset
        """
        self.loop = asyncio.get_event_loop()
        self.session_code = session_code
        self.ws = WebSocketClient()
        self.ds = FileDatastreams(dataset, self.loop)
        self.mmdv_calc = MMDVCollectionCalculator(self.ds)
        self.setup()

    def init_session_with_devices(self, session_code, device_mode):
        """
        Initializes a session using the connected devices
        """
        self.loop = asyncio.get_event_loop()
        self.session_code = session_code
        self.ws = WebSocketClient()
        self.ds = DeviceDatastreams(device_mode, self.loop)
        self.mmdv_calc = MMDVCollectionCalculator(self.ds)
        self.setup()


@click.command(help="Connect to a dashbord with a session code, retrieve data from either devices or a dataset, calculate variables and send the results to the dashboard in real-time.")
@click.option('--devices', 'device_mode', default=None, help="Retrieve data from devices.")
@click.option('--dataset', 'dataset_id', type=click.IntRange(1, 12), help="Retrieve data from a dataset (1-12).")
@click.argument("session_code")
def main(device_mode, dataset_id, session_code):
    main = Main()

    if device_mode:
        print("Retrieving data from devices.")
        main.init_session_with_devices(session_code, device_mode)
    else:
        if dataset_id == None:
            dataset = "S001"
        else:
            if (dataset_id >= 10):
                dataset = "S0" + str(dataset_id)
            else:
                dataset = "S00" + str(dataset_id)

        print("Retrieving data from dataset " + dataset + ".")
        main.init_session_with_dataset(session_code, dataset)


if __name__ == "__main__":
    main()
