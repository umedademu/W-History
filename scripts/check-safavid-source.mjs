import fs from "node:fs/promises";
import { places, scenes } from "../public/safavid-scenes.js";

const groups = JSON.parse(await fs.readFile(new URL("./safavid-source-names.json", import.meta.url), "utf8"));
const byId = new Map(scenes.map(scene => [scene.id, scene]));
const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");
const join = values => values.flat(Infinity).filter(value => value !== undefined && value !== null).map(plain).join("／");

for (const group of groups) {
  const scene = byId.get(group.scene);
  if (!scene) throw new Error(`06章の照合先がありません: ${group.scene}`);
  const narrative = join([scene.year, scene.kicker, scene.title, scene.body, scene.takeaway, scene.note]);
  const map = join([
    scene.mapHeading, scene.focus, scene.before, scene.after, scene.facts,
    scene.pins.map(key => places[key]?.name), scene.tags.map(tag => tag.text),
    [...scene.actors, ...scene.props].flatMap(item => [item.name, item.bubble])
  ]);
  for (const term of group.terms) {
    if (!narrative.includes(term)) throw new Error(`06章 ${scene.id}: 本文に「${term}」がありません。`);
    if (!map.includes(term)) throw new Error(`06章 ${scene.id}: 地図に「${term}」がありません。`);
  }
}

const expectedOrder = groups.map(group => group.scene);
const actualOrder = scenes.map(scene => scene.id);
if (JSON.stringify(expectedOrder) !== JSON.stringify(actualOrder)) throw new Error("06章の場面順が原文との対応表と一致しません。");

const html = await fs.readFile(new URL("../public/safavid-story.html", import.meta.url), "utf8");
for (const hint of ["原文", "原資料", "教科書写真", "添付された教科書"]) {
  if (html.includes(hint)) throw new Error(`06章の画面に参照資料を示す語「${hint}」が残っています。`);
}

const termCount = groups.reduce((sum, group) => sum + group.terms.length, 0);
console.log(`06章の${scenes.length}場面・原資料由来${termCount}項目について、本文と地図の両方への掲載順を確認しました。`);
