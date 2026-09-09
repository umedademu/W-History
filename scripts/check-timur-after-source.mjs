import fs from "node:fs/promises";
import { locations, scenes } from "../public/timur-after-scenes.js";

const groups = JSON.parse(await fs.readFile(new URL("./timur-after-source-names.json", import.meta.url), "utf8"));
const byId = new Map(scenes.map(scene => [scene.id, scene]));
const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");
const join = values => values.flat(Infinity).filter(value => value !== undefined && value !== null).map(plain).join("／");

for (const group of groups) {
  const scene = byId.get(group.scene);
  if (!scene) throw new Error(`05章の照合先がありません: ${group.scene}`);
  const narrative = join([scene.year, scene.kicker, scene.title, scene.body, scene.takeaway, scene.note]);
  const map = join([
    scene.mapHeading, scene.before, scene.after, scene.relation,
    scene.pins.map(key => locations[key]?.name),
    [...scene.actors, ...scene.props].flatMap(item => [item.name, item.bubble])
  ]);

  for (const term of group.terms) {
    if (!narrative.includes(term)) throw new Error(`05章 ${scene.id}: 本文に「${term}」がありません。`);
    if (!map.includes(term)) throw new Error(`05章 ${scene.id}: 地図用資料に「${term}」がありません。`);
  }

  for (const key of scene.pins) {
    const place = locations[key]?.name.replace(/（.*?）/g, "").replace(/の草原$/, "");
    if (!place || !narrative.includes(place)) throw new Error(`05章 ${scene.id}: 地図の地名「${place ?? key}」が本文にありません。`);
  }
}

const sourceOrder = groups.map(group => group.scene);
const actualOrder = scenes.map(scene => scene.id);
if (JSON.stringify(sourceOrder) !== JSON.stringify(actualOrder)) throw new Error("05章の場面順が原文との照合表と一致しません。");

const routeRequirements = new Map([
  ["reunite", ["campaign"]],
  ["diplomacy", ["peace"]],
  ["oasis-trade", ["trade"]],
  ["uzbek-entry", ["campaign"]],
  ["timurid-fall", ["campaign"]],
  ["three-khanates", ["trade"]],
  ["kazakh-branch", ["move"]],
  ["russian-expansion", ["campaign"]]
]);
for (const [sceneId, kinds] of routeRequirements) {
  const actual = new Set(byId.get(sceneId).routes.map(route => route.kind));
  for (const kind of kinds) if (!actual.has(kind)) throw new Error(`05章 ${sceneId}: 出来事を示す経路「${kind}」がありません。`);
}

const removed = ["1507年", "1709年", "1876年", "保護国", "併合", "サファヴィー朝", "イスマーイール1世", "キジルバシュ"];
const allText = join(scenes);
for (const term of removed) if (allText.includes(term)) throw new Error(`05章に担当範囲外または本筋外の語「${term}」が残っています。`);

const termCount = groups.reduce((sum, group) => sum + group.terms.length, 0);
console.log(`05章の${scenes.length}場面・原資料由来${termCount}項目について、原文と地図用資料の掲載順と出来事の表現を確認しました。`);
