import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {splitVolumes,series,selectVolume} from '../public/story-volumes.js';
import {scenes} from '../public/regional-dynasties-scenes.js';
import {pages} from '../public/ottoman-pages.js';
const read=p=>fs.readFile(new URL('../public/'+p,import.meta.url),'utf8');
const catalog=await read('index.html');
assert.equal(series.length,14);
assert.equal([...catalog.matchAll(/class="story-card"/g)].length,14);
assert.ok(!/catalog-chapters|chapter-card|\?chapter=/.test(catalog));
for(const [source,data,expected] of [['regional-dynasties',scenes,[7,9,13,8]],['ottoman',pages,[12,13,17]]]){
 const volumes=splitVolumes.filter(v=>v.source===source);
 assert.deepEqual(volumes.map(v=>v.pages.length),expected);
 assert.deepEqual(volumes.flatMap(v=>v.pages).sort((a,b)=>a-b),data.map((_,i)=>i));
 for(const v of volumes){
  assert.equal(selectVolume(source,data,'/'+v.id+'-story.html').scenes.length,v.pages.length);
  assert.ok(v.pages.length<=20);
 }
}
for(const s of series){
 const html=await read(s.id+'-story.html');
 assert.ok(catalog.includes(`href="/${s.id}-story.html"`));
 const nav=html.match(/<nav class="story-series-links"[^>]*>([\s\S]*?)<\/nav>/)[1];
 assert.equal([...nav.matchAll(/<a /g)].length,14);
 assert.equal([...nav.matchAll(/aria-current="page"/g)].length,1);
 assert.ok(nav.includes(`href="/${s.id}-story.html" aria-current="page">${s.number} `));
 for(const other of series)assert.ok(nav.includes(`>${other.number} ${other.label}</a>`));
 assert.ok(!/reading-chapter|chapter-end|story-chapters\.js|\?chapter=/.test(html));
}
console.log('14教材の独立した入口・通し番号・全教材への移動と、分割対象79ページの欠落・重複なしを確認しました。');
