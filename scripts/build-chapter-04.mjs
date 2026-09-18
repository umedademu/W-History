import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries,chapterLessons} from '../public/chapter-04-volumes.js';
import {chapterNamesInText,chapterRivers} from '../public/chapter-04-geography.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/chapter-04/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/chapter-04/reading-plan.json'));
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
  // ゲルマン民族大移動・西ローマ崩壊
  'カエサル': { image: 'caesar-general', bubble: 'ガリア遠征でゲルマン人の生態を記録' },
  'タキトゥス': { image: 'ancient-scribe', bubble: '『ゲルマニア』で素朴な風俗を著述' },
  'アッティラ': { image: 'attila-hun', bubble: 'フン帝国を率い「神の鞭」と恐れられる！' },
  'レオ1世': { image: 'christian-apostle', bubble: 'ローマに迫るアッティラと会見し撤退させる！' },
  'オドアケル': { image: 'odoacer-general', bubble: '西ローマ皇帝を廃位しゲルマン傭兵国家を樹立！' },
  'ロムルス＝アウグストゥルス': { image: 'romulus-augustulus', bubble: '西ローマ帝国最後の少年皇帝' },
  'アラリック': { image: 'alaric-visigoth', bubble: '西ゴート軍を率いローマを占領略奪！' },
  'アウグスティヌス': { image: 'high-priest', bubble: '『神の国』『告白』を著した最大の教父' },
  'クローヴィス': { image: 'clovis-king', bubble: 'アタナシウス派に改宗しメロヴィング朝を開く！' },
  'テオドリック': { image: 'theodoric-great', bubble: 'ラヴェンナを都とし東ゴート王国を最盛期へ！' },
  'ガイセリック': { image: 'genseric-vandal', bubble: 'カルタゴにヴァンダル王国を築く！' },
  'ユスティニアヌス': { image: 'justinian-emperor', bubble: 'ローマ帝国の旧領を回復しハギア・ソフィアを再建！' },
  'エグバート': { image: 'king-wu-zhou', bubble: '七王国（ヘプターキー）を統一しイングランドの基礎を築く！' },
  'エグベルト': { image: 'king-wu-zhou', bubble: 'ウェセックス王として覇を唱える' },
  'テオドシウス': { image: 'caesar-general', bubble: 'キリスト教を国教化し帝国を二子に分割' },
  'ペテロ': { image: 'christian-apostle', bubble: 'キリストの使徒の筆頭、初代ローマ司教' },
  'イエス': { image: 'christian-apostle', bubble: '愛と神の国を説いたキリスト教の創始者' },
  'ベネディクトゥス': { image: 'benedict-saint', bubble: 'モンテ・カシノで「祈りかつ働け」修道会規則を確立！' },
  'グレゴリウス1世': { image: 'gregory1-pope', bubble: '大教皇！典礼音楽（グレゴリオ聖歌）と布教を推進' },
  'レオン3世': { image: 'leo3-isaurian', bubble: '聖像禁止令（イコノクラスム）を発布！' },
  'ムハンマド': { image: 'saracen-warrior', bubble: 'イスラーム教を開創した預言者' },

  // フランク王国・カロリング朝
  'カール＝マルテル': { image: 'charles-martel', bubble: 'トゥール・ポワティエ間の戦いでイスラーム軍を撃退！' },
  'ピピン': { image: 'pepin-king', bubble: 'カロリング朝を開きラヴェンナ地方を教皇に寄進！' },
  'ピピン3世': { image: 'pepin-king', bubble: '小ピピン、教皇ザカリアスの承認で王位に就く' },
  'ザカリアス': { image: 'christian-apostle', bubble: 'ピピンの国王即位を正統と承認した教皇' },
  'カール大帝': { image: 'charlemagne-emperor', bubble: '西ローマ皇帝の戴冠を受けカロリング・ルネサンスを推進！' },
  'カール1世': { image: 'charlemagne-emperor', bubble: '西欧中世世界の父、シャルルマーニュ！' },
  'シャルルマーニュ': { image: 'charlemagne-emperor', bubble: 'ヨーロッパを統合した偉大な皇帝' },
  'カール': { image: 'charlemagne-emperor', bubble: 'フランク王国を広大な帝国へ発展させる！' },
  'アルクイン': { image: 'alcuin-scholar', bubble: 'カール大帝に招かれアーヘンで学芸を指導した英僧！' },
  'アインハルト': { image: 'einhard-scholar', bubble: '『カール大帝伝』を著した宮廷文人' },
  'レオ3世': { image: 'leo3-pope', bubble: 'カール大帝に西ローマ皇帝の帝冠を授ける！' },
  'ルートヴィヒ1世': { image: 'louis-pious', bubble: '敬虔王、帝国の統一を保とうとするも分裂へ' },
  'ロタール1世': { image: 'lothair1-emperor', bubble: 'ヴェルダン条約で中部フランクと皇帝位を継承' },
  'ルートヴィヒ2世': { image: 'louis-german', bubble: '東フランク王国（ドイツの起源）を統治' },
  'シャルル2世': { image: 'charles-bald', bubble: '禿頭王、西フランク王国（フランスの起源）を統治' },
  'コンラート1世': { image: 'conrad1-king', bubble: 'フランケン公、東フランクの最初の選挙王' },
  'ハインリヒ1世': { image: 'henry1-king', bubble: '捕鳥王、ザクセン朝を開きマジャール人を防ぐ' },
  'ユーグ＝カペー': { image: 'hugh-capet', bubble: 'カペー朝を開きフランス王国の礎を築く！' },
  'オットー1世': { image: 'otto1-emperor', bubble: 'レヒフェルトの戦いでマジャール人を破り神聖ローマ帝国を創始！' },
  'ヨハネス12世': { image: 'john12-pope', bubble: 'オットー1世に神聖ローマ皇帝冠を授けた教皇' },

  // ノルマン人・英国・ロシア
  'リューリク': { image: 'rurik-viking', bubble: 'ヴァリャーグを率いてノヴゴロド国を建設！' },
  'オレーグ': { image: 'oleg-prince', bubble: 'キエフ公国を創設しビザンツへ交易路を拓く' },
  'ウラディミル1世': { image: 'vladimir1-saint', bubble: 'ギリシア正教を受容しキエフ公国の全盛期を築く！' },
  'バシレイオス2世': { image: 'basil2-bulgaroktonos', bubble: 'ブルガリアを征服しビザンツ帝国最盛期を実現！' },
  'シャルル3世': { image: 'charles-simple', bubble: '単純王、ロロにノルマンディーを割譲' },
  'ロロ': { image: 'rollo-norman', bubble: 'ノルマンディー公国を開いたヴァイキング首長！' },
  'アルフレッド大王': { image: 'alfred-great', bubble: 'デーン人を撃退しアングロサクソンの法・学問を整備！' },
  'クヌート': { image: 'cnu-viking', bubble: 'デーン朝を開き北海帝国を築いた英雄王！' },
  'カヌート': { image: 'cnu-viking', bubble: 'イングランド・デンマーク・ノルウェーを統治' },
  'エドワード': { image: 'edward-confessor', bubble: '懺悔王、ウェストミンスター寺院を建立' },
  'ハロルド': { image: 'harold-godwinson', bubble: 'ヘースティングズの戦いで矢を受け戦死' },
  'ウィリアム': { image: 'william-conqueror', bubble: 'ノルマン・コンクエスト！イングランドを征服' },
  'ギヨーム': { image: 'william-conqueror', bubble: 'ノルマンディー公としてドーバーを渡る' },
  'ウィリアム1世': { image: 'william-conqueror', bubble: '征服王！ドゥームズデイ・ブックで検地を断行' },
  'ロベール＝ギスカール': { image: 'robert-guiscard', bubble: '南イタリアを征服した狡猾なるノルマン騎士！' },
  'ルッジェーロ1世': { image: 'roger1-norman', bubble: 'シチリア島をイスラームから奪還' },
  'ルッジェーロ2世': { image: 'roger2-sicily', bubble: '両シチリア王国を建国し東西文化の融合を開花！' },

  // 教会権力・叙任権闘争
  'グレゴリウス7世': { image: 'gregory7-pope', bubble: 'カノッサの屈辱！教皇権は皇帝権の上に立つ' },
  'フランチェスコ': { image: 'francis-assisi', bubble: '「小さき兄弟」托鉢修道会を創始し清貧を貫く！' },
  'ドミニコ': { image: 'dominic-saint', bubble: '学問と異端論駁に生きたドミニコ修道会を創始！' },
  'ドミニクス': { image: 'dominic-saint', bubble: '正統信仰の擁護と説教活動を展開' },
  'ハインリヒ4世': { image: 'henry4-emperor', bubble: 'カノッサの雪中で悔悛し破門解除を乞う！' },
  'カリクストゥス2世': { image: 'callixtus2-pope', bubble: 'ヴォルムス協約を結び叙任権闘争を決着！' },
  'ハインリヒ5世': { image: 'henry5-emperor', bubble: 'ヴォルムス協約を受諾した神聖ローマ皇帝' },
  'インノケンティウス3世': { image: 'innocent3-pope', bubble: '教皇権絶頂期！「教皇は太陽、皇帝は月」' },
  'ジョン': { image: 'king-john-lackland', bubble: '失地王、大憲章（マグナ・カルタ）に調印させられる' },
  'フィリップ2世': { image: 'philip2-augustus', bubble: '尊厳王！ブーヴィーヌの戦いで英王を破り王領拡大' },
  'オットー4世': { image: 'shihuangdi-emperor', bubble: 'ブーヴィーヌの戦いでジョン王と同盟し敗北' },

  // ビザンツ・東欧・十字軍
  'アルカディウス': { image: 'augustus-princeps', bubble: '東ローマ帝国（ビザンツ）の初代皇帝' },
  'トリボニアヌス': { image: 'tribonian-jurist', bubble: '『ローマ法大全』を編纂した法学の泰斗！' },
  'ホスロー1世': { image: 'shapur-king', bubble: 'ササン朝最盛期の王、ビザンツと死闘を繰り広げる' },
  'コンスタンティヌス': { image: 'caesar-general', bubble: '新首都コンスタンティノープルを建設' },
  'ヘラクレイオス1世': { image: 'heraclius-emperor', bubble: '軍管区制と屯田兵制を導入しササン朝を破る！' },
  'キュリロス': { image: 'cyril-apostle', bubble: 'スラヴ人へ布教しキリル文字を考案！' },
  'メトディオス': { image: 'methodius-apostle', bubble: 'キュリロスとともに聖書をスラヴ語に翻訳' },
  'バシレイオス1世': { image: 'king-wu-zhou', bubble: 'マケドニア朝を開いたビザンツ皇帝' },
  'アレクシオス1世': { image: 'alexios1-komnenos', bubble: 'セルジューク朝に対抗しローマ教皇に救援要請！' },
  'ウルバヌス2世': { image: 'urban2-pope', bubble: 'クレルモン公会議で十字軍を演説！「神の御心！」' },
  'メフメト2世': { image: 'saracen-warrior', bubble: 'コンスタンティノープルを陥落させビザンツを滅ぼす！' },
  'カジミェシュ3世': { image: 'casimir3-great', bubble: 'ポーランドを大国にしクラコフ大学を創立！' },
  'カシミール大王': { image: 'casimir3-great', bubble: '法典整備と領土拡大を進めた名君' },
  'ヤゲウォ': { image: 'jagiello-king', bubble: 'リトアニア大公、ポーランドと合同しヤゲウォ朝を創始！' },
  'カール4世': { image: 'charles4-emperor', bubble: '金印勅書を発布し七選帝侯による皇帝選挙制を確立！' },
  'ジギスムント': { image: 'sigismund-emperor', bubble: 'コンスタンツ公会議を招集し大シスマを収拾！' },
  'フス': { image: 'jan-hus-reformer', bubble: '教会腐敗を批判しコンスタンツで火刑に処されたベーメンの先覚！' },
  'イシュトヴァーン1世': { image: 'stephen1-hungary', bubble: 'カトリックを受容しハンガリー王国を建国！' },
  'バトゥ': { image: 'batu-khan', bubble: 'ワールシュタットの戦いで大勝しキプチャク・ハン国を建国！' },
  'バヤジット1世': { image: 'saracen-warrior', bubble: 'ニコポリスの戦いでヨーロッパ十字軍を壊滅させる！' },
  'マーチャーシュ1世': { image: 'matthias-corvinus', bubble: '黒軍を創設しオスマン帝国を撃退したハンガリー王！' },
  'ラヨシュ2世': { image: 'louis2-hungary', bubble: 'モハーチの戦いでオスマン軍に敗れ戦死' },
  'ステファン＝ネマーニャ': { image: 'stefan-nemanja', bubble: 'セルビア王国の独立と繁栄の基盤を築く' },
  'ステファン＝ドゥシャン': { image: 'stefan-dusan', bubble: 'セルビア帝国の最大領域を現出しツァーリと称す！' },
  'ボリス1世': { image: 'boris1-bulgaria', bubble: 'ギリシア正教を受容したブルガリアの君主' },
  'シメオン1世': { image: 'simeon1-bulgaria', bubble: '第1次ブルガリア帝国の黄金時代を築く！' },
  'アセン1世': { image: 'asen1-bulgaria', bubble: '第2次ブルガリア帝国を再興！' },
  'サラーフ＝アッディーン': { image: 'saladin-sultan', bubble: 'イェルサレムを奪還し騎士道的寛容を示した英雄！' },
  'サラディン': { image: 'saladin-sultan', bubble: 'アイユーブ朝を開き十字軍と激闘を繰り広げる' },
  'リチャード1世': { image: 'richard-lionheart', bubble: '獅子心王！第3回十字軍でサラディンと激突' },
  'フリードリヒ1世': { image: 'frederick1-barbarossa', bubble: '赤髭王バルバロッサ！第3回十字軍を率いる' },
  'ダンドロ': { image: 'enrico-dandolo', bubble: '盲目のヴェネツィア元首、第4回十字軍をコンスタンティノープルへ誘導！' },
  'フリードリヒ2世': { image: 'frederick2-wonder', bubble: '外交交渉でイェルサレムを無血奪還した「世界の驚異」！' },
  'ルイ9世': { image: 'louis9-saint', bubble: '聖王サン・ルイ！第6回・第7回十字軍を主導' },
  'ルブルック': { image: 'rubruck-friar', bubble: 'ルイ9世の命でモンゴル帝国カラコルムへ赴く！' },

  // 都市・思想・百年戦争
  'フッガー家': { image: 'fugger-merchant', bubble: '鉱山経営と教皇庁金融でヨーロッパ随一の富豪へ！' },
  'ギヨーム＝カール': { image: 'guillaume-cale', bubble: '百年戦争下のフランスでジャックリーの乱を指導！' },
  'エティエンヌ＝マルセル': { image: 'etienne-marcel', bubble: 'パリの自治権拡大を求めて蜂起した商人頭！' },
  'ワット＝タイラー': { image: 'wat-tyler', bubble: '農奴制廃止を掲げロンドンへ進撃！' },
  'ジョン＝ボール': { image: 'john-ball', bubble: '「アダムが耕しイブが紡いだとき誰が貴族であったか」' },
  'フィリップ4世': { image: 'philip4-fair', bubble: '端麗王！アナーニ事件を起こし教皇庁をアヴィニョンへ移す！' },
  'ボニファティウス8世': { image: 'boniface8-pope', bubble: '教皇権の至上を唱えるもアナーニ事件で捕らえられ憤死！' },
  'クレメンス5世': { image: 'clement5-pope', bubble: 'アヴィニョンに教皇庁を移転（教皇のバビロン捕囚）' },
  'ウィクリフ': { image: 'john-wycliffe', bubble: '聖書を英訳し教皇権を否定した宗教改革の先駆者！' },
  'プラトン': { image: 'plato-philosopher', bubble: 'イデア論を説いた古代ギリシアの大哲学者' },
  'アリストテレス': { image: 'aristotle-philosopher', bubble: 'スコラ学に多大な影響を与えた「万学の祖」' },
  'アンセルムス': { image: 'anselm-father', bubble: '実在論を唱え「スコラ学の父」と呼ばれる！' },
  'アベラール': { image: 'abelard-philosopher', bubble: '唯名論を主張しエロイーズとの愛でも知られる学者' },
  'トマス＝アクィナス': { image: 'thomas-aquinas', bubble: '『神学大全』を著しスコラ学を大成した天使的博士！' },
  'ドゥンス＝スコトゥス': { image: 'duns-scotus', bubble: '繊細博士、後期スコラ学の重要神学者' },
  'ウィリアム＝オブ＝オッカム': { image: 'william-ockham', bubble: '「オッカムの剃刀」で唯名論を徹底！' },
  'ウィリアム＝オッカム': { image: 'william-ockham', bubble: '信仰と理性の分離を説いたフランシスコ会士' },
  'ロジャー＝ベーコン': { image: 'roger-bacon', bubble: '実験と観察を重んじ近代科学の先駆となった修道士！' },
  'ワーグナー': { image: 'ancient-scribe', bubble: '中世騎士道物語を題材に楽劇を作曲' },
  'ワグナー': { image: 'ancient-scribe', bubble: '『タンホイザー』『ローエングリン』を作曲' },
  'ヘンリ2世': { image: 'henry2-plantagenet', bubble: 'プランタジネット朝を開き広大なアンジュー帝国を統治！' },
  'ヘンリ3世': { image: 'henry3-king', bubble: '大憲章を無視しシモン・ド・モンフォールの反乱を招く' },
  'シモン＝ド＝モンフォール': { image: 'simon-monfort', bubble: '貴族・都市代表を集めイギリス議会の起源を創設！' },
  'エドワード1世': { image: 'edward1-longshanks', bubble: '模範議会を招集したイングランド王長脚王！' },
  'フィリップ6世': { image: 'philip6-valois', bubble: 'ヴァロワ朝を開き百年戦争が勃発！' },
  'エドワード3世': { image: 'edward3-king', bubble: 'フランス王位継承権を主張し百年戦争を開始！' },
  'エドワード黒太子': { image: 'black-prince', bubble: '漆黒の甲冑を纏いクレシー・ポワティエで大勝利！' },
  'ジャン2世': { image: 'john2-good', bubble: 'ポワティエの戦いで黒太子に捕らえられたフランス国王' },
  'ヘンリ5世': { image: 'henry5-king', bubble: 'アザンクールの戦いでフランス軍を破った英雄王！' },
  'ジャンヌ＝ダルク': { image: 'joan-of-arc', bubble: '「神の声」を聞きオルレアンを解放した救国の聖処女！' },
  'シャルル7世': { image: 'charles7-victorious', bubble: 'ジャンヌ・ダルクに導かれランスで戴冠し百年戦争に勝利！' },
  'ジャック＝クール': { image: 'jacques-coeur', bubble: 'シャルル7世の財務官として東方貿易で巨富を築く！' },
  'ルイ11世': { image: 'louis11-spider', bubble: '「遍在する蜘蛛」と呼ばれフランス中央集権を完成！' },
  'シャルル8世': { image: 'charles8-king', bubble: 'イタリア戦争を開始したフランス王' },
  'ヘンリ6世': { image: 'henry6-king', bubble: 'バラ戦争期に即位したランカスター朝の王' },
  'エドワード4世': { image: 'edward4-york', bubble: 'バラ戦争で勝利しヨーク朝を開く' },
  'ヘンリ＝テューダー': { image: 'henry7-tudor', bubble: 'ボズワースの戦いに勝利しテューダー朝を創始！' },
  'ヘンリ7世': { image: 'henry7-tudor', bubble: 'バラ戦争を終結させ星室庁裁判所を設置！' },
  'ヘンリ8世': { image: 'henry8-king', bubble: '首長法を発布しイギリス国教会を樹立' },
  'ルドルフ1世': { image: 'rudolf1-habsburg', bubble: 'ハプスブルク家から初めて神聖ローマ皇帝に選出！' },
  'アンジュー伯シャルル': { image: 'charles-anjou', bubble: 'シチリアの晩祷（晩鐘）でシチリア島を失う' },
  'マルグレーテ': { image: 'margrete-queen', bubble: 'カルマル同盟を結成し北欧3国を統一した女王！' },
  'ジョアン1世': { image: 'joao1-avis', bubble: 'アヴィス朝を開きポルトガルの海外発展の基礎を築く！' },
  'エンリケ': { image: 'henry-navigator', bubble: '航海王子！アフリカ西岸探検を推進' },
  'フェルナンド': { image: 'ferdinand2-aragon', bubble: 'イサベルと結婚しスペイン王国を統合！' },
  'フェルナンド2世': { image: 'ferdinand2-aragon', bubble: 'アラゴン王、グラナダを陥落させレコンキスタ完了' },
  'イサベル': { image: 'isabella-castile', bubble: 'カスティリャ女王、コロンブスの新大陸航海を支援！' },
  'コロンブス': { image: 'columbus-explorer', bubble: '大西洋を西航しアメリカ新大陸に到達！' }
};

