const sqlite = require('sqlite3');

let db;

module.exports = function createDatabase() {
  if (db) {
    return Promise.resolve(db);
  }
  return new Promise((resolve) => {
    db = new sqlite.Database(process.env.BOOK_DB, () => resolve(db));
  })
}