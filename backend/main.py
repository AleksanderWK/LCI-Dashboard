import asyncio
import wsclient as ws
import datastreams as ds

# Executed every second
def process_current_data():
    print(ds.current_temp_data)
    #print(current_skeleton_data)
    #print(current_eye_tracking_data)

    # Code for calculating variables based on current_data will be done here.
    
    
    # Sending calculated variables to dashboard
    asyncio.run_coroutine_threadsafe(ws.send("hello world"), loop)

    # clearing up data
    ds.clear_current_data()
    loop.call_later(1, process_current_data)


loop = asyncio.get_event_loop()
asyncio.run_coroutine_threadsafe(ws.connect(), loop)
ds.add_all_to_event_loop(loop)
loop.call_later(1, process_current_data)
loop.run_forever()
