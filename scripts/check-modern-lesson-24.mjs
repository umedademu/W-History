import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule},{modernDiagrams,modernDiagramFor,modernReferencePages}]=await Promise.all([load('public/modern-c05-l24-edition.js'),load('public/modern-lesson-24-volumes.js'),load('public/modern-geography-24.js'),load('scripts/build-modern-lesson-24.mjs'),load('public/modern-story-support-24.js')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===24);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-24/'+name+'.json'))));
const originalSha256='380760ad9acb574a100fbd7ad3b8dbdc9067babb3d403958f82631a622df86d6';
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
const namesRecord = JSON.parse(await read('docs/modern-lesson-24/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-24/entity-audit.json'));
const decode = text => text.replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
const plainSource = text => decode(text.replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/g,'').replace(/<[^>]+>/g,'').replaceAll('**',''));
const plainDisplay = html => decode(html.replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/g,'').replace(/<[^>]+>/g,''));
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
const expectedLineKind=(text,page)=>{const t=plainSource(text);return !text.trim()?'blank':/^## \d+$/.test(text)?'page':text.startsWith('|')?'table':(text.startsWith('>')||t==='※数字は時代順')?(/^> 第[1-5]章/.test(t)?'chapter-navigation':'supplement'):page<=436&&/^# /.test(text)?'cover-heading':/^### [1-5] /.test(t)?'section-heading':/^#{1,6} /.test(text)?'subheading':'body';};
const kinds = new Set(['blank','page','cover-heading','body','subheading','table','supplement','running-header','section-heading','chapter-navigation','section-running-header','illustration-marker','callout-entry']);
for(const line of selection.lines) {
  assert(kinds.has(line.kind),line.line);
  assert.equal(line.kind,expectedLineKind(line.text,line.page),line.line+': 原文行の分類を独立に照合');
  assert(line.reason.length>0,`分類理由がない: ${line.line}`);
  assert(selection.pages.includes(line.page));
  if(line.kind==='blank')assert.equal(line.text.trim(),'','空行の分類');
  if(line.kind==='page')assert.equal(line.text,'## '+line.page,'ページ番号の分類');
  if(line.kind==='table')assert.ok(line.text.startsWith('|'),'図表行の分類');
  if(line.kind==='supplement'||line.kind==='chapter-navigation')assert.ok(line.text.startsWith('>')||/^[●※（]/.test(plainSource(line.text)),'吹き出し・独立コラム・年号の続き・補足・章案内の分類');
  if(line.kind==='callout-entry')assert.ok(plainSource(line.text).startsWith('●'),'独立説明欄の分類');
  if(line.kind==='body')assert.ok(line.text.trim()&&!/^[>#|]/.test(line.text),'通常本文へ見出し・表・補足を混ぜない');
}
assert.equal(selection.line_count,558,'原文の全558行');
assert.deepEqual(selection.pages,Array.from({length:18},(_,i)=>i+436));
assert.deepEqual(selection.section_start_pages,[437,441,447]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section-heading').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['戦後のインドと第三世界の形成','インドシナ戦争とベトナム戦争','戦後の東南アジア'],'原文の3節を同じ順で教材化する');
assert.equal(modernSeries.length,3);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,5);
  assert.equal(volume.lesson,24);
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
assert.equal(selection.paragraphs.length,64,'通常本文の全64段落');
assert.equal(selection.lines.filter(line=>line.kind==='body').length,75,'通常本文の全75行');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const paragraphOrder=selection.paragraphs.map(paragraph=>paragraph.id);
const sectionForLine=line=>Math.max(1,[25,134,350].filter(start=>start<=line).length);
const nameFamily=entry=>entry.family??entry.name;
function contextNames(scene,planned) {
  const contexts=scene.contextRegions??[];
  assert.deepEqual(contexts,planned.contextRegions??[],scene.id+': 文脈地域と読み分け表の根拠が一致する');
  assert.deepEqual(contexts,audit.find(entry=>entry.scene===scene.id).contextRegions??[],scene.id+': 名称監査にも同じ文脈地域を保存する');
  assert.equal(new Set(contexts.map(context=>context.name)).size,contexts.length,scene.id+': 同じ文脈地域を重複しない');
  const direct=modernNamesInText(scene.plainBody.join(''));
  return contexts.map(context=>{
    const evidence=paragraphs.get(context.paragraph),first=paragraphOrder.indexOf(planned.paragraphs[0]);
    assert.ok(evidence,scene.id+': 文脈地域の根拠段落が原文に存在する');
    assert.ok(planned.paragraphs.includes(context.paragraph)||paragraphOrder[first-1]===context.paragraph,scene.id+': 同じ親段落または直前段落に限り地域を引き継ぐ');
    assert.ok(evidence.lines.every(line=>sectionForLine(line)===scene.sourceText.part),scene.id+': 他節の地域を引き継がない');
    assert.ok(context.reason?.trim()&&context.lines.length>0,scene.id+': 文脈地域の原文行と理由を明記する');
    assert.equal(new Set(context.lines).size,context.lines.length,scene.id+': 根拠行を重複しない');
    assert.ok(context.lines.every(line=>evidence.lines.includes(line)&&byLine.get(line)?.kind==='body'),scene.id+': 根拠を通常本文の指定段落から取る');
    const entry=modernNameCatalog.find(entry=>entry.name===context.name&&entry.kind==='region');
    assert.ok(entry?.points.length,scene.id+': 文脈で補うのは地域代表の静的な参照点だけ');
    const original=plainSource(context.lines.map(line=>byLine.get(line).text).join(''));
    assert.ok(modernNamesInText(original).some(found=>found.kind==='region'&&nameFamily(found)===nameFamily(entry)),scene.id+': 指定した原文行に地域名が明示される');
    assert.ok(!direct.some(found=>nameFamily(found)===nameFamily(entry)),scene.id+': 本文に明示された地域と重ねない');
    return entry;
  });
}
const connections=[[46,62],[76,82],[96,112],[174,192],[254,270],[289,295],[310,326],[360,376],[421,437],[493,509],[523,529]];
assert.deepEqual(selection.cross_page_connections.map(connection=>connection.lines),connections,'通読した11か所の紙面接続の記録');
assert.deepEqual(selection.paragraphs.filter(paragraph=>paragraph.lines.length>1).map(paragraph=>paragraph.lines),connections,'11か所の紙面接続だけを同じ段落にする');
const bodyLines = selection.paragraphs.flatMap(paragraph=>paragraph.lines);
assert.deepEqual(bodyLines,selection.lines.filter(line=>line.kind === 'body').map(line=>line.line),'通常本文全行の掲載順');
for(const paragraph of selection.paragraphs) {
  assert.equal(paragraph.markdown,paragraph.lines.map(line=>byLine.get(line).text).join(''),'接続した原文の字句');
  assert.deepEqual(paragraph.sourcePages,[...new Set(paragraph.lines.map(line=>byLine.get(line).page))].sort((a,b)=>a-b));
}
assert.deepEqual(modernNameCatalog,namesRecord.names,'独立した原文固有名詞の記録との一致');
const allRaw = selection.lines.map(line=>line.text).concat(selection.paragraphs.map(paragraph=>paragraph.markdown)).join('');
for(const entry of modernNameCatalog) {
  assert((['東ドイツ','西ドイツ'].includes(entry.name)&&normalize(plainSource(allRaw)).includes('東西ドイツ'))||normalize(plainSource(allRaw)).includes(entry.key)||entry.family&&modernNameCatalog.some(original=>original.family===entry.family&&original.kind===entry.kind&&normalize(plainSource(allRaw)).includes(original.key)),`原文の本人・地域・施設と対応しない名称: ${entry.name}`);
  assert(['place','region','person','building','concept'].includes(entry.kind));
  if(entry.kind==='concept')assert.deepEqual(entry.points,[],'団体・王家・階層には所在地を補わない: '+entry.name);
  entry.points.forEach(mapPoints);
}
for(const name of ['ガンディー','インディラ＝ガンディー','ラジブ＝ガンディー','シャストリ','バジパイ','ヴァージペーイ','ベナジル＝ブット','ナセル','ネルー','ジンナー','アトリー','周恩来','ダライ＝ラマ14世','ティトー','スカルノ','スハルト','メガワティ','ユドヨノ','ホー＝チ＝ミン','バオダイ','ゴ＝ディン＝ジエム','グエン＝フー＝ト','グエン＝ヴァン＝リン','ジョンソン','ニクソン','スターリン','シアヌーク','シハヌーク','ロン＝ノル','ポル＝ポト','ヘン＝サムリン','ソン＝サン','ゴルバチョフ','フンセン','アウン＝サン','アウン＝サン＝スー＝チー','スー＝チー','ネ＝ウィン','ソウ＝マウン','ラーマン','リー＝クアンユー','マハティール','マルコス','コラソン＝アキノ','ベニグノ＝アキノ（父）','ベニグノ＝アキノ（子）','ラモス','ドゥテルテ','ホーク'])assert.ok(modernNamesInText(name).some(e=>e.kind==='person'),'本人名を識別 '+name);
for(const name of ['ホー＝チ＝ミン＝ルート','ホー＝チ＝ミン市','ソ連＝インド平和友好協力条約','米比相互防衛条約'])assert.ok(!modernNamesInText(name).some(e=>e.kind==='person'),'地名・援助経路・条約から本人の居所を補わない '+name);
for(const name of ['日本人','中国人','アメリカ人','イギリス人','ベトナム人','ウルドゥー語','ベンガル語','英語'])assert.ok(!modernNamesInText(name).some(e=>['place','region','person'].includes(e.kind)),'国籍と言語から所在地を補わない '+name);
for(const [name,families]of [['中ソ',['中国','ソ連']],['中印',['中国','インド']],['印パ',['インド','パキスタン']],['米中',['アメリカ','中国']],['米比',['アメリカ','フィリピン']],['中越',['中国','ベトナム']],['ANZUS',['アメリカ','オーストラリア','ニュージーランド']]])assert.deepEqual(modernNamesInText(name).filter(e=>e.kind==='region').map(e=>e.family).toSorted(),families.toSorted());
assert.notEqual(modernNamesInText('ベニグノ＝アキノ（父）').find(e=>e.kind==='person').family,modernNamesInText('ベニグノ＝アキノ（子）').find(e=>e.kind==='person').family,'父子は別人');
assert.equal(modernNamesInText('シアヌーク').find(e=>e.kind==='person').family,modernNamesInText('シハヌーク').find(e=>e.kind==='person').family,'同じ本人の別表記');
assert.deepEqual(Object.values(modernEdition).map(s=>s.length),[71,76,97]);
for(const [line,part]of [[5,1],[46,1],[62,1],[82,1],[112,1],[128,1],[174,2],[192,2],[270,2],[295,2],[326,2],[344,2],[346,2],[348,2],[356,3],[376,3],[437,3],[509,3],[529,3],[548,3]])assert.equal(scenes.find(s=>s.sourceText.passages.some(p=>p.lines.includes(line))).sourceText.part,part);
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
const meaningfulCuts=[
[64,'同盟','非同盟・中立外交を進め、','外交方針と具体的会談を分ける。'],
[70,'コロンボ','コロンボ会議を開き、','参加者と宣言を分ける。'],[70,'チベット','ネルー・周恩来会談が開かれ、','会談と五つの原則を分ける。'],
[76,'カイロ','アジア・アフリカ人民連帯会議が開かれ、','民間代表会議と二つの植民地主義への反対を分ける。'],
[174,'ベトミン','抗日ゲリラ闘争を展開すると、','戦時の運動と独立宣言を分ける。'],[174,'交渉','中部や南部をめぐる交渉は決裂、','交渉と軍事侵攻を分ける。'],
[196,'支援','北ベトナムへの支援を開始、','北への支援と南への援助を分ける。'],[200,'反撃','反撃のチャンスを狙っていたんだけど、','反撃の意図と敗北を分ける。'],
[202,'境界','南をベトナム国としたうえで、','暫定境界と予定の選挙を分ける。'],[206,'SEATO','北ベトナム包囲網をつくると、','条約機構と別政府の成立を分ける。'],[206,'共和国','ベトナム共和国を建て、','政府の成立と選挙拒否を分ける。'],
[254,'解放勢力','南ベトナム解放民族戦線が結成されて、','組織の成立と参加勢力を分ける。'],[254,'援助路','ホー＝チ＝ミン＝ルートを建設して解放勢力を支援し、','支援経路と南の戦闘を分ける。'],
[336,'カンボジア','ヘン＝サムリン政権を立てると、','ベトナムの侵攻と中国の侵攻を分ける。'],[346,'撤退','カンボジアから撤退したことで、','軍の撤退と国交正常化を分ける。'],
[356,'指導者','リーダーとして活躍し、','会議での役割と対外政策を分ける。'],[360,'統合','政策をとって国内を統合し、','国内統合と対外政策を分ける。'],
[388,'独立','ポルトガルから独立したんだけど、','独立と侵攻・併合を分ける。'],[419,'ロン','クーデタで権力を掌握し、','権力掌握と米軍侵攻を分ける。'],
[441,'内戦','内戦状態になったんだけど、','対立の状態と愛国戦線の勝利を分ける。'],[485,'独立','マラヤ連邦が独立し、','マラヤ独立と連邦の拡大を分ける。'],
[513,'内政','国内の支持は高かったけど、','国内政策と対外関係を分ける。'],[523,'条約','幅広く協力することを約束、','協力の約束と加盟拡大を分ける。'],[533,'12カ国','計12カ国だったけど、','当初の参加国と参加の拡大を分ける。']];
for(const {scene,passage,text} of passageRecords)if(passage.end<plainSource(paragraphs.get(passage.paragraph).markdown).length)assert.ok(/[。！!？?」）]$/.test(text.trimEnd())||meaningfulCuts.some(([line,topic,ending,reason])=>passage.lines[0]===line&&scenes.find(s=>s.id===scene).title.includes(topic)&&text.trimEnd().endsWith(ending)&&reason.trim()),scene+': 文・発話・出来事の意味の切れ目で分ける');
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
  for(const passage of scene.sourceText.passages)for(const line of passage.lines)assert.equal(scene.sourceText.part,sectionForLine(line),scene.id+': 柱ではなく実際の節見出しで本文を区分');
  assert.equal(scene.sourceText.chapter,5);
  assert.equal(scene.sourceText.lesson,24);
  scene.body.forEach((html,i)=>{
    checkHTML(html);
    const markdown = selectedMarkdown[i];
    assert.equal((html.match(/<strong\b/g)??[]).length,(markdown.match(/\*\*/g)??[]).length/2,'太字の範囲数');
    assert.equal((html.match(/<ruby\b/g)??[]).length,(markdown.match(/<ruby\b/g)??[]).length,'読み仮名の範囲数');
    assert.deepEqual([...html.matchAll(/<ruby\b[^>]*>([\s\S]*?)<\/ruby>/g)].map(match=>plainDisplay(match[0])),[...markdown.matchAll(/<ruby\b[^>]*>([\s\S]*?)<\/ruby>/g)].map(match=>plainSource(match[0])),'読み仮名の親文字');
    assert.deepEqual([...html.matchAll(/<rt\b[^>]*>([\s\S]*?)<\/rt>/g)].map(match=>decode(match[1])),[...markdown.matchAll(/<rt\b[^>]*>([\s\S]*?)<\/rt>/g)].map(match=>decode(match[1])),'印刷された読みの字句');
    assert.deepEqual([...html.matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),[...markdown.matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),'色・下線などの原書属性');
    boldCount+=(html.match(/<strong\b/g)??[]).length;rubyCount+=(html.match(/<ruby\b/g)??[]).length;
  });
  const contextual=contextNames(scene,planned);
  const names = [...modernNamesInText(scene.plainBody.join('')),...contextual];
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
// 移動は本文の出発・到着や輸入等を根拠として保存し、権利の獲得を旅行にしない。
const actionLines=new Set([29,38,44,64,66,70,74,76,84,88,90,96,174,196,200,202,206,254,287,308,310,328,334,336,346,356,360,380,382,388,419,421,439,463,479,485,487,493,511,513,519,531,533,535]);
for(const route of routes){
  const scene=scenes.find(scene=>scene.id===route.scene),planned=plan.find(page=>page.id===scene.id);
  assert.ok(scene.sourceText.passages.some(p=>p.lines.some(line=>actionLines.has(line))),scene.id+': 原文の移動・輸入・侵攻などを示す行を根拠とする');
  assert.ok(route.points.length>=2&&route.reason.trim(),scene.id+': 原文に明記された移動または静的な関係を示す');
  const first=paragraphOrder.indexOf(planned.paragraphs[0]);
  const evidence=[...planned.paragraphs,...(first>0&&sectionForLine(paragraphs.get(paragraphOrder[first-1]).lines[0])===scene.sourceText.part?[paragraphOrder[first-1]]:[])].map(id=>paragraphs.get(id).markdown).join('');
  assert.ok(Array.isArray(route.evidenceLines)&&route.evidenceLines.length&&new Set(route.evidenceLines).size===route.evidenceLines.length,scene.id+': 動線の根拠行を重複なく記録する');
  for(const line of route.evidenceLines)assert.ok(['body','table','callout-entry','supplement','illustration-marker'].includes(byLine.get(line)?.kind),scene.id+': 関係線の根拠は原文の本文・表・図内文字・説明欄に存在する '+line);
  const cited=route.evidenceLines.map(line=>byLine.get(line).text).join('');
  const mentioned=modernNamesInText(plainSource(evidence+cited)).filter(entry=>['place','region'].includes(entry.kind)).flatMap(entry=>entry.points);
  for(const point of route.points)assert.ok(mentioned.some(candidate=>Math.hypot(candidate[0]-point[0],candidate[1]-point[1])<.1),scene.id+': 出発・途中・到着を親段落・直前段落または明記した根拠行の地域・地点だけに限る');
}
const narrative=scenes.flatMap(scene=>scene.plainBody).join('');
for(const phrase of ['植民地経済から','非同盟主義','パンジャーブ系','独立を承認','75年のサイゴン陥落までを','地上軍を投入した','戦争を続けさせる','共産党（KOM）が','都市住民や知識人','アメリカに従属','東南アジア中立化を','最後に年号 check！'])assert.ok(narrative.includes(phrase),'語中の接続と語り '+phrase);
assert.deepEqual(Object.keys(sourcePages).map(Number),selection.pages);
for(const page of selection.pages) {
  const html = sourcePages[String(page)];checkHTML(html);
  const original = selection.lines.filter(line=>line.page === page).map(line=>line.text);
  const expected = original.filter(line=>!/^\|[\s|:-]*$/.test(line)).map(line=>line.replace(/^> ?/,'').replace(/^#{1,6} /,'').replace(/^- /,'').replaceAll('|','')).join('');
  const visible = text => decode(text.replace(/<[^>]*>/g,'').replaceAll('**','')).replace(/\s/g,'');
  assert.equal(visible(html),visible(expected),`原書${page}: 図表・補足を含む全字句`);
  assert.equal((html.match(/<rt\b[^>]*>/g)??[]).length,(original.join('').match(/<rt\b[^>]*>/g)??[]).length,'補助欄のルビ数');
  assert.equal((html.match(/<strong\b/g)??[]).length,(original.join('').match(/\*\*/g)??[]).length/2,'補助欄の太字数');
  assert.deepEqual([...html.matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),[...original.join('').matchAll(/(?:data-source-[a-z-]+|style)="[^"]*"/g)].map(match=>match[0]),'補助欄の全装飾属性');
  assert.equal(sourcePageMetadata[String(page)].sourceSha256,selection.source_sha256);
}
assert.deepEqual(selection.lines.filter(l=>l.kind==='cover-heading').map(l=>plainSource(l.text).replace(/^#{1,6} /,'')),['第24回 戦後のインド・東南アジア']);
assert.ok(scenes.some(s=>s.sourceText.passages.some(p=>p.lines.includes(537)))&&scenes.some(s=>s.sourceText.passages.some(p=>p.lines.includes(548))&&s.plainBody.join('').includes('中東問題')));
const mnemonicLines=selection.lines.filter(l=>l.page===453&&l.kind==='table'&&/［(?:1946|1954|1955|1965)］/.test(plainSource(l.text)));
assert.deepEqual(mnemonicLines.map(l=>l.line),[543,544,545,546],'四組の年号と語呂');
for(const phrase of ['核保有国','1957年に南北統一選挙','1969年に亡くなっている','ほぼ反共軍事同盟','ASEAN10','2023年','加盟することになった','首都をヤンゴンと改称した'])assert.ok(narrative.includes(phrase),'原文の評価・表記・時点を保持 '+phrase);
assert.ok(sourcePages[450].includes('※数字は時代順'),'図の注記を保持する');
for(const line of selection.lines.filter(l=>l.text.includes('data-source-marker="double-line"')||l.text.includes('data-source-line-style="dashed"')))assert.ok(sourcePages[line.page].includes(line.text.includes('dashed')?'data-source-line-style="dashed"':'data-source-marker="double-line"'),'二重線・点線を保持する');
assert.deepEqual(selection.blank_pages,[]);assert.ok(Object.values(sourcePageMetadata).every(meta=>!meta.blank));
const allTableRows=[];
for(const page of selection.pages){
 const expected=selection.lines.filter(line=>line.page===page&&line.kind==='table'&&!(line.text.includes('-')&&/^\|[\s|:-]*$/.test(line.text))).map(line=>line.text.trim().slice(1,-1).split('|').map(cell=>plainSource(cell).trim()));
 const actual=[...sourcePages[String(page)].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row=>[...row[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(cell=>plainDisplay(cell[1]).trim()));
 assert.deepEqual(actual,expected,'原書'+page+': 表の全行・国名の空欄・各列・順序を保持');allTableRows.push(...expected);
}
assert.ok(allTableRows.length>0,'独占・列強・地図・年号の全表を保持する');
const expectedDiagramTitles=Object.values(modernDiagrams).map(diagram=>diagram.title);
assert.ok(expectedDiagramTitles.length===64&&expectedDiagramTitles.every(title=>title.startsWith('学習用の整理：')),'原文と区別できる学習用の説明図を作る');
const originalYears=new Set([...plainSource(allRaw).matchAll(/\b([12]\d{3})\b/g)].map(match=>match[1]));
for(const diagram of Object.values(modernDiagrams))for(const match of JSON.stringify(diagram).matchAll(/\b([12]\d{3})\b/g))assert.ok(originalYears.has(match[1]),diagram.title+': 原文にない年号を補わない');
const referencePages=new Set(),externalReferencePages=new Set(),diagramTitles=new Set();
for(const volume of modernSeries)for(const [index,scene] of modernEdition[volume.id].entries()) {
 const pages=modernReferencePages(scene,volume,index);
 assert.ok(pages.length>0&&pages.every(page=>selection.pages.includes(page)||[404,405].includes(page)&&scene.plainBody.join('').includes('P.404〜405')),scene.id+': 本文に明記された既刊参照だけを追加する');
 for(const page of pages.filter(page=>!selection.pages.includes(page))){externalReferencePages.add(page);assert.ok([404,405].includes(page)&&scene.plainBody.join('').includes('P.404〜405'),scene.id+': 既刊参照の文字がこの場面に明記される');}
 for(const page of scene.sourceText.sourcePages)assert.ok(pages.includes(page),scene.id+': 本文の出典ページを補足で確認できる');
 pages.filter(page=>selection.pages.includes(page)).forEach(page=>referencePages.add(page));
 const diagram=modernDiagramFor(scene);if(diagram){diagramTitles.add(diagram.title);for(const page of String(diagram.page).split('・').map(Number))assert.ok(pages.includes(page),scene.id+': 説明図の原文ページを掲載する');}
}
assert.deepEqual([...referencePages].sort((a,b)=>a-b),selection.pages,'章扉・独立コラム・年号を含む原書18ページすべてへ到達する');
assert.deepEqual([...externalReferencePages].sort((a,b)=>a-b),[404,405],'本文に明記された回外の参照を作らないへ接続する');
assert.deepEqual([...diagramTitles].sort(),expectedDiagramTitles.toSorted(),'説明図すべてへ到達する');
assert.equal((await read('public/modern-c05-l24-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第24回: 3教材・${scenes.length}場面・${selection.paragraphs.length}段落・558行・原書18ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
