import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {pages} from "../public/ottoman-pages.js";
import {entities} from "../public/ottoman-storyboard.js";
import {correspondenceIssues} from "../public/ottoman-names.js";

const sourceNames=JSON.parse(await fs.readFile(new URL("./ottoman-source-names.json",import.meta.url),"utf8"));
const parts=pages.flatMap(page=>page.animation.map(part=>({...part,page:page.id})));
const byKey=new Map(parts.map(part=>[part.sourceKey,part]));

assert.equal(pages.length,42,"原文の流れに整理した42ページを保ってください");
assert.equal(new Set(pages.map(page=>page.id)).size,pages.length,"ページ識別子が重複しています");
for(const item of sourceNames){
  const part=byKey.get(item.sourceKey);
  assert(part,`${item.source}: 対応する説明がありません ${item.sourceKey}`);
  assert(part.text.includes(item.term),`${item.source}: 本文に「${item.term}」がありません`);
  assert(part.ids.includes(item.entity),`${item.source}: 地図に「${item.term}」がありません`);
  assert(entities[item.entity],`${item.source}: 地図対象が未登録です ${item.entity}`);
}
for(const part of parts)
  assert.deepEqual(correspondenceIssues(part),{mapOnly:[],textOnly:[]},`${part.page}/${part.sourceKey}: 本文と地図が一致しません`);

const order=[
  "founding:0","founding:1","founding:2","founding:3","bursa:0","bursa:2",
  "edirne:0","edirne:1","edirne:2","kosovo:1","kosovo:2","kosovo:government","kosovo:0","kosovo:3","kosovo:4",
  "nicopolis:1","nicopolis:0","nicopolis:2","nicopolis:3","ankara:0","ankara:1","ankara:2","recovery:0","recovery:2",
  "conquest:0","crisis:0","conquest:2","conquest:1","conquest:3","istanbul:0","istanbul:2","istanbul:1","istanbul:3",
  "millet:0","millet:1","millet:5","millet:2","millet:6","millet:3","millet:4",
  "chaldiran:0","chaldiran:1","chaldiran:3","chaldiran:2","cairo:0","cairo:1","cairo:2","cairo:3","cairo:4",
  "suleiman:0","suleiman:1","vienna1:0","vienna1:1","vienna1:marriage","vienna1:2","vienna1:succession","vienna1:3",
  "suleiman:4","preveza:0","preveza:1","preveza:3","preveza:4","preveza:5","suleiman:5",
  "capitulation:0","capitulation:1","capitulation:2","suleiman:3","capitulation:3",
  "lepanto:0","lepanto:1","lepanto:4","lepanto:3","crisis:2","crisis:3",
  "karlowitz:0","karlowitz:1","karlowitz:3","karlowitz:2","karlowitz:4","karlowitz:5","tulip:0","tulip:3"
];
let previous=-1;
for(const key of order){
  const index=parts.findIndex(part=>part.sourceKey===key);
  assert(index>previous,`原文の登場順と異なります: ${key}`);
  previous=index;
}

const allText=pages.flatMap(page=>[page.title,...page.body]).join(" ");
for(const aside of ["ソグート","メフメト1世","ムラト2世","ロードス島","ヨハネ騎士団","キプロス島","ドン＝フアン","大トルコ戦争","トランシルヴァニア","ポドリア","ヤン3世ソビエスキ"])
  assert(!allText.includes(aside),`原文の本筋にない挿話が残っています: ${aside}`);

console.log(`07の42ページ・${parts.length}段落、原文から抽出した固有名詞・制度${sourceNames.length}件、登場順、本文と地図の一致を確認しました。`);
