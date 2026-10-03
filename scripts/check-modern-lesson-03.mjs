import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule},{modernDiagrams,modernDiagramFor,modernReferencePages}]=await Promise.all([load('public/modern-c01-l03-edition.js'),load('public/modern-lesson-03-volumes.js'),load('public/modern-geography-03.js'),load('scripts/build-modern-lesson-03.mjs'),load('public/modern-story-support-03.js')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===3);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-03/'+name+'.json'))));
const originalSha256='72fca4fe17c9b56f4a384f31d1f88792332f5ae71ddde72902fd2d5483353741';
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
const namesRecord = JSON.parse(await read('docs/modern-lesson-03/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-03/entity-audit.json'));
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
const expectedLineKind=text=>!text?'blank':/^## \d+$/.test(text)?'page':text.startsWith('|')?'table':text.startsWith('>')?(/^> 第[1-5]章/.test(plainSource(text))?'chapter-navigation':'quote'):text.startsWith('### ')&&/^### [1-4] /.test(plainSource(text))?'section-heading':text.startsWith('#### ')||/^### 近現代日本へのアプローチ/.test(plainSource(text))?'subheading':text.startsWith('### ')?'cover-heading':text.startsWith('<span')&&/^(?:第3回 アメリカ合衆国の発展|[1-4] (?:建国初期のアメリカ|アメリカ合衆国の領土拡大|南北戦争|南北戦争後のアメリカ))$/.test(plainSource(text))?'page-heading':'body';
const kinds = new Set(['blank','page','cover-heading','body','subheading','table','quote','page-heading','section-heading','chapter-navigation']);
for(const line of selection.lines) {
  assert(kinds.has(line.kind),line.line);
  assert.equal(line.kind,expectedLineKind(line.text),line.line+': 原文行の分類を独立に照合');
  assert(line.reason.length>0,`分類理由がない: ${line.line}`);
  assert(selection.pages.includes(line.page));
  if(line.kind==='blank')assert.equal(line.text,'','空行の分類');
  if(line.kind==='page')assert.equal(line.text,'## '+line.page,'ページ番号の分類');
  if(line.kind==='table')assert.ok(line.text.startsWith('|'),'図表行の分類');
  if(line.kind==='quote'||line.kind==='chapter-navigation')assert.ok(line.text.startsWith('>'),'吹き出し・補足・章案内の分類');
  if(line.kind==='body')assert.ok(line.text.trim()&&!/^[>#|]/.test(line.text),'通常本文へ見出し・表・補足を混ぜない');
}
assert.equal(selection.line_count,500,'原文の全500行');
assert.deepEqual(selection.pages,Array.from({length:17},(_,i)=>i+55));
assert.deepEqual(selection.section_start_pages,[56,58,61,68]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section-heading').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['建国初期のアメリカ','アメリカ合衆国の領土拡大','南北戦争','南北戦争後のアメリカ'],'原文の4節を同じ順に教材化する');
assert.equal(modernSeries.length,4);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3,4]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,1);
  assert.equal(volume.lesson,3);
  assert.deepEqual(volume.sections,[volume.id]);
}
assert.deepEqual(Object.keys(modernEdition),modernSeries.map(volume=>volume.id));
const scenes = Object.values(modernEdition).flat();
assert.equal(scenes.length,64,'通読して選んだ第3回の全64場面');
assert.deepEqual(Object.values(modernEdition).map(pages=>pages.length),[15,7,24,18],'通読して選んだ4節の場面数');

assert.deepEqual(scenes.map(scene=>scene.id),plan.map(page=>page.id),'通読した改ページ表との順序');
const byLine = new Map(selection.lines.map(line=>[line.line,line]));
const paragraphIds = scenes.flatMap(scene=>scene.sourceText.passages.map(passage=>passage.paragraph));
assert.deepEqual(paragraphIds.filter((id,index)=>id!==paragraphIds[index-1]),selection.paragraphs.map(paragraph=>paragraph.id),'分割した範囲をまとめた通常本文段落の欠落・重複・順序');
assert.equal(selection.paragraphs.length,55,'通常本文の全55段落');
assert.equal(selection.lines.filter(line=>line.kind==='body').length,64,'通常本文の全64行');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const connections=[[40,46],[69,85],[108,114],[198,214],[229,235],[249,265],[277,283],[336,342],[412,428]];
assert.deepEqual(selection.cross_page_connections.map(connection=>connection.lines),connections,'通読した9か所の紙面接続の記録');
assert.deepEqual(selection.paragraphs.filter(paragraph=>paragraph.lines.length>1).map(paragraph=>paragraph.lines),connections,'9か所の紙面接続だけを同じ段落にする');
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
  assert(['place','region','person','building'].includes(entry.kind));
  entry.points.forEach(mapPoints);
}
for(const word of ['プランター','産業資本家','労働者','南北戦争','ジャクソニアン＝デモクラシー','ホームステッド法','奴隷解放宣言','KKK','ジム＝クロウ制度']) assert.deepEqual(modernNamesInText(word),[],'階層・制度・事件名から現地や人物を生成しない: '+word);
for(const text of ['アメリカン・ドリーム','苦力【クーリー】','ペリー'])assert.ok(!modernNamesInText(text).some(entry=>entry.kind==='person'&&entry.name==='リー'),'単語の途中をリー将軍と取り違えない: '+text);
assert.ok(modernNamesInText('リー将軍が率いる南軍').some(entry=>entry.kind==='person'&&entry.name==='リー'),'原文66ページのリー将軍本人を識別する');
assert.ok(modernNamesInText('リー').some(entry=>entry.kind==='person'&&entry.name==='リー'),'人物図の氏名だけでもリー将軍本人を識別する');
assert.ok(modernNamesInText('首都ワシントン').some(entry=>entry.kind==='place'&&entry.family==='ワシントン市'),'首都は初代大統領とは別の都市');
assert.ok(!modernNamesInText('首都ワシントン').some(entry=>entry.kind==='person'),'首都の文脈に大統領本人を補わない');
assert.ok(modernNamesInText('初代大統領のワシントン').some(entry=>entry.kind==='person'),'初代大統領本人の文脈を保持する');
const territorial=modernNamesInText('ミシシッピ川以東のルイジアナとミシシッピ川以西のルイジアナ');
assert.ok(territorial.filter(entry=>entry.kind!=='person').length>=2,'ミシシッピ川東西のルイジアナを区別する');
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
for(const {scene,passage,text} of passageRecords)if(passage.end<plainSource(paragraphs.get(passage.paragraph).markdown).length)assert.ok(/[。！!？?」]$/.test(text),scene+': 文・発話の意味の切れ目で分ける');
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
  assert.equal(scene.sourceText.chapter,1);
  assert.equal(scene.sourceText.lesson,3);
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
  assert.equal(names.some(entry=>entry.kind==='person'&&entry.name==='リー'),scene.id==='modern-c01-l03-p03-016',scene.id+': リー本人は原文66ページの南軍指揮の場面だけに登場する');
  assert.deepEqual(names.map(entry=>entry.key),audit.find(entry=>entry.scene === scene.id).names.map(normalize),'固定した場面別名称の記録');
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
// 原文が述べる実際の移動・輸出だけを独立に固定する。援軍への期待や領土購入は移動を追加しない。
const expectedRoutes=[
 ['p01-007','trade','イギリス','北部',[40,46]],
 ['p01-009','move','東部','西部',[52]],
 ['p01-014','move','ミシシッピ川以東','ミシシッピ川以西',[69,85]],
 ['p02-004','move','アメリカ','テキサス',[122]],
 ['p03-004','trade','南部','イギリス',[227]],
 ['p03-016','trade','南部','イギリス',[326]],
 ['p03-016','trade','南部','フランス',[326]],
 ['p03-020','move','南部','北部',[336]],
 ['p04-006','move','東部','西部',[401]],
 ['p04-011','move','アイルランド','北部',[430]],
 ['p04-012','move','ドイツ','中西部',[430]],
 ['p04-013','move','南イタリア','北部',[432]],
 ['p04-013','move','ロシア','北部',[432]]
];
assert.deepEqual(routes.map(route=>[route.scene.replace('modern-c01-l03-',''),route.kind]),expectedRoutes.map(([scene,kind])=>[scene,kind]),'通読した全13経路の場面・順序・用途');
for(const [index,[id,kind,from,to,lines]] of expectedRoutes.entries()) {
 const route=routes[index],scene=scenes.find(scene=>scene.id.endsWith(id));
 assert.ok(lines.every(line=>scene.sourceText.passages.some(passage=>passage.lines.includes(line))),id+': 実際の移動・輸出を述べる原文行を掲載する');
 const start=route.points[0],end=route.points.at(-1);
 if(to==='北部')assert.ok(end[0]<-65&&end[0]>-85&&end[1]>39,id+': 北部へ向かう');
 if(to==='西部'||to==='ミシシッピ川以西')assert.ok(end[0]<start[0]&&end[0]<-90,id+': 西へ向かう');
 if(to==='イギリス')assert.ok(end[0]>-8&&end[0]<3&&end[1]>49,id+': イギリスへ向かう');
 if(to==='フランス')assert.ok(end[0]>-5&&end[0]<9&&end[1]>42&&end[1]<51,id+': フランスへ向かう');
 if(to==='テキサス')assert.ok(end[0]>-105&&end[0]<-93&&end[1]>26&&end[1]<36,id+': テキサスへの入植');
 if(to==='中西部')assert.ok(end[0]>-107&&end[0]<-83&&end[1]>37&&end[1]<49,id+': 中西部の農業地域へ向かう');
}
// 原文を通読して選んだ、改ページを挟む接続と意味上の要点。
const narrative=scenes.flatMap(scene=>scene.plainBody).join('');
for(const phrase of ['打撃を受けた。こうして','黒人を民主主義から除外して','これは、ハイチ','工業発展を目指す北部と農業を重視したい南部','思って、注意深く読んで','しかも領域がミズーリ協定','開戦前に7州、開戦後に4州','奴隷は永遠に苦しめばいい','つまりこの時期のアメリカ'])assert.ok(narrative.includes(phrase),'紙面接続を保持: '+phrase);
for(const phrase of ['建国13州を中心とする東部を南北に分けた','白人限定','共和党の成立はもう少しあと','新たな州では奴隷制を認めない','合衆国の統合を最優先','5年間定住','無償で土地160エーカー','英仏の介入を阻止','北軍が勝利','憲法修正第13条','市民権、投票権','収穫物の半分以上','ジム＝クロウ制度','旧移民','新移民','中国人労働者移民排斥法'])assert.ok(narrative.includes(phrase),'混同しやすい原文の意味を保持: '+phrase);
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
const japan=plainDisplay(sourcePages['60']);
for(const phrase of ['近現代日本へのアプローチ','開国から明治維新へ','ペリー','ラーマ4世','井伊直弼','徳川慶喜','戊辰戦争','廃藩置県','明治維新'])assert.ok(japan.includes(phrase),'原書60の独立日本史コラムを保持: '+phrase);
assert.equal(selection.lines.filter(line=>line.page===60&&line.kind==='body').length,0,'独立コラムをアメリカの通常本文に混ぜない');
assert.ok(plainDisplay(sourcePages['64']).includes('ジョン＝ブラウンの武装蜂起［1869］'),'原書の年号は補助欄でも訂正しない');
assert.ok(plainDisplay(sourcePages['64']).includes('ちょっと寄り耳'),'原書のコラム題名を保持する');
assert.ok(plainDisplay(sourcePages['70']).includes('統一戦後の政治的・経済的な混乱'),'原書の表の字句を訂正しない');
assert.ok(sourcePages['71'].includes('<ruby style="ruby-position:under"><ruby style="ruby-position:over">'),'71ページの二重ルビを位置指定と構造ごと保持');
assert.ok(scenes.at(-1).plainBody.join('').includes('次回はドイツとイタリアの統一'),'次回案内を省略しない');
const expectedDiagramTitles=Object.values(modernDiagrams).map(diagram=>diagram.title);
assert.ok(expectedDiagramTitles.some(title=>/南北/.test(title)),'南北の比較を図示する');
const referencePages=new Set(),diagramTitles=new Set();
for(const volume of modernSeries)for(const [index,scene] of modernEdition[volume.id].entries()) {
 const pages=modernReferencePages(scene,volume,index);
 assert.ok(pages.length>0&&pages.every(page=>selection.pages.includes(page)),scene.id+': 対象回の原書ページへ接続する');
 for(const page of scene.sourceText.sourcePages)assert.ok(pages.includes(page),scene.id+': 本文の出典ページを補足で確認できる');
 pages.forEach(page=>referencePages.add(page));
 const diagram=modernDiagramFor(scene);if(diagram){diagramTitles.add(diagram.title);for(const page of String(diagram.page).split('・').map(Number))assert.ok(pages.includes(page),scene.id+': 説明図の原文ページを掲載する');}
}
assert.deepEqual([...referencePages].sort((a,b)=>a-b),selection.pages,'原書17ページすべてへ到達する');
assert.deepEqual([...diagramTitles].sort(),expectedDiagramTitles.toSorted(),'説明図すべてへ到達する');
assert.equal((await read('public/modern-c01-l03-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第3回: 4教材・${scenes.length}場面・${selection.paragraphs.length}段落・500行・原書17ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
