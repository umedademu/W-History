import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {ancientSeries} from '../public/ancient-volumes.js';
import {ancientNamesInText,ancientRivers} from '../public/ancient-geography.js';
import {normalizeMapName} from '../public/map-name-coverage.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/ancient-orient/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/ancient-orient/reading-plan.json'));
const paragraphById = new Map(paragraphs.map(p=>[p.id,p]));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function boldSpans(markdown) {
  let plain='',start=null;const spans=[];
  for(let i=0;i<markdown.length;) {
    if(markdown.slice(i,i+2)==='**') {
      if(start===null)start=plain.length;else {spans.push([start,plain.length]);start=null;}
      i+=2;
    }else plain+=markdown[i++];
  }
  if(start!==null)throw Error('原文の太字記号が閉じていません');
  return spans;
}
function decorate(text,spans,start,end) {
  const bounds=[...new Set([start,end,...spans.flat().filter(i=>i>start&&i<end)])].sort((a,b)=>a-b);
  return bounds.slice(0,-1).map((a,i)=>{
    const b=bounds[i+1],value=escape(text.slice(a,b));
    return spans.some(([x,y])=>x<=a&&y>=b)?`<span class="source-bold">${value}</span>`:value;
  }).join('');
}
// 改ページは通読済みの構成表に従う。段落ごとの文字数では再分割しない。
assert.deepEqual([...new Set(readingPlan.map(p=>p.volume))],ancientSeries.map(v=>v.id));
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

// 原文の移動・征服・交易の記述に対応する概略経路。
// 一つの表示ページに両端の名前がある場合に限って描く。
const routes = [
  [1,173,'ヒッタイト','古バビロニア王国','campaign',[[34.62,40.02],[37,37],[40,35],[44.42,32.54]]],
  [1,209,'上エジプト','下エジプト','campaign',[[32.6,25.7],[31,28],[31,30.5]]],
  [1,273,'シリア','下エジプト','campaign',[[38,35],[35,31.5],[32.5,30.5],[31,30.5]]],
  [1,279,'トトメス3世','シリア','campaign',[[32.6,25.7],[31,30],[35,32],[38,35]]],
  [1,279,'トトメス3世','ヌビア','campaign',[[32.6,25.7],[31,22],[31,20]]],
  [1,325,'下エジプト','カデシュ','campaign',[[31,30.5],[35,32],[36.52,34.56]]],
  [1,325,'ヒッタイト','カデシュ','rival',[[34.62,40.02],[36,37],[36.52,34.56]]],
  [2,92,'ティルス','カルタゴ','trade',[[35.2,33.27],[31,34],[25,34.5],[18,34.5],[10.32,36.85]]],
  [2,113,'エジプト','パレスチナ','move',[[31,30],[33,29.5],[35,31.5]]],
  [2,127,'ユダ王国','バビロン','move',[[35.2,31.6],[37,34],[40,35],[44.42,32.54]]],
  [2,272,'メディア','リディア','campaign',[[48.5,35],[43,37],[37,39],[28,38.5]]],
  [2,297,'スサ','サルデス','trade',[[48.26,32.19],[43.2,36],[39,38],[35,39],[28.04,38.49]]],
  [2,362,'イッソス','アルベラ','campaign',[[36.2,36.84],[39,37],[43.73,36.36]]],
  [2,402,'ローマ','中国','trade',[[12.5,41.9],[29,40],[44,35],[58,37],[70,40],[88,42],[108,34]]],
  [2,433,'ササン朝','インダス','campaign',[[52,31],[60,30],[66,30],[70,29]]],
  [3,79,'カイバル峠','パンジャーブ','move',[[71.1,34.07],[72.3,33],[73.5,31]]],
  [3,91,'インダス','ガンジス','move',[[71,30],[75,29],[79,27],[82,25.5]]],
  [3,269,'マウリヤ朝','カリンガ','campaign',[[85.18,25.61],[85.5,23],[85,20]]],
  [3,285,'インド','スリランカ','move',[[82,18],[81,13],[80.5,10],[80.7,7.6]]],
  [3,354,'ローマ','サータヴァーハナ朝','trade',[[12.5,41.9],[18,34],[29,31],[33,28],[38,19],[44,12],[60,10],[70,13],[73,18]]],
  [3,448,'スリランカ','タイ','move',[[80.7,7.6],[87,7],[95,8],[99,12],[101,15]]],
  [3,450,'クシャーナ朝','中国','move',[[72,33],[73,38],[85,42],[97,39],[108,34]]],
  [3,625,'チョーラ朝','スマトラ島','campaign',[[79.13,10.78],[81,10],[90,8],[98,5],[101,-1]]]
];

