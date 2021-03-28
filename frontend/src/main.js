const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

let win = null;
function createWindow() {
  const window = new BrowserWindow({
    title: "LCI Dashboard",
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: "src/logo.png",
    frame: false,
  });

  window.loadURL("http://localhost:3000");

  window.setMenu(null);

  win = window;
}

function getWindow() {
  return win;
}

app.whenReady().then(() => {
  globalShortcut.register("Ctrl+Shift+I", () => {
    win.webContents.toggleDevTools();
  });

  globalShortcut.register("Ctrl+R", () => {
    win.reload();
  });

  createWindow();
});

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
