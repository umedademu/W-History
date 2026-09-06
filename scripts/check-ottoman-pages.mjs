import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {pages,chapters} from "../public/ottoman-pages.js";
import {storyboards,entities,positionFor} from "../public/ottoman-storyboard.js";
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
    for(const id of part.ids)assert(entities[id]&&positionFor(id,part).every(Number.isFinite));
  }
  for(const ref of page.combinedRefs){const key=page.sourceId+":"+ref;assert(!covered.has(key));covered.add(key);}
}
for(const [source,parts] of Object.entries(storyboards))for(const [ref] of parts.entries())assert(covered.has(source+":"+ref),"既存の説明が未配置です");
function sourceCoverage(data){
  for(const n of names)assert(data.some(p=>p.sourceId===n.scene&&[p.title,...p.body,...p.notes].join(" ").includes(n.term)&&p.animation.some(a=>a.ids.includes(n.entity))),"新しいページで原文の名前が欠落: "+n.term);
}
sourceCoverage(pages);
const missing=structuredClone(pages);for(const p of missing)p.body=p.body.map(t=>t.replaceAll("ヒジャーズ",""));
for(const p of missing){p.title=p.title.replaceAll("ヒジャーズ","");p.notes=p.notes.map(t=>t.replaceAll("ヒジャーズ",""));}
assert.throws(()=>sourceCoverage(missing),/ヒジャーズ/);
const html=await fs.readFile(new URL("../public/ottoman-story.html",import.meta.url),"utf8");
assert(!/id="step-(?:nav|next|previous|count)"/.test(html),"小ページの操作が残っています");
for(const id of ["page-select","animation-play","previous","next","replay"])assert(html.includes(`id="${id}"`));
console.log(`07の${pages.length}ページ・${pages.reduce((n,p)=>n+p.animation.length,0)}の動き、原資料の名前${names.length}項目と本文・地図の対応、小ページ操作の撤去を確認しました。`);
