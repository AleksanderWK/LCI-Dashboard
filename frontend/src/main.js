const { app, BrowserWindow, ipcMain } = require('electron')
const { startServer } = require("./wsserver.js")
const ipc = require("electron").ipcMain;

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

ipc.on("readyConnection", (event, ready) => {
  if (ready) {
    startServer(win);
  }
})

/*
setTimeout(() => {
  win.send("newHello", "hello there")
}, 2000);

ipc.on("newValue", (event, value) => {
  console.log(value);
})
*/