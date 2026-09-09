import { mapNameCatalog } from "./map-name-catalog.js?v=0.049";

export const plainText = value => String(value ?? "").replace(/<[^>]*>/g, "");
export const normalizeMapName = value => plainText(value).replace(/[\s＝=・『』「」]/g, "");
const entries = mapNameCatalog.filter(entry=>(!/(?:騎兵|商人|戦士|軍団)$/.test(entry.name) || entry.name === "カーリミー商人")).map(entry => ({...entry, key:normalizeMapName(entry.name)})).sort((a,b)=>b.key.length-a.key.length);
const byKey = new Map(entries.map(e=>[e.key,e]));
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp([...byKey.keys()].map(key=>key.length===1?`(?<![一-龯])${escape(key)}(?![一-龯])`:escape(key)).join("|"), "g");
export function namesInText(text) {
  return [...new Map([...normalizeMapName(text).matchAll(pattern)].map(match=>[match[0],byKey.get(match[0])])).values()];
}
const localAnchors={
 "後ウマイヤ朝":["コルドバ"],"イドリース朝":["モロッコ"],"アッバース朝":["バグダード","クーファ"],"ファーティマ朝":["カイロ","チュニジア"],
 "サーマーン朝":["ブハラ","中央アジア"],"ブワイフ朝":["バグダード","カスピ海南西"],"ムラービト朝":["マラケシュ","マグリブ地方"],
 "ムワッヒド朝":["マラケシュ","マグリブ地方"],"ナスル朝":["グラナダ"],"サッファール朝":["イラン東部"],"ガズナ朝":["ガズナ","アフガニスタン"],
 "セルジューク朝":["ホラーサーン地方","イラン"],"イル＝ハン国":["タブリーズ","イラン"],"アイユーブ朝":["カイロ","エジプト"],"マムルーク朝":["カイロ","エジプト"],
 "マリ王国":["ニジェール川流域"],"ソンガイ王国":["ガオ","ニジェール川流域"],"カネム＝ボルヌー王国":["チャド湖"],"モノモタパ王国":["大ジンバブエ"]
};
export function mapNamePlan(scene, mapItems) {
  const narrative = plainText([scene.title,...scene.body].join("。"));
  const required = namesInText(narrative);
  // title・desc・非表示の見どころ欄は、地図上の表示には数えない。
  const shown = mapItems.map(item=>normalizeMapName(mapDisplayName(item.text,scene)));
  const missing = required.filter(entry=>!shown.some(text=>text.includes(entry.key)));
  const centers=mapItems.filter(item=>Array.isArray(item.at)).map(item=>item.at);
  const distance = point => centers.length ? Math.min(...centers.map(at=>(point[0]-at[0])**2+(point[1]-at[1])**2)) : 0;
  return {
    required:required.map(e=>e.name),
    tags:missing.filter(e=>e.kind!=="concept" && !/(?:人|語|教徒)$/.test(e.name)).map(entry=>({text:entry.name,at:(localAnchors[entry.name]??[]).map(name=>mapItems.find(item=>normalizeMapName(item.text)===normalizeMapName(name))?.at).find(Boolean)??[...entry.points].sort((a,b)=>distance(a)-distance(b))[0],nameLabel:true})),
    concepts:missing.filter(e=>(e.kind==="concept" || /(?:人|語|教徒)$/.test(e.name))).map(e=>e.name),
  };
}
export function entityNameForNarrative(entity, fallback, scene) {
  const body=normalizeMapName(scene.title+scene.body.join(""));
  return [...entity.aliases].sort((a,b)=>b.length-a.length).find(name=>body.includes(normalizeMapName(name))) ?? fallback ?? entity.name;
}
export function mapDisplayName(text, scene) {
  const narrative=normalizeMapName(scene.title+scene.body.join(""));
  return text.replace(/[【（]([^】）]*)[】）]/g,(all,inside)=>
    namesInText(inside).some(entry=>!narrative.includes(entry.key)) ? "" : all);
}
export function sceneMapItems(scene, places) {
  return [...(scene.pins??[]).map(key=>({text:places[key].name,at:places[key].point})),...(scene.tags??[]),
    ...[...(scene.actors??[]),...(scene.props??[])].map(item=>({text:item.name,at:typeof item.at==="string"?places[item.at]?.point:item.at}))];
}
export function withMapNames(scene, places) {
  const plan=mapNamePlan(scene,sceneMapItems(scene,places));
  return {...scene,tags:[...(scene.tags??[]),...plan.tags],mapNamePlan:plan};
}
// 信仰・言語は一点の所在地を示さず、地図内の凡例として明示する。
export function renderMapNameConcepts(map, concepts) {
  const panel=map.closest(".map-panel");
  let key=panel.querySelector(".map-name-concepts");
  if(!key){key=document.createElement("p");key.className="map-name-concepts";panel.querySelector(".map-viewport").after(key);}
  key.hidden=concepts.length===0;
  key.replaceChildren();
  if(concepts.length){
    const heading=document.createElement("span");heading.className="map-name-concepts-heading";heading.textContent="民族・信仰・制度・著作など";key.append(heading);
    for(const concept of concepts){const name=document.createElement("span");name.className="map-concept-name";name.textContent=concept;key.append(name);}
  }
}
