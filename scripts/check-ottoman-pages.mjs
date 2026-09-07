import assert from "node:assert/strict";
import fs from "node:fs/promises";
import "./check-ottoman-source.mjs";
import {pages,chapters,retiredAnimations} from "../public/ottoman-pages.js";
import {storyboards,entities,positionFor} from "../public/ottoman-storyboard.js";
import {correspondenceIssues,referencesIn} from "../public/ottoman-names.js";
import {locationFor} from "../public/ottoman-orientation.js";

assert.equal(pages.length,42);
assert.equal(new Set(pages.map(page=>page.id)).size,pages.length);
const covered=new Set();
for(const page of pages){
  assert(page.title&&page.year&&chapters[page.chapter]);
  assert(page.animation.length>=1&&page.animation.length<=3,"一つの主題が細切れになっています: "+page.id);
  assert.deepEqual(page.body,page.animation.map(part=>part.text));
  assert(locationFor(page).label===page.locationLabel);
  for(const part of page.animation){
    assert(!covered.has(part.sourceKey),"同じ動きが重複しています: "+part.sourceKey);
    covered.add(part.sourceKey);
    assert(part.text&&part.frame.length===4);
    assert.deepEqual(correspondenceIssues(part),{mapOnly:[],textOnly:[]},page.id+":"+part.sourceKey+" 本文と地図の名前が一致しません");
    const named=new Set(referencesIn(part.text).map(name=>name.id));
    for(const name of referencesIn([part.title,...Object.values(part.labels??{}),...Object.values(part.badges??{}),...(part.messages??[]).map(route=>route.label)].join(" ")))
      assert(named.has(name.id),page.id+": 地図の見出し・注記だけに登場する名前 "+name.term);
    for(const route of part.moves??[])assert(part.ids.includes(route.who),"移動する対象が削られています");
    for(const route of [...part.moves??[],...part.messages??[]]){
      assert(route.path.length>=2&&["campaign","rival","move","trade"].includes(route.kind));
      for(const point of route.path)assert(point.length===2&&point.every(Number.isFinite)&&Math.abs(point[0])<=180&&Math.abs(point[1])<=90);
    }
    for(const id of [...part.grow??[],...part.fades??[],...Object.keys(part.positions??{}),...Object.keys(part.badges??{}),...Object.keys(part.images??{}),...Object.keys(part.afterImages??{})])
      assert(part.ids.includes(id));
    for(const id of part.ids)assert(entities[id]&&positionFor(id,part).every(Number.isFinite));
  }
  const displayed=new Set(page.animation.flatMap(part=>part.ids));
  for(const name of referencesIn([page.title,...page.notes].join(" ")))assert(displayed.has(name.id),page.id+": 見出し・補足だけに登場する名前 "+name.term);
}
for(const [key,reason] of Object.entries(retiredAnimations)){assert(reason&&!covered.has(key));covered.add(key);}
for(const [source,parts] of Object.entries(storyboards))for(const [reference] of parts.entries())assert(covered.has(source+":"+reference),"既存の説明が未配置です");
for(const page of pages)assert(!/原文|原資料|書き起こし|参考書|source|写真\d+頁/i.test([page.title,...page.body,...page.notes].join(" ")));

const html=await fs.readFile(new URL("../public/ottoman-story.html",import.meta.url),"utf8");
const app=await fs.readFile(new URL("../public/ottoman-story.js",import.meta.url),"utf8");
assert(!/原文|原資料|書き起こし|参考書|教科書写真/.test(html));
for(const id of ["animation-play","previous","next","replay","scene-nav"])assert(html.includes(`id="${id}"`));
assert(!/class="chapter-nav"|id="page-select"|class="page-index"/.test(html));
assert(!/data-chapter|page-select/.test(app));
assert(app.includes("b.textContent=String(i+1).padStart(2,\"0\")"));
console.log(`07の${pages.length}ページ・${pages.reduce((total,page)=>total+page.animation.length,0)}段落と、本文・地図・移動表現を確認しました。`);
