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
const hash=s=>createHash('sha256').update(s).digest('hex');
const counts=[4,14,24,2,13,10,13,15,5,22,48,12];
assert.equal(reference.paragraphs.length,161);
assert.deepEqual(ancientSeries.map(v=>ancientEdition[v.id].length),counts);
assert.deepEqual(Object.keys(ancientEdition),ancientSeries.map(v=>v.id));
const all=Object.values(ancientEdition).flat();
assert.equal(new Set(all.map(s=>s.id)).size,182);
assert.equal(plan.length,182);
for(const p of reference.paragraphs) {
  assert.equal(p.markdown,p.source.map(r=>r.markdown).join(''));
  assert.equal(p.text,p.markdown.replaceAll('**',''));
  const pages=ancientEdition[p.volume].filter(s=>s.sourceText.paragraph===p.id);
  let offset=0;
  for(const s of pages) {
    assert.equal(s.sourceText.start,offset,`${s.id}: 本文の欠落・重複`);
    assert.equal(s.plainBody.join(''),p.text.slice(offset,s.sourceText.end));
    assert.equal(plainText(s.body.join('')).replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&'),s.plainBody.join(''));
    offset=s.sourceText.end;
  }
  assert.equal(offset,p.text.length);
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
console.log('第1章12パート182ページ・原文161段落の全文、掲載／省略範囲、改ページの接続、本文と地図の名称・座標・画像・再生成の一致を確認しました。');
