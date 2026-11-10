import * as SQLite from "expo-sqlite";

export const BANK_APPS = ["com.cimb.cimbocto", "com.bankislam.bimbmobile"];

let dbPromise;

export function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync("budget.db");
  return dbPromise;
}

async function addColumnIfMissing(db, table, column, type) {
  const cols = await db.getAllAsync(`PRAGMA table_info(${table})`);
  if (cols.some((c) => c.name === column)) return false;
  await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  return true;
}

let initPromise;

export function initDb() {
  if (!initPromise) initPromise = runInit();
  return initPromise;
}

const builtInPatterns = [
  [
    "bimb-transfer-out",
    "com.bankislam.bimbmobile",
    "Your transfer of RM{amount} to {merchant} on {*}",
    "expense",
  ],
  [
    "cimb-duitnow-out",
    "com.cimb.cimbocto",
    "{*} to Acct RM {amount} to {merchant} on {*}",
    "expense",
  ],
  [
    "bimb-credit",
    "com.bankislam.bimbmobile",
    "BIMB: RM{*} received from {*}",
    "ignore",
  ],
  ["cimb-credit", "com.cimb.cimbocto", "You{*}ve received RM{*}", "ignore"],
];

async function seedBuiltInPatterns(db) {
  const now = Date.now();
  for (const [id, app, template, action] of builtInPatterns) {
    await db.runAsync(
      "INSERT OR IGNORE INTO patterns (id, app, template, action, enabled, built_in, created_at) VALUES (?, ?, ?, ?, 1, 1, ?)",
      [id, app, template, action, now],
    );
  }
}

async function runInit() {
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
      source TEXT NOT NULL,
      remote_id TEXT,
      synced_at INTEGER
    );
  `);

  await seedBuiltInPatterns(db);
  return db;
}
