import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
let failures = 0;
for (const file of ['index.html', 'colours.html']) {
 const html = readFileSync(resolve(root, file), 'utf8');
 const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
 for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const value = match[1];
  if (value.startsWith('#')) {
   if (value !== '#' && !ids.has(value.slice(1))) { console.error(`${file}: missing anchor ${value}`); failures++; }
  } else if (!/^(?:https?:|mailto:|data:|\/|\?)/.test(value)) {
   const path = value.split(/[?#]/)[0];
   if (!existsSync(resolve(root, path))) { console.error(`${file}: missing asset ${path}`); failures++; }
  }
 }
}
for (const js of ['app.js','portrait.js','site-config.js','colour-comparison.js']) {
 if (!existsSync(resolve(root, js))) { console.error(`Missing script: ${js}`); failures++; }
}
if (failures) process.exit(1);
console.log('Site checks passed: local assets and internal links resolve.');
