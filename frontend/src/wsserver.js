const WebSocket = require("ws");
const { insertSession } = require("./db/sessions.js");
const urlParser = require("url");

let codeMap = {};

// Start the server and define callbacks for connection and message
function startServer(destWin) {
  let wss = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3,
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024,
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024, // Size (in bytes) below which messages
      // should not be compressed.
    },
  });

  wss.on("connection", function connection(ws, req) {
    console.log(
      "Connected " + ws._socket.remoteAddress + ", " + ws._socket.remotePort
    );

    const code = urlParser.parse(req.url).path.substr(1);
    codeMap[code] = ws._socket.remoteAddress + ":" + ws._socket.remotePort;

    ws.on("message", function incoming(message) {
      let dataPayload = JSON.parse(message);
      destWin.send("newData", dataPayload);
    });

    destWin.send("readyConnection");
  });

  return wss;
}

// Send terminate signal to the clients that is assigned to the code and do other clean up
function terminateClient(wss, code) {
  wss.clients.forEach((client) => {
    if (
      codeMap[code] ==
      client._socket.remoteAddress + ":" + client._socket.remotePort
    ) {
      client.send("Terminate");
      client.close();
      delete codeMap[code];
    }
  });
}

// Send start signal to the clients that is assigned to the code
function sendStartDatastream(wss, code) {
  wss.clients.forEach((client) => {
    if (
      codeMap[code] ==
      client._socket.remoteAddress + ":" + client._socket.remotePort
    ) {
      client.send("Start");
    }
  });
}

module.exports = {
  startServer: startServer,
  terminateClient: terminateClient,
  sendStartDatastream: sendStartDatastream,
};
