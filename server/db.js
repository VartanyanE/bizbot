import sqlite3 from "sqlite3";

sqlite3.verbose();
const db = new sqlite3.Database("./bizbot.db");

// Create tables once at startup
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE,
      product_id TEXT,
      owner_email TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS workflows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_key TEXT,
      name TEXT,
      template_key TEXT,
      config_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id INTEGER,
      input_json TEXT,
      output_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
