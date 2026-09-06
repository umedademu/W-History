import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {scenes} from "../public/ottoman-scenes.js";
import {entities,storyboards,positionFor,mentionsFor} from "../public/ottoman-storyboard.js";
import {symbolPaths} from "../public/ottoman-symbols.js";

const aliases=Object.entries(entities).flatMap(([id,e])=>e.aliases.map(term=>({id,term}))).sort((a,b)=>b.term.length-a.term.length);
const escaped=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const names=new RegExp(aliases.map(a=>escaped(a.term)).join("|"),"g");
function coordinate(point,context){
  assert(Array.isArray(point)&&point.length===2&&point.every(Number.isFinite),context+": 座標がありません");
  assert(Math.abs(point[0])<=180&&Math.abs(point[1])<=90,context+": 座標が範囲外です");
}
assert.deepEqual(Object.keys(storyboards),scenes.map(s=>s.id));
let count=0,mentions=0;
for(const scene of scenes){
  const steps=storyboards[scene.id],used=new Set(steps.flatMap(s=>s.ids));
  const text=[scene.title,...scene.body,scene.takeaway,scene.note,...scene.facts].join(" ").replace(/<[^>]*>/g,"");
  for(const match of text.matchAll(names)){
    const {id}=aliases.find(a=>a.term===match[0]);
    assert(used.has(id),scene.id+": 本文の「"+match[0]+"」に地図の説明がありません");mentions++;
  }
  for(const mention of mentionsFor(scene))assert(steps[mention.step].ids.includes(mention.id));
  assert(steps.length>=3,scene.id+": 経緯が省略されています");
  for(const [i,step] of steps.entries()){
    const context=scene.id+"/"+(i+1);count++;
    assert(step.title&&step.caption&&step.duration>=2000,context);
    assert.equal(new Set(step.ids).size,step.ids.length,context+": 名前が重複しています");
    for(const id of step.ids){assert(entities[id],context+": 未登録の名前 "+id);coordinate(positionFor(id,step),context+"/"+id);}
    for(const r of [...step.moves??[],...step.messages??[]]){
      assert(r.path.length>=2&&["campaign","rival","move","trade"].includes(r.kind),context);
      r.path.forEach(p=>coordinate(p,context));
      if(r.who)assert(step.ids.includes(r.who),context+": 動く対象が表示されません");
    }
    for(const id of [...step.grow??[],...step.fades??[],...Object.keys(step.badges??{}),...Object.keys(step.positions??{}),...Object.keys(step.labels??{}),...Object.keys(step.icons??{}),...Object.keys(step.afterIcons??{})])assert(step.ids.includes(id),context+": 効果の対象が表示されません "+id);
    for(const icon of [...Object.values(step.icons??{}),...Object.values(step.afterIcons??{})])assert(symbolPaths[icon],context+": 記号がありません");
    for(const a of step.areas??[]){assert(step.ids.includes(a.id),context);a.points.forEach(p=>coordinate(p,context));}
    (step.settlements??[]).forEach(p=>coordinate(p,context));
  }
}
for(const [id,e] of Object.entries(entities)){
  coordinate(e.at,id);(e.outline??[]).forEach(p=>coordinate(p,id));
  if(e.image)await fs.access(new URL("../public/images/"+(e.image.includes("/")?e.image:"ottoman/"+e.image)+".png",import.meta.url));
  else if(e.icon)assert(symbolPaths[e.icon],id+": 記号がありません");
}
// 冒頭の原因と結果、海から迂回する船、後世の主張の区別を保持する。
assert(storyboards.founding[0].ids.includes("anatolia"));
assert(storyboards.founding[1].moves.some(r=>r.who==="mongols"));
assert(storyboards.founding[1].fades.includes("rum"));
assert(storyboards.founding[2].settlements.length>=5);
assert(storyboards.founding[3].ids.includes("osman"));
assert(storyboards.conquest[3].moves.find(r=>r.who==="ships").path.some(p=>p[1]>41.07));
assert(storyboards.cairo.at(-1).note.includes("断定"));
console.log(`07の20場面・${count}説明、本文中の名前${mentions}か所と位置・経路・表示対象・画像を確認しました。`);
