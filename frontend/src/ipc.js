const ipc = require("electron").ipcMain;
const { startServer, sendStartDatastream } = require("./wsserver.js");
const { getUserByName, getUsers, insertUser } = require("./db/users.js");
const {
  insertSession,
  pushDataPointToSession,
  getSessions,
} = require("./db/sessions.js");
const { win, getWindow } = require("./main.js");
const { generateCode } = require("./codegen.js");

let wss = null;

ipc.on("startServer", (event, ready) => {
  if (ready) {
    wss = startServer(getWindow());
  }
});

ipc.on("getUser", (event, name) => {
  getUserByName(name).then((user) => {
    event.reply("getUser-reply", user);
  });
});

ipc.on("getUsers", (event) => {
  getUsers().then((users) => {
    event.reply("getUsers-reply", users);
  });
});

ipc.handle("insertUser", async (event, data) => {
  return insertUser(data).then((userId) => {
    return userId;
  });
});

ipc.on("getSessions", (event) => {
  getSessions().then((sessions) => {
    event.reply("getSessions-reply", sessions);
  });
});

ipc.handle("insertSession", async (event, data) => {
  return insertSession(data).then((sessionId) => {
    return sessionId;
  });
});

ipc.on("pushDataPointToSession", (event, data) => {
  pushDataPointToSession(data.data, data.sessionId);
});

ipc.on("getCode", (event) => {
  event.reply("getCode-reply", generateCode());
});

ipc.on("startDatastream", (event, user) => {
  sendStartDatastream(wss);
});
