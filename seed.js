import { getDb } from "./db";

const HOUR = 60 * 60 * 1000;

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

const demoNotifications = [
  {
    app: "com.bankislam.bimbmobile",
    title: "Transfer Successful",
    body: "Your transfer of RM12.50 to AHMAD K***/***1234 on 08 Nov 2026 01:10:00 PM is successful.",
    ago: 30,
    status: "matched",
    pattern: "bimb-transfer-out",
    sen: 1250,
    merchant: "AHMAD K***/***1234",
  },
  {
    app: "com.cimb.cimbocto",
    title: "CIMB OCTO MY",
    body: "DuitNow to Acct RM 30.00 to SITI N/Maybank on 08-Nov-2026, 19:45:12. Call the no at the back of your card for queries.",
    ago: 20,
    status: "matched",
    pattern: "cimb-duitnow-out",
    sen: 3000,
    merchant: "SITI N/Maybank",
  },
  {
    app: "com.bankislam.bimbmobile",
    title: "Bank Islam Transaction Alert",
    body: "BIMB: RM100.00 received from *Maybank via DuitNow Transfer to account **0000 on 08Nov26 09:00:00.",
    ago: 40,
    status: "ignored",
    pattern: "bimb-credit",
  },
  {
    app: "com.cimb.cimbocto",
    title: "CIMB OCTO MY",
    body: "Card purchase of RM 18.90 at MOCK CAFE on 09-Nov-2026, 12:30:00.",
    ago: 6,
    status: "unmatched",
  },
  {
    app: "com.bankislam.bimbmobile",
    title: "Payment Successful",
    body: "Your payment of RM45.00 to MOCK UTILITY on 09 Nov 2026 08:15:00 AM is successful.",
    ago: 10,
    status: "unmatched",
  },
  {
    app: "com.cimb.cimbocto",
    title: "CIMB OCTO MY",
    body: "Get 5% cashback this weekend with your card. T&C apply.",
    ago: 3,
    status: "unmatched",
  },
  {
    app: "com.cimb.cimbocto",
    title: "CIMB OCTO MY",
    body: "Card purchase of RM 7.50 at MOCK BAKERY on 09-Nov-2026, 09:10:00.",
    ago: 8,
    status: "unmatched",
  },
];

export async function seedBuiltInPatterns() {
  const db = await getDb();
  const now = Date.now();
  for (const [id, app, template, action] of builtInPatterns) {
    await db.runAsync(
      "INSERT OR IGNORE INTO patterns (id, app, template, action, enabled, built_in, created_at) VALUES (?, ?, ?, ?, 1, 1, ?)",
      [id, app, template, action, now],
    );
  }
}

export async function seedDemoNotifications() {
  const db = await getDb();
  const row = await db.getFirstAsync("SELECT COUNT(*) AS n FROM notifications");
  if (row.n > 0) return;
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    for (const n of demoNotifications) {
      const postedAt = now - n.ago * HOUR;
      const res = await db.runAsync(
        "INSERT INTO notifications (app, title, body, posted_at, status, pattern_id) VALUES (?, ?, ?, ?, ?, ?)",
        [n.app, n.title, n.body, postedAt, n.status, n.pattern ?? null],
      );
      if (n.sen) {
        await db.runAsync(
          "INSERT INTO transactions (notification_id, amount_sen, merchant, occurred_at, source) VALUES (?, ?, ?, ?, ?)",
          [res.lastInsertRowId, n.sen, n.merchant, postedAt, "auto"],
        );
      }
    }
  });
}

export async function resetDemo() {
  const db = await getDb();
  await db.execAsync(
    "DELETE FROM transactions; DELETE FROM notifications; DELETE FROM patterns WHERE built_in = 0;",
  );
  await seedDemoNotifications();
}
