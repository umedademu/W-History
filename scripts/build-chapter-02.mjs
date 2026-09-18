import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries,chapterLessons} from '../public/chapter-02-volumes.js';
import {chapterNamesInText,chapterRivers} from '../public/chapter-02-geography.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/chapter-02/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/chapter-02/reading-plan.json'));
const paragraphById = new Map(paragraphs.map(p=>[p.id,p]));

const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const normalizeMapName = s => s.replace(/[\s＝=・『』「」]/g, '');

function boldSpans(markdown) {
  let plain='',start=null;const spans=[];
  for(let i=0;i<markdown.length;) {
    if(markdown.slice(i,i+2)==='**') {
      if(start===null)start=plain.length;else {spans.push([start,plain.length]);start=null;}
      i+=2;
    }else plain+=markdown[i++];
  }
  return spans;
}
function decorate(text,spans,start,end) {
  const bounds=[...new Set([start,end,...spans.flat().filter(i=>i>start&&i<end)])].sort((a,b)=>a-b);
  return bounds.slice(0,-1).map((a,i)=>{
    const b=bounds[i+1],value=escape(text.slice(a,b));
    return spans.some(([x,y])=>x<=a&&y>=b)?`<span class="source-bold">${value}</span>`:value;
  }).join('');
}

assert.deepEqual([...new Set(readingPlan.map(p=>p.volume))],chapterSeries.map(v=>v.id));
let paragraphIndex=0,offset=0;
for(const page of readingPlan) {
  assert.ok(page.title&&page.passages.length);
  for(const passage of page.passages) {
    const p=paragraphs[paragraphIndex];
    assert.ok(p&&page.volume===p.volume&&passage.paragraph===p.id,'本文の掲載順');
    assert.ok(Number.isInteger(passage.start)&&Number.isInteger(passage.end));
    assert.equal(passage.start,offset,'本文の欠落・重複');
    assert.ok(passage.end>offset&&passage.end<=p.text.length);
    offset=passage.end;
    if(offset===p.text.length){paragraphIndex++;offset=0;}
  }
}
assert.equal(paragraphIndex,paragraphs.length,'本文の掲載漏れ');
assert.equal(offset,0);

