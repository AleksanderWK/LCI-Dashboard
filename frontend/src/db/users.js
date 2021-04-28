/**
 * Database queries for the users Datastore.
 * Function names are self-explanatory, see NeDB documentation (https://github.com/louischatriot/nedb) for details of query functions and language.
 * A Promise object is usually wrapped around the query itself, so that the callers can use the functions asynchronously, with for instance .then().
 */

let { db } = require("./nedb.js");

function insertUser(data) {
  return new Promise((resolve, reject) => {
    db.users.insert(data, function (err, doc) {
      resolve(doc._id);
    });
  });
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
    db.users.findOne({ _id: id }, (err, docs) => {
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
