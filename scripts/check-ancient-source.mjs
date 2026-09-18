import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {ancientEdition,ancientPlaces} from '../public/ancient-edition.js';
import {ancientSeries} from '../public/ancient-volumes.js';
import {ancientNamesInText} from '../public/ancient-geography.js';
import {plainText,sceneMapItems,mapNamePlan,normalizeMapName} from '../public/map-name-coverage.js';
const root=new URL('../',import.meta.url),read=p=>fs.readFile(new URL(p,root),'utf8');
const reference=JSON.parse(await read('docs/ancient-orient/source-selection.json'));
const plan=JSON.parse(await read('docs/ancient-orient/page-plan.json'));
const readingPlan=JSON.parse(await read('docs/ancient-orient/reading-plan.json'));
const hash=s=>createHash('sha256').update(s).digest('hex');
const counts=[2,9,10,1,8,6,7,11,5,13,27,4];
assert.equal(reference.paragraphs.length,161);
assert.deepEqual(ancientSeries.map(v=>ancientEdition[v.id].length),counts);
assert.deepEqual(Object.keys(ancientEdition),ancientSeries.map(v=>v.id));
const all=Object.values(ancientEdition).flat();
assert.equal(new Set(all.map(s=>s.id)).size,103);
assert.equal(plan.length,103);
assert.deepEqual(plan.map(({id,...page})=>page),readingPlan);
assert.deepEqual(all.flatMap(s=>s.sourceText.passages).map(p=>p.paragraph).filter((id,i,a)=>i===0||id!==a[i-1]),reference.paragraphs.map(p=>p.id));
const decode=s=>plainText(s).replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
for(const [i,s] of all.entries()) {
  assert.deepEqual(s.sourceText.passages,plan[i].passages);
  assert.equal(s.title,plan[i].title);
  assert.equal(s.body.length,s.sourceText.passages.length);
  assert.equal(s.plainBody.length,s.body.length);
}
for(const p of reference.paragraphs) {
  assert.equal(p.markdown,p.source.map(r=>r.markdown).join(''));
  assert.equal(p.text,p.markdown.replaceAll('**',''));
  const passages=ancientEdition[p.volume].flatMap(s=>s.sourceText.passages.map((ref,i)=>({ref,body:s.body[i],plain:s.plainBody[i],id:s.id}))).filter(r=>r.ref.paragraph===p.id);
  let offset=0;
  for(const s of passages) {
    assert.equal(s.ref.start,offset,`${s.id}: 本文の欠落・重複`);
    assert.equal(s.plain,p.text.slice(offset,s.ref.end));
    assert.equal(decode(s.body),s.plain);
    offset=s.ref.end;
  }
  assert.equal(offset,p.text.length);
  const sourceBold=[...p.markdown.matchAll(/\*\*(.*?)\*\*/g)].map(m=>m[1]).join('');
  const shownBold=passages.flatMap(s=>[...s.body.matchAll(/<span class="source-bold">(.*?)<\/span>/g)].map(m=>decode(m[1]))).join('');
  assert.equal(shownBold,sourceBold,`${p.id}: 原文の太字を保持`);
}
// 導入だけ・締めだけのページや、括弧内の改ページを再発させない。
for(const [intro,explanation] of [
  ['それじゃあ、最後に南インドの王朝を簡単にまとめておこう。','パーンディヤ朝'],
  ['さて、それではオリエントの文明の地形的な特徴をあげておこう。','メソポタミア'],
  ['太陰太陽暦になった！）','が用いられたんだ。'],
  ['絶対勝つ！（','悪が'],
  ['アッカド','ね、メソポタミアっていろんな民族が'],
  ['大乗仏教の理論を完成','彼の唱えた「空」']
]) {
  const page=all.find(s=>s.plainBody.join('').includes(intro));
  assert.ok(page&&page.plainBody.join('').includes(explanation),`${intro}: 関連する説明と同じページにする`);
}
for(const s of all) {
  const text=s.plainBody.join('');
  assert.ok(!/[（「『【]$/.test(text),`${s.id}: 括弧を開いた直後で切らない`);
  for(const [opening,closing] of [['（','）'],['「','」'],['『','』'],['【','】']]) {
    const balance=text=>[...text].filter(c=>c===opening).length-[...text].filter(c=>c===closing).length;
    // ブッダの説明にある原文由来の不揃いな引用符も、そのまま保持する。
    const original=[...new Set(s.sourceText.passages.map(p=>p.paragraph))].map(id=>reference.paragraphs.find(p=>p.id===id).text).join('');
    assert.equal(balance(text),balance(original),`${s.id}: 改ページによって括弧内の文章を切らない`);
  }
}
// 原文で紙面をまたぐ文章を、間違った節に切り離さない。
for(const [id,lines,term,volume] of [
  ['ancient-1-129',[129,137],'これまであったシュメール法','mesopotamia'],
  ['ancient-1-291',[291,308],'アテンは太陽神','ancient-egypt'],
  ['ancient-2-433',[433,441],'ペルシア湾','parthia-sasanian'],
  ['ancient-3-473',[473,490],'ヴァーカータカ朝','north-india'],
  ['ancient-3-568',[568,576],'仏教を保護','north-india']
]) {
  const p=reference.paragraphs.find(p=>p.id===id);
  assert.deepEqual(p.source.map(r=>r.line),lines);assert.ok(p.text.includes(term));assert.equal(p.volume,volume);
}
const point=p=>assert.ok(p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90);
for(const s of all) {
  const items=sceneMapItems(s,ancientPlaces),text=s.title+'。'+s.plainBody.join('');
  const names=ancientNamesInText(text),shown=items.map(i=>normalizeMapName(i.text));
  for(const name of names)assert.ok(shown.some(s=>s.includes(name.key)),`${s.id}: 地図の名称不足 ${name.name}`);
  for(const item of items){assert.ok(normalizeMapName(text).includes(normalizeMapName(item.text)),`${s.id}: 本文にない名称 ${item.text}`);point(item.at);}
  assert.deepEqual(mapNamePlan(s,items).tags,[],`${s.id}: 追加に頼らず必要な地名を収録`);
  assert.ok(s.frame.length===4&&s.frame.every(Number.isFinite)&&s.frame[0]<s.frame[2]&&s.frame[1]<s.frame[3]);
  for(const r of [...s.routes,...s.rivers]){assert.ok(r.points.length>=2);r.points.forEach(point);}
  for(const item of s.props)assert.match(await read('public/images/'+item.image),/^<svg /);
  assert.ok(s.duration>=0);
}
// 同名の王を混ぜず、語の一部分を別の地名へ割り当てない。
assert.deepEqual(ancientNamesInText('チャンドラグプタ1世').map(e=>e.name),['チャンドラグプタ1世']);
assert.deepEqual(ancientNamesInText('インドラ').map(e=>e.name),[]);
assert.deepEqual(ancientNamesInText('インド＝ヨーロッパ語系民族').map(e=>e.name),[]);
assert.deepEqual(ancientPlaces['ペルセポリス'].point,[52.89,29.93]);
assert.deepEqual(ancientPlaces['モエンジョ＝ダーロ'].point,[68.14,27.32]);
if(!process.argv.includes('--published')) {
  for(const f of reference.files) {
    const raw=await read(f.file),lines=raw.split(/\r?\n/);
    assert.equal(hash(raw),f.sha256,`${f.file}: 原文が変更されています`);
    const selected=reference.paragraphs.filter(p=>p.file===f.file).flatMap(p=>p.source);
    assert.deepEqual(selected.map(s=>s.line).sort((a,b)=>a-b),f.selectedLines);
    for(const s of selected)assert.equal(lines[s.line-1],s.markdown);
    for(const omitted of f.omitted)assert.equal(hash(lines[omitted.line-1]),omitted.sha256);
    const classified=[...f.selectedLines,...f.omitted.map(r=>r.line)].sort((a,b)=>a-b);
    assert.deepEqual(classified,lines.flatMap((line,i)=>line.trim()?[i+1]:[]),'原文の全行を掲載／省略に分類する');
  }
}
execFileSync(process.execPath,[fileURLToPath(new URL('./build-ancient-edition.mjs',import.meta.url)),'--check'],{cwd:fileURLToPath(root),stdio:'pipe',windowsHide:true});
console.log('第1章12パート103ページ・原文161段落の全文と太字、掲載／省略範囲、説明のまとまり、本文と地図の名称・座標・画像・再生成の一致を確認しました。');