export const personInfo = {
  // 初期ギリシア・アテネ改革
  'ドラコン': { image: 'solon-reformer', bubble: '従来の慣習法を成文化し公開する！' },
  'ソロン': { image: 'solon-reformer', bubble: '財産額に応じて参政権を与える財産政を導入！' },
  'ペイシストラトス': { image: 'peisistratos-tyrant', bubble: '中小農民を保護し僭主として君臨！' },
  'ヒッピアス': { image: 'hippias-exile', bubble: '暴政を行いアテネ市民によって追放される' },
  'クレイステネス': { image: 'cleisthenes-democrat', bubble: '陶片追放（オストラキスモス）で僭主の出現を防ぐ！' },
  
  // ペルシア戦争・将軍・王
  'ミルティアデス': { image: 'miltiades-general', afterImage: 'roman-victory', bubble: 'マラトンの戦いでペルシア軍を撃破！' },
  'テミストクレス': { image: 'themistocles-naval', afterImage: 'roman-victory', bubble: '三段櫂船を建造しサラミスの海戦で勝利へ導く！' },
  'レオニダス': { image: 'leonidas-spartan', afterImage: 'spartan-phalanx', bubble: 'テルモピレーで300名の兵と玉砕覚悟で奮戦！' },
  'クセルクセス1世': { image: 'persian-immortal', afterImage: 'darius3-worried', bubble: '大軍を率いてギリシア本土へ進軍せよ！' },
  
  // アテネ全盛期・ポリス社会崩壊
  'ペリクレス': { image: 'pericles-statesman', bubble: '民主政は少数のためでなく万人のためのもの！' },
  'リュクルゴス': { image: 'lycurgus-spartan', bubble: '厳格な規律と軍国主義の国制を定める' },
  'エパメイノンダス': { image: 'miltiades-general', afterImage: 'roman-victory', bubble: '斜線陣でスパルタ軍を撃破し覇権を握る！' },
  'フィリッポス2世': { image: 'philip2-macedon', afterImage: 'roman-victory', bubble: 'カイロネイアの戦いで全ギリシアを制圧！' },
  'カッサンドロス': { image: 'philip2-macedon', bubble: 'アンティゴノス朝マケドニアの基礎を築く' },
  'アンティゴノス2世': { image: 'philip2-macedon', bubble: 'マケドニアの支配を安定させる' },
  'アレクサンドロス': { image: 'alexander-conqueror', afterImage: 'alexander-triumph', bubble: 'ペルシアを滅ぼし世界帝国を建設する！' },
  'アレクサンドロス大王': { image: 'alexander-conqueror', afterImage: 'alexander-triumph', bubble: 'ペルシアを滅ぼし世界帝国を建設する！' },
  
  // ギリシア文学・芸術・考古学
  'アガメムノン': { image: 'philip2-macedon', bubble: 'ミケーネの王としてトロイア遠征を率いる' },
  'シュリーマン': { image: 'thales-philosopher', bubble: 'ホメロスの叙事詩を信じトロイア遺跡を発掘！' },
  'エヴァンズ': { image: 'thales-philosopher', bubble: 'クレタ島のクノッソス迷宮宮殿を発掘！' },
  'ヴェントリス': { image: 'thales-philosopher', bubble: '粘土板に刻まれた線文字Bの解読に成功！' },
  'ホメロス': { image: 'herodotus-historian', bubble: '『イリアス』『オデュッセイア』を吟誦する' },
  'ヘシオドス': { image: 'herodotus-historian', bubble: '『神統記』『労働と日々』を著す' },
  'サッフォー': { image: 'herodotus-historian', bubble: 'レスボス島で愛と情熱の抒情詩を歌う' },
  'アイスキュロス': { image: 'thucydides-historian', bubble: '悲劇『アガメムノン』を著す' },
  'ソフォクレス': { image: 'thucydides-historian', bubble: '悲劇『オイディプス王』で運命の悲劇を描く' },
  'エウリピデス': { image: 'thucydides-historian', bubble: '悲劇『メディア』で人間の心理を鋭く描く' },
  'アリストファネス': { image: 'thucydides-historian', bubble: '喜劇『女の平和』でペロポネソス戦争を風刺！' },
  'フェイディアス': { image: 'phidias-sculptor', bubble: 'パルテノン神殿のアテナ女神像を彫刻' },
  'プラクシテレス': { image: 'phidias-sculptor', bubble: '優美なヘルメス像などの彫刻を手がける' },
  'ヘロドトス': { image: 'herodotus-historian', bubble: 'ペルシア戦争を物語る『歴史』を著す' },
  'トゥキディデス': { image: 'thucydides-historian', bubble: 'ペロポネソス戦争を批判的実証主義で記録' },
  
  // ギリシア・ヘレニズム哲学・自然科学
  'タレス': { image: 'thales-philosopher', bubble: '万物の根源（アルケー）は水である' },
  'ピタゴラス': { image: 'pythagoras-scholar', bubble: '万物の根源は数であり調和である' },
  'ヘラクレイトス': { image: 'thales-philosopher', bubble: '万物は流転する（パンタ・レイ）' },
  'デモクリトス': { image: 'thales-philosopher', bubble: '万物はこれ以上分割できない原子（アトム）からなる' },
  'ヒッポクラテス': { image: 'hippocrates-doctor', bubble: '迷信を排し臨床観察に基づく医学の父' },
  'プロタゴラス': { image: 'socrates-philosopher', bubble: '人間は万物の尺度である（相対主義）' },
  'ソクラテス': { image: 'socrates-philosopher', bubble: '無知の知を自覚し、魂の善美を求めよ' },
  'プラトン': { image: 'plato-philosopher', bubble: '真の実在は天上にあるイデアの世界である' },
  'アリストテレス': { image: 'aristotle-philosopher', bubble: '人間はポリス的動物である（万学の祖）' },
  'エピクロス': { image: 'epicurus-philosopher', bubble: '心の平静（アタラクシア）こそ最高の快楽' },
  'ゼノン': { image: 'zeno-stoic', bubble: '情熱に動かされない不動心（アパテイア）を説く' },
  'アリスタルコス': { image: 'eratosthenes-geographer', bubble: '太陽中心説（地動説）を先駆的に唱える' },
  'エラトステネス': { image: 'eratosthenes-geographer', bubble: '夏至の影から地球の全周を正確に計算！' },
  'アルキメデス': { image: 'archimedes-scientist', bubble: '浮力の原理・てこの原理を発見！' },
  'エウクレイデス': { image: 'pythagoras-scholar', bubble: '平面幾何学を大成し『幾何学原論』を著す' },
  'ドロイゼン': { image: 'thucydides-historian', bubble: '東西文化融合の時代を「ヘレニズム」と命名' },
  'デモステネス': { image: 'demosthenes-orator', bubble: 'マケドニアの専制に屈するなと市民に訴える！' },
  'イソクラテス': { image: 'demosthenes-orator', bubble: '全ギリシアの一致団結を説く' },
  
  // ローマ共和政・身分闘争
  'リキニウス': { image: 'licinius-tribune', bubble: 'コンスルの1名を平民から選ぶ法を制定！' },
  'セクスティウス': { image: 'licinius-tribune', bubble: '大土地所有を制限し平民の権利を拡充！' },
  'ホルテンシウス': { image: 'licinius-tribune', bubble: '平民会の決議が元老院の承認なしに国法となる！' },
  'カヌレイウス': { image: 'licinius-tribune', bubble: '貴族と平民の通婚を認める法を可決！' },
  'カトー': { image: 'cato-elder', bubble: 'カルタゴは滅ぼされるべきである！' },
  
  // ポエニ戦争・地中海統一
  'ハンニバル': { image: 'hannibal-barker', afterImage: 'soldier-retreat', bubble: 'アルプスを越えカンネーでローマ軍を包囲殲滅！' },
  'ハミルカル': { image: 'hannibal-barker', bubble: 'スペインを拠点にカルタゴの再興を誓う' },
  'スキピオ': { image: 'scipio-africanus', afterImage: 'roman-victory', bubble: 'ザマの戦いでハンニバルを破りポエニ戦争に勝利！' },
  '小スキピオ': { image: 'scipio-africanus', afterImage: 'roman-victory', bubble: '第3回ポエニ戦争でカルタゴを徹底破壊！' },
  
  // 共和政の動揺・内乱の1世紀
  'ティベリウス': { image: 'tiberius-gracchus', bubble: '農民の没落を防ぐため公有地保有制限法を提案！' },
  'ガイウス': { image: 'gaius-gracchus', bubble: '兄の意志を継ぎ改革を進めるも元老院派に倒れる…' },
  'グラックス兄弟': { image: 'tiberius-gracchus', bubble: '没落農民を救い自作農を再建する土地改革を断行！' },
  'マリウス': { image: 'marius-general', bubble: '無産市民を募兵して軍制改革を行い平民派を率いる！' },
  'スラ': { image: 'sulla-dictator', bubble: '同盟市戦争を鎮圧し閥族派の独裁官となる！' },
  'ユグルタ': { image: 'soldier-retreat', bubble: 'ヌミディアでローマに抵抗するも敗れる' },
  'スパルタクス': { image: 'spartacus-gladiator', afterImage: 'greek-defeated', bubble: '剣闘士の仲間とともに自由を求めて蜂起！' },
  'ミトリダテス6世': { image: 'soldier-retreat', bubble: '小アジアで反ローマの兵を挙げる' },
  
  // 三頭政治・カエサル
  'ポンペイウス': { image: 'scipio-africanus', bubble: '東方を平定しセレウコス朝シリアを滅ぼす！' },
  'クラッスス': { image: 'sulla-dictator', bubble: '莫大な財力でスパルタクスの乱を鎮圧！' },
  'カエサル': { image: 'caesar-general', afterImage: 'roman-victory', bubble: '賽は投げられた！ルビコン川を渡りローマへ進軍！' },
  'ブルートゥス': { image: 'roman-consul', bubble: '共和政を守るため独裁者カエサルを討つ！' },
  'カッシウス': { image: 'roman-consul', bubble: '元老院共和派としてカエサル暗殺に加担' },
  'アントニウス': { image: 'scipio-africanus', bubble: 'クレオパトラと結び東方に勢力を張る' },
  'レピドゥス': { image: 'roman-consul', bubble: '第2回三頭政治の一角として西地中海を統治' },
  'クレオパトラ': { image: 'pharaoh-calm', bubble: 'アントニウスと組みアクティウムで激突！' },
  
  // 帝政ローマ・パクス＝ロマーナ・五賢帝
  'オクタウィアヌス': { image: 'augustus-princeps', afterImage: 'roman-victory', bubble: 'アクティウムの海戦に勝利し地中海世界を統一！' },
  'アウグストゥス': { image: 'augustus-princeps', bubble: '元首（プリンケプス）として元首政を創始！' },
  'アグリッパ': { image: 'scipio-africanus', bubble: '海戦を勝利に導き万神殿（パンテオン）を建造' },
  'ネロ': { image: 'emperor-severe', bubble: 'ローマ大火の責任をキリスト教徒に着せ迫害！' },
  'ネルウァ': { image: 'roman-emperor', bubble: '五賢帝の初代として善政を開始する' },
  'トラヤヌス': { image: 'roman-emperor', bubble: 'ダキアやメソポタミアを獲得しローマ領土最大！' },
  'ハドリアヌス': { image: 'roman-emperor', bubble: '防衛線を固めブリタニアに長城を築く！' },
  'アントニヌス＝ピウス': { image: 'roman-emperor', bubble: '内政を整え平和な統治を継続する' },
  'マルクス＝アウレリウス＝アントニヌス': { image: 'roman-emperor', bubble: 'ストア派哲学者として『自省録』を記す（哲人皇帝）' },
  
  // 3世紀の危機・専制君主政
  'セプティミウス＝セウェルス': { image: 'emperor-severe', bubble: '軍人皇帝時代の先駆けとして軍隊を優遇' },
  'セウェルス帝': { image: 'emperor-severe', bubble: '軍隊の支持を基盤に帝国を統制' },
  'カラカラ': { image: 'emperor-severe', bubble: 'アントニヌス勅令を発布し全自由民に市民権を付与！' },
  'マクシミヌス': { image: 'emperor-severe', bubble: '軍人皇帝として辺境防衛に奔走' },
  'ウァレリアヌス': { image: 'valerian-captive', bubble: 'エデッサの戦いでササン朝の捕虜となってしまった…' },
  'ディオクレティアヌス': { image: 'emperor-severe', bubble: '四分統治（テトラルキア）を敷き専制君主政を開始！' },
  'コンスタンティヌス': { image: 'roman-emperor', bubble: 'ミラノ勅令でキリスト教を公認しコンスタンティノープルへ遷都！' },
  'ユリアヌス': { image: 'roman-scholar', bubble: '古来の多神教を復興しようと試みる（背教者）' },
  'テオドシウス': { image: 'roman-emperor', bubble: 'キリスト教を国教化し、死後に帝国を東西に分割' },
  'テオドシウス2世': { image: 'roman-emperor', bubble: 'コンスタンティノープルに三重の大城壁を構築' },
  'マルキアヌス': { image: 'roman-emperor', bubble: 'カルケドン公会議を招集' },
  'アルカディウス': { image: 'roman-emperor', bubble: '東ローマ帝国の初代皇帝となる' },
  'ホノリウス': { image: 'roman-emperor', bubble: 'ラヴェンナへ逃れ西ローマ帝国を統治' },
  'オドアケル': { image: 'germanic-warrior', bubble: '西ローマ皇帝ロムルスを廃位し西ローマ帝国滅亡！' },
  'ロムルス': { image: 'greek-defeated', bubble: '西ローマ最後の皇帝として廃位される…' },
  
  // キリスト教の成立と普及
  'イエス': { image: 'jesus-calm', bubble: '神の愛と隣人愛を説き、心の貧しき者を救う' },
  'ピラトゥス': { image: 'roman-consul', bubble: 'ユダヤの総督としてイエスの処刑を宣告' },
  'ピラト': { image: 'roman-consul', bubble: 'ユダヤの総督としてイエスの処刑を宣告' },
  'ペテロ': { image: 'christian-apostle', bubble: '使徒の筆頭としてローマで殉教（初代教皇）' },
  'パウロ': { image: 'christian-apostle', bubble: '異邦人への伝道を行い世界宗教への道を開く！' },
  'ヒエロニムス': { image: 'christian-apostle', bubble: '聖書をラテン語に翻訳（ヴルガータ訳）' },
  'エウセビオス': { image: 'roman-scholar', bubble: 'キリスト教史観に基づく『教会史』を著す' },
  'アウグスティヌス': { image: 'christian-apostle', bubble: '『神の国』『告白録』を著し正統教義を確立' },
  
  // ローマ文化・学問
  'キケロ': { image: 'roman-scholar', bubble: '雄弁家・哲学者としてラテン散文の完成者' },
  'ウェルギリウス': { image: 'roman-scholar', bubble: 'ローマ建国叙事詩『アエネイス』を著す' },
  'ホラティウス': { image: 'roman-scholar', bubble: '『叙情詩集』を著すローマ文学の黄金期' },
  'オウィディウス': { image: 'roman-scholar', bubble: '神話を集めた『変身物語』を著す' },
  'セネカ': { image: 'roman-scholar', bubble: 'ストア派哲学者・ネロ帝の師として『幸福論』を著す' },
  'エピクテトス': { image: 'roman-scholar', bubble: '奴隷出身のストア派哲学者' },
  'プロティノス': { image: 'roman-scholar', bubble: '新プラトン主義を創始' },
  'ポリビオス': { image: 'roman-scholar', bubble: '政体循環論を唱えローマの発展を分析' },
  'リウィウス': { image: 'roman-scholar', bubble: 'ローマ建国からの歴史を描く『ローマ史』を著す' },
  'ストラボン': { image: 'roman-scholar', bubble: '当時の地中海世界の地理を網羅した『地理誌』を著す' },
  'プルタルコス': { image: 'roman-scholar', bubble: 'ギリシアとローマの英雄を比較した『対比列伝』を著す' },
  'プリニウス': { image: 'roman-scholar', bubble: '古代の百科全書『博物誌』を著す' },
  'プトレマイオス': { image: 'roman-scholar', bubble: '天動説（地球中心説）を集大成した天文学者' },
  
  // その他
  'コペルニクス': { image: 'roman-scholar', bubble: '近代地動説を提唱' },
  'シェークスピア': { image: 'roman-scholar', bubble: '『ジュリアス・シーザー』などを劇作' }
};

