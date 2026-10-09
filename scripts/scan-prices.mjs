#!/usr/bin/env node
// Price scan for the Budget filter. Reads each brand's public product feed
// (Shopify /products.json, or the WooCommerce Store API) and records the
// typical price of what it sells.
//   node scripts/scan-prices.mjs            → scan every shop, write docs/reports/price-scan.md + .json (~20 min)
//   node scripts/scan-prices.mjs --report   → rebuild the .md from the saved .json
// Report only: the site reads the `budget` field on each brand, which is set by
// hand from this report (see CLAUDE.md).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, loadDesigners } from './lib/brands.mjs';

// Shopify answers 429 when many stores are read quickly from one address, so go slowly.
const CONCURRENCY = 2;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TIMEOUT_MS = 25000;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
// Rough rates to shekels for the few stores that price in another currency.
const TO_ILS = { ILS: 1, USD: 3.7, EUR: 4.0, GBP: 4.7 };
// Things that aren't the brand's real product range.
const SKIP = /gift ?card|כרטיס מתנה|שובר|voucher|sample|דוגמ|shipping|משלוח|packaging|אריזה|bag charge/i;

async function get(url, json = true, tries = 4) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA, 'Accept': json ? 'application/json' : '*/*' } });
    if (res.status === 429 && tries > 1) {
      clearTimeout(timer);
      await sleep(20000 * (5 - tries));
      return get(url, json, tries - 1);
    }
    if (!res.ok) return null;
    if (json && !/json/i.test(res.headers.get('content-type') || '')) return null;
    return json ? await res.json() : await res.text();
  } catch { return null; } finally { clearTimeout(timer); }
}

async function shopify(origin) {
  // Some stores close /products.json but still answer the collection route
  const first = (await get(origin + '/products.json?limit=250')) || (await get(origin + '/collections/all/products.json?limit=250'));
  if (!first || !Array.isArray(first.products)) return null;
  let products = first.products;
  if (products.length === 250) {
    const more = await get(origin + '/products.json?limit=250&page=2');
    if (more?.products) products = products.concat(more.products);
  }
  const meta = await get(origin + '/meta.json');
  const currency = meta?.currency || 'ILS';
  const prices = [];
  for (const p of products) {
    if (SKIP.test(p.title || '') || SKIP.test(p.product_type || '')) continue;
    const vs = (p.variants || []).map(v => parseFloat(v.price)).filter(n => n > 0);
    if (vs.length) prices.push(Math.min(...vs));
  }
  return { platform: 'shopify', currency, prices };
}

async function woo(origin) {
  const list = await get(origin + '/wp-json/wc/store/v1/products?per_page=100');
  if (!Array.isArray(list)) return null;
  const prices = [];
  let currency = 'ILS';
  for (const p of list) {
    if (SKIP.test(p.name || '')) continue;
    const pr = p.prices;
    if (!pr) continue;
    currency = pr.currency_code || currency;
    const n = parseInt(pr.price, 10) / 10 ** (pr.currency_minor_unit ?? 2);
    if (n > 0) prices.push(n);
  }
  return { platform: 'woocommerce', currency, prices };
}

const pct = (a, q) => a[Math.min(a.length - 1, Math.floor(q * a.length))];

async function scan(d) {
  let origin;
  try { origin = new URL(d.url).origin; } catch { return { name: d.name, platform: 'unknown' }; }
  if (/instagram\.com|facebook\.com/.test(origin)) return { name: d.name, url: d.url, platform: 'instagram' };
  const r = (await shopify(origin)) || (await woo(origin));
  if (!r || r.prices.length < 3) return { name: d.name, url: d.url, platform: r ? r.platform : 'other', products: r?.prices.length || 0 };
  const rate = TO_ILS[r.currency] ?? null;
  const ils = r.prices.map(p => Math.round(p * (rate ?? 1))).sort((a, b) => a - b);
  return {
    name: d.name, url: d.url, platform: r.platform, currency: r.currency, converted: rate == null ? 'unknown currency' : rate !== 1,
    products: ils.length, p25: pct(ils, 0.25), median: pct(ils, 0.5), p75: pct(ils, 0.75),
    tags: d.tags,
  };
}

const designers = loadDesigners();
const JSON_PATH = path.join(ROOT, 'docs', 'reports', 'price-scan.json');
let results = [];
if (process.argv.includes('--report')) {
  // Rebuild the report from the last scan without fetching anything
  results = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
} else {
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < designers.length) {
      results.push(await scan(designers[next++]));
      await sleep(1500);
      if (results.length % 50 === 0) console.error(`${results.length}/${designers.length}`);
    }
  }));
}
results.sort((a, b) => a.name.localeCompare(b.name));
const priced = results.filter(r => r.median);

