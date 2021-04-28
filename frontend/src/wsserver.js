const WebSocket = require("ws");
const { insertSession } = require("./db/sessions.js");
const urlParser = require("url");

// Map that keeps maps session codes to connection details (ip + port)
let codeMap = {};

/**
 * Start the server and define callbacks for connection and message.
 * Uses the default settings that can be found on the websocket server github documentation. https://github.com/websockets/ws
 * @param {BrowserWindow} destWin is the destination window, i.e. where the data recieved from the socket will be sent to, essentially the electron window
 */
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

  // When a backend has connected, setup everything that is needed
  wss.on("connection", function connection(ws, req) {
    console.log(
      "Connected " + ws._socket.remoteAddress + ", " + ws._socket.remotePort
    );

    // Take the session code from the connection url
    const code = urlParser.parse(req.url).path.substr(1);
    codeMap[code] = ws._socket.remoteAddress + ":" + ws._socket.remotePort;

    // Parse the data sent from backend and send it to the destination window
    ws.on("message", function incoming(message) {
      let dataPayload = JSON.parse(message);
      destWin.send("newData", dataPayload);
    });

    // Send signal to destination window that a new connection with a backend have been established
    destWin.send("readyConnection");
  });

  // Return the server so it can be referenced by the main code
  return wss;
}

/**
 * Send terminate signal to the clients that is assigned to the code and do other clean up
 * @param {WebSocket.Server} wss - The web socket server
 * @param {String} code - The code for the client to be terminated for. Can be found in the codeMap-object
 */
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

/**
 * Send start signal to the clients that is assigned to the code
 * @param {WebSocket.Server} wss - The web socket server
 * @param {String} code - The code for the client to be start datastream for. Can be found in the codeMap-object
 */
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