export const propInfo = {
  'クノッソス宮殿': { image: 'knossos-palace', size: 84 },
  'パルテノン神殿': { image: 'greek-temple', size: 80 },
  'アクロポリス': { image: 'greek-temple', size: 80 },
  'アポロン神殿': { image: 'greek-temple', size: 76 },
  'ゼウス神殿': { image: 'greek-temple', size: 76 },
  'ムセイオン': { image: 'knossos-palace', size: 76 },
  'アカデメイア': { image: 'greek-temple', size: 76 },
  'リュケイオン': { image: 'greek-temple', size: 76 },
  'アゴラ': { image: 'greek-temple', size: 76 },
  'アッピア街道': { image: 'appian-way', size: 80 },
  'フォルム': { image: 'triumphal-arch', size: 76 },
  '元老院議事堂': { image: 'triumphal-arch', size: 76 },
  '凱旋門': { image: 'triumphal-arch', size: 76 },
  'パンテオン': { image: 'pantheon', size: 80 },
  '万神殿': { image: 'pantheon', size: 80 },
  'コロッセウム': { image: 'colosseum', size: 84 },
  'カラカラ浴場': { image: 'colosseum', size: 80 },
  'ガール水道橋': { image: 'roman-aqueduct', size: 80 },
  'カタコンベ': { image: 'catacomb', size: 80 },
  'ハドリアヌスの長城': { image: 'hadrian-wall', size: 80 }
};

