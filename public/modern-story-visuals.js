import { modernEdition } from './modern-c01-l01-edition.js';

// 本文と原文ページは変更せず、本人・一般集団・道具の視覚情報だけを重ねる。
// 吹き出しと図の注釈は史実上の発言の引用ではなく、本文に基づく説明。
const directory = 'modern-c01-l01';
const catalog = [];
const assetByKey = new Map();
function asset(key, name, kind, description, options = {}) {
  const entry = {
    key, image: `${directory}/${key}.png`, name, kind,
    identity: `${kind}:${key}`, description,
    width: 192,
    height: 192, requiresGeneration: true, ...options,
  };
  catalog.push(entry);
  assetByKey.set(key, entry);
  return entry;
}
function variant(key, base, description) {
  const original = assetByKey.get(base);
  const entry = asset(key, original.name, original.kind, description, { identity: original.identity, variantOf: base });
  original.afterImage = entry.image;
  return entry;
}
function existing(key, image, name, kind, description) {
  return asset(key, name, kind, description, { image, width: kind === 'person' ? 128 : 192, requiresGeneration: false });
}

for (const [key, name, description] of [
  ['metternich', 'メッテルニヒ', 'オーストリアの外交官。外交礼服と書類。本人を模式的に描く。'],
  ['castlereagh', 'カースルレー', 'イギリスの外交官。外交礼服と書類。本人を模式的に描く。'],
  ['talleyrand', 'タレーラン', '年配のフランス外交官。礼服と書類。本人を模式的に描く。'],
  ['alexander-i', 'アレクサンドル1世', 'ロシア皇帝の軍装。ニコライ1世と区別する本人の姿。'],
  ['hardenberg', 'ハルデンベルク', '年配のプロイセン外交官。礼服と書類。本人の姿。'],
  ['nicholas-i', 'ニコライ1世', 'ロシア皇帝の軍装。アレクサンドル1世と区別する本人の姿。'],
  ['toussaint-louverture', 'トゥサン＝ルヴェルチュール', 'ハイチの黒人指導者。18世紀末の軍装。本人の姿。'],
  ['miranda', 'ミランダ', 'ベネズエラの独立運動の指導者。19世紀初頭の軍装。'],
  ['simon-bolivar', 'シモン＝ボリバル', '南米の独立軍を率いた指導者。本人の軍装姿。'],
  ['san-martin', 'サン＝マルティン', '南米の独立軍を率いた指導者。ボリバルと区別する本人の軍装姿。'],
  ['hidalgo', 'イダルゴ', '年配のメキシコ人神父。聖職者の服。本人の姿。'],
  ['pedro-i', 'ペドロ', 'ブラジルの王子・のちの皇帝ペドロ1世。本人の軍装姿。'],
  ['james-monroe', 'モンロー', '米国大統領。19世紀初頭の礼服と宣言書。本人の姿。'],
  ['george-canning', 'カニング', 'イギリスの外交官。19世紀初頭の礼服と書類。'],
  ['muhammad-ali', 'ムハンマド＝アリー', 'エジプト太守。19世紀の統治者の服。預言者ムハンマドの画像とは別人。'],
  ['byron', 'バイロン', '英国の詩人。ギリシアへ赴いた義勇兵としての本人の姿。'],
  ['delacroix', 'ドラクロワ', 'フランスの画家。本人の服装と絵筆。戦闘参加者として描かない。'],
  ['louis-xviii', 'ルイ18世', '復古王朝のフランス国王。王の礼装。ルイ16世の画像を流用しない。'],
  ['charles-x', 'シャルル10世', '復古王朝のフランス国王。王の礼装。本人の姿。'],
  ['louis-philippe', 'ルイ＝フィリップ', '七月王政のフランス国王。19世紀の礼服。本人の姿。'],
  ['leopold-i', 'レオポルド1世', 'ベルギー国王。19世紀の礼装。本人の姿。'],
  ['mazzini', 'マッツィーニ', 'イタリアの共和派指導者。政治活動家の上着と書類。'],
  ['friedrich-list', 'リスト', '経済学者フリードリヒ・リスト。書類を持つ本人。作曲家のピアノは使わない。'],
  ['guizot', 'ギゾー', 'フランスの政治家。19世紀の礼服と政治の書類。'],
  ['lamartine', 'ラマルティーヌ', 'フランスの詩人・穏健共和派の政治家。本人の礼服姿。'],
  ['louis-blanc', 'ルイ＝ブラン', '社会主義者・政治家。19世紀の服と政策の書類。'],
  ['cavaignac', 'カヴェニャック', 'フランスの将軍。19世紀の軍装。本人の姿。'],
  ['louis-napoleon', 'ルイ＝ナポレオン', '大統領時代の本人。19世紀の礼服。ナポレオン1世とは別の顔。'],
  ['ferdinand-i-austria', 'フェルディナント1世', '1848年のオーストリア皇帝。旧教材の同名君主と別人。'],
  ['frederick-william-iv', 'フリードリヒ＝ヴィルヘルム4世', '1848年のプロイセン国王。本人の軍装または王の礼装。'],
  ['kossuth', 'コシュート', 'ハンガリーの独立指導者。19世紀の政治家の服。'],
  ['jelacic', 'イエラチッチ', 'クロアティア総督。本人の19世紀の軍装。'],
  ['palacky', 'パラツキー', 'チェック人の政治家・学者。19世紀の服と書類。'],
  ['carlo-alberto', 'カルロ＝アルベルト', 'サルデーニャ国王。1848年の本人の軍装姿。'],
  ['pius-ix', 'ピウス9世', 'ローマ教皇。白い聖職者の服。本人の姿。'],
]) asset(key, name, 'person', description);

variant('metternich-exile', 'metternich', '同じメッテルニヒ。1848年の失脚・亡命に伴う困惑。');
variant('charles-x-exile', 'charles-x', '同じシャルル10世。七月革命後の亡命に伴う落胆。');
variant('louis-philippe-exile', 'louis-philippe', '同じルイ＝フィリップ。二月革命後の亡命に伴う落胆。');
variant('louis-blanc-exile', 'louis-blanc', '同じルイ＝ブラン。政策敗北・亡命に伴う落胆。');
variant('napoleon-iii', 'louis-napoleon', 'ルイ＝ナポレオンと同じ顔。皇帝ナポレオン3世の礼装。');

for (const [key, name, description] of [
  ['diplomatic-delegates', '外交代表', '名前のない外交代表の一団。19世紀の外交礼服。'],
  ['liberal-students', '学生', '19世紀の学生の一団。書籍や政治の書類。'],
  ['revolutionary-citizens', '市民', '19世紀の普段着の市民。街頭の武装蜂起を担う一般集団。'],
  ['workers', '労働者', '19世紀の作業着を着た労働者の一団。'],
  ['industrialists', '産業資本家', '19世紀の事業者の上着と事業の帳簿。'],
  ['bankers', '銀行家', '19世紀の礼服と金融の帳簿・貨幣。名前のない資本家。'],
  ['farmers', '農民', '19世紀の農作業着を着た農民の一団。'],
  ['criollo-landowners', 'クリオーリョ', 'ラテンアメリカの地主。土地の書類と地主の服。顔だけで階層を示さない。'],
  ['peninsular-officials', 'ペニンスラール', '植民地の特権階層。役人の礼服と書類。顔だけで分類しない。'],
  ['indigenous-farmers', 'インディオ', 'ラテンアメリカの農民。地域の農作業着。誇張した装飾や似顔絵を避ける。'],
  ['mestizo-citizens', 'メスティーソ', 'ラテンアメリカの市民の服。階層・出自は画面の本文と名称で説明する。'],
  ['mulatto-citizens', 'ムラート', 'ラテンアメリカの市民の服。階層・出自は画面の本文と名称で説明する。'],
  ['haitian-rebels', 'ハイチの独立運動', '18世紀末から19世紀初頭の黒人奴隷・解放と独立を担う人々。'],
  ['greek-rebels', 'ギリシアの独立運動', '1820年代のギリシアの義勇兵の一団。'],
  ['french-soldiers', 'フランス軍', '19世紀のフランス兵士。特定の連隊の復元ではない一般兵の記号。'],
  ['austrian-soldiers', 'オーストリア軍', '1820年代から1840年代のオーストリアの一般兵。'],
  ['russian-soldiers', 'ロシア軍', '1830年代から1840年代のロシアの一般兵。'],
  ['prussian-soldiers', 'プロイセン軍', '1848年のプロイセンの一般兵。'],
  ['young-russian-officers', '青年将校', '1825年のロシアの青年将校。デカブリストを表す一般集団。'],
  ['ottoman-soldiers', 'オスマン帝国軍', '1820年代のオスマン帝国の一般兵。中世騎士の画像を使わない。'],
  ['egyptian-soldiers', 'エジプトの軍', '1820年代の近代化したエジプトの一般兵。'],
  ['dutch-soldiers', 'オランダ軍', '1830年のオランダの一般兵。'],
  ['sardinian-soldiers', 'サルデーニャ軍', '1848年のサルデーニャの一般兵。'],
  ['parliament-delegates', '議会の代表', '19世紀の議会の代表・知識人の一団。礼服と書類。'],
  ['portuguese-royal-family', 'ポルトガル王室', '19世紀初頭の名前のない王族の一団。本文にない王の実名を付けない。'],
]) asset(key, name, 'group', description);

