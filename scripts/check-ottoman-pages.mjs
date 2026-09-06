import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {pages,chapters,retiredAnimations} from "../public/ottoman-pages.js";
import {storyboards,entities,positionFor} from "../public/ottoman-storyboard.js";
import {correspondenceIssues,referencesIn} from "../public/ottoman-names.js";
import {locationFor} from "../public/ottoman-orientation.js";
const names=JSON.parse(await fs.readFile(new URL("./ottoman-source-names.json",import.meta.url),"utf8"));
assert.equal(pages.length,53);
assert.equal(new Set(pages.map(p=>p.id)).size,pages.length);
const covered=new Set();
for(const page of pages){
  assert(page.title&&page.year&&chapters[page.chapter]);
  assert(page.animation.length>=1&&page.animation.length<=3,"一つの主題が細切れになっています: "+page.id);
  assert.deepEqual(page.body,page.animation.map(a=>a.text));
  assert(locationFor(page).label===page.locationLabel);
  for(const part of page.animation){
    const key=part.sourceKey;
    assert(!covered.has(key),"同じ動きが重複しています: "+key);covered.add(key);
    assert(part.text&&part.frame.length===4);
    const issues=correspondenceIssues(part);
    assert.deepEqual(issues,{mapOnly:[],textOnly:[]},page.id+":"+part.sourceRef+" 本文と地図の名前が一致しません");
    const named=new Set(referencesIn(part.text).map(n=>n.id));
    for(const n of referencesIn([part.title,...Object.values(part.labels??{}),...Object.values(part.badges??{}),...(part.messages??[]).map(r=>r.label)].join(" ")))assert(named.has(n.id),page.id+": 地図の見出し・注記だけに登場する名前 "+n.term);
    for(const route of part.moves??[])assert(part.ids.includes(route.who),"移動する対象が削られています");
    for(const route of [...part.moves??[],...part.messages??[]]){
      assert(route.path.length>=2&&["campaign","rival","move","trade"].includes(route.kind));
      for(const p of route.path)assert(p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90);
    }
    for(const id of [...part.grow??[],...part.fades??[],...Object.keys(part.positions??{}),...Object.keys(part.badges??{}),...Object.keys(part.images??{}),...Object.keys(part.afterImages??{})])assert(part.ids.includes(id));
    for(const id of part.ids)assert(entities[id]&&positionFor(id,part).every(Number.isFinite));
  }
  const displayed=new Set(page.animation.flatMap(a=>a.ids));
  for(const n of referencesIn([page.title,...page.notes].join(" ")))assert(displayed.has(n.id),page.id+": 見出し・補足だけに登場する名前 "+n.term);
}
for(const [key,reason] of Object.entries(retiredAnimations)){assert(reason&&!covered.has(key));covered.add(key);}
for(const [source,parts] of Object.entries(storyboards))for(const [ref] of parts.entries())assert(covered.has(source+":"+ref),"既存の説明が未配置です");
function sourceCoverage(data){
  for(const n of names)assert(data.some(p=>p.animation.some(a=>a.sourceId===n.scene&&a.text.includes(n.term)&&a.ids.includes(n.entity))),"新しいページで原文の名前が欠落: "+n.term);
}
sourceCoverage(pages);
const missing=structuredClone(pages);for(const p of missing){p.body=p.body.map(t=>t.replaceAll("ヒジャーズ",""));p.animation.forEach(a=>a.text=a.text.replaceAll("ヒジャーズ",""));}
for(const p of missing){p.title=p.title.replaceAll("ヒジャーズ","");p.notes=p.notes.map(t=>t.replaceAll("ヒジャーズ",""));}
assert.throws(()=>sourceCoverage(missing),/ヒジャーズ/);
// 双方向に壊しても検出する。別ページの本文に載っていても合格させない。
const marriage=pages.find(p=>p.id==="habsburg-marriages").animation[0];
assert(correspondenceIssues({...marriage,text:marriage.text.replaceAll("カール5世の弟","")}).mapOnly.includes("charlesBrother"));
assert(correspondenceIssues({...marriage,ids:marriage.ids.filter(id=>id!=="charlesBrother")}).textOnly.includes("charlesBrother"));
assert.equal(marriage.images.lajos,false,"婚姻の場面で王を軍の絵にしないでください");
assert.equal(marriage.labels.lajos,"ラヨシュ2世");
assert.equal(marriage.messages.length,2,"二組の婚姻関係が示されていません");
assert(!marriage.moves?.length,"政略結婚を進軍として描かないでください");
assert(!pages.some(p=>p.animation.some(a=>a.ids.includes("press")||a.ids.includes("baroque"))),"主筋から外れた文化の挿話が戻っています");
const industrial=pages.at(-1).animation[0];assert(industrial.ids.includes("industry"));
assert(correspondenceIssues({...industrial,ids:[...industrial.ids,"press"]}).mapOnly.includes("press"));
assert(!referencesIn("徴税権").some(n=>n.id==="tax"));
assert(referencesIn("税の納入").some(n=>n.id==="tax"));
// 名前が存在するだけでは不十分。独立して記録した主題順と因果関係も照合する。
const readingOrder=JSON.parse(await fs.readFile(new URL("./ottoman-reading-order.json",import.meta.url),"utf8"));
function checkFlow(data){
  const parts=data.flatMap(p=>p.animation);let last=-1;
  for(const unit of readingOrder){
    for(const key of unit.sequence){
      const at=parts.findIndex(a=>a.sourceKey===key);
      assert(at>last,unit.subject+": 説明の順番が違います "+key);last=at;
    }
    const paragraph=parts.find(a=>a.sourceKey===unit.sequence.at(-1)).text;
    for(const claim of unit.required??[])assert(paragraph.includes(claim),unit.subject+": 経緯が抜けています "+claim);
  }
}
checkFlow(pages);
const reordered=structuredClone(pages),from=reordered.findIndex(p=>p.id==="habsburg-marriages");
reordered.push(...reordered.splice(from,1));assert.throws(()=>checkFlow(reordered),/順番/);
const noMarriage=structuredClone(pages);noMarriage.find(p=>p.id==="habsburg-marriages").animation[0].text="ハプスブルク家とハンガリー王家が対立した。";
assert.throws(()=>checkFlow(noMarriage),/経緯/);
const noDeath=structuredClone(pages);noDeath.find(p=>p.id==="vienna1-2").animation[0].text=noDeath.find(p=>p.id==="vienna1-2").animation[0].text.replace("王は戦死","");
assert.throws(()=>checkFlow(noDeath),/経緯/);
for(const p of pages)assert(!/原文|原資料|書き起こし|参考書|source|写真\d+頁/i.test([p.title,...p.body,...p.notes].join(" ")),"公開画面に編集用の資料情報が出ています");
const html=await fs.readFile(new URL("../public/ottoman-story.html",import.meta.url),"utf8");
const app=await fs.readFile(new URL("../public/ottoman-story.js",import.meta.url),"utf8");
assert(!/原文|原資料|書き起こし|参考書|教科書写真/.test(html),"画面の補足に資料への言及が残っています");
assert(!/id="step-(?:nav|next|previous|count)"/.test(html),"小ページの操作が残っています");
for(const id of ["animation-play","previous","next","replay","scene-nav"])assert(html.includes(`id="${id}"`));
assert(!/class="chapter-nav"|id="page-select"|class="page-index"/.test(html),"大分類・プルダウン・折りたたみ目次が残っています");
assert(!/data-chapter|page-select/.test(app),"大分類またはプルダウンの処理が残っています");
assert(app.includes("b.textContent=String(i+1).padStart(2,\"0\")"),"53ページの番号移動がありません");
console.log(`07の${pages.length}ページ・${pages.reduce((n,p)=>n+p.animation.length,0)}の動き、原資料の名前${names.length}項目と本文・地図の名前の双方向一致、53個の番号だけを使う移動方法を確認しました。`);
