import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('c:/Users/USER/Desktop/W-History');
const readingPlan = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/reading-plan.json'), 'utf8'));
const {paragraphs} = JSON.parse(fs.readFileSync(path.join(baseDir, 'docs/chapter-07/source-selection.json'), 'utf8'));
const pMap = new Map(paragraphs.map(p => [p.id, p]));

for (let i = 0; i < readingPlan.length; i++) {
  const page = readingPlan[i];
  const text = page.passages.map(pass => pMap.get(pass.paragraph).text.slice(pass.start, pass.end)).join('');
  const t = page.title + '。' + text;
  
  if (t.includes('アルマダ') || t.includes('無敵艦隊')) {
    console.log(`Page ${i + 1} (${page.volume}): Armada -> ${page.title}`);
  }
  if (t.includes('レパント')) {
    console.log(`Page ${i + 1} (${page.volume}): Lepanto -> ${page.title}`);
  }
  if (t.includes('ネーズビー') || (t.includes('クロムウェル') && t.includes('鉄騎隊'))) {
    console.log(`Page ${i + 1} (${page.volume}): Naseby/Ironsides -> ${page.title}`);
  }
  if (t.includes('プラッシー')) {
    console.log(`Page ${i + 1} (${page.volume}): Plassey -> ${page.title}`);
  }
  if (t.includes('バスティーユ')) {
    console.log(`Page ${i + 1} (${page.volume}): Bastille -> ${page.title}`);
  }
  if (t.includes('ヴァルミー')) {
    console.log(`Page ${i + 1} (${page.volume}): Valmy -> ${page.title}`);
  }
  if (t.includes('アウステルリッツ')) {
    console.log(`Page ${i + 1} (${page.volume}): Austerlitz -> ${page.title}`);
  }
  if (t.includes('トラファルガー')) {
    console.log(`Page ${i + 1} (${page.volume}): Trafalgar -> ${page.title}`);
  }
  if (t.includes('ロシア遠征') || (t.includes('ナポレオン') && t.includes('モスクワ'))) {
    console.log(`Page ${i + 1} (${page.volume}): Russia campaign -> ${page.title}`);
  }
  if (t.includes('ワーテルロー')) {
    console.log(`Page ${i + 1} (${page.volume}): Waterloo -> ${page.title}`);
  }
  if (t.includes('サラトガ') || t.includes('ヨークタウン')) {
    console.log(`Page ${i + 1} (${page.volume}): American War -> ${page.title}`);
  }
}
