import { initDb } from "./db";
import { isValidFragment, normalizeFragment } from "./ownTransfers";

export const DEFAULT_CATEGORY = "miscellaneous";

export function categoryFor(merchant, entries) {
  const target = normalizeFragment(merchant).toLowerCase();
  if (!target) return DEFAULT_CATEGORY;
  let best = null;
  for (const entry of entries) {
    const needle = normalizeFragment(entry.fragment).toLowerCase();
    if (!needle || !target.includes(needle)) continue;
    if (!best || needle.length > best.length) {
      best = { length: needle.length, category: entry.category };
    }
  }
  return best ? best.category : DEFAULT_CATEGORY;
}

export async function listMerchantCategories() {
  const db = await initDb();
  return db.getAllAsync(
    "SELECT id, fragment, category FROM merchant_categories ORDER BY created_at DESC",
  );
}

export async function addMerchantCategory(fragment, category) {
  if (!isValidFragment(fragment)) return false;
  const db = await initDb();
  await db.runAsync(
    "INSERT INTO merchant_categories (fragment, category, created_at) VALUES (?, ?, ?) ON CONFLICT(fragment) DO UPDATE SET category = excluded.category",
    [normalizeFragment(fragment), category, Date.now()],
  );
  return true;
}

export async function removeMerchantCategory(id) {
  const db = await initDb();
  await db.runAsync("DELETE FROM merchant_categories WHERE id = ?", [id]);
}
