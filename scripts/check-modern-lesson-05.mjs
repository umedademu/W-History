import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule},{modernDiagrams,modernDiagramFor,modernReferencePages}]=await Promise.all([load('public/modern-c01-l05-edition.js'),load('public/modern-lesson-05-volumes.js'),load('public/modern-geography-05.js'),load('scripts/build-modern-lesson-05.mjs'),load('public/modern-story-support-05.js')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===5);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-05/'+name+'.json'))));
const originalSha256='f061a5cc959ed1869062f43104dc31a5d221133a2c7a5c21675607723abd52d1';
assert.equal(selection.source_sha256,originalSha256,'検査開始前に固定した参照専用原文の印');
let sourcePresent=false;
if(!process.argv.includes('--published')) {
 let raw;
 for(const candidate of [process.env.W_HISTORY_MODERN_SOURCE,path.join(root,selection.source_file),path.join('C:/Users/USER/Desktop/W-History',selection.source_file)].filter(Boolean)) {
   try {raw=await fs.readFile(candidate);break;}catch(error){if(error.code!=='ENOENT')throw error;}
 }
 assert.ok(raw,'参照専用の原文を読み込める');
 assert.equal(createHash('sha256').update(raw).digest('hex'),originalSha256,'原文を変更しない');
 assert.equal(raw.length,selection.source_bytes,'原文の全容量');
 const lines=raw.toString('utf8').replace(/^\uFEFF/,'').replaceAll('\r\n','\n').split('\n');if(lines.at(-1)==='')lines.pop();
 assert.deepEqual(lines,selection.lines.map(line=>line.text),'記録した全行が原文と一致する');sourcePresent=true;
}
const namesRecord = JSON.parse(await read('docs/modern-lesson-05/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-05/entity-audit.json'));
const decode = text => text.replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
const plainSource = text => decode(text.replace(/<rt>[\s\S]*?<\/rt>/g,'').replace(/<[^>]+>/g,'').replaceAll('**',''));
const plainDisplay = html => decode(html.replace(/<rt>[\s\S]*?<\/rt>/g,'').replace(/<[^>]+>/g,''));
const normalize = text => text.replace(/[\s＝=・『』「」]/g,'');
const mapPoints = point => assert(Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)&&Math.abs(point[0])<=180&&Math.abs(point[1])<=90,`座標: ${point}`);