export const buildingInfo = {
  'サン＝ピエトロ大聖堂': { image: 'st-peters-basilica', size: 48 },
  'モンテ＝カシノ': { image: 'monte-cassino', size: 48 },
  'ピラミッド': { image: 'pyramid-giza', size: 48 },
  'クリュニー修道院': { image: 'cluny-abbey', size: 48 },
  'シトー修道会': { image: 'citeaux-abbey', size: 48 },
  'オクスフォード大学': { image: 'oxford-university', size: 48 },
  'パリ大学': { image: 'sorbonne-paris', size: 48 },
  'ソルボンヌ': { image: 'sorbonne-paris', size: 48 },
  'ハギア＝ソフィア聖堂': { image: 'hagia-sophia', size: 48 },
  '聖ソフィア聖堂': { image: 'hagia-sophia', size: 48 },
  'クラコフ大学': { image: 'krakow-university', size: 48 },
  'プラハ大学': { image: 'prague-university', size: 48 },
  'ボローニャ大学': { image: 'bologna-university', size: 48 },
  'サレルノ大学': { image: 'salerno-university', size: 48 },
  'ケンブリッジ大学': { image: 'cambridge-university', size: 48 },
  'ピサ大聖堂': { image: 'pisa-cathedral', size: 48 },
  'ヴォルムス大聖堂': { image: 'worms-cathedral', size: 48 },
  'サン＝ドニ修道院': { image: 'saint-denis', size: 48 },
  'ノートルダム大聖堂': { image: 'notre-dame-paris', size: 48 },
  'シャルトル大聖堂': { image: 'chartres-cathedral', size: 48 },
  'カンタベリ大聖堂': { image: 'canterbury-cathedral', size: 48 },
  'ケルン大聖堂': { image: 'cologne-cathedral', size: 48 }
};