for (const [key, name, kind, description] of [
  ['conference-table', '会議', 'prop', '外交会議の机・地図・書類。文字は画面側で表示。'],
  ['treaty-document', '条約・同盟', 'prop', '文書と封蝋。条約ごとの名称は画面側で表示。'],
  ['constitution-document', '憲法', 'prop', '憲法・王令・政治改革を表す書類。文字は画面側で表示。'],
  ['ballot-box', '選挙', 'prop', '投票箱。選挙権の範囲は本文と画面の名称で説明。'],
  ['napoleon-code', 'ナポレオン法典', 'prop', 'ナポレオン法典を表す法律書。文字は画面側で表示。'],
  ['sugar-plantation', 'プランテーション', 'prop', 'サトウキビのプランテーション。個別の農園名を追加しない。'],
  ['merchant-cargo', '貿易・投資', 'prop', '交易の荷物と投資の貨幣。'],
  ['steam-factory', '産業革命', 'prop', '本文の機械生産を表す蒸気機関と工場。個別の工場名を追加しない。'],
  ['railway', '鉄道', 'prop', '鉄道建設を表す蒸気機関車と線路。個別の路線名を追加しない。'],
  ['banquet-table', '改革宴会', 'prop', '宴会の料理・酒・机。政治改革を訴える宴会。'],
  ['barricade', 'バリケード', 'prop', '市街戦のバリケード。'],
  ['public-works', '国立作業場', 'prop', '公共事業の道路工事の道具。製造工場として描かない。'],
  ['tax-ledger', '税', 'prop', '税の負担を表す帳簿と貨幣。'],
  ['crown', '王位・帝位', 'prop', '王位や帝位を表す王冠。名前のない国王の顔の代わりにも使う。'],
  ['calendar', '年号', 'prop', '年号の確認を表す暦と本。年号は画面側で表示。'],
  ['city-hall', '市役所', 'building', '本文の市役所を表す模式的な建物。追加の正式な施設名を付けない。'],
  ['parliament-building', '議事堂', 'building', '本文の議事堂を表す模式的な建物。追加の施設名を付けない。'],
  ['royal-palace', '宮殿', 'building', '本文の宮殿を表す模式的な建物。原文にない宮殿名を付けない。'],
  ['painting-easel', '絵画', 'prop', '絵画を説明する画架と絵筆。絵の寓意の人物を現実の戦闘参加者にしない。'],
]) asset(key, name, kind, description);

existing('napoleon-i', 'ancient/napoleon-bonaparte.png', 'ナポレオン', 'person', '既存のナポレオン1世本人。ナポレオン3世には使わない。');
existing('lafayette', 'ancient/marquis-lafayette.png', 'ラ＝ファイエット', 'person', '既存のラ＝ファイエット本人。1830年の当事者として使う。');
existing('luther', 'ancient/martin-luther.png', 'ルター', 'person', '過去の宗教改革の参照。1817年の集会参加者として置かない。');
existing('washington', 'ancient/george-washington.png', 'ワシントン', 'person', '過去の中立・孤立外交の参照。モンローの宣言時の当事者として置かない。');
existing('hannibal', 'ancient/hannibal-general.png', 'ハンニバル', 'person', '過去の山越えの比較。南米の独立軍に混ぜない。');
existing('notre-dame', 'ancient/notre-dame-paris.png', 'ノートルダム大聖堂', 'building', '既存の本文にある建物の画像。');
existing('louvre', 'ancient/louvre-palace.png', 'ルーヴル宮殿', 'building', '既存の本文にある建物の画像。');
existing('tuileries', 'ancient/tuileries-palace.png', 'テュイルリー宮殿', 'building', '既存の本文にある建物の画像。');

const point = {
  vienna: [16.37, 48.21], london: [-0.13, 51.51], paris: [2.35, 48.86], france: [2, 47],
  berlin: [13.41, 52.52], russia: [30.34, 59.94], germany: [10, 51], austria: [14, 47.5],
  swiss: [8, 47], jena: [11.58, 50.93], italy: [12, 42], naples: [14.27, 40.85],
  piedmont: [7.7, 45.1], spain: [-3, 40], latin: [-70, -10], haiti: [-72.5, 19],
  venezuela: [-66, 8], peru: [-74, -10], mexico: [-102, 23], rio: [-43.2, -22.91],
  washington: [-77.04, 38.91], egypt: [30, 27], greece: [23, 39], balkans: [26, 46],
  brussels: [4.35, 50.85], warsaw: [21.01, 52.23], marseille: [5.37, 43.3],
  frankfurt: [8.68, 50.11], budapest: [19.05, 47.5], prague: [14.42, 50.08],
  turin: [7.69, 45.07], milan: [9.19, 45.46], venice: [12.34, 45.44], rome: [12.49, 41.9],
  europe: [14, 49], croatia: [16.5, 45.7],
};
const explanation = text => text ? `説明：${text}` : undefined;
function actor(key, name, at, options = {}) {
  const entry = assetByKey.get(key);
  if (!entry || !['person', 'group'].includes(entry.kind)) throw new Error(`人物・集団画像がありません: ${key}`);
  const { description, afterKey, ...rest } = options;
  return {
    name: name || entry.name, image: entry.image, at: typeof at === 'string' ? point[at] : at,
    kind: entry.kind, identity: entry.identity, bubble: explanation(description), ...rest,
    ...(afterKey ? { afterImage: assetByKey.get(afterKey).image } : {}),
  };
}
function prop(key, name, at, options = {}) {
  const entry = assetByKey.get(key);
  if (!entry || !['prop', 'building'].includes(entry.kind)) throw new Error(`道具・建物画像がありません: ${key}`);
  const { description, ...rest } = options;
  return {
    name: name || entry.name, image: entry.image, at: typeof at === 'string' ? point[at] : at,
    kind: 'prop', assetKind: entry.kind, identity: entry.identity, size: 64,
    bubble: explanation(description), ...rest,
  };
}
function figure(key, name, caption, temporalRole = 'current', reason) {
  const entry = assetByKey.get(key);
  return {
    image: entry.image, name: name || entry.name, caption: explanation(caption),
    kind: entry.kind, identity: entry.identity, temporalRole, ...(reason ? { reason } : {}),
  };
}
const group = (label, ...figures) => ({ label, figures });
const illustration = (title, ...groups) => ({ title, groups });
const sourceScenes = Object.values(modernEdition).flat();
const plans = {};
function scene(part, number, data) {
  const id = `modern-c01-l01-p${String(part).padStart(2, '0')}-${String(number).padStart(3, '0')}`;
  const original = sourceScenes.find(item => item.id === id);
  if (!original) throw new Error(`対象場面がありません: ${id}`);
  plans[id] = {
    sceneId: id, title: original.title,
    mapActors: [], mapProps: [], extraRoutes: [], illustration: null,
    hiddenPersonNames: original.tags.filter(tag => tag.kind === 'person').map(tag => tag.text),
    textOnlyPeople: [], excludedPersonNames: [], personAliases: [],
    ...data,
  };
}
const ref = (key, name, caption) => figure(key, name, caption, 'reference');

