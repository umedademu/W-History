import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const entities = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07-used-entities.json'), 'utf8'));
const existingImages = new Set(fs.readdirSync(path.join(baseDir, 'public/images/ancient')));

const persons = Object.entries(entities)
  .filter(([name, data]) => data.kind === 'person')
  .map(([name, data]) => ({name, count: data.count}));

console.log('Total persons used in chapter 07:', persons.length);

// Let's identify the exact mapping of each person to an image filename
// Some names share the same person (aliases):
// e.g. ナポレオン, ナポレオン1世, ナポレオン＝ボナパルト -> napoleon-bonaparte.png
// ルター, マルティン＝ルター -> martin-luther.png
// レオナルド＝ダ＝ヴィンチ, ダ＝ヴィンチ -> leonardo-da-vinci.png
// etc.

fs.writeFileSync(
  path.join(baseDir, 'docs/chapter-07-persons-list.json'),
  JSON.stringify(persons, null, 2)
);
console.log('Saved persons list to docs/chapter-07-persons-list.json');
