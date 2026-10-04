import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule},{modernDiagrams,modernDiagramFor,modernReferencePages}]=await Promise.all([load('public/modern-c05-l22-edition.js'),load('public/modern-lesson-22-volumes.js'),load('public/modern-geography-22.js'),load('scripts/build-modern-lesson-22.mjs'),load('public/modern-story-support-22.js')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===22);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-22/'+name+'.json'))));
const originalSha256='0da50964243b348d8aecd1dfb23f01d40d96f6ac7980d0ebf0d6f410017bd305';
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
const namesRecord = JSON.parse(await read('docs/modern-lesson-22/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-22/entity-audit.json'));
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
const expectedLineKind=(text,page)=>{const t=plainSource(text);return !text.trim()?'blank':/^## \d+$/.test(text)?'page':text.startsWith('|')?'table':text.startsWith('>')?(/^> 第[1-5]章/.test(t)?'chapter-navigation':'supplement'):page<=403&&/^# /.test(text)?'cover-heading':/^### [1-5] /.test(t)?'section-heading':/^#{1,6} /.test(text)?'subheading':'body';};
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
assert.equal(selection.line_count,616,'原文の全616行');
assert.deepEqual(selection.pages,Array.from({length:21},(_,i)=>i+403));
assert.deepEqual(selection.section_start_pages,[404,407,411,417]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section-heading').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['アメリカ合衆国の地位低下','デタント（緊張緩和）の進行と世界の多極化','米ソの行き詰まりと「新冷戦」','冷戦の終結とソ連の崩壊'],'原文の5節を同じ順で教材化する');
assert.equal(modernSeries.length,4);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3,4]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,5);
  assert.equal(volume.lesson,22);
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
assert.equal(selection.paragraphs.length,71,'通常本文の全71段落');
assert.equal(selection.lines.filter(line=>line.kind==='body').length,83,'通常本文の全83行');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const paragraphOrder=selection.paragraphs.map(paragraph=>paragraph.id);
const sectionForLine=line=>Math.max(1,[35,144,243,394].filter(start=>start<=line).length);
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
const connections=[[54,62],[122,128],[150,166],[178,184],[200,218],[258,274],[288,294],[344,352],[364,382],[423,439],[449,480],[544,562]];
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
  assert(normalize(plainSource(allRaw)).includes(entry.key)||entry.family&&modernNameCatalog.some(original=>original.family===entry.family&&original.kind===entry.kind&&normalize(plainSource(allRaw)).includes(original.key)),`原文の本人・地域・施設と対応しない名称: ${entry.name}`);
  assert(['place','region','person','building','concept'].includes(entry.kind));
  if(entry.kind==='concept')assert.deepEqual(entry.points,[],'団体・王家・階層には所在地を補わない: '+entry.name);
  entry.points.forEach(mapPoints);
}
for(const name of ["ニクソン","キッシンジャー","田中角栄","ラッセル","ブラント","シュミット","キャラハン","ミッテラン","ジスカールデスタン","フォード","カーター","アジェンデ","ピノチェト","ホメイニ","パフレヴィー2世","ソモサ","レーガン","サッチャー","ガルチェリ","アンドロポフ","チェルネンコ","ゴルバチョフ","エリツィン","鄧小平","ワレサ","ホネカー","コール","フサーク","ハヴェル","ブッシュ（父）","ヤナーエフ","中曽根康弘","細川護熙","村山富市","小泉純一郎","鳩山由紀夫","ブッシュ","小泉首相","ジョンソン","ブレジネフ","アインシュタイン","ド＝ゴール","ウィルソン","ドプチェク","チャウシェスク","サハロフ"])assert.ok(modernNamesInText(name).some(e=>e.kind==='person'),'原文の本人を識別 '+name);
for(const name of ['ニクソン＝ドクトリン','ニクソン＝ショック','レーガノミクス','反ゴルバチョフ＝クーデタ','ペレストロイカ','連帯'])assert.ok(!modernNamesInText(name).some(e=>e.kind==='person'),'制度と事件から本人や居所を補わない '+name);
for(const name of ['日本人','中国人','アメリカ人','イギリス人','フランス人','ドイツ人','ポーランド人','日本語','英語','8月8日'])assert.ok(!modernNamesInText(name).some(e=>['place','region','person'].includes(e.kind)),'民族・国籍・言語・日付から所在地を補わない '+name);
for(const [name,families]of [['米英仏ソ',['アメリカ','イギリス','フランス','ロシア']],['米ソ',['アメリカ','ロシア']],['米中',['アメリカ','中国']],['日中',['日本','中国']],['中ソ',['中国','ロシア']],['独仏',['ドイツ','フランス']]])assert.deepEqual(modernNamesInText(name).filter(e=>e.kind==='region').map(e=>e.family).toSorted(),families.toSorted(),'国の組み合わせ '+name);
assert.equal(modernNameCatalog.find(e=>e.name==='カナダ').kind,'region','カナダは国で都市ではない');assert.equal(modernNameCatalog.find(e=>e.name==='オーデル＝ナイセ線').geographicType,'border-reference','河川に沿う国境線を都市や川そのものにしない');
assert.deepEqual(Object.values(modernEdition).map(s=>s.length),[47,43,73,69],'原文を通読した4教材232場面');
for(const [line,part]of [[5,1],[27,1],[29,1],[54,1],[62,1],[128,1],[132,1],[142,1],[148,2],[166,2],[184,2],[218,2],[224,2],[256,3],[274,3],[294,3],[352,3],[382,3],[388,3],[423,4],[439,4],[441,4],[480,4],[562,4],[577,4],[591,4],[598,4],[600,4],[602,4],[604,4],[606,4]])assert.equal(scenes.find(s=>s.sourceText.passages.some(p=>p.lines.includes(line))).sourceText.part,part,'実際の節見出しで所属させる '+line);
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
const meaningfulCuts=[[52,"不出馬","発表、","前任大統領の不出馬と後任の登場を分ける。"],[64,"輸出の減少","悪化、","貿易収支を悪化させた原因と1971年の赤字転落を分ける。"],[80,"兌換停止","ニクソン＝ショック）、","政策の発表とドル切り下げの目的を分ける。"],[114,"選手団","招かれ、","選手団への招待と大統領への極秘メッセージを分ける。"],[118,"田中","訪問、","実際の首相訪問と共同声明・正常化の結果を分ける。"],[168,"条約への反発","なっちゃったんだ","原文の条約評価とイスラエルについての括弧内の補足を分ける。"],[172,"ブレジネフ訪米","向かい、","二つの実際の訪問と次の交渉・欧州への影響を分ける。"],[194,"交流と人権","約束した","宣言の内容と括弧内の1995年の後年比較を分ける。"],[196,"西ドイツと英国","キャラハン［任1976〜79］）、","二カ国の政権の列挙とフランスの後年の政権を分ける。"],[224,"六カ国","G8だ）で、","会議の構成国とその後の継続を分ける。"],[284,"イラン革命","追い込まれ、","国王の亡命と新体制・人質事件・救出失敗を分ける。"],[298,"軍事費の拡大","発表し、","軍事費の発表と戦略防衛構想の計画を分ける。"],[304,"グレナダ","倒したり、","実際のグレナダ侵攻とニカラグアへの支援を分ける。"],[354,"諸島の占領","占領すると、","アルゼンチン軍の占領と英国の派遣を分ける。"],[386,"原発事故","原子力発電所事故だ","事故と括弧内の後年の日本との比較を分ける。"],[486,"国内の民主化要求","高まり、","改革への批判と1990年の制度導入を分ける。"],[534,"政府の対立","起こり、","ソ連政府と共和国政府の対立と保守派の巻き返しを分ける。"],[540,"新連邦条約の提案","提案すると、","市場経済・新連邦条約の提案とクーデタの決行を分ける。"],[542,"病気という発表","流れ、","テレビでの病気という発表と非常事態宣言を分ける。"],[600,"金融緩和","したんだけど、","円高不況への金融緩和と投機・バブルの結果を分ける。"]];
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
  assert.equal(scene.sourceText.lesson,22);
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
const actionLines=new Set([114,116,118,122,132,168,170,172,178,220,224,276,282,284,286,288,304,306,322,324,354,356,362,388,423,441,445,447,534,536,544,600]);
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
for(const phrase of ['アメリカ','戦争終結','使っていたけど','強くなるのを','と反発','この考え方','ハンマー','どうせソ連','ドプチェク','エリツィン','最後に年号 check！'])assert.ok(narrative.includes(phrase),'語りと語中の接続を保持 '+phrase);
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
assert.deepEqual(selection.lines.filter(l=>l.kind==='cover-heading').map(l=>plainSource(l.text).replace(/^#{1,6} /,'')),['第22回 冷戦の展開③（1970〜1991）'],'表紙を保持する');
assert.ok(scenes.some(scene=>scene.sourceText.passages.some(p=>p.lines.includes(577))&&scene.plainBody.join('').includes('年号 check！'))&&scenes.some(scene=>scene.sourceText.passages.some(p=>p.lines.includes(591))&&scene.plainBody.join('').includes('アジア・アフリカ')),'年号と次回予告を保持する');
const mnemonicLines=selection.lines.filter(l=>l.page===422&&l.kind==='table'&&/［(?:1971|1973|1979|1985|1989|1990|1991)］/.test(plainSource(l.text)));
assert.deepEqual(mnemonicLines.map(l=>l.line),[583,584,585,586,587,588,589],'7組の年号の語呂を保持する');
for(const name of ['ドル','石油危機','アフガニスタン','ゴルバチョフ','冷戦','ドイツ','ソ連'])assert.ok(plainDisplay(sourcePages[422]).includes(name),'年号表を全文で保持 '+name);
for(const name of ['狂乱物価','中曽根康弘','JR','NTT','内需拡大','細川護熙','村山富市','小泉純一郎','鳩山由紀夫','2011年','2012年'])assert.ok(plainDisplay(sourcePages[423]).includes(name),'日本史補足を全文で保持 '+name);
assert.deepEqual(selection.lines.filter(l=>l.page===423&&l.kind==='body').map(l=>l.line),[598,600,602,604,606],'日本史5段落を通常本文にも保持');
assert.deepEqual(selection.blank_pages,[],'21頁すべてに掲載内容がある');assert.ok(Object.values(sourcePageMetadata).every(meta=>!meta.blank),'本文があるページを白紙にしない');
for(const line of [138,189,190])assert.ok(byLine.get(line).text.includes('data-source-marker="double-line"')&&sourcePages[byLine.get(line).page].includes('data-source-marker="double-line"'),'原書の二重線を保持 '+line);
for(const phrase of ['AMB','核保有国にはなんの制限もない','ユーロコミュニズム','1990年8月','2011年'])assert.ok(narrative.includes(phrase),'原文の表記や評価は校訂しない '+phrase);
const allTableRows=[];
for(const page of selection.pages){
 const expected=selection.lines.filter(line=>line.page===page&&line.kind==='table'&&!(line.text.includes('-')&&/^\|[\s|:-]*$/.test(line.text))).map(line=>line.text.trim().slice(1,-1).split('|').map(cell=>plainSource(cell).trim()));
 const actual=[...sourcePages[String(page)].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row=>[...row[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(cell=>plainDisplay(cell[1]).trim()));
 assert.deepEqual(actual,expected,'原書'+page+': 表の全行・国名の空欄・各列・順序を保持');allTableRows.push(...expected);
}
assert.ok(allTableRows.length>0,'独占・列強・地図・年号の全表を保持する');
const expectedDiagramTitles=Object.values(modernDiagrams).map(diagram=>diagram.title);
assert.ok(expectedDiagramTitles.length===71&&expectedDiagramTitles.every(title=>title.startsWith('学習用の整理：')),'原文と区別できる学習用の説明図を作る');
const originalYears=new Set([...plainSource(allRaw).matchAll(/\b([12]\d{3})\b/g)].map(match=>match[1]));
for(const diagram of Object.values(modernDiagrams))for(const match of JSON.stringify(diagram).matchAll(/\b([12]\d{3})\b/g))assert.ok(originalYears.has(match[1]),diagram.title+': 原文にない年号を補わない');
const referencePages=new Set(),externalReferencePages=new Set(),diagramTitles=new Set();
for(const volume of modernSeries)for(const [index,scene] of modernEdition[volume.id].entries()) {
 const pages=modernReferencePages(scene,volume,index);
 assert.ok(pages.length>0&&pages.every(page=>selection.pages.includes(page)),scene.id+': 本文に明記された既刊参照だけを追加する');
 for(const page of pages.filter(page=>!selection.pages.includes(page))){externalReferencePages.add(page);assert.ok(page===47&&scene.plainBody.join('').includes('P.47')||[50,51].includes(page)&&scene.plainBody.join('').includes('P.50〜51'),scene.id+': 既刊参照の文字がこの場面に明記される');}
 for(const page of scene.sourceText.sourcePages)assert.ok(pages.includes(page),scene.id+': 本文の出典ページを補足で確認できる');
 pages.filter(page=>selection.pages.includes(page)).forEach(page=>referencePages.add(page));
 const diagram=modernDiagramFor(scene);if(diagram){diagramTitles.add(diagram.title);for(const page of String(diagram.page).split('・').map(Number))assert.ok(pages.includes(page),scene.id+': 説明図の原文ページを掲載する');}
}
assert.deepEqual([...referencePages].sort((a,b)=>a-b),selection.pages,'章扉・独立コラム・年号を含む原書21ページすべてへ到達する');
assert.deepEqual([...externalReferencePages].sort((a,b)=>a-b),[],'本文に明記された回外の参照を作らないへ接続する');
assert.deepEqual([...diagramTitles].sort(),expectedDiagramTitles.toSorted(),'説明図すべてへ到達する');
assert.equal((await read('public/modern-c05-l22-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第22回: 4教材・${scenes.length}場面・${selection.paragraphs.length}段落・616行・原書21ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
