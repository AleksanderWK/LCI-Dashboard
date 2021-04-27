/**
 * Set up the three Datastores with NeDB (for more info: https://github.com/louischatriot/nedb): users, sessions, recordings
 */

let Datastore = require("nedb");
let db = {};

db.users = new Datastore({
  filename: "./data/users.db",
});

db.sessions = new Datastore({
  filename: "./data/sessions.db",
});

db.recordings = new Datastore({
  filename: "./data/recordings.db",
});

db.users.loadDatabase();
db.sessions.loadDatabase();
db.recordings.loadDatabase();

module.exports = {
  db: db,
};
