import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule},{modernDiagrams,modernDiagramFor,modernReferencePages}]=await Promise.all([load('public/modern-c05-l25-edition.js'),load('public/modern-lesson-25-volumes.js'),load('public/modern-geography-25.js'),load('scripts/build-modern-lesson-25.mjs'),load('public/modern-story-support-25.js')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===25);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-25/'+name+'.json'))));
const originalSha256='dcba7ea48ed198d223c1821c6c8d1574ec22402b5736fe865e0bba21c979c81a';
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
const namesRecord = JSON.parse(await read('docs/modern-lesson-25/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-25/entity-audit.json'));
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
const expectedLineKind=(text,page)=>{const t=plainSource(text);return !text.trim()?'blank':/^## \d+$/.test(text)?'page':text.startsWith('|')?'table':(text.startsWith('>')||t==='※数字は時代順')?(/^> 第[1-5]章/.test(t)?'chapter-navigation':'supplement'):page<=454&&/^# /.test(text)?'cover-heading':/^### [1-5] /.test(t)?'section-heading':/^#{1,6} /.test(text)?'subheading':'body';};
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
assert.equal(selection.line_count,718,'原文の全718行');
assert.deepEqual(selection.pages,Array.from({length:22},(_,i)=>i+454));
assert.deepEqual(selection.section_start_pages,[455,464,468]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section-heading').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['パレスチナ問題と中東戦争','戦後の西アジア（イラン・イラク）','戦後のアフリカ'],'原文の3節を同じ順で教材化する');
assert.equal(modernSeries.length,3);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,5);
  assert.equal(volume.lesson,25);
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
assert.equal(selection.paragraphs.length,85,'通常本文の全85段落');
assert.equal(selection.lines.filter(line=>line.kind==='body').length,99,'通常本文の全99行');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const paragraphOrder=selection.paragraphs.map(paragraph=>paragraph.id);
const sectionForLine=line=>Math.max(1,[26,338,470].filter(start=>start<=line).length);
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
const connections=[[40,56],[139,155],[169,175],[191,207],[252,268],[282,288],[298,316],[360,376],[440,456],[476,482],[598,614],[630,636],[650,666],[682,688]];
assert.deepEqual(selection.cross_page_connections.map(connection=>connection.lines),connections,'通読した14か所の紙面接続の記録');
assert.deepEqual(selection.paragraphs.filter(paragraph=>paragraph.lines.length>1).map(paragraph=>paragraph.lines),connections,'14か所の紙面接続だけを同じ段落にする');
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
for(const name of ['ナセル','ファルーク1世','ナギブ','カセム','アラファト','サダト','ベギン','ムバラク','ラビン','クリントン','モサッデグ','ファイサル2世','サダム＝フセイン','ホメイニ','ブッシュ（父）','ブッシュ（子）','ブレア','タラバーニー','ベン＝ベラ','ブーメジェン','エンクルマ','セク＝トゥーレ','カサヴブ','ルムンバ','モブツ','ハイレ＝セラシエ','マンデラ','ボタ','デクラーク','ムベキ'])assert.ok(modernNamesInText(name).some(e=>e.kind==='person'),name+': 原文の本人を識別する');
assert.notEqual(modernNamesInText('ブッシュ（父）').find(e=>e.kind==='person').family,modernNamesInText('ブッシュ（子）').find(e=>e.kind==='person').family,'ブッシュ父子を分ける');
assert.notEqual(modernNamesInText('フセイン（フセイン・マクマホン協定のフセイン）').find(e=>e.kind==='person').family,modernNamesInText('サダム＝フセイン').find(e=>e.kind==='person').family,'1915年の協定の人物とイラク大統領を分ける');
for(const name of ['ツチ族','フツ族','イボ族','ハウサ族','PLO','国連平和維持軍'])assert.ok(modernNamesInText(name).filter(e=>e.kind==='concept').every(e=>!e.points.length),'民族や集団の名称を都市として扱わない '+name);
assert.deepEqual(Object.values(modernEdition).map(s=>s.length),[144,48,107]);
for(const [line,part]of [[5,1],[40,1],[56,1],[298,1],[316,1],[324,1],[342,2],[360,2],[376,2],[440,2],[456,2],[460,2],[476,3],[482,3],[598,3],[614,3],[650,3],[666,3],[682,3],[688,3],[690,3],[708,3]])assert.equal(scenes.find(s=>s.sourceText.passages.some(p=>p.lines.includes(line))).sourceText.part,part);
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
const meaningfulCuts=[[32,"サイクス・ピコ協定","分割を密約し、","サイクス・ピコ協定の出来事・主体・制度を次の説明と分ける。"],[108,"1948年のイスラエル建国","イスラエルを建国すると、","1948年のイスラエル建国の出来事・主体・制度を次の説明と分ける。"],[165,"ナギブとナセルの対立","対立すると、","ナギブとナセルの対立の出来事・主体・制度を次の説明と分ける。"],[167,"ナセル・ネルー・スカルノの交流","積極的な中立外交へと向かい、","ナセル・ネルー・スカルノの交流の出来事・主体・制度を次の説明と分ける。"],[181,"1956年のイスラエル軍の奇襲","イスラエル軍がエジプトを奇襲し、","1956年のイスラエル軍の奇襲の出来事・主体・制度を次の説明と分ける。"],[183,"米ソ協調と国連の即時停戦決議","即時停戦を決議し、","米ソ協調と国連の即時停戦決議の出来事・主体・制度を次の説明と分ける。"],[209,"アイゼンハワー＝ドクトリン","ドクトリンを発表すると、","アイゼンハワー＝ドクトリンの出来事・主体・制度を次の説明と分ける。"],[209,"米軍のレバノン出兵","レバノンに出兵し、","米軍のレバノン出兵の出来事・主体・制度を次の説明と分ける。"],[246,"イラク空軍へのスパイとミグ21","ミグ21戦闘機を盗んだり、","イラク空軍へのスパイとミグ21の出来事・主体・制度を次の説明と分ける。"],[252,"1970年のナセルの急死","ナセルが急死すると、","1970年のナセルの急死の出来事・主体・制度を次の説明と分ける。"],[294,"1977年のサダトの訪問","意思を伝え、","1977年のサダトの訪問の出来事・主体・制度を次の説明と分ける。"],[294,"1979年の平和条約","平和条約に調印、","1979年の平和条約の出来事・主体・制度を次の説明と分ける。"],[294,"シナイ返還と1982年の撤退完了","軍の撤退完了は1982年）、","シナイ返還と1982年の撤退完了の出来事・主体・制度を次の説明と分ける。"],[296,"アラブ諸国・PLOの反発","エジプトと断交、","アラブ諸国・PLOの反発の出来事・主体・制度を次の説明と分ける。"],[320,"ソ連崩壊とノルウェーの仲介","秘密交渉が続けられ、","ソ連崩壊とノルウェーの仲介の出来事・主体・制度を次の説明と分ける。"],[352,"カセムの自由将校団とイラク革命","イギリス支配から脱却すると、","カセムの自由将校団とイラク革命の出来事・主体・制度を次の説明と分ける。"],[434,"フセインのクウェート領有の主張","主張し、","フセインのクウェート領有の主張の出来事・主体・制度を次の説明と分ける。"],[438,"パレスチナ問題へのすり替え","すり替えようとしたんだけど、","パレスチナ問題へのすり替えの出来事・主体・制度を次の説明と分ける。"],[438,"多国籍軍に参加した国々","多国籍軍に参加したけど、","多国籍軍に参加した国々の出来事・主体・制度を次の説明と分ける。"],[460,"大量破壊兵器と残留米軍","約16万人もの米軍がイラクに残ったし、","大量破壊兵器と残留米軍の出来事・主体・制度を次の説明と分ける。"],[476,"1951年のリビア独立","リビアが独立すると、","1951年のリビア独立の出来事・主体・制度を次の説明と分ける。"],[486,"ベン＝ベラのアラブ社会主義","目指したんだけど、","ベン＝ベラのアラブ社会主義の出来事・主体・制度を次の説明と分ける。"],[549,"エンクルマとパン＝アフリカニズム","パン＝アフリカニズム」が高揚したから、","エンクルマとパン＝アフリカニズムの出来事・主体・制度を次の説明と分ける。"],[555,"1963年のアディスアベバ首脳会議","OAU】が結成されると、","1963年のアディスアベバ首脳会議の出来事・主体・制度を次の説明と分ける。"],[557,"1991年の経済共同体","アフリカ経済共同体を創設し、","1991年の経済共同体の出来事・主体・制度を次の説明と分ける。"],[567,"東部の油田とビアフラ独立宣言","ビアフラ共和国として独立を宣言すると、","東部の油田とビアフラ独立宣言の出来事・主体・制度を次の説明と分ける。"],[573,"1963年の第1次動乱終結","第1次動乱）、","1963年の第1次動乱終結の出来事・主体・制度を次の説明と分ける。"],[573,"平和維持軍撤退後の再燃","第2次動乱）、","平和維持軍撤退後の再燃の出来事・主体・制度を次の説明と分ける。"],[598,"スーダンの独立と共同統治","独立していたんだけど、","スーダンの独立と共同統治の出来事・主体・制度を次の説明と分ける。"],[620,"1974年のカーネーション革命","植民地の独立を認めたから、","1974年のカーネーション革命の出来事・主体・制度を次の説明と分ける。"],[626,"南アフリカ連邦とアパルトヘイト","人種隔離政策）に対して、","南アフリカ連邦とアパルトヘイトの出来事・主体・制度を次の説明と分ける。"],[640,"国連制裁と資源収入","アパルトヘイトを続け、","国連制裁と資源収入の出来事・主体・制度を次の説明と分ける。"],[640,"北ローデシアとザンビア","ザンビア共和国として独立したんだけど、","北ローデシアとザンビアの出来事・主体・制度を次の説明と分ける。"],[644,"モザンビークの交通路と政権弱体化","白人政権が弱体化し、","モザンビークの交通路と政権弱体化の出来事・主体・制度を次の説明と分ける。"],[650,"1990年のナミビア独立","ナミビアの独立を認め、","1990年のナミビア独立の出来事・主体・制度を次の説明と分ける。"],[650,"ANC合法化とマンデラ釈放","マンデラも釈放し、","ANC合法化とマンデラ釈放の出来事・主体・制度を次の説明と分ける。"],[676,"1990年の内戦と1993年の和平","和平に合意したものの、","1990年の内戦と1993年の和平の出来事・主体・制度を次の説明と分ける。"],[682,"ソマリアの一党独裁と反政府勢力","政府を攻撃していたんだけど、","ソマリアの一党独裁と反政府勢力の出来事・主体・制度を次の説明と分ける。"],[682,"国連決議と多国籍軍の介入","多国籍軍が介入したんだけど、","国連決議と多国籍軍の介入の出来事・主体・制度を次の説明と分ける。"],[682,"暫定政権と隣国の介入","一時は泥沼化したけど、","暫定政権と隣国の介入の出来事・主体・制度を次の説明と分ける。"]];
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
  assert.equal(scene.sourceText.lesson,25);
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
const actionLines=new Set([32,36,40,108,139,169,177,181,183,187,209,211,224,230,232,252,272,274,276,294,298,320,322,342,348,350,352,360,430,434,436,438,440,458,460,476,484,551,557,567,571,573,598,620,640,644,650,676,682]);
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
for(const phrase of ['パレスチナ問題','ガザ地区を占領','レバノン暴動','インティファーダ','シーア派','リビアが独立すると','最後に年号 check！'])assert.ok(narrative.includes(phrase),'語中の接続と語り '+phrase);
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
assert.deepEqual(selection.lines.filter(l=>l.kind==='cover-heading').map(l=>plainSource(l.text).replace(/^#{1,6} /,'')),['第25回 戦後の 西アジア・アフリカ']);
assert.ok(scenes.some(s=>s.sourceText.passages.some(p=>p.lines.includes(690)))&&scenes.some(s=>s.sourceText.passages.some(p=>p.lines.includes(708))));
assert.ok(sourcePages[468].includes('クルド人')&&sourcePages[468].includes('タラバーニー'),'クルド人の独立コラムを全文保持する');
for(const l of selection.lines.filter(l=>l.text.includes('data-source-')))for(const attribute of l.text.match(/data-source-[a-z-]+="[^"]*"/g)??[])assert.ok(sourcePages[l.page].includes(attribute),'紙面の色・囲み・斜線・下線の属性を保持する');
assert.deepEqual(selection.blank_pages,[]);assert.ok(Object.values(sourcePageMetadata).every(meta=>!meta.blank));
const allTableRows=[];
for(const page of selection.pages){
 const expected=selection.lines.filter(line=>line.page===page&&line.kind==='table'&&!(line.text.includes('-')&&/^\|[\s|:-]*$/.test(line.text))).map(line=>line.text.trim().slice(1,-1).split('|').map(cell=>plainSource(cell).trim()));
 const actual=[...sourcePages[String(page)].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row=>[...row[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(cell=>plainDisplay(cell[1]).trim()));
 assert.deepEqual(actual,expected,'原書'+page+': 表の全行・国名の空欄・各列・順序を保持');allTableRows.push(...expected);
}
assert.ok(allTableRows.length>0,'独占・列強・地図・年号の全表を保持する');
const expectedDiagramTitles=Object.values(modernDiagrams).map(diagram=>diagram.title);
assert.ok(expectedDiagramTitles.length===85&&expectedDiagramTitles.every(title=>title.startsWith('学習用の整理：')),'原文と区別できる学習用の説明図を作る');
const originalYears=new Set([...plainSource(allRaw).matchAll(/\b([12]\d{3})\b/g)].map(match=>match[1]));
for(const diagram of Object.values(modernDiagrams))for(const match of JSON.stringify(diagram).matchAll(/\b([12]\d{3})\b/g))assert.ok(originalYears.has(match[1]),diagram.title+': 原文にない年号を補わない');
const referencePages=new Set(),externalReferencePages=new Set(),diagramTitles=new Set();
for(const volume of modernSeries)for(const [index,scene] of modernEdition[volume.id].entries()) {
 const pages=modernReferencePages(scene,volume,index);
 assert.ok(pages.length>0&&pages.every(page=>selection.pages.includes(page)),scene.id+': 本文に明記された既刊参照だけを追加する');
 for(const page of pages.filter(page=>!selection.pages.includes(page))){externalReferencePages.add(page);assert.ok([404,405].includes(page)&&scene.plainBody.join('').includes('P.404〜405'),scene.id+': 既刊参照の文字がこの場面に明記される');}
 for(const page of scene.sourceText.sourcePages)assert.ok(pages.includes(page),scene.id+': 本文の出典ページを補足で確認できる');
 pages.filter(page=>selection.pages.includes(page)).forEach(page=>referencePages.add(page));
 const diagram=modernDiagramFor(scene);if(diagram){diagramTitles.add(diagram.title);for(const page of String(diagram.page).split('・').map(Number))assert.ok(pages.includes(page),scene.id+': 説明図の原文ページを掲載する');}
}
assert.deepEqual([...referencePages].sort((a,b)=>a-b),selection.pages,'章扉・独立コラム・年号を含む原書22ページすべてへ到達する');
assert.deepEqual([...externalReferencePages].sort((a,b)=>a-b),[],'本文に明記された回外の参照を作らないへ接続する');
assert.deepEqual([...diagramTitles].sort(),expectedDiagramTitles.toSorted(),'説明図すべてへ到達する');
assert.equal((await read('public/modern-c05-l25-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第25回: 3教材・${scenes.length}場面・${selection.paragraphs.length}段落・718行・原書22ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
