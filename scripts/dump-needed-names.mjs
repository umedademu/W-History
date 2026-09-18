import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const plan = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07-creation-plan.json'), 'utf8'));

console.log('List of all 257 needed persons:');
const list = plan.needCreation.map(x => x.cname);

// Let's create an automated JSON definition for all 257 persons + battles actors
// with suitable English filenames and visual characteristics
fs.writeFileSync(
  path.join(baseDir, 'docs/chapter-07-needed-names.json'),
  JSON.stringify(list, null, 2)
);
console.log('Saved 257 names to docs/chapter-07-needed-names.json');
