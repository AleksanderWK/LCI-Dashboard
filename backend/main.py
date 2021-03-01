import asyncio
from datastreams import Datastreams
from mmdvvector import MMDVVector
from wsclient import WebSocketClient

# Executed every second
def process_current_data():
    print(ds.current_temp_data)
    #print(current_skeleton_data)
    #print(current_eye_tracking_data)

    # Code for calculating variables based on current_data will be done here.
    
    data = MMDVVector().get_json()
    #print(data)
    asyncio.run_coroutine_threadsafe(ws.send(data), loop)
    # Sending calculated variables to dashboard
    #asyncio.run_coroutine_threadsafe(ws.send(data), loop)

    # clearing up data
    ds.clear_current_data()
    loop.call_later(1, process_current_data)


def setup():
    asyncio.run_coroutine_threadsafe(ws.connect("ws://localhost:8080"), loop)
    ws.onMessage = terminate
    ds.add_all_to_event_loop(loop)
    loop.call_later(1, process_current_data)
    loop.run_forever()

def terminate(ws, message):
    if message == "Terminate":
        ds.terminate()
        asyncio.run_coroutine_threadsafe(ws.close(), loop)

ws = WebSocketClient()
ds = Datastreams("S001")
loop = asyncio.get_event_loop()
setup()