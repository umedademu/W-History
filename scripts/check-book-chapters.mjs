import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {bookChapters,addedChapterNumbers} from '../public/book-chapters.js';
import {allEditions} from '../public/all-editions.js';
import {sceneMapItems,mapNamePlan,normalizeMapName,namesForScene} from '../public/map-name-coverage.js';
const root=new URL('../',import.meta.url),read=p=>fs.readFile(new URL(p,root),'utf8');
const outline=JSON.parse(await read('docs/catalog/book-outline.json'));
assert.deepEqual(bookChapters.map(c=>c.number),[1,2,3,4,5,6,7]);
assert.deepEqual(bookChapters.map(c=>c.volumes.length),[12,20,16,18,18,9,35]);
assert.deepEqual(bookChapters.flatMap(c=>c.lessons.map(l=>l.lesson)),Array.from({length:30},(_,i)=>i+1));
for(const c of bookChapters) {
  const expected=outline.find(o=>o.chapter===c.number);
  assert.equal(c.title,expected.title);
  assert.deepEqual(c.lessons,expected.lessons.map(({lesson,title})=>({lesson,title})));
  assert.deepEqual(c.volumes.map(({label,lesson,part})=>({label,lesson,part})),expected.lessons.flatMap(l=>l.parts.map(p=>({label:p.label,lesson:l.lesson,part:p.part}))));
}
if(!process.argv.includes('--published')) {
  const toc=await read('sources/sekai_shi_tankyu_mokuji.md');
  assert.deepEqual([...toc.matchAll(/^\* \d+ (.*?) ……/gm)].map(m=>m[1]),outline.flatMap(c=>c.lessons.flatMap(l=>l.parts.map(p=>p.label))));
}
const coordinate=p=>assert.ok(Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90);
let total=0;
for(const chapter of addedChapterNumbers) {
  await import(`./check-chapter-0${chapter}.mjs`);
  const {chapterEdition,chapterPlaces}=await import(`../public/chapter-0${chapter}-edition.js`);
  const volumes=bookChapters.find(c=>c.number===chapter).volumes;
  assert.deepEqual(Object.keys(chapterEdition),volumes.map(v=>v.id));
  for(const v of volumes) {
    assert.equal(v.chapter,chapter);
    assert.equal(v.id,`c0${chapter}-l${String(v.lesson).padStart(2,'0')}-p${String(v.part).padStart(2,'0')}`);
    assert.deepEqual(v.sections,[v.id]);
    for(const [i,s] of chapterEdition[v.id].entries()) {
      total++;
      assert.equal(s.sourceText.chapter,chapter);
      assert.equal(s.id,`${v.id}-${String(i+1).padStart(3,'0')}`);
      assert.ok(s.body.length>0&&s.body.join('').trim());
      assert.ok(s.sourceText.passages.length>0);
      assert.ok(s.year&&s.title&&s.frame.length===4&&s.frame.every(Number.isFinite)&&s.frame[0]<s.frame[2]&&s.frame[1]<s.frame[3]);
      const text=s.title+'。'+s.plainBody.join(''),items=sceneMapItems(s,chapterPlaces);
      const shown=items.map(i=>normalizeMapName(i.text));
      for(const n of namesForScene(s,text))if(n.kind!=='concept') {
        assert.ok(shown.some(t=>t.includes(n.key)),`${s.id}: ${n.name}の表示不足`);
        const matching=items.filter(item=>normalizeMapName(item.text)===n.key);
        assert.ok(matching.some(item=>n.points.some(p=>p[0]===item.at[0]&&p[1]===item.at[1])),`${s.id}: ${n.name}の文脈と座標が不一致`);
      }
      for(const item of items){coordinate(item.at);assert.ok(normalizeMapName(text).includes(normalizeMapName(item.text)),`${s.id}: 本文にない地図名 ${item.text}`);}
      assert.deepEqual(mapNamePlan(s,items).tags,[],`${s.id}: 地図の名称を生成段階で保持`);
      for(const r of [...s.routes,...(s.rivers??[])]){assert.ok(r.points.length>=2);r.points.forEach(coordinate);}
      for(const p of s.props)await fs.access(new URL('public/images/'+p.image,root));
    }
  }
}
assert.equal(total,Object.values(allEditions).flat().length-258);
execFileSync(process.execPath,[fileURLToPath(new URL('./build-book-library.mjs',import.meta.url)),'--check'],{cwd:fileURLToPath(root),stdio:'pipe',windowsHide:true});
console.log(`追加5章107パート${total}ページの原文・目次・地図対応・生成一致を確認しました。`);
