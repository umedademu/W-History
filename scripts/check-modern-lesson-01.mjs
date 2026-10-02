import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {modernEdition,modernPlaces,sourcePages,sourcePageMetadata} from '../public/modern-c01-l01-edition.js';
import {modernSeries,modernLessons} from '../public/modern-volumes.js';
import {modernNameCatalog,modernNamesInText} from '../public/modern-geography.js';
import {loadModernRecords,verifyModernSource,renderModernModule} from './build-modern-lesson-01.mjs';

const root = fileURLToPath(new URL('../',import.meta.url));
const read = name => fs.readFile(path.join(root,name),'utf8');
const {selection,plan,routes} = await loadModernRecords();
const sourcePresent = await verifyModernSource(selection,process.argv.includes('--published'));
const namesRecord = JSON.parse(await read('docs/modern-lesson-01/name-review.json'));
const audit = JSON.parse(await read('docs/modern-lesson-01/entity-audit.json'));
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
assert.deepEqual(selection.pages,Array.from({length:26},(_,i)=>i+15));
assert.deepEqual(selection.section_start_pages,[17,20,22,26,32]);
assert.deepEqual(selection.lines.filter(line=>line.kind === 'section').map(line=>line.page),selection.section_start_pages);
assert.deepEqual(modernLessons,[{lesson:1,title:'ウィーン体制とその崩壊'}]);
assert.equal(modernSeries.length,5);
assert.deepEqual(modernSeries.map(volume=>volume.part),[1,2,3,4,5]);
for(const volume of modernSeries) {
  assert.equal(volume.book,'modern');
  assert.equal(volume.chapter,1);
  assert.equal(volume.lesson,1);
  assert.deepEqual(volume.sections,[volume.id]);
}
assert.deepEqual(Object.keys(modernEdition),modernSeries.map(volume=>volume.id));
const scenes = Object.values(modernEdition).flat();
assert.equal(scenes.length,63);
assert.deepEqual(Object.values(modernEdition).map(pages=>pages.length),[9,7,10,14,23]);
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
for(const word of ['メスティーソ','デカブリスト','パン＝アメリカ主義']) assert.deepEqual(modernNamesInText(word),[],`制度や階層の所在地: ${word}`);
assert(!modernNameCatalog.some(entry=>entry.name === 'メス'),'階層名を都市へ誤一致');
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
  assert.equal(scene.sourceText.lesson,1);
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
// ドイツ学生運動へイタリアの鎮圧経路が混ざらないことを、原文の事件名と対象国から確認。
const germanStudents = modernEdition['modern-c01-l01-p02'][2];
const italianCarbonari = modernEdition['modern-c01-l01-p02'][3];
assert(germanStudents.plainBody.join('').includes('ブルシェンシャフト'));
assert.deepEqual(germanStudents.routes,[], 'ドイツ学生運動にイタリア介入の動きを付けない');
assert(italianCarbonari.plainBody.join('').includes('ナポリとピエモンテで革命を起こした'));
assert(italianCarbonari.plainBody.join('').includes('オーストリア軍の介入で鎮圧'));
assert.equal(italianCarbonari.routes.length,2,'ナポリとピエモンテへの介入');
const countryPoint = name => modernNameCatalog.find(entry=>entry.name === name).points[0];
assert.deepEqual(italianCarbonari.routes.map(route=>({kind:route.kind,start:route.points[0],end:route.points.at(-1)})),['ピエモンテ','ナポリ'].map(name=>({kind:'rival',start:countryPoint('オーストリア'),end:countryPoint(name)})),'本文にある介入元と二つの対象');
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
assert(scenes.some(scene=>scene.plainBody.join('').includes('男子普通選挙が演出されて')),'原書表記の保持');
assert(plainDisplay(sourcePages['32']).includes('ちょっと寄り耳'),'原書のコラム題名の保持');
assert(scenes.at(-1).plainBody.join('').includes('次回はイギリスとフランスだ！'),'次回案内を省略しない');
assert.equal((await read('public/modern-c01-l01-edition.js')).replaceAll('\r\n','\n'),await renderModernModule(),'生成物の再現一致');
console.log(`近代・現代 第1回: 5教材・63場面・83段落・830行・原書26ページ、太字${boldCount}範囲・ルビ${rubyCount}範囲を確認。${sourcePresent?'原文の非改変も確認。':'公開用の保存済み対応記録で確認。'}`);
