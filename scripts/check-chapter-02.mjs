import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {chapterEdition,chapterPlaces} from '../public/chapter-02-edition.js';
import {chapterSeries} from '../public/chapter-02-volumes.js';
import {chapterNamesInText} from '../public/chapter-02-geography.js';
import {sceneMapItems,normalizeMapName} from '../public/map-name-coverage.js';
import {maximumMapScale,minimumMapSpan} from '../public/map-camera.js';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const reference=JSON.parse(read('docs/chapter-02/source-selection.json'));
const plan=JSON.parse(read('docs/chapter-02/reading-plan.json'));
const generatedPlan=JSON.parse(read('docs/chapter-02/page-plan.json'));
const pages=Object.values(chapterEdition).flat();
const decode=s=>s.replace(/<[^>]*>/g,'').replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
assert.equal(chapterSeries.length,20);assert.equal(pages.length,136);assert.equal(reference.paragraphs.length,250);
assert.deepEqual(Object.keys(chapterEdition),chapterSeries.map(v=>v.id));
assert.deepEqual(generatedPlan.map(({id,...p})=>p),plan);
assert.deepEqual(pages.flatMap(s=>s.sourceText.passages).map(p=>p.paragraph),reference.paragraphs.map(p=>p.id));
assert.equal(new Set(pages.map(p=>p.id)).size,pages.length);
for(const file of reference.files){
 assert.equal(file.lines.length,file.lineCount);
 assert.ok(file.lines.every((r,i)=>r.line===i+1&&r.reason&&r.reason!=='未分類'));
 const captured=reference.paragraphs.filter(p=>p.file===file.file).flatMap(p=>p.source.map(s=>s.line));
 assert.deepEqual(captured,file.lines.filter(r=>r.kind==='本文').map(r=>r.line));
 if(!process.argv.includes('--published')){
  const raw=read(file.file);assert.equal(createHash('sha256').update(raw).digest('hex'),file.sha256,'原文資料の変更は禁止');
  assert.deepEqual(raw.split(/\r?\n/),file.lines.map(r=>r.markdown));
 }
}
for(const [index,p] of reference.paragraphs.entries()){
 assert.equal(p.markdown,p.source.map(s=>s.markdown.replace(/^### /,'')).join(''));
 assert.equal(p.text,p.markdown.replaceAll('**',''));
 const matches=pages.flatMap(s=>s.sourceText.passages.map((passage,i)=>({passage,plain:s.plainBody[i],body:s.body[i]}))).filter(r=>r.passage.paragraph===p.id);
 assert.equal(matches.length,1);const m=matches[0];assert.equal(m.passage.start,0);assert.equal(m.passage.end,p.text.length);
 assert.equal(m.plain,p.text);assert.equal(decode(m.body),p.text);
 const originalBold=[...p.markdown.matchAll(/\*\*(.*?)\*\*/g)].map(m=>m[1]).join('');
 const shownBold=[...m.body.matchAll(/<span class="source-bold">(.*?)<\/span>/g)].map(m=>decode(m[1])).join('');assert.equal(shownBold,originalBold,p.id+': 太字');
}
for(const [index,scene] of pages.entries()){
 assert.equal(scene.sourceText.chapter,2);assert.equal(scene.title,plan[index].title);assert.deepEqual(scene.sourceText.passages,plan[index].passages);
 assert.equal(scene.body.length,scene.plainBody.length);assert.ok(scene.plainBody.join('').length>=130,'導入だけのページを作らない');
 const text=scene.title+'。'+scene.plainBody.join('');const items=sceneMapItems(scene,chapterPlaces);const names=chapterNamesInText(text);
 for(const name of names)assert.ok(items.some(item=>normalizeMapName(item.text)===name.key),scene.id+': 地図に必要な名前 '+name.name);
 for(const item of items){assert.equal(item.at.length,2);assert.ok(item.at.every(Number.isFinite));assert.ok(Math.abs(item.at[0])<=180&&Math.abs(item.at[1])<=90);}
 assert.ok(scene.frame.every(Number.isFinite));
 for(const prop of scene.props)assert.ok(fs.existsSync(new URL('public/images/'+prop.image,root)));
 for(const route of scene.routes){assert.ok(route.points.length>=2);assert.ok(scene.duration>0);}
}
assert.deepEqual(minimumMapSpan,{longitude:32,latitude:24});assert.equal(maximumMapScale(([x,y])=>[(x+180)*4,(90-y)*4],1440,720),7.5);
assert.deepEqual(chapterNamesInText('テーベ').find(n=>n.name==='テーベ').points[0],[23.32,38.32]);
assert.ok(!chapterNamesInText('イスラームのスラヴ人').some(n=>n.name==='スラ'));
assert.ok(chapterNamesInText('クセルクセス1世').some(n=>n.name==='クセルクセス1世'));
const review=JSON.parse(read('docs/chapter-02/name-review.json'));
for(const name of review.required)assert.ok(chapterNamesInText(name).some(n=>n.key===normalizeMapName(name)),'確認済み固有名詞 '+name);
execFileSync(process.execPath,[fileURLToPath(new URL('scripts/build-chapter-02.mjs',root)),'--check'],{stdio:'pipe'});
console.log('第2章: 全'+pages.length+'ページの原文・太字・順序・地図・再生成を確認しました。');
