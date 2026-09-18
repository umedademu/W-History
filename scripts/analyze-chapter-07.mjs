import fs from 'node:fs';
import path from 'node:path';
import {chapterNameCatalog, chapterNamesInText} from '../public/chapter-07-geography.js';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const readingPlan = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/reading-plan.json'), 'utf8'));
const {paragraphs} = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/source-selection.json'), 'utf8'));
const pMap = new Map(paragraphs.map(p => [p.id, p]));

const existingImages = new Set(fs.readdirSync(path.join(baseDir, 'public/images/ancient')));

const usedEntities = new Map(); // name -> count

for (const page of readingPlan) {
  const text = page.passages.map(pass => {
    const p = pMap.get(pass.paragraph);
    return p.text.slice(pass.start, pass.end);
  }).join('');
  const names = chapterNamesInText(page.title + '。' + text);
  for (const entry of names) {
    if (entry.kind === 'person' || entry.kind === 'building') {
      usedEntities.set(entry.name, (usedEntities.get(entry.name) || 0) + 1);
    }
  }
}

console.log('Total used unique persons & buildings in 253 pages:', usedEntities.size);
const sorted = [...usedEntities.entries()].sort((a, b) => b[1] - a[1]);
console.log('All used entities:');
for (const [name, count] of sorted) {
  console.log(`${name}: ${count}`);
}
