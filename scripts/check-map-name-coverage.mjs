import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { mapNameCatalog } from "../public/map-name-catalog.js";
import { mapNamePlan, namesInText, normalizeMapName, mapDisplayName } from "../public/map-name-coverage.js";
import { loadMapNameScenes } from "./map-name-scenes.mjs";

const chapters=await loadMapNameScenes();
let pageCount=0, addedCount=0, conceptCount=0;
for(const chapter of chapters) for(const scene of chapter.scenes) {
  const plan=mapNamePlan(scene,scene.mapItems);
  const body=normalizeMapName(scene.title+scene.body.join(""));
  const displayed=[...scene.mapItems.map(item=>mapDisplayName(item.text,scene)),...plan.tags.map(tag=>tag.text),...plan.concepts];
  const map=displayed.map(normalizeMapName);
  for(const name of plan.required) assert.ok(map.some(label=>label.includes(normalizeMapName(name))),`${chapter.name}/${scene.id}: 本文の「${name}」を地図に表示できません`);
  for(const name of namesInText(displayed.join("。"))) assert.ok(body.includes(name.key),`${chapter.name}/${scene.id}: 地図の「${name.name}」が本文にありません`);
  for(const tag of plan.tags) assert.ok(Array.isArray(tag.at)&&tag.at.length===2&&tag.at.every(Number.isFinite),`${scene.id}: 「${tag.text}」の対応地点がありません`);
  pageCount++;addedCount+=plan.tags.length;conceptCount+=plan.concepts.length;
}
assert.equal(pageCount,221);
// 複数王朝の位置対応を、公開ページの構成から独立した例で検査する。
const scene={id:'anchor-example',title:'9世紀の政権',body:['後ウマイヤ朝のコルドバ、イドリース朝のモロッコ、アッバース朝のバグダード、サーマーン朝の中央アジア。シーア派。'],mapItems:[{text:'コルドバ',at:[-4.78,37.89]},{text:'モロッコ',at:[-6.5,32]},{text:'バグダード',at:[44.37,33.32]},{text:'中央アジア',at:[68,40]}]};
const plan=mapNamePlan(scene,scene.mapItems);
for(const [name,place] of [["後ウマイヤ朝","コルドバ"],["イドリース朝","モロッコ"],["アッバース朝","バグダード"],["サーマーン朝","中央アジア"]]){
  assert.deepEqual(plan.tags.find(tag=>tag.text===name)?.at,scene.mapItems.find(item=>item.text===place).at,`位置対応の例: ${name}が${place}に対応していません`);
}
assert.ok(plan.concepts.includes("シーア派"),"宗派を所在地の点へ誤って割り当てない");
// 見どころや title/desc に文字があっても、地図上の掲載の代用にはしない。
const hiddenOnly=mapNamePlan({...scene,facts:["後ウマイヤ朝"],mapHeading:"後ウマイヤ朝",before:"後ウマイヤ朝",after:"後ウマイヤ朝"},[]);
assert.ok(hiddenOnly.tags.some(tag=>tag.text==="後ウマイヤ朝"));
assert.deepEqual(namesInText("後ウマイヤ朝").map(e=>e.name),["後ウマイヤ朝"],"部分一致で別王朝を混在させない");
assert.deepEqual(namesInText("説明").map(e=>e.name),[],"説明の『明』を王朝と誤認しない");
const layout=await fs.readFile(new URL("../public/map-layout.js",import.meta.url),"utf8");
assert.ok(layout.includes('createElementNS(NS,"tspan")'),"長い名前の折り返しがありません");
assert.ok(mapNameCatalog.every(e=>e.kind==="concept"||e.points.length>0),"配置根拠のない名前があります");
console.log(`全${pageCount}ページの表示用名称を双方向照合: 地理ラベル${addedCount}件・所在地を持たない語の凡例${conceptCount}件。非表示欄は照合対象外。`);
