import fs from 'node:fs';
import path from 'node:path';
import { chapterEdition, chapterPlaces } from '../public/chapter-07-edition.js';
import { chapterNameCatalog } from '../public/chapter-07-geography.js';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const readingPlan = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/reading-plan.json'), 'utf8'));
const { paragraphs } = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/source-selection.json'), 'utf8'));
const pMap = new Map(paragraphs.map(p => [p.id, p]));

let totalPages = 0;
let svgOnMap = [];
let actorsWithoutImage = [];
let missingPlacesOnMap = [];
let unmappedEntitiesCount = 0;

for (let i = 0; i < readingPlan.length; i++) {
  const page = readingPlan[i];
  const volId = page.volume;
  const scenes = chapterEdition[volId];
  if (!scenes) continue;
  totalPages++;
  
  // Find scene for this page
  const scene = scenes.find(s => s.title === page.title) || scenes[0];
  if (!scene) continue;
  
  // Check actors and props on map
  const allItems = [...(scene.actors || []), ...(scene.props || [])];
  for (const item of allItems) {
    if (!item.image) {
      actorsWithoutImage.push({ page: i + 1, title: page.title, name: item.name });
    } else if (item.image.endsWith('.svg')) {
      svgOnMap.push({ page: i + 1, title: page.title, name: item.name, img: item.image });
    }
  }
  
  // Check place pins
  for (const pin of (scene.pins || [])) {
    if (!chapterPlaces[pin]) {
      missingPlacesOnMap.push({ page: i + 1, title: page.title, pin });
    }
  }
}

console.log(`Checked ${totalPages} pages in Chapter 7.`);
console.log(`SVG icons appearing on map: ${svgOnMap.length}`);
if (svgOnMap.length > 0) {
  console.log('SVG items:', svgOnMap);
}
console.log(`Actors without image: ${actorsWithoutImage.length}`);
if (actorsWithoutImage.length > 0) {
  console.log('No image items:', actorsWithoutImage);
}
console.log(`Missing place pins: ${missingPlacesOnMap.length}`);
