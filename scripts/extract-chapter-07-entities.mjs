import fs from 'node:fs';
import path from 'node:path';
import {chapterNameCatalog, chapterNamesInText} from '../public/chapter-07-geography.js';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const readingPlan = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/reading-plan.json'), 'utf8'));
const {paragraphs} = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/source-selection.json'), 'utf8'));
const pMap = new Map(paragraphs.map(p => [p.id, p]));
const existingImages = new Set(fs.readdirSync(path.join(baseDir, 'public/images/ancient')));

const entities = new Map();

for (const page of readingPlan) {
  const text = page.passages.map(pass => {
    const p = pMap.get(pass.paragraph);
    return p.text.slice(pass.start, pass.end);
  }).join('');
  const names = chapterNamesInText(page.title + '。' + text);
  for (const entry of names) {
    if (entry.kind === 'person' || entry.kind === 'building') {
      if (!entities.has(entry.name)) {
        entities.set(entry.name, {
          kind: entry.kind,
          points: entry.points[0],
          count: 0
        });
      }
      entities.get(entry.name).count++;
    }
  }
}

console.log(`Unique entities used in chapter 07: ${entities.size}`);

// Write JSON for review
fs.writeFileSync(
  path.join(baseDir, 'docs/chapter-07-used-entities.json'),
  JSON.stringify(Object.fromEntries(entities), null, 2)
);
console.log('Saved to docs/chapter-07-used-entities.json');
