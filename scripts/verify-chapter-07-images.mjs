import fs from 'node:fs';
import path from 'node:path';
import {chapterNameCatalog, chapterNamesInText} from '../public/chapter-07-geography.js';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const readingPlan = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/reading-plan.json'), 'utf8'));
const {paragraphs} = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/source-selection.json'), 'utf8'));
const pMap = new Map(paragraphs.map(p => [p.id, p]));

const generatedMapping = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07-generated-mapping.json'), 'utf8'));

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
  'バスティーユ牢獄': 'バスティーユ',
  'ルーヴル美術館': 'ルーブル美術館',
};

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
  'シャルルマーニュ': 'charlemagne-emperor.png',
  'ルイ9世': 'louis9-saint.png',
  'シャルル8世': 'charles8-king.png',
  'シャルル＝ダンジュー': 'charles-anjou.png',
  'ウィクリフ': 'john-wycliffe.png',
  'フス': 'jan-hus-reformer.png',
  'カエサル': 'caesar-general.png',
  'クレオパトラ': 'cleopatra-queen.png',
  'プラトン': 'plato-philosopher.png',
  'マルコ＝ポーロ': 'marco-polo.png',
  '康熙帝': 'kangxi-emperor.png',
  'スレイマン1世': 'suleyman1-magnificent.png',
  'イサベル': 'isabella-castile.png',
  'エンリケ': 'henry-navigator.png',
  'アルブケルケ': 'albuquerque-conqueror.png',
};

const BUILDING_MAP = {
  'サン＝ピエトロ大聖堂': 'st-peters-basilica.png',
  'カンタベリ大聖堂': 'canterbury-cathedral.png',
  'ピラミッド': 'pyramid-giza.png',
  'ヴェルサイユ宮殿': 'versailles-palace.png',
  'バスティーユ': 'bastille-fortress.png',
  'バスティーユ牢獄': 'bastille-fortress.png',
  'ルーブル美術館': 'louvre-palace.png',
  'ルーヴル美術館': 'louvre-palace.png',
  'テュイルリー宮殿': 'tuileries-palace.png',
  '廃兵院': 'les-invalides.png',
  'エスコリアル宮殿': 'el-escorial.png',
  'サンスーシ宮殿': 'sanssouci-palace.png',
  'シェーンブルン宮殿': 'schonbrunn-palace.png',
  'エルミタージュ美術館': 'hermitage-museum.png',
  'プラハ城': 'prague-castle.png',
  'ヴァルトブルク城': 'wartburg-castle.png',
  'ゼーランディア城': 'zeelandia-fort.png',
  '聖マリア＝デッレ＝グラツィエ教会': 'santa-maria-grazie.png',
  'システィナ礼拝堂': 'sistine-chapel.png',
  'ヴァチカン宮殿': 'vatican-palace.png',
  'パレ＝ロワイヤル': 'palais-royal.png',
  'タンプル塔': 'temple-tower.png',
};

function resolveEntityImage(name, kind) {
  if (kind === 'building') {
    return BUILDING_MAP[name] || null;
  }
  const cname = ALIASES[name] || name;
  return KNOWN_EXISTING[cname] || generatedMapping[cname] || null;
}

let totalChecked = 0;
let missing = 0;
const imageUsage = new Map(); // image -> Set of canonical names

for (const page of readingPlan) {
  const text = page.passages.map(pass => {
    const p = pMap.get(pass.paragraph);
    return p.text.slice(pass.start, pass.end);
  }).join('');
  const names = chapterNamesInText(page.title + '。' + text);
  for (const entry of names) {
    if (entry.kind === 'person' || entry.kind === 'building') {
      totalChecked++;
      const img = resolveEntityImage(entry.name, entry.kind);
      if (!img) {
        console.error(`Missing image for ${entry.kind} ${entry.name}`);
        missing++;
      } else {
        const fullPath = path.join(baseDir, 'public/images/ancient', img);
        if (!fs.existsSync(fullPath)) {
          console.error(`Image file does not exist: ${fullPath} for ${entry.name}`);
          missing++;
        }
        const cname = ALIASES[entry.name] || entry.name;
        if (!imageUsage.has(img)) imageUsage.set(img, new Set());
        imageUsage.get(img).add(cname);
      }
    }
  }
}

console.log(`Checked ${totalChecked} entity occurrences. Missing: ${missing}`);

// Check if different canonical names share the same image (reuse check)
let reuseIssues = 0;
for (const [img, namesSet] of imageUsage.entries()) {
  if (namesSet.size > 1) {
    console.warn(`Reuse issue: image ${img} is used by multiple canonical names:`, [...namesSet]);
    reuseIssues++;
  }
}

console.log(`Image reuse issues across different canonical names: ${reuseIssues}`);
if (missing === 0 && reuseIssues === 0) {
  console.log('ALL CHECKS PASSED: Every entity has an existing unique image and NO reuse!');
}
