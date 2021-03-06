const ipc = require("electron").ipcMain;
const { startServer } = require("./wsserver.js");
const { getUserByName, getUsers, insertUser } = require("./db/users.js");
const { win, getWindow } = require("./main.js");
const { generateCode } = require("./codegen.js");

ipc.on("readyConnection", (event, ready) => {
  if (ready) {
    startServer(getWindow());
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

ipc.on("insertUser", (event, user) => {
  insertUser(user);
});

ipc.on("getCode", (event) => {
  event.reply("getCode-reply", generateCode());
});
