import { BANK_APPS, getDb, initDb } from "./db";
import { matchNotification } from "./matcher";
import { isOwnTransfer } from "./ownTransfers";

function loadPatterns(db) {
  return db.getAllAsync(
    "SELECT * FROM patterns WHERE enabled = 1 ORDER BY created_at, id",
  );
}

async function applyMatch(db, row, result) {
  if (!result) return null;
  const { pattern, amountSen, merchant } = result;
  let status = pattern.action === "ignore" ? "ignored" : "matched";
  if (status === "matched" && amountSen == null) return null;
  if (status === "matched" && (await isOwnTransfer(merchant)))
    status = "own_transfer";
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
  return status;
}

export async function ingestNotification({ app, title, body, postedAt }) {
  if (!BANK_APPS.includes(app)) return null;
  const db = await initDb();
  const res = await db.runAsync(
    "INSERT OR IGNORE INTO notifications (app, title, body, posted_at) VALUES (?, ?, ?, ?)",
    [app, title ?? null, body, postedAt],
  );
  console.log(res);
  if (res.changes === 0) return null;
  const row = { id: res.lastInsertRowId, posted_at: postedAt };
  const patterns = await loadPatterns(db);
  const result = matchNotification(patterns, { app, body });
  const status = (await applyMatch(db, row, result)) || "unmatched";
  return {
    id: row.id,
    status,
    amountSen: result ? result.amountSen : null,
    merchant: result ? result.merchant : null,
  };
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
