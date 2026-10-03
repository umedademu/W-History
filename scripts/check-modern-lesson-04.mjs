import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule},{modernDiagrams,modernDiagramFor,modernReferencePages}]=await Promise.all([load('public/modern-c01-l04-edition.js'),load('public/modern-lesson-04-volumes.js'),load('public/modern-geography-04.js'),load('scripts/build-modern-lesson-04.mjs'),load('public/modern-story-support-04.js')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===4);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-04/'+name+'.json'))));
const originalSha256='5222e5c09e3975b68718e5e2046deb9788a09d032cee080b35d94ee0840b8fbd';
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
const namesRecord = JSON.parse(await read('docs/modern-lesson-04/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-04/entity-audit.json'));
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
const expectedLineKind=(text,page)=>!text?'blank':/^## \d+$/.test(text)?'page':text.startsWith('|')?'table':text.startsWith('>')?(/^> 第[1-5]章/.test(plainSource(text))?'chapter-navigation':'supplement'):text.startsWith('### ')&&/^### [1-6] /.test(plainSource(text))?'section-heading':/^### 第4回 /.test(plainSource(text))?'cover-heading':/^#{3,6} /.test(text)?'subheading':text.startsWith('<span')&&/^(?:第4回 イタリア・ドイツの統一|[1-6] (?:統一以前のイタリア|サルデーニャ王国の統一運動|イタリア王国の成立|統一以前のドイツ|普墺戦争と普仏戦争|統一後のドイツ))$/.test(plainSource(text))?'running-header':page===88?'supplement':'body';
const kinds = new Set(['blank','page','cover-heading','body','subheading','table','supplement','running-header','section-heading','chapter-navigation']);
for(const line of selection.lines) {
  assert(kinds.has(line.kind),line.line);
  assert.equal(line.kind,expectedLineKind(line.text,line.page),line.line+': 原文行の分類を独立に照合');
  assert(line.reason.length>0,`分類理由がない: ${line.line}`);
  assert(selection.pages.includes(line.page));
  if(line.kind==='blank')assert.equal(line.text,'','空行の分類');
  if(line.kind==='page')assert.equal(line.text,'## '+line.page,'ページ番号の分類');
  if(line.kind==='table')assert.ok(line.text.startsWith('|'),'図表行の分類');
  if(line.kind==='supplement'||line.kind==='chapter-navigation')assert.ok(line.text.startsWith('>')||line.page===88&&[512,514,516,518,520].includes(line.line),'吹き出し・独立コラム・補足・章案内の分類');
  if(line.kind==='body')assert.ok(line.text.trim()&&!/^[>#|]/.test(line.text),'通常本文へ見出し・表・補足を混ぜない');
}
assert.equal(selection.line_count,636,'原文の全636行');
assert.deepEqual(selection.pages,Array.from({length:21},(_,i)=>i+72));
assert.deepEqual(selection.section_start_pages,[73,75,77,80,83,89]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section-heading').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['統一以前のイタリア','サルデーニャ王国の統一運動','イタリア王国の成立','統一以前のドイツ','普墺戦争と普仏戦争','統一後のドイツ'],'原文の6節を同じ順に教材化する');
assert.equal(modernSeries.length,6);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3,4,5,6]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,1);
  assert.equal(volume.lesson,4);
  assert.deepEqual(volume.sections,[volume.id]);
}
assert.deepEqual(Object.keys(modernEdition),modernSeries.map(volume=>volume.id));
const scenes = Object.values(modernEdition).flat();
assert.equal(scenes.length,82,'通読して選んだ第4回の全82場面');
assert.deepEqual(Object.values(modernEdition).map(pages=>pages.length),[7,13,15,10,20,17],'通読して選んだ6節の場面数');


assert.deepEqual(scenes.map(scene=>scene.id),plan.map(page=>page.id),'通読した改ページ表との順序');
const byLine = new Map(selection.lines.map(line=>[line.line,line]));
const paragraphIds = scenes.flatMap(scene=>scene.sourceText.passages.map(passage=>passage.paragraph));
assert.deepEqual(paragraphIds.filter((id,index)=>id!==paragraphIds[index-1]),selection.paragraphs.map(paragraph=>paragraph.id),'分割した範囲をまとめた通常本文段落の欠落・重複・順序');
assert.equal(selection.paragraphs.length,63,'通常本文の全63段落');
assert.equal(selection.lines.filter(line=>line.kind==='body').length,75,'通常本文の全75行');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const connections=[[103,109],[123,139],[225,248],[264,270],[284,300],[371,389],[401,407],[433,449],[469,475],[538,556],[568,574],[586,602]];
assert.deepEqual(selection.cross_page_connections.map(connection=>connection.lines),connections,'通読した12か所の紙面接続の記録');
assert.deepEqual(selection.paragraphs.filter(paragraph=>paragraph.lines.length>1).map(paragraph=>paragraph.lines),connections,'12か所の紙面接続だけを同じ段落にする');
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
for(const word of ['鉄血政策','勢力均衡','社会主義者鎮圧法','社会保険制度','保護関税法','ユンカー'])assert.deepEqual(modernNamesInText(word),[],'制度や階層だけで所在地・人物を補わない: '+word);
for(const text of ['クルップ社','ジーメンス社'])assert.ok(!modernNamesInText(text).some(entry=>entry.kind==='person'),'会社名を勝手に個人として扱わない: '+text);
assert.ok(modernNamesInText('ナポレオン3世').some(entry=>entry.kind==='person'&&entry.name==='ナポレオン3世'),'第二帝政の本人を識別する');
assert.ok(!modernNamesInText('ナポレオン3世').some(entry=>entry.kind==='person'&&['ナポレオン1世','ナポレオン'].includes(entry.name)),'甥の名前の途中を叔父と取り違えない');
assert.ok(modernNamesInText('ヴィルヘルム1世').some(entry=>entry.kind==='person'&&entry.name==='ヴィルヘルム1世'),'初代ドイツ皇帝本人を識別する');
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
  assert.equal(scene.sourceText.lesson,4);
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
// 実際の移動・出兵・通信を述べる行だけを許可し、同盟・割譲・構想だけで移動を作らない。
const movementLines=new Set([119,123,139,153,159,187,189,213,250,371,389,391,397,469,475,528]);
for(const route of routes){const scene=scenes.find(scene=>scene.id===route.scene);assert.ok(scene.sourceText.passages.some(passage=>passage.lines.some(line=>movementLines.has(line))),scene.id+': 移動・出兵・通信の原文行がある');}
// 原文を通読して選んだ、改ページを挟む接続と意味上の要点。
const narrative=scenes.flatMap(scene=>scene.plainBody).join('');
for(const phrase of ['ウィーン体制下では','気合い入りすぎ','ドイツの統一を望んでいなかった','経済の主導権はプロイセン','プロイセンから戦争を仕掛ける','ドイツ人が住んでいて','これ全部「次にフランス','このハンガリーとの妥協','変えて発表した……','いえないね。','皇帝狙撃事件を口実に','仲良くするっていう'])assert.ok(narrative.includes(phrase),'紙面の接続を保持: '+phrase);
for(const phrase of ['王政にするか、共和政にするか','ヴェネツィアはオーストリア領のまま','テアーノ','住民投票','制限選挙','農民にも土地は分配されない','未回収のイタリア','ヴァチカンの囚人','大ドイツ主義','小ドイツ主義','オーストリアは','ウィーンは占領しなかった','ベーメンもオーストリアに返した','マジャール人にだけ自治権','レオポルトは王位を辞退','ヴェルサイユ宮殿','50億フラン','25歳以上の男性普通選挙','責任内閣制も認められない','社会保険制度','鉄と穀物の同盟','なるべく領土拡大はしない'])assert.ok(narrative.includes(phrase),'混同しやすい原文の意味を保持: '+phrase);
for(const line of [528,530])assert.ok(scenes.filter(scene=>scene.sourceText.passages.some(passage=>passage.lines.includes(line))).every(scene=>scene.sourceText.part===5),'89ページの帝国成立・講和は第5節の続き');
assert.ok(scenes.filter(scene=>scene.sourceText.passages.some(passage=>passage.lines.includes(536))).every(scene=>scene.sourceText.part===6),'89ページの統一後の政治から第6節を始める');
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
const japan=plainDisplay(sourcePages['88']);
for(const phrase of ['近現代日本へのアプローチ','近代国家の建設','幕藩体制','岩倉具視','大久保利通','伊藤博文','福沢諭吉','中江兆民','大日本帝国憲法','大隈重信'])assert.ok(japan.includes(phrase),'原書88の独立日本史欄を保持: '+phrase);
assert.deepEqual(selection.lines.filter(line=>line.page===88&&line.kind==='supplement').map(line=>line.line),[512,514,516,518,520],'原書88の5段落を独立コラムとして分類する');
assert.equal(selection.lines.filter(line=>line.page===88&&line.kind==='body').length,0,'日本史の独立欄を通常本文に混ぜない');
assert.ok(plainDisplay(sourcePages['76']).includes('1813年、ちょうどワーテルローの戦いの年だ。'),'原書のヴェルディ出生年の説明を校訂しない');
assert.ok(plainDisplay(sourcePages['85']).includes('22カ国（3自由市を含む）')&&plainDisplay(sourcePages['85']).includes('22君主国の連合体'),'原書の本文・表の異なる字句をそれぞれ保持する');
assert.ok(sourcePages['92'].includes('<ruby><ruby style="ruby-position:under">奴<rt>')&&sourcePages['92'].includes('</rt></ruby><rt>8</rt></ruby>'),'92ページの二重ルビは下のヤツと上の8を構造ごと保持する');
assert.ok(scenes.at(-1).plainBody.join('').includes('次回はロシア')&&scenes.at(-1).plainBody.join('').includes('頑張っていこう〜。'),'次回案内・締めくくりを省略しない');
const expectedDiagramTitles=Object.values(modernDiagrams).map(diagram=>diagram.title);
assert.ok(expectedDiagramTitles.some(title=>/ドイツ|統一/.test(title)),'統一の過程・比較を図示する');
const referencePages=new Set(),diagramTitles=new Set();
for(const volume of modernSeries)for(const [index,scene] of modernEdition[volume.id].entries()) {
 const pages=modernReferencePages(scene,volume,index);
 assert.ok(pages.length>0&&pages.every(page=>selection.pages.includes(page)),scene.id+': 対象回の原書ページへ接続する');
 for(const page of scene.sourceText.sourcePages)assert.ok(pages.includes(page),scene.id+': 本文の出典ページを補足で確認できる');
 pages.forEach(page=>referencePages.add(page));
 const diagram=modernDiagramFor(scene);if(diagram){diagramTitles.add(diagram.title);for(const page of String(diagram.page).split('・').map(Number))assert.ok(pages.includes(page),scene.id+': 説明図の原文ページを掲載する');}
}
assert.deepEqual([...referencePages].sort((a,b)=>a-b),selection.pages,'原書21ページすべてへ到達する');
assert.deepEqual([...diagramTitles].sort(),expectedDiagramTitles.toSorted(),'説明図すべてへ到達する');
assert.equal((await read('public/modern-c01-l04-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第4回: 6教材・${scenes.length}場面・${selection.paragraphs.length}段落・636行・原書21ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