scene(1, 1, {
  mapActors: [actor('diplomatic-delegates', '五国委員会', 'vienna', { description: 'ウィーンで国際秩序を話し合う' })],
  mapProps: [prop('conference-table', 'ウィーン会議', 'vienna', { offset: [42, 0] })],
  illustration: illustration('ウィーン会議の中心人物',
    group('五国委員会',
      figure('metternich', null, 'オーストリア外相。議長を務める'),
      figure('castlereagh', null, 'イギリス外相'),
      figure('talleyrand', null, 'フランス外相'),
      figure('alexander-i', null, 'ロシア皇帝'),
      figure('hardenberg', null, 'プロイセン首相')),
    group('会議が開かれた背景', ref('napoleon-i', 'ナポレオン', '1814年にエルバ島へ流された'))),
  reason: '外交官の絵はウィーン会議の模式欄に集める。人物目録の各国拠点を会議中の現在地にしない。',
});
scene(1, 2, {
  mapActors: [actor('diplomatic-delegates', '会議の代表', 'vienna', { description: '領土と保守反動をめぐり対立する' })],
  mapProps: [prop('conference-table', 'ウィーン会議', 'vienna', { offset: [42, 0] })],
  illustration: illustration('話し合いが進まない理由',
    group('領土と保守反動', figure('treaty-document', '領土', '各国の要求が対立する'), figure('crown', '王侯貴族', '自由主義・ナショナリズムを抑えたい')),
    group('ナポレオン戦争後', ref('napoleon-i', 'ナポレオン', '戦争後の秩序の再建が議題になる'))),
  reason: '名前のない代表は一般集団として表示。過去のナポレオンを会議参加者にしない。',
});
scene(1, 3, {
  mapActors: [actor('talleyrand', null, 'vienna', { description: '正統主義でフランスの立場を強める' })],
  mapProps: [prop('constitution-document', '正統主義', 'vienna', { offset: [45, 0] })],
  illustration: illustration('タレーランの主張',
    group('正統主義', figure('constitution-document', '正統主義', '革命前の主権・王朝を正統とする')),
    group('革命と戦争の説明', ref('napoleon-i', 'ナポレオン', 'フランスを被害者として扱うために言及される'))),
  reason: 'タレーランは会議の現地ウィーンに配置。ナポレオンは主張の背景の参照だけにする。',
});
scene(1, 4, {
  mapActors: [actor('diplomatic-delegates', '会議の代表', 'vienna', { description: '領土要求と勢力均衡が対立する' })],
  mapProps: [prop('conference-table', '勢力均衡', 'vienna', { offset: [42, 0] })],
  illustration: illustration('領土要求と勢力均衡',
    group('領土を求める側', figure('alexander-i', null, 'ポーランドを要求する'), figure('diplomatic-delegates', 'プロイセン', 'ザクセンを求める')),
    group('勢力均衡を重視する側', figure('castlereagh', null, 'ロシアの拡大を警戒する'), figure('metternich', null, '各国の利害と均衡を考える')),
    group('領土要求の背景', ref('napoleon-i', 'ナポレオン', '戦争中の協力関係が領土要求に関わる'))),
  reason: '交渉者を模式欄で対比。本人がポーランドやザクセンへ遠征する動きは作らない。',
});
scene(1, 5, {
  mapActors: [actor('napoleon-i', 'ナポレオン', 'paris', { route: 0, description: 'エルバ島を脱出してフランスへ戻る' })],
  mapProps: [prop('treaty-document', 'ウィーン議定書', 'vienna', { from: 0.6 })],
  illustration: illustration('共通の敵を前に妥協する', group('議定書の成立', figure('diplomatic-delegates', '各国の代表', 'ナポレオンの復活で妥協を進める'), figure('treaty-document', 'ウィーン議定書', '戦後の領土と秩序を決める'))),
  reason: '本人のエルバ島脱出だけを既存経路に結び付ける。名前のない復古王朝の国王を追加しない。',
});
scene(1, 6, {
  mapActors: [actor('diplomatic-delegates', '各国の代表', 'vienna', { description: '大国の利益に沿って領土を組み替える' })],
  mapProps: [prop('treaty-document', '領土の再編', 'vienna', { offset: [42, 0] })],
  illustration: illustration('領土再編で利益を得た国と負担した地域',
    group('利益を得た大国', figure('diplomatic-delegates', 'イギリス', '海外領土などを獲得する'), figure('diplomatic-delegates', 'ロシア', 'ポーランドを得る')),
    group('領土再編の負担', figure('treaty-document', 'イタリア', '大国の領土交換の犠牲となる'), figure('treaty-document', 'ノルウェー', 'スウェーデンの支配に移る'))),
  reason: '図の各国の姿は一般代表・領土の記号。条約の交渉以外に人物の移動を補わない。',
});
scene(1, 7, {
  mapActors: [actor('diplomatic-delegates', 'スイス', 'swiss', { description: '永世中立を認められる' })],
  mapProps: [prop('treaty-document', '永世中立', 'swiss', { offset: [42, 0] })],
  reason: 'スイスの一般代表と中立の文書の記号で表現。本文にない君主を追加しない。',
});
scene(1, 8, {
  mapActors: [actor('alexander-i', null, 'russia', { description: '神聖同盟を提唱する' })],
  mapProps: [prop('treaty-document', '神聖同盟', 'austria')],
  illustration: illustration('神聖同盟と不参加の国・教皇',
    group('神聖同盟', figure('treaty-document', '神聖同盟', 'キリスト教の教えによる君主の結び付き。自由主義運動の弾圧に利用される')),
    group('参加しない側', figure('treaty-document', 'イギリス', '神聖同盟に参加しない'), figure('treaty-document', 'オスマン帝国', '神聖同盟に参加しない'), figure('treaty-document', 'ローマ教皇', 'ロシア皇帝の指導に加わらない'))),
  excludedPersonNames: [{ name: 'リスト', reason: 'キリスト教の中の誤一致。本人はこの場面の本文に登場しない。' }],
  reason: '実在人物は提唱者アレクサンドル1世のみ。キリスト教内のリストの誤一致を人物絵に使わない。',
});
scene(1, 9, {
  mapActors: [actor('metternich', null, 'vienna', { description: '保守反動の体制を支える' })],
  mapProps: [prop('treaty-document', '四国同盟・五国同盟', 'vienna', { offset: [42, 0] })],
  illustration: illustration('四国同盟から五国同盟へ', group('同盟の広がり', figure('diplomatic-delegates', '四国同盟', 'イギリス・オーストリア・プロイセン・ロシア'), figure('diplomatic-delegates', 'フランス', '加わって五国同盟になる'))),
  reason: '本文にあるメッテルニヒと同盟の一般代表を表示。未登場の外交官を先取りしない。',
});

