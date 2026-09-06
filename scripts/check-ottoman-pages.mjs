import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {pages,chapters} from "../public/ottoman-pages.js";
import {storyboards,entities,positionFor} from "../public/ottoman-storyboard.js";
import {correspondenceIssues,referencesIn} from "../public/ottoman-names.js";
import {locationFor} from "../public/ottoman-orientation.js";
const names=JSON.parse(await fs.readFile(new URL("./ottoman-source-names.json",import.meta.url),"utf8"));
assert.equal(pages.length,57);
assert.equal(new Set(pages.map(p=>p.id)).size,pages.length);
const covered=new Set();
for(const page of pages){
  assert(page.title&&page.year&&chapters[page.chapter]);
  assert(page.animation.length>=1&&page.animation.length<=3,"一つの主題が細切れになっています: "+page.id);
  assert.deepEqual(page.body,page.animation.map(a=>a.text));
  assert(locationFor(page).label===page.locationLabel);
  for(const part of page.animation){
    const key=page.sourceId+":"+part.sourceRef;
    assert(!covered.has(key),"同じ動きが重複しています: "+key);covered.add(key);
    assert(part.text&&part.frame.length===4);
    const issues=correspondenceIssues(part);
    assert.deepEqual(issues,{mapOnly:[],textOnly:[]},page.id+":"+part.sourceRef+" 本文と地図の名前が一致しません");
    const named=new Set(referencesIn(part.text).map(n=>n.id));
    for(const n of referencesIn([part.title,...Object.values(part.labels??{}),...Object.values(part.badges??{}),...(part.messages??[]).map(r=>r.label)].join(" ")))assert(named.has(n.id),page.id+": 地図の見出し・注記だけに登場する名前 "+n.term);
    for(const route of part.moves??[])assert(part.ids.includes(route.who),"移動する対象が削られています");
    for(const id of [...part.grow??[],...part.fades??[],...Object.keys(part.positions??{}),...Object.keys(part.badges??{}),...Object.keys(part.images??{}),...Object.keys(part.afterImages??{})])assert(part.ids.includes(id));
    for(const id of part.ids)assert(entities[id]&&positionFor(id,part).every(Number.isFinite));
  }
  const displayed=new Set(page.animation.flatMap(a=>a.ids));
  for(const n of referencesIn([page.title,...page.notes].join(" ")))assert(displayed.has(n.id),page.id+": 見出し・補足だけに登場する名前 "+n.term);
  for(const ref of page.combinedRefs){const key=page.sourceId+":"+ref;assert(!covered.has(key));covered.add(key);}
}
for(const [source,parts] of Object.entries(storyboards))for(const [ref] of parts.entries())assert(covered.has(source+":"+ref),"既存の説明が未配置です");
function sourceCoverage(data){
  for(const n of names)assert(data.some(p=>p.sourceId===n.scene&&p.body.join(" ").includes(n.term)&&p.animation.some(a=>a.ids.includes(n.entity))),"新しいページで原文の名前が欠落: "+n.term);
}
sourceCoverage(pages);
const missing=structuredClone(pages);for(const p of missing)p.body=p.body.map(t=>t.replaceAll("ヒジャーズ",""));
for(const p of missing){p.title=p.title.replaceAll("ヒジャーズ","");p.notes=p.notes.map(t=>t.replaceAll("ヒジャーズ",""));}
assert.throws(()=>sourceCoverage(missing),/ヒジャーズ/);
// 双方向に壊しても検出する。別ページの本文に載っていても合格させない。
const cultural=pages.find(p=>p.id==="tulip-1").animation.find(a=>a.ids.includes("press"));
assert(cultural.text.includes("印刷機")&&cultural.text.includes("バロック建築"));
const withoutPrintText={...cultural,text:cultural.text.replaceAll("印刷機","")};
assert(correspondenceIssues(withoutPrintText).mapOnly.includes("press"));
assert(correspondenceIssues({...cultural,ids:cultural.ids.filter(id=>id!=="press")}).textOnly.includes("press"));
const industrial=pages.find(p=>p.id==="tulip-2").animation.find(a=>a.ids.includes("industry"));
assert(!industrial.ids.includes("press")&&!industrial.ids.includes("baroque"));
assert(correspondenceIssues({...industrial,ids:[...industrial.ids,"press"]}).mapOnly.includes("press"));
assert(!referencesIn("徴税権").some(n=>n.id==="tax"));
assert(referencesIn("税の納入").some(n=>n.id==="tax"));
const html=await fs.readFile(new URL("../public/ottoman-story.html",import.meta.url),"utf8");
assert(!/id="step-(?:nav|next|previous|count)"/.test(html),"小ページの操作が残っています");
for(const id of ["page-select","animation-play","previous","next","replay"])assert(html.includes(`id="${id}"`));
console.log(`07の${pages.length}ページ・${pages.reduce((n,p)=>n+p.animation.length,0)}の動き、原資料の名前${names.length}項目と全89段落の本文・地図の名前の双方向一致、小ページ操作の撤去を確認しました。`);
