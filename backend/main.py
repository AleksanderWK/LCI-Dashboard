import asyncio
import sys
from datastreams import Datastreams
from mmdvvector import MMDVVector
from mmdvvector_calc import MMDVVectorCalculator
from wsclient import WebSocketClient
from tokendecode import decodeToken


# Executed every second
def process_current_data():
    # Code for calculating variables based on current_data will be done here.
    data = mmdv_calc.calculate_all().get_json()
    # print(data)

    # Sending calculated variables to dashboard
    asyncio.run_coroutine_threadsafe(ws.send(data), loop)

    # Clearing up data
    ds.clear_current_data()

    # Scheduling this function for 1 second later
    loop.call_later(0.5, process_current_data)


def setup():
    asyncio.run_coroutine_threadsafe(
        ws.connect("ws://" + getHost() + ":8080"), loop)
    ws.onMessage = onMessage
    loop.run_forever()


def getHost():
    if len(sys.argv) >= 2:
        token = sys.argv[1]
        ip, code = decodeToken(token)
        return ip
    else:
        return "localhost"


def onMessage(ws, message):
    checkTerminate(ws, message)
    checkStartDatastream(ws, message)


def checkStartDatastream(ws, message):
    if message == "Start":
        ds.add_all_to_event_loop(loop)
        loop.call_later(1, process_current_data)


def checkTerminate(ws, message):
    if message == "Terminate":
        ds.terminate()
        asyncio.run_coroutine_threadsafe(ws.close(), loop)


ws = WebSocketClient()
ds = Datastreams("S001")
mmdv_calc = MMDVVectorCalculator(ds)
loop = asyncio.get_event_loop()
setup()
