// 03 分裂と地方政権の興亡（49場面）
// 原文 p.324〜332 の流れと固有名詞の対応は docs/regional-dynasties-correspondence.md を参照。

export const places = {
  damascus: { name: "ダマスクス", point: [36.29, 33.51] },
  cordoba: { name: "コルドバ", point: [-4.78, 37.89] },
  iberia: { name: "イベリア半島", point: [-4, 40] },
  morocco: { name: "モロッコ", point: [-6.5, 32] },
  tunis: { name: "チュニジア", point: [10.18, 36.8] },
  cairo: { name: "カイロ", point: [31.24, 30.04] },
  mediterranean: { name: "地中海", point: [20, 35] },
  redSea: { name: "紅海", point: [37, 20] },
  indianOcean: { name: "インド洋", point: [62, 5] },
  baghdad: { name: "バグダード", point: [44.37, 33.32] },
  khorasan: { name: "ホラーサーン地方", point: [59, 35.5] },
  manzikert: { name: "マラーズギルド", point: [42.54, 39.14] },
  anatolia: { name: "アナトリア【小アジア】", point: [34, 39] },
  westEurope: { name: "西欧", point: [3, 47] },
  iran: { name: "イラン", point: [53, 32] },
  eastIran: { name: "イラン東部", point: [60, 31] },
  iraq: { name: "イラク", point: [43.7, 31.2] },
  southIraq: { name: "南イラク", point: [47, 29] },
  caspian: { name: "カスピ海南西", point: [49, 37] },
  tabriz: { name: "タブリーズ", point: [46.29, 38.08] },
  centralAsia: { name: "中央アジア", point: [68, 40] },
  bukhara: { name: "ブハラ", point: [64.42, 39.77] },
  oasis: { name: "中央アジアのオアシス地帯", point: [70, 41] },
  mongolia: { name: "モンゴル高原", point: [103, 46] },
  afghanistan: { name: "アフガニスタン", point: [67, 34] },
  ghazna: { name: "ガズナ", point: [68.42, 33.55] },
  northIraq: { name: "イラク北部", point: [43, 36] },
  northAfrica: { name: "北アフリカ", point: [8, 30] },
  maghrib: { name: "マグリブ地方", point: [-2, 32] },
  marrakech: { name: "マラケシュ", point: [-8, 31.63] },
  ghana: { name: "ガーナ王国", point: [-10, 14.5] },
  granada: { name: "グラナダ", point: [-3.59, 37.18] },
  castile: { name: "カスティリャ王国", point: [-4, 41] },
  aragon: { name: "アラゴン王国", point: [0, 41] },
  spain: { name: "スペイン王国", point: [-3, 40] },
  jerusalem: { name: "イェルサレム【エルサレム】", point: [35.21, 31.77] },
  syria: { name: "シリア", point: [37, 35] },
  palestine: { name: "パレスチナ", point: [35.2, 32] },
  mecca: { name: "メッカ", point: [39.83, 21.42] },
  medina: { name: "メディナ", point: [39.61, 24.47] },
  northIndia: { name: "北インド", point: [78, 28] },
  delhi: { name: "デリー", point: [77.21, 28.61] },
  deccan: { name: "デカン", point: [76, 18] },
  nileUpper: { name: "ナイル川上流【エチオピア】", point: [32, 14] },
  egypt: { name: "エジプト", point: [30, 27] },
  meroe: { name: "メロエ", point: [33.72, 16.94] },
  aksum: { name: "アクスム", point: [38.72, 14.13] },
  guinea: { name: "ギニア", point: [-10, 10] },
  sahara: { name: "サハラ砂漠", point: [2, 23] },
  niger: { name: "ニジェール川流域", point: [-3, 14] },
  timbuktu: { name: "トンブクトゥ", point: [-3, 16.77] },
  gao: { name: "ガオ", point: [-0.04, 16.27] },
  lakeChad: { name: "チャド湖", point: [14.5, 13] },
  mogadishu: { name: "モガディシュ", point: [45.32, 2.05] },
  malindi: { name: "マリンディ", point: [40.12, -3.22] },
  mombasa: { name: "モンバサ", point: [39.67, -4.04] },
  zanzibar: { name: "ザンジバル", point: [39.2, -6.16] },
  kilwa: { name: "キルワ", point: [39.52, -8.96] },
  mozambique: { name: "モザンビーク", point: [40.5, -14.5] },
  zimbabwe: { name: "大ジンバブエ", point: [30.93, -20.27] }
};

export const zones = {
  west: { color: "#3d7a5a", points: [[-10, 36], [-2, 43], [3, 40], [-7, 30], [-10, 36]] },
  fatimid: { color: "#756048", points: [[8, 37], [22, 33], [36, 32], [32, 23], [9, 29]] },
  abbasid: { color: "#2d5b73", points: [[38, 38], [49, 39], [56, 34], [49, 28], [39, 30]] },
  iran: { color: "#6f5a83", points: [[46, 40], [64, 39], [66, 29], [49, 27]] },
  centralAsia: { color: "#597b65", points: [[59, 46], [81, 46], [82, 35], [64, 32]] },
  seljuq: { color: "#536a83", points: [[29, 41], [45, 43], [69, 40], [69, 31], [48, 27], [34, 33]] },
  anatolia: { color: "#806a55", points: [[26, 42], [43, 43], [45, 36], [32, 35]] },
  mamluk: { color: "#7b5d48", points: [[29, 31], [38, 36], [40, 29], [34, 21], [29, 25]] },
  india: { color: "#526f88", points: [[69, 32], [82, 32], [84, 20], [73, 18], [68, 27]] },
  westAfrica: { color: "#8b6a36", points: [[-12, 19], [5, 19], [4, 9], [-11, 9]] },
  eastAfrica: { color: "#47756c", points: [[36, 5], [47, 4], [44, -16], [36, -14]] },
  southAfrica: { color: "#705d43", points: [[25, -14], [37, -13], [38, -24], [27, -24]] }
};

const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");
const makeScene = data => {
  const scene = { zones: [], pins: [], routes: [], tags: [], facts: [], actors: [], props: [], duration: 2200, ...data };
  const terms = [...new Set(scene.body.flatMap(paragraph => paragraph.split("<strong>").slice(1).map(part => part.split("</strong>")[0])))];
  const mapText = [scene.mapHeading, scene.focus, scene.before, scene.after, scene.facts, scene.pins.map(key => places[key]?.name), scene.tags.map(tag => tag.text), [...scene.actors, ...scene.props].flatMap(item => [item.name, item.bubble])].flat(Infinity).map(plain).join("／");
  const missing = terms.filter(term => !mapText.includes(term));
  if (missing.length) scene.facts = [...scene.facts, `この場面の用語：${missing.join("・")}`];
  return scene;
};
const route = (points, kind = "move") => ({ points, kind });

