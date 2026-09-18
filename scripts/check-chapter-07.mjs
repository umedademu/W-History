import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {chapterSeries,chapterLessons} from '../public/chapter-07-volumes.js';
import {chapterEdition,chapterPlaces} from '../public/chapter-07-edition.js';
import {chapterNamesInText,chapterNameCatalog} from '../public/chapter-07-geography.js';
import {sceneMapItems,normalizeMapName} from '../public/map-name-coverage.js';
import {pageTitles} from '../docs/chapter-07/capture-plan.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFile(new URL(p,root),'utf8');
const {files,paragraphs}=JSON.parse(await read('docs/chapter-07/source-selection.json'));
const plan=JSON.parse(await read('docs/chapter-07/reading-plan.json'));
const byId=new Map(paragraphs.map(p=>[p.id,p]));
assert.equal(chapterLessons.length,9);assert.equal(chapterSeries.length,35);
assert.deepEqual(chapterLessons.map(l=>l.lesson),[22,23,24,25,26,27,28,29,30]);
assert.equal(paragraphs.length,391);assert.equal(plan.length,253);
assert.deepEqual(Object.keys(chapterEdition),chapterSeries.map(v=>v.id));
let checkedLines=0;
for(const f of files){
 assert.ok(f.lines.length);
 for(const [i,l] of f.lines.entries()){
  assert.equal(l.line,i+1);assert.ok(['included','omitted'].includes(l.disposition));assert.ok(l.reason);
  if(l.disposition==='included')assert.ok(byId.get(l.paragraph)?.source.some(s=>s.line===l.line&&s.markdown===l.markdown));
  checkedLines++;
 }
 const stored=f.lines.map(l=>l.markdown).join('\n');
 let live;
 try{live=await read(f.file);}catch(error){if(!(process.argv.includes('--published')&&error.code==='ENOENT'))throw error;}
 if(live!==undefined){
  assert.equal(crypto.createHash('sha256').update(live).digest('hex'),f.sha256,`${f.file}: 原文が変わりました`);
  assert.equal(live.replaceAll('\r\n','\n'),stored);
 }
}
for(const p of paragraphs){
 assert.equal(p.markdown,p.source.map(s=>s.markdown).join(''));
 assert.equal(p.text,p.markdown.replaceAll('**',''));
 assert.equal((p.markdown.match(/\*\*/g)||[]).length%2,0,`${p.id}: 太字の接続`);
 const f=files.find(f=>f.file===p.file);
 for(const s of p.source)assert.equal(f.lines[s.line-1].disposition,'included');
}
const decode=s=>s.replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&amp;','&');
function boldCharacters(markdown){
 let bold=false,text='',mask=[];
 for(let i=0;i<markdown.length;){if(markdown.slice(i,i+2)==='**'){bold=!bold;i+=2;}else{text+=markdown[i++];mask.push(bold);}}
 return {text,mask};
}
function renderedCharacters(html){
 let bold=false,text='',mask=[];
 for(const token of html.split(/(<span class="source-bold">|<\/span>)/)){
  if(token==='<span class="source-bold">')bold=true;
  else if(token==='</span>')bold=false;
  else{const decoded=decode(token);text+=decoded;for(let i=0;i<decoded.length;i++)mask.push(bold);}
 }
 return {text,mask};
}
let paragraphIndex=0,offset=0,pageCount=0;
for(const v of chapterSeries){
 assert.match(v.id,/^c07-l\d{2}-p\d{2}$/);assert.equal(v.chapter,7);
 const pages=chapterEdition[v.id];assert.ok(pages.length);
 for(const [i,s] of pages.entries()){
  assert.equal(s.id,`${v.id}-${String(i+1).padStart(3,'0')}`);assert.equal(s.sourceText.chapter,7);
  assert.deepEqual(s.sourceText.passages,plan[pageCount].passages);assert.equal(s.title,plan[pageCount].title);
  assert.equal(s.body.length,s.sourceText.passages.length);assert.equal(s.plainBody.length,s.body.length);
  for(const [j,passage] of s.sourceText.passages.entries()){
   const p=paragraphs[paragraphIndex];assert.equal(passage.paragraph,p.id);assert.equal(p.volume,v.id);assert.equal(passage.start,offset);
   assert.ok(passage.end>offset&&passage.end<=p.text.length);
   const expected=boldCharacters(p.markdown),actual=renderedCharacters(s.body[j]);
   assert.equal(actual.text,expected.text.slice(passage.start,passage.end));
   assert.deepEqual(actual.mask,expected.mask.slice(passage.start,passage.end),`${s.id}: 原文の太字`);
   assert.equal(s.plainBody[j],actual.text);
   offset=passage.end;if(offset===p.text.length){paragraphIndex++;offset=0;}
  }
  const narrative=s.plainBody.join('');assert.ok(narrative.length>=100,`${s.id}: 導入・断片だけのページ`);assert.ok(narrative.length<800,`${s.id}: 読み進めるまとまりを再確認`);
  assert.ok(!/^[〈①②③④]|クローズアップ|図表|地図内|年号のツボ|復習のツボ/.test(s.title),`${s.id}: 省略した整理欄の見出し`);
  const reviewedTitle=pageTitles[s.sourceText.passages[0].paragraph];if(reviewedTitle)assert.equal(s.title,reviewedTitle);
  assert.ok(!/クローズアップ|年号check|年号のツボ|復習のツボ/.test(narrative));
  const required=chapterNamesInText(s.title+'。'+narrative),items=sceneMapItems(s,chapterPlaces);
  for(const entry of required){const item=items.find(item=>normalizeMapName(item.text)===entry.key);assert.ok(item,`${s.id}: 地図に ${entry.name} がありません`);assert.deepEqual(item.at,entry.points[0]);}
  for(const item of items){assert.equal(item.at.length,2);assert.ok(item.at.every(Number.isFinite));assert.ok(Math.abs(item.at[0])<=180&&Math.abs(item.at[1])<=90);}
  for(const prop of s.props){await fs.access(new URL('public/images/'+prop.image,root));assert.ok(!prop.image.endsWith('.svg'),`${s.id}: prop にSVG画像が使用されています (${prop.image})`);}
  for(const actor of s.actors){await fs.access(new URL('public/images/'+actor.image,root));assert.ok(!actor.image.endsWith('.svg'),`${s.id}: actor にSVG画像が使用されています (${actor.image})`);}
  pageCount++;
 }
}
assert.equal(paragraphIndex,paragraphs.length);assert.equal(offset,0);assert.equal(pageCount,253);
// 問いかけを本文と切り離さない。紙面またぎの句中分断を接続する。
const pageWith=id=>Object.values(chapterEdition).flat().find(s=>s.sourceText.passages.some(p=>p.paragraph===id));
assert.ok(pageWith('c07-23-65').plainBody.join('').includes('搾取'));
assert.ok(pageWith('c07-27-130').plainBody.join('').includes('機械制工場'));
assert.ok(pageWith('c07-29-68').plainBody.join('').includes('イタリア遠征'));
assert.ok(byId.get('c07-22-66').text.includes('ルネサンス様式絵画'));
assert.ok(byId.get('c07-22-94').text.includes('研究したけど'));
assert.ok(byId.get('c07-28-301').text.includes('ヴァンデーの反乱'));
assert.equal(chapterNamesInText('神、理性、予定説、聖書、プレスター＝ジョン').length,0);
assert.equal(chapterNamesInText('インディアンとインディオ、東インド会社').length,0);
assert.deepEqual(chapterNamesInText('エスパニョーラ島（ハイチ、ドミニカ）').find(e=>e.name==='ドミニカ').points,[[-70.2,18.8]]);
assert.deepEqual(chapterNamesInText('フランスからドミニカを獲得').find(e=>e.name==='ドミニカ').points,[[-61.4,15.4]]);
assert.ok(chapterNameCatalog.length>400);
// 地図登録表とは別に、原文から人手で判別した固有名詞を照合する。
const audit=JSON.parse(await read('docs/chapter-07/entity-audit.json'));
let auditedNames=0;
for(const [lesson,names] of Object.entries(audit.requiredByLesson))for(const name of names){
 const key=normalizeMapName(name),occurrences=paragraphs.filter(p=>p.lesson===Number(lesson)&&normalizeMapName(p.text).includes(key));
 assert.ok(occurrences.length,`原文の固有名詞確認表: 第${lesson}回 ${name}`);
 assert.ok(occurrences.some(p=>chapterNamesInText(p.text).some(entry=>entry.key.includes(key)||key.includes(entry.key))),`原文からの未登録語: 第${lesson}回 ${name}`);
 auditedNames++;
}
execFileSync(process.execPath,['scripts/build-chapter-07.mjs','--check'],{cwd:fileURLToPath(root),stdio:'pipe'});
console.log(`第7章: 9回35節、${pageCount}ページ、391段落、${checkedLines}行の掲載・省略分類、原文からの固有名詞${auditedNames}件、全文・太字・紙面接続・地図名・再生成を確認`);
