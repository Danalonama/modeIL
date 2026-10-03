// Reads the inline data out of the HTML files so scripts can work on it
// without a second copy. index.html stays the source of truth.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function readSite(file) {
  return readFileSync(path.join(ROOT, file), 'utf8');
}

// Pull `const NAME = <literal>;` out of a page and evaluate just that literal.
function extractConst(html, name, open) {
  const start = html.indexOf(`const ${name} = ${open}`);
  if (start === -1) throw new Error(`const ${name} not found`);
  const close = open === '[' ? '];' : open === '{' ? '};' : ');';
  const end = html.indexOf(`\n${close}`, start);
  const inlineEnd = html.indexOf(`${close}\n`, start);
  const stop = end !== -1 && (inlineEnd === -1 || end < inlineEnd) ? end + 1 : inlineEnd;
  if (stop === -1) throw new Error(`end of ${name} not found`);
  const src = html.slice(start, stop + close.length);
  return vm.runInNewContext(`${src}\n${name};`);
}

export function loadDesigners() {
  return extractConst(readSite('index.html'), 'DESIGNERS', '[');
}
export function loadDescHe() {
  return extractConst(readSite('index.html'), 'DESC_HE', '{');
}
export function loadMapBrands() {
  return [...extractConst(readSite('index.html'), 'MAP_BRANDS', 'new Set(')];
}
export function loadStoreAddresses() {
  return extractConst(readSite('index.html'), 'STORE_ADDRESSES', '{');
}
export function loadMapPins() {
  return extractConst(readSite('Map.html'), 'DESIGNERS', '[');
}
export function loadBoutiques() {
  return extractConst(readSite('Boutiques.html'), 'STORES', '[');
}
