const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('todos.db');

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority TEXT DEFAULT 'low',
    isComplete BOOLEAN DEFAULT 0,
    isFun BOOLEAN DEFAULT 1
  )`);
});

module.exports = db;
