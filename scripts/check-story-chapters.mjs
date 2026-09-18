import {allEditions as sourceEdition} from '../public/all-editions.js';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {splitVolumes,series,selectVolume,volumeScenes,initialPageIndex} from '../public/story-volumes.js';
import {ancientSeries} from '../public/ancient-volumes.js';
const read=p=>fs.readFile(new URL('../public/'+p,import.meta.url),'utf8');
const catalog=await read('index.html');
const islamicTitles=['イスラーム教の成立〜正統カリフ時代','ウマイヤ朝とアッバース朝','3カリフの並立とイスラーム世界の変容','地方政権の興亡','ティムール朝','サファヴィー朝','オスマン帝国','ムガル帝国','イスラーム文化'];
const outline=JSON.parse(await fs.readFile(new URL('../docs/catalog/book-outline.json',import.meta.url),'utf8'));
const expected=outline.flatMap(c=>c.lessons.flatMap(l=>l.parts.map(p=>({chapter:c.chapter,lesson:l.lesson,part:p.part,label:p.label}))));
assert.equal(series.length,128);
assert.deepEqual(series.map(({chapter,lesson,part,label})=>({chapter,lesson,part,label})),expected);
for(const c of outline)assert.deepEqual(series.filter(v=>v.chapter===c.chapter).map(v=>v.number),Array.from({length:c.lessons.flatMap(l=>l.parts).length},(_,i)=>String(i+1).padStart(2,'0')));
assert.deepEqual(series.filter(v=>v.chapter===1||v.chapter===6).map(s=>volumeScenes(sourceEdition,s.id).length),[2,9,10,1,8,6,7,11,5,13,27,4,22,19,16,19,9,9,27,20,14]);
// 全7章の本文が、同じ順番で一度ずつ掲載される。
assert.deepEqual(series.flatMap(s=>volumeScenes(sourceEdition,s.id)),Object.values(sourceEdition).flat());
if(!process.argv.includes('--published')){
 const toc=await fs.readFile(new URL('../sources/sekai_shi_tankyu_mokuji.md',import.meta.url),'utf8');
 const chapter=toc.split('## 第6章 ')[1].split('## 第7章 ')[0];
 assert.deepEqual([...chapter.matchAll(/^\* \d+ (.*?) ……/gm)].map(m=>m[1]),islamicTitles);
 const ancient=toc.split('## 第1章 ')[1].split('## 第2章 ')[0];
 assert.deepEqual([...ancient.matchAll(/^\* \d+ (.*?) ……/gm)].map(m=>m[1]),ancientSeries.map(v=>v.label));
}
assert.equal([...catalog.matchAll(/class="part-link"/g)].length,128);
for(const [lesson,count] of outline.flatMap(c=>c.lessons.map(l=>[l.lesson,l.parts.length]))){
 const group=catalog.match(new RegExp('<section class="lesson-group" aria-labelledby="lesson-'+lesson+'">([\\s\\S]*?)</section>'));
 assert.ok(group);
 assert.equal([...group[1].matchAll(/class="part-link"/g)].length,count);
}
for(const [source,sections] of [['regional-dynasties',['regional-dynasties','seljuq','western-dynasties','african-kingdoms']],['ottoman',['ottoman','ottoman-expansion','ottoman-height']]]){
 const data=sections.flatMap(id=>sourceEdition[id]);
 const volumes=splitVolumes.filter(v=>v.source===source);
 assert.deepEqual(volumes.flatMap(v=>v.pages),data.map((_,i)=>i));
 for(const v of volumes)assert.deepEqual(selectVolume(source,data,'/'+v.id+'-story.html').scenes,volumeScenes(sourceEdition,v.id));
}
for(const s of series){
 const html=await read(s.id+'-story.html');
 assert.ok(catalog.includes('href="/'+s.id+'-story.html"'));
 assert.ok(html.includes('<title>'+s.label+'｜第'+s.lesson+'回 '+s.part+'｜'));
 const nav=html.match(/<nav class="story-series-links"[^>]*>([\s\S]*?)<\/nav>/)[1];
 const siblings=series.filter(v=>(v.chapter??6)===(s.chapter??6));
 assert.equal([...nav.matchAll(/<a /g)].length,siblings.length);
 assert.equal([...nav.matchAll(/aria-current="page"/g)].length,1);
 assert.ok(nav.includes('href="/'+s.id+'-story.html" aria-current="page">'+s.number+' '));
 for(const other of siblings)assert.ok(nav.includes('>'+other.number+' '+other.label+'</a>'));
}
for(const [from,to,page] of [['seljuq','regional-dynasties',8],['african-kingdoms','western-dynasties',14],['ottoman-expansion','ottoman',10],['ottoman-height','ottoman',18],['timur-after','timur',6]]){
 assert.ok(!catalog.includes('href="/'+from+'-story.html"'));
 assert.ok((await read(from+'-story.html')).includes('url=/'+to+'-story.html#page-'+page));
 assert.equal(volumeScenes(sourceEdition,to)[page-1],sourceEdition[from][0]);
}
for(const [hash,index] of [['',0],['#page-8',7],['#page-16',15],['#page-0',0],['#page-17',0],['#page-foo',0],['#page-1.5',0]])assert.equal(initialPageIndex(16,hash),index);
console.log('目次と同じ全7章30回128パートの順序・欠落・重複なし、旧入口の転送先を確認しました。');
