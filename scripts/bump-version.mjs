import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');

// 1. package.json
let p = path.join(baseDir, 'package.json');
let c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('"version": "0.077"', '"version": "0.078"'));

// 2. package-lock.json
let pLock = path.join(baseDir, 'package-lock.json');
let cLock = fs.readFileSync(pLock, 'utf8');
fs.writeFileSync(pLock, cLock.replaceAll('"version": "0.077"', '"version": "0.078"'));

// 3. README.md
p = path.join(baseDir, 'README.md');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('**v0.077**', '**v0.078**'));

// 4. docs/specification.md
p = path.join(baseDir, 'docs/specification.md');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('現在の版は v0.077（2026年9月19日）。', '現在の版は v0.078（2026年9月19日）。'));

// 5. docs/catalog/summary.json
p = path.join(baseDir, 'docs/catalog/summary.json');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('"version": "0.077"', '"version": "0.078"'));

// 6. scripts/check.mjs
p = path.join(baseDir, 'scripts/check.mjs');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replaceAll('/theme.js?v=0.077', '/theme.js?v=0.078').replaceAll('/theme.css?v=0.077', '/theme.css?v=0.078'));

// 7. public/*.html
const publicDir = path.join(baseDir, 'public');
let updatedCount = 0;
for (const file of fs.readdirSync(publicDir)) {
  if (file.endsWith('.html')) {
    const fp = path.join(publicDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    let updated = html.replaceAll('?v=0.077', '?v=0.078').replaceAll('v0.077', 'v0.078');
    if (updated !== html) {
      fs.writeFileSync(fp, updated);
      updatedCount++;
    }
  }
}
console.log(`Version bump done: 0.077 -> 0.078. Updated ${updatedCount} HTML files.`);
