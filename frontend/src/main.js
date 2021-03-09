const { app, BrowserWindow } = require("electron");

let win = null;
function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadURL("http://localhost:3000");
  //win.webContents.openDevTools()

  win = window;
}

function getWindow() {
  return win;
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

module.exports = {
  win: win,
  getWindow: getWindow,
};

require("./ipc");
