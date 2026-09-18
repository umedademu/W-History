import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const existingImages = new Set(JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/existing-images-all.json'), 'utf8')));
const persons = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07-persons-list.json'), 'utf8'));

// Exact aliases map: some Japanese names refer to the exact same historical figure
// e.g. ナポレオン = ナポレオン1世 = ナポレオン＝ボナパルト
// ルター = マルティン＝ルター
// カルロス1世 = カール5世
// etc.
const ALIASES = {
  'ナポレオン1世': 'ナポレオン',
  'ナポレオン＝ボナパルト': 'ナポレオン',
  'マルティン＝ルター': 'ルター',
  'カルロス1世': 'カール5世',
  'マキャヴェリ': 'マキァヴェリ',
  'ダ＝ヴィンチ': 'レオナルド＝ダ＝ヴィンチ',
  'ガリレイ': 'ガリレオ＝ガリレイ',
  'ロヨラ': 'イグナティウス＝ロヨラ',
  'マガリャンイス': 'マゼラン',
  'マリ＝アントワネット': 'マリー＝アントワネット',
  'マリ＝ド＝メディシス': 'マリー＝ド＝メディシス',
  'ウィレム': 'オラニエ公ウィレム',
  'ウィリアム3世': 'オラニエ公ウィレム3世',
  'ウィレム3世': 'オラニエ公ウィレム3世',
  'ジェームズ6世': 'ジェームズ1世',
  'ルイ＝カペー': 'ルイ16世',
  'エリザベス': 'エリザベス1世',
  'エドワード': 'エドワード6世',
  'フェリペ': 'フェリペ2世',
  'フェルディナント': 'フェルディナント2世',
  'フッガー': 'フッガー家',
  'ラファイエット': 'ラ＝ファイエット',
};

// Known matches to existing images:
const KNOWN_EXISTING = {
  'コロンブス': 'columbus-explorer.png',
  'マテオ＝リッチ': 'matteo-ricci.png',
  'アダム＝シャール': 'adam-schall.png',
  'ピョートル1世': 'peter-great.png',
  'ルイ14世': 'louis14-sun-king.png',
  'ヴォルテール': 'voltaire-philosopher.png',
  'モンテスキュー': 'montesquieu-philosopher.png',
  'ヘンリ7世': 'henry7-tudor.png',
  'ヘンリ8世': 'henry8-king.png',
  'シャルルマーニュ': 'charlemagne.png',
  'ルイ9世': 'louis9-saint.png',
  'シャルル8世': 'charles8-king.png',
  'シャルル＝ダンジュー': 'charles-anjou.png',
  'ウィクリフ': 'john-wycliffe.png',
  'フス': 'jan-hus-reformer.png',
  'カエサル': 'caesar-laurel.png',
  'クレオパトラ': 'cleopatra-queen.png',
  'プラトン': 'plato-philosopher.png',
  'マルコ＝ポーロ': 'marco-polo.png',
  '康熙帝': 'kangxi-emperor.png',
  'スレイマン1世': 'suleyman-magnificent.png',
  'イサベル': 'isabella-castile.png',
  'エンリケ': 'henry-navigator.png',
  'アルブケルケ': 'albuquerque-conqueror.png', // created in Ch5
  'フランシスコ＝ザビエル': 'xavier-missionary.png',
};

// Group persons by canonical name
const canonicalGroups = new Map();
for (const p of persons) {
  const cname = ALIASES[p.name] || p.name;
  if (!canonicalGroups.has(cname)) {
    canonicalGroups.set(cname, []);
  }
  canonicalGroups.get(cname).push(p.name);
}

console.log('Total canonical unique persons in chapter 07:', canonicalGroups.size);

const existingCount = [];
const needCreation = [];

for (const [cname, aliases] of canonicalGroups.entries()) {
  const existingFile = KNOWN_EXISTING[cname] || (existingImages.has(`${cname}.png`) ? `${cname}.png` : null);
  if (existingFile && existingImages.has(existingFile)) {
    existingCount.push({cname, aliases, file: existingFile});
  } else {
    needCreation.push({cname, aliases});
  }
}

console.log('Using existing unique persons:', existingCount.length);
console.log('Need creation unique persons:', needCreation.length);

fs.writeFileSync(
  path.join(baseDir, 'docs/chapter-07-creation-plan.json'),
  JSON.stringify({existing: existingCount, needCreation}, null, 2)
);
