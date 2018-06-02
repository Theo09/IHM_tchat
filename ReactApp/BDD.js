const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('database', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
db.serialize(function() {
  db.run("CREATE TABLE user (name TEXT, pwd TEXT)");
});
