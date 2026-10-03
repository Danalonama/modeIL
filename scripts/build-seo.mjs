#!/usr/bin/env node
// Regenerates the brand-list JSON-LD in index.html from the DESIGNERS array,
// so the structured data can't drift from the cards.
//   node scripts/build-seo.mjs          → rewrite the block
//   node scripts/build-seo.mjs --check  → exit 1 if the block is out of date
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT, readSite, loadDesigners } from './lib/brands.mjs';

const SITE = 'https://mode-il.com/';
const OPEN = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList"';
const CLOSE = '</script>';

const designers = loadDesigners();
const list = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Israeli Fashion Designers — ModeIL',
  description: 'A curated directory of independent Israeli fashion designers.',
  numberOfItems: designers.length,
  itemListElement: designers.map((d, i) => {
    const item = { '@type': 'Brand', name: d.name, url: d.url, description: d.desc };
    if (d.img) item.image = /^https?:\/\//i.test(d.img) ? d.img : SITE + d.img.replace(/^\//, '');
    return { '@type': 'ListItem', position: i + 1, item };
  }),
};
// "<" is escaped so a description can never close the script tag early.
const block = '<script type="application/ld+json">' + JSON.stringify(list).replace(/</g, '\\u003c') + CLOSE;

const html = readSite('index.html');
const start = html.indexOf(OPEN);
if (start === -1) throw new Error('ItemList JSON-LD block not found in index.html');
const end = html.indexOf(CLOSE, start) + CLOSE.length;
const current = html.slice(start, end);

if (current === block) {
  console.log(`JSON-LD already up to date (${designers.length} brands).`);
} else if (process.argv.includes('--check')) {
  console.error('JSON-LD is out of date. Run: node scripts/build-seo.mjs');
  process.exit(1);
} else {
  writeFileSync(path.join(ROOT, 'index.html'), html.slice(0, start) + block + html.slice(end));
  console.log(`JSON-LD rewritten: ${designers.length} brands.`);
}
