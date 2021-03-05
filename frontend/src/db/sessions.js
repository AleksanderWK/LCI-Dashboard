let { db } = require("./nedb.js");

function insertSession(data) {
  db.sessions.insert(data);
}

module.exports = {
  insertSession: insertSession,
};
