#!/usr/bin/env node
// Link checker for hotlinked brand images and brand sites.
//   node scripts/check-links.mjs            → writes docs/reports/link-check.md + .json
//   node scripts/check-links.mjs --images   → images only (faster)
// Nothing on the site is changed; this only reports.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, loadDesigners, loadMapPins, loadBoutiques } from './lib/brands.mjs';

const IMAGES_ONLY = process.argv.includes('--images');
const CONCURRENCY = 8;
const TIMEOUT_MS = 25000;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function probe(url, kind) {
  if (!/^https?:\/\//i.test(url)) {
    return existsSync(path.join(ROOT, url.split('?')[0]))
      ? { status: 'ok', detail: 'local file' }
      : { status: 'dead', detail: 'local file missing' };
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: ctrl.signal,
        headers: {
          'User-Agent': UA,
          'Accept': kind === 'img' ? 'image/avif,image/webp,image/*,*/*;q=0.8' : 'text/html,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,he;q=0.8',
        },
      });
      const type = res.headers.get('content-type') || '';
      const finalUrl = res.url;
      let body = '';
      if (kind === 'site' && res.ok) body = (await res.text()).slice(0, 200000);
      else res.body?.cancel().catch(() => {});
      clearTimeout(timer);
      if (res.status === 404 || res.status === 410) return { status: 'dead', detail: `HTTP ${res.status}` };
      // 401/403/429/5xx usually mean bot protection or a hiccup, not a dead link.
      if (!res.ok) return { status: 'unsure', detail: `HTTP ${res.status}` };
      if (kind === 'img' && !/^image\//i.test(type) && !/octet-stream/i.test(type)) {
        return { status: 'dead', detail: `not an image (${type || 'no content-type'})` };
      }
      if (kind === 'site') {
        const fromHost = new URL(url).hostname.replace(/^www\./, '');
        const toHost = new URL(finalUrl).hostname.replace(/^www\./, '');
        if (/\/password(\?|$)/.test(finalUrl) || /<form[^>]+action="\/password"/i.test(body)) {
          return { status: 'gated', detail: 'store is behind a password page' };
        }
        if (fromHost !== toHost) return { status: 'moved', detail: `redirects to ${finalUrl}` };
      }
      return { status: 'ok', detail: `HTTP ${res.status}` };
    } catch (e) {
      clearTimeout(timer);
      const code = e.cause?.code || e.name;
      // One retry before calling anything: a DNS lookup can fail once under load.
      if (attempt === 1) {
        return code === 'ENOTFOUND'
          ? { status: 'dead', detail: 'domain does not resolve' }
          : { status: 'unsure', detail: String(code) };
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

function collect() {
  const jobs = [];
  for (const d of loadDesigners()) {
    if (d.img) jobs.push({ page: 'Designers', name: d.name, kind: 'img', url: d.img });
    if (!IMAGES_ONLY && d.url) jobs.push({ page: 'Designers', name: d.name, kind: 'site', url: d.url });
  }
  for (const s of loadBoutiques()) {
    if (s.img) jobs.push({ page: 'Boutiques', name: s.name, kind: 'img', url: s.img });
    if (!IMAGES_ONLY && s.url) jobs.push({ page: 'Boutiques', name: s.name, kind: 'site', url: s.url });
  }
  for (const p of loadMapPins()) {
    if (p.img) jobs.push({ page: 'Map', name: p.name, kind: 'img', url: p.img });
  }
  // The same URL is often used on more than one page; probe it once.
  const byUrl = new Map();
  for (const j of jobs) {
    const key = j.kind + ' ' + j.url;
    if (!byUrl.has(key)) byUrl.set(key, { ...j, pages: new Set() });
    byUrl.get(key).pages.add(j.page);
  }
  return [...byUrl.values()];
}

async function run() {
  const jobs = collect();
  let next = 0, done = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) {
      const job = jobs[next++];
      Object.assign(job, await probe(job.url, job.kind));
      if (++done % 50 === 0) console.error(`${done}/${jobs.length}`);
    }
  }));

  const date = new Date().toISOString().slice(0, 10);
  const groups = [
    ['dead', 'img', 'Dead images', 'The card is showing the coloured name block instead of a photo.'],
    ['dead', 'site', 'Dead sites', 'The domain is gone or the page returns 404. Check whether the brand is still active.'],
    ['gated', 'site', 'Password-gated stores', 'Per the editorial rules these come off the index.'],
    ['moved', 'site', 'Sites that moved', 'The listed URL redirects to a different domain. Update the URL, or check the brand still exists.'],
    ['unsure', 'img', 'Images that could not be confirmed', 'Blocked, timed out or errored for this script. Open in a browser to confirm.'],
    ['unsure', 'site', 'Sites that could not be confirmed', 'Usually bot protection (HTTP 403) rather than a real problem. Open in a browser to confirm.'],
  ];
  const ok = jobs.filter(j => j.status === 'ok').length;
  let md = `# Link check — ${date}\n\nChecked ${jobs.length} links (${ok} fine). Generated by \`node scripts/check-links.mjs\`.\n`;
  for (const [status, kind, title, note] of groups) {
    const rows = jobs.filter(j => j.status === status && j.kind === kind).sort((a, b) => a.name.localeCompare(b.name));
    md += `\n## ${title} (${rows.length})\n\n`;
    if (!rows.length) { md += 'None.\n'; continue; }
    md += `${note}\n\n| Brand | Where | Result | URL |\n|---|---|---|---|\n`;
    for (const r of rows) md += `| ${r.name} | ${[...r.pages].join(', ')} | ${r.detail} | ${r.url} |\n`;
  }
  const dir = path.join(ROOT, 'docs', 'reports');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'link-check.md'), md);
  writeFileSync(path.join(dir, 'link-check.json'), JSON.stringify(jobs.map(j => ({ ...j, pages: [...j.pages] })), null, 1));
  console.log(`ok ${ok} / ${jobs.length}. Report: docs/reports/link-check.md`);
}
run();
