import websockets

ws = None
uri = "ws://localhost:8080"
async def connect():
    global ws
    ws = await websockets.connect(uri)
    await ws.send("message")

async def send(message):
    await ws.send(message)

async def close():
    await ws.close()