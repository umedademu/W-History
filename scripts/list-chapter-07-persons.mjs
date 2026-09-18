import fs from 'node:fs';
import path from 'node:path';
import {chapterNameCatalog, chapterNamesInText} from '../public/chapter-07-geography.js';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const readingPlan = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/reading-plan.json'), 'utf8'));
const {paragraphs} = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/source-selection.json'), 'utf8'));
const pMap = new Map(paragraphs.map(p => [p.id, p]));

const usedEntities = new Map();

for (const page of readingPlan) {
  const text = page.passages.map(pass => {
    const p = pMap.get(pass.paragraph);
    return p.text.slice(pass.start, pass.end);
  }).join('');
  const names = chapterNamesInText(page.title + '。' + text);
  for (const entry of names) {
    if (entry.kind === 'person') {
      usedEntities.set(entry.name, (usedEntities.get(entry.name) || 0) + 1);
    }
  }
}

console.log('Total unique person names in chapter 07 text:', usedEntities.size);

// Check aliases (e.g., ナポレオン vs ナポレオン1世 vs ナポレオン＝ボナパルト)
// Let's print all person names alphabetically
const names = [...usedEntities.keys()].sort();
console.log(JSON.stringify(names, null, 2));
