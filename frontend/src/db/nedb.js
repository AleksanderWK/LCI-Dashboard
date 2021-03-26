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