export const customSceneRules = {
  // エーゲ文明
  'c02-l04-p01-002': {
    extraActors: [
      { name: 'エヴァンズ', at: [25.16, 35.3], image: 'thales-philosopher', bubble: 'クレタ島のクノッソス宮殿を発掘！' }
    ]
  },
  'c02-l04-p01-004': {
    extraActors: [
      { name: 'シュリーマン', at: [22.75, 37.73], image: 'thales-philosopher', bubble: 'ミケーネとトロイアの遺跡を発掘！' }
    ]
  },
  'c02-l04-p01-006': {
    extraActors: [
      { name: 'アガメムノン', at: [22.75, 37.73], image: 'philip2-macedon', bubble: 'ミケーネの王としてトロイアを攻め落とす！' }
    ]
  },
  // ギリシア世界の誕生・植民活動
  'c02-l04-p02-003': {
    extraProps: [
      { name: 'アテネ', at: [23.73, 37.98], image: 'greek-trireme', kind: 'prop', size: 76 }
    ]
  },
  // スパルタの国制
  'c02-l04-p03-001': {
    extraActors: [
      { name: 'リュクルゴス', at: [22.43, 37.08], image: 'lycurgus-spartan', bubble: 'ヘイロータイを支配するため軍国主義の規律を定める！' }
    ]
  },
  'c02-l04-p03-002': {
    extraActors: [
      { name: 'スパルタ', at: [22.43, 37.08], image: 'spartan-phalanx', bubble: '幼少期から過酷な訓練を受け無敵の重装歩兵へ！' }
    ]
  },
  // アテネ民主政の発展
  'c02-l04-p04-001': {
    extraActors: [
      { name: 'ソロン', at: [23.73, 37.98], image: 'solon-reformer', bubble: '借財を帳消しにし市民の債務奴隷化を禁止！' }
    ]
  },
  'c02-l04-p04-002': {
    extraActors: [
      { name: 'ペイシストラトス', at: [23.73, 37.98], image: 'peisistratos-tyrant', bubble: '中小農民を保護し僭主として君臨！' },
      { name: 'ヒッピアス', at: [23.73, 37.98], image: 'hippias-exile', bubble: '暴政を行いアテネ市民によって追放される', offset: [-24, 0] }
    ]
  },
  'c02-l04-p04-003': {
    extraActors: [
      { name: 'クレイステネス', at: [23.73, 37.98], image: 'cleisthenes-democrat', bubble: '部族制を再編し陶片追放で独裁を防ぐ！' }
    ],
    extraProps: [
      { name: 'アテネ', at: [23.73, 37.98], image: 'ostrakon', kind: 'prop', size: 70 }
    ]
  },
  // ペルシア戦争
  'c02-l04-p05-001': {
    extraActors: [
      { name: 'アケメネス朝', at: [27.28, 37.53], image: 'persian-immortal', bubble: 'イオニア植民市の反乱を鎮圧せよ！' }
    ]
  },
  'c02-l04-p05-002': {
    battle: 'マラトン',
    routeActor: { name: 'ペルシア', route: 0, image: 'persian-immortal', afterImage: 'darius3-worried', bubble: 'ギリシア本土への第2回遠征軍を出撃！' },
    extraActors: [
      { name: 'ミルティアデス', at: [23.96, 38.15], image: 'miltiades-general', afterImage: 'roman-victory', bubble: 'マラトンの平野で重装歩兵がペルシア軍を挟撃！', offset: [-25, -15] }
    ]
  },
  'c02-l04-p05-004': {
    battle: 'テルモピレー',
    extraActors: [
      { name: 'レオニダス', at: [22.53, 38.8], image: 'leonidas-spartan', afterImage: 'greek-defeated', bubble: '狭隘の地テルモピレーで300名と死守する！' },
      { name: 'クセルクセス1世', at: [23.5, 39.2], image: 'persian-immortal', bubble: '大軍をもって突破しアテネを焼き払え！' }
    ]
  },
  'c02-l04-p05-005': {
    battle: 'サラミス',
    extraActors: [
      { name: 'テミストクレス', at: [23.4, 37.95], image: 'themistocles-naval', afterImage: 'roman-victory', bubble: '狭いサラミス湾へ誘い込み敵艦隊を撃滅せよ！' }
    ],
    extraProps: [
      { name: 'サラミス湾', at: [23.4, 37.95], image: 'greek-trireme', kind: 'prop', size: 84 }
    ]
  },
  'c02-l04-p05-006': {
    battle: 'プラタイア',
    extraActors: [
      { name: 'プラタイア', at: [23.27, 38.21], image: 'spartan-phalanx', afterImage: 'roman-victory', bubble: 'スパルタとアテネの連合軍がペルシア陸軍を壊滅！' }
    ]
  },
  // アテネ民主政の完成
  'c02-l05-p01-001': {
    extraActors: [
      { name: 'ペリクレス', at: [23.73, 37.98], image: 'pericles-statesman', bubble: '民会を最高機関とし、成年男性市民全員による直接民主政を実現！' }
    ],
    extraProps: [
      { name: 'アテネ', at: [23.73, 37.98], image: 'greek-temple', kind: 'prop', size: 80 }
    ]
  },
  // ペロポネソス戦争とポリス崩壊
  'c02-l05-p02-001': {
    extraActors: [
      { name: 'アテネ', at: [23.73, 37.98], image: 'pericles-statesman', bubble: 'デロス同盟の盟主として海上帝国を維持' },
      { name: 'スパルタ', at: [22.43, 37.08], image: 'spartan-phalanx', bubble: 'ペロポネソス同盟を率いてアテネに挑戦！' }
    ]
  },
  'c02-l05-p02-005': {
    battle: 'レウクトラ',
    extraActors: [
      { name: 'エパメイノンダス', at: [23.21, 38.32], image: 'miltiades-general', afterImage: 'roman-victory', bubble: '革新的な斜線陣でスパルタの覇権を打破！' }
    ]
  },
  'c02-l05-p02-008': {
    battle: 'カイロネイア',
    extraActors: [
      { name: 'フィリッポス2世', at: [22.84, 38.49], image: 'philip2-macedon', afterImage: 'roman-victory', bubble: 'カイロネイアの戦いに勝利しコリントス同盟を結成！' }
    ]
  },
  // アレクサンドロス大王の遠征
  'c02-l05-p03-002': {
    battle: 'イッソス',
    routeActor: { name: 'アナトリア', route: 0, image: 'alexander-march', afterImage: 'alexander-triumph', bubble: 'イッソスの戦いでペルシア軍本隊を撃破！' },
    extraActors: [
      { name: 'ダレイオス3世', at: [36.2, 36.84], image: 'darius3-worried', bubble: 'アレクサンドロスの突撃に退却を余儀なくされる…' }
    ]
  },
  'c02-l05-p03-003': {
    battle: 'ガウガメラ',
    extraActors: [
      { name: 'アレクサンドロス', at: [43.44, 36.54], image: 'alexander-march', afterImage: 'alexander-triumph', bubble: 'ガウガメラの決戦でペルシア帝国を完全に粉砕！' },
      { name: 'ダレイオス3世', at: [44, 36], image: 'darius3-worried', bubble: '帝国崩壊…逃亡の果てに落命…' }
    ]
  },
  'c02-l05-p03-004': {
    routeActor: { name: 'バビロン', route: 0, image: 'alexander-march', afterImage: 'alexander-triumph', bubble: 'ペルセポリスの宮殿を焼き尽くし東方へ進軍！' }
  },
  'c02-l05-p03-005': {
    routeActor: { name: 'バクトリア', route: 0, image: 'alexander-march', afterImage: 'alexander-triumph', bubble: 'インダス川流域まで到達し世界帝国を建設！' }
  },
  // ギリシア文化
  'c02-l05-p04-007': {
    extraActors: [
      { name: 'ソクラテス', at: [23.73, 37.98], image: 'socrates-philosopher', bubble: '無知の知――自分が何も知らないことを知れ' }
    ]
  },
  'c02-l05-p04-008': {
    extraActors: [
      { name: 'プラトン', at: [23.71, 38.0], image: 'plato-philosopher', bubble: 'アカデメイアを開き、イデア論と哲人政治を説く' }
    ]
  },
  'c02-l05-p04-009': {
    extraActors: [
      { name: 'アリストテレス', at: [23.74, 37.97], image: 'aristotle-philosopher', bubble: 'リュケイオンを創設し万般の学問を体系化（万学の祖）' }
    ]
  },
  // ローマ共和政の成立・身分闘争
  'c02-l06-p01-002': {
    extraActors: [
      { name: 'ローマ', at: [12.5, 41.9], image: 'roman-consul', bubble: '貴族（パトリキ）が元老院とコンスルを独占' }
    ]
  },
  'c02-l06-p06-001': {
    extraActors: [
      { name: 'ローマ', at: [12.5, 41.9], image: 'roman-plebeian', bubble: '平民（プレブス）が護民官や十二表法を獲得！' }
    ]
  },
  // ポエニ戦争
  'c02-l06-p04-003': {
    battle: 'カンネー',
    routeActor: { name: 'アルプス', route: 0, image: 'hannibal-march', afterImage: 'hannibal-barker', bubble: '戦象を率いてアルプスを越えカンネーで大包囲殲滅！' },
    extraActors: [
      { name: 'ローマ', at: [16.15, 41.3], image: 'roman-legionary', afterImage: 'greek-defeated', bubble: 'ハンニバルの包囲戦術の前に大敗北を喫する…' }
    ]
  },
  'c02-l06-p04-004': {
    battle: 'ザマ',
    routeActor: { name: '北アフリカ', route: 0, image: 'scipio-africanus', afterImage: 'roman-victory', bubble: 'カルタゴ本土へ侵攻しザマでハンニバルを撃破！' },
    extraActors: [
      { name: 'カルタゴ', at: [9.3, 36.0], image: 'hannibal-barker', afterImage: 'soldier-retreat', bubble: 'ザマの地でついに敗れ去る…' }
    ]
  },
  'c02-l06-p04-009': {
    extraActors: [
      { name: 'グラックス兄弟', at: [12.5, 41.9], image: 'tiberius-gracchus', bubble: '中小農民の没落を救うため土地改革を訴える！' }
    ]
  },
  // 内乱の1世紀・カエサル
  'c02-l06-p05-002': {
    extraActors: [
      { name: 'スパルタクス', at: [14.2, 41.1], image: 'spartacus-gladiator', afterImage: 'greek-defeated', bubble: '自由を求めて立ち上がりローマ軍を何度も破る！' }
    ]
  },
  'c02-l06-p05-004': {
    routeActor: { name: 'ガリア', route: 0, image: 'caesar-march', afterImage: 'caesar-general', bubble: '賽は投げられた！ルビコン川を渡りローマへ進撃！' }
  },
  'c02-l06-p05-005': {
    extraActors: [
      { name: 'カエサル', at: [12.5, 41.9], image: 'caesar-general', bubble: '終身独裁官となり太陽暦導入など改革を推進' },
      { name: 'ブルートゥス', at: [12.49, 41.89], image: 'roman-consul', bubble: '「ブルートゥス、お前もか」――独裁者を暗殺' }
    ]
  },
  'c02-l06-p05-007': {
    battle: 'アクティウム',
    extraActors: [
      { name: 'オクタウィアヌス', at: [20.77, 38.94], image: 'augustus-princeps', afterImage: 'roman-victory', bubble: 'アクティウムの海戦に勝利しエジプトを属州化！' },
      { name: 'アントニウス', at: [21.5, 38.5], image: 'scipio-africanus', afterImage: 'soldier-retreat', bubble: '敗北しクレオパトラとともに自害…' }
    ],
    extraProps: [
      { name: 'アクティウム', at: [20.77, 38.94], image: 'greek-trireme', kind: 'prop', size: 80 }
    ]
  },
  // ローマ帝国とパクス＝ロマーナ
  'c02-l07-p01-001': {
    extraActors: [
      { name: 'アウグストゥス', at: [12.5, 41.9], image: 'augustus-princeps', bubble: '尊厳者（アウグストゥス）の称号を受け元首政を開始！' }
    ]
  },
  'c02-l07-p01-008': {
    extraActors: [
      { name: 'トラヤヌス', at: [12.5, 41.9], image: 'roman-emperor', bubble: 'ダキアやメソポタミアを制圧しローマ帝国領土最大！' }
    ]
  },
  'c02-l07-p01-009': {
    extraActors: [
      { name: 'ハドリアヌス', at: [12.5, 41.9], image: 'roman-emperor', bubble: 'ブリタニアに長城を築き帝国防衛ラインを固める' }
    ],
    extraProps: [
      { name: 'ブリテン島', at: [-2.4, 55.0], image: 'hadrian-wall', kind: 'prop', size: 84 }
    ]
  },
  'c02-l07-p01-010': {
    extraActors: [
      { name: 'マルクス＝アウレリウス＝アントニヌス', at: [12.5, 41.9], image: 'roman-emperor', bubble: '陣中で『自省録』を記した哲人皇帝、五賢帝の最後' }
    ]
  },
  // 3世紀の危機
  'c02-l07-p02-003': {
    extraActors: [
      { name: 'カラカラ', at: [12.5, 41.9], image: 'emperor-severe', bubble: 'アントニヌス勅令で全自由民にローマ市民権を付与！' }
    ]
  },
  'c02-l07-p02-006': {
    extraActors: [
      { name: 'ウァレリアヌス', at: [12.5, 41.9], image: 'valerian-captive', bubble: 'ササン朝シャープール1世に捕らえられ虜囚となる…' }
    ]
  },
  // 専制君主政と東西分裂
  'c02-l07-p03-001': {
    extraActors: [
      { name: 'ディオクレティアヌス', at: [29.92, 40.77], image: 'emperor-severe', bubble: '四分統治（テトラルキア）を創始し専制君主政（ドミナートゥス）へ！' }
    ]
  },
  'c02-l07-p03-003': {
    extraActors: [
      { name: 'コンスタンティヌス', at: [28.98, 41.01], image: 'roman-emperor', bubble: 'ミラノ勅令でキリスト教を公認し、ビザンティウムへ遷都！' }
    ]
  },
  'c02-l07-p03-007': {
    extraActors: [
      { name: 'テオドシウス', at: [28.98, 41.01], image: 'roman-emperor', bubble: 'キリスト教を国教化し、死後に帝国を東西に分割' }
    ]
  },
  'c02-l07-p03-008': {
    extraActors: [
      { name: 'オドアケル', at: [12.2, 44.42], image: 'germanic-warrior', bubble: '西ローマ皇帝ロムルス＝アウグストゥルスを廃位！' },
      { name: 'ロムルス', at: [12.5, 41.9], image: 'greek-defeated', bubble: '西ローマ帝国最後の皇帝として廃位される…' }
    ]
  },
  // キリスト教の成立
  'c02-l07-p04-002': {
    extraActors: [
      { name: 'イエス', at: [35.23, 31.78], image: 'jesus-calm', bubble: '神への愛と隣人愛を説き、心の貧しき者を祝福する' }
    ]
  },
  'c02-l07-p04-004': {
    routeActor: { name: 'パレスチナ', route: 0, image: 'christian-apostle', bubble: '異邦人への伝道旅行を行い世界宗教へ発展！' }
  },
  'c02-l07-p04-006': {
    extraActors: [
      { name: 'ペテロ', at: [12.5, 41.9], image: 'christian-apostle', bubble: '迫害を受けながらも地下墓所カタコンベで信仰を守る' }
    ],
    extraProps: [
      { name: 'ローマ', at: [12.51, 41.86], image: 'catacomb', kind: 'prop', size: 84 }
    ]
  },
  'c02-l07-p04-009': {
    extraActors: [
      { name: 'アウグスティヌス', at: [7.76, 36.89], image: 'christian-apostle', bubble: '『神の国』『告白録』を著し最大の教父として正統教義を確立' }
    ]
  },
  // ローマ文化
  'c02-l07-p05-006': {
    extraProps: [
      { name: 'ローマ', at: [12.49, 41.89], image: 'colosseum', kind: 'prop', size: 88 }
    ]
  }
};