scene(2, 1, {
  mapActors: [actor('revolutionary-citizens', '自由主義運動', 'europe', { description: '自由主義とナショナリズムが再び高まる' })],
  mapProps: [prop('napoleon-code', 'ナポレオン法典', 'france')],
  illustration: illustration('ナポレオン時代の影響', group('過去の経験', ref('napoleon-i', 'ナポレオン', '法典や支配の経験が後の運動にも影響する'))),
  reason: '現地の運動は一般の人々で表現し、過去のナポレオンを反乱の当事者にしない。',
});
scene(2, 2, {
  mapActors: [actor('revolutionary-citizens', 'ナショナリズム', 'germany', { description: '統一や独立を求める' })],
  mapProps: [prop('constitution-document', '自由主義', 'germany', { offset: [42, 0] })],
  illustration: illustration('自由主義とナショナリズム', group('求めるものの違い', figure('constitution-document', '自由主義', '個人の自由や政治・経済の自由'), figure('revolutionary-citizens', 'ナショナリズム', '一つの民族による一つの国家'))),
  reason: '制度に架空の都市を割り当てず、本文で述べるドイツの運動を現地の代表的な集団で表示。',
});
scene(2, 3, {
  mapActors: [actor('liberal-students', 'ブルシェンシャフト', 'jena', { description: '自由とドイツ統一を求める' }), actor('metternich', null, 'vienna', { description: '学生運動を禁止する' })],
  illustration: illustration('学生運動と宗教改革の記念', group('学生たち', figure('liberal-students', '学生', '宗教改革300周年を記念して集会を開く')), group('過去の宗教改革', ref('luther', 'ルター', '宗教改革の記念。1817年の参加者ではない'))),
  reason: '学生はイェナ周辺、弾圧する政治家はウィーン。ルターは過去の参照だけ。イタリアへの軍事経路を加えない。',
});
scene(2, 4, {
  mapActors: [actor('austrian-soldiers', 'オーストリア軍', 'naples', { route: 1, offset: [32, 0], description: 'ナポリの立憲革命を鎮圧する' }), actor('austrian-soldiers', 'オーストリア軍', 'piedmont', { route: 0, offset: [-32, 0], description: 'ピエモンテの立憲革命を鎮圧する' })],
  illustration: illustration('カルボナリの運動', group('立憲政治を求める側', figure('revolutionary-citizens', 'カルボナリ', 'ナポリ・ピエモンテで立憲革命を起こす'), figure('constitution-document', '立憲政治', '憲法による政治を求める'))),
  reason: '二つの既存介入経路はオーストリアの一般軍に結び付ける。カルボナリを実際の炭焼き職人として描かない。',
});
scene(2, 5, {
  mapActors: [actor('revolutionary-citizens', '立憲革命', 'spain', { description: 'スペインで立憲政治を求める' }), actor('french-soldiers', 'フランス軍', 'spain', { route: 0, offset: [40, 0], description: '立憲革命を鎮圧する' })],
  illustration: illustration('復古と立憲革命', group('革命と介入', figure('constitution-document', '立憲政治', 'スペインで要求される'), figure('treaty-document', 'イギリス', '革命への干渉に反対する')), group('比較される過去の支配', ref('napoleon-i', 'ナポレオン', '復古王朝との比較として本文に登場'))),
  reason: '本文にないリエゴを追加せず、一般の立憲派とフランス軍を使う。ナポレオンは過去の参照。',
});
scene(2, 6, {
  mapActors: [actor('young-russian-officers', 'デカブリスト', 'russia', { offset: [-36, 0], description: '立憲政治と農奴解放を求める' }), actor('nicholas-i', null, 'russia', { offset: [36, 0], description: '青年将校の反乱を鎮圧する' })],
  illustration: illustration('青年将校の経験と皇帝の交代', group('反乱の背景', ref('alexander-i', null, '死去が反乱のきっかけとなる'), ref('napoleon-i', 'ナポレオン', '戦争を通じて将校が西欧の自由主義に触れる'))),
  reason: '新皇帝と青年将校のみ現地の当事者。死去したアレクサンドル1世と過去のナポレオンを混在させない。',
});
scene(2, 7, {
  mapActors: [actor('revolutionary-citizens', '自由主義運動', 'europe', { description: '鎮圧されても運動は続く' })],
  mapProps: [prop('constitution-document', '自由主義', 'europe', { offset: [42, 0] })],
  reason: '1820年代の運動のまとめを一般の人々と政治改革の書類で表す。新しい実在人物を補わない。',
});

scene(3, 1, {
  mapActors: [actor('revolutionary-citizens', '独立運動', 'latin', { description: 'ラテンアメリカでも独立運動が広がる' })],
  illustration: illustration('原文にある社会階層と人々',
    group('支配と独立をめぐる階層', figure('peninsular-officials', null, '本国生まれの特権階層'), figure('criollo-landowners', null, '植民地生まれの白人。独立運動の中心となる')),
    group('独立運動に参加する人々', figure('mestizo-citizens', null, '原文の呼称で示す'), figure('indigenous-farmers', null, '原文の呼称で示す'), figure('mulatto-citizens', null, '原文の呼称で示す')),
    group('ヨーロッパの出来事', ref('napoleon-i', 'ナポレオン', 'スペインの王朝の混乱が独立運動にも関わる'))),
  reason: '社会階層を模式欄で説明し、階層そのものに架空の都市を与えない。地図はラテンアメリカの運動を示す。',
});
scene(3, 2, {
  mapActors: [actor('haitian-rebels', '黒人奴隷', 'haiti', { description: '解放と独立を求めて立ち上がる' })],
  mapProps: [prop('sugar-plantation', 'プランテーション', 'haiti', { offset: [45, 0] })],
  illustration: illustration('ハイチ独立までの流れ',
    group('奴隷制の廃止を目指す', figure('toussaint-louverture', null, '奴隷制の廃止を目指す指導者。捕らえられてフランスで死去')),
    group('フランス側の政策', figure('napoleon-i', 'ナポレオン', '奴隷制を復活させようとし、軍を送る')),
    group('独立へ', figure('haitian-rebels', 'ハイチ', '1803年にナポレオン軍を退け、独立する'))),
  reason: '長い経過を模式欄で分ける。死後のトゥサンを独立時の生存する指導者にせず、ナポレオン本人をハイチへ動かさない。',
});
scene(3, 3, {
  mapActors: [actor('simon-bolivar', null, 'venezuela', { route: 0, description: '北から独立運動を進める' })],
  illustration: illustration('独立運動の指導者',
    group('北から進む運動', figure('miranda', null, '1810年にベネズエラの運動を率いる')),
    group('南の指導者の紹介', figure('san-martin', null, 'この場面では南からの指導者として紹介される'))),
  reason: '既存の概略経路にはボリバル本人を結び付ける。サン＝マルティンの遠征は次の場面で扱う。',
});
scene(3, 4, {
  mapActors: [actor('san-martin', null, 'peru', { route: 0, offset: [-30, 0], description: 'アンデスを越えてチリ・ペルーへ進む' }), actor('simon-bolivar', 'ボリバル', 'peru', { from: 0.8, offset: [38, 0], description: 'ペルーで後を引き継ぐ' })],
  illustration: illustration('山越えの比較と引き継ぎ', group('過去の山越えとの比較', ref('hannibal', null, 'アンデス越えを説明する比較'), ref('napoleon-i', 'ナポレオン', 'アンデス越えを説明する比較'))),
  reason: '本人のアンデス越えを既存経路で表示。会談の場所は原文のペルーのまま。過去の二人を南米の軍に混ぜない。',
});
scene(3, 5, {
  mapActors: [actor('indigenous-farmers', 'インディオ', 'mexico', { description: '独立運動に参加する農民' }), actor('mestizo-citizens', 'メスティーソ', 'mexico', { offset: [45, 0], description: '独立運動に参加する農民' })],
  illustration: illustration('メキシコ独立の二つの段階', group('初めの運動', figure('hidalgo', null, '農民を率いる神父。後に処刑される')), group('その後の独立', figure('criollo-landowners', null, '特権を守るために独立へ向かう'))),
  reason: 'イダルゴの運動と、死後のクリオーリョの独立を分ける。本文にない皇帝の名前を追加しない。',
});
scene(3, 6, {
  mapActors: [actor('portuguese-royal-family', 'ポルトガル王室', 'rio', { route: 0, offset: [-35, 0], description: 'ブラジルへ逃亡する' }), actor('pedro-i', 'ペドロ', 'rio', { from: 0.72, offset: [42, 0], description: '皇帝となりブラジルが独立する' })],
  illustration: illustration('王室の逃亡とブラジルの独立', group('ヨーロッパの背景', ref('napoleon-i', 'ナポレオン', 'ポルトガル王室の逃亡の背景')), group('独立後も残る制度', figure('criollo-landowners', null, '独立後も地主の支配が残る'))),
  reason: '王室の概略逃亡経路と、ペドロの独立時の役割を区別。名前のない国王を別人の肖像で補わない。',
});
scene(3, 7, {
  mapActors: [actor('metternich', null, 'vienna', { description: '独立運動への干渉を計画する' })],
  mapProps: [prop('treaty-document', '神聖同盟', 'vienna', { offset: [42, 0] })],
  illustration: illustration('実行されなかった干渉計画', group('メッテルニヒの構想', figure('treaty-document', '神聖同盟', 'ヨーロッパへの革命の波及を恐れる'), figure('treaty-document', 'ラテンアメリカ', '神聖同盟による軍事干渉の対象と考える'))),
  reason: '計画と実行を混同せず、本人や軍隊をラテンアメリカへ渡らせない。',
});
scene(3, 8, {
  mapActors: [actor('james-monroe', null, 'washington', { description: '両大陸の相互不干渉を宣言する' })],
  mapProps: [prop('constitution-document', 'モンロー宣言', 'washington', { offset: [42, 0] })],
  illustration: illustration('モンロー宣言の背景', group('過去の外交方針', ref('washington', null, '中立・孤立外交の前例として本文に登場'))),
  reason: '宣言の当事者はモンロー。過去のワシントンを同席させず、説明の参照に限定する。',
});
scene(3, 9, {
  mapActors: [actor('george-canning', null, 'london', { description: '独立支持と経済進出を結び付ける' })],
  mapProps: [prop('merchant-cargo', '貿易・投資', 'latin', { description: '政治的不干渉のもとで経済進出が進む' })],
  illustration: illustration('イギリスの支持と干渉計画の断念', group('独立を支持する側', figure('james-monroe', null, '相互不干渉の宣言')), group('干渉を断念する側', figure('metternich', null, 'イギリスの支持で計画を断念する'))),
  reason: '外交官は各国側の説明拠点に置き、カニング本人を貿易のため南米へ動かさない。',
});
scene(3, 10, {
  mapActors: [actor('indigenous-farmers', '農民', 'latin', { description: '独立しても貧しい生活が続く' })],
  mapProps: [prop('sugar-plantation', 'プランテーション', 'latin', { offset: [45, 0] })],
  illustration: illustration('独立後に残った支配と依存', group('地主と農民', figure('criollo-landowners', null, '独立後も社会の支配層'), figure('indigenous-farmers', '農民', '社会の下層にとどまる')), group('経済の依存', figure('merchant-cargo', 'イギリスの資本', '輸出作物と投資への依存が残る'))),
  reason: '現地の農民と農園を描く。階層や英国資本に架空の都市を割り当てず、関係は模式欄で説明。',
});