// 歴史的名場面のアニメーション・対決演出ルール（本文に必ず登場するシーンID）
export const customSceneRules = {
  // カタラウヌムの戦い：アッティラ vs 西ローマ・西ゴート連合軍
  'c04-l11-p01-004': {
    targetActor: { name: 'アッティラ', at: [19, 47], image: 'attila-hun', bubble: 'カタラウヌムで激突！東方へ退却', afterImage: 'hun-rider' }
  },
  // トゥール・ポワティエ間の戦い：カール＝マルテル vs ウマイヤ朝
  'c04-l11-p02-008': {
    targetActor: { name: 'カール＝マルテル', at: [6.08, 50.78], image: 'charles-martel', bubble: 'フランク重装歩兵でイスラーム軍を撃滅！', afterImage: 'frank-infantry' }
  },
  // カール大帝の戴冠：レオ3世
  'c04-l11-p02-012': {
    targetActor: { name: 'レオ3世', at: [12.48, 41.9], image: 'leo3-pope', bubble: '聖ピエトロ聖堂でカールに西ローマ皇帝冠を戴冠！' }
  },
  // レヒフェルトの戦い：オットー1世 vs マジャール人
  'c04-l11-p03-003': {
    targetActor: { name: 'オットー1世', at: [11, 52], image: 'otto1-emperor', bubble: 'マジャール人を撃退！帝国境を守る', afterImage: 'german-warrior' }
  },
  // ヘースティングズの戦い：ハロルド vs ウィリアム征服王
  'c04-l12-p01-006': {
    targetActor: { name: 'ハロルド', at: [-0.13, 51.51], image: 'harold-godwinson', bubble: 'ヘースティングズで矢を受け戦死！', afterImage: 'english-longbowman' }
  },
  // カノッサの屈辱：ハインリヒ4世 vs グレゴリウス7世
  'c04-l12-p03-006': {
    targetActor: { name: 'ハインリヒ4世', at: [8.36, 49.63], image: 'henry4-emperor', bubble: '雪の中で3日3晩祈り、破門解除を乞う！' }
  },
  // クレルモン公会議：ウルバヌス2世
  'c04-l14-p01-002': {
    targetActor: { name: 'ウルバヌス2世', at: [12.48, 41.9], image: 'urban2-pope', bubble: '「神の御心！」聖地回復の十字軍を熱狂的に呼号！' }
  },
  // 第3回十字軍：サラーフ＝アッディーン vs リチャード1世
  'c04-l14-p01-006': {
    targetActor: { name: 'サラーフ＝アッディーン', at: [31.2, 30], image: 'saladin-sultan', bubble: '獅子心王リチャードと互いの武勇を認め合い和睦！' }
  },
  // 第4回十字軍：ダンドロとコンスタンティノープル攻略
  'c04-l14-p01-007': {
    targetActor: { name: 'ダンドロ', at: [12.34, 45.44], image: 'enrico-dandolo', bubble: 'コンスタンティノープルを攻略しラテン帝国を建国！' }
  },
  // 大憲章（マグナ・カルタ）：ジョン王
  'c04-l15-p01-004': {
    targetActor: { name: 'ジョン', at: [-0.13, 51.51], image: 'king-john-lackland', bubble: '貴族たちの要求に屈しマグナ・カルタに調印……' }
  },
  // アナーニ事件：ボニファティウス8世 vs フィリップ4世
  'c04-l15-p01-009': {
    targetActor: { name: 'ボニファティウス8世', at: [12.48, 41.9], image: 'boniface8-pope', bubble: 'アナーニで襲撃され激怒のあまり憤死……！' }
  },
  // 百年戦争：エドワード黒太子
  'c04-l15-p02-002': {
    targetActor: { name: 'エドワード黒太子', at: [-0.13, 51.51], image: 'black-prince', bubble: '長弓隊でフランス重装騎士団を圧倒！', afterImage: 'french-knight' }
  },
  // 百年戦争・オルレアン解放：ジャンヌ・ダルク
  'c04-l15-p02-004': {
    targetActor: { name: 'ジャンヌ＝ダルク', at: [2.43, 47.9], image: 'joan-of-arc', bubble: '「神の声」に従いオルレアンの包囲を破る！', afterImage: 'french-knight' }
  },
  // バラ戦争終結：ヘンリ7世
  'c04-l15-p02-006': {
    targetActor: { name: 'ヘンリ7世', at: [-0.13, 51.51], image: 'henry7-tudor', bubble: 'ボズワースの戦いで勝利しテューダー朝を開く！' }
  }
};

