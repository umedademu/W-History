import fs from "node:fs";
import { places, scenes } from "../public/mughal-scenes.js";

const sourceNames = JSON.parse(
  fs.readFileSync(new URL("./mughal-source-names.json", import.meta.url), "utf8")
);

const stripMarkup = (text = "") => text.replace(/<[^>]+>/g, "");
const join = (values) => values.flat(Infinity).filter(Boolean).map(stripMarkup).join(" ");

function narrativeText(scene) {
  return join([scene.title, scene.body]);
}

function mapText(scene) {
  return join([
    scene.mapHeading,
    scene.focus,
    scene.before,
    scene.after,
    scene.facts,
    scene.pins.map((key) => places[key]?.name),
    scene.tags.map((tag) => tag.text),
    scene.actors.map((actor) => [actor.name, actor.bubble]),
    scene.props.map((prop) => [prop.name, prop.bubble])
  ]);
}

const actualOrder = scenes.map((scene) => scene.id);
if (JSON.stringify(actualOrder) !== JSON.stringify(sourceNames.sceneOrder)) {
  throw new Error("場面の順序が原文対応表と一致しません。");
}

const namedTerms = [...new Set([...Object.values(sourceNames.requirements).flat(), ...Object.values(places).map((place) => place.name)])];
const byId = new Map(scenes.map((scene) => [scene.id, scene]));
for (const [id, terms] of Object.entries(sourceNames.requirements)) {
  const scene = byId.get(id);
  if (!scene) throw new Error(`必須場面 ${id} がありません。`);

  const narrative = narrativeText(scene);
  const map = mapText(scene);
  for (const term of terms) {
    if (!narrative.includes(term)) {
      throw new Error(`${id} の説明本文に「${term}」がありません。`);
    }
    if (!map.includes(term)) {
      throw new Error(`${id} の地図表現に「${term}」がありません。`);
    }
  }

  for (const term of namedTerms) {
    if (map.includes(term) && !narrative.includes(term)) throw new Error(`${id} の地図上の固有名詞「${term}」が説明本文にありません。`);
  }
  for (const pin of scene.pins) {
    if (!places[pin]) throw new Error(`${id} の地点 ${pin} が未定義です。`);
    if (!narrative.includes(places[pin].name)) throw new Error(`${id} の地図地点「${places[pin].name}」が説明本文にありません。`);
  }
  for (const item of [...scene.actors, ...scene.props]) {
    if (!narrative.includes(item.name)) throw new Error(`${id} の地図上の名称「${item.name}」が説明本文にありません。`);
  }
  if (/原文|資料|書き起こし/.test(narrative + (scene.note || ""))) throw new Error(`${id} に教材外の参照説明があります。`);
  if (!Array.isArray(scene.frame) || scene.frame.length !== 4) {
    throw new Error(`${id} の地図範囲が不正です。`);
  }
}

for (const id of sourceNames.excludedIndependentScenes) {
  if (byId.has(id)) throw new Error(`原文範囲外の独立場面 ${id} が残っています。`);
}

console.log(`08「ムガル帝国」全${scenes.length}場面で、原文の登場順と固有名詞の本文・地図対応を確認しました。`);
