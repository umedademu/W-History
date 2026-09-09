import fs from "node:fs/promises";
import { places, scenes } from "../public/regional-dynasties-scenes.js";

const groups = JSON.parse(await fs.readFile(new URL("./regional-dynasties-source-names.json", import.meta.url), "utf8"));
const byId = new Map(scenes.map(scene => [scene.id, scene]));
const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");
const join = values => values.flat(Infinity).filter(value => value !== undefined && value !== null).map(plain).join("／");

for (const group of groups) {
  const scene = byId.get(group.scene);
  if (!scene) throw new Error(`03章の照合先がありません: ${group.scene}`);
  const narrative = join([scene.year, scene.kicker, scene.title, scene.body, scene.takeaway, scene.note]);
  const map = join([
    scene.mapHeading, scene.focus, scene.before, scene.after, scene.facts,
    scene.pins.map(key => places[key]?.name), scene.tags.map(tag => tag.text),
    [...scene.actors, ...scene.props].flatMap(item => [item.name, item.bubble])
  ]);

  for (const term of group.terms) {
    if (!narrative.includes(term)) throw new Error(`03章 ${scene.id}: 本文に「${term}」がありません。`);
    if (!map.includes(term)) throw new Error(`03章 ${scene.id}: 地図用資料に「${term}」がありません。`);
  }

  for (const key of scene.pins) {
    const place = places[key]?.name.replace(/【.*?】/g, "");
    if (!place || !narrative.includes(place)) throw new Error(`03章 ${scene.id}: 地図の地名「${place ?? key}」が本文にありません。`);
  }
  for (const tag of scene.tags) {
    if (!narrative.includes(tag.text)) throw new Error(`03章 ${scene.id}: 地図の表示「${tag.text}」が本文にありません。`);
  }
  for (const item of [...scene.actors, ...scene.props]) {
    const name = item.name.replace(/【.*?】/g, "");
    if (!narrative.includes(name)) throw new Error(`03章 ${scene.id}: 地図の人物・建物「${name}」が本文にありません。`);
  }
}

const sourceOrder = groups.map(group => group.scene);
const actualOrder = scenes.map(scene => scene.id);
if (JSON.stringify(sourceOrder) !== JSON.stringify(actualOrder)) throw new Error("03章の場面順が原文との照合表と一致しません。");

const removed = ["ルーダキー", "イブン＝スィーナー", "ペルシア・ルネサンス", "ヒッティーン", "クトゥズ", "アイン・ジャールート", "アッコン", "アスキア＝ムハンマド", "季節風", "ソファラ", "カビール", "ナーナク", "バクティ", "クトゥブ＝ミナール"];
const allText = join(scenes);
for (const term of removed) if (allText.includes(term)) throw new Error(`03章に対象範囲外の語「${term}」が残っています。`);

const termCount = groups.reduce((sum, group) => sum + group.terms.length, 0);
console.log(`03章の${scenes.length}場面・原資料由来${termCount}項目について、原文と地図用資料の掲載順を確認しました。`);
