import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries as ancientSeries} from '../public/chapter-07-volumes.js';
import {chapterNamesInText as ancientNamesInText,chapterRivers as ancientRivers} from '../public/chapter-07-geography.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/chapter-07/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/chapter-07/reading-plan.json'));
const generatedMapping = JSON.parse(await read('docs/chapter-07-generated-mapping.json'));
const paragraphById = new Map(paragraphs.map(p=>[p.id,p]));

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

const BUBBLES = {
  'ダンテ': '『神曲』でトスカナ語による文学の道を開く！',
  'ペトラルカ': '古代ローマ古典を愛好し叙情詩集を著す！',
  'ボッカチオ': 'ペスト下の人間群像をユーモラスに描く『デカメロン』！',
  'ブルネレスキ': 'フィレンツェのサンタ・マリア大聖堂のドームを設計！',
  'ボッティチェリ': '『春』『ヴィーナスの誕生』で優美な人文美を描く！',
  'マキァヴェリ': '『君主論』で政治と宗教倫理の分離を提唱！',
  'レオナルド＝ダ＝ヴィンチ': '万能の天才！『モナ・リザ』『最後の晩餐』を描く！',
  'ミケランジェロ': '『ダヴィデ像』『最後の審判』で圧倒的な造形美を表現！',
  'ラファエロ': '聖母子像や『アテネの学堂』で調和ある美を完成！',
  'エラスムス': '『愚神礼賛』で教会の腐敗を痛烈に風刺！',
  'トマス＝モア': '『ユートピア』で囲い込み運動を批判！',
  'シェークスピア': '『ハムレット』『ロミオとジュリエット』など不朽の名作劇！',
  'セルバンテス': '騎士道小説をパロディ化した名作『ドン・キホーテ』！',
  'コペルニクス': '『天球の回転について』で地動説を唱える！',
  'ガリレオ＝ガリレイ': '望遠鏡で天体を観測！「それでも地球は動く」',
  'ケプラー': '惑星運動の三法則を発見し近代天文学の礎を築く！',
  'ルター': '九十五箇条の論題で贖宥状を批判！「信仰のみ」「聖書のみ」！',
  'カルヴァン': '『キリスト教綱要』を著しジュネーヴで予定説を推進！',
  'カール5世': 'ハプスブルク帝国を統治！ヴォルムス帝国議会でルターを追放！',
  'イグナティウス＝ロヨラ': 'イエズス会を結成し世界へカトリック布教を展開！',
  'ザビエル': '日本へ渡来しキリスト教を布教したイエズス会宣教師！',
  'ヘンリ8世': '首長法を発布しイギリス国教会を成立させる！',
  'エリザベス1世': '統一法でイギリス国教会を確立しアルマダを撃破！',
  'エンリケ': '航海王子！ポルトガルのアフリカ西岸探検を支援！',
  'バルトロメウ＝ディアス': 'アフリカ南端の喜望峰に到達！',
  'ヴァスコ＝ダ＝ガマ': 'インド洋を越えてカリカットへ到達！インド航路を開拓！',
  'コロンブス': '大西洋を西航しサンサルバドル島に到達！',
  'マゼラン': '世界周航艦隊を率いて大西洋から太平洋を横断！',
  'コルテス': 'アステカ帝国を滅ぼしたスペインの征服者！',
  'ピサロ': 'インカ帝国を滅ぼしたスペインの征服者！',
  'フェリペ2世': '太陽の沈まぬ帝国！レパント海戦に勝利しポルトガルを併合！',
  'オラニエ公ウィレム': 'ユトレヒト同盟を結びオランダ独立戦争を指導！',
  'アンリ4世': 'ナントの王令を発布してユグノー戦争を終結！',
  'リシュリュー': '三十年戦争に介入しフランスの絶対王政の基礎を確立！',
  'マザラン': 'フロンドの乱を鎮圧し幼少のルイ14世を補佐！',
  'ルイ14世': '太陽王！「朕は国家なり」、ヴェルサイユ宮殿を造営！',
  'コルベール': '重商主義政策を推進しフランスの商工業を育成！',
  'クロムウェル': '鉄騎隊を率いピューリタン革命を主導、共和政を樹立！',
  'ピョートル1世': '西欧化政策を進め北方戦争でバルト海への出口を獲得！',
  'エカチェリーナ2世': '啓蒙専制君主としてクリミア併合・ポーランド分割を実施！',
  'フリードリヒ2世': '「君主は国家第一の僕」、オーストリア継承戦争でシュレジエン獲得！',
  'マリア＝テレジア': 'ハプスブルク家を継承し国力再建と改革に邁進！',
  'ベーコン': '経験論の祖！実験と観察を重んじる帰納法を説く！',
  'デカルト': '合理論の祖！「我思う、ゆえに我あり」演繹法を提唱！',
  'ニュートン': '万有引力の法則を発見し『プリンキピア』を著す！',
  'ロック': '『統治二論』で抵抗権・社会契約説を唱える！',
  'モンテスキュー': '『法の精神』で三権分立を主張！',
  'ヴォルテール': '言論・信教の自由を訴え啓蒙思想を広める！',
  'ルソー': '『社会契約論』で人民主権と一般意思を説く！',
  'アダム＝スミス': '『国富論』で自由放任主義（見えざる手）を提唱！',
  'カント': '批判哲学を大成し純粋理性批判・永久平和論を著す！',
  'ワシントン': '大陸軍総司令官として独立戦争を指揮、アメリカ初代大統領！',
  'ジェファソン': 'アメリカ独立宣言を起草した第3代大統領！',
  'フランクリン': '米仏同盟を結実させた外交官にして避雷針の発明者！',
  'ルイ16世': 'フランス革命の激動の中で断頭台の露と消えた国王',
  'マリー＝アントワネット': 'オーストリア皇女からフランス王妃となった悲劇の女性',
  'ラ＝ファイエット': '人権宣言を起草しフランス・アメリカ両国の革命に参加！',
  'ロベスピエール': '公安委員会を率いて恐怖政治を敷いたジャコバン派指導者！',
  'ダントン': '「祖国は危機にあり！」と叫んだ革命指導者！',
  'ナポレオン': 'ナポレオン法典を制定しヨーロッパ全土を制覇したフランス皇帝！',
  'ネルソン': 'トラファルガー海戦でフランス連合艦隊を撃滅した英国の英雄！',
  'ウェリントン': 'ワーテルローの戦いでナポレオンを最終的に破ったイギリス将軍！',
  'サン＝ピエトロ大聖堂': 'ルネサンスの巨匠たちが集結して築いたカトリック総本山！',
  'カンタベリ大聖堂': 'イギリス国教会の総本山！',
  'ヴェルサイユ宮殿': 'ルイ14世が造営したバロック様式の豪壮な宮殿！',
  'バスティーユ': '民衆の襲撃によってフランス革命の幕が上がった要塞牢獄！',
  'バスティーユ牢獄': '民衆の襲撃によってフランス革命の幕が上がった要塞牢獄！',
  'ルーブル美術館': '歴代フランス王の宮殿から世界最大級の美術館へ！',
  'ルーヴル美術館': '歴代フランス王の宮殿から世界最大級の美術館へ！',
  'テュイルリー宮殿': '革命期に国王一家が幽閉され8月10日事件の舞台となった宮殿！',
  '廃兵院': '傷病兵のためにルイ14世が創設、ナポレオンの墓所がある！',
  'エスコリアル宮殿': 'フェリペ2世が築いた厳格なグリッド状の王宮修道院！',
  'サンスーシ宮殿': 'フリードリヒ2世がポツダムに築いたロココ様式の離宮！',
  'シェーンブルン宮殿': 'マリア＝テレジアが完成させたハプスブルク家の夏の離宮！',
  'エルミタージュ美術館': 'エカチェリーナ2世のコレクションから始まった冬宮殿！',
  'プラハ城': '三十年戦争の契機となったプラハ窓外投擲事件の舞台！',
  'ヴァルトブルク城': 'ルターが新約聖書をドイツ語に翻訳した歴史的古城！',
  'ゼーランディア城': '台湾にオランダ東インド会社が築き鄭成功に奪還された要塞！',
  '聖マリア＝デッレ＝グラツィエ教会': 'ダ＝ヴィンチの壁画『最後の晩餐』が描かれた修道院！',
  'システィナ礼拝堂': 'ミケランジェロが天井画と『最後の審判』を描いた教皇礼拝堂！',
  'ヴァチカン宮殿': 'ローマ教皇の公邸でありルネサンス芸術の殿堂！',
  'パレ＝ロワイヤル': '革命派市民が熱弁を振るいバスティーユ襲撃の拠点となった館！',
  'タンプル塔': '革命期にルイ16世と国王一家が幽閉された中世の塔！'
};