export const scenes = [
  makeScene({
    id: "western-survivors", chapter: 0, year: "756年", frame: [-12, 27, 15, 44], zones: ["west"], pins: ["iberia", "cordoba", "morocco"],
    routes: [route([[10, 36], [-4, 40], [-4.78, 37.89]])], tags: [{ at: [-7, 34], text: "イドリース朝" }],
    facts: ["アブド＝アッラフマーン1世：後ウマイヤ朝を建国", "アミールを称し、カリフは名乗らない", "モロッコではアリーの子孫がイドリース朝を建国"],
    actors: [{ name: "アブド＝アッラフマーン1世", image: "abd-alrahman3", at: "iberia", route: 0, bubble: "コルドバに後ウマイヤ朝を建てる" }],
    title: "生き延びたウマイヤ家が、\n西方に二つの政権を生む。", kicker: "西方で始まる自立", mapHeading: "イベリア半島とモロッコの自立政権", focus: "後ウマイヤ朝・イドリース朝・アミール",
    before: "アッバース朝がウマイヤ朝を滅ぼす", after: "アブド＝アッラフマーン1世がコルドバへ逃れる",
    body: ["<strong>アッバース朝</strong>に滅ぼされた<strong>ウマイヤ朝</strong>の一族、<strong>アブド＝アッラフマーン1世</strong>は<strong>イベリア半島</strong>へ逃れ、<strong>コルドバ</strong>を都に<strong>後ウマイヤ朝</strong>を建てた。<strong>ウンマ</strong>は一つで指導者の<strong>カリフ</strong>も一人と考え、地方長官を意味する<strong>アミール</strong>を称した。", "同じころ<strong>モロッコ</strong>では、<strong>アリーの子孫</strong>が<strong>イドリース朝</strong>を建てたが、ここでもカリフは名乗らなかった。"],
    takeaway: "西方の自立政権は、当初は唯一のカリフという考えを守った。", note: "二つの政権と、それぞれがカリフを名乗らなかった点を一緒に示します。"
  }),
  makeScene({
    id: "fatimid-founding", chapter: 0, year: "909年", frame: [5, 26, 20, 40], zones: ["fatimid"], pins: ["tunis", "northAfrica"],
    tags: [{ at: [13, 33], text: "イスマーイール派" }], facts: ["シーア派の秘密運動がチュニジアのベルベル人に広がる", "ファーティマの子孫を称してファーティマ朝を建国", "アッバース朝の正統性を否定してカリフを称す"],
    actors: [{ name: "ファーティマ朝", image: "fatimid-caliph", at: "tunis", bubble: "ムハンマドの娘ファーティマの子孫を称す" }],
    title: "イスマーイール派が、\nファーティマ朝を建てる。", kicker: "10世紀のシーア派の反撃", mapHeading: "チュニジアで始まるファーティマ朝", focus: "秘密運動・ベルベル人・カリフ",
    before: "アッバース革命後にシーア派が弾圧される", after: "イスマーイール派が北アフリカで建国する",
    body: ["<strong>10世紀</strong>、<strong>アッバース革命</strong>に協力しながら建国後に弾圧された<strong>シーア派</strong>から、<strong>イスマーイール派</strong>が現れた。秘密運動を通じ、<strong>北アフリカ</strong>の<strong>チュニジア</strong>で<strong>ベルベル人</strong>の支持を集めて<strong>ファーティマ朝</strong>を建てた。", "君主は<strong>ムハンマド</strong>の娘<strong>ファーティマ</strong>の子孫を称し、<strong>アッバース家</strong>による<strong>アッバース朝</strong>の正統性を否定して<strong>カリフ</strong>を名乗った。"],
    takeaway: "ファーティマ朝は、シーア派の立場からカリフを称した。", note: "建国地のチュニジアから、次のエジプト征服へ進みます。"
  }),
  makeScene({
    id: "three-caliphs", chapter: 0, year: "929年", frame: [-10, 25, 51, 42], zones: ["west", "fatimid", "abbasid"], pins: ["cordoba", "tunis", "baghdad"],
    tags: [{ at: [-1, 35], text: "後ウマイヤ朝" }, { at: [20, 30], text: "ファーティマ朝" }, { at: [47, 36], text: "アッバース朝" }],
    facts: ["アブド＝アッラフマーン3世が929年にカリフを称す", "ウマイヤ家・ファーティマ朝・アッバース朝", "イスラーム世界に3人のカリフが並立"],
    actors: [{ name: "アブド＝アッラフマーン3世", image: "abd-alrahman3", at: "cordoba", bubble: "私こそウマイヤ家のカリフだ" }],
    title: "後ウマイヤ朝もカリフを称し、\n三カリフが並び立つ。", kicker: "西・中・東の三つの権威", mapHeading: "コルドバ・チュニジア・バグダードの三政権", focus: "929年の三カリフ並立",
    before: "ファーティマ朝がカリフを称す", after: "アブド＝アッラフマーン3世も対抗して名乗る",
    body: ["<strong>929年</strong>、<strong>後ウマイヤ朝</strong>の<strong>アブド＝アッラフマーン3世</strong>も、<strong>ウマイヤ家</strong>の<strong>カリフ</strong>を称した。", "こうして<strong>コルドバ</strong>の後ウマイヤ朝、<strong>チュニジア</strong>の<strong>ファーティマ朝</strong>、<strong>バグダード</strong>の<strong>アッバース朝</strong>が対立し、<strong>イスラーム世界</strong>に<strong>3人のカリフ</strong>が並び立った。"],
    takeaway: "唯一と考えられていたカリフが、三人並立する時代になった。", note: "次の場面で、ファーティマ朝がエジプトへ移る流れを示します。"
  }),
  makeScene({
    id: "fatimid-cairo", chapter: 0, year: "10世紀", frame: [15, 5, 68, 38], zones: ["fatimid"], pins: ["tunis", "cairo", "mediterranean", "redSea", "indianOcean"],
    routes: [route([[10.18, 36.8], [31.24, 30.04]], "campaign"), route([[20, 35], [31.24, 30.04], [37, 20], [62, 5]], "trade")],
    facts: ["エジプト征服と新都カイロの建設", "地中海とインド洋を結ぶ紅海貿易", "アズハル＝モスク内のアズハル学院"],
    props: [{ name: "アズハル＝モスク", image: "azhar-mosque", at: "cairo", kind: "prop", size: 72 }],
    title: "ファーティマ朝がカイロを築き、\n紅海貿易で栄える。", kicker: "エジプト征服後の新都", mapHeading: "チュニジアからカイロ、紅海からインド洋へ", focus: "アズハル学院と二つの海",
    before: "ファーティマ朝がチュニジアで成立する", after: "エジプトを征服しカイロを建設する",
    body: ["<strong>ファーティマ朝</strong>は<strong>チュニジア</strong>から<strong>エジプト</strong>へ進み、首都<strong>カイロ</strong>を建設した。<strong>地中海</strong>と<strong>インド洋</strong>を結ぶ<strong>紅海貿易</strong>を支配して繁栄した。", "カイロの<strong>アズハル＝モスク</strong>には、イスラーム世界で最古級の大学である<strong>アズハル学院</strong>が置かれた。ファーティマ朝では<strong>シーア派</strong>の学問を担い、<strong>アイユーブ朝</strong>以後は<strong>スンナ派神学</strong>の中心となった。"],
    takeaway: "カイロは、交易と学問を結ぶファーティマ朝の中心になった。", note: "交易路と学院の変化を同じ場面で確認します。"
  }),
  makeScene({
    id: "buyid-outline", chapter: 0, year: "932〜1062年", frame: [38, 26, 57, 41], zones: ["iran", "abbasid"], pins: ["iran", "baghdad"], routes: [route([[53, 32], [44.37, 33.32]], "campaign")],
    facts: ["ブワイフ朝：イラン系シーア派", "946年にバグダードへ入城し大アミールとなる", "軍人・官僚へ管理権と徴税権を与えるイクター制"],
    actors: [{ name: "大アミール", image: "buyid-amir", at: "iran", route: 0, bubble: "カリフを残して実権を握る" }],
    title: "ブワイフ朝が、\nバグダードの実権を握る。", kicker: "イラン・イラクの王朝①", mapHeading: "イランからバグダードへ入るブワイフ朝", focus: "大アミールとイクター制",
    before: "イラン系シーア派の軍事政権が成長する", after: "946年にバグダードへ入城する",
    body: ["<strong>ブワイフ朝【932〜1062年】</strong>は<strong>イラン系</strong>の<strong>シーア派</strong>政権で、<strong>946年</strong>に<strong>イラン</strong>から<strong>バグダード</strong>へ入城し、<strong>カリフ</strong>から<strong>大アミール</strong>に任命された。", "軍人・官僚へ土地の<strong>管理権</strong>と<strong>徴税権</strong>を与える<strong>イクター制</strong>を始め、イラクの政治を動かした。"],
    takeaway: "ブワイフ朝はカリフを残し、大アミールとして政治を支配した。", note: "イクター制の成立事情は、後の場面で詳しく扱います。"
  }),
  makeScene({
    id: "seljuq-outline", chapter: 0, year: "1038〜1194年", frame: [39, 27, 66, 42], zones: ["seljuq"], pins: ["khorasan", "baghdad"], routes: [route([[59, 35.5], [44.37, 33.32]], "campaign")],
    facts: ["セルジューク朝：トルコ系スンナ派", "トゥグリル＝ベク【位1038〜63年】がホラーサーン地方で建国", "1055年、アッバース朝カリフからスルタン称号"],
    actors: [{ name: "トゥグリル＝ベク", image: "tughril-beg", at: "khorasan", route: 0, bubble: "バグダードへ進む" }],
    title: "トゥグリル＝ベクが、\nセルジューク朝を建てる。", kicker: "イラン・イラクの王朝②", mapHeading: "ホラーサーン地方からバグダードへ", focus: "トルコ系スンナ派とスルタン",
    before: "トゥグリル＝ベクがホラーサーン地方で建国する", after: "1055年にバグダードへ入城する",
    body: ["<strong>トルコ系</strong>の<strong>スンナ派</strong>政権である<strong>セルジューク朝【1038〜1194年】</strong>は、<strong>トゥグリル＝ベク【位1038〜63年】</strong>が<strong>ホラーサーン地方</strong>で建てた。", "<strong>1055年</strong>に<strong>バグダード</strong>へ入城し、<strong>アッバース朝カリフ</strong>から<strong>スルタン</strong>の称号を受けた。"],
    takeaway: "セルジューク朝は、カリフから政治的支配者として認められた。", note: "宗教的権威と政治的実権の分担へつながります。"
  }),
  makeScene({
    id: "manzikert-outline", chapter: 0, year: "1071年", frame: [24, 31, 48, 48], zones: ["anatolia", "seljuq"], pins: ["manzikert", "anatolia", "westEurope"],
    routes: [route([[50, 37], [42.54, 39.14]], "campaign"), route([[42.54, 39.14], [34, 39]], "campaign"), route([[34, 39], [3, 47]], "move")],
    facts: ["アルプ＝アルスラーン【位1063〜72年】", "マラーズギルドの戦い【1071年】でビザンツ帝国軍を破る", "アナトリア喪失と西欧への援軍要請が十字軍遠征の背景"],
    actors: [{ name: "アルプ＝アルスラーン", image: "tughril-beg", at: "manzikert", bubble: "ビザンツ帝国軍を破る" }],
    title: "マラーズギルドの勝利が、\n十字軍遠征の背景になる。", kicker: "イラン・イラクの王朝③", mapHeading: "マラーズギルドからアナトリアと西欧へ", focus: "アルプ＝アルスラーンとビザンツ帝国",
    before: "セルジューク朝がビザンツ帝国と対峙する", after: "ビザンツ帝国が西欧へ援軍を求める",
    body: ["<strong>セルジューク朝</strong>の<strong>アルプ＝アルスラーン【位1063〜72年】</strong>は、<strong>1071年</strong>の<strong>マラーズギルドの戦い</strong>で<strong>ビザンツ帝国軍</strong>を破り、<strong>ビザンツ帝国</strong>は<strong>アナトリア【小アジア】</strong>を失った。", "ビザンツ帝国が<strong>西欧</strong>へ援軍を求めたことが、<strong>十字軍遠征</strong>の背景になった。"],
    takeaway: "アナトリアへの進出が、西欧の十字軍遠征につながった。", note: "戦い、領土の変化、援軍要請を一続きで示します。"
  }),
  makeScene({
    id: "malik-nizam-outline", chapter: 0, year: "1072〜1092年", frame: [37, 25, 63, 43], zones: ["seljuq"], pins: ["iran", "baghdad"],
    tags: [{ at: [55, 37], text: "ニザーミーヤ学院" }], facts: ["マリク＝シャー【位1072〜92年】の全盛期", "イラン人宰相ニザーム＝アルムルク", "主要都市の学院とイクター制整備"],
    actors: [{ name: "ニザーム＝アルムルク", image: "nizam-almulk", at: "iran", bubble: "学院とイクター制を整える" }],
    title: "マリク＝シャーの全盛期を、\n宰相が制度で支える。", kicker: "イラン・イラクの王朝④", mapHeading: "セルジューク朝の主要都市へ制度を広げる", focus: "ニザーム＝アルムルクとニザーミーヤ学院",
    before: "マリク＝シャーがセルジューク朝を率いる", after: "学院とイクター制が統治を支える",
    body: ["<strong>マリク＝シャー【位1072〜92年】</strong>の時代、<strong>セルジューク朝</strong>は<strong>全盛期</strong>を迎えた。<strong>イラン人宰相</strong>の<strong>ニザーム＝アルムルク</strong>が統治を支えた。", "<strong>イラン</strong>や<strong>バグダード</strong>などの<strong>主要都市</strong>に<strong>ニザーミーヤ学院</strong>を設け、<strong>イクター制</strong>を整備した。"],
    takeaway: "軍事だけでなく、宰相の制度整備が全盛期を支えた。", note: "学院の教育内容と『統治の書』は後の場面で扱います。"
  }),
  makeScene({
    id: "seljuq-breakup-outline", chapter: 0, year: "1077〜1231年", frame: [28, 25, 71, 44], zones: ["anatolia", "iran"], pins: ["anatolia", "iran", "afghanistan", "iraq"],
    tags: [{ at: [35, 41], text: "ルーム＝セルジューク朝" }, { at: [58, 33], text: "ホラズム＝シャー朝" }], facts: ["ルーム＝セルジューク朝【1077〜1308年】", "ホラズム＝シャー朝【1077〜1231年】", "1194年にイラク支配のセルジューク朝を滅ぼす"],
    title: "セルジューク朝が分かれ、\n二つの王朝が自立する。", kicker: "イラン・イラクの王朝⑤", mapHeading: "アナトリアとイラン・アフガニスタンの分裂", focus: "ルーム＝セルジューク朝とホラズム＝シャー朝",
    before: "セルジューク朝の各地の軍団が力を持つ", after: "アナトリアと東方に別の王朝が生まれる",
    body: ["<strong>セルジューク朝</strong>の分裂後、<strong>アナトリア</strong>には<strong>ルーム＝セルジューク朝【1077〜1308年】</strong>が建てられた。", "<strong>セルジューク朝のトルコ人奴隷</strong>から成立した<strong>ホラズム＝シャー朝【1077〜1231年】</strong>は、<strong>イラン</strong>・<strong>アフガニスタン</strong>方面へ広がり、<strong>1194年</strong>に<strong>イラク</strong>支配を続けたセルジューク朝を滅ぼした。"],
    takeaway: "大帝国の分裂から、地域ごとの王朝が生まれた。", note: "ホラズム朝という短い表記も後に登場します。"
  }),
  makeScene({
    id: "ilkhan-hulagu-outline", chapter: 0, year: "1258年", frame: [38, 25, 65, 43], zones: ["iran", "abbasid"], pins: ["baghdad", "tabriz"], routes: [route([[64, 40], [44.37, 33.32]], "campaign"), route([[44.37, 33.32], [46.29, 38.08]], "move")],
    facts: ["イル＝ハン国【1258〜1353年】・都タブリーズ", "フレグの遠征とモンゴルの遠征軍", "1258年にバグダードを占領しアッバース朝を滅ぼす"],
    actors: [{ name: "フレグ", image: "hulagu-khan", at: [64, 40], route: 0, bubble: "バグダードへ遠征する" }],
    title: "フレグの遠征が、\nアッバース朝を滅ぼす。", kicker: "イラン・イラクの王朝⑥", mapHeading: "モンゴル軍がバグダードへ進みタブリーズへ", focus: "1258年とイル＝ハン国",
    before: "フレグ率いるモンゴルの遠征軍が西へ進む", after: "バグダードを占領しイル＝ハン国を建てる",
    body: ["<strong>フレグ</strong>の率いる<strong>モンゴルの遠征軍</strong>は、<strong>1258年</strong>に<strong>バグダード</strong>を占領し、<strong>アッバース朝</strong>を滅ぼした。", "フレグは<strong>イラン</strong>に<strong>イル＝ハン国【1258〜1353年】</strong>を建て、<strong>タブリーズ</strong>を都とした。"],
    takeaway: "モンゴルの遠征が、バグダードのアッバース朝を終わらせた。", note: "この遠征は、後のエジプトの場面にもつながります。"
  }),
  makeScene({
    id: "ghazan-outline", chapter: 0, year: "1295〜1304年", frame: [42, 26, 64, 43], zones: ["iran"], pins: ["iran", "tabriz"], tags: [{ at: [57, 35], text: "国教" }],
    facts: ["ガザン＝ハン【位1295〜1304年】", "即位直後にイスラームへ改宗", "イラン人宰相ラシード＝アッディーンを任命"], actors: [{ name: "ガザン＝ハン", image: "hulagu-khan", at: "tabriz", bubble: "イスラームへ改宗する" }],
    title: "ガザン＝ハンが改宗し、\nイスラームを国教とする。", kicker: "イラン・イラクの王朝⑦", mapHeading: "タブリーズから進むイル＝ハン国の改革", focus: "ガザン＝ハンとラシード＝アッディーン",
    before: "モンゴル系のイル＝ハン国がイランを支配する", after: "ガザン＝ハンがイスラームを国教とする",
    body: ["<strong>モンゴル系</strong>の<strong>イル＝ハン国</strong>の<strong>ガザン＝ハン【位1295〜1304年】</strong>は、都<strong>タブリーズ</strong>で即位すると、直後に<strong>イスラーム</strong>へ<strong>改宗</strong>し、これを<strong>国教</strong>とした。", "<strong>イラン</strong>の統治には、<strong>イラン人宰相</strong>の<strong>ラシード＝アッディーン</strong>を任命した。"],
    takeaway: "モンゴル系王朝がイスラームを受け入れ、現地社会との結びつきを強めた。", note: "人物名と、改宗・国教化・宰相任命の順を確認します。"
  }),
  makeScene({
    id: "ninth-century-map", chapter: 0, year: "9世紀", frame: [-11, 26, 75, 46], zones: ["west", "abbasid", "centralAsia"], pins: ["cordoba", "morocco", "baghdad", "centralAsia"],
    tags: [{ at: [8, 33], text: "アラブ系" }, { at: [64, 36], text: "イラン系" }], facts: ["後ウマイヤ朝・イドリース朝・アッバース朝【バグダード】", "中央アジアのサーマーン朝", "9〜10世紀はイラン人の自立と台頭"],
    title: "9世紀、\nイラン人の自立が始まる。", kicker: "三世紀の勢力図①", mapHeading: "西方から中央アジアまでの9世紀", focus: "アラブ系・イラン系・シーア派",
    before: "アラブ系王朝が西方とバグダードを支配する", after: "イラン系のサーマーン朝が中央アジアで台頭する",
    body: ["<strong>9世紀</strong>には、<strong>コルドバ</strong>の<strong>後ウマイヤ朝</strong>、<strong>モロッコ</strong>の<strong>イドリース朝</strong>、<strong>バグダード</strong>の<strong>アッバース朝</strong>という<strong>アラブ系</strong>王朝があった。", "<strong>中央アジア</strong>では<strong>イラン系</strong>の<strong>サーマーン朝</strong>が台頭した。<strong>シーア派</strong>政権も含め、9〜10世紀は<strong>イラン人の自立と台頭</strong>の時代となった。"],
    takeaway: "9世紀には、アラブ系王朝の周辺でイラン人政権が自立した。", note: "次の10世紀、11世紀と同じ範囲を見比べます。"
  }),
  makeScene({
    id: "tenth-century-map", chapter: 0, year: "10世紀", frame: [-11, 25, 82, 46], zones: ["west", "fatimid", "abbasid", "iran", "centralAsia"], pins: ["cordoba", "cairo", "baghdad", "centralAsia"],
    tags: [{ at: [6, 30], text: "アラブ系" }, { at: [54, 30], text: "イラン系" }, { at: [72, 43], text: "トルコ系" }], facts: ["後ウマイヤ朝・ファーティマ朝・アッバース朝【バグダード】", "ブワイフ朝・サーマーン朝・カラ＝ハン朝", "10世紀はシーア派の反撃"],
    title: "10世紀、\nシーア派とトルコ系が台頭する。", kicker: "三世紀の勢力図②", mapHeading: "三カリフと東方諸王朝の10世紀", focus: "シーア派の反撃とトルコ系の登場",
    before: "イラン人政権の自立が進む", after: "三カリフと複数の民族系統の王朝が並ぶ",
    body: ["<strong>イラン人</strong>政権の自立が進んだ<strong>10世紀</strong>には、<strong>コルドバ</strong>の<strong>後ウマイヤ朝</strong>、<strong>カイロ</strong>の<strong>ファーティマ朝</strong>、<strong>バグダード</strong>の<strong>アッバース朝</strong>の三つの<strong>カリフ</strong>政権が並んだ。<strong>アラブ系</strong>王朝に加え、<strong>シーア派</strong>のファーティマ朝・<strong>ブワイフ朝</strong>が力を持った。", "東方では<strong>イラン系</strong>の<strong>サーマーン朝</strong>と、<strong>中央アジア</strong>の<strong>トルコ系</strong><strong>カラ＝ハン朝【カラハン朝】</strong>が並んだ。10世紀は『<strong>シーア派の反撃</strong>』の時代でもあった。"],
    takeaway: "10世紀には、宗派と民族系統の異なる王朝が並立した。", note: "同じ王朝でも、宗派と民族系統は別の観点です。"
  }),
  makeScene({
    id: "eleventh-century-map", chapter: 0, year: "11世紀", frame: [-11, 22, 84, 46], zones: ["west", "fatimid", "seljuq", "centralAsia", "india"], pins: ["marrakech", "cairo", "iran", "afghanistan", "centralAsia"],
    tags: [{ at: [2, 30], text: "ベルベル人" }, { at: [47, 30], text: "トルコ系" }], facts: ["ムラービト朝・ファーティマ朝・セルジューク朝", "ガズナ朝・カラ＝ハン朝", "10〜11世紀はトルコ人の自立と台頭、スンナ派の逆襲"],
    title: "11世紀、\nトルコ人政権が広がる。", kicker: "三世紀の勢力図③", mapHeading: "ベルベル人・アラブ系・トルコ系の11世紀", focus: "トルコ人の自立とスンナ派の逆襲",
    before: "10世紀にシーア派政権が台頭する", after: "トルコ系スンナ派政権が東方から広がる",
    body: ["<strong>11世紀</strong>には、<strong>マラケシュ</strong>周辺の<strong>ベルベル人</strong><strong>ムラービト朝</strong>、<strong>カイロ</strong>の<strong>アラブ系</strong>・<strong>シーア派</strong><strong>ファーティマ朝</strong>、<strong>イラン</strong>の<strong>セルジューク朝</strong>、<strong>アフガニスタン</strong>の<strong>ガズナ朝</strong>、<strong>中央アジア</strong>の<strong>カラ＝ハン朝【カラハン朝】</strong>が並んだ。東方三朝は<strong>トルコ系</strong>だった。", "<strong>10〜11世紀</strong>は『<strong>トルコ人の自立と台頭</strong>』と『<strong>スンナ派の逆襲</strong>』の時代となった。"],
    takeaway: "11世紀には、トルコ系スンナ派政権がイスラーム世界の広い範囲を担った。", note: "ここまでの三場面は、時代ごとの変化を比較するための全体図です。"
  }),
  makeScene({
    id: "iranian-independence", chapter: 1, year: "9世紀", frame: [39, 24, 72, 43], zones: ["iran", "centralAsia"], pins: ["eastIran", "baghdad", "centralAsia", "southIraq"],
    routes: [route([[60, 31], [44.37, 33.32]], "campaign"), route([[68, 40], [60, 31]], "campaign")], tags: [{ at: [49, 28], text: "ザンジュの乱" }], facts: ["鍛冶職人ヤークーブがサッファール朝を建国", "サーマーン朝がサッファール朝を滅ぼす", "南イラクで黒人奴隷によるザンジュの乱"],
    title: "イラン人政権の自立と反乱が、\nアッバース朝を揺らす。", kicker: "東方の自立①", mapHeading: "中央アジア・イラン東部・南イラクの動き", focus: "サッファール朝・サーマーン朝・ザンジュの乱",
    before: "アッバース朝の支配が東方で弱まる", after: "複数のイラン系政権と反乱が広がる",
    body: ["<strong>イラン東部</strong>では<strong>鍛冶職人</strong>だった<strong>ヤークーブ</strong>が、<strong>イラン系最初のイスラーム王朝</strong>である<strong>サッファール朝</strong>を建て、<strong>バグダード</strong>を目指して西へ進んだ。<strong>中央アジア</strong>の<strong>イラン系</strong><strong>サーマーン朝</strong>はサッファール朝を滅ぼし、中央アジアからイラン東部を支配した。", "<strong>南イラク</strong>では<strong>黒人奴隷</strong>による<strong>ザンジュの乱</strong>が起こり、<strong>アッバース朝</strong>の混乱が深まった。"],
    takeaway: "東方の自立政権と南イラクの反乱が、アッバース朝の衰退を進めた。", note: "三つの動きを同じ地図で位置づけます。"
  }),
  makeScene({
    id: "buyid-baghdad", chapter: 1, year: "10世紀半ば", frame: [40, 27, 55, 41], zones: ["iran", "abbasid"], pins: ["caspian", "baghdad"], routes: [route([[49, 37], [44.37, 33.32]], "campaign")],
    facts: ["カスピ海南西から現れたブワイフ朝", "イラン人歩兵軍団とトルコ人マムルーク", "バグダード入城後、カリフから大アミール"], actors: [{ name: "軍人政権", image: "buyid-amir", at: "caspian", route: 0, bubble: "バグダードへ入城する" }],
    title: "二つの軍団を率いるブワイフ朝が、\nバグダードへ入る。", kicker: "東方の自立②", mapHeading: "カスピ海南西からバグダードへ", focus: "イラン人歩兵とトルコ人マムルーク",
    before: "ブワイフ朝がカスピ海南西で成長する", after: "バグダードでカリフから大アミールとなる",
    body: ["<strong>10世紀半ば</strong>、<strong>カスピ海南西</strong>から現れた<strong>軍人政権</strong>の<strong>ブワイフ朝</strong>は、<strong>イラン人歩兵軍団</strong>と<strong>トルコ人マムルーク</strong>を率いた。", "<strong>バグダード</strong>へ入城し、<strong>カリフ</strong>から<strong>大アミール</strong>に任じられた。"],
    takeaway: "ブワイフ朝は軍事力を背景に、バグダードの実権を握った。", note: "軍団の構成も地図下の要点に示します。"
  }),
  makeScene({
    id: "buyid-iqta", chapter: 1, year: "946年以後", frame: [40, 27, 52, 39], zones: ["abbasid"], pins: ["baghdad"], tags: [{ at: [48, 36], text: "イクター制" }],
    facts: ["アッバース朝の財政難でアター【俸給】を払えない", "軍人の暴動に対し土地の管理権・徴税権を与える", "シーア派ブワイフ朝による東方の反撃"], actors: [{ name: "軍人", image: "buyid-amir", at: "baghdad", bubble: "管理権と徴税権を受け取る" }],
    title: "俸給不足から、\nイクター制が始まる。", kicker: "東方の自立③", mapHeading: "財政難のバグダードで生まれた制度", focus: "アター・暴動・管理権・徴税権",
    before: "アッバース朝の金庫が空になりアターを払えない", after: "軍人へ土地の管理権と徴税権を与える",
    body: ["<strong>ブワイフ朝</strong>が<strong>バグダード</strong>へ入ったとき、<strong>アッバース朝</strong>の<strong>財政難</strong>で<strong>アター【俸給】</strong>を払えず、<strong>軍人</strong>が<strong>暴動</strong>を起こした。", "そこで土地の<strong>管理権</strong>と<strong>徴税権</strong>を与える<strong>イクター制</strong>を始めた。<strong>シーア派</strong>のブワイフ朝による『<strong>東方のシーア派の反撃</strong>』でもあった。"],
    takeaway: "現金の俸給不足を、土地から税を得る権利で補った。", note: "土地そのものではなく、管理と徴税の権利を与える制度です。"
  }),
  makeScene({
    id: "central-asian-dynasties", chapter: 1, year: "867〜1211年", frame: [55, 30, 112, 52], zones: ["centralAsia"], pins: ["centralAsia", "bukhara", "mongolia"],
    routes: [route([[103, 46], [75, 42], [64.42, 39.77]], "move")], tags: [{ at: [86, 46], text: "ナイマン" }], facts: ["サッファール朝【867〜903年】・サーマーン朝【875〜999年】", "カラ＝ハン朝【10世紀中頃〜12世紀中頃】", "カラ＝キタイ【西遼】【1132〜1211年】を耶律大石が建国"],
    title: "中央アジアで、\n王朝が次々に交代する。", kicker: "中央アジアの王朝①", mapHeading: "ブハラからモンゴル高原までの王朝交代", focus: "サーマーン朝・カラ＝ハン朝・カラ＝キタイ",
    before: "イラン系王朝が中央アジアへ広がる", after: "トルコ系と遼の王族の政権へ移る",
    body: ["<strong>イラン系最初のイスラーム王朝</strong>の<strong>サッファール朝【867〜903年】</strong>に続き、<strong>サーマーン朝【875〜999年】</strong>が<strong>ブハラ</strong>を都とした。<strong>中央アジア</strong>では、最初の<strong>トルコ系イスラーム王朝</strong>である<strong>カラ＝ハン朝【10世紀中頃〜12世紀中頃】</strong>も成立した。", "<strong>遼の王族</strong><strong>耶律大石</strong>は<strong>カラ＝キタイ【西遼】【1132〜1211年】</strong>を建てた。内紛で衰えると<strong>ナイマン</strong>に滅ぼされ、ナイマンも<strong>チンギス＝ハン【カン】</strong>に滅ぼされた。<strong>モンゴル高原</strong>からの動きも中央アジアを変えた。"],
    takeaway: "中央アジアでは、イラン系・トルコ系・遼系の政権が交代した。", note: "次の場面では、王朝交代とイスラーム化・トルコ化を結びます。"
  }),
  makeScene({
    id: "karakhanid-islamization", chapter: 1, year: "10世紀半ば〜999年", frame: [56, 32, 108, 51], zones: ["centralAsia"], pins: ["bukhara", "oasis", "mongolia"],
    routes: [route([[103, 46], [70, 41], [64.42, 39.77]], "move")], tags: [{ at: [76, 37], text: "トルキスタン" }], facts: ["サーマーン朝宮廷でマムルークの力が強まる", "ムスリム商人とオアシス地帯の部族がイスラームを受容", "ウイグル人の一部がカラ＝ハン朝を建て999年にサーマーン朝を滅ぼす"],
    title: "カラ＝ハン朝の成立で、\n中央アジアの姿が変わる。", kicker: "中央アジアの王朝②", mapHeading: "モンゴル高原からオアシス地帯とブハラへ", focus: "イスラーム化・トルコ化・トルキスタン",
    before: "サーマーン朝がマムルークを多数抱える", after: "カラ＝ハン朝がサーマーン朝を滅ぼす",
    body: ["<strong>サーマーン朝</strong>の宮廷では<strong>マムルーク</strong>を通じて<strong>トルコ人</strong>の力が強まった。<strong>中央アジアのオアシス地帯</strong>では、部族が独自に<strong>イスラーム教</strong>を受け入れ、<strong>ムスリム商人</strong>の活動も<strong>イスラーム化</strong>を進めた。", "<strong>10世紀半ば</strong>、<strong>モンゴル高原</strong>から移動した<strong>ウイグル人</strong>の一部が建てたとされる<strong>カラ＝ハン朝</strong>が現れ、<strong>999年</strong>に<strong>ブハラ</strong>のサーマーン朝を滅ぼした。<strong>トルコ化</strong>が進んだ中央アジアは<strong>トルキスタン</strong>とよばれるようになった。"],
    takeaway: "王朝交代と商人の活動が、中央アジアのイスラーム化・トルコ化を進めた。", note: "民族の移動、改宗、言語の変化を分けて捉えます。"
  }),
  makeScene({
    id: "ghaznavid-alptegin", chapter: 1, year: "10世紀末", frame: [60, 20, 84, 42], zones: ["india", "centralAsia"], pins: ["afghanistan", "ghazna", "northIndia"], routes: [route([[68.42, 33.55], [78, 28]], "campaign")],
    facts: ["サーマーン朝のマムルークだったアルプテギン", "アフガニスタンでガズナ朝を建国", "北インドへの侵入がインドのイスラーム化のきっかけ"], actors: [{ name: "アルプテギン", image: "aibak-sultan", at: "ghazna", route: 0, bubble: "北インドへ進む" }],
    title: "アルプテギンのガズナ朝が、\nインド進出を始める。", kicker: "中央アジアの王朝③", mapHeading: "アフガニスタンのガズナから北インドへ", focus: "マムルークの自立とインドのイスラーム化",
    before: "サーマーン朝の宮廷でトルコ人マムルークが力を持つ", after: "ガズナ朝が北インドへ侵入を重ねる",
    body: ["<strong>アフガニスタン</strong>では、<strong>サーマーン朝</strong>の<strong>トルコ人</strong><strong>マムルーク</strong>だった<strong>アルプテギン</strong>が<strong>ガズナ</strong>で<strong>ガズナ朝</strong>を建てた。", "<strong>10世紀末</strong>から<strong>北インド</strong>への<strong>インド侵入</strong>を繰り返し、<strong>インドのイスラーム化</strong>のきっかけをつくった。こうして<strong>中央アジア</strong>からアフガニスタンが<strong>トルコ系イスラーム王朝</strong>の支配下へ入った。"],
    takeaway: "サーマーン朝のマムルークが自立し、インド進出の道を開いた。", note: "後に続くゴール朝との違いは、北インドの場面で整理します。"
  }),
  makeScene({
    id: "tughril-summoned", chapter: 1, year: "1038〜1055年", frame: [39, 27, 66, 42], zones: ["seljuq", "abbasid"], pins: ["khorasan", "baghdad"], routes: [route([[59, 35.5], [44.37, 33.32]], "campaign")],
    facts: ["トゥグリル＝ベクがホラーサーンでセルジューク朝を建国", "アッバース朝カリフがブワイフ朝追放の支援を要請", "セルジューク朝軍がバグダードへ"], actors: [{ name: "トゥグリル＝ベク", image: "tughril-beg", at: "khorasan", route: 0, bubble: "カリフの要請でバグダードへ" }],
    title: "カリフの要請を受け、\nセルジューク朝が西へ進む。", kicker: "トルコ人政権の台頭①", mapHeading: "ホラーサーンからバグダードへの救援", focus: "トゥグリル＝ベクとアッバース朝カリフ",
    before: "トゥグリル＝ベクがセルジューク朝を建てる", after: "カリフがブワイフ朝追放の支援を求める",
    body: ["<strong>トゥグリル＝ベク</strong>は<strong>ホラーサーン地方</strong>で<strong>セルジューク朝</strong>を建て、<strong>アッバース朝カリフ</strong>へ支援の用意を伝えた。", "カリフは<strong>ブワイフ朝</strong>が居座る<strong>バグダード</strong>へ来るよう<strong>支援要請</strong>を出し、セルジューク朝軍が西へ進んだ。"],
    takeaway: "セルジューク朝の進出は、カリフからの要請を受けて始まった。", note: "建国から入城までの因果関係を示します。"
  }),
  makeScene({
    id: "sultan-sunni-restoration", chapter: 1, year: "1055年", frame: [39, 27, 53, 41], zones: ["seljuq", "abbasid"], pins: ["baghdad"], tags: [{ at: [49, 37], text: "スンナ派の逆襲" }],
    facts: ["トゥグリル＝ベクがブワイフ朝を追放", "アッバース朝カリフからスルタン【支配者】称号", "カリフの権威とセルジューク朝の政治的支配権"], actors: [{ name: "トゥグリル＝ベク", image: "tughril-beg", at: "baghdad", bubble: "スルタンとして政治を担う" }],
    title: "カリフが権威を保ち、\nスルタンが政治を担う。", kicker: "トルコ人政権の台頭②", mapHeading: "1055年のバグダード入城", focus: "ブワイフ朝追放とスンナ派の逆襲",
    before: "シーア派ブワイフ朝がバグダードを支配する", after: "スンナ派セルジューク朝が政治的実権を得る",
    body: ["<strong>1055年</strong>、<strong>トゥグリル＝ベク</strong>は<strong>バグダード</strong>で<strong>シーア派</strong>の<strong>ブワイフ朝</strong>を追放し、<strong>アッバース朝カリフ</strong>から<strong>スルタン【支配者】</strong>の称号を受けた。", "<strong>スンナ派</strong>の<strong>セルジューク朝</strong>による『<strong>スンナ派の逆襲</strong>』であり、以後は<strong>カリフの権威</strong>を背景に、スルタンが<strong>政治的支配権</strong>を持った。"],
    takeaway: "宗教的権威のカリフと、政治を担うスルタンが分かれた。", note: "同じ都市に二つの役割が並ぶ点を示します。"
  }),
  makeScene({
    id: "manzikert-expansion", chapter: 1, year: "1071年以後", frame: [24, 31, 48, 48], zones: ["anatolia", "seljuq"], pins: ["manzikert", "anatolia", "westEurope"], routes: [route([[46, 38], [42.54, 39.14]], "campaign"), route([[42.54, 39.14], [34, 39]], "campaign"), route([[34, 39], [3, 47]], "move")],
    facts: ["セルジューク朝がマラーズギルドの戦いでビザンツ帝国を破る", "アナトリア【小アジア】のトルコ化・イスラーム化", "西欧への援軍要請が十字軍遠征の背景"],
    title: "アナトリアへ進み、\nトルコ化とイスラーム化を進める。", kicker: "トルコ人政権の台頭③", mapHeading: "マラーズギルドからアナトリアへ", focus: "ビザンツ帝国の危機と十字軍",
    before: "セルジューク朝がマラーズギルドで勝利する", after: "ビザンツ帝国が西欧へ援軍を求める",
    body: ["<strong>セルジューク朝</strong>は<strong>マラーズギルドの戦い</strong>で<strong>ビザンツ帝国</strong>を破り、<strong>アナトリア【小アジア】</strong>へ侵攻して<strong>トルコ化</strong>・<strong>イスラーム化</strong>を進めた。", "危機感を抱いたビザンツ帝国が<strong>西欧</strong>へ<strong>援軍</strong>を求めたことが、<strong>十字軍遠征</strong>の背景となった。"],
    takeaway: "アナトリアの変化とビザンツ帝国の援軍要請が十字軍へつながった。", note: "一覧で先に見た戦いを、地域変化まで含めて整理します。"
  }),
  makeScene({
    id: "malik-reforms", chapter: 1, year: "11世紀後半", frame: [37, 25, 64, 43], zones: ["seljuq"], pins: ["iran", "baghdad"], tags: [{ at: [58, 37], text: "ペルシア語を公用語" }],
    facts: ["マリク＝シャー時代の全盛期：軍にマムルーク、官僚にイラン人", "ニザーム＝アルムルク『統治の書』", "ニザーミーヤ学院【マドラサ】で神学・法学、イクター制を発展"], actors: [{ name: "ニザーム＝アルムルク", image: "nizam-almulk", at: "iran", bubble: "制度と教育で統治を支える" }],
    title: "軍・官僚・教育を整え、\nセルジューク朝が全盛期を迎える。", kicker: "トルコ人政権の台頭④", mapHeading: "イラン人宰相が主要都市へ制度を広げる", focus: "『統治の書』・学院・イクター制",
    before: "マリク＝シャーが広い領土を支配する", after: "ニザーム＝アルムルクが統治機構を整える",
    body: ["<strong>11世紀後半</strong>の<strong>マリク＝シャー</strong>時代、<strong>セルジューク朝</strong>は<strong>全盛期</strong>を迎えた。軍に<strong>マムルーク</strong>、官僚に<strong>イラン人</strong>を登用し、<strong>ペルシア語</strong>を<strong>公用語</strong>とした。", "<strong>イラン人宰相</strong><strong>ニザーム＝アルムルク</strong>は『<strong>統治の書</strong>』を著し、<strong>イラン</strong>や<strong>バグダード</strong>などの<strong>主要都市</strong>に<strong>ニザーミーヤ学院【マドラサ】</strong>を設けて<strong>神学</strong>と<strong>法学</strong>を育て、ブワイフ朝の<strong>イクター制</strong>を発展させた。"],
    takeaway: "軍事・行政・教育の制度が、セルジューク朝の統治を支えた。", note: "人物名と三つの制度を同じ場面で対応させます。"
  }),
  makeScene({
    id: "seljuq-fragmentation", chapter: 1, year: "11〜12世紀", frame: [27, 26, 71, 45], zones: ["anatolia", "iran"], pins: ["anatolia", "iran", "afghanistan", "northIraq", "centralAsia"],
    tags: [{ at: [36, 42], text: "ルーム＝セルジューク朝" }, { at: [58, 32], text: "ホラズム＝シャー【ホラズム】朝" }, { at: [43, 38], text: "ザンギー朝" }], facts: ["セルジューク朝分裂後、第1回十字軍に敗北", "イラン・アフガニスタンとイラク北部に別政権", "中央アジアでカラ＝キタイ【西遼】がカラ＝ハン朝を滅ぼす"],
    title: "セルジューク朝の分裂が、\n各地の新王朝を生む。", kicker: "トルコ人政権の台頭⑤", mapHeading: "アナトリア・東方・イラク北部の分裂", focus: "三王朝と第1回十字軍",
    before: "各地の軍団と総督が力を持つ", after: "分裂した政権が十字軍と中央アジアの変動に直面する",
    body: ["<strong>11世紀末</strong>、<strong>セルジューク朝</strong>の軍団が分裂し、<strong>アナトリア</strong>の<strong>ルーム＝セルジューク朝</strong>、<strong>イラン</strong>・<strong>アフガニスタン</strong>の<strong>ホラズム＝シャー【ホラズム】朝</strong>、<strong>イラク北部</strong>の総督から自立した<strong>ザンギー朝</strong>が生まれた。", "分裂したセルジューク朝は<strong>第1回十字軍</strong>に敗れた。<strong>12世紀</strong>の<strong>中央アジア</strong>では、<strong>カラ＝キタイ【西遼】</strong>が<strong>カラ＝ハン朝</strong>を滅ぼした。"],
    takeaway: "分裂が、西方の十字軍と中央アジアの王朝交代に影響した。", note: "地図では三つの分裂先と中央アジアを同時に示します。"
  }),
  makeScene({
    id: "twelfth-century-map", chapter: 1, year: "12世紀", frame: [-11, 17, 88, 48], zones: ["west", "mamluk", "anatolia", "iran", "india"], pins: ["anatolia", "centralAsia", "marrakech", "iran", "afghanistan", "cairo", "baghdad"],
    tags: [{ at: [31, 39], text: "ルーム＝セルジューク朝" }, { at: [72, 44], text: "カラ＝キタイ【西遼】" }, { at: [-4, 34], text: "ムワッヒド朝" }], facts: ["ホラズム朝・ゴール朝・アイユーブ朝", "バグダードのアッバース朝カリフ領", "トルコ系・ベルベル人・イラン系とする説もある王朝／西欧から十字軍"],
    title: "12世紀、分裂した世界へ、\n十字軍が攻め込む。", kicker: "時代の全体図①", mapHeading: "12世紀の諸王朝と十字軍", focus: "西方・中東・中央アジア・北インド",
    before: "セルジューク朝の分裂が進む", after: "各地の王朝が西欧の十字軍にも直面する",
    body: ["<strong>12世紀</strong>には、<strong>アナトリア</strong>の<strong>ルーム＝セルジューク朝</strong>、<strong>中央アジア</strong>の<strong>カラ＝キタイ【西遼】</strong>、<strong>マラケシュ</strong>の<strong>ムワッヒド朝</strong>、<strong>イラン</strong>の<strong>ホラズム朝</strong>、<strong>アフガニスタン</strong>の<strong>ゴール朝</strong>、<strong>カイロ</strong>の<strong>アイユーブ朝</strong>が並び、<strong>バグダード</strong>には<strong>アッバース朝カリフ領</strong>が残った。", "<strong>トルコ系</strong>・<strong>ベルベル人</strong>の王朝に加え、<strong>イラン系・トルコ系の諸説</strong>がある王朝もあった。分裂する一方、<strong>西欧</strong>から<strong>十字軍</strong>が攻め込んだ。"],
    takeaway: "12世紀は、多数の地方王朝と十字軍が並ぶ分裂の時代だった。", note: "民族系統に複数説がある場合は、断定せず表示します。"
  }),
  makeScene({
    id: "thirteenth-century-map", chapter: 1, year: "13世紀", frame: [-11, 18, 90, 47], zones: ["west", "mamluk", "iran", "india"], pins: ["granada", "cairo", "tabriz", "delhi"],
    tags: [{ at: [-2, 35], text: "ナスル朝" }, { at: [33, 27], text: "マムルーク朝" }, { at: [50, 39], text: "イル＝ハン国" }, { at: [76, 25], text: "奴隷王朝" }], facts: ["トルコ系・アラブ系・モンゴル系の政権", "ナスル朝・マムルーク朝・イル＝ハン国・奴隷王朝", "全世界がモンゴルの遠征の影響を受ける"],
    title: "13世紀、\nモンゴルの遠征が世界を変える。", kicker: "時代の全体図②", mapHeading: "イベリアから北インドまでの13世紀", focus: "四つの政権とモンゴルの影響",
    before: "12世紀の地方王朝が交代する", after: "モンゴルの遠征を受けて新しい政権が並ぶ",
    body: ["<strong>13世紀</strong>には、<strong>グラナダ</strong>の<strong>ナスル朝</strong>、<strong>カイロ</strong>の<strong>マムルーク朝</strong>、<strong>タブリーズ</strong>の<strong>イル＝ハン国</strong>、<strong>デリー</strong>の<strong>奴隷王朝</strong>が西から東へ並んだ。", "<strong>トルコ系</strong>・<strong>アラブ系</strong>・<strong>モンゴル系</strong>の政権が併存し、全世界が<strong>モンゴルの遠征</strong>の影響を受けた。"],
    takeaway: "13世紀の諸王朝は、モンゴルの遠征の影響下で並び立った。", note: "ここから西方、エジプト、北インド、アフリカを原文の順にたどります。"
  }),
  makeScene({
    id: "almoravid-sahara", chapter: 2, year: "11世紀", frame: [-13, 8, 14, 43], zones: ["west", "westAfrica"], pins: ["northAfrica", "morocco", "marrakech", "iberia", "sahara", "ghana"],
    routes: [route([[-8, 31.63], [-4, 40]], "campaign"), route([[-8, 31.63], [-2, 24], [-8, 16]], "campaign")], facts: ["アッバース朝カリフ中心のスンナ派復興運動", "ベルベル人がファーティマ朝に対抗してムラービト朝を建国", "レコンキスタへの防衛とガーナ王国征服・サハラ交易"], actors: [{ name: "ベルベル人", image: "sahara-caravan", at: "marrakech", bubble: "イベリアとガーナ王国へ進む" }],
    title: "ムラービト朝が、\n海峡とサハラを越える。", kicker: "北アフリカとイベリア①", mapHeading: "マラケシュからイベリア半島とガーナ王国へ", focus: "スンナ派復興・レコンキスタ・サハラ交易",
    before: "ブワイフ朝とファーティマ朝がシーア派を台頭させる", after: "ベルベル人がムラービト朝を建てて対抗する",
    body: ["<strong>10世紀</strong>に<strong>シーア派</strong>の<strong>ブワイフ朝</strong>と<strong>ファーティマ朝</strong>が成立すると、<strong>アッバース朝カリフ</strong>を中心とする<strong>スンナ派復興運動</strong>が起こった。<strong>イスラーム教</strong>へ改宗した<strong>北アフリカ</strong>の<strong>ベルベル人</strong>は、ファーティマ朝に対抗して<strong>モロッコ</strong>に<strong>ムラービト朝</strong>を建てた。", "ムラービト朝は<strong>後ウマイヤ朝</strong>滅亡後の<strong>イベリア半島</strong>へ進み、<strong>レコンキスタ</strong>を進める<strong>キリスト教徒</strong>に対抗した。<strong>サハラ砂漠</strong>を越えて<strong>ガーナ王国</strong>を征服し、<strong>金</strong>と<strong>岩塩</strong>の<strong>サハラ交易</strong>を握ると、都<strong>マラケシュ</strong>に金が集まった。"],
    takeaway: "ムラービト朝は、イベリア防衛とサハラ交易の両方を担った。", note: "北と南へ伸びる二本の動きを示します。"
  }),
  makeScene({
    id: "almohad-nasrid", chapter: 2, year: "1130〜1492年", frame: [-10, 28, 5, 44], zones: ["west"], pins: ["marrakech", "iberia", "granada", "castile", "aragon", "spain"],
    routes: [route([[-8, 31.63], [-4, 40]], "campaign"), route([[-4, 41], [-3.59, 37.18]], "rival"), route([[0, 41], [-3.59, 37.18]], "rival")], tags: [{ at: [-1, 34], text: "ナスル朝" }], facts: ["ムワッヒド朝が改革運動から成立しイベリア半島へ", "カスティリャ王国とアラゴン王国がスペイン王国へ統合", "1492年、グラナダ征服とムスリム・ユダヤ教徒の追放"], props: [{ name: "アルハンブラ宮殿", image: "alhambra-palace", at: "granada", kind: "prop", size: 64 }],
    title: "レコンキスタが進み、\nナスル朝が1492年に滅ぶ。", kicker: "北アフリカとイベリア②", mapHeading: "マラケシュからイベリア南端のグラナダへ", focus: "ムワッヒド朝・スペイン王国・アルハンブラ宮殿",
    before: "ムワッヒド朝が北アフリカとイベリアへ進む", after: "キリスト教徒がグラナダを征服する",
    body: ["<strong>北アフリカ</strong>の<strong>ベルベル人</strong>の新たな<strong>イスラーム改革運動</strong>から<strong>ムワッヒド朝</strong>が成立し、<strong>マラケシュ</strong>から<strong>イベリア半島</strong>へ進んだ。<strong>13世紀</strong>に<strong>キリスト教徒</strong>に押されると、イスラーム勢力は南端の<strong>ナスル朝</strong>だけになった。", "<strong>カスティリャ王国</strong>と<strong>アラゴン王国</strong>が統合して<strong>スペイン王国</strong>となり、<strong>1492年</strong>に<strong>グラナダ</strong>を征服した。<strong>ムスリム</strong>と<strong>ユダヤ教徒</strong>は半島を追われ、ナスル朝の<strong>アルハンブラ宮殿</strong>が<strong>イスラーム建築</strong>の傑作として残った。"],
    takeaway: "1492年のグラナダ陥落で、イベリアのイスラーム王朝が終わった。", note: "王国統合から征服、住民の追放までを順に示します。"
  }),
  makeScene({
    id: "western-dynasty-review", chapter: 2, year: "756〜1492年", frame: [-11, 27, 12, 44], zones: ["west"], pins: ["cordoba", "marrakech", "granada", "maghrib", "morocco"],
    tags: [{ at: [-3, 39], text: "西カリフ国" }, { at: [-1, 34], text: "レコンキスタ【国土回復運動】" }], facts: ["後ウマイヤ朝【756〜1031年】・アブド＝アッラフマーン3世【位912〜961年】・929年", "ムラービト朝【1056〜1147年】／ムワッヒド朝【1130〜1269年】", "ナスル朝【1232〜1492年】"],
    title: "西方四王朝の順番を、\n都と年代で整理する。", kicker: "西方王朝のまとめ", mapHeading: "コルドバ・マラケシュ・グラナダ", focus: "後ウマイヤ朝からナスル朝まで",
    before: "後ウマイヤ朝がコルドバで成立する", after: "ナスル朝がスペイン王国に敗れる",
    body: ["<strong>後ウマイヤ朝【756〜1031年】</strong>は<strong>コルドバ</strong>を都とし、<strong>アブド＝アッラフマーン3世【位912〜961年】</strong>が<strong>929年</strong>にカリフを称して<strong>西カリフ国</strong>となった。", "<strong>マグリブ地方</strong>の<strong>ベルベル人</strong>は<strong>モロッコ</strong>に、都<strong>マラケシュ</strong>の<strong>ムラービト朝【1056〜1147年】</strong>、続いて<strong>ムワッヒド朝【1130〜1269年】</strong>を建てた。最後の<strong>ナスル朝【1232〜1492年】</strong>は、<strong>レコンキスタ【国土回復運動】</strong>を進める<strong>スペイン王国</strong>に敗れ、都<strong>グラナダ</strong>を失った。"],
    takeaway: "西方の王朝は、コルドバからマラケシュ、グラナダへと移った。", note: "既出の出来事を、王朝一覧に合わせて年代順に整理します。"
  }),
  makeScene({
    id: "saladin-jerusalem", chapter: 2, year: "1169〜1192年", frame: [28, 16, 42, 38], zones: ["mamluk"], pins: ["cairo", "jerusalem", "syria", "redSea"], routes: [route([[31.24, 30.04], [35.21, 31.77]], "campaign")],
    facts: ["クルド人武将サラーフ＝アッディーン【サラディン】", "ファーティマ朝の宰相からアイユーブ朝を建国しスンナ派復興", "第3回十字軍のリチャード1世と講和しシリア・紅海貿易を確保"], actors: [{ name: "サラーフ＝アッディーン【サラディン】", image: "saladin", at: "cairo", route: 0, bubble: "ジハードを宣言しイェルサレムへ" }, { name: "リチャード1世", image: "crusader-knight", at: "jerusalem", bubble: "第3回十字軍を率いる" }],
    title: "サラーフ＝アッディーンが、\nイェルサレムを回復する。", kicker: "エジプトの王朝①", mapHeading: "カイロからイェルサレムとシリアへ", focus: "アイユーブ朝・第3回十字軍・紅海貿易",
    before: "十字軍に苦しむファーティマ朝へ援軍として派遣される", after: "イェルサレムを回復しリチャード1世と講和する",
    body: ["<strong>十字軍</strong>に苦しむ<strong>ファーティマ朝</strong>への援軍として派遣された<strong>クルド人武将</strong><strong>サラーフ＝アッディーン【サラディン】</strong>は、<strong>カイロ</strong>で<strong>宰相【ワズィール】</strong>となり、同朝を滅ぼして<strong>アイユーブ朝</strong>を建てた。<strong>スンナ派</strong>を復興し、軍団を再編して<strong>ジハード</strong>を宣言し、<strong>イェルサレム【エルサレム】</strong>を回復した。", "西欧の<strong>第3回十字軍</strong>を率いる<strong>イングランド王リチャード1世</strong>と戦った後に講和し、<strong>シリア</strong>の大部分を確保して<strong>紅海貿易</strong>を押さえた。"],
    takeaway: "サラーフ＝アッディーンは、スンナ派を復興し十字軍と戦った。", note: "ファーティマ朝の宰相からアイユーブ朝建国、聖地回復へ進む順を示します。"
  }),
  makeScene({
    id: "ayyubid-mamluks", chapter: 2, year: "12〜13世紀", frame: [27, 19, 42, 36], zones: ["mamluk"], pins: ["egypt", "cairo"], tags: [{ at: [36, 27], text: "マムルーク軍団" }],
    facts: ["アイユーブ朝がエジプトにイクター制を導入", "マムルーク軍団を強化", "軍団が次第に権力を握る"], actors: [{ name: "マムルーク軍団", image: "umayyad-abbasid/mamluk-guard", at: "cairo", bubble: "軍の中核となる" }],
    title: "強化されたマムルーク軍団が、\n政治の力を持つ。", kicker: "エジプトの王朝②", mapHeading: "エジプトのイクター制とマムルーク軍団", focus: "アイユーブ朝の軍制",
    before: "アイユーブ朝がエジプトを統治する", after: "マムルーク軍団が権力を握る",
    body: ["<strong>アイユーブ朝</strong>は<strong>エジプト</strong>へ<strong>イクター制</strong>を導入し、<strong>カイロ</strong>を中心に<strong>マムルーク軍団</strong>を強化した。", "軍事力を担った<strong>マムルーク</strong>は次第に<strong>権力</strong>を握り、王朝交代の土台をつくった。"],
    takeaway: "軍制の強化が、マムルーク自身による王朝成立へつながった。", note: "制度と軍団の成長を同じ場面で示します。"
  }),
  makeScene({
    id: "aibak-mamluk-dynasty", chapter: 2, year: "1250年", frame: [27, 21, 40, 36], zones: ["mamluk"], pins: ["cairo", "egypt"],
    facts: ["衰退するアイユーブ朝", "トルコ系マムルーク出身のアイバク", "スルタンの妃と組んでマムルーク朝を建国"], actors: [{ name: "アイバク", image: "aibak-sultan", at: "cairo", bubble: "マムルーク朝を建てる" }],
    title: "アイバクが、\nマムルーク朝を建てる。", kicker: "エジプトの王朝③", mapHeading: "カイロで始まるマムルーク朝", focus: "トルコ系マムルークとスルタンの妃",
    before: "アイユーブ朝が衰退する", after: "アイバクがスルタンの妃と組み建国する",
    body: ["<strong>アイユーブ朝</strong>が衰えると、<strong>トルコ系マムルーク</strong>出身の<strong>アイバク</strong>が<strong>スルタンの妃</strong>と組み、<strong>1250年</strong>に<strong>エジプト</strong>の<strong>カイロ</strong>で<strong>マムルーク朝</strong>を建てた。", "軍人として力を持ったマムルークが、みずから王朝を担う段階へ進んだ。"],
    takeaway: "アイユーブ朝の軍人が、エジプトにマムルーク朝を開いた。", note: "次の場面で、建国直後に迫ったモンゴル軍との戦いを扱います。"
  }),
  makeScene({
    id: "hulagu-baybars", chapter: 2, year: "1258〜1260年", frame: [28, 26, 48, 39], zones: ["mamluk", "abbasid"], pins: ["baghdad", "syria", "palestine", "cairo"],
    routes: [route([[44.37, 33.32], [37, 35], [35.2, 32]], "campaign"), route([[31.24, 30.04], [35.2, 32]], "rival")], facts: ["フレグのモンゴル軍がバグダードでアッバース朝を滅ぼしシリアへ", "マムルーク出身の将軍バイバルスがパレスチナ付近で撃退", "シリアまで領土を広げバイバルスがスルタンへ"], actors: [{ name: "フレグのモンゴル軍", image: "hulagu-khan", at: "baghdad", route: 0, bubble: "シリアへ進む" }, { name: "将軍バイバルス", image: "baibars", at: "cairo", route: 1, bubble: "パレスチナ付近で迎え撃つ" }],
    title: "バイバルスがモンゴル軍を撃退し、\nシリアへ領土を広げる。", kicker: "エジプトの王朝④", mapHeading: "バグダードから来るモンゴル軍とカイロから迎える軍", focus: "フレグ・バイバルス・パレスチナ",
    before: "フレグがバグダードのアッバース朝を滅ぼす", after: "バイバルスがモンゴル軍を撃退する",
    body: ["<strong>フレグ</strong>の<strong>モンゴル軍</strong>は<strong>バグダード</strong>の<strong>アッバース朝</strong>を滅ぼした後、<strong>シリア</strong>へ進んだ。", "<strong>マムルーク</strong>出身の<strong>将軍バイバルス</strong>は、<strong>カイロ</strong>から進み<strong>パレスチナ</strong>付近でモンゴル軍を撃退した。<strong>マムルーク朝</strong>はシリアまで領土を広げ、バイバルスは<strong>スルタン</strong>となった。"],
    takeaway: "モンゴル軍を止めた功績で、バイバルスがスルタンになった。", note: "二方向の進軍を一つの地図上で示します。"
  }),
  makeScene({
    id: "cairo-leadership", chapter: 2, year: "13〜15世紀", frame: [27, 2, 67, 36], zones: ["mamluk"], pins: ["cairo", "mecca", "medina", "redSea", "indianOcean", "baghdad"],
    routes: [route([[31.24, 30.04], [39.61, 24.47], [39.83, 21.42]], "move"), route([[62, 5], [37, 20], [31.24, 30.04]], "trade")],
    facts: ["アッバース家の末裔をカイロでカリフに擁立", "メッカ・メディナを保護してイスラーム世界の盟主へ", "カーリミー商人を保護し紅海〜インド洋の香辛料貿易を独占"], actors: [{ name: "バイバルス", image: "baibars", at: "cairo", bubble: "聖地と交易路を守る" }, { name: "カーリミー商人", image: "karimi-merchant", at: "indianOcean", route: 1, bubble: "香辛料をカイロへ運ぶ" }],
    title: "聖地と香辛料貿易を押さえ、\nカイロが中心地になる。", kicker: "エジプトの王朝⑤", mapHeading: "カイロから二聖地、紅海からインド洋へ", focus: "カリフ擁立・聖地保護・カーリミー商人",
    before: "モンゴル軍がバグダードを破壊する", after: "カイロが政治・経済・文化の中心となる",
    body: ["<strong>バイバルス</strong>は<strong>アッバース家の末裔</strong>を都<strong>カイロ</strong>へ迎えて<strong>カリフ</strong>とし、<strong>メッカ</strong>と<strong>メディナ</strong>を保護下に置いた。<strong>マムルーク朝</strong>は<strong>イスラーム世界の盟主</strong>となった。", "<strong>カーリミー商人</strong>を保護して<strong>紅海</strong>から<strong>インド洋</strong>を結ぶ<strong>香辛料貿易</strong>を独占した。モンゴルに破壊された<strong>バグダード</strong>に代わり、カイロが<strong>政治・経済・文化の中心地</strong>になった。"],
    takeaway: "カリフ・聖地・交易を結び、カイロがイスラーム世界の中心となった。", note: "宗教的権威と交易の両面を示します。"
  }),
  makeScene({
    id: "egypt-dynasty-review", chapter: 2, year: "868〜1517年", frame: [26, 20, 42, 38], zones: ["mamluk", "fatimid"], pins: ["tunis", "cairo", "jerusalem", "mecca", "medina"],
    tags: [{ at: [33, 34], text: "中カリフ国" }], facts: ["トゥールーン朝【868〜905年】", "ファーティマ朝【909〜1171年】・アイユーブ朝【1169〜1250年】", "マムルーク朝【1250〜1517年】"],
    title: "エジプト四王朝の流れを、\n出来事とともに整理する。", kicker: "エジプト王朝のまとめ", mapHeading: "チュニジアからカイロ、聖地まで", focus: "トゥールーン朝からマムルーク朝まで",
    before: "アッバース朝のエジプト総督が自立する", after: "マムルーク朝が二聖地を保護する",
    body: ["<strong>トゥールーン朝【868〜905年】</strong>は<strong>アッバース朝</strong>の<strong>エジプト総督</strong>が自立して建てた。<strong>イスマーイール派</strong>の<strong>ファーティマ朝【909〜1171年】</strong>は<strong>チュニジア</strong>で成立し、<strong>中カリフ国</strong>としてカリフを称して<strong>カイロ</strong>と<strong>アズハル学院</strong>を建てた。", "<strong>アイユーブ朝【1169〜1250年】</strong>の<strong>サラーフ＝アッディーン【サラディン】</strong>は<strong>イェルサレム</strong>を回復して<strong>第3回十字軍</strong>と戦った。<strong>トルコ系マムルーク</strong>が建てた<strong>マムルーク朝【1250〜1517年】</strong>では<strong>バイバルス【位1260〜77年】</strong>がモンゴル軍を破り、アッバース家の後裔をカイロに擁立し、<strong>メッカ</strong>・<strong>メディナ</strong>と<strong>カーリミー商人</strong>を保護した。"],
    takeaway: "総督の自立から、カリフを擁立するマムルーク朝まで王朝が交代した。", note: "既出の内容を、エジプト王朝一覧の順に結び直します。"
  }),
  makeScene({
    id: "ghaznavid-ghurid", chapter: 2, year: "10〜12世紀", frame: [57, 18, 84, 41], zones: ["india", "centralAsia"], pins: ["afghanistan", "ghazna", "northIndia"], routes: [route([[68.42, 33.55], [78, 28]], "campaign")],
    facts: ["ガズナ朝【962／977〜1186年】はサーマーン朝のマムルーク出身者が建国", "セルジューク朝の圧迫で衰退しゴール朝【1148年頃〜1215年】が自立", "ゴール朝がガズナ朝を滅ぼしヒンドゥー諸王国を破る"],
    title: "ガズナ朝からゴール朝へ、\n北インド侵攻が受け継がれる。", kicker: "北インドとアフガニスタン①", mapHeading: "アフガニスタンから北インドへの連続する侵攻", focus: "二王朝とヒンドゥー諸王国",
    before: "トルコ系ガズナ朝がインド侵入を重ねる", after: "ゴール朝が北インドの大半を支配する",
    body: ["<strong>アフガニスタン</strong>の<strong>トルコ系</strong><strong>ガズナ朝【962／977〜1186年】</strong>は、<strong>サーマーン朝</strong>の<strong>マムルーク出身者</strong>が建て、<strong>10世紀末</strong>から<strong>北インド</strong>への侵入と略奪を重ねた。小王国に分かれた北インドは抵抗できなかった。", "ガズナ朝が<strong>セルジューク朝</strong>の圧迫で衰えると、そこから<strong>ゴール朝【1148年頃〜1215年】</strong>が自立した。<strong>イラン系・トルコ系など諸説</strong>のあるゴール朝はガズナ朝を滅ぼし、<strong>ヒンドゥー諸王国</strong>を破って北インドの大半を支配した。"],
    takeaway: "ガズナ朝の侵入を、ゴール朝が北インド支配へ進めた。", note: "二王朝の交代と、侵入から支配への変化を示します。"
  }),
  makeScene({
    id: "slave-dynasty", chapter: 2, year: "1206年", frame: [66, 20, 83, 35], zones: ["india"], pins: ["northIndia", "delhi"], routes: [route([[72, 33], [77.21, 28.61]], "campaign")],
    facts: ["ゴール朝のマムルーク出身武将アイバク", "デリーを拠点に自立", "インド最初のイスラーム王朝・奴隷王朝【1206〜1290年】"], actors: [{ name: "アイバク", image: "aibak-sultan", at: [72, 33], route: 0, bubble: "デリーで自立する" }],
    title: "アイバクがデリーで自立し、\n奴隷王朝を建てる。", kicker: "北インドとアフガニスタン②", mapHeading: "ゴール朝の支配地からデリーへ", focus: "インド最初のイスラーム王朝",
    before: "ゴール朝が北インドの支配を広げる", after: "マムルーク出身のアイバクが独立する",
    body: ["<strong>ゴール朝</strong>の<strong>マムルーク</strong>出身武将<strong>アイバク</strong>は、<strong>北インド</strong>の<strong>デリー</strong>へ進み、ここを拠点に自立した。", "<strong>1206年</strong>に、<strong>インド最初のイスラーム王朝</strong>である<strong>奴隷王朝【1206〜1290年】</strong>を建てた。初期の王がマムルーク出身であることが、王朝名の由来になった。"],
    takeaway: "ゴール朝の武将が自立し、デリーに最初のイスラーム王朝を開いた。", note: "同名のアイバクがエジプトの場面にも出るため、地域で区別します。"
  }),
  makeScene({
    id: "delhi-five-dynasties", chapter: 2, year: "1206〜1526年", frame: [68, 16, 84, 34], zones: ["india"], pins: ["delhi", "deccan"], routes: [route([[77.21, 28.61], [76, 18]], "campaign")],
    facts: ["デリー＝スルタン朝：デリーを都とする北インドの5王朝", "奴隷王朝→ハルジー朝→トゥグルク朝→サイイド朝→ロディー朝", "トゥグルク朝にティムールとイブン＝バットゥータ／ロディー朝のみアフガン系"],
    title: "五王朝が交代し、\nデリー＝スルタン朝が続く。", kicker: "北インドとアフガニスタン③", mapHeading: "デリーからデカンへ広がる五王朝", focus: "王朝順・ティムール・イブン＝バットゥータ",
    before: "奴隷王朝がデリーで成立する", after: "ロディー朝まで五王朝が交代する",
    body: ["<strong>デリー</strong>を都とする<strong>北インド</strong>の五王朝、<strong>奴隷王朝【1206〜90年】</strong>、<strong>ハルジー朝【1290〜1320年】</strong>、<strong>トゥグルク朝【1320〜1414年】</strong>、<strong>サイイド朝【1414〜51年】</strong>、<strong>ロディー朝【1451〜1526年】</strong>をまとめて<strong>デリー＝スルタン朝【1206〜1526年】</strong>とよぶ。主に<strong>トルコ系</strong>で、ロディー朝だけは<strong>アフガン系</strong>だった。", "ハルジー朝は<strong>地租の金納化</strong>を進めた。トゥグルク朝は<strong>デカン</strong>へ広がり、<strong>イブン＝バットゥータ</strong>が訪れたが、<strong>ティムール軍の侵入</strong>で衰えた。サイイド朝は<strong>ティムールの武将</strong>が建てた。"],
    takeaway: "五王朝の順番と、各王朝を区別する出来事を結びつける。", note: "王朝名だけでなく、デリーを共通の都として地図上に示します。"
  }),
  makeScene({
    id: "delhi-rule", chapter: 2, year: "デリー＝スルタン朝期", frame: [68, 21, 83, 34], zones: ["india"], pins: ["delhi", "northIndia"], tags: [{ at: [79, 25], text: "ヒンドゥー教徒の小国家" }],
    facts: ["人口の多数を占めるヒンドゥー教徒へ自治権", "スーフィズム【神秘主義】の活動でイスラーム教徒が増加", "イスラーム教徒とヒンドゥー教徒が平和に共存"],
    title: "自治を認めながら、\n二つの信仰が共存する。", kicker: "北インドとアフガニスタン④", mapHeading: "北インドの小国家とデリーの王朝", focus: "ヒンドゥー教徒・スーフィズム・共存",
    before: "デリー＝スルタン朝が多数のヒンドゥー教徒を支配する", after: "自治と交流の中でイスラーム教徒が増える",
    body: ["<strong>デリー＝スルタン朝</strong>は、人口の多い<strong>ヒンドゥー教徒</strong>を支配するため、<strong>北インド</strong>の<strong>ヒンドゥー教徒の小国家</strong>へ<strong>自治権</strong>を認め、従来の<strong>インド社会</strong>を大きく変えなかった。", "<strong>デリー</strong>などで<strong>スーフィズム【神秘主義】</strong>の活動が盛んになり、<strong>イスラーム教徒</strong>も増えた。この時期にはイスラーム教徒とヒンドゥー教徒が<strong>平和に共存</strong>した。"],
    takeaway: "自治を認める統治と宗教活動の中で、二つの信仰が共存した。", note: "征服だけでなく、統治方法と社会の関係を示します。"
  }),
  makeScene({
    id: "kush-meroe", chapter: 2, year: "前10世紀頃", frame: [25, 7, 39, 31], pins: ["nileUpper", "egypt", "meroe"], routes: [route([[32, 14], [30, 27]], "campaign"), route([[30, 27], [33.72, 16.94]], "move")],
    facts: ["ナイル川上流【エチオピア】のクシュ王国", "一時エジプトを支配するがアッシリアの攻撃で撤退", "メロエを都とするメロエ王国"],
    title: "クシュ王国が、\nメロエへ中心を移す。", kicker: "アフリカの古代王国①", mapHeading: "ナイル川上流からエジプト、メロエへ", focus: "クシュ王国・アッシリア・メロエ王国",
    before: "前10世紀頃にクシュ王国がナイル川上流で興る", after: "エジプトから撤退しメロエを都とする",
    body: ["<strong>前10世紀頃</strong>、<strong>ナイル川上流【エチオピア】</strong>に、早くから栄えた黒人国家<strong>クシュ王国</strong>が興り、一時は<strong>エジプト</strong>も支配した。", "<strong>アッシリア</strong>の攻撃を受けて撤退すると、<strong>メロエ</strong>を都とする<strong>メロエ王国</strong>として続いた。"],
    takeaway: "クシュ王国は、エジプト支配後に中心をメロエへ移した。", note: "イスラーム成立以前からのアフリカ王国を時系列の先頭に置きます。"
  }),
  makeScene({
    id: "aksum-christianity", chapter: 2, year: "紀元前後〜", frame: [29, 8, 43, 24], pins: ["aksum", "meroe", "redSea"], routes: [route([[38.72, 14.13], [33.72, 16.94]], "campaign"), route([[38.72, 14.13], [37, 20]], "trade")],
    facts: ["エチオピア北部のアクスム王国", "紅海貿易で繁栄しメロエ王国を滅ぼす", "単性論派のキリスト教を国教化しコプト派につながる"],
    title: "アクスム王国が、\n紅海貿易とキリスト教で栄える。", kicker: "アフリカの古代王国②", mapHeading: "エチオピア北部と紅海、メロエ", focus: "アクスム王国と単性論派",
    before: "紀元前後にエチオピア北部で王国が興る", after: "メロエ王国を滅ぼしキリスト教を国教とする",
    body: ["<strong>紀元前後</strong>、<strong>エチオピア北部</strong>に<strong>アクスム王国</strong>が興り、<strong>紅海貿易</strong>で繁栄した。後に<strong>メロエ王国</strong>を滅ぼした。", "さらに<strong>単性論派</strong>の<strong>キリスト教</strong>を受け入れて国教とした。この系統は<strong>コプト派</strong>など東方のキリスト教世界と結びついた。"],
    takeaway: "アクスム王国は、紅海交易とキリスト教を基盤にした。", note: "西アフリカのイスラーム化より前に、東北部の古代王国を扱います。"
  }),
  makeScene({
    id: "ghana-sahara", chapter: 2, year: "4〜11世紀", frame: [-15, 5, 10, 32], zones: ["westAfrica"], pins: ["sahara", "guinea", "niger", "ghana", "northAfrica"],
    routes: [route([[2, 23], [-8, 16], [-10, 10]], "trade"), route([[5, 30], [-8, 16]], "campaign")], facts: ["4世紀頃からラクダで岩塩とギニアの金を運ぶサハラ交易【塩金交易】", "7世紀頃からニジェール川流域で黒人国家ガーナ王国が繁栄", "ムラービト朝の征服でイスラーム化が進む"], actors: [{ name: "サハラ交易", image: "sahara-caravan", at: "sahara", route: 0, bubble: "岩塩と金を交換する" }],
    title: "金と岩塩の交易が、\nガーナ王国を育てる。", kicker: "西アフリカのイスラーム化①", mapHeading: "サハラ砂漠からギニアとニジェール川へ", focus: "ラクダ・塩金交易・ムラービト朝",
    before: "4世紀頃からラクダの隊商が砂漠を越える", after: "交易と征服を通じてイスラーム化が進む",
    body: ["<strong>4世紀頃</strong>から<strong>ラクダ</strong>を使い、<strong>サハラ砂漠</strong>の<strong>岩塩</strong>と<strong>ギニア</strong>の<strong>金</strong>を交換する<strong>サハラ交易【塩金交易】</strong>が発達した。<strong>7世紀頃</strong>から<strong>ニジェール川流域</strong>の黒人国家<strong>ガーナ王国</strong>が繁栄し、<strong>北アフリカ</strong>から<strong>イスラーム教</strong>が流入した。", "<strong>ムラービト朝</strong>がガーナ王国を征服すると、<strong>イスラーム化</strong>が一気に進んだ。"],
    takeaway: "交易がイスラームを運び、ムラービト朝の征服が広がりを加速させた。", note: "交易路と征服路を色分けして示します。"
  }),
  makeScene({
    id: "mali-mansa-musa", chapter: 2, year: "13世紀", frame: [-8, 9, 44, 34], zones: ["westAfrica"], pins: ["niger", "timbuktu", "cairo", "mecca"], routes: [route([[-3, 16.77], [10, 25], [31.24, 30.04], [39.83, 21.42]], "move")],
    facts: ["イスラーム教を受容したマンディンゴ人がマリ王国を建国", "ニジェール川中流域のトンブクトゥと黄金の国マリ", "マンサ＝ムーサがエジプト経由でメッカ巡礼し金相場が暴落"], actors: [{ name: "マンサ＝ムーサ", image: "mansa-musa", at: "timbuktu", route: 0, bubble: "黄金を携えてメッカへ巡礼する" }],
    title: "マンサ＝ムーサの巡礼が、\n黄金の国マリを世界へ伝える。", kicker: "西アフリカのイスラーム化②", mapHeading: "トンブクトゥからカイロを経てメッカへ", focus: "マンディンゴ人・サハラ交易・金相場",
    before: "13世紀にイスラームを受容した人びとがマリ王国を建てる", after: "マンサ＝ムーサが黄金を携えて巡礼する",
    body: ["<strong>13世紀</strong>、<strong>イスラーム教</strong>を受容した黒人の<strong>マンディンゴ人</strong>が<strong>マリ王国</strong>を建てた。<strong>サハラ交易</strong>で発展し、<strong>ニジェール川流域</strong>の中流部にある<strong>トンブクトゥ</strong>が中継点となった。大量の<strong>金</strong>を供給したため『<strong>黄金の国マリ</strong>』と知られた。", "全盛期の王<strong>マンサ＝ムーサ</strong>は、<strong>エジプト</strong>の<strong>カイロ</strong>を経て<strong>メッカ巡礼</strong>を行い、大量の金を使ったためエジプトの<strong>金相場</strong>が暴落したと伝えられる。"],
    takeaway: "サハラ交易の富と巡礼が、マリ王国を遠方まで知らしめた。", note: "王国の中心と巡礼路を同じ場面で示します。"
  }),
  makeScene({
    id: "songhai-kanem", chapter: 2, year: "中世西アフリカ", frame: [-8, 7, 19, 22], zones: ["westAfrica"], pins: ["timbuktu", "gao", "lakeChad"], routes: [route([[-3, 16.77], [-0.04, 16.27], [14.5, 13]], "trade")],
    facts: ["ソンガイ王国がマリ王国を滅ぼす", "トンブクトゥに黒人による最古級の大学【マドラサ】", "チャド湖周辺のカネム＝ボルヌー王国"],
    title: "ソンガイ王国とカネム＝ボルヌー王国が、\n西アフリカに栄える。", kicker: "西アフリカのイスラーム化③", mapHeading: "トンブクトゥ・ガオ・チャド湖を結ぶ", focus: "イスラーム教学と二つの黒人国家",
    before: "マリ王国がサハラ交易で栄える", after: "ソンガイ王国が学問の中心を受け継ぐ",
    body: ["黒人の<strong>イスラーム国家</strong>である<strong>ソンガイ王国</strong>は<strong>サハラ交易</strong>で栄えた<strong>マリ王国</strong>を滅ぼし、<strong>ガオ</strong>と<strong>トンブクトゥ</strong>を中心に栄えた。トンブクトゥには黒人による最古級の<strong>大学【マドラサ】</strong>が置かれ、<strong>アフリカのイスラーム教学</strong>の中心となった。", "東方の<strong>チャド湖</strong>周辺には、別の黒人イスラーム国家である<strong>カネム＝ボルヌー王国</strong>が成立した。"],
    takeaway: "西アフリカでは、交易とイスラーム教学を担う複数の王国が栄えた。", note: "王国同士の位置関係と学問の中心を示します。"
  }),
  makeScene({
    id: "swahili-ports", chapter: 2, year: "中世", frame: [34, -18, 50, 8], zones: ["eastAfrica"], pins: ["mogadishu", "malindi", "mombasa", "zanzibar", "kilwa", "mozambique", "indianOcean"],
    routes: [route([[45.32, 2.05], [40.12, -3.22], [39.67, -4.04], [39.2, -6.16], [39.52, -8.96], [40.5, -14.5]], "trade")], tags: [{ at: [46, -8], text: "スワヒリ文化" }],
    facts: ["ムスリム商人が東アフリカ沿岸へ定住", "モガディシュ・マリンディ・モンバサ・ザンジバル・キルワ・モザンビーク", "マリンディに鄭和の艦隊とヴァスコ＝ダ＝ガマ／アラビア語とバントゥー語からスワヒリ語"], actors: [{ name: "ムスリム商人", image: "karimi-merchant", at: "mogadishu", route: 0, bubble: "沿岸の港市へ住み着く" }],
    title: "ムスリム商人が港市を結び、\nスワヒリ文化が生まれる。", kicker: "東アフリカの港市", mapHeading: "モガディシュからモザンビークまでの海岸", focus: "六港市・二つの言語・二人の航海者",
    before: "インド洋交易を担うムスリム商人が東アフリカへ来る", after: "港市に定住しスワヒリ文化を育てる",
    body: ["<strong>インド洋交易</strong>を担う<strong>ムスリム商人</strong>が<strong>東アフリカ沿岸</strong>へ住み着き、<strong>モガディシュ</strong>、<strong>マリンディ</strong>、<strong>モンバサ</strong>、<strong>ザンジバル</strong>、<strong>キルワ</strong>、<strong>モザンビーク</strong>などの<strong>港市</strong>が栄えた。マリンディには<strong>鄭和の艦隊</strong>と<strong>ヴァスコ＝ダ＝ガマ</strong>も立ち寄った。", "<strong>アラビア語</strong>と現地の<strong>バントゥー語</strong>が混ざって<strong>スワヒリ語</strong>が生まれ、<strong>イスラーム文化</strong>と<strong>黒人文化</strong>が融合した<strong>スワヒリ文化</strong>が育った。"],
    takeaway: "港市の交易と人の定住が、スワヒリ語と文化を生んだ。", note: "港市を北から南へ順に表示します。"
  }),
  makeScene({
    id: "monomotapa-zimbabwe", chapter: 2, year: "中世", frame: [26, -25, 43, -6], zones: ["southAfrica"], pins: ["zimbabwe", "indianOcean"], routes: [route([[30.93, -20.27], [37, -17], [42, -10]], "trade")], tags: [{ at: [34, -16], text: "モノモタパ王国" }],
    facts: ["スワヒリ文化圏の南に土着の黒人がモノモタパ王国を建国", "金の産出とインド洋交易", "大ジンバブエ【石の家】の石造遺跡とムスリム商人"],
    title: "金と石造遺跡が、\n南部アフリカの繁栄を伝える。", kicker: "南部アフリカの王国", mapHeading: "大ジンバブエからインド洋交易へ", focus: "モノモタパ王国と石の家",
    before: "スワヒリ文化圏の南で金が産出する", after: "内陸の王国がムスリム商人の交易へつながる",
    body: ["<strong>スワヒリ文化圏</strong>の南では、<strong>土着の黒人</strong>が<strong>モノモタパ王国</strong>を建て、<strong>金の産出</strong>と<strong>インド洋交易</strong>で繁栄した。", "壮大な<strong>石造遺跡</strong>の<strong>大ジンバブエ【石の家】</strong>は、<strong>ムスリム商人</strong>との交易と地域の繁栄を伝えている。"],
    takeaway: "南部アフリカの内陸も、金を通じてインド洋世界と結ばれた。", note: "石造遺跡と海への交易路を対応させます。"
  }),
  makeScene({
    id: "africa-map-recap", chapter: 2, year: "前近代", frame: [-16, -26, 48, 36], zones: ["westAfrica", "eastAfrica", "southAfrica"], pins: ["sahara", "timbuktu", "ghana", "gao", "lakeChad", "nileUpper", "aksum", "malindi", "zanzibar", "zimbabwe"],
    routes: [route([[-8, 16], [2, 23]], "trade"), route([[45.32, 2.05], [39.2, -6.16], [30.93, -20.27]], "trade")], facts: ["サハラ交易：ガーナ王国→マリ王国→ソンガイ王国、トンブクトゥ", "カネム＝ボルヌー王国・クシュ王国・アクスム王国", "マリンディ・ザンジバル・大ジンバブエ・モノモタパ王国"],
    title: "前近代アフリカの王国と交易路を、\n一枚の地図で結ぶ。", kicker: "アフリカ全体のまとめ", mapHeading: "サハラ・ナイル・インド洋の三つの地域", focus: "西・北東・東・南部アフリカ",
    before: "各地域の王国と港市を個別にたどる", after: "交易路と王国の変遷をアフリカ全体で結ぶ",
    body: ["西では<strong>サハラ砂漠</strong>を越える<strong>サハラ交易</strong>と<strong>トンブクトゥ</strong>を軸に、<strong>ガーナ王国</strong>、<strong>マリ王国</strong>、<strong>ガオ</strong>を中心とする<strong>ソンガイ王国</strong>が変遷し、<strong>チャド湖</strong>周辺の<strong>カネム＝ボルヌー王国</strong>も栄えた。北東の<strong>ナイル川上流</strong>では<strong>クシュ王国</strong>と<strong>アクスム王国</strong>が早くから成立した。", "東岸の<strong>マリンディ</strong>と<strong>ザンジバル</strong>は海の交易を担い、南部の<strong>大ジンバブエ</strong>と<strong>モノモタパ王国</strong>もインド洋へつながった。"],
    takeaway: "アフリカ各地の王国は、砂漠・川・海の交易路で結ばれた。", note: "個別の場面で扱った地名を、広い地図で再確認します。"
  }),
  makeScene({
    id: "date-recap", chapter: 2, year: "622〜1055年", frame: [-10, 18, 63, 44], zones: ["west", "abbasid", "iran"], pins: ["mecca", "medina", "damascus", "tunis", "baghdad"],
    routes: [route([[39.83, 21.42], [39.61, 24.47]], "move"), route([[36.29, 33.51], [44.37, 33.32]], "move")], facts: ["ヒジュラ【聖遷】622年・ムハンマド", "ウマイヤ朝661年・ムアーウィヤ／アッバース朝750年・アッバース革命", "ファーティマ朝909年／ブワイフ朝バグダード入城946年／セルジューク朝入城1055年"],
    title: "六つの年号で、\n成立から分裂までを振り返る。", kicker: "年号のまとめ", mapHeading: "メッカ・メディナから三王朝の中心地へ", focus: "622・661・750・909・946・1055年",
    before: "イスラーム教の成立から地方政権の自立までをたどる", after: "後の教材でモンゴルの遠征後のイスラーム世界を学ぶ",
    body: ["<strong>イスラーム教</strong>を開いた<strong>ムハンマド</strong>が<strong>メッカ</strong>から<strong>メディナ</strong>へ移った<strong>ヒジュラ【聖遷】</strong>は<strong>622年</strong>、<strong>ムアーウィヤ</strong>が<strong>ダマスクス</strong>で開いた<strong>ウマイヤ朝</strong>は<strong>661年</strong>、<strong>シーア派</strong>も加わった<strong>アッバース革命</strong>と<strong>アッバース朝</strong>成立は<strong>750年</strong>だった。", "<strong>チュニジア</strong>での<strong>ファーティマ朝</strong>成立は<strong>909年</strong>、<strong>ブワイフ朝</strong>の<strong>バグダード入城</strong>は<strong>946年</strong>、<strong>セルジューク朝</strong>のバグダード入城は<strong>1055年</strong>。<strong>モンゴルの遠征後のイスラーム世界</strong>は、地方政権の各章を学んだ後の教材で扱う。"],
    takeaway: "主要年号を、人物・王朝・都市の動きと結びつける。", note: "語呂ではなく、地図上の移動と出来事の順で振り返ります。"
  }),
];