// 人物・勢力ごとのドット絵画像と吹き出し
const personInfo = {
  'サルゴン1世': { image: 'sargon-king', bubble: 'メソポタミア最初の統一！' },
  'ハンムラビ': { image: 'hammurabi-king', bubble: '目には目を、歯には歯を！' },
  'クフ': { image: 'pharaoh-calm', bubble: 'ギザに大ピラミッドを建設' },
  'トトメス3世': { image: 'thutmose-king', bubble: 'シリアへ遠征し領土を拡大！' },
  'アメンホテプ4世': { image: 'akhenaten-calm', bubble: '唯一神アテンのみを崇拝せよ' },
  'ツタンカーメン': { image: 'tutankhamun-calm', bubble: '伝統的なアメン信仰へ復帰する' },
  'ラメス2世': { image: 'ramesses-warrior', bubble: 'カデシュでヒッタイトと激突！' },
  'オシリス': { image: 'high-priest', bubble: '死者の生前の行いを審問する' },
  'モーセ': { image: 'moses-prophet', bubble: '十戒を胸にカナンの地へ！' },
  'ダヴィデ': { image: 'solomon-king', bubble: 'イェルサレムを都に国を固める', offset: [-30, 0] },
  'ソロモン': { image: 'solomon-king', bubble: 'エルサレムに壮麗な神殿を築く', offset: [30, 0] },
  'ネブカドネザル2世': { image: 'nebuchadnezzar-king', bubble: 'ユダ王国の民をバビロンへ捕囚せよ' },
  'アッシュルバニパル': { image: 'ashurbanipal-king', bubble: '大図書館に粘土板を収集せよ' },
  'キュロス2世': { image: 'cyrus-king', bubble: 'バビロンを解放しユダヤ人を帰還させる' },
  'カンビュセス2世': { image: 'cyrus-king', bubble: 'エジプトを征服しオリエントを再統一' },
  'ダレイオス1世': { image: 'darius-king', bubble: '「王の道」と駅伝制で帝国を統治！' },
  'クセルクセス1世': { image: 'persian-immortal', bubble: 'ギリシア遠征軍を率いて進軍！' },
  'ゾロアスター': { image: 'zoroaster-priest', bubble: '善神アフラ＝マズダの光を拝め' },
  'アレクサンドロス': { image: 'alexander-march', afterImage: 'alexander-happy', bubble: 'ペルシア全土を征服する！' },
  'ダレイオス3世': { image: 'darius3-worried', bubble: 'アレクサンドロスに敗れ去る…' },
  'ミトラダテス1世': { image: 'parthian-horseman', bubble: '東西交易路シルクロードで繁栄！' },
  'アルダシール1世': { image: 'shapur-king', bubble: 'ササン朝を開きペルシアを再興！' },
  'シャープール1世': { image: 'shapur-king', bubble: 'ローマ皇帝ウァレリアヌスを捕縛！' },
  'ウァレリアヌス': { image: 'valerian-captive', bubble: 'ササン朝の捕虜となってしまった…' },
  'ホスロー1世': { image: 'shapur-king', bubble: 'エフタルを挟撃滅亡させ全盛期を築く' },
  'ガウタマ＝シッダールタ': { image: 'buddha-calm', bubble: '四苦八苦を離れ菩提樹の下で悟りを開く' },
  'ヴァルダマーナ': { image: 'mahavira-calm', bubble: '徹底した不殺生（アヒンサー）を説く' },
  'チャンドラグプタ': { image: 'chandragupta-king', bubble: 'マウリヤ朝を開き北インドを統一！' },
  'アショーカ王': { image: 'ashoka-march', afterImage: 'ashoka-calm', bubble: 'ダルマ（法）による平和な統治を広めよう' },
  'カニシカ王': { image: 'kanishka-king', bubble: 'クシャーナ朝の全盛期を築く！' },
  'ナーガールジュナ': { image: 'nagarjuna-monk', bubble: 'すべての執着を離れる「空」の思想を大成' },
  'チャンドラグプタ2世': { image: 'gupta-chandragupta2', bubble: 'グプタ朝の全盛期、古典文化が花開く' },
  'カーリダーサ': { image: 'ancient-scribe', bubble: '戯曲『シャクンタラー』を著す', offset: [-35, 0] },
  'ハルシャ＝ヴァルダナ': { image: 'harsha-king', bubble: '北インドを再統一し仏教を厚く保護' },
  '玄奘': { image: 'xuanzang-monk', bubble: '経典を求めて長安から参りました', offset: [38, 0] }
};

