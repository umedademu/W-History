import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { places, scenes } from "../public/islamic-culture-scenes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(fs.readFileSync(path.join(root, "scripts/islamic-culture-source-names.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "public/islamic-culture-story.html"), "utf8");
const errors = [];
const vocabulary = [...new Set(spec.checks.flatMap(item => item.terms))];
const ids = scenes.map(({ id }) => id);
if (JSON.stringify(ids) !== JSON.stringify(spec.sceneOrder)) errors.push("場面の順序が原文対応表と一致しません。");
if (scenes.length !== 19) errors.push(`場面数が19ではありません: ${scenes.length}`);
for (const item of spec.checks) {
  const target = scenes.find(({ id }) => id === item.scene);
  if (!target) { errors.push(`場面がありません: ${item.scene}`); continue; }
  const body = [target.title, ...(target.body || [])].join(" ").replace(/<[^>]+>/g, "");
  const map = [target.mapHeading, target.focus, target.before, target.after, ...(target.facts || []), ...(target.tags || []).map(x => x.text), ...(target.actors || []).map(x => x.name), ...(target.props || []).map(x => x.name), ...(target.pins || []).map(key => places[key]?.name)].join(" ");
  for (const term of vocabulary) {
    if (body.includes(term) && !map.includes(term)) errors.push(`${item.scene}: 本文の用語「${term}」が地図表現にありません。`);
    if (map.includes(term) && !body.includes(term)) errors.push(`${item.scene}: 地図の用語「${term}」が説明本文にありません。`);
  }
  for (const term of item.terms) {
    if (!body.includes(term)) errors.push(`${item.scene}: 本文に「${term}」がありません。`);
    if (!map.includes(term)) errors.push(`${item.scene}: 地図表現に「${term}」がありません。`);
  }
  for (const key of target.pins || []) {
    if (!places[key]) { errors.push(`${item.scene}: 未定義の地点 ${key}`); continue; }
    for (const name of places[key].name.split(/[（()）]/).filter(Boolean)) {
      if (!body.includes(name)) errors.push(`${item.scene}: 地図の地名「${name}」が説明本文にありません。`);
    }
  }
  for (const match of (target.body || []).join(" ").matchAll(/<strong>(.*?)<\/strong>/g)) {
    for (const term of match[1].split(/[『』（）・]/).filter(Boolean)) {
      if (!map.includes(term)) errors.push(`${item.scene}: 本文の強調語「${term}」が地図表現にありません。`);
    }
  }
  for (const person of target.actors || []) if (!person.image) errors.push(`${item.scene}: ${person.name} の画像指定がありません。`);
  for (const building of target.props || []) if (!building.image) errors.push(`${item.scene}: ${building.name} の画像指定がありません。`);
}
for (const token of ["19の場面", "01 / 19", "max=\"19\"", "data-chapter=\"6\"", "data-chapter=\"10\""]) if (!html.includes(token)) errors.push(`HTMLの場面数・章境界が未更新です: ${token}`);
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`イスラーム文化: 原文順序・固有名詞の本文/地図対応・画像指定を確認しました（${scenes.length}場面、${spec.checks.reduce((n,x)=>n+x.terms.length,0)}項目）。`);
