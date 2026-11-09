import * as SQLite from "expo-sqlite";

export const BANK_APPS = ["com.cimb.cimbocto", "com.bankislam.bimbmobile"];

let dbPromise;

export function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync("budget.db");
  return dbPromise;
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app TEXT NOT NULL,
      title TEXT,
      body TEXT NOT NULL,
      posted_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'unmatched',
      pattern_id TEXT,
      UNIQUE (app, posted_at)
    );
    CREATE TABLE IF NOT EXISTS patterns (
      id TEXT PRIMARY KEY,
      app TEXT NOT NULL,
      template TEXT NOT NULL,
      action TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      built_in INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notification_id INTEGER UNIQUE,
      amount_sen INTEGER NOT NULL,
      merchant TEXT,
      occurred_at INTEGER NOT NULL,
      source TEXT NOT NULL
    );
  `);
  return db;
}