const routes = [
  [
    4,
    342,
    "アケメネス朝",
    "ミレトス",
    "campaign",
    [
      [52.8, 29.9],
      [44, 34],
      [36, 37],
      [27.3, 37.5]
    ]
  ],
  [
    4,
    376,
    "ペルシア",
    "マラトン",
    "campaign",
    [
      [27.3, 38],
      [26, 38],
      [24, 38.15]
    ]
  ],
  [
    5,
    180,
    "アナトリア",
    "イッソス",
    "campaign",
    [
      [27.23, 40.32],
      [30, 38],
      [33, 37],
      [36.2, 36.84]
    ]
  ],
  [
    5,
    184,
    "地中海東岸",
    "エジプト",
    "campaign",
    [
      [35.2, 33.3],
      [34, 31],
      [29.9, 31.2]
    ]
  ],
  [
    5,
    223,
    "バビロン",
    "ペルセポリス",
    "campaign",
    [
      [44.42, 32.54],
      [48.26, 32.19],
      [52.89, 29.93]
    ]
  ],
  [
    5,
    227,
    "バクトリア",
    "インダス川",
    "campaign",
    [
      [67, 37],
      [70, 35],
      [72, 33],
      [71, 30]
    ]
  ],
  [
    6,
    202,
    "アルプス",
    "カンネー",
    "campaign",
    [
      [6.5, 46.5],
      [8, 45],
      [12, 43],
      [16.15, 41.3]
    ]
  ],
  [
    6,
    204,
    "北アフリカ",
    "ザマ",
    "campaign",
    [
      [10.32, 36.85],
      [9.3, 36]
    ]
  ],
  [
    6,
    363,
    "ガリア",
    "ローマ",
    "campaign",
    [
      [3, 47],
      [8, 45],
      [12.42, 44.13],
      [12.5, 41.9]
    ]
  ],
  [
    7,
    371,
    "パレスチナ",
    "ギリシア",
    "move",
    [
      [35.2, 31.8],
      [36, 36],
      [30, 38],
      [23.7, 38]
    ]
  ]
];

