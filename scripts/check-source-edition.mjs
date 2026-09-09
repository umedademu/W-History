import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {sourceEdition} from '../public/source-edition.js';
import {plainText} from '../public/map-name-coverage.js';

const read=async path=>JSON.parse(await fs.readFile(new URL('../'+path,import.meta.url),'utf8'));
const paragraphs=await read('docs/source-edition/paragraphs.json');
const plans=await read('docs/source-edition/page-plan.json');
const audits=[];
for(const file of await fs.readdir(new URL('../docs/source-edition/',import.meta.url)))if(/^decoration-\d+\.json$/.test(file))audits.push(await read('docs/source-edition/'+file));
const annotations=audits.flatMap(a=>a.paragraphs);
const decode=s=>plainText(s).replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
assert.equal(Object.keys(sourceEdition).length,14);
assert.equal(Object.values(sourceEdition).flat().length,155);
assert.equal(new Set(Object.values(sourceEdition).flat().map(s=>s.id)).size,155);
for(const p of paragraphs){
  const pages=sourceEdition[p.volume].filter(s=>s.sourceText.paragraph===p.id);
  let offset=0;
  for(const scene of pages){
    assert.equal(scene.sourceText.start,offset,`${p.id}: 本文の欠落または重複`);
    assert.equal(decode(scene.body.join('')),p.text.slice(scene.sourceText.start,scene.sourceText.end),`${scene.id}: 表示本文が原文と一致しません`);
    assert.equal(scene.plainBody.join(''),decode(scene.body.join('')));
    offset=scene.sourceText.end;
  }
  assert.equal(offset,p.text.length);
  const refs=annotations.filter(a=>a.id===p.id);
  assert.equal(refs.length,1,`${p.id}: 原画像の装飾確認が不足または重複`);
  assert.equal(refs[0].uncertain?.length??0,0,`${p.id}: 未確認の装飾があります`);
  assert.ok(audits.some(a=>a.images.includes(p.image)),`${p.image}: 原画像の確認漏れ`);
  for(const span of refs[0].spans){
    assert.ok(['bold','red-bold','underline','italic'].includes(span.style));
    assert.ok(pages.some(s=>s.body.join('').includes('source-'+span.style)),`${p.id}: 装飾が表示されません`);
  }
  // 原文資料は公開管理の対象外。手元にある場合は直接比較する。
  try {
    const source=await fs.readFile(new URL('../sources/'+p.file,import.meta.url),'utf8');
    assert.equal(source.split(/\r?\n/)[p.line-1].trim(),p.sourceTranscription??p.text,`${p.id}: 原文資料の本文と不一致`);
    if(p.sourceTranscription){
      const review=await read('docs/source-edition/cross-page-review.json');
      assert.equal(review.paragraphs.find(x=>x.id===p.id)?.transcription,p.text);
    }
  } catch(error) { if(error.code!=='ENOENT')throw error; }
}
for(const [id,scenes] of Object.entries(sourceEdition)){
  assert.deepEqual(scenes.map(s=>s.id),plans.filter(p=>p.volume===id).map(p=>p.id));
  for(const s of scenes){
    assert.ok(s.body.length&&s.title&&s.sourceText);
    if(s.animation){assert.equal(s.animation.length,s.body.length);assert.equal(s.animation.map(a=>a.text).join(''),s.plainBody.join(''));}
  }
}
const css=await fs.readFile(new URL('../public/source-decoration.css',import.meta.url),'utf8');
assert.ok(css.includes('.source-bold')&&css.includes('.source-red-bold')&&css.includes('html[data-theme="dark"]'));
console.log(`14教材155ページの原文本文${paragraphs.length}段落、画像ごとの装飾位置と読み仮名、掲載順・欠落・重複を確認しました。`);
