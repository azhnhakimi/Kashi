const PLACEHOLDERS = {
  "{amount}": { source: "([\\d,]+\\.\\d{2})", field: "amount" },
  "{merchant}": { source: "([\\s\\S]+?)", field: "merchant" },
  "{*}": { source: "[\\s\\S]*?", field: null },
};

const TOKEN = /(\{amount\}|\{merchant\}|\{\*\})/;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalize(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function compileTemplate(template) {
  const parts = normalize(template)
    .split(TOKEN)
    .filter((p) => p !== "");
  const fields = [];
  let source = "^";
  parts.forEach((part, i) => {
    const ph = PLACEHOLDERS[part];
    if (!ph) {
      source += escapeRegex(part);
      return;
    }
    if (ph.field) fields.push(ph.field);
    const isLast = i === parts.length - 1;
    source += ph.field === "merchant" && isLast ? "([\\s\\S]+)" : ph.source;
  });
  try {
    return { regex: new RegExp(source, "i"), fields };
  } catch {
    return null;
  }
}

export function validateTemplate(template, action) {
  const compiled = compileTemplate(template);
  if (!compiled) return "Template could not be compiled";
  const count = (f) => compiled.fields.filter((x) => x === f).length;
  if (count("amount") > 1) return "Use {amount} only once";
  if (count("merchant") > 1) return "Use {merchant} only once";
  if (action === "expense" && count("amount") === 0)
    return "Expense patterns need {amount}";
  const fixed = normalize(template)
    .replace(/\{(amount|merchant|\*)\}/g, "")
    .trim();
  if (fixed.length < 5) return "Add more fixed text so the pattern is specific";
  return null;
}

const cache = new Map();

function getCompiled(template) {
  if (!cache.has(template)) cache.set(template, compileTemplate(template));
  return cache.get(template);
}

export function toSen(amountText) {
  return Math.round(parseFloat(amountText.replace(/,/g, "")) * 100);
}

export function matchNotification(patterns, notification) {
  const body = normalize(notification.body);
  for (const pattern of patterns) {
    if (!pattern.enabled || pattern.app !== notification.app) continue;
    const compiled = getCompiled(pattern.template);
    if (!compiled) continue;
    const m = body.match(compiled.regex);
    if (!m) continue;
    const values = {};
    compiled.fields.forEach((f, i) => {
      if (values[f] === undefined) values[f] = m[i + 1];
    });
    return {
      pattern,
      amountSen: values.amount ? toSen(values.amount) : null,
      merchant: values.merchant ? normalize(values.merchant) : null,
    };
  }
  return null;
}

const DATE_TOKEN = /\d{1,2}[ -]?[A-Za-z]{3}[ -]?\d{2,4}/;
const RM_AMOUNT = /(RM\s?)[\d,]+\.\d{2}/i;

export function suggestTemplate(body) {
  let t = normalize(body).replace(RM_AMOUNT, "$1{amount}");
  const d = t.match(DATE_TOKEN);
  if (d) t = t.slice(0, d.index) + "{*}";
  return t;
}
