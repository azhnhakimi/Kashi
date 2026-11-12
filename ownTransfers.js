import { initDb } from "./db";

export const SETTING_SKIP_OWN = "skip_own_transfers";
export const MIN_FRAGMENT_LENGTH = 4;

export function normalizeFragment(text) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isValidFragment(text) {
  return normalizeFragment(text).length >= MIN_FRAGMENT_LENGTH;
}

export function matchesOwnAccount(counterparty, fragments) {
  const target = normalizeFragment(counterparty).toLowerCase();
  if (!target) return false;
  return fragments.some((f) => {
    const needle = normalizeFragment(f).toLowerCase();
    return needle.length >= MIN_FRAGMENT_LENGTH && target.includes(needle);
  });
}

export async function getSetting(key, fallback) {
  const db = await initDb();
  const row = await db.getFirstAsync(
    "SELECT value FROM settings WHERE key = ?",
    [key],
  );
  return row ? row.value : fallback;
}

export async function setSetting(key, value) {
  const db = await initDb();
  await db.runAsync(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, String(value)],
  );
}

export async function isSkipEnabled() {
  return (await getSetting(SETTING_SKIP_OWN, "1")) === "1";
}

export async function listFragments() {
  const db = await initDb();
  return db.getAllAsync(
    "SELECT id, fragment FROM my_accounts ORDER BY created_at DESC",
  );
}

export async function addFragment(text) {
  if (!isValidFragment(text)) return false;
  const db = await initDb();
  await db.runAsync(
    "INSERT OR IGNORE INTO my_accounts (fragment, created_at) VALUES (?, ?)",
    [normalizeFragment(text), Date.now()],
  );
  return true;
}

export async function removeFragment(id) {
  const db = await initDb();
  await db.runAsync("DELETE FROM my_accounts WHERE id = ?", [id]);
}

export async function isOwnTransfer(counterparty) {
  if (!(await isSkipEnabled())) return false;
  const rows = await listFragments();
  return matchesOwnAccount(
    counterparty,
    rows.map((r) => r.fragment),
  );
}
