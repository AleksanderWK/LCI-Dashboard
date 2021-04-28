/**
 * The IPC (Inter Process Communcation) (for more info: https://www.electronjs.org/docs/api/ipc-main) file contains all the events and listeners needed to communcate
 * with the electron browser window, essentially communcating with the React App.
 * This includes everything like database interactions, web socket interactions and session code generations that the browser window needs in the application.
 * The events themselves should have self-explanatory names, and most of code is delegated to other files.
 * This file is included at the end of the main file after all the application setup.
 */

const ipc = require("electron").ipcMain;
const {
  startServer,
  sendStartDatastream,
  terminateClient,
} = require("./wsserver.js");
const {
  getUserByName,
  getUsers,
  insertUser,
  getUserByID,
} = require("./db/users.js");
const {
  insertSession,
  getSession,
  updateSessionEndTime,
  getRecordedSessions,
} = require("./db/sessions.js");
const {
  pushDataPointToSession,
  getSessionRecording,
} = require("./db/recordings.js");
const { win, getWindow } = require("./main.js");
const { generateCode } = require("./codegen.js");

let wss = null;

ipc.on("startServer", (event, ready) => {
  if (ready) {
    wss = startServer(getWindow());
  }
});

ipc.handle("getUserByID", async (event, userID) => {
  return getUserByID(userID).then((userID) => {
    return userID;
  });
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

ipc.on("getRecordedSessions", (event) => {
  getRecordedSessions().then((sessions) => {
    event.reply("getRecordedSessions-reply", sessions);
  });
});

ipc.handle("getSession", async (event, sessionId) => {
  return getSession(sessionId).then((session) => {
    return session;
  });
});

ipc.handle("insertSession", async (event, data) => {
  return insertSession(data).then((sessionId) => {
    return sessionId;
  });
});

ipc.on("updateSessionEndTime", (event, data) => {
  updateSessionEndTime(data._id, data.timestamp);
});

ipc.handle("getSessionRecording", async (event, sessionId) => {
  return getSessionRecording(sessionId).then((data) => {
    return data;
  });
});

ipc.on("pushDataPointToSession", (event, data) => {
  pushDataPointToSession(
    data.timestamp,
    data.data,
    data.sessionId,
    data.recordingId
  );
});

ipc.on("getCode", (event) => {
  event.reply("getCode-reply", generateCode());
});

ipc.on("startDatastream", (event, sessionCode) => {
  sendStartDatastream(wss, sessionCode);
});

ipc.on("terminateSession", (event, sessionCode) => {
  terminateClient(wss, sessionCode);
});
