import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');

// 1. package.json
let p = path.join(baseDir, 'package.json');
let c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('"version": "0.078"', '"version": "0.079"'));

// 2. package-lock.json
let pLock = path.join(baseDir, 'package-lock.json');
let cLock = fs.readFileSync(pLock, 'utf8');
fs.writeFileSync(pLock, cLock.replaceAll('"version": "0.078"', '"version": "0.079"'));

// 3. README.md
p = path.join(baseDir, 'README.md');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('**v0.078**', '**v0.079**'));

// 4. docs/specification.md
p = path.join(baseDir, 'docs/specification.md');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('現在の版は v0.078（2026年9月19日）。', '現在の版は v0.079（2026年9月19日）。'));

// 5. docs/catalog/summary.json
p = path.join(baseDir, 'docs/catalog/summary.json');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replace('"version": "0.078"', '"version": "0.079"'));

// 6. scripts/check.mjs
p = path.join(baseDir, 'scripts/check.mjs');
c = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, c.replaceAll('/theme.js?v=0.078', '/theme.js?v=0.079').replaceAll('/theme.css?v=0.078', '/theme.css?v=0.079'));

// 7. public/chapter-story.js
p = path.join(baseDir, 'public/chapter-story.js');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/edition\.js\?v=[0-9.]+/g, 'edition.js?v=0.079')
     .replace(/story-volumes\.js\?v=[0-9.]+/g, 'story-volumes.js?v=0.079')
     .replace(/history-story\.js\?v=[0-9.]+/g, 'history-story.js?v=0.079');
fs.writeFileSync(p, c);

// 8. public/ancient-story.js
p = path.join(baseDir, 'public/ancient-story.js');
c = fs.readFileSync(p, 'utf8');
c = c.replace(/ancient-edition\.js\?v=[0-9.]+/g, 'ancient-edition.js?v=0.079')
     .replace(/ancient-volumes\.js\?v=[0-9.]+/g, 'ancient-volumes.js?v=0.079')
     .replace(/history-story\.js\?v=[0-9.]+/g, 'history-story.js?v=0.079')
     .replace(/story-volumes\.js\?v=[0-9.]+/g, 'story-volumes.js?v=0.079');
fs.writeFileSync(p, c);

// 9. public/*.html
const publicDir = path.join(baseDir, 'public');
let updatedCount = 0;
for (const file of fs.readdirSync(publicDir)) {
  if (file.endsWith('.html')) {
    const fp = path.join(publicDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    let updated = html.replaceAll('?v=0.078', '?v=0.079').replaceAll('v0.078', 'v0.079');
    if (updated !== html) {
      fs.writeFileSync(fp, updated);
      updatedCount++;
    }
  }
}
console.log(`Version bump done: 0.078 -> 0.079. Updated ${updatedCount} HTML files and JS entrypoints.`);