// 建造物・遺物・道具ごとのドット絵
const propInfo = {
  'ピラミッド': { image: 'pyramid-giza', size: 84 },
  'スフィンクス': { image: 'pyramid-giza', size: 80 },
  'ジッグラト': { image: 'ziggurat-temple', size: 76 },
  '死者の書': { image: 'book-of-the-dead', size: 80 },
  'ガンダーラ美術': { image: 'gandhara-buddha', size: 80 },
  'ペルセポリス': { image: 'persepolis-gate', size: 84 },
  'モエンジョ＝ダーロ': { image: 'indus-great-bath', size: 80 }
};

// 各シーンごとのカスタム演出定義
const customSceneRules = {
  'orient-geography-001': {
    extraActors: [
      { name: 'エジプト', at: [30, 27], image: 'egypt-farmer', bubble: 'ナイル川の大河に恵まれる' },
      { name: 'メソポタミア', at: [43, 33], image: 'sumer-citizen', bubble: '大河の灌漑農業で都市文明を形成' }
    ]
  },
  'orient-geography-002': {
    extraActors: [
      { name: 'エジプト', at: [30, 27], image: 'pharaoh-calm', bubble: '砂漠と海に囲まれ閉鎖的で安定' },
      { name: 'メソポタミア', at: [43, 33], image: 'sumer-priest-calm', bubble: '開かれた地形で異民族の侵入が多い' }
    ]
  },
  'orient-geography-003': {
    extraActors: [
      { name: 'エジプト', at: [30, 27], image: 'egypt-farmer', bubble: '定期的な増水で肥沃な土壌がもたらされる' }
    ]
  },
  'orient-geography-004': {
    extraActors: [
      { name: 'メソポタミア', at: [43, 33], image: 'hittite-warrior', bubble: '開放的な地形ゆえに激しい興亡が続く' }
    ]
  },
  'mesopotamia-001': {
    extraActors: [
      { name: 'シュメール人', at: [46.06, 30.96], image: 'sumer-priest-calm', bubble: 'ウル・ウルクなどの都市国家を築く' }
    ]
  },
  'mesopotamia-003': {
    extraActors: [
      { name: 'シュメール人', at: [46.06, 30.96], image: 'ancient-scribe', bubble: '粘土板に絵文字や楔形文字を刻む' }
    ]
  },
  'mesopotamia-004': {
    extraActors: [
      { name: 'シュメール人', at: [46.06, 30.96], image: 'sumer-citizen', bubble: '六十進法や太陰暦など実用的な知識を創出' }
    ]
  },
  'mesopotamia-006': {
    extraActors: [
      { name: 'シュメール人', at: [46.06, 30.96], image: 'sumer-priest-calm', bubble: 'ウル第3王朝のもとでシュメール文化を再興' }
    ]
  },
  'mesopotamia-009': {
    extraActors: [
      { name: 'カッシート', at: [44.42, 32.54], image: 'nomadic-rider', bubble: 'バビロニアへ進出し長く支配する' }
    ]
  },
  'mesopotamia-010': {
    extraActors: [
      { name: 'ヒッタイト', at: [34.62, 40.02], route: 0, image: 'hittite-chariot', bubble: '鉄製武器と戦車で古バビロニアを急襲！' }
    ]
  },
  'ancient-egypt-001': {
    extraActors: [
      { name: 'エジプト', at: [31, 30], image: 'egypt-farmer', bubble: 'ヘロドトスいわく「ナイルのたまもの」' }
    ]
  },
  'ancient-egypt-003': {
    extraActors: [
      { name: 'エジプト', at: [32.6, 25.7], image: 'pharaoh-calm', bubble: 'テーベを都に中王国がエジプトを再統一' }
    ]
  },
  'ancient-egypt-004': {
    extraActors: [
      { name: 'ヒクソス', at: [31.5, 30.8], image: 'hyksos-warrior', bubble: '馬と戦車を用いて下エジプトへ侵入！' }
    ]
  },
  'ancient-egypt-005': {
    extraActors: [
      { name: 'エジプト', at: [32.6, 25.7], image: 'thutmose-king', bubble: 'ヒクソスを追放しオリエントの強国へと躍進' }
    ]
  },
  'ancient-egypt-006': {
    routeActor: { name: 'トトメス3世', route: 0, image: 'thutmose-king', bubble: 'シリアへ遠征しエジプト最大の領土を築く！' }
  },
  'ancient-egypt-009': {
    battle: 'カデシュ',
    routeActor: { name: 'ラメス2世', route: 0, image: 'ramesses-warrior', bubble: 'カデシュでヒッタイトと激突！' },
    extraActors: [
      { name: 'ヒッタイト', at: [34.62, 40.02], route: 1, image: 'hittite-warrior', bubble: 'エジプト軍と互角に対峙する！' }
    ]
  },
  'orient-culture-001': {
    extraActors: [
      { name: 'オリエント', at: [36, 32], image: 'high-priest', bubble: 'エジプトとメソポタミアで異なる文化が発達' }
    ]
  },
  'orient-culture-002': {
    extraActors: [
      { name: 'エジプト', at: [31, 28], image: 'high-priest', bubble: '霊魂不滅を信じ、ミイラを作って来世に備える' }
    ]
  },
  'orient-culture-004': {
    extraActors: [
      { name: 'エジプト', at: [31, 30], image: 'ancient-scribe', bubble: '神聖文字をパピルス草の紙に書き記す' }
    ]
  },
  'orient-culture-005': {
    extraActors: [
      { name: 'エジプト', at: [31, 28], image: 'egypt-farmer', bubble: 'ナイル氾濫の観測から太陽暦と測地術を生み出す' }
    ]
  },
  'orient-culture-006': {
    extraActors: [
      { name: 'エジプト', at: [30, 27], image: 'egypt-farmer', bubble: '太陽暦・測地術・パピルス' },
      { name: 'メソポタミア', at: [43, 33], image: 'sumer-citizen', bubble: '太陰太陽暦・六十進法・粘土板' }
    ]
  },
  'levant-peoples-001': {
    extraActors: [
      { name: 'セム語系民族', at: [35.5, 33], image: 'aramean-merchant', bubble: '東西交易の要衝パレスチナで活動を展開' }
    ]
  },
  'levant-peoples-002': {
    extraActors: [
      { name: '海の民', at: [35, 34], image: 'sea-peoples', bubble: '地中海東岸を襲撃しヒッタイトを滅ぼす！' }
    ]
  },
  'levant-peoples-003': {
    extraActors: [
      { name: 'アラム人', at: [36.29, 33.51], image: 'aramean-merchant', bubble: 'ダマスクスを中心に内陸中継貿易でアラム語を広める' }
    ]
  },
  'levant-peoples-004': {
    extraActors: [
      { name: 'フェニキア人', at: [35.2, 33.27], route: 0, image: 'phoenician-merchant', bubble: '地中海を越えて植民市カルタゴを建設！' }
    ],
    extraProps: [
      { name: 'カルタゴ', at: [10.32, 36.85], image: 'phoenician-galley', kind: 'prop', size: 80 }
    ]
  },
  'levant-peoples-005': {
    extraActors: [
      { name: 'フェニキア人', at: [35.2, 33.27], image: 'phoenician-merchant', bubble: '表音文字フェニキア文字がアルファベットの母体に' }
    ]
  },
  'levant-peoples-006': {
    extraActors: [
      { name: 'ヘブライ人', at: [35.2, 31.77], image: 'aramean-merchant', bubble: 'カナンの地へ移住し独自の歴史を刻む' }
    ]
  },
  'levant-peoples-007': {
    routeActor: { name: 'モーセ', route: 0, image: 'moses-prophet', bubble: '神の十戒を授かり出エジプトを果たす！' }
  },
  'levant-peoples-009': {
    extraActors: [
      { name: 'イスラエル王国', at: [35.29, 32.27], image: 'assyria-rebel', bubble: 'アッシリアによって滅ぼされる' }
    ]
  },
  'levant-peoples-010': {
    routeActor: { name: 'ユダ王国', route: 0, image: 'aramean-merchant', bubble: 'バビロンへ連行され苦難の捕囚生活を送る' }
  },
  'assyria-001': {
    extraActors: [
      { name: 'アッシリア', at: [43.15, 36.35], image: 'assyria-soldier', bubble: '鉄製武器と騎兵・戦車で強大な軍事力を誇る' }
    ]
  },
  'assyria-002': {
    extraActors: [
      { name: 'アッシリア', at: [43.15, 36.35], image: 'assyria-cavalry', bubble: '前7世紀前半、オリエント史上初の全土統一！' }
    ]
  },
  'assyria-003': {
    extraActors: [
      { name: 'アッシリア', at: [43.15, 36.35], image: 'royal-courier', bubble: '駅伝制で命令を伝え州総督を通じて強力に統治' }
    ]
  },
  'assyria-005': {
    extraActors: [
      { name: 'アッシリア', at: [43.15, 36.35], image: 'assyria-rebel', bubble: '過酷な支配への反乱が相次ぎ帝国は急速に崩壊' }
    ]
  },
  'assyria-006': {
    extraActors: [
      { name: 'メディア', at: [48.5, 35], route: 0, image: 'median-cavalry', bubble: '4国分立のなか勢力を拡大する！' },
      { name: 'リディア', at: [28.04, 38.49], offset: [35, -10], image: 'lydia-merchant', bubble: '小アジア西部の富裕な王国' }
    ]
  },
  'assyria-007': {
    extraActors: [
      { name: '新バビロニア', at: [44.42, 32.54], image: 'nebuchadnezzar-king', bubble: '都バビロンを再建し4国の中で最も栄える' }
    ]
  },
  'assyria-008': {
    extraActors: [
      { name: 'リディア', at: [28.04, 38.49], image: 'lydia-merchant', bubble: '世界最古の打刻金属貨幣を発明して商業が発達！' }
    ]
  },
  'assyria-009': {
    extraActors: [
      { name: 'エジプト', at: [31, 30], image: 'pharaoh-calm', bubble: '第26王朝が独立を回復するも東からペルシアが迫る' }
    ]
  },
  'achaemenid-004': {
    routeActor: { name: 'ダレイオス1世', route: 0, image: 'royal-courier', bubble: 'スサからサルデスまで「王の道」を早馬が駆ける！' }
  },
  'achaemenid-006': {
    extraActors: [
      { name: 'ペルシア', at: [52.89, 29.93], image: 'townspeople-joy', bubble: '諸民族の宗教や言語を尊重する寛容な支配' }
    ]
  },
  'achaemenid-009': {
    extraActors: [
      { name: 'ペルシア', at: [55, 32], image: 'zoroaster-priest', bubble: '最後の審判、天国・地獄の思想が後世の宗教に影響' }
    ]
  },
  'achaemenid-010': {
    battle: 'アルベラ',
    routeActor: { name: 'アレクサンドロス', route: 0, image: 'alexander-march', afterImage: 'alexander-happy', bubble: 'イッソス・ガウガメラで連勝しペルシアを滅ぼす！' },
    targetActor: { name: 'ダレイオス3世', at: [43.73, 36.36], offset: [45, 0], image: 'darius3-worried', bubble: 'アレクサンドロスの猛攻に敗れる…' }
  },
  'parthia-sasanian-001': {
    extraActors: [
      { name: '遊牧民', at: [58, 36], image: 'parthian-horseman', bubble: 'セレウコス朝の衰退に乗じてイラン高原へ自立' }
    ]
  },
  'parthia-sasanian-002': {
    routeActor: { name: 'ミトラダテス1世', route: 0, image: 'parthian-horseman', bubble: 'メソポタミアまで進出し東西中継貿易で栄える！' }
  },
  'parthia-sasanian-003': {
    extraActors: [
      { name: 'パルティア', at: [52, 34], image: 'parthian-horseman', bubble: '弓騎兵の機動力を生かしてローマ軍と激突！' }
    ]
  },
  'parthia-sasanian-005': {
    routeActor: { name: 'シャープール1世', route: 0, image: 'shapur-king', bubble: 'エデッサの戦いでローマ皇帝ウァレリアヌスを捕虜に！' },
    targetActor: { name: 'ウァレリアヌス', at: [60, 30], offset: [45, 0], image: 'valerian-captive', bubble: 'ササン朝の捕虜となってしまった…' }
  },
  'parthia-sasanian-007': {
    extraActors: [
      { name: 'ササン朝', at: [52, 32], image: 'zoroaster-priest', bubble: 'ゾロアスター教を国教とし聖典アヴェスターを編纂' }
    ]
  },
  'parthia-sasanian-008': {
    extraActors: [
      { name: 'ササン朝', at: [48.37, 34.19], image: 'darius3-worried', bubble: 'ニハーヴァンドの戦いでイスラーム軍に敗れ滅亡' }
    ]
  },
  'indus-001': {
    extraActors: [
      { name: 'インド', at: [68.14, 27.32], image: 'indus-priest', bubble: 'インダス川とガンジス川の流域に文明が開花' }
    ]
  },
  'indus-002': {
    extraActors: [
      { name: 'インダス文明', at: [68.14, 27.32], image: 'indus-priest', bubble: '計画的な道路と大浴場を持つ都市文明' }
    ]
  },
  'indus-003': {
    extraActors: [
      { name: 'インダス文明', at: [68.14, 27.32], image: 'ancient-scribe', bubble: '印章に刻まれたインダス文字は今も未解読' }
    ]
  },
  'indus-004': {
    extraActors: [
      { name: 'インダス文明', at: [68.14, 27.32], image: 'indus-priest', bubble: '気候変動や洪水の頻発により徐々に衰退していった' }
    ]
  },
  'vedic-india-001': {
    routeActor: { name: 'アーリヤ人', route: 0, image: 'aryan-warrior', bubble: 'カイバル峠を越えてパンジャーブへ進入！' }
  },
  'vedic-india-002': {
    extraActors: [
      { name: 'アーリヤ人', at: [74, 31], image: 'brahman-priest', bubble: '自然神への賛歌『リグ＝ヴェーダ』を口承する' }
    ]
  },
  'vedic-india-003': {
    routeActor: { name: 'アーリヤ人', route: 0, image: 'aryan-warrior', bubble: '鉄器を手にガンジス川流域へ進出・開拓！' }
  },
  'vedic-india-004': {
    extraActors: [
      { name: 'バラモン', at: [78, 27], image: 'brahman-priest', bubble: '司祭バラモンが最高の身分とされる' },
      { name: 'クシャトリヤ', at: [81, 26], offset: [35, 0], image: 'kshatriya-warrior', bubble: '王侯・武士として政治や軍事を司る' }
    ]
  },
  'vedic-india-005': {
    extraActors: [
      { name: 'バラモン', at: [78, 27], image: 'brahman-priest', bubble: '祭祀を独占しバラモン教の権威を確立' }
    ]
  },
  'vedic-india-006': {
    extraActors: [
      { name: 'バラモン', at: [78, 27], image: 'brahman-priest', bubble: '輪廻転生から脱し梵我一如をめざす哲学を探究' }
    ]
  },
  'vedic-india-009': {
    extraActors: [
      { name: 'クシャトリヤ', at: [83, 25], image: 'kshatriya-warrior', bubble: '十六大国が台頭し互いに覇を競う' }
    ]
  },
  'north-india-001': {
    extraActors: [
      { name: 'マガダ国', at: [85.18, 25.61], image: 'kshatriya-warrior', bubble: 'パータリプトラを都に北インドをリード' }
    ]
  },
  'north-india-004': {
    battle: 'カリンガ',
    routeActor: { name: 'アショーカ王', route: 0, image: 'ashoka-march', afterImage: 'ashoka-calm', bubble: 'カリンガ国を征服するも惨禍に胸を痛める…', offset: [-25, -15] },
    extraActors: [
      { name: 'カリンガ', at: [85, 20], offset: [-20, 15], image: 'kalinga-king-worried', bubble: '甚大な戦禍に苦しむ…' }
    ]
  },
  'north-india-006': {
    routeActor: { name: 'アショーカ王', route: 0, image: 'buddhist-monk', bubble: '王子マヒンダを送りスリランカへ仏教を布教！' }
  },
  'north-india-010': {
    routeActor: { name: 'ローマ', route: 0, image: 'roman-merchant', bubble: 'モンスーンを利用し金貨を携えてインドと交易！' }
  },
  'north-india-011': {
    routeActor: { name: '仏教', route: 0, image: 'buddhist-monk', bubble: 'スリランカから東南アジア各国へ上座部仏教が伝播！' }
  },
  'north-india-012': {
    routeActor: { name: '仏教', route: 0, image: 'buddhist-monk', bubble: 'オアシスの道を経て中国・東アジアへ大乗仏教が伝来！' }
  },
  'south-india-001': {
    extraActors: [
      { name: '南インド', at: [78, 12], image: 'tamil-king', bubble: 'ドラヴィダ系タミル文化が豊かに花開く' }
    ]
  },
  'south-india-002': {
    extraActors: [
      { name: 'サータヴァーハナ朝', at: [75, 18], image: 'tamil-king', bubble: 'デカン高原を支配し南北交易を中継' }
    ]
  },
  'south-india-003': {
    extraActors: [
      { name: 'チョーラ朝', at: [79.13, 10.78], route: 0, image: 'chola-warrior', bubble: '強力な海軍でシュリーヴィジャヤ王国へ遠征！' }
    ]
  },
  'south-india-004': {
    extraActors: [
      { name: 'パーンディヤ朝', at: [78.1, 9.9], image: 'tamil-king', bubble: '真珠採取とローマとの海上交易で栄える' }
    ]
  },
  'south-india-006': {
    extraActors: [
      { name: '民衆', at: [78, 11], image: 'townspeople-joy', bubble: '身分や性別を問わず神への絶対的愛と帰依を歌う！' }
    ]
  },
  'south-india-007': {
    extraActors: [
      { name: '季節風', at: [76.2, 10.0], image: 'roman-merchant', bubble: 'モンスーンを利用してアラビア海を往来' }
    ]
  },
  'south-india-008': {
    extraActors: [
      { name: '中継貿易', at: [80, 13], image: 'roman-merchant', bubble: '地中海から中国を結ぶ東西海上ネットワークの要衝' }
    ]
  },
  'south-india-009': {
    extraActors: [
      { name: 'ヴィジャヤナガル王国', at: [76.46, 15.33], image: 'tamil-king', bubble: 'イスラーム勢力に対抗しヒンドゥー文化を保護' }
    ]
  },
  'south-india-010': {
    extraActors: [
      { name: '南インド', at: [78, 12], image: 'chola-warrior', bubble: '海を通じて世界と結ばれ独自の文化を発展させた' }
    ]
  }
};

