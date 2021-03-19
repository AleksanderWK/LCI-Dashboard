import asyncio
import sys
from datastreams import Datastreams
from datamodels.mmdvcollection import MMDVCollection
from datamodels.datapayload import DataPayload
from calculators.mmdvcollection_calc import MMDVCollectionCalculator
from wsclient import WebSocketClient
from tokendecode import decodeToken


def process_current_data():
    """
    This function will get executed every half a second.
    """
    # Code for calculating variables based on current_data will be done here.
    mmdv_collection = mmdv_calc.calculate_all()

    # Get the final payload that will be sent to the dashboard
    data_payload = DataPayload(mmdv_collection, getSessionCode()).get_json()

    # Sending the data payload to dashboard
    asyncio.run_coroutine_threadsafe(ws.send(data_payload), loop)

    # Clearing up data
    ds.clear_current_data()

    # Scheduling this function for 0.5 second later
    loop.call_later(0.5, process_current_data)


def setup():
    """
    Sets up the websocket connection with the dashboard and starts the event loop
    """
    asyncio.run_coroutine_threadsafe(
        ws.connect("ws://" + getHost() + ":8080"), loop)
    ws.onMessage = onMessage
    loop.run_forever()


def getSessionCode():
    """
    Gets the session code gotten from the command line agruments, if nothing is applied it will return None
    """
    if len(sys.argv) >= 2:
        return sys.argv[1]
    else:
        return None


def getHost():
    """
    Gets the dashboard host ip address based on the session code gotten from the command line arguments. If no code is used it will use localhost.
    """
    session_code = getSessionCode()
    if session_code != None:
        ip, code = decodeToken(session_code)
        return ip
    else:
        return "localhost"


def onMessage(ws, message):
    """
    The function that gets ran when the websocket connection gets a message from the dashboard.
    """
    checkTerminate(ws, message)
    checkStartDatastream(ws, message)


def checkStartDatastream(ws, message):
    """
    Checks if a start signal has been sent by the dashboard on the websocket connection. If so, it should start the datastreams and start the main event loop.
    """
    if message == "Start":
        ds.add_all_to_event_loop(loop)
        loop.call_later(1, process_current_data)


def checkTerminate(ws, message):
    """
    Checks if a terminate signal has been sent by the dashboard on the websocket connection. If so, it should stop the datastreams and close the websocket connection. 
    """
    if message == "Terminate":
        ds.terminate()
        asyncio.run_coroutine_threadsafe(ws.close(), loop)


# The code below is the startpoint of the backend application. Here all the essential objects get initialized.
ws = WebSocketClient()
ds = Datastreams("S001")
mmdv_calc = MMDVCollectionCalculator(ds)
loop = asyncio.get_event_loop()
setup()
