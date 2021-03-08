let { db } = require("./nedb.js");

db.sessions.persistence.setAutocompactionInterval(10000);

function insertSession(data) {
  db.sessions.insert(data);
}

function pushDataPointToSession(data, name, student) {
  db.sessions.update(
    { sessionName: name, studentName: student },
    { $push: { data: data } },
    { multi: false, upsert: false },
    () => {}
  );
}

module.exports = {
  insertSession: insertSession,
  pushDataPointToSession: pushDataPointToSession,
};
