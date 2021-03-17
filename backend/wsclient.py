import websockets


class WebSocketClient:

    wscp = None

    async def connect(self, uri):
        self.wscp = await websockets.connect(uri)
        await self.listen()

    async def send(self, message):
        await self.wscp.send(message)

    async def close(self):
        await self.wscp.close()

    async def listen(self):
        while True:
            message = await self.wscp.recv()
            print("recieved: " + message)
            self.onMessage(self, message)

    def onMessage(self, wsc, message):
        """
        This method is supposed to be implemented by the user of the object. It is the callback function called when the web socket connection gets a message.
        """
        pass


"""
from autobahn.asyncio.websocket import WebSocketClientProtocol, WebSocketClientFactory

DASHBOARD_HOST = "localhost"
DASHBOARD_PORT = 8080
class MyClientProtocol(WebSocketClientProtocol):

    def onOpen(self):
        self.sendMessage(u"Hello, world!".encode('utf8'))

    def onMessage(self, payload, isBinary):
      print("Got message: " + str(payload))
      if payload == "Terminate":
          self.sendClose()
    


class WSConnection:
    
    factory = None
    loop = None
    host = None
    port = None
    transport = None
    protocol = None

    def __init__(self, host, port, loop):
        self.factory = WebSocketClientFactory()
        self.factory.protocol = MyClientProtocol
        self.host = host
        self.port = port
        self.loop = loop

    async def connect(self):
        self.transport, self.protocol = await self.loop.create_connection(self.factory, self.host, self.port)
    
    async def send(self):
        protocol = MyClientProtocol()
        await protocol.sendMessage(u"Hello, world!".encode('utf8'))
"""