const ensurePng = name => {
  const p = name.includes('/') ? name : `ancient/${name}`;
  return p.endsWith('.png') ? p : `${p}.png`;
};

const routes = [
  [11, 54, "黒海", "ドナウ川", "move", [[32, 46], [28, 45], [26.5, 43]]],
  [11, 78, "パンノニア", "カタラウヌム", "campaign", [[19, 47], [12, 48], [4.36, 48.96]]],
  [11, 94, "バルカン半島", "ローマ", "move", [[23, 42], [17, 45], [12.5, 41.9]]],
  [11, 96, "南ガリア", "イベリア半島", "move", [[1.44, 43.6], [-1, 42], [-4.03, 39.86]]],
  [11, 100, "イベリア", "北アフリカ", "move", [[-4, 40], [-5.6, 36], [0, 36], [10.32, 36.85]]],
  [11, 116, "ユトランド半島", "ブリタニア", "move", [[10, 55], [4, 54], [0, 53], [-1, 52]]],
  [11, 211, "イベリア半島", "フランク王国", "campaign", [[-4, 40], [1, 42.7], [0.34, 46.58]]],
  [12, 81, "ノヴゴロド", "キエフ", "move", [[31.27, 58.52], [30, 56], [30, 54], [30.52, 50.45]]],
  [12, 99, "ノルマンディー", "イングランド", "campaign", [[0, 49], [0.2, 50], [0.49, 50.91]]],
  [13, 80, "ヴァンダル王国", "イタリア", "campaign", [[28.98, 41.01], [23, 37], [15, 36], [10.32, 36.85], [12.2, 44.42]]],
  [14, 138, "コンスタンティノープル", "イェルサレム", "campaign", [[28.98, 41.01], [30, 38], [36.16, 36.2], [35.23, 31.78]]],
  [14, 164, "ヴェネツィア", "コンスタンティノープル", "campaign", [[12.34, 45.44], [17, 42], [23, 36], [26, 39], [28.98, 41.01]]],
  [14, 182, "フランス", "エジプト", "campaign", [[4, 43], [12, 38], [22, 34], [31, 30]]],
  [14, 182, "フランス", "チュニス", "campaign", [[4, 43], [7, 40], [10.18, 36.8]]]
];

