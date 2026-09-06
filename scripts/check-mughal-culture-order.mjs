import { scenes as mughalScenes } from "../public/mughal-scenes.js";
import { scenes as cultureScenes } from "../public/islamic-culture-scenes.js";

function checkOrder(label, scenes, expected) {
  const actual = scenes.map((scene) => scene.id);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label}の説明順が原資料との対照順から外れています。`);
  }
}

function checkWords(label, scenes, requirements) {
  const byId = new Map(scenes.map((scene) => [scene.id, scene]));
  for (const [id, words] of Object.entries(requirements)) {
    const scene = byId.get(id);
    if (!scene) throw new Error(`${label}の必須場面 ${id} がありません。`);
    const text = [scene.title, ...scene.body, ...scene.facts].join(" ");
    for (const word of words) {
      if (!text.includes(word)) throw new Error(`${label}/${id} に ${word} がありません。`);
    }
  }
}

checkOrder("08 ムガル帝国", mughalScenes, [
  "babur-kabul",
  "first-panipat",
  "humayun-exile",
  "akbar-coronation",
  "akbar-jizya-abolition",
  "guru-nanak-sikh",
  "mansabdari-system",
  "jahangir-culture",
  "shah-jahan-deccan",
  "taj-mahal-creation",
  "red-fort-delhi",
  "aurangzeb-accession",
  "deccan-campaign-max",
  "jizya-restoration",
  "shivaji-maratha",
  "sikh-militarization",
  "empire-fragmentation",
  "company-advance",
  "mughal-painting",
  "urdu-language-culture",
  "indian-cotton-trade",
  "mughal-end"
]);

checkWords("08 ムガル帝国", mughalScenes, {
  "akbar-jizya-abolition": ["ジズヤ", "ラージプート"],
  "guru-nanak-sikh": ["カビール", "ナーナク"],
  "deccan-campaign-max": ["最大"],
  "jizya-restoration": ["ジズヤ"],
  "empire-fragmentation": ["ニザーム王国", "アワド王国", "シク王国", "マラーター同盟", "マイソール王国", "ナーディル＝シャー"],
  "company-advance": ["イギリス", "フランス", "プラッシーの戦い", "ベンガル太守"],
  "urdu-language-culture": ["ウルドゥー語", "『バーブル＝ナーマ』", "『アクバル＝ナーマ』", "アブル＝ファズル"],
  "indian-cotton-trade": ["モスリン", "キャラコ", "更紗", "ヨーロッパ"]
});

checkOrder("09 イスラーム文化", cultureScenes, [
  "shared-knowledge",
  "faith-and-law",
  "tabari-chronicle",
  "rashid-al-din-history",
  "ibn-khaldun-muqaddimah",
  "ghazali-theology",
  "ibn-battuta-travels",
  "ibn-sina-canon",
  "ibn-rushd-philosophy",
  "razi-medicine",
  "khwarizmi-math",
  "astronomy-instruments",
  "ibn-alhaytham-optics",
  "chemistry-crafts",
  "twelfth-century-renaissance",
  "firdausi-shahnameh",
  "omar-khayyam-rubaiyat",
  "saadi-gulistan",
  "scheherazade-nights",
  "mosque-architecture",
  "arabesque-and-heritage",
  "painting-and-crafts"
]);

checkWords("09 イスラーム文化", cultureScenes, {
  "shared-knowledge": ["固有の学問", "外来の学問", "アラビア語"],
  "faith-and-law": ["コーラン", "ハディース", "アラビア語文法", "神学", "法学"],
  "ghazali-theology": ["ガザーリー", "ニザーミーヤ学院", "スーフィズム"],
  "ibn-battuta-travels": ["ウラマー", "『三大陸周遊記』"],
  "saadi-gulistan": ["サーディー", "『ばら園』"]
});

console.log(`08の${mughalScenes.length}場面と09の${cultureScenes.length}場面について、原資料に沿う説明順と要点を確認しました。`);
