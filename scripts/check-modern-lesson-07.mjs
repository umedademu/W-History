import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule},{modernDiagrams,modernDiagramFor,modernReferencePages}]=await Promise.all([load('public/modern-c02-l07-edition.js'),load('public/modern-lesson-07-volumes.js'),load('public/modern-geography-07.js'),load('scripts/build-modern-lesson-07.mjs'),load('public/modern-story-support-07.js')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===7);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-07/'+name+'.json'))));
const originalSha256='c088d4763a1afc9d04d628565e3be75bd9ea4b905fe4357a8fdd45233268384e';
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
const namesRecord = JSON.parse(await read('docs/modern-lesson-07/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-07/entity-audit.json'));
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
const expectedLineKind=text=>!text?'blank':/^## \d+$/.test(text)?'page':text.startsWith('|')?'table':text.startsWith('>')?(/^> 第[1-5]章/.test(plainSource(text))?'chapter-navigation':'supplement'):/^### [1-3] /.test(plainSource(text))?'section-heading':/^# (?:第2章|列強の侵略とアジアの変革|第7回 近代の西アジア)$/.test(plainSource(text))?'cover-heading':/^#{1,6} /.test(text)?'subheading':text.startsWith('<span')&&/^(?:第7回 近代の西アジア|[1-3] (?:オスマン帝国の衰退|オスマン帝国の近代化|ガージャール朝の衰退と混乱))$/.test(plainSource(text))?'running-header':'body';
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
assert.equal(selection.line_count,483,'原文の全483行');
assert.deepEqual(selection.pages,Array.from({length:15},(_,i)=>i+125));
assert.deepEqual(selection.section_start_pages,[127,129,135]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section-heading').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['オスマン帝国の衰退','オスマン帝国の近代化','ガージャール朝の衰退と混乱'],'原文の3節を同じ順に教材化する');
assert.equal(modernSeries.length,3);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,2);
  assert.equal(volume.lesson,7);
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
assert.equal(selection.paragraphs.length,46,'通常本文の全46段落');
assert.equal(selection.lines.filter(line=>line.kind==='body').length,52,'通常本文の全52行');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const connections=[[57,63],[127,133],[296,312],[393,409],[421,427],[443,459]];
assert.deepEqual(selection.cross_page_connections.map(connection=>connection.lines),connections,'通読した6か所の紙面接続の記録');
assert.deepEqual(selection.paragraphs.filter(paragraph=>paragraph.lines.length>1).map(paragraph=>paragraph.lines),connections,'6か所の紙面接続だけを同じ段落にする');
const bodyLines = selection.paragraphs.flatMap(paragraph=>paragraph.lines);
assert.deepEqual(bodyLines,selection.lines.filter(line=>line.kind === 'body').map(line=>line.line),'通常本文全行の掲載順');
for(const paragraph of selection.paragraphs) {
  assert.equal(paragraph.markdown,paragraph.lines.map(line=>byLine.get(line).text).join(''),'接続した原文の字句');
  assert.deepEqual(paragraph.sourcePages,[...new Set(paragraph.lines.map(line=>byLine.get(line).page))].sort((a,b)=>a-b));
}
assert.deepEqual(modernNameCatalog,namesRecord.names,'独立した原文固有名詞の記録との一致');
const allRaw = selection.lines.map(line=>line.text).concat(selection.paragraphs.map(paragraph=>paragraph.markdown)).join('');
for(const entry of modernNameCatalog) {
  assert(normalize(plainSource(allRaw)).includes(entry.key)||entry.family&&modernNameCatalog.some(original=>original.family===entry.family&&original.kind===entry.kind&&normalize(plainSource(allRaw)).includes(original.key)),`原文の本人・地域・施設と対応しない名称: ${entry.name}`);
  assert(['place','region','person','building','concept'].includes(entry.kind));
  if(entry.kind==='concept')assert.deepEqual(entry.points,[],'団体・王家・階層には所在地を補わない: '+entry.name);
  entry.points.forEach(mapPoints);
}
for(const word of ['オスマン主義','パン＝イスラーム主義','パン＝トルコ主義','トルコ民族主義','新オスマン人','青年トルコ人','バーブ教'])assert.ok(modernNamesInText(word).every(entry=>entry.kind==='concept'&&entry.points.length===0),'思想・宗教・集団名から本人や所在地を補わない: '+word);
for(const name of ['スレイマン1世','エカチェリーナ2世','セリム3世','ムハンマド＝アリー','マフムト2世','アブデュルメジト1世','アブデュルハミト2世','ミドハト＝パシャ','アフガーニー','アーガー＝ムハンマド','サイイド＝アリー＝ムハンマド','ヤークーブ＝ベク','左宗棠'])assert.ok(modernNamesInText(name).some(entry=>entry.kind==='person'),'原文の本人名を識別する: '+name);
for(const religion of ['ギリシア正教','ギリシア正教徒'])assert.ok(!modernNamesInText(religion).some(entry=>entry.kind==='place'||entry.kind==='region'),'宗教名の一部をギリシアの所在地にしない: '+religion);
assert.ok(!modernNamesInText('サイイド＝アリー＝ムハンマド').some(entry=>entry.kind==='person'&&entry.name==='ムハンマド＝アリー'),'バーブ教祖とエジプト総督の名前の一部を混同しない');
assert.ok(!modernNamesInText('アフガーニー').some(entry=>['place','region'].includes(entry.kind)),'本人名をアフガニスタンの地名にしない');
for(const treaty of ['ミドハト憲法','カルロヴィッツ条約','トルコマンチャーイ条約','英露協商'])assert.ok(!modernNamesInText(treaty).some(entry=>entry.kind==='person'),'制度・条約名だけから本人の活動を補わない: '+treaty);
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
  const sectionForLine=line=>Math.max(1,[41,121,316].filter(start=>start<=line).length);
  for(const passage of scene.sourceText.passages)for(const line of passage.lines)assert.equal(scene.sourceText.part,sectionForLine(line),scene.id+': 柱ではなく実際の節見出しで本文を区分');
  assert.equal(scene.sourceText.chapter,2);
  assert.equal(scene.sourceText.lesson,7);
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
// 条約の権利、思想による連携、単なる利権の譲渡を実際の移動へ読み替えない。
const actionLines=new Set([67,111,115,125,217,221,227,286,296,393,409,411,415,437,439,459,461]);
for(const route of routes){const scene=scenes.find(scene=>scene.id===route.scene);assert.ok(scene.sourceText.passages.some(passage=>passage.lines.some(line=>actionLines.has(line))),scene.id+': 原文の派遣・侵攻・亡命・輸入などが示される行に基づく');assert.ok(route.points.length>=2&&route.reason.trim(),scene.id+': 出発と到着を示す根拠を保存する');}
const narrative=scenes.flatMap(scene=>scene.plainBody).join('');
for(const phrase of ['徴税請負制で地方有力者','イギリス製品の流入で','バルカン同盟','インド支配を確立したイギリス','国を切り売りするの','日露戦争の影響だよ'])assert.ok(narrative.includes(phrase),'紙面をまたぐ語り口調を保持: '+phrase);
for(const phrase of ['ギリシア正教徒の保護権','エジプト、スーダンの世襲権のみが承認','徴税請負制が復活','外債による財政破綻','二院制議会','露土戦争の勃発を口実に憲法を停止','非西洋的な改革','青年将校が革命の主導権を握る','サイイド＝アリー＝ムハンマドは反乱とは直接関係なかった','イギリスの黙認','1911年、ロシア軍の軍事介入によって議会が閉鎖'])assert.ok(narrative.includes(phrase),'原文の因果・主体・立場を保持: '+phrase);
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
assert.deepEqual(selection.lines.filter(line=>line.page===125&&line.kind==='cover-heading').map(line=>plainSource(line.text).replace(/^# /,'')),['第2章','列強の侵略とアジアの変革'],'125の章扉を全保持する');
const column=selection.lines.filter(line=>line.page===133&&line.kind==='supplement').map(line=>plainSource(line.text)).join('');
for(const phrase of ['エルトゥールル号','1890年','620名','500名以上','69名','比叡','金剛','ムスタファ＝ケマル'])assert.ok(column.includes(phrase),'133の独立コラムの全文を保持: '+phrase);
assert.ok(scenes.at(-1).plainBody.join('').includes('次回はインドと東南アジア')&&narrative.includes('最後に年号checkだよ'),'締めくくりと次回予告を保持');
const allTableRows=[];
for(const page of selection.pages){
 const expected=selection.lines.filter(line=>line.page===page&&line.kind==='table'&&!(line.text.includes('-')&&/^\|[\s|:-]*$/.test(line.text))).map(line=>line.text.trim().slice(1,-1).split('|').map(cell=>plainSource(cell).trim()));
 const actual=[...sourcePages[String(page)].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row=>[...row[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(cell=>plainDisplay(cell[1]).trim()));
 assert.deepEqual(actual,expected,'原書'+page+': 表の全行・国名の空欄・各列・順序を保持');allTableRows.push(...expected);
}
assert.ok(allTableRows.length>0,'衰退地図・第一次世界大戦直前・イラン地図の全表を保持する');
for(const text of ['<ruby style="ruby-position:under"><ruby style="ruby-position:over">縛<rt>48</rt></ruby><rt>シバ</rt></ruby>','<rt><span data-source-color="red" style="color:#e52715">レイコ</span>ク</rt>'])assert.ok(sourcePages['139'].includes(text),'139の二重ルビの親文字と上下の読みをそのまま保持');
assert.equal((sourcePages['139'].match(/ruby-position:under/g)??[]).length,2,'139の上下二重ルビ2箇所を保持する');
const expectedDiagramTitles=Object.values(modernDiagrams).map(diagram=>diagram.title);
assert.ok(expectedDiagramTitles.length>=15&&expectedDiagramTitles.length<=25&&expectedDiagramTitles.every(title=>title.startsWith('学習用の整理：')),'原文と区別できる学習用の説明図を作る');
const originalYears=new Set([...plainSource(allRaw).matchAll(/\b(1\d{3})\b/g)].map(match=>match[1]));
for(const diagram of Object.values(modernDiagrams))for(const match of JSON.stringify(diagram).matchAll(/\b(1\d{3})\b/g))assert.ok(originalYears.has(match[1]),diagram.title+': 原文にない年号を補わない');
const referencePages=new Set(),externalReferencePages=new Set(),diagramTitles=new Set();
for(const volume of modernSeries)for(const [index,scene] of modernEdition[volume.id].entries()) {
 const pages=modernReferencePages(scene,volume,index);
 assert.ok(pages.length>0&&pages.every(page=>selection.pages.includes(page)||page===95||page===107),scene.id+': 対象回と本文中で明記された公開済みの他回原書ページへ接続する');
 for(const page of pages.filter(page=>!selection.pages.includes(page))){assert.ok(scene.plainBody.join('').includes('P.'+page),scene.id+': 他回の参照は本文中の明記箇所だけに接続する');externalReferencePages.add(page);}
 for(const page of scene.sourceText.sourcePages)assert.ok(pages.includes(page),scene.id+': 本文の出典ページを補足で確認できる');
 pages.filter(page=>selection.pages.includes(page)).forEach(page=>referencePages.add(page));
 const diagram=modernDiagramFor(scene);if(diagram){diagramTitles.add(diagram.title);for(const page of String(diagram.page).split('・').map(Number))assert.ok(pages.includes(page),scene.id+': 説明図の原文ページを掲載する');}
}
assert.deepEqual([...referencePages].sort((a,b)=>a-b),selection.pages,'章扉・独立コラム・年号を含む原書15ページすべてへ到達する');
assert.deepEqual([...externalReferencePages].sort((a,b)=>a-b),[95,107],'本文で明記した既存第5回の2ページだけを参照できる');
assert.deepEqual([...diagramTitles].sort(),expectedDiagramTitles.toSorted(),'説明図すべてへ到達する');
assert.equal((await read('public/modern-c02-l07-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第7回: 3教材・${scenes.length}場面・${selection.paragraphs.length}段落・483行・原書15ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