scene(4, 1, {
  mapActors: [actor('greek-rebels', 'ギリシア人', 'greece', { offset: [-35, 0], description: 'オスマン帝国からの独立を求める' }), actor('ottoman-soldiers', 'オスマン帝国', 'greece', { offset: [40, 0], description: '独立運動を弾圧する' })],
  reason: 'この場面で名前のない当事者は一般集団。バイロンやムハンマド＝アリーを先取りしない。',
});
scene(4, 2, {
  mapActors: [actor('byron', null, 'greece', { route: 0, offset: [-30, 0], description: '義勇兵としてギリシアへ赴く' }), actor('egyptian-soldiers', 'エジプトの軍', 'greece', { offset: [45, 0], description: 'オスマン帝国を支援して弾圧する' })],
  illustration: illustration('支援を広げた知識人とエジプト側の指導者', group('軍の協力', figure('muhammad-ali', null, 'エジプト太守として軍の近代化を進める')), group('絵画による独立支援', figure('delacroix', null, 'フランスで絵を描いて支援を訴える'), figure('painting-easel', 'キオス島（シオ）の虐殺', '独立支援を訴えた絵画'))),
  reason: '本人の渡航が明示されるバイロンのみ移動。画家を戦場へ動かさず、太守を預言者と取り違えない。',
});
scene(4, 3, {
  mapActors: [actor('russian-soldiers', 'ロシア', 'balkans', { description: 'バルカン半島への南下を進める' }), actor('greek-rebels', 'ギリシア', 'greece', { description: '列強の介入を経て独立が認められる' })],
  mapProps: [prop('treaty-document', '独立', 'greece', { offset: [42, 0] })],
  illustration: illustration('列強の介入と独立の承認', group('支援の利害', figure('diplomatic-delegates', 'ロシア', '南下政策を進める'), figure('diplomatic-delegates', '英仏', 'ロシアの拡大も警戒して参戦する')), group('独立の承認', figure('treaty-document', 'ギリシア', '条約・会議を経て独立が承認される'))),
  reason: 'ロシア兵の点は本文のバルカン半島側。既存の政治的な南下の線を、本人や軍がギリシアまで行った旅として結び付けない。',
});
scene(4, 4, {
  mapActors: [actor('louis-xviii', null, 'paris', { description: '復古王朝で反動政治を進める' })],
  mapProps: [prop('ballot-box', '選挙権', 'paris', { offset: [42, 0], description: '有権者は国民の約0.3パーセント' })],
  illustration: illustration('復古王朝の政治', group('特権層', figure('diplomatic-delegates', '亡命貴族', '復古王朝の特権層'))),
  reason: 'ルイ18世本人を使い、既存のルイ16世やルイ＝フィリップの絵を代用しない。',
});
scene(4, 5, {
  mapActors: [actor('charles-x', null, 'paris', { description: '反動政治を強める' }), actor('farmers', '農民', 'france', { description: '税の負担への不満が高まる' })],
  mapProps: [prop('tax-ledger', '税', 'france', { offset: [42, 0] })],
  illustration: illustration('国王の交代と反動政治', group('前の国王', ref('louis-xviii', null, 'シャルル10世の兄・前の国王')), group('反動政治', figure('tax-ledger', '補償金', '亡命貴族に支払われる'))),
  reason: '前王は参照に分ける。農民の土地が実際に没収されたという演出を追加しない。',
});
scene(4, 6, {
  mapActors: [actor('charles-x', null, 'paris', { description: '議会を解散し選挙をやり直す' }), actor('french-soldiers', 'アルジェリア出兵', [3, 36.7], { route: 0, description: '選挙への不満をそらそうとして出兵する' })],
  mapProps: [prop('ballot-box', '選挙', 'paris', { offset: [42, 0] })],
  extraRoutes: [{ kind: 'campaign', points: [[2.35, 48.86], [5.4, 43.3], [3, 36.7]], start: 0.12, end: 0.9 }],
  reason: '本文にあるフランス軍のアルジェリア出兵の概略のみ追加。沿岸への経路で、立寄都市の名称や国王本人の遠征を補わない。',
});
scene(4, 7, {
  mapActors: [actor('charles-x', null, 'paris', { description: '七月王令で政治を押し戻す' }), actor('revolutionary-citizens', 'パリ市民', 'paris', { offset: [45, 0], description: '王令に反発する' })],
  mapProps: [prop('constitution-document', '七月王令', 'paris', { offset: [-45, 0] })],
  reason: '王令の公布とパリの反発を表示。説明は本文に基づくもので、創作した国王の発言を引用にしない。',
});
scene(4, 8, {
  mapActors: [actor('lafayette', null, 'paris', { description: '国民軍の司令官となる' }), actor('charles-x', null, 'london', { route: 0, afterKey: 'charles-x-exile', description: 'パリを逃れイギリスへ亡命する' })],
  mapProps: [prop('city-hall', '市役所', 'paris', { offset: [45, 0] })],
  illustration: illustration('七月革命の参加者・施設・絵画',
    group('蜂起した人々', figure('industrialists', 'ブルジョワジー', '市民の武装蜂起に参加'), figure('workers', null, '市民の武装蜂起に参加'), figure('liberal-students', null, '市民の武装蜂起に参加')),
    group('占拠した施設', figure('city-hall', null, '国民軍が占拠'), figure('notre-dame', null, '国民軍が占拠'), figure('louvre', null, '国民軍が占拠')),
    group('戦闘を描いた絵画', figure('delacroix', null, '民衆を導く自由の女神を描く'), figure('painting-easel', '民衆を導く自由の女神', '自由の女神は実在の参加者ではなく絵画の寓意'))),
  reason: '施設の詳細と階層は地図外へ。王の亡命のみ既存経路で移動。自由の女神を実在の兵士にしない。',
});
scene(4, 9, {
  mapActors: [actor('louis-philippe', null, 'paris', { description: '七月王政の国王となる' }), actor('bankers', '大資本家', 'paris', { offset: [45, 0], description: '立憲王政を支持する' })],
  illustration: illustration('七月王政をめぐる対立', group('立憲王政を支持する側', figure('bankers', '大資本家', '銀行家・金融資本家が中心')), group('共和政を求める側', figure('industrialists', '中小資本家', '政権から外される'), figure('workers', null, '政権から外される'))),
  reason: '集団の政治的な対立は模式欄で説明。各階層に別の架空の場所を割り当てない。',
});
scene(4, 10, {
  mapActors: [actor('revolutionary-citizens', 'ベルギーの市民', 'brussels', { description: 'オランダからの独立を求める' }), actor('dutch-soldiers', 'オランダ軍', 'brussels', { route: 0, offset: [42, 0], description: 'ベルギーへ侵入する' })],
  extraRoutes: [{ kind: 'rival', points: [[5, 52], [4.35, 50.85]], start: 0.12, end: 0.88 }],
  illustration: illustration('独立後のベルギー', group('立憲王政', figure('leopold-i', null, '国王に迎えられる'), figure('treaty-document', '永世中立', '列強に認められる'))),
  reason: '一般の市民と侵入したオランダ軍を現地へ。国王の本人画像は独立後の説明に分ける。',
});
scene(4, 11, {
  mapActors: [actor('revolutionary-citizens', 'ドイツの自由主義運動', 'germany', { description: '立憲政治と自由を求める' }), actor('austrian-soldiers', 'オーストリア軍', 'germany', { offset: [42, 0], description: '自由主義運動を鎮圧する' })],
  illustration: illustration('ドイツ連邦による弾圧', group('運動を抑える側', figure('metternich', null, 'ドイツ連邦議会を通じて運動を抑える'), figure('treaty-document', 'ドイツ連邦', 'オーストリア・プロイセン・バイエルンが介入する'))),
  reason: '軍は一般兵。メッテルニヒ本人が軍を率いてドイツへ遠征した演出を追加しない。',
});
scene(4, 12, {
  mapActors: [actor('revolutionary-citizens', '独立反乱', 'warsaw', { description: 'ロシア支配からの独立を求める' }), actor('russian-soldiers', 'ロシア軍', 'warsaw', { offset: [45, 0], description: '反乱を鎮圧し自治権を奪う' })],
  reason: '一般の反乱参加者とロシア軍。本文に名前のないニコライ1世や、補足欄だけのショパンを追加しない。',
});
scene(4, 13, {
  mapActors: [actor('mazzini', null, 'marseille', { route: 0, description: '亡命先で青年イタリアを結成する' })],
  mapProps: [prop('constitution-document', '青年イタリア', 'marseille', { offset: [45, 0] })],
  illustration: illustration('カルボナリから青年イタリアへ', group('運動の違い', figure('revolutionary-citizens', 'カルボナリ', '秘密結社の運動'), figure('revolutionary-citizens', '青年イタリア', '広く人々に呼びかける運動'))),
  reason: 'マッツィーニはこの場面のマルセイユに置く。人物目録のローマを現在地にせず、後の指導者を先取りしない。',
});
scene(4, 14, {
  mapActors: [actor('industrialists', '産業資本家', 'london', { description: '選挙法改正で選挙権を得る' })],
  mapProps: [prop('railway', '鉄道', 'germany', { description: '工業化とともに建設が進む' })],
  illustration: illustration('改革とドイツの経済発展', group('イギリスの改革', figure('ballot-box', '選挙法改正', '1832年に産業資本家の選挙権が拡大')), group('ドイツ関税同盟', figure('friedrich-list', 'リスト', '経済学者として影響を与える'), figure('farmers', '農民', '封建制度の廃止で自由が広がる'))),
  reason: 'リストの影響は模式欄へ。作曲家の姿を使わず、本人の特定の居場所や列車旅行を捏造しない。',
});

