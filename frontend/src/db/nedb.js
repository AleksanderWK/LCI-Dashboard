let Datastore = require("nedb");
let db = {};

db.users = new Datastore({
  filename: "./data/users.db",
});

db.sessions = new Datastore({
  filename: "./data/sessions.db",
});

db.users.loadDatabase();
db.sessions.loadDatabase();

module.exports = {
  db: db,
};
