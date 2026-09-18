import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const existingImages = fs.readdirSync(path.join(baseDir, 'public/images/ancient'));
fs.writeFileSync(
  path.join(baseDir, 'docs/existing-images-all.json'),
  JSON.stringify(existingImages.sort(), null, 2)
);
console.log('Saved all existing images list, total:', existingImages.length);