const edition={},plans=[];
for(const volume of chapterSeries) {
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)) {
    const selected=page.passages.map(({paragraph,start,end})=>({p:paragraphById.get(paragraph),start,end}));
    const plainBody=selected.map(({p,start,end})=>p.text.slice(start,end));
    const body=selected.map(({p,start,end})=>decorate(p.text,boldSpans(p.markdown),start,end));
    const text=plainBody.join(''),title=page.title;
    const fullText = title + '。' + text;
    const names=chapterNamesInText(fullText);
    const pins={},tags=[],props=[];
    const actors=[];

    const id=`${volume.id}-${String(edition[volume.id].length+1).padStart(3,'0')}`;
    const rule = customSceneRules[id] || {};

const ensurePng = name => {
  const p = name.includes('/') ? name : `ancient/${name}`;
  return p.endsWith('.png') ? p : `${p}.png`;
};

// ... edition generation ...
    // 基本の名前分類
    for(const entry of names) {
      if(entry.kind==='person') {
        const p = personInfo[entry.name];
        const defaultImage = /ギリシア|アテネ|スパルタ|ペルシア戦争/.test(fullText) ? 'athenian-general' : /ローマ|元老院|皇帝|カエサル/.test(fullText) ? 'roman-consul' : 'greek-philosopher';
        const actor = {
          name: entry.name,
          at: entry.points[0],
          image: ensurePng(p?.image ?? defaultImage),
          bubble: p?.bubble ?? ''
        };
        if(p?.offset) actor.offset = p.offset;
        if(p?.afterImage) actor.afterImage = ensurePng(p.afterImage);
        actors.push(actor);
      } else if(entry.kind==='building') {
        const b = propInfo[entry.name];
        if(b) {
          props.push({name:entry.name, at:entry.points[0], image: ensurePng(b.image), kind:'prop', size: b.size});
        } else {
          const symbol=/ピラミッド|スフィンクス/.test(entry.name)?'pyramid-giza':/コロッセウム|劇場|円形/.test(entry.name)?'colosseum':/パンテオン|万神殿/.test(entry.name)?'pantheon':'greek-temple';
          props.push({name:entry.name, at:entry.points[0], image: ensurePng(symbol), kind:'prop', size:42});
        }
      } else if(entry.kind==='place') {
        pins[entry.name]={name:entry.name,point:entry.points[0]};
      } else {
        tags.push({text:entry.name,at:entry.points[0]});
      }
    }

    // ルート判定
    const activeRoutes=routes.filter(([lesson,line,from,to])=>selected.some(({p})=>p.lesson===lesson&&p.source[0].line===line)&&text.includes(from)&&text.includes(to))
      .map(([,,,,kind,points])=>({kind,points,start:0.08,end:0.95}));

    // ルート連動アクター
    if (activeRoutes.length > 0) {
      if (rule.routeActor) {
        const ra = { ...rule.routeActor, image: ensurePng(rule.routeActor.image) };
        if (ra.afterImage) ra.afterImage = ensurePng(ra.afterImage);
        const idx = actors.findIndex(a => normalizeMapName(a.name) === normalizeMapName(ra.name));
        if (idx >= 0) {
          actors[idx] = { ...actors[idx], ...ra };
        } else if (normalizeMapName(fullText).includes(normalizeMapName(ra.name))) {
          actors.push({ at: activeRoutes[ra.route]?.points[0] ?? [0,0], ...ra });
        }
      } else if (actors.length > 0 && actors[0].route === undefined) {
        actors[0].route = 0;
      }
    } else {
      for (const a of actors) delete a.route;
    }

    // 目的地の対決・迎撃アクター
    if (rule.targetActor && normalizeMapName(fullText).includes(normalizeMapName(rule.targetActor.name))) {
      const ta = { ...rule.targetActor, image: ensurePng(rule.targetActor.image) };
      if (ta.afterImage) ta.afterImage = ensurePng(ta.afterImage);
      actors.push(ta);
    }

    // 追加アクター
    if (rule.extraActors) {
      for (const ea of rule.extraActors) {
        if (normalizeMapName(fullText).includes(normalizeMapName(ea.name)) && !actors.some(a => normalizeMapName(a.name) === normalizeMapName(ea.name))) {
          const item = { ...ea, image: ensurePng(ea.image) };
          if (item.afterImage) item.afterImage = ensurePng(item.afterImage);
          if (activeRoutes.length === 0 || item.route >= activeRoutes.length) delete item.route;
          actors.push(item);
        }
      }
    }

    // 追加プロップ
    if (rule.extraProps) {
      for (const ep of rule.extraProps) {
        if (normalizeMapName(fullText).includes(normalizeMapName(ep.name)) && !props.some(p => normalizeMapName(p.name) === normalizeMapName(ep.name))) {
          props.push({ ...ep, image: ensurePng(ep.image) });
        }
      }
    }

    // もし人物が1人もいないページなら、本文中に実在する地名・地域名から象徴アクターを安全に配置
    if (actors.length === 0) {
      const candidate = names.find(n => n.kind === 'region' || n.kind === 'place');
      if (candidate) {
        const cName = candidate.name;
        const defaultImage = /スパルタ/.test(cName) ? 'spartan-phalanx'
          : /アテネ|ギリシア/.test(cName) ? 'pericles-statesman'
          : /マケドニア/.test(cName) ? 'philip2-macedon'
          : /カルタゴ/.test(cName) ? 'hannibal-barker'
          : /ローマ|イタリア/.test(cName) ? (/皇帝|元首|パクス/.test(fullText) ? 'augustus-princeps' : 'roman-consul')
          : /キリスト|パレスチナ/.test(cName) ? 'christian-apostle'
          : /エジプト/.test(cName) ? 'pharaoh-calm'
          : 'thales-philosopher';
        actors.push({
          name: candidate.name,
          at: candidate.points[0],
          image: ensurePng(defaultImage),
          bubble: ''
        });
      }
    }

    // 重複位置アクターの微細オフセット調整
    const posCounts = {};
    for (const a of actors) {
      const k = `${a.at[0].toFixed(2)},${a.at[1].toFixed(2)}`;
      posCounts[k] = (posCounts[k] || 0) + 1;
      if (posCounts[k] > 1 && !a.offset) {
        a.offset = [posCounts[k] % 2 === 0 ? -24 * (posCounts[k] / 2) : 24 * Math.floor(posCounts[k] / 2), 0];
      }
    }

    // 画面枠の決定
    const points = [...names.flatMap(n=>n.points), ...actors.map(a=>a.at), ...props.map(p=>p.at)];
    const fallback = [-12,28,40,60];
    const frame = points.length ? [
      Math.min(...points.map(p=>p[0]))-5,
      Math.min(...points.map(p=>p[1]))-5,
      Math.max(...points.map(p=>p[0]))+5,
      Math.max(...points.map(p=>p[1]))+5
    ] : fallback;

    const s = {
      id,
      title,
      body,
      plainBody,
      year: volume.period,
      chapter: 2,
      kicker: volume.label,
      sourceText: {
        chapter: 2,
        passages: page.passages,
        page: selected[0].p.page
      },
      frame,
      pins: Object.keys(pins),
      tags,
      zones: [],
      actors,
      props,
      routes: activeRoutes,
      rivers: chapterRivers.filter(r=>text.includes(r.name)),
      duration: activeRoutes.length ? 2200 : 0,
      facts: [title],
      mapHeading: title,
      focus: title,
      before: title,
      after: title,
      note: '',
      takeaway: ''
    };

    if (rule.battle) s.battle = rule.battle;

    edition[volume.id].push(s);
    plans.push({id, ...page});
  }
}

const places = Object.fromEntries(
  Object.values(edition).flat().flatMap(s => s.pins.map(name => [name, { name, point: chapterNamesInText(name)[0].points[0] }]))
);

await write('public/chapter-02-edition.js', `// 原文の対応記録から生成。編集は docs/chapter-02 と生成処理へ。\nexport const chapterEdition = ${JSON.stringify(edition,null,2)};\nexport const chapterPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/chapter-02/page-plan.json', JSON.stringify(plans,null,2)+'\n');

console.log('第2章: ' + chapterSeries.length + '節・' + plans.length + 'ページのデータ再生成完了');
