/**
 * Database queries for the sessions Datastore.
 * For more info see NeDB documentation (https://github.com/louischatriot/nedb) for details of query functions and language.
 * A Promise object is usually wrapped around the query itself, so that the callers can use the functions asynchronously, with for instance .then().
 */

let { db } = require("./nedb.js");

/**
 * Gets the auto incremented ID for a session. This is used in subsequent insert queries.
 * @param {*} cb
 * @returns
 */
db.sessions.getAutoincrementId = function (cb) {
  this.update(
    { _id: "__autoid__" },
    { $inc: { seq: 1 } },
    { upsert: true, returnUpdatedDocs: true },
    function (err, affected, autoid) {
      cb && cb(err, autoid.seq);
    }
  );
  db.sessions.persistence.compactDatafile();
  return this;
};

function insertSession(data) {
  return new Promise((resolve, reject) => {
    db.sessions.getAutoincrementId((err, autoId) => {
      db.sessions.insert({ ...data, _id: autoId }, function (err, doc) {
        resolve(doc._id);
      });
    });
  });
}

function updateSessionEndTime(id, timestamp) {
  db.sessions.update({ _id: id }, { $set: { endTime: timestamp } }, {});
  db.sessions.persistence.compactDatafile();
}

function getRecordedSessions() {
  return new Promise((resolve, reject) => {
    // Find all session ids which has a recording
    db.recordings.find(
      {},
      { startTime: 0, endTime: 0, data: 0 },
      (err, recordingIds) => {
        // Find all sessions for those ids
        db.sessions
          .find({
            _id: { $in: recordingIds.map((recordingId) => recordingId._id) },
          })
          .sort({ startTime: -1 })
          .exec((err, docs) => {
            resolve(docs);
          });
      }
    );
  });
}

function getSession(sessionId) {
  return new Promise((resolve, reject) => {
    db.sessions.findOne({ _id: sessionId }, (err, doc) => {
      resolve(doc);
    });
  });
}

module.exports = {
  insertSession: insertSession,
  getSession: getSession,
  updateSessionEndTime: updateSessionEndTime,
  getRecordedSessions: getRecordedSessions,
};
