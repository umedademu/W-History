import {sourceEdition} from "../public/source-edition.js";
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {splitVolumes,series,selectVolume} from '../public/story-volumes.js';
const scenes=['regional-dynasties','seljuq','western-dynasties','african-kingdoms'].flatMap(id=>sourceEdition[id]);
const pages=['ottoman','ottoman-expansion','ottoman-height'].flatMap(id=>sourceEdition[id]);
const read=p=>fs.readFile(new URL('../public/'+p,import.meta.url),'utf8');
const catalog=await read('index.html');
assert.equal(series.length,13);
assert.deepEqual(series.map(s=>s.number),Array.from({length:13},(_,i)=>String(i+1).padStart(2,'0')));
const timurPages=[...sourceEdition.timur,...sourceEdition['timur-after']];
assert.equal(timurPages.length,9);
assert.equal(new Set(timurPages.map(s=>s.id)).size,9);
assert.ok(!catalog.includes('href="/timur-after-story.html"'));
assert.match(catalog, /14〜19世紀 <span>9ページ/);
assert.match(await read('timur-after-story.html'), /url=\/timur-story\.html#page-6/);
assert.equal([...catalog.matchAll(/class="story-card"/g)].length,13);
assert.ok(!/catalog-chapters|chapter-card|\?chapter=/.test(catalog));
for(const [source,data,expected] of [['regional-dynasties',scenes,[7,9,13,6]],['ottoman',pages,[9,8,10]]]){
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
 assert.equal([...nav.matchAll(/<a /g)].length,13);
 assert.equal([...nav.matchAll(/aria-current="page"/g)].length,1);
 assert.ok(nav.includes(`href="/${s.id}-story.html" aria-current="page">${s.number} `));
 for(const other of series)assert.ok(nav.includes(`>${other.number} ${other.label}</a>`));
 assert.ok(!/reading-chapter|chapter-end|story-chapters\.js|\?chapter=/.test(html));
}
console.log('13教材の独立した入口・通し番号・全教材への移動と、分割対象62ページの欠落・重複なしを確認しました。');
