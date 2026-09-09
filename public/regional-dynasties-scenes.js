// 03〜06：03・04は原文本文のみ、05・06は既存の説明を保持（37場面）
// 原文 p.324〜332 の流れと固有名詞の対応は docs/regional-dynasties-correspondence.md を参照。

export const places = {
  khorasanMain: { name: "ホラーサーン", point: [59, 35.5] },
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
  "zones": [],
  "pins": [
    "iberia",
    "cordoba",
    "morocco"
  ],
  "routes": [
    {
      "points": [
        [
          10,
          36
        ],
        [
          -4,
          40
        ],
        [
          -4.78,
          37.89
        ]
      ],
      "kind": "move"
    }
  ],
  "tags": [],
  "facts": [
    "後ウマイヤ朝とイドリース朝"
  ],
  "actors": [
    {
      "name": "アブド＝アッラフマーン1世",
      "image": "abd-alrahman3",
      "at": "iberia",
      "bubble": "",
      "route": 0
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "western-survivors",
  "chapter": 0,
  "year": "イスラーム世界の分裂",
  "frame": [
    -12,
    27,
    15,
    44
  ],
  "title": "後ウマイヤ朝とイドリース朝",
  "kicker": "後ウマイヤ朝とイドリース朝",
  "mapHeading": "後ウマイヤ朝とイドリース朝",
  "focus": "後ウマイヤ朝とイドリース朝",
  "before": "後ウマイヤ朝とイドリース朝",
  "after": "後ウマイヤ朝とイドリース朝",
  "body": [
    "まずは西方の動向からだよ。アッバース朝に滅ぼされたウマイヤ朝の一族のうち、なんとか生き延びたアブド＝アッラフマーン1世はイベリア半島に逃れ、コルドバを都に後ウマイヤ朝を建てた。この王朝は当初カリフを名乗らず、地方の長官という意味のアミールを名乗った。これは、当時イスラーム教徒が「ウンマは一つで、そのウンマの指導者がカリフ」って考えていたからだ。同じころ、モロッコにもアリーの子孫がイドリース朝を建てたけど、こっちもカリフは名乗らなかった。"
  ],
  "takeaway": "後ウマイヤ朝とイドリース朝",
  "note": "原文 p.324 の本文。",
  "sourceText": {
    "page": 324
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "tunis"
  ],
  "routes": [],
  "tags": [],
  "facts": [
    "ファーティマ朝の成立"
  ],
  "actors": [
    {
      "name": "ファーティマ朝",
      "image": "fatimid-caliph",
      "at": "tunis",
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "fatimid-founding",
  "chapter": 0,
  "year": "イスラーム世界の分裂",
  "frame": [
    5,
    26,
    20,
    40
  ],
  "title": "ファーティマ朝の成立",
  "kicker": "ファーティマ朝の成立",
  "mapHeading": "ファーティマ朝の成立",
  "focus": "ファーティマ朝の成立",
  "before": "ファーティマ朝の成立",
  "after": "ファーティマ朝の成立",
  "body": [
    "でも、10世紀になると「シーア派の反撃」が始まった！　アッバース革命に協力したのに、建国後に弾圧されたシーア派のなかから「アッバース家はカリフ位を盗んだ！」と主張する過激なイスマーイール派が現れ、秘密運動でチュニジアのベルベル人の支持を集めてファーティマ朝を建てると、君主は「自分はムハンマドの娘ファーティマの子孫である」と主張し、アッバース朝の正統性を否定してカリフを名乗った。"
  ],
  "takeaway": "ファーティマ朝の成立",
  "note": "原文 p.325 の本文。",
  "sourceText": {
    "page": 325
  }
}),
  makeScene({
  "zones": [],
  "pins": [],
  "routes": [],
  "tags": [],
  "facts": [
    "３人のカリフの並立"
  ],
  "actors": [
    {
      "name": "アブド＝アッラフマーン3世",
      "image": "abd-alrahman3",
      "at": "cordoba",
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "three-caliphs",
  "chapter": 0,
  "year": "イスラーム世界の分裂",
  "frame": [
    -10,
    25,
    51,
    42
  ],
  "title": "３人のカリフの並立",
  "kicker": "３人のカリフの並立",
  "mapHeading": "３人のカリフの並立",
  "focus": "３人のカリフの並立",
  "before": "３人のカリフの並立",
  "after": "３人のカリフの並立",
  "body": [
    "すると、後ウマイヤ朝のアブド＝アッラフマーン3世も「バカを言うな！　私こそウマイヤ家のカリフだ！」と、カリフを名乗った。こうしてイスラーム世界には、3人のカリフが並び立ったんだ。"
  ],
  "takeaway": "３人のカリフの並立",
  "note": "原文 p.325 の本文。",
  "sourceText": {
    "page": 325
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "egypt",
    "cairo",
    "mediterranean",
    "redSea",
    "indianOcean"
  ],
  "routes": [
    {
      "points": [
        [
          20,
          35
        ],
        [
          31.24,
          30.04
        ],
        [
          37,
          20
        ],
        [
          62,
          5
        ]
      ],
      "kind": "trade"
    }
  ],
  "tags": [],
  "facts": [
    "カイロの建設と繁栄"
  ],
  "actors": [],
  "props": [
    {
      "name": "アズハル＝モスク",
      "image": "azhar-mosque",
      "at": "cairo",
      "kind": "prop",
      "size": 72
    }
  ],
  "duration": 2200,
  "id": "fatimid-cairo",
  "chapter": 0,
  "year": "イスラーム世界の分裂",
  "frame": [
    15,
    5,
    68,
    38
  ],
  "title": "カイロの建設と繁栄",
  "kicker": "カイロの建設と繁栄",
  "mapHeading": "カイロの建設と繁栄",
  "focus": "カイロの建設と繁栄",
  "before": "カイロの建設と繁栄",
  "after": "カイロの建設と繁栄",
  "body": [
    "その後、ファーティマ朝はエジプトを征服して首都カイロを建設し、地中海とインド洋を結ぶ紅海貿易を支配して繁栄した。また、首都カイロに建てられたアズハル＝モスクのなかに、イスラーム世界最古の大学（マドラサ）アズハル学院が設立された。この学院はファーティマ朝のもとではシーア派の学問の中心だけど、アイユーブ朝以降はスンナ派神学の中心になるよ。"
  ],
  "takeaway": "カイロの建設と繁栄",
  "note": "原文 p.325 の本文。",
  "sourceText": {
    "page": 325
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "eastIran",
    "baghdad",
    "centralAsia",
    "southIraq"
  ],
  "routes": [
    {
      "points": [
        [
          60,
          31
        ],
        [
          44.37,
          33.32
        ]
      ],
      "kind": "campaign"
    },
    {
      "points": [
        [
          68,
          40
        ],
        [
          60,
          31
        ]
      ],
      "kind": "campaign"
    }
  ],
  "tags": [],
  "facts": [
    "イラン人政権の自立と反乱"
  ],
  "actors": [],
  "props": [],
  "duration": 2200,
  "id": "iranian-independence",
  "chapter": 0,
  "year": "イスラーム世界の分裂",
  "frame": [
    39,
    24,
    72,
    43
  ],
  "title": "イラン人政権の自立と反乱",
  "kicker": "イラン人政権の自立と反乱",
  "mapHeading": "イラン人政権の自立と反乱",
  "focus": "イラン人政権の自立と反乱",
  "before": "イラン人政権の自立と反乱",
  "after": "イラン人政権の自立と反乱",
  "body": [
    "一方、東方でも自立の動きが進み、イラン人勢力を中心に次々と独立政権が現れて、アッバース朝は急速に衰退したよ。イラン東部では鍛冶職人だったヤークーブがイラン系最初のイスラーム王朝サッファール朝を建国し、バグダードを目指して西方に進出した。",
    "ただ、中央アジアから興った同じイラン系のサーマーン朝がサッファール朝を滅ぼし、中央アジアからイランの東部まで支配した。追い打ちをかけるように、南イラクでは黒人奴隷のザンジュの乱が起きて、国内はますます混乱したんだ。"
  ],
  "takeaway": "イラン人政権の自立と反乱",
  "note": "原文 p.326 の本文。",
  "sourceText": {
    "page": 326
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "caspian",
    "baghdad"
  ],
  "routes": [
    {
      "points": [
        [
          49,
          37
        ],
        [
          44.37,
          33.32
        ]
      ],
      "kind": "campaign"
    }
  ],
  "tags": [],
  "facts": [
    "ブワイフ朝がバグダードへ入る"
  ],
  "actors": [
    {
      "name": "ブワイフ朝",
      "image": "buyid-amir",
      "at": "caspian",
      "route": 0,
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "buyid-baghdad",
  "chapter": 0,
  "year": "イスラーム世界の分裂",
  "frame": [
    40,
    27,
    55,
    41
  ],
  "title": "ブワイフ朝がバグダードへ入る",
  "kicker": "ブワイフ朝がバグダードへ入る",
  "mapHeading": "ブワイフ朝がバグダードへ入る",
  "focus": "ブワイフ朝がバグダードへ入る",
  "before": "ブワイフ朝がバグダードへ入る",
  "after": "ブワイフ朝がバグダードへ入る",
  "body": [
    "そして、10世紀半ばにカスピ海南西から現れた軍人政権のブワイフ朝は、イラン人歩兵軍団に加えてトルコ人マムルークを率いてバグダードに入城し、カリフから大アミールに任じられた。"
  ],
  "takeaway": "ブワイフ朝がバグダードへ入る",
  "note": "原文 p.326 の本文。",
  "sourceText": {
    "page": 326
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "baghdad"
  ],
  "routes": [],
  "tags": [],
  "facts": [
    "イクター制の始まり"
  ],
  "actors": [
    {
      "name": "軍人",
      "image": "buyid-amir",
      "at": "baghdad",
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "buyid-iqta",
  "chapter": 0,
  "year": "イスラーム世界の分裂",
  "frame": [
    40,
    27,
    52,
    39
  ],
  "title": "イクター制の始まり",
  "kicker": "イクター制の始まり",
  "mapHeading": "イクター制の始まり",
  "focus": "イクター制の始まり",
  "before": "イクター制の始まり",
  "after": "イクター制の始まり",
  "body": [
    "ブワイフ朝がバグダードに入城したとき、兵士に俸給（アター）を支払おうとしたんだけど、アッバース朝は財政難だったからバグダードの金庫がすっからかんだ。そしたら軍人たちが暴動を起こすようになったから、土地の管理権と徴税権（イクター）を与えるイクター制を始めたんだ。この後のイスラーム王朝でも採用されるよ。ちなみにブワイフ朝はシーア派だから、東方でも「シーア派の反撃」が起きたってことだね。"
  ],
  "takeaway": "イクター制の始まり",
  "note": "原文 p.327 の本文。",
  "sourceText": {
    "page": 327
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "centralAsia",
    "oasis"
  ],
  "routes": [],
  "tags": [],
  "facts": [
    "トルコ人へのイスラーム教の広がり"
  ],
  "actors": [],
  "props": [],
  "duration": 2200,
  "id": "turkish-islamization",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    56,
    32,
    108,
    51
  ],
  "title": "トルコ人へのイスラーム教の広がり",
  "kicker": "トルコ人へのイスラーム教の広がり",
  "mapHeading": "トルコ人へのイスラーム教の広がり",
  "focus": "トルコ人へのイスラーム教の広がり",
  "before": "トルコ人へのイスラーム教の広がり",
  "after": "トルコ人へのイスラーム教の広がり",
  "body": [
    "中央アジアのサーマーン朝はマムルークを多数抱えていたから、宮廷内でトルコ人の力が強まった。同じころ、中央アジアのオアシス地帯のトルコ人のなかには、マムルークではなく独自にイスラーム教を受容する部族も現れ、ムスリム商人の活動とも結びついてイスラーム教が広がった（イスラーム化）。"
  ],
  "takeaway": "トルコ人へのイスラーム教の広がり",
  "note": "原文 p.327 の本文。",
  "sourceText": {
    "page": 327
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "centralAsia",
    "mongolia"
  ],
  "routes": [
    {
      "points": [
        [
          103,
          46
        ],
        [
          80,
          43
        ],
        [
          68,
          40
        ]
      ],
      "kind": "move"
    }
  ],
  "tags": [],
  "facts": [
    "カラ＝ハン朝と中央アジアの変化"
  ],
  "actors": [],
  "props": [],
  "duration": 2200,
  "id": "karakhanid-islamization",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    56,
    32,
    108,
    51
  ],
  "title": "カラ＝ハン朝と中央アジアの変化",
  "kicker": "カラ＝ハン朝と中央アジアの変化",
  "mapHeading": "カラ＝ハン朝と中央アジアの変化",
  "focus": "カラ＝ハン朝と中央アジアの変化",
  "before": "カラ＝ハン朝と中央アジアの変化",
  "after": "カラ＝ハン朝と中央アジアの変化",
  "body": [
    "こうしてトルコ人のイスラーム化が進み、10世紀半ばには、中央アジアで最初のトルコ系イスラーム王朝であるカラ＝ハン朝【カラハン朝】が現れた。この王朝は、モンゴル高原から移動してきたウイグル人の一部が建てたといわれているよ。そして、10世紀末にサーマーン朝を滅ぼすと、中央アジアのトルコ化（トルコ語を話すようになること）が一気に進んだ。だからこの地を「トルキスタン」と呼ぶようになるんだ。"
  ],
  "takeaway": "カラ＝ハン朝と中央アジアの変化",
  "note": "原文 p.327 の本文。",
  "sourceText": {
    "page": 327
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "afghanistan"
  ],
  "routes": [
    {
      "points": [
        [
          67,
          34
        ],
        [
          78,
          28
        ]
      ],
      "kind": "campaign"
    }
  ],
  "tags": [],
  "facts": [
    "ガズナ朝とインドへの進出"
  ],
  "actors": [
    {
      "name": "アルプテギン",
      "image": "aibak-sultan",
      "at": "afghanistan",
      "bubble": "",
      "route": 0
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "ghaznavid-alptegin",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    60,
    20,
    84,
    42
  ],
  "title": "ガズナ朝とインドへの進出",
  "kicker": "ガズナ朝とインドへの進出",
  "mapHeading": "ガズナ朝とインドへの進出",
  "focus": "ガズナ朝とインドへの進出",
  "before": "ガズナ朝とインドへの進出",
  "after": "ガズナ朝とインドへの進出",
  "body": [
    "アフガニスタンでもサーマーン朝のマムルークだったアルプテギンがガズナ朝を建国し、10世紀末からインド侵入を繰り返した。これが、インドがイスラーム化するきっかけだよ。こうして、中央アジアからアフガニスタンがトルコ系イスラーム王朝の支配下に入ったんだ。"
  ],
  "takeaway": "ガズナ朝とインドへの進出",
  "note": "原文 p.327 の本文。",
  "sourceText": {
    "page": 327
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "baghdad",
    "khorasanMain"
  ],
  "routes": [],
  "tags": [],
  "facts": [
    "セルジューク朝の成立とカリフの要請"
  ],
  "actors": [
    {
      "name": "トゥグリル＝ベク",
      "image": "tughril-beg",
      "at": "khorasan",
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "tughril-summoned",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    38,
    27,
    65,
    43
  ],
  "title": "セルジューク朝の成立とカリフの要請",
  "kicker": "セルジューク朝の成立とカリフの要請",
  "mapHeading": "セルジューク朝の成立とカリフの要請",
  "focus": "セルジューク朝の成立とカリフの要請",
  "before": "セルジューク朝の成立とカリフの要請",
  "after": "セルジューク朝の成立とカリフの要請",
  "body": [
    "トルコ人の地位を決定づけたのがセルジューク朝だよ。トゥグリル＝ベクがホラーサーンでセルジューク朝を建てた。そして、アッバース朝カリフに「いつでも支援する準備はできています」と伝えると、カリフは「ブワイフ朝はバグダードに居座っているから、すぐにバグダードに来るように」と支援を要請した。"
  ],
  "takeaway": "セルジューク朝の成立とカリフの要請",
  "note": "原文 p.327 の本文。",
  "sourceText": {
    "page": 327
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "baghdad"
  ],
  "routes": [],
  "tags": [],
  "facts": [
    "スルタンの称号と政治的な支配権"
  ],
  "actors": [
    {
      "name": "トゥグリル＝ベク",
      "image": "tughril-beg",
      "at": "baghdad",
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "sultan-sunni-restoration",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    39,
    27,
    53,
    41
  ],
  "title": "スルタンの称号と政治的な支配権",
  "kicker": "スルタンの称号と政治的な支配権",
  "mapHeading": "スルタンの称号と政治的な支配権",
  "focus": "スルタンの称号と政治的な支配権",
  "before": "スルタンの称号と政治的な支配権",
  "after": "スルタンの称号と政治的な支配権",
  "body": [
    "トゥグリル＝ベクはバグダードでブワイフ朝を追放し、アッバース朝カリフから正式にスルタン（支配者）の称号を受けたんだ。セルジューク朝はスンナ派だから、シーア派に対する「スンナ派の逆襲」だね！　これ以後、カリフの権威を背景にセルジューク朝が政治的な支配権を持つことになるよ。"
  ],
  "takeaway": "スルタンの称号と政治的な支配権",
  "note": "原文 p.328 の本文。",
  "sourceText": {
    "page": 328
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "manzikert",
    "anatolia",
    "westEurope"
  ],
  "routes": [
    {
      "points": [
        [
          46,
          38
        ],
        [
          42.54,
          39.14
        ]
      ],
      "kind": "campaign"
    },
    {
      "points": [
        [
          42.54,
          39.14
        ],
        [
          34,
          39
        ]
      ],
      "kind": "campaign"
    },
    {
      "points": [
        [
          34,
          39
        ],
        [
          3,
          47
        ]
      ],
      "kind": "move"
    }
  ],
  "tags": [],
  "facts": [
    "アナトリアへの拡大と十字軍遠征の背景"
  ],
  "actors": [],
  "props": [],
  "duration": 2200,
  "id": "manzikert-expansion",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    24,
    31,
    48,
    48
  ],
  "title": "アナトリアへの拡大と十字軍遠征の背景",
  "kicker": "アナトリアへの拡大と十字軍遠征の背景",
  "mapHeading": "アナトリアへの拡大と十字軍遠征の背景",
  "focus": "アナトリアへの拡大と十字軍遠征の背景",
  "before": "アナトリアへの拡大と十字軍遠征の背景",
  "after": "アナトリアへの拡大と十字軍遠征の背景",
  "body": [
    "その後もセルジューク朝は拡大を続け、マラーズギルドの戦いでビザンツ帝国を破ってアナトリア（小アジア）に侵攻し、トルコ化・イスラーム化を進めた。これに危機感を抱いたビザンツ帝国が西欧に援軍を頼んだことが、十字軍遠征の背景だね。"
  ],
  "takeaway": "アナトリアへの拡大と十字軍遠征の背景",
  "note": "原文 p.328 の本文。",
  "sourceText": {
    "page": 328
  }
}),
  makeScene({
  "zones": [],
  "pins": [],
  "routes": [],
  "tags": [],
  "facts": [
    "マリク＝シャー時代の統治"
  ],
  "actors": [
    {
      "name": "マリク＝シャー",
      "image": "tughril-beg",
      "at": [
        53,
        32
      ],
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "malik-administration",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    37,
    25,
    64,
    43
  ],
  "title": "マリク＝シャー時代の統治",
  "kicker": "マリク＝シャー時代の統治",
  "mapHeading": "マリク＝シャー時代の統治",
  "focus": "マリク＝シャー時代の統治",
  "before": "マリク＝シャー時代の統治",
  "after": "マリク＝シャー時代の統治",
  "body": [
    "セルジューク朝は11世紀後半のマリク＝シャー時代に全盛期を迎え、軍ではマムルークを採用し、官僚としてはイラン人を登用してペルシア語を公用語とするなど、統治機構を整備した。"
  ],
  "takeaway": "マリク＝シャー時代の統治",
  "note": "原文 p.328 の本文。",
  "sourceText": {
    "page": 328
  }
}),
  makeScene({
  "zones": [],
  "pins": [],
  "routes": [],
  "tags": [],
  "facts": [
    "ニザーム＝アルムルクの制度整備"
  ],
  "actors": [
    {
      "name": "ニザーム＝アルムルク",
      "image": "nizam-almulk",
      "at": "iran",
      "bubble": ""
    }
  ],
  "props": [],
  "duration": 2200,
  "id": "nizam-reforms",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    37,
    25,
    64,
    43
  ],
  "title": "ニザーム＝アルムルクの制度整備",
  "kicker": "ニザーム＝アルムルクの制度整備",
  "mapHeading": "ニザーム＝アルムルクの制度整備",
  "focus": "ニザーム＝アルムルクの制度整備",
  "before": "ニザーム＝アルムルクの制度整備",
  "after": "ニザーム＝アルムルクの制度整備",
  "body": [
    "この時代のイラン人宰相ニザーム＝アルムルクは、正しい君主のあり方を『統治の書』に著すと、領内の主要都市にニザーミーヤ学院（マドラサ）をつくって神学や法学の育成に努め、またブワイフ朝から受け継いだイクター制を発展させたよ。"
  ],
  "takeaway": "ニザーム＝アルムルクの制度整備",
  "note": "原文 p.328 の本文。",
  "sourceText": {
    "page": 328
  }
}),
  makeScene({
  "zones": [],
  "pins": [
    "anatolia",
    "iran",
    "afghanistan",
    "northIraq",
    "centralAsia"
  ],
  "routes": [],
  "tags": [],
  "facts": [
    "セルジューク朝の分裂"
  ],
  "actors": [],
  "props": [],
  "duration": 2200,
  "id": "seljuq-fragmentation",
  "chapter": 1,
  "year": "トルコ人の台頭",
  "frame": [
    27,
    26,
    71,
    45
  ],
  "title": "セルジューク朝の分裂",
  "kicker": "セルジューク朝の分裂",
  "mapHeading": "セルジューク朝の分裂",
  "focus": "セルジューク朝の分裂",
  "before": "セルジューク朝の分裂",
  "after": "セルジューク朝の分裂",
  "body": [
    "ただ、11世紀末には各地の軍団が分裂し、アナトリアのルーム＝セルジューク朝のほか、イラン・アフガニスタンを支配したホラズム＝シャー【ホラズム】朝、イラク北部の総督から自立したザンギー朝などができた。セルジューク朝が分裂したから、第1回十字軍に負けたんだね。さらに12世紀には中央アジアでも、カラ＝ハン朝がカラ＝キタイ【西遼】に滅ぼされた。"
  ],
  "takeaway": "セルジューク朝の分裂",
  "note": "原文 p.328 の本文。",
  "sourceText": {
    "page": 328
  }
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
];
