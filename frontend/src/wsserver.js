const WebSocket = require("ws");
const ipc = require("electron").ipcMain;

let wss = null;
function startServer(destWin) {
    
    wss = new WebSocket.Server({
      port: 8080,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
      }
    });
    
    wss.on('connection', function connection(ws) {
      console.log("Connected " + ws._socket.remoteAddress + ", " + ws._socket.remotePort);
      
      ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        destWin.send("newData", 'received: ' + message)
        
        let variables = JSON.parse(message);
        //console.log(variables.pd)
        //console.log(variables);

      });
    
      ws.send('something');

      setTimeout(() => {
        terminateClient();
      }, 5000)
    });
    
    /*
    wss.clients.forEach(client => {
      let clientID = client._socket.remoteAddress + ":" + ws._socket.remotePort;
      console.log(clientID)
    });
    */
}


function terminateClient() {
  wss.clients.forEach(client => {
    let clientID = client._socket.remoteAddress + ":" + client._socket.remotePort;
    console.log(clientID)
  })
}

module.exports = {
    startServer: startServer
};