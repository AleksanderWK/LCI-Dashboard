let { db } = require("./nedb.js");

db.sessions.persistence.setAutocompactionInterval(10000);

function insertSession(data) {
  return new Promise((resolve, reject) => {
    db.sessions.insert(data, function (err, doc) {
      resolve(doc._id);
    });
  });
}

function pushDataPointToSession(data, sessionId) {
  db.sessions.update(
    { _id: sessionId },
    { $push: { data: data } },
    { multi: false, upsert: false },
    () => {}
  );
}

module.exports = {
  insertSession: insertSession,
  pushDataPointToSession: pushDataPointToSession,
};
