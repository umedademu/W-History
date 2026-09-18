import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const existingImages = fs.readdirSync(path.join(baseDir, 'public/images/ancient'));

console.log('Existing images total:', existingImages.length);

// Check matches for some key figures
const testList = [
  'napoleon', 'luther', 'calvin', 'louis14', 'louis16', 'philip2', 'charles5',
  'elizabeth1', 'henry8', 'richelieu', 'locke', 'frederick2', 'maria-theresa',
  'cromwell', 'catherine2', 'columbus', 'peter-great', 'washington', 'copernicus',
  'galileo', 'newton', 'descartes', 'kant', 'voltaire', 'montesquieu', 'rousseau'
];

for (const t of testList) {
  const matches = existingImages.filter(img => img.toLowerCase().includes(t));
  console.log(`${t}:`, matches);
}