// Each brand is compared with its own kind of product: a ₪ ring and a ₪ coat are
// both the affordable end of their range. Thresholds are the brand's median
// price in shekels: at or below the first is ₪, at or below the second ₪₪, above ₪₪₪.
const CATEGORIES = [
  ['jewelry', t => t.includes('jewelry'), 450, 2000],
  ['swimwear', t => t.includes('swimwear'), 200, 350],
  ['footwear', t => t.includes('footwear'), 400, 800],
  ['lingerie', t => t.includes('lingerie'), 150, 300],
  ['accessories', t => t.includes('accessories') && !t.includes('ready-to-wear'), 200, 450],
  ['bridal', (t, d) => d?.bridalOnly, 1000, 5000],
  ['clothing', () => true, 220, 450],
];
const byName = new Map(designers.map(d => [d.name, d]));
for (const r of priced) {
  const d = byName.get(r.name);
  const [cat, , low, high] = CATEGORIES.find(([, test]) => test(d?.tags || r.tags || [], d));
  r.category = cat;
  r.level = r.median <= low ? 1 : r.median <= high ? 2 : 3;
  r.check = [
    r.products < 6 && 'few products',
    r.converted && `priced in ${r.currency}, converted`,
    r.category === 'bridal' && 'shop may list accessories, not gowns',
  ].filter(Boolean).join('; ');
}

const dir = path.join(ROOT, 'docs', 'reports');
mkdirSync(dir, { recursive: true });
writeFileSync(JSON_PATH, JSON.stringify(results, null, 1));
const date = new Date().toISOString().slice(0, 10);
const signs = n => '₪'.repeat(n);
let md = `# Price scan — ${date}\n\nGenerated by \`node scripts/scan-prices.mjs\`. Read the public product feed of ${priced.length} of ${designers.length} brands `;
md += `(Shopify or WooCommerce). "Typical" is the median price of everything the shop lists, in shekels (USD ×3.7, EUR ×4). `;
md += `Each brand is compared with its own kind of product:\n\n| Kind | ₪ up to | ₪₪ up to | ₪₪₪ above |\n|---|---|---|---|\n`;
for (const [cat, , low, high] of CATEGORIES) md += `| ${cat} | ₪${low} | ₪${high} | ₪${high} |\n`;
md += `\nThe \`budget\` field on each brand in \`index.html\` is set from this table by hand, so a level can be corrected without rerunning the scan.\n`;
for (const cat of CATEGORIES.map(c => c[0])) {
  const rows = priced.filter(r => r.category === cat).sort((a, b) => a.median - b.median);
  if (!rows.length) continue;
  md += `\n## ${cat} (${rows.length})\n\n| Brand | Level | Typical | Middle half | Products | Check |\n|---|---|---|---|---|---|\n`;
  for (const r of rows) md += `| ${r.name} | ${signs(r.level)} | ₪${r.median} | ₪${r.p25}–${r.p75} | ${r.products}${r.converted ? ` (${r.currency})` : ''} | ${r.check} |\n`;
}
// Brands with no readable feed were priced by hand from their sites (docs/reports/price-estimates.json)
const EST_PATH = path.join(dir, 'price-estimates.json');
const estimates = existsSync(EST_PATH) ? JSON.parse(readFileSync(EST_PATH, 'utf8')) : [];
const unpriced = results.filter(r => !r.median);
const est = new Map(estimates.map(e => [e.name, e]));
const estimated = unpriced.filter(r => est.get(r.name)?.level);
md += `\n## Estimated by hand (${estimated.length})\n\nNo readable feed, so prices were read from each brand's own site (or, where it shows none, one published source). Kept in \`docs/reports/price-estimates.json\`.\n\n| Brand | Level | Typical | Prices seen | Confidence | Source |\n|---|---|---|---|---|---|\n`;
for (const r of estimated.sort((a, b) => a.name.localeCompare(b.name))) {
  const e = est.get(r.name);
  md += `| ${r.name} | ${signs(e.level)} | ${e.median_ils ? '₪' + e.median_ils : ''} | ${e.prices_seen ?? ''} | ${e.confidence} | ${String(e.source).replace(/\|/g, '/')} |\n`;
}
const unknown = unpriced.filter(r => !est.get(r.name)?.level);
md += `\n## No level (${unknown.length})\n\nNo prices found anywhere. These drop out while a Budget filter is on.\n\n| Brand | Why |\n|---|---|\n`;
for (const r of unknown) md += `| ${r.name} | ${String(est.get(r.name)?.source || 'not checked').replace(/\|/g, '/')} |\n`;
writeFileSync(path.join(dir, 'price-scan.md'), md);
console.log(`priced ${priced.length}/${designers.length} (shopify ${priced.filter(r => r.platform === 'shopify').length}, woo ${priced.filter(r => r.platform === 'woocommerce').length})`);
