import { BANK_APPS, getDb } from "./db";
import { matchNotification } from "./matcher";

function loadPatterns(db) {
  return db.getAllAsync(
    "SELECT * FROM patterns WHERE enabled = 1 ORDER BY created_at, id",
  );
}

async function applyMatch(db, row, result) {
  if (!result) return false;
  const { pattern, amountSen, merchant } = result;
  const status = pattern.action === "ignore" ? "ignored" : "matched";
  if (status === "matched" && amountSen == null) return false;
  await db.runAsync(
    "UPDATE notifications SET status = ?, pattern_id = ? WHERE id = ?",
    [status, pattern.id, row.id],
  );
  if (status === "matched") {
    await db.runAsync(
      "INSERT OR IGNORE INTO transactions (notification_id, amount_sen, merchant, occurred_at, source) VALUES (?, ?, ?, ?, ?)",
      [row.id, amountSen, merchant, row.posted_at, "auto"],
    );
  }
  return true;
}

export async function ingestNotification({ app, title, body, postedAt }) {
  if (!BANK_APPS.includes(app)) return null;
  const db = await getDb();
  const res = await db.runAsync(
    "INSERT OR IGNORE INTO notifications (app, title, body, posted_at) VALUES (?, ?, ?, ?)",
    [app, title ?? null, body, postedAt],
  );
  if (res.changes === 0) return null;
  const row = { id: res.lastInsertRowId, posted_at: postedAt };
  const patterns = await loadPatterns(db);
  await applyMatch(db, row, matchNotification(patterns, { app, body }));
  return row.id;
}

export async function reprocessUnmatched() {
  const db = await getDb();
  const patterns = await loadPatterns(db);
  const rows = await db.getAllAsync(
    "SELECT * FROM notifications WHERE status = 'unmatched'",
  );
  let count = 0;
  for (const row of rows) {
    if (await applyMatch(db, row, matchNotification(patterns, row))) count++;
  }
  return count;
}
