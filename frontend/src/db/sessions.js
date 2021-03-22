let { db } = require("./nedb.js");

db.sessions.getAutoincrementId = function (cb) {
  this.update(
    { _id: "__autoid__" },
    { $inc: { seq: 1 } },
    { upsert: true, returnUpdatedDocs: true },
    function (err, affected, autoid) {
      cb && cb(err, autoid.seq);
    }
  );
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

function getSessions() {
  return new Promise((resolve, reject) => {
    db.sessions.find({ _id: { $ne: "__autoid__" } }, (err, docs) => {
      resolve(docs);
    });
  });
}

module.exports = {
  insertSession: insertSession,
  getSessions: getSessions,
};
