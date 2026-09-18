import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');

// Read current version from package.json
const pkgPath = path.join(baseDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const currentVersionStr = pkg.version;
const currentNum = parseFloat(currentVersionStr);
const nextNum = (Math.round((currentNum + 0.001) * 1000) / 1000);
const nextVersionStr = nextNum.toFixed(3);

console.log(`Bumping version: ${currentVersionStr} -> ${nextVersionStr}`);

// 1. package.json
pkg.version = nextVersionStr;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// 2. package-lock.json
const pLock = path.join(baseDir, 'package-lock.json');
let cLock = fs.readFileSync(pLock, 'utf8');
cLock = cLock.replaceAll(`"version": "${currentVersionStr}"`, `"version": "${nextVersionStr}"`);
fs.writeFileSync(pLock, cLock);

// 3. README.md
const pReadme = path.join(baseDir, 'README.md');
let cReadme = fs.readFileSync(pReadme, 'utf8');
cReadme = cReadme.replaceAll(`**v${currentVersionStr}**`, `**v${nextVersionStr}**`);
fs.writeFileSync(pReadme, cReadme);

// 4. docs/specification.md
const pSpec = path.join(baseDir, 'docs/specification.md');
let cSpec = fs.readFileSync(pSpec, 'utf8');
cSpec = cSpec.replaceAll(`v${currentVersionStr}`, `v${nextVersionStr}`);
fs.writeFileSync(pSpec, cSpec);

// 5. docs/catalog/summary.json
const pSum = path.join(baseDir, 'docs/catalog/summary.json');
let cSum = fs.readFileSync(pSum, 'utf8');
cSum = cSum.replaceAll(`"version": "${currentVersionStr}"`, `"version": "${nextVersionStr}"`);
fs.writeFileSync(pSum, cSum);

// 6. scripts/check.mjs
const pCheck = path.join(baseDir, 'scripts/check.mjs');
let cCheck = fs.readFileSync(pCheck, 'utf8');
cCheck = cCheck.replaceAll(`v=${currentVersionStr}`, `v=${nextVersionStr}`);
fs.writeFileSync(pCheck, cCheck);

// 7. public/chapter-story.js
const pChStory = path.join(baseDir, 'public/chapter-story.js');
let cChStory = fs.readFileSync(pChStory, 'utf8');
cChStory = cChStory.replace(/edition\.js\?v=[0-9.]+/g, `edition.js?v=${nextVersionStr}`)
                   .replace(/story-volumes\.js\?v=[0-9.]+/g, `story-volumes.js?v=${nextVersionStr}`)
                   .replace(/history-story\.js\?v=[0-9.]+/g, `history-story.js?v=${nextVersionStr}`);
fs.writeFileSync(pChStory, cChStory);

// 8. Update all HTML files in public/
const pubDir = path.join(baseDir, 'public');
let htmlCount = 0;
for (const f of fs.readdirSync(pubDir)) {
  if (f.endsWith('.html')) {
    const hp = path.join(pubDir, f);
    let hc = fs.readFileSync(hp, 'utf8');
    const orig = hc;
    hc = hc.replaceAll(`v=${currentVersionStr}`, `v=${nextVersionStr}`);
    if (hc !== orig) {
      fs.writeFileSync(hp, hc);
      htmlCount++;
    }
  }
}

console.log(`Version bump done: ${currentVersionStr} -> ${nextVersionStr}. Updated ${htmlCount} HTML files and JS entrypoints.`);
