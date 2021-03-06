let { db } = require("./nedb.js");

function insertUser(data) {
  db.users.insert(data);
}

function getUserByName(name) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ name: name }, (err, doc) => {
      return doc;
    });
  });
}

function getUserByID(id) {
  return new Promise((resolve, reject) => {
    db.users.find({ _id: id }, (err, docs) => {
      resolve(docs);
    });
  });
}

function getUsers() {
  return new Promise((resolve, reject) => {
    db.users.find({}, (err, docs) => {
      resolve(docs);
    });
  });
}

module.exports = {
  insertUser: insertUser,
  getUserByName: getUserByName,
  getUserByID: getUserByID,
  getUsers: getUsers,
};
