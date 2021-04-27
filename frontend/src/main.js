const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

/**
 * Create the main window of the electron application.
 */
let win = null;
function createWindow() {
  const window = new BrowserWindow({
    title: "LCI Dashboard",
    minWidth: 780,
    minHeight: 600,
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: "src/images/logo.png",
    frame: false,
  });

  // localhost:3000 is used in development refering to the react development server
  // TODO: This could be replaced by loadFile with the react build files for production
  window.loadURL("http://localhost:3000");
  window.setMenu(null);
  win = window;
}

function getWindow() {
  return win;
}

/**
 * When the app is ready set up development shortcuts and create the window
 */
app.whenReady().then(() => {
  globalShortcut.register("Ctrl+Shift+I", () => {
    win.webContents.toggleDevTools();
  });

  globalShortcut.register("Ctrl+R", () => {
    win.reload();
  });

  createWindow();
});

/**
 * When all the window is closed, quit the app
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * When the app activates create the window
 */
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

module.exports = {
  win: win,
  getWindow: getWindow,
};

// ipc events and listeners is included at the end after everything has been set up
require("./ipc");