scene(5, 1, {
  mapActors: [actor('louis-philippe', null, 'paris', { description: '国民の王を名乗るが支持は狭い' }), actor('bankers', '銀行家', 'paris', { offset: [42, 0], description: '選挙権は金持ちに偏る' })],
  mapProps: [prop('ballot-box', '選挙権', 'paris', { offset: [-42, 0] })],
  illustration: illustration('選挙権から取り残された人々', group('七月王政への不満', figure('industrialists', '産業資本家', '選挙権を得られず不満を抱く'), figure('workers', null, '選挙権を得られず不満を抱く'))),
  reason: '株屋の王は本文の評価。国王が自称した台詞として引用せず、説明として表示。',
});
scene(5, 2, {
  mapActors: [actor('workers', null, 'paris', { description: '選挙権と生活の改善を求める' }), actor('farmers', null, 'france', { description: '凶作や恐慌で生活が苦しくなる' })],
  mapProps: [prop('steam-factory', '産業革命', 'france', { offset: [42, 0] })],
  illustration: illustration('産業革命の利益と社会不安', group('利益を得る側', figure('bankers', '大資本家', '大型事業などで利益を得る')), group('苦境にある側', figure('industrialists', '中小資本家', '恐慌で倒産が相次ぐ'), figure('workers', null, '食料や政治改革を求める'))),
  reason: '機械生産と現地の人々を表示。本文にない社会主義者の実名を追加しない。',
});
scene(5, 3, {
  mapActors: [actor('revolutionary-citizens', '改革宴会', 'paris', { description: '選挙法改正を訴える' })],
  mapProps: [prop('banquet-table', '改革宴会', 'paris', { offset: [42, 0] }), prop('barricade', 'バリケード', 'paris', { from: 0.7, offset: [-42, 0] })],
  illustration: illustration('宴会の禁止と蜂起', group('集会を禁じる側', figure('louis-philippe', null, '七月王政の国王'), figure('guizot', null, '政治集会・改革宴会を禁じる'))),
  reason: 'ギゾーを宴会の参加者にしない。宴会と蜂起の道具を段階的に示すが、料理の机が同じバリケードになったとは断定しない。',
});
scene(5, 4, {
  mapActors: [actor('workers', '市民', 'paris', { description: '蜂起して七月王政を倒す' })],
  mapProps: [prop('barricade', '武装蜂起', 'paris', { offset: [-40, 0] }), prop('tuileries', null, 'paris', { offset: [44, 0] })],
  illustration: illustration('王政の崩壊から臨時政府へ', group('国王軍と戦った人々', figure('industrialists', '産業資本家', '労働者と団結して蜂起する'), figure('workers', null, '産業資本家と団結して蜂起する')), group('七月王政の崩壊', figure('louis-philippe-exile', 'ルイ＝フィリップ', '王宮を失い亡命する'), figure('guizot', null, '国王に解任される')), group('臨時政府', figure('lamartine', null, '穏健共和派として参加'), figure('louis-blanc', null, '社会主義者として参加'))),
  reason: '王政側と新政府の同席図を作らず模式欄の二段階で表示。亡命先の地名が本文にないため国王の渡航経路を補わない。',
});
scene(5, 5, {
  mapActors: [actor('louis-blanc', null, 'paris', { description: '労働者の保護に取り組む' }), actor('workers', null, 'paris', { offset: [42, 0], description: '公共事業で仕事を得る' })],
  mapProps: [prop('public-works', '国立作業場', 'paris', { offset: [-42, 0] })],
  illustration: illustration('第二共和政の改革', group('政治と労働', figure('ballot-box', '男性普通選挙', '男性の選挙権が拡大する'), figure('public-works', '国立作業場', '公共事業を通じて職を与える'))),
  reason: '国立作業場は公共事業・仕事の提供として表示し、製品を製造する工場の建物にしない。',
});
scene(5, 6, {
  mapActors: [actor('workers', null, 'paris', { description: '仕事が足りず待機が増える' }), actor('farmers', null, 'france', { description: '税の負担に反感を抱く' })],
  mapProps: [prop('tax-ledger', '税', 'france', { offset: [42, 0] })],
  illustration: illustration('労働者保護への反感', group('政策に反対する側', figure('farmers', null, '税の負担への不満'), figure('industrialists', 'ブルジョワジー', '労働者保護への反感'))),
  reason: '名前のない社会集団と税の道具で表示。ルイ＝ブランの名前がこの場面の本文にないため本人像を追加しない。',
});
scene(5, 7, {
  mapActors: [actor('louis-blanc', null, 'paris', { afterKey: 'louis-blanc-exile', description: '選挙に敗れ議員になれない' }), actor('farmers', null, 'france', { description: '社会主義者の支持は広がらない' })],
  mapProps: [prop('ballot-box', '普通選挙', 'paris', { offset: [42, 0] })],
  illustration: illustration('選挙結果と政策の後退', group('多数を占めた側', figure('parliament-delegates', 'ブルジョワジー', '議会で多数となり労働者保護を撤回')), group('閉鎖', figure('public-works', '国立作業場', '閉鎖される'))),
  reason: '表情の切替は同じルイ＝ブランの選挙敗北を表す。切替画像が亡命にも使われるが、この場面で渡航は描かない。',
});
scene(5, 8, {
  mapActors: [actor('cavaignac', null, 'paris', { description: '六月蜂起を鎮圧する' }), actor('workers', null, 'paris', { offset: [-42, 0], description: '国立作業場閉鎖に反発して蜂起する' }), actor('french-soldiers', '政府軍', 'paris', { offset: [42, 0], description: '労働者の蜂起を鎮圧する' })],
  illustration: illustration('六月蜂起の後', group('亡命', figure('louis-blanc-exile', 'ルイ＝ブラン', '亡命する')), group('第二共和政憲法', figure('constitution-document', '第二共和政憲法', '男性普通選挙と公選大統領を定める'))),
  reason: '当事者の将軍と一般の政府軍・労働者を区別。ルイ＝ブランの亡命先は本文にないため経路を追加しない。',
});
scene(5, 9, {
  mapActors: [actor('louis-napoleon', null, 'paris', { description: '大統領選挙で当選する' }), actor('farmers', null, 'france', { description: 'ナポレオンの名前に期待する' })],
  mapProps: [prop('ballot-box', '大統領選挙', 'paris', { offset: [42, 0] })],
  illustration: illustration('候補者と支持の背景', group('他の候補者', figure('lamartine', null, '臨時政府の中心人物'), figure('cavaignac', null, '六月蜂起を鎮圧した将軍')), group('美化された過去の思い出', ref('napoleon-i', 'ナポレオン1世', '農民や兵士の記憶にある過去の指導者。甥の父はナポレオンの弟ルイ')), group('支持する人々', figure('workers', null, '六月蜂起の鎮圧に無関係な候補を支持する'), figure('french-soldiers', '兵士', '過去の強いフランスの思い出を持つ'))),
  textOnlyPeople: [{ name: 'ルイ', reason: 'ルイ＝ナポレオンの父親という家系の説明のみ。別のルイの肖像を流用せず本文で参照する。' }],
  reason: '当選した甥と過去の1世を分ける。候補者や父親の同名人物を取り違えず、甥を以前の革命に参加させない。',
});
scene(5, 10, {
  mapActors: [actor('louis-napoleon', null, 'france', { description: '全国を回って民衆の支持を固める' }), actor('workers', null, 'france', { offset: [42, 0], description: '大統領に期待する' }), actor('farmers', null, 'france', { offset: [-42, 0], description: '大統領に期待する' })],
  illustration: illustration('大統領と議会の距離', group('議会', figure('parliament-delegates', '金持ち', '金持ち中心の法律を作る'))),
  personAliases: [{ name: 'ナポレオン', identity: 'person:louis-napoleon', reason: 'この場面のナポレオン様・ナポレオン像は大統領本人の評判を指す。' }],
  reason: '本人の国内巡回は説明するが、本文にない訪問都市や順路を補わない。ナポレオン1世を登場させない。',
});
scene(5, 11, {
  mapActors: [actor('louis-napoleon', null, 'paris', { afterKey: 'napoleon-iii', description: '大統領から皇帝ナポレオン3世となる' }), actor('french-soldiers', '武力による議会解散', 'paris', { offset: [-42, 0], description: '1851年のクーデタ' })],
  mapProps: [prop('ballot-box', '国民投票', 'paris', { offset: [42, 0] })],
  illustration: illustration('同じ本人の地位が変わる', group('大統領から皇帝へ', figure('louis-napoleon', 'ルイ＝ナポレオン', '第二共和政の大統領', 'before', '地図上の同人と比較するための大統領時代の姿'), figure('napoleon-iii', 'ナポレオン3世', '1852年に国民投票で皇帝となる', 'after', '同じ顔と異なる地位・衣装を見比べるための再掲'))),
  personAliases: [{ name: 'ナポレオン3世', identity: 'person:louis-napoleon', reason: 'ルイ＝ナポレオンと同一人物。' }],
  reason: '顔を変えず同じ本人の礼装を切り替える。1世の絵を皇帝3世に流用しない。',
});
scene(5, 12, {
  mapActors: [actor('revolutionary-citizens', '自由主義運動', 'europe', { description: '各地で1848年革命が起こる' })],
  mapProps: [prop('constitution-document', '諸国民の春', 'europe', { offset: [42, 0] })],
  reason: '本文のヨーロッパ各地の人々を一般集団で示す。次の各国の実在指導者を先取りしない。',
});
scene(5, 13, {
  mapActors: [actor('metternich', null, 'london', { route: 0, afterKey: 'metternich-exile', description: '失脚してイギリスへ亡命する' }), actor('ferdinand-i-austria', null, 'vienna', { offset: [38, 0], description: '革命に動揺し譲歩する' }), actor('revolutionary-citizens', 'ウィーン市民', 'vienna', { offset: [-38, 0], description: '議会の開設とメッテルニヒの辞任を要求する' })],
  illustration: illustration('ウィーンで囲まれた場所', group('市民の行動', figure('parliament-building', '議事堂', '市民が包囲する'), figure('royal-palace', '宮殿', '市民が包囲する'))),
  reason: '本文にある本人の亡命だけを経路に結び付ける。皇帝の名前と顔を旧教材の別のフェルディナントにしない。',
});
scene(5, 14, {
  mapActors: [actor('revolutionary-citizens', 'ベルリン市民', 'berlin', { description: '立憲政治を求める' }), actor('prussian-soldiers', '軍隊', 'berlin', { offset: [42, 0], description: '市民と衝突する' })],
  mapProps: [prop('constitution-document', '立憲政治', 'berlin', { offset: [-42, 0] })],
  illustration: illustration('ベルリンに届いた知らせ', group('ウィーンでの前の出来事', ref('metternich-exile', 'メッテルニヒ', '失脚の知らせがベルリンの運動を勇気づける')), group('国王の譲歩', figure('crown', '国王', '国民議会の招集などを約束する'))),
  reason: 'メッテルニヒの像はニュースの参照のみ。本人をベルリンへ移動させず、本文で名のない国王の実名を先取りしない。',
});
scene(5, 15, {
  mapActors: [actor('parliament-delegates', 'フランクフルト国民議会', 'frankfurt', { description: '知識人らが憲法と統一を議論する' })],
  mapProps: [prop('constitution-document', 'ドイツ統一', 'frankfurt', { offset: [42, 0] })],
  illustration: illustration('国民議会に集まった人々', group('代表', figure('parliament-delegates', '大学教授・官僚', '学者・知識人が中心となる'))),
  reason: '本文の議会の代表と書類で示す。正式な建物名を追加せず、原文の演出されて等を校訂しない。',
});
scene(5, 16, {
  mapActors: [actor('frederick-william-iv', null, 'berlin', { description: '国民議会の皇帝位を拒否する' }), actor('parliament-delegates', 'フランクフルト国民議会', 'frankfurt', { description: '統一と憲法を議論する' })],
  mapProps: [prop('crown', '皇帝位', 'berlin', { offset: [42, 0] })],
  illustration: illustration('大ドイツ主義と小ドイツ主義', group('大ドイツ主義', figure('constitution-document', 'オーストリア', 'オーストリアのドイツ人居住地域を含めて統一')), group('小ドイツ主義', figure('constitution-document', 'プロイセン', 'オーストリアを除いて統一'))),
  reason: '王はベルリン、議会はフランクフルト。政治的な選択肢の対立は地図外へ置く。名前のない軍の統率者を追加しない。',
});
scene(5, 17, {
  mapActors: [actor('revolutionary-citizens', '独立反乱', 'warsaw', { description: '独立を求めるが鎮圧される' }), actor('russian-soldiers', 'ロシア軍', 'warsaw', { offset: [42, 0], description: '独立反乱を鎮圧する' })],
  reason: '原文のポーランドの反乱とロシア支配をそのまま扱う。補正した史実や本文にない皇帝名を持ち込まない。',
});
scene(5, 18, {
  mapActors: [actor('kossuth', null, 'budapest', { description: '自治を獲得し独立を宣言する' }), actor('russian-soldiers', 'ロシア軍', 'budapest', { route: 0, offset: [42, 0], description: '独立運動の鎮圧に協力する' }), actor('austrian-soldiers', 'オーストリア軍', 'budapest', { route: 1, offset: [-42, 0], description: '独立運動を鎮圧する' })],
  illustration: illustration('ハンガリーの独立と鎮圧', group('独立を求める側', figure('constitution-document', '独立宣言', 'マジャール人が独立を宣言する')), group('協力する総督', figure('jelacic', null, 'クロアティア総督として鎮圧に協力する'))),
  reason: 'ロシア・オーストリアの経路は一般軍に結び付ける。イエラチッチ本人の移動は本文から断定せず模式欄に置く。',
});
scene(5, 19, {
  mapActors: [actor('palacky', null, 'prague', { description: 'スラヴ民族会議を指導する' }), actor('austrian-soldiers', 'オーストリア軍', 'prague', { offset: [42, 0], description: 'ベーメンの自治を鎮圧する' })],
  mapProps: [prop('constitution-document', '自治権', 'prague', { offset: [-42, 0] })],
  illustration: illustration('スラヴ民族会議の目的と解散', group('帝国内での団結', figure('parliament-delegates', 'スラヴ人', 'オーストリア帝国内での団結を目指す')), group('チェック人の行動', figure('revolutionary-citizens', 'チェック人', '自治権を得ると会議から抜ける'))),
  reason: '本文のプラハの当事者を表示。帝国からの全面独立運動へ意味を変えず、名のない皇帝を実名で補わない。',
});
scene(5, 20, {
  mapActors: [actor('carlo-alberto', null, 'turin', { description: 'オーストリアに宣戦する' }), actor('sardinian-soldiers', 'サルデーニャ軍', 'milan', { route: 0, offset: [-35, 0], description: 'オーストリアと戦う' }), actor('austrian-soldiers', 'オーストリア軍', 'milan', { offset: [40, 0], description: 'サルデーニャ側を破る' })],
  extraRoutes: [{ kind: 'rival', points: [[7.7, 45.1], [9.19, 45.46]], start: 0.12, end: 0.9 }],
  illustration: illustration('北イタリアの暴動', group('オーストリア支配への反発', figure('revolutionary-citizens', 'ミラノ', 'オーストリアに対して暴動を起こす'), figure('revolutionary-citizens', 'ヴェネツィア', 'オーストリアに対して暴動を起こす'))),
  reason: '概略の軍事行動は一般のサルデーニャ軍に結び付け、王本人の訪問先や本文にないイタリアの政治家を補わない。',
});
scene(5, 21, {
  mapActors: [actor('mazzini', null, 'rome', { description: 'ローマ共和国を建てる' }), actor('french-soldiers', 'フランス軍', 'rome', { route: 0, offset: [42, 0], description: '介入して共和国を崩壊させる' })],
  illustration: illustration('教皇の脱出とフランスの介入', group('ローマを脱出する教皇', figure('pius-ix', null, '革命の波及を恐れてローマを脱出')), group('フランス側の統治者', figure('louis-napoleon', null, '教皇を保護するフランスの大統領'))),
  reason: 'マッツィーニとフランスの一般軍をローマへ。大統領本人を軍の行進役としてローマに動かさない。',
});
scene(5, 22, {
  mapActors: [actor('revolutionary-citizens', '自由主義運動', 'vienna', { description: '革命は鎮圧されたが体制は崩壊する' }), actor('austrian-soldiers', '反動勢力', 'vienna', { offset: [42, 0], description: '革命後も反動政治は続く' })],
  illustration: illustration('ウィーン体制の崩壊の確認', group('前の出来事の振り返り', ref('metternich-exile', 'メッテルニヒ', '失脚がウィーン体制の崩壊を意味する'))),
  reason: 'まとめとして一般の運動と反動勢力を示す。退いた政治家を再び現役の統治者や軍の指揮官として動かさない。',
});
scene(5, 23, {
  mapActors: [actor('revolutionary-citizens', 'ヨーロッパ', 'europe', { description: 'ここまでの全体像を振り返る', temporalRole: 'overview' })],
  illustration: illustration('年号の確認と次回への案内', group('年号を確認する', figure('calendar', '年号', 'ここまでの流れを確かめる', 'overview')), group('次回への案内', figure('napoleon-iii', 'ナポレオン3世', 'その後は次回の内容として紹介される', 'preview'))),
  reason: '地図の一般集団は今回のヨーロッパの振り返り。次回の皇帝の行動や戦争は先取りせず、模式欄の予告に限定。',
});

