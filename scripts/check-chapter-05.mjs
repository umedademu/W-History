import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {chapterSeries,chapterLessons} from '../public/chapter-05-volumes.js';
import {chapterEdition,chapterPlaces} from '../public/chapter-05-edition.js';
import {chapterNamesInText} from '../public/chapter-05-geography.js';
import {sceneMapItems} from '../public/map-name-coverage.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const {files,paragraphs}=JSON.parse(read('docs/chapter-05/source-selection.json'));
const reading=JSON.parse(read('docs/chapter-05/reading-plan.json'));
const reviewed=JSON.parse(read('docs/chapter-05/bold-name-review.json'));
const published=process.argv.includes('--published');
const decode=s=>s.replace(/<[^>]*>/g,'').replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
assert.equal(chapterSeries.length,18);
assert.deepEqual(chapterLessons.map(l=>l.lesson),[16,17,18,19]);
assert.equal(reading.length,118);
assert.equal(paragraphs.length,177);
assert.deepEqual(Object.keys(chapterEdition),chapterSeries.map(v=>v.id));
assert.equal(new Set(paragraphs.map(p=>p.id)).size,paragraphs.length);
const sourceLines=new Set();
for(const f of files){
 assert.equal(f.classifications.length,f.lineCount);assert.deepEqual(f.classifications.map(x=>x.line),Array.from({length:f.lineCount},(_,i)=>i+1));
 const included=f.classifications.filter(x=>x.status==='掲載').map(x=>x.line);
 const captured=paragraphs.filter(p=>p.file===f.file).flatMap(p=>p.source.map(x=>x.line));
 assert.deepEqual(captured,included,'原文の全行分類と本文抽出の一致');
 assert.ok(f.classifications.every(x=>x.reason&&['掲載','省略'].includes(x.status)));
 if(!published){const raw=read(f.file),lines=raw.split(/\r?\n/);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),f.sha256,'原文非改変');for(const p of paragraphs.filter(p=>p.file===f.file))for(const s of p.source)assert.equal(s.markdown,lines[s.line-1]);}
 for(const n of captured){assert.ok(!sourceLines.has(f.file+':'+n));sourceLines.add(f.file+':'+n);}
}
let paragraphIndex=0,offset=0,pageIndex=0;
for(const v of chapterSeries){assert.equal(v.chapter,5);assert.match(v.id,/^c05-l\d{2}-p\d{2}$/);assert.deepEqual(v.sections,[v.id]);
 for(const [i,s] of chapterEdition[v.id].entries()){
  const p=reading[pageIndex++];assert.equal(p.volume,v.id);assert.equal(s.title,p.title);assert.equal(s.id,v.id+'-'+String(i+1).padStart(3,'0'));assert.equal(s.sourceText.chapter,5);assert.deepEqual(s.sourceText.passages,p.passages);assert.equal(s.body.length,p.passages.length);assert.equal(s.plainBody.length,p.passages.length);
  for(const [j,pass] of p.passages.entries()){
   const original=paragraphs[paragraphIndex];assert.equal(pass.paragraph,original.id);assert.equal(pass.start,offset);assert.ok(pass.end>pass.start&&pass.end<=original.text.length);assert.equal(original.markdown,original.source.map(x=>x.markdown).join(''));assert.equal(original.text,original.markdown.replaceAll('**',''));
   assert.equal(s.plainBody[j],original.text.slice(pass.start,pass.end));assert.equal(decode(s.body[j]),s.plainBody[j]);
   // 原文の太字の範囲を文字単位で復元し、表示の太字と照合する。
   const expected=[];let bold=false;for(let k=0;k<original.markdown.length;){if(original.markdown.slice(k,k+2)==='**'){bold=!bold;k+=2;}else{expected.push(bold);k++;}}
   const actual=[];let cursor=0;for(const match of s.body[j].matchAll(/<span class="source-bold">([\s\S]*?)<\/span>/g)){actual.push(...Array(decode(s.body[j].slice(cursor,match.index)).length).fill(false),...Array(decode(match[1]).length).fill(true));cursor=match.index+match[0].length;}actual.push(...Array(decode(s.body[j].slice(cursor)).length).fill(false));assert.deepEqual(actual,expected.slice(pass.start,pass.end),'太字範囲');
   offset=pass.end;if(offset===original.text.length){paragraphIndex++;offset=0;}
  }
  const text=s.plainBody.join('');assert.ok(text.length>=100,'導入や結論の一文だけのページにしない');assert.ok(!/[（「『]$/.test(text),'括弧の途中で改ページしない');
  const items=sceneMapItems(s,chapterPlaces),required=chapterNamesInText(s.title+'。'+text);for(const e of required){const item=items.find(x=>x.text===e.name);assert.ok(item,s.id+': '+e.name);assert.deepEqual(item.at,e.points[0]);}
  assert.ok(s.frame.every(Number.isFinite));assert.ok(s.frame[2]>s.frame[0]&&s.frame[3]>s.frame[1]);for(const item of items)assert.ok(item.at.length===2&&item.at.every(Number.isFinite));
  for(const prop of s.props){
    assert.ok(!prop.image.endsWith('.svg'), s.id + ': prop using SVG: ' + prop.image);
    assert.ok(prop.image.endsWith('.png'), s.id + ': prop not PNG: ' + prop.image);
    assert.ok(prop.bubble, s.id + ': prop missing bubble: ' + prop.name);
    assert.ok(fs.existsSync(path.join(root,'public/images',prop.image)), s.id + ': prop image not found: ' + prop.image);
  }
  for(const act of s.actors){
    assert.ok(!act.image.endsWith('.svg'), s.id + ': actor using SVG: ' + act.image);
    assert.ok(act.image.endsWith('.png'), s.id + ': actor not PNG: ' + act.image);
    assert.ok(fs.existsSync(path.join(root,'public/images',act.image)), s.id + ': actor image not found: ' + act.image);
    assert.ok(text.includes(act.name), s.id + ': actor name not in text: ' + act.name);
  }
 }
}
assert.equal(paragraphIndex,paragraphs.length);assert.equal(offset,0);assert.equal(pageIndex,reading.length);
const boldWords=[...new Set(paragraphs.flatMap(p=>[...p.markdown.matchAll(/\*\*(.*?)\*\*/g)].map(m=>m[1])))];assert.deepEqual(reviewed.map(r=>r.word),boldWords);for(const r of reviewed){assert.ok(r.reason);if(r.status==='地図対応')assert.ok(chapterNamesInText(r.word).length);}
assert.deepEqual(chapterNamesInText('周りが新しくなった。お金がない。清んじる。元気な説明。明るい。明らかだ。').map(x=>x.name),[],'一般語と一文字王朝を混同しない');
assert.ok(chapterNamesInText('宋・元・明・清・唐').length===5,'一文字王朝の列挙を落とさない');
assert.deepEqual(chapterNamesInText('太宗【ホンタイジ】').find(e=>e.name==='太宗').points[0],[123.43,41.8]);
assert.deepEqual(chapterNamesInText('太宗（趙匡胤の弟）').find(e=>e.name==='太宗').points[0],[114.3,34.8]);
assert.equal(paragraphs.find(p=>p.id==='c05-16-419').volume,'c05-l16-p04');assert.equal(paragraphs.find(p=>p.id==='c05-19-158').volume,'c05-l19-p02');
assert.ok(chapterEdition['c05-l16-p03'].some(s=>s.plainBody.join('').includes('岳飛が処刑')&&s.plainBody.join('').includes('紹興の和議')));
for(const name of ['楊応龍','チャハル','東林書院','鄧茂七','クビライ','朱熹','王建','李公蘊','ボロブドゥール'])assert.ok(chapterNamesInText(name).some(e=>e.name===name));
execFileSync(process.execPath,['scripts/build-chapter-05.mjs','--check'],{cwd:root,stdio:'inherit'});
console.log('第5章：全文・太字・掲載順・全行分類・地図名・自然な接続・再生成一致を確認（'+reading.length+'ページ）');
