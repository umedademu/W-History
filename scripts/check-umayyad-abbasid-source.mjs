import fs from "node:fs/promises";
import { places, scenes } from "../public/umayyad-abbasid-scenes.js";

const groups = JSON.parse(await fs.readFile(new URL("./umayyad-abbasid-source-names.json", import.meta.url), "utf8"));
const byId = new Map(scenes.map(scene => [scene.id, scene]));
const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");
const join = values => values.flat(Infinity).filter(value => value !== undefined && value !== null).map(plain).join("／");

for (const group of groups) {
  const scene = byId.get(group.scene);
  if (!scene) throw new Error(`02章の照合先がありません: ${group.scene}`);
  const narrative = join([scene.year, scene.kicker, scene.title, scene.body, scene.takeaway, scene.note]);
  const map = join([
    scene.mapHeading, scene.focus, scene.before, scene.after, scene.facts,
    scene.pins.map(key => places[key]?.name), scene.tags.map(tag => tag.text),
    [...scene.actors, ...scene.props].flatMap(item => [item.name, item.bubble])
  ]);

  for (const term of group.terms) {
    if (!narrative.includes(term)) throw new Error(`02章 ${scene.id}: 本文に「${term}」がありません。`);
    if (!map.includes(term)) throw new Error(`02章 ${scene.id}: 地図に「${term}」がありません。`);
  }

  for (const strong of scene.body.flatMap(paragraph => [...paragraph.matchAll(/<strong>(.*?)<\/strong>/g)].map(match => match[1]))) {
    if (!map.includes(strong)) throw new Error(`02章 ${scene.id}: 本文で強調した「${strong}」が地図にありません。`);
  }

  for (const key of scene.pins) {
    const place = places[key]?.name.replace(/【.*?】/g, "");
    if (!place || !narrative.includes(place)) throw new Error(`02章 ${scene.id}: 地図の地名「${place ?? key}」が本文にありません。`);
  }
  for (const tag of scene.tags) {
    if (!narrative.includes(tag.text)) throw new Error(`02章 ${scene.id}: 地図の表示「${tag.text}」が本文にありません。`);
  }
}

const sourceOrder = groups.map(group => group.scene);
const actualOrder = scenes.map(scene => scene.id);
if (JSON.stringify(sourceOrder) !== JSON.stringify(actualOrder)) throw new Error("02章の場面順が原文との照合表と一致しません。");

const removed = ["エルサレム", "岩のドーム", "ターリク", "トレド", "コルドバ", "アンダルス", "サマルカンド", "シンド地方", "高仙芝", "製紙法", "ザンジュの乱", "サッファール朝", "サーマーン朝", "アーヘン", "カルタゴ"];
const allText = join(scenes);
for (const term of removed) if (allText.includes(term)) throw new Error(`02章に対象範囲外の語「${term}」が残っています。`);

const termCount = groups.reduce((sum, group) => sum + group.terms.length, 0);
console.log(`02章の${scenes.length}場面・原資料由来${termCount}項目について、本文と地図の両方への掲載順を確認しました。`);
