import fs from "node:fs/promises";
import { places, scenes } from "../public/safavid-scenes.js";

const groups = JSON.parse(await fs.readFile(new URL("./safavid-source-names.json", import.meta.url), "utf8"));
const byId = new Map(scenes.map(scene => [scene.id, scene]));
const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");
const join = values => values.flat(Infinity).filter(value => value !== undefined && value !== null).map(plain).join("／");

for (const group of groups) {
  const scene = byId.get(group.scene);
  if (!scene) throw new Error(`06章の照合先がありません: ${group.scene}`);
  const narrative = join([scene.title, scene.body]);
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

// 地図上の地名・人物・建物は欄外でなく説明本文と照合する。
const recurringNames = ["ティムール朝", "サファヴィー朝", "オスマン帝国", "ウズベク人", "キジルバシュ", "十二イマーム派", "シーア派", "イラン", "ペルシア湾"];
const namedPeople = ["イスマーイール1世", "セリム1世", "アッバース1世", "ナーディル＝シャー", "アーガー＝ムハンマド", "アフマド＝シャー"];
for (const scene of scenes) {
  const narrative = join([scene.title, scene.body]);
  const labels = join([scene.mapHeading, scene.focus, scene.before, scene.after, scene.facts, scene.tags.map(tag => tag.text), [...scene.actors, ...scene.props].flatMap(item => [item.name, item.bubble])]);
  for (const key of scene.pins) {
    const name = places[key]?.name;
    if (!name || !narrative.includes(name)) throw new Error(`06章 ${scene.id}: 地図の地名「${name}」が説明本文にありません。`);
  }
  for (const name of [...new Set([...Object.values(places).map(place => place.name), ...namedPeople, ...recurringNames, "アールィー・カープー", "王のモスク", "イマームのモスク", "新ジュルファ", "イギリス東インド会社", "アナトリア", "ホラーサーン", "コーカサス"])]) {
    const mapNames = join([labels, scene.pins.map(key => places[key]?.name)]);
    if (narrative.includes(name) && !mapNames.includes(name)) throw new Error(`06章 ${scene.id}: 説明本文の固有名詞「${name}」が地図にありません。`);
    if (labels.includes(name) && !narrative.includes(name)) throw new Error(`06章 ${scene.id}: 地図の固有名詞「${name}」が説明本文にありません。`);
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