function checkHTML(html) {
  const stack = [];
  const allowed = new Set(['p','strong','span','u','ruby','rt','em','br','h1','h2','h3','h4','h5','h6','blockquote','div','table','tbody','tr','td','ul','li']);
  for (const token of html.matchAll(/<[^>]*>/g)) {
    const tag = token[0].match(/^<(\/)?([a-z][a-z0-9]*)([^>]*)>$/);
    assert(tag,token[0]);
    const [,close,name,attributes] = tag;
    assert(allowed.has(name),`不明なタグ: ${name}`);
    assert(!/\b(?:on\w+|src|href)\s*=|javascript:|url\(/i.test(attributes),token[0]);
    if(close) assert.equal(stack.pop(),name,`閉じるタグの順: ${token[0]}`);
    else if(name !== 'br') {
      if(name === 'rt') assert.equal(stack.at(-1),'ruby','読み仮名の親文字が不明');
      stack.push(name);
    }
  }
  assert.deepEqual(stack,[],'閉じていないHTMLタグ');
}

assert.equal(selection.line_count,selection.lines.length);
assert.deepEqual(selection.lines.map(line=>line.line),Array.from({length:selection.line_count},(_,i)=>i+1),'全原文行の欠落・重複');
// 保存済みの分類を期待値にせず、原書の行形式から全行を独立に判定する。
const expectedLineKind=text=>!text?'blank':/^## \d+$/.test(text)?'page':text.startsWith('|')?'table':text.startsWith('>')?(/^> 第[1-5]章/.test(plainSource(text))?'chapter-navigation':'supplement'):text.startsWith('### ')&&/^### [1-4] /.test(plainSource(text))?'section-heading':/^### 第5回 /.test(plainSource(text))?'cover-heading':/^#{3,6} /.test(text)?'subheading':text.startsWith('<span')&&/^(?:第5回 ロシアと東方問題|[1-4] (?:ロシアのツァーリズム|東方問題の発生|クリミア戦争とロシアの改革|露土戦争))$/.test(plainSource(text))?'running-header':'body';
const kinds = new Set(['blank','page','cover-heading','body','subheading','table','supplement','running-header','section-heading','chapter-navigation']);
for(const line of selection.lines) {
  assert(kinds.has(line.kind),line.line);
  assert.equal(line.kind,expectedLineKind(line.text,line.page),line.line+': 原文行の分類を独立に照合');
  assert(line.reason.length>0,`分類理由がない: ${line.line}`);
  assert(selection.pages.includes(line.page));
  if(line.kind==='blank')assert.equal(line.text,'','空行の分類');
  if(line.kind==='page')assert.equal(line.text,'## '+line.page,'ページ番号の分類');
  if(line.kind==='table')assert.ok(line.text.startsWith('|'),'図表行の分類');
  if(line.kind==='supplement'||line.kind==='chapter-navigation')assert.ok(line.text.startsWith('>'),'吹き出し・独立コラム・補足・章案内の分類');
  if(line.kind==='body')assert.ok(line.text.trim()&&!/^[>#|]/.test(line.text),'通常本文へ見出し・表・補足を混ぜない');
}
assert.equal(selection.line_count,460,'原文の全460行');
assert.deepEqual(selection.pages,Array.from({length:15},(_,i)=>i+93));
assert.deepEqual(selection.section_start_pages,[94,95,102,105]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section-heading').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['ロシアのツァーリズム','東方問題の発生','クリミア戦争とロシアの改革','露土戦争'],'原文の4節を同じ順に教材化する');
assert.equal(modernSeries.length,4);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3,4]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,1);
  assert.equal(volume.lesson,5);
  assert.deepEqual(volume.sections,[volume.id]);
}
assert.deepEqual(Object.keys(modernEdition),modernSeries.map(volume=>volume.id));
const scenes = Object.values(modernEdition).flat();
assert.equal(scenes.length,plan.length,'通読した場面表の全場面');
assert.deepEqual(Object.values(modernEdition).map(pages=>pages.length),modernSeries.map(volume=>plan.filter(scene=>scene.part===volume.part).length),'各節の全場面を掲載する');
assert.deepEqual(scenes.map(scene=>scene.id),plan.map(page=>page.id),'通読した改ページ表との順序');
const byLine = new Map(selection.lines.map(line=>[line.line,line]));
const paragraphIds = scenes.flatMap(scene=>scene.sourceText.passages.map(passage=>passage.paragraph));
assert.deepEqual(paragraphIds.filter((id,index)=>id!==paragraphIds[index-1]),selection.paragraphs.map(paragraph=>paragraph.id),'分割した範囲をまとめた通常本文段落の欠落・重複・順序');
assert.equal(selection.paragraphs.length,48,'通常本文の全48段落');
assert.equal(selection.lines.filter(line=>line.kind==='body').length,58,'通常本文の全58行');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const connections=[[40,46],[68,84],[96,102],[118,134],[152,158],[175,191],[329,345],[357,363],[379,395],[413,419]];
assert.deepEqual(selection.cross_page_connections.map(connection=>connection.lines),connections,'通読した10か所の紙面接続の記録');
assert.deepEqual(selection.paragraphs.filter(paragraph=>paragraph.lines.length>1).map(paragraph=>paragraph.lines),connections,'10か所の紙面接続だけを同じ段落にする');
const bodyLines = selection.paragraphs.flatMap(paragraph=>paragraph.lines);
assert.deepEqual(bodyLines,selection.lines.filter(line=>line.kind === 'body').map(line=>line.line),'通常本文全行の掲載順');
for(const paragraph of selection.paragraphs) {
  assert.equal(paragraph.markdown,paragraph.lines.map(line=>byLine.get(line).text).join(''),'接続した原文の字句');
  assert.deepEqual(paragraph.sourcePages,[...new Set(paragraph.lines.map(line=>byLine.get(line).page))].sort((a,b)=>a-b));
}
assert.deepEqual(modernNameCatalog,namesRecord.names,'独立した原文固有名詞の記録との一致');
const allRaw = selection.lines.map(line=>line.text).concat(selection.paragraphs.map(paragraph=>paragraph.markdown)).join('');
for(const entry of modernNameCatalog) {
  assert(normalize(plainSource(allRaw)).includes(entry.key),`原文にない地図名称: ${entry.name}`);
  assert(['place','region','person','building','concept'].includes(entry.kind));
  if(entry.kind==='concept')assert.deepEqual(entry.points,[],'団体・王家・階層には所在地を補わない: '+entry.name);
  entry.points.forEach(mapPoints);
}
for(const word of ['ツァーリズム','農奴制','ミール','ナロードニキ','エスエル','社会革命党','聖地管理権','グレートゲーム'])assert.ok(modernNamesInText(word).every(entry=>entry.kind==='concept'&&entry.points.length===0),'制度・集団だけで個人や所在地を補わない: '+word);
for(const text of ['神聖ローマ皇帝','ビザンツ皇帝'])assert.ok(!modernNamesInText(text).some(entry=>entry.kind==='place'),'皇帝の肩書きから都市を補わない: '+text);
for(const text of ['ギリシア正教徒','ギリシア正教','ギリシア正教徒の保護を口実に'])assert.ok(!modernNamesInText(text).some(entry=>entry.family==='ギリシア'&&['place','region'].includes(entry.kind)),'宗教名からギリシアの地域印を補わない: '+text);
for(const text of ['ギリシア独立戦争','ギリシアへの派兵','ギリシアとギリシア正教徒'])assert.ok(modernNamesInText(text).some(entry=>entry.family==='ギリシア'&&['place','region'].includes(entry.kind)),'国名そのものの言及は保持する: '+text);
for(const name of ['アレクサンドル1世','アレクサンドル2世','ニコライ1世','ピョートル1世','エカチェリーナ2世'])assert.ok(modernNamesInText(name).some(entry=>entry.kind==='person'&&entry.name===name),'原文の本人名を識別する: '+name);
for(const [given,other] of [['アレクサンドル1世','アレクサンドル2世'],['アレクサンドル2世','アレクサンドル1世']])assert.ok(!modernNamesInText(given).some(entry=>entry.name===other),'同じ名前の第1世と第2世を取り違えない');
const passageRecords=scenes.flatMap(scene=>scene.sourceText.passages.map((passage,index)=>({scene:scene.id,passage,text:scene.plainBody[index]})));
for(const paragraph of selection.paragraphs) {
 const segments=passageRecords.filter(record=>record.passage.paragraph===paragraph.id),whole=plainSource(paragraph.markdown);
 assert.ok(segments.length>0,'全文の対応がある: '+paragraph.id);
 let end=0;for(const {scene,passage,text} of segments) {
   assert.equal(passage.start,end,scene+': 段落の範囲が前の場面へ隣接する');
   assert.ok(passage.end>passage.start&&passage.end<=whole.length,scene+': 段落内の範囲');
   assert.equal(text,whole.slice(passage.start,passage.end),scene+': 原文の指定範囲をそのまま表示する');
   assert.deepEqual(passage.lines,paragraph.lines,scene+': 元の段落の紙面行を記録する');end=passage.end;
 }
 assert.equal(end,whole.length,'段落末尾まで掲載する: '+paragraph.id);
 assert.equal(segments.map(segment=>segment.text).join(''),whole,'分割した場面から原文全文を復元する: '+paragraph.id);
}
for(const {scene,passage,text} of passageRecords)if(passage.end<plainSource(paragraphs.get(passage.paragraph).markdown).length)assert.ok(/[。！!？?」]$/.test(text.trimEnd()),scene+': 文・発話の意味の切れ目で分ける');
let boldCount=0,rubyCount=0;
for(const [index,scene] of scenes.entries()) {
  const planned = plan[index];
  const chosen = planned.paragraphs.map(id=>paragraphs.get(id));
  const selectedMarkdown=chosen.map(paragraph=>{const slice=planned.slices?.find(item=>item.paragraph===paragraph.id);return paragraph.markdown.slice(slice?.markdownStart??0,slice?.markdownEnd??paragraph.markdown.length);});
  assert.deepEqual(scene.plainBody,selectedMarkdown.map(plainSource),`${scene.id}: 原文全文`);
  assert.deepEqual(scene.body.map(plainDisplay),scene.plainBody,`${scene.id}: 実際の表示本文`);
  assert.deepEqual(scene.sourceText.sourcePages,[...new Set(chosen.flatMap(paragraph=>paragraph.sourcePages))].sort((a,b)=>a-b));
  assert.equal(scene.sourceText.book,'modern');
  assert.equal(scene.sourceText.part,planned.part);
  const sectionForLine=line=>Math.max(1,[24,50,293,373].filter(start=>start<=line).length);
  for(const passage of scene.sourceText.passages)for(const line of passage.lines)assert.equal(scene.sourceText.part,sectionForLine(line),scene.id+': 柱ではなく実際の節見出しで本文を区分');
  assert.equal(scene.sourceText.chapter,1);
  assert.equal(scene.sourceText.lesson,5);
  scene.body.forEach((html,i)=>{
    checkHTML(html);
    const markdown = selectedMarkdown[i];
    assert.equal((html.match(/<strong\b/g)??[]).length,(markdown.match(/\*\*/g)??[]).length/2,'太字の範囲数');
    assert.equal((html.match(/<ruby\b/g)??[]).length,(markdown.match(/<ruby\b/g)??[]).length,'読み仮名の範囲数');
    assert.deepEqual([...html.matchAll(/<ruby\b[^>]*>([\s\S]*?)<\/ruby>/g)].map(match=>plainDisplay(match[0])),[...markdown.matchAll(/<ruby\b[^>]*>([\s\S]*?)<\/ruby>/g)].map(match=>plainSource(match[0])),'読み仮名の親文字');
    assert.deepEqual([...html.matchAll(/<rt>([\s\S]*?)<\/rt>/g)].map(match=>decode(match[1])),[...markdown.matchAll(/<rt>([\s\S]*?)<\/rt>/g)].map(match=>decode(match[1])),'印刷された読みの字句');
    assert.deepEqual([...html.matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),[...markdown.matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),'色・下線などの原書属性');
    boldCount+=(html.match(/<strong\b/g)??[]).length;rubyCount+=(html.match(/<ruby\b/g)??[]).length;
  });
  const names = modernNamesInText(scene.plainBody.join(''));
  const auditedNames=modernNamesInText(scene.title+'。'+scene.plainBody.join(''));
  assert.deepEqual(auditedNames.map(entry=>normalize(entry.name)).toSorted(),audit.find(entry=>entry.scene === scene.id).names.map(normalize).toSorted(),scene.id+': 題名・本文を通読した場面別名称の記録');
  const expected = names.flatMap(entry=>entry.points.map(point=>({name:entry.name,point}))).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const displayed = [...scene.pins.map(key=>{assert(modernPlaces[key],key);return {name:modernPlaces[key].name,point:modernPlaces[key].point};}),...scene.tags.map(tag=>({name:tag.text,point:tag.at}))].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  assert.deepEqual(displayed,expected,`${scene.id}: 本文と地図名称の双方向一致`);
  assert.deepEqual(scene.actors,[],'別人の画像を流用しない');assert.deepEqual(scene.props,[]);
  const [west,south,east,north]=scene.frame;
  assert(west<east&&south<north,'表示範囲');
  [...expected.map(entry=>entry.point),...scene.routes.flatMap(route=>route.points)].forEach(point=>{mapPoints(point);assert(point[0]>=west&&point[0]<=east&&point[1]>=south&&point[1]<=north,'表示範囲から外れた地点');});
  assert.deepEqual(scene.routes,routes.filter(route=>route.scene === scene.id).map(({scene,reason,...route})=>route),'明示された移動経路');
}
for(const route of routes) { assert(scenes.some(scene=>scene.id===route.scene));assert(route.reason.length>0);assert(['move','campaign','rival','trade'].includes(route.kind)); }
// 本文が実際に述べる移動を許可し、条約の権利・政策構想・可能性だけで旅程を作らない。
const movementLines=new Set([40,46,108,150,357,363,405]);
for(const route of routes){const scene=scenes.find(scene=>scene.id===route.scene);assert.ok(scene.sourceText.passages.some(passage=>passage.lines.some(line=>movementLines.has(line))),scene.id+': 実際の派兵・上陸・農村入り・進軍の原文行がある');}
const routeEnds=[
 ['modern-c01-l05-p01-009',19,47],['modern-c01-l05-p02-009',23.5,39],
 ['modern-c01-l05-p02-015',29.08,41.12],['modern-c01-l05-p03-020',43,55],
 ['modern-c01-l05-p04-005',28.4,41.3]
];
assert.deepEqual(routes.map(route=>[route.scene,...route.points.at(-1)]),routeEnds,'原文にある鎮圧・派兵・上陸・農村入り・接近の5件を保持する');
for(const route of routes)assert.equal(route.kind,'move','条約の権利変更や国の陣営変更を移動にしない');
assert.ok(routes.at(-1).points.at(-1)[0]<28.98,'ロシア軍はイスタンブル中心に入らず西側に迫る');
for(const scene of scenes.filter(scene=>scene.sourceText.passages.every(passage=>passage.lines.every(line=>[136,152,158,195,323,347,349,409,413,419].includes(line)))))assert.deepEqual(scene.routes,[],scene.id+': 条約上の権利・土地制度・移住の可能性だけで実移動を作らない');
const narrative=scenes.flatMap(scene=>scene.plainBody).join('');
for(const phrase of ['オーストリア領だったハンガリー','オスマン帝国領への進出','いじめるんじゃない！','ギリシア独立戦争で、イギリス','英仏ってイヤな奴ら','こっちの3国で潰す','アレクサンドル2世によって','農民はこんなに貧乏','ボスニア・ヘルツェゴヴィナ','ロシアの南下を完全に挫折'])assert.ok(narrative.includes(phrase),'紙面接続の字句を保持: '+phrase);
for(const phrase of ['ロシア軍艦の独占航行権','あらゆる外国軍艦','ギリシア正教徒の保護を口実','参戦するほどの問題は起きていない','黒海の中立化','人格的な自由を与える','土地はタダではない','49年間','ミールの連帯責任','資本主義発達の出発点','一部のナロードニキはテロリスト','もちろん全員がテロリストになったわけじゃない','露土戦争のあと（1881年）','1901年に結成される','イギリスが参戦してない','黒海の出口に軍艦を待機','ロシアがイスタンブルに迫り','トルコの宗主下での自治国','統治権を獲得','キプロス島の行政権'])assert.ok(narrative.includes(phrase),'混同しやすい原文の意味を保持: '+phrase);
assert.deepEqual(Object.keys(sourcePages).map(Number),selection.pages);
for(const page of selection.pages) {
  const html = sourcePages[String(page)];checkHTML(html);
  const original = selection.lines.filter(line=>line.page === page).map(line=>line.text);
  const expected = original.filter(line=>!/^\|[\s|:-]*$/.test(line)).map(line=>line.replace(/^> ?/,'').replace(/^#{1,6} /,'').replace(/^- /,'').replaceAll('|','')).join('');
  const visible = text => decode(text.replace(/<[^>]*>/g,'').replaceAll('**','')).replace(/\s/g,'');
  assert.equal(visible(html),visible(expected),`原書${page}: 図表・補足を含む全字句`);
  assert.equal((html.match(/<rt>/g)??[]).length,(original.join('').match(/<rt>/g)??[]).length,'補助欄のルビ数');
  assert.equal((html.match(/<strong\b/g)??[]).length,(original.join('').match(/\*\*/g)??[]).length/2,'補助欄の太字数');
  assert.deepEqual([...html.matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),[...original.join('').matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),'補助欄の全装飾属性');
  assert.equal(sourcePageMetadata[String(page)].sourceSha256,selection.source_sha256);
}
const comparison=plainDisplay(sourcePages['101']);
for(const phrase of ['ギリシア独立戦争','アドリアノープル条約','第1次エジプト＝トルコ戦争','ウンキャル＝スケレッシ条約','第2次エジプト＝トルコ戦争','ロンドン会議','クリミア戦争','パリ条約','露土戦争','サン＝ステファノ条約','ベルリン会議','自由航行権','独占航行権','通過禁止'])assert.ok(comparison.includes(phrase),'原書101の独立比較欄を全文保持: '+phrase);
assert.equal(selection.lines.filter(line=>line.page===101&&line.kind==='body').length,0,'原書101の独立比較欄を通常本文へ混ぜない');
assert.ok(plainDisplay(sourcePages['103']).includes('ナイティンゲールが従軍看護で活躍したよ！')&&plainDisplay(sourcePages['103']).includes('この影響を受けたのがデュナンだ'),'原書103の従軍看護の補足を全文保持');
assert.ok(scenes.at(-1).plainBody.join('').includes('19世紀のヨーロッパ文化史')&&scenes.at(-1).plainBody.join('').includes('次回も頑張っていこう〜。'),'次回予告と締めくくりを省略しない');
const expectedDiagramTitles=Object.values(modernDiagrams).map(diagram=>diagram.title);
assert.ok(expectedDiagramTitles.some(title=>/ロシア|条約|東方/.test(title)),'東方問題の対立・比較を図示する');
const originalYears=new Set([...plainSource(allRaw).matchAll(/\b(1\d{3})\b/g)].map(match=>match[1]));
for(const diagram of Object.values(modernDiagrams))for(const match of JSON.stringify(diagram).matchAll(/\b(1\d{3})\b/g))assert.ok(originalYears.has(match[1]),diagram.title+': 原文にない年号を補わない');
for(const id of ['modern-c01-l05-p02-001','modern-c01-l05-p02-006','modern-c01-l05-p03-003','modern-c01-l05-p03-005','modern-c01-l05-p04-002','modern-c01-l05-p04-003']) {
 const scene=scenes.find(scene=>scene.id===id);assert.ok(scene,'宗教名と国名を区別する本文場面がある: '+id);
 assert.ok(!modernNamesInText(scene.plainBody.join('')).some(entry=>entry.family==='ギリシア'&&['place','region'].includes(entry.kind)),id+': 宗教名の内部だけから国名を拾わない');
 assert.ok(![...scene.pins.map(key=>modernPlaces[key].name),...scene.tags.map(tag=>tag.text)].includes('ギリシア'),id+': 宗教名からギリシア地理印を補わない');
}
const referencePages=new Set(),diagramTitles=new Set();
for(const volume of modernSeries)for(const [index,scene] of modernEdition[volume.id].entries()) {
 const pages=modernReferencePages(scene,volume,index);
 assert.ok(pages.length>0&&pages.every(page=>selection.pages.includes(page)),scene.id+': 対象回の原書ページへ接続する');
 for(const page of scene.sourceText.sourcePages)assert.ok(pages.includes(page),scene.id+': 本文の出典ページを補足で確認できる');
 pages.forEach(page=>referencePages.add(page));
 const diagram=modernDiagramFor(scene);if(diagram){diagramTitles.add(diagram.title);for(const page of String(diagram.page).split('・').map(Number))assert.ok(pages.includes(page),scene.id+': 説明図の原文ページを掲載する');}
}
assert.deepEqual([...referencePages].sort((a,b)=>a-b),selection.pages,'原書15ページすべてへ到達する');
assert.deepEqual([...diagramTitles].sort(),expectedDiagramTitles.toSorted(),'説明図すべてへ到達する');
assert.equal((await read('public/modern-c01-l05-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第5回: 4教材・${scenes.length}場面・${selection.paragraphs.length}段落・460行・原書15ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