const edition={},plans=[];
for(const volume of chapterSeries) {
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)) {
    const selected=page.passages.map(({paragraph,start,end})=>({p:paragraphById.get(paragraph),start,end}));
    const plainBody=selected.map(({p,start,end})=>p.text.slice(start,end));
    const body=selected.map(({p,start,end})=>decorate(p.text,boldSpans(p.markdown),start,end));
    const text=plainBody.join(''),title=page.title;
    const names=chapterNamesInText(title+'。'+text);
    const pins={},tags=[],props=[];
    const sceneId=`${volume.id}-${String(edition[volume.id].length+1).padStart(3,'0')}`;
    
    for(const entry of names) {
      if(entry.kind==='person') {
        const info = personInfo[entry.name];
        const img = info ? info.image : 'charlemagne-emperor';
        const bubble = info ? info.bubble : undefined;
        props.push({name:entry.name, at:entry.points[0], image: ensurePng(img), kind:'prop', size:44, bubble});
      } else if(entry.kind==='building') {
        const info = buildingInfo[entry.name];
        const img = info ? info.image : 'notre-dame-paris';
        const size = info ? info.size : 46;
        props.push({name:entry.name, at:entry.points[0], image: ensurePng(img), kind:'prop', size});
      } else if(entry.kind==='place') {
        pins[entry.name]={name:entry.name, point:entry.points[0]};
      } else {
        tags.push({text:entry.name, at:entry.points[0]});
      }
    }
    
    // カスタム演出アクター
    const actors = [];
    if (customSceneRules[sceneId]) {
      const rule = customSceneRules[sceneId];
      if (rule.targetActor) {
        actors.push({
          name: rule.targetActor.name,
          at: rule.targetActor.at,
          image: ensurePng(rule.targetActor.image),
          bubble: rule.targetActor.bubble,
          afterImage: rule.targetActor.afterImage ? ensurePng(rule.targetActor.afterImage) : undefined
        });
      }
    }
    
    const activeRoutes=routes.filter(([lesson,line,from,to])=>selected.some(({p})=>p.lesson===lesson&&p.source[0].line===line)&&text.includes(from)&&text.includes(to))
      .map(([,,,,kind,points])=>({kind,points,start:0.08,end:0.95}));
    const points=names.flatMap(n=>n.points);
    const fallback=[-12,28,40,60];
    const frame=points.length?[Math.min(...points.map(p=>p[0]))-5,Math.min(...points.map(p=>p[1]))-5,Math.max(...points.map(p=>p[0]))+5,Math.max(...points.map(p=>p[1]))+5]:fallback;
    
    const s={id:sceneId,title,body,plainBody,year:volume.period,chapter:0,kicker:volume.label,
      sourceText:{chapter:4,passages:page.passages,page:selected[0].p.page},frame,pins:Object.keys(pins),tags,zones:[],actors,props,
      routes:activeRoutes,rivers:chapterRivers.filter(r=>text.includes(r.name)),duration:activeRoutes.length?2200:0,
      facts:[title],mapHeading:title,focus:title,before:title,after:title,note:'',takeaway:''};
    edition[volume.id].push(s);plans.push({id:sceneId,...page});
  }
}
const places=Object.fromEntries(Object.values(edition).flat().flatMap(s=>s.pins.map(name=>[name,{name,point:chapterNamesInText(name)[0].points[0]}])));
await write('public/chapter-04-edition.js',`// 原文の対応記録から生成。編集は docs/chapter-04 と生成処理へ。\nexport const chapterEdition = ${JSON.stringify(edition,null,2)};\nexport const chapterPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/chapter-04/page-plan.json',JSON.stringify(plans,null,2)+'\n');

console.log('第4章: '+chapterSeries.length+'節・'+plans.length+'ページを生成しました（SVG廃止・完全ドット絵化）。');