const edition={},plans=[];
for(const volume of ancientSeries) {
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)) {
    const selected=page.passages.map(({paragraph,start,end})=>({p:paragraphById.get(paragraph),start,end}));
    const plainBody=selected.map(({p,start,end})=>p.text.slice(start,end));
    const body=selected.map(({p,start,end})=>decorate(p.text,boldSpans(p.markdown),start,end));
    const text=plainBody.join(''),title=page.title;
    const fullText = title + '。' + text;
    const names=ancientNamesInText(fullText);
    const pins={},tags=[],props=[];
    const actors=[];

    const id=`${volume.id}-${String(edition[volume.id].length+1).padStart(3,'0')}`;
    const rule = customSceneRules[id] || {};

    // 基本の名前分類
    for(const entry of names) {
      if(entry.kind==='person') {
        const p = personInfo[entry.name];
        const actor = {
          name: entry.name,
          at: entry.points[0],
          image: p?.image ?? 'ancient/person.svg',
          bubble: p?.bubble ?? ''
        };
        if(p?.offset) actor.offset = p.offset;
        if(p?.afterImage) actor.afterImage = p.afterImage;
        actors.push(actor);
      } else if(entry.kind==='building') {
        const b = propInfo[entry.name];
        if(b) {
          props.push({name:entry.name, at:entry.points[0], image: b.image, kind:'prop', size: b.size});
        } else {
          const symbol=/ピラミッド|スフィンクス/.test(entry.name)?'pyramid-giza':/ジッグラト/.test(entry.name)?'ziggurat-temple':/ストゥーパ/.test(entry.name)?'stupa':'hindu-temple';
          const isSvg = symbol === 'stupa';
          props.push({name:entry.name, at:entry.points[0], image: isSvg ? `ancient/${symbol}.svg` : symbol, kind:'prop', size:42});
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
        const idx = actors.findIndex(a => normalizeMapName(a.name) === normalizeMapName(rule.routeActor.name));
        if (idx >= 0) {
          actors[idx] = { ...actors[idx], ...rule.routeActor };
        } else if (normalizeMapName(fullText).includes(normalizeMapName(rule.routeActor.name))) {
          actors.push({ at: activeRoutes[rule.routeActor.route]?.points[0] ?? [0,0], ...rule.routeActor });
        }
      } else if (actors.length > 0 && actors[0].route === undefined) {
        actors[0].route = 0;
      }
    } else {
      for (const a of actors) delete a.route;
    }

    // 目的地の対決・迎撃アクター
    if (rule.targetActor && normalizeMapName(fullText).includes(normalizeMapName(rule.targetActor.name))) {
      actors.push(rule.targetActor);
    }

    // 追加アクター
    if (rule.extraActors) {
      for (const ea of rule.extraActors) {
        if (normalizeMapName(fullText).includes(normalizeMapName(ea.name)) && !actors.some(a => normalizeMapName(a.name) === normalizeMapName(ea.name))) {
          const item = { ...ea };
          if (activeRoutes.length === 0 || item.route >= activeRoutes.length) delete item.route;
          actors.push(item);
        }
      }
    }

    // 追加プロップ
    if (rule.extraProps) {
      for (const ep of rule.extraProps) {
        if (normalizeMapName(fullText).includes(normalizeMapName(ep.name)) && !props.some(p => normalizeMapName(p.name) === normalizeMapName(ep.name))) {
          props.push(ep);
        }
      }
    }

    // 同一・近接座標の自動オフセット分散配置（overlap防止）
    const allMapItems = [...actors, ...props];
    for (let i = 0; i < allMapItems.length; i++) {
      const item = allMapItems[i];
      if (item.offset) continue;
      const pt = typeof item.at === 'string' ? pins[item.at]?.point : item.at;
      if (!pt) continue;
      let count = 0;
      for (const [, p] of Object.entries(pins)) {
        if (Math.hypot(p.point[0] - pt[0], p.point[1] - pt[1]) < 0.8) count++;
      }
      for (let j = 0; j < i; j++) {
        const prev = allMapItems[j];
        const ppt = typeof prev.at === 'string' ? pins[prev.at]?.point : prev.at;
        if (ppt && Math.hypot(ppt[0] - pt[0], ppt[1] - pt[1]) < 1.0) count++;
      }
      if (count > 0) {
        const offsets = [[0, -30], [28, 14], [-28, 14], [25, -24], [-25, -24]];
        item.offset = offsets[(count - 1) % offsets.length];
      }
    }

    // points にルートの全経由地も含めてフレームを広く安全に設定（東西+8度、南北+6度）
    const points=[
      ...names.flatMap(n=>n.points),
      ...activeRoutes.flatMap(r=>r.points),
      ...actors.map(a => typeof a.at === 'string' ? pins[a.at]?.point : a.at).filter(Boolean),
      ...props.map(p => typeof p.at === 'string' ? pins[p.at]?.point : p.at).filter(Boolean)
    ];
    const fallback=volume.lesson===3?[60,4,94,36]:[23,18,60,43];
    const minX = Math.min(...points.map(p=>p[0])), maxX = Math.max(...points.map(p=>p[0]));
    const minY = Math.min(...points.map(p=>p[1])), maxY = Math.max(...points.map(p=>p[1]));
    const frame=points.length?[minX - 8, minY - 6, maxX + 8, maxY + 6]:fallback;
    const duration = activeRoutes.length ? 2400 : (actors.length ? 1800 : 0);

    const s={
      id, title, body, plainBody, year: volume.period, chapter: 0, kicker: volume.label,
      sourceText: { chapter: 1, passages: page.passages, page: selected[0].p.page },
      frame, pins: Object.keys(pins), tags, zones: [], actors, props,
      routes: activeRoutes, rivers: ancientRivers.filter(r=>text.includes(r.name)),
      duration,
      facts: [title], mapHeading: title, focus: title, before: title, after: title, note: '', takeaway: ''
    };
    if (rule.battle) s.battle = rule.battle;

    edition[volume.id].push(s);
    plans.push({ id, ...page });
  }
}

const places=Object.fromEntries(Object.values(edition).flat().flatMap(s=>s.pins.map(name=>[name,{name,point:ancientNamesInText(name)[0].points[0]}])));
await write('public/ancient-edition.js',`// 原文の対応記録から生成。編集は docs/ancient-orient と生成処理へ。\nexport const ancientEdition = ${JSON.stringify(edition,null,2)};\nexport const ancientPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/ancient-orient/page-plan.json',JSON.stringify(plans,null,2)+'\n');

console.log(`第1章の本文を${Object.values(edition).flat().length}ページとしてドット絵・アニメーション付きで生成しました。`);
