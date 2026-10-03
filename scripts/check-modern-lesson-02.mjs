import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,name)).href);
const [{modernEdition,modernPlaces,sourcePages,sourcePageMetadata},{modernSeries:lessonSeries},{modernNameCatalog,modernNamesInText},{renderModernModule}]=await Promise.all([load('public/modern-c01-l02-edition.js'),load('public/modern-lesson-02-volumes.js'),load('public/modern-geography-02.js'),load('scripts/build-modern-lesson-02.mjs')]);
const modernSeries=lessonSeries.filter(volume=>volume.lesson===2);
const read = name => fs.readFile(path.join(root,name),'utf8');
const [selection,plan,routes]=await Promise.all(['source-selection','reading-plan','routes'].map(async name=>JSON.parse(await read('docs/modern-lesson-02/'+name+'.json'))));
const originalSha256='146b4662b580b1e418a0372071d1cb058d328086d671f0af9918d192c08f7d95';
assert.equal(selection.source_sha256,originalSha256,'検査開始前に固定した参照専用原文の印');
let sourcePresent=false;
if(!process.argv.includes('--published')) {
 const raw=await fs.readFile(path.join(root,selection.source_file));
 assert.equal(createHash('sha256').update(raw).digest('hex'),originalSha256,'原文を変更しない');
 assert.equal(raw.length,selection.source_bytes,'原文の全容量');
 const lines=raw.toString('utf8').replace(/^\uFEFF/,'').replaceAll('\r\n','\n').split('\n');if(lines.at(-1)==='')lines.pop();
 assert.deepEqual(lines,selection.lines.map(line=>line.text),'記録した全行が原文と一致する');sourcePresent=true;
}
const namesRecord = JSON.parse(await read('docs/modern-lesson-02/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-02/entity-audit.json'));
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
const kinds = new Set(['blank','page','cover','section','heading','supplement','diagram','running-heading','body']);
for(const line of selection.lines) {
  assert(kinds.has(line.kind),line.line);
  assert(line.reason.length>0,`分類理由がない: ${line.line}`);
  assert(selection.pages.includes(line.page));
}
assert.equal(selection.line_count,408,'原文の全408行');
assert.deepEqual(selection.pages,Array.from({length:14},(_,i)=>i+41));
assert.deepEqual(selection.section_start_pages,[42,47,51]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernSeries.map(volume=>volume.label),['イギリスの自由主義改革','アイルランド問題','フランスの第二帝政'],'原文の3節を同じ順に教材化する');
assert.equal(modernSeries.length,3);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,1);
  assert.equal(volume.lesson,2);
  assert.deepEqual(volume.sections,[volume.id]);
}
assert.deepEqual(Object.keys(modernEdition),modernSeries.map(volume=>volume.id));
const scenes = Object.values(modernEdition).flat();
assert.ok(scenes.length>=30,'本文を読みやすく分割した全場面');
assert.ok(Object.values(modernEdition).every(pages=>pages.length>0),'全3節に本文がある');
assert.deepEqual(scenes.map(scene=>scene.id),plan.map(page=>page.id),'通読した改ページ表との順序');
const byLine = new Map(selection.lines.map(line=>[line.line,line]));
const paragraphIds = scenes.flatMap(scene=>scene.sourceText.passages.map(passage=>passage.paragraph));
assert.deepEqual(paragraphIds,selection.paragraphs.map(paragraph=>paragraph.id),'通常本文段落の欠落・重複・順序');
const paragraphs = new Map(selection.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
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
for(const word of ['地主','産業資本家','労働者','普仏戦争','ボナパルティズム','人民憲章','チャーティスト運動']) assert.deepEqual(modernNamesInText(word),[],`階層・制度・事件名だけでは現地や人物を生成しない: ${word}`);
assert.ok(modernNamesInText('セーヌ県知事のオスマン').some(entry=>entry.kind==='person'),'知事本人のオスマン');
assert.ok(!modernNamesInText('オスマン帝国').some(entry=>entry.kind==='person'),'帝国名を知事本人へ取り違えない');
let boldCount=0,rubyCount=0;
for(const [index,scene] of scenes.entries()) {
  const planned = plan[index];
  const chosen = planned.paragraphs.map(id=>paragraphs.get(id));
  assert.deepEqual(scene.plainBody,chosen.map(paragraph=>plainSource(paragraph.markdown)),`${scene.id}: 原文全文`);
  assert.deepEqual(scene.body.map(plainDisplay),scene.plainBody,`${scene.id}: 実際の表示本文`);
  assert.deepEqual(scene.sourceText.sourcePages,[...new Set(chosen.flatMap(paragraph=>paragraph.sourcePages))].sort((a,b)=>a-b));
  assert.equal(scene.sourceText.book,'modern');
  assert.equal(scene.sourceText.part,planned.part);
  assert.equal(scene.sourceText.chapter,1);
  assert.equal(scene.sourceText.lesson,2);
  scene.body.forEach((html,i)=>{
    checkHTML(html);
    const markdown = chosen[i].markdown;
    assert.equal((html.match(/<strong\b/g)??[]).length,(markdown.match(/\*\*/g)??[]).length/2,'太字の範囲数');
    assert.equal((html.match(/<ruby>/g)??[]).length,(markdown.match(/<ruby>/g)??[]).length,'読み仮名の範囲数');
    assert.deepEqual([...html.matchAll(/<ruby>([\s\S]*?)<\/ruby>/g)].map(match=>plainDisplay(match[0])),[...markdown.matchAll(/<ruby>([\s\S]*?)<\/ruby>/g)].map(match=>plainSource(match[0])),'読み仮名の親文字');
    assert.deepEqual([...html.matchAll(/<rt>([\s\S]*?)<\/rt>/g)].map(match=>decode(match[1])),[...markdown.matchAll(/<rt>([\s\S]*?)<\/rt>/g)].map(match=>decode(match[1])),'印刷された読みの字句');
    assert.deepEqual([...html.matchAll(/data-source-[a-z-]+="[^"]*"/g)].map(match=>match[0]),[...markdown.matchAll(/data-source-[a-z-]+="[^"]*"/g)].map(match=>match[0]),'色・下線などの原書属性');
    boldCount+=(html.match(/<strong\b/g)??[]).length;rubyCount+=(html.match(/<ruby>/g)??[]).length;
  });
  const names = modernNamesInText(scene.plainBody.join(''));
  assert.deepEqual(names.map(entry=>entry.key),audit.find(entry=>entry.scene === scene.id).names,'固定した場面別名称の記録');
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
// 原文を通読して選んだ、改ページを挟む接続と意味上の要点。
const narrative=scenes.flatMap(scene=>scene.plainBody).join('');
for(const phrase of [
'自分たちが機械を使って大量につくった','中産階級に選挙権を与えたよ。','人民憲章【ピープルズ＝チャーター】','教育法を制定して公立学校を増やしたり','宗教差別の撤廃は2段階','50年代には小作人同盟による小作人救済運動','国政を左右する大勢力にはなっていない','イギリスと敵対しないようにした','ナポレオン3世は人気を回復するために'
])assert.ok(narrative.includes(phrase),'改ページ前後を正しく接続: '+phrase);
assert.ok(narrative.includes('都市労働者に選挙権を拡大')&&narrative.includes('農業・鉱山労働者には選挙権はない'),'第2回改正の対象を区別する');
assert.ok(narrative.includes('第一次世界大戦が始まったから実施は延期'),'成立と実施を区別する');
assert.ok(narrative.includes('北部のアルスター地方はイギリス領のまま'),'南北の帰属を区別する');
assert.ok(narrative.includes('ナポレオン3世自身が捕虜となって退位'),'第3世本人の敗北');
assert.deepEqual(Object.keys(sourcePages).map(Number),selection.pages);
for(const page of selection.pages) {
  const html = sourcePages[String(page)];checkHTML(html);
  const original = selection.lines.filter(line=>line.page === page).map(line=>line.text);
  const expected = original.filter(line=>!/^\|[\s|:-]*$/.test(line)).map(line=>line.replace(/^> ?/,'').replace(/^#{1,6} /,'').replace(/^- /,'').replaceAll('|','')).join('');
  const visible = text => decode(text.replace(/<[^>]*>/g,'').replaceAll('**','')).replace(/\s/g,'');
  assert.equal(visible(html),visible(expected),`原書${page}: 図表・補足を含む全字句`);
  assert.equal((html.match(/<rt>/g)??[]).length,(original.join('').match(/<rt>/g)??[]).length,'補助欄のルビ数');
  assert.equal((html.match(/<strong\b/g)??[]).length,(original.join('').match(/\*\*/g)??[]).length/2,'補助欄の太字数');
  assert.equal(sourcePageMetadata[String(page)].sourceSha256,selection.source_sha256);
}
assert(plainDisplay(sourcePages['53']).includes('ちょっと寄り耳'),'原書のコラム題名の保持');
assert(plainDisplay(sourcePages['54']).includes('血の週間'),'原書の用語を補助欄にもそのまま保持');
assert(scenes.at(-1).plainBody.join('').includes('次回はアメリカ合衆国だ。'),'次回案内を省略しない');
assert.equal((await read('public/modern-c01-l02-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第2回: 3教材・${scenes.length}場面・${selection.paragraphs.length}段落・408行・原書14ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
