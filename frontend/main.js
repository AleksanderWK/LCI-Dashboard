const { app, BrowserWindow, ipcMain } = require('electron')
const ipc = require("electron").ipcMain;
const WebSocket = require("ws");

let win = null;
function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  window.loadURL('http://localhost:3000')
  //win.webContents.openDevTools()

  win = window;
}

app.whenReady().then(createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


const wss = new WebSocket.Server({
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
  console.log("Connected");

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    win.send("newHello", 'received: ' + message)
  });

  ws.send('something');
});

setTimeout(() => {
  win.send("newHello", "hello there")
}, 2000);

ipc.on("newValue", (event, value) => {
  console.log(value);
})