const customSceneRules = {
  'c07-l24-p02-002': {
    // レパントの海戦
    actors: [
      { name: 'フェリペ2世', at: [-3.7, 40.42], bubble: '太陽の沈まぬ帝国！カトリックを守護する！', action: 'command' }
    ],
    afterImage: 'レパントの海戦（オスマン海軍を撃破）',
    duration: 3200
  },
  'c07-l23-p03-009': {
    // アルマダ海戦
    actors: [
      { name: 'エリザベス1世', at: [-0.13, 51.51], bubble: '私は国と結婚した。無敵艦隊を打ち破れ！', action: 'cheer' }
    ],
    afterImage: 'アルマダの海戦（スペイン無敵艦隊の壊滅）',
    duration: 3400
  },
  'c07-l25-p01-006': {
    // ネーズビーの戦い・鉄騎隊
    actors: [
      { name: 'クロムウェル', at: [-0.13, 51.51], bubble: '神のために戦え！議会派の勝利を！', action: 'command' }
    ],
    afterImage: 'ネーズビーの戦い（新型軍・鉄騎隊の決定的勝利）',
    duration: 3200
  },
  'c07-l26-p03-004': {
    // 七年戦争・プロイセン
    actors: [
      { name: 'フリードリヒ2世', at: [13.41, 52.52], bubble: '君主は国家第一の僕である！孤軍奮闘！', action: 'command' }
    ],
    afterImage: '七年戦争（奇跡の戦局逆転とプロイセンの領土確保）',
    duration: 3200
  },
  'c07-l27-p04-012': {
    // サラトガの戦勝と米仏同盟
    actors: [
      { name: 'フランクリン', at: [-75.17, 39.95], bubble: 'パリでフランスとの同盟条約に調印成功！', action: 'negotiate' },
      { name: 'ルイ16世', at: [2.35, 48.86], bubble: 'イギリスに対抗しアメリカの独立を支援する！', action: 'command' }
    ],
    afterImage: 'サラトガの戦勝と米仏同盟成立',
    duration: 3200
  },
  'c07-l28-p02-001': {
    // バスティーユ襲撃
    actors: [
      { name: 'ルイ16世', at: [2.35, 48.86], bubble: 'なに、暴動か？……いや、これは革命です！', action: 'panic' }
    ],
    afterImage: 'バスティーユ襲撃（フランス革命の勃発）',
    duration: 3200
  },
  'c07-l28-p03-004': {
    // ヴァルミーの戦い
    actors: [
      { name: 'ゲーテ', at: [11.33, 50.98], bubble: 'ここから、そしてこの日から世界史の新しい時代が始まる！', action: 'speak' }
    ],
    afterImage: 'ヴァルミーの戦い（義勇軍がプロイセン軍を撃退）',
    duration: 3400
  },
  'c07-l29-p02-002': {
    // トラファルガー海戦
    actors: [
      { name: 'ネルソン', at: [-6.03, 36.18], bubble: '英国は各員がその義務を尽くすことを期待する！', action: 'command' },
      { name: 'ナポレオン', at: [2.35, 48.86], bubble: 'トラファルガーで敗れるも、大陸で制覇を果たす！', action: 'command' }
    ],
    afterImage: 'トラファルガーの海戦（イギリス海軍の制海権掌握）',
    duration: 3400
  },
  'c07-l29-p02-003': {
    // アウステルリッツ三帝会戦
    actors: [
      { name: 'ナポレオン', at: [2.35, 48.86], bubble: '余の辞書に不可能という言葉はない！三帝会戦に大勝利！', action: 'command' },
      { name: 'フランツ2世', at: [16.37, 48.21], bubble: 'アウステルリッツで敗北、神聖ローマ帝国解体へ……', action: 'lament' }
    ],
    afterImage: 'アウステルリッツの戦い（三帝会戦でのナポレオンの圧勝）',
    duration: 3400
  },
  'c07-l29-p03-003': {
    // ナポレオンのロシア遠征
    actors: [
      { name: 'ナポレオン', at: [2.35, 48.86], bubble: 'ロシア遠征の失敗……大陸軍の壊滅……', action: 'lament' }
    ],
    afterImage: 'ナポレオンのロシア遠征崩壊と退却戦',
    duration: 3400
  },
  'c07-l29-p03-006': {
    // ワーテルローの戦い
    actors: [
      { name: 'ナポレオン', at: [2.35, 48.86], bubble: '百日天下……最後の決戦ワーテルロー！', action: 'charge' },
      { name: 'ウェリントン', at: [-0.13, 51.51], bubble: '連合軍とプロイセン軍の合流によりワーテルローで勝利！', action: 'command' }
    ],
    afterImage: 'ワーテルローの戦い（ナポレオン帝政の完全終焉）',
    duration: 3400
  }
};

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
 [22,183,'ポルトガル','喜望峰','move',[[-9.14,38.72],[-18,27],[-19,8],[-1,-1],[10,-15],[15,-30],[18.48,-34.36]]],
 [22,185,'喜望峰','カリカット','trade',[[18.48,-34.36],[25,-36],[40,-15],[48,-4],[62,5],[75.78,11.26]]],
 [22,197,'ホルムズ','ゴア','campaign',[[56.45,27.06],[60,23],[68,18],[73.83,15.49]]],
 [22,223,'ゴア','マラッカ','campaign',[[73.83,15.49],[75,9],[81,4],[91,5],[98,5],[102.25,2.2]]],
 [22,243,'パロス','サンサルバドル','move',[[-6.89,37.23],[-17,29],[-35,25],[-55,23],[-74.5,24.1]]],
 [22,363,'アカプルコ','マニラ','trade',[[-99.88,16.86],[-130,18],[-165,14],[-180,13]]],
 [22,363,'アカプルコ','マニラ','trade',[[180,13],[155,13],[130,13],[120.98,14.6]]],
 [24,280,'バタヴィア','マラッカ','trade',[[106.85,-6.21],[105,-4],[104,0],[102.25,2.2]]],
 [24,294,'オランダ','喜望峰','trade',[[4.9,52.37],[-5,49],[-13,35],[-19,10],[0,-5],[12,-25],[18.48,-34.36]]],
 [27,75,'西アフリカ','カリブ海','trade',[[-15,12],[-35,14],[-55,15],[-72,15]]],
 [27,75,'カリブ海','イギリス','trade',[[-72,15],[-60,26],[-43,35],[-25,44],[-2.99,53.41]]],
 [27,75,'イギリス','西アフリカ','trade',[[-2.99,53.41],[-8,42],[-17,27],[-15,12]]],
 [26,535,'スウェーデン','ポルタヴァ','campaign',[[18.07,59.33],[25,56],[30,53],[34.55,49.59]]],
 [29,86,'フランス','エジプト','campaign',[[5.4,43.1],[9,40],[16,35],[25,33],[30.08,31.32]]],
 [29,248,'プロイセン','ベルリン','campaign',[[11,50],[12,51],[13.41,52.52]]],
 [29,290,'ナポレオン','モスクワ','campaign',[[21,52],[25,54],[30,54.5],[34,55],[37.62,55.75]]],
 [29,296,'パリ','ライプツィヒ','rival',[[12.37,51.34],[9,50],[6,49],[2.35,48.86]]]
];
const edition={},plans=[];
for(const volume of ancientSeries) {
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)) {
    const selected=page.passages.map(({paragraph,start,end})=>({p:paragraphById.get(paragraph),start,end}));
    const plainBody=selected.map(({p,start,end})=>p.text.slice(start,end));
    const body=selected.map(({p,start,end})=>decorate(p.text,boldSpans(p.markdown),start,end));
    const text=plainBody.join(''),title=page.title;
    const names=ancientNamesInText(title+'。'+text);
    const pins={},tags=[],props=[];
    for(const entry of names) {
      if(entry.kind==='person'||entry.kind==='building') {
        const img = resolveEntityImage(entry.name, entry.kind);
        assert.ok(img, `${entry.name} の画像が見つかりません`);
        const cname = ALIASES[entry.name] || entry.name;
        const bubble = BUBBLES[entry.name] || BUBBLES[cname] || entry.name;
        const size = entry.kind === 'building' ? 50 : 42;
        props.push({name:entry.name,at:entry.points[0],image:`ancient/${img}`,bubble,kind:'prop',size});
      }else if(entry.kind==='place')pins[entry.name]={name:entry.name,point:entry.points[0]};
      else tags.push({text:entry.name,at:entry.points[0]});
    }
    const activeRoutes=routes.filter(([lesson,line,from,to])=>selected.some(({p})=>p.lesson===lesson&&p.source[0].line===line)&&text.includes(from)&&text.includes(to))
      .map(([,,,,kind,points])=>({kind,points,start:0.08,end:0.95}));
    const points=names.flatMap(n=>n.points);
    const fallback=[-12,34,35,64];
    const frame=points.length?[Math.min(...points.map(p=>p[0]))-5,Math.min(...points.map(p=>p[1]))-5,Math.max(...points.map(p=>p[0]))+5,Math.max(...points.map(p=>p[1]))+5]:fallback;
    const id=`${volume.id}-${String(edition[volume.id].length+1).padStart(3,'0')}`;
    const rule = customSceneRules[id];
    let sceneActors = [];
    if (rule && rule.actors) {
      sceneActors = rule.actors.map(act => ({
        name: act.name,
        at: act.at,
        image: act.image || ('ancient/' + resolveEntityImage(act.name, 'person')),
        bubble: act.bubble || BUBBLES[act.name] || act.name,
        action: act.action || 'battle'
      }));
    }
    const sceneDuration = rule?.duration || (activeRoutes.length ? 2200 : (sceneActors.length ? 3200 : 0));
    const afterImage = rule?.afterImage || title;

    const s={id,title,body,plainBody,year:volume.period,chapter:0,kicker:volume.label,
      sourceText:{chapter:7,passages:page.passages,page:selected[0].p.page},frame,pins:Object.keys(pins),tags,zones:[],actors:sceneActors,props,
      routes:activeRoutes,rivers:ancientRivers.filter(r=>text.includes(r.name)),duration:sceneDuration,
      facts:[title],mapHeading:title,focus:title,before:title,after:afterImage,note:'',takeaway:''};
    edition[volume.id].push(s);plans.push({id,...page});
  }
}
const places=Object.fromEntries(Object.values(edition).flat().flatMap(s=>s.pins.map(name=>[name,{name,point:ancientNamesInText(name)[0].points[0]}])));
await write('public/chapter-07-edition.js',`// 原文の対応記録から生成。編集は docs/chapter-07 と生成処理へ。\nexport const chapterEdition = ${JSON.stringify(edition,null,2)};\nexport const chapterPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/chapter-07/page-plan.json',JSON.stringify(plans,null,2)+'\n');