function freezeDeep(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeDeep);
    Object.freeze(value);
  }
  return value;
}
export const modernVisualAssetCatalog = freezeDeep(catalog);
export const modernVisualScenePlans = freezeDeep(plans);

/** 原文の本文・装飾・ページ・順序・地図範囲を保持し、人物等の表示だけを追加する。 */
export function withModernVisuals(original) {
  const plan = modernVisualScenePlans[original.id];
  if (!plan) return original;
  const hiddenNames = new Set(plan.hiddenPersonNames);
  return {
    ...original,
    actors: plan.mapActors.map(item => ({ ...item })),
    props: plan.mapProps.map(item => ({ ...item })),
    routes: [...original.routes, ...plan.extraRoutes].map(item => ({ ...item, points: item.points.map(at => [...at]) })),
    tags: original.tags.filter(tag => !(tag.kind === 'person' && hiddenNames.has(tag.text))).map(tag => ({ ...tag })),
    namesOutsideMap: [...new Set((plan.illustration?.groups ?? []).flatMap(item => item.figures)
      .filter(item => item.kind === 'person').map(item => item.name))],
    textOnlyPeople: plan.textOnlyPeople.map(item => ({ ...item })),
    excludedPersonNames: plan.excludedPersonNames.map(item => ({ ...item })),
    personAliases: plan.personAliases.map(item => ({ ...item })),
    duration: original.duration || 2600,
  };
}

export function modernIllustrationFor(sceneOrId) {
  const id = typeof sceneOrId === 'string' ? sceneOrId : sceneOrId?.id;
  return modernVisualScenePlans[id]?.illustration || null;
}

export const modernVisualEdition = Object.fromEntries(
  Object.entries(modernEdition).map(([lesson, scenes]) => [lesson, scenes.map(withModernVisuals)]),
);
