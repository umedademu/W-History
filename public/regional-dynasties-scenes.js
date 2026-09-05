// 03 分裂と地方政権の興亡（全20場面）
// 参考書 第20回「イスラーム世界の形成」（p.324〜p.332）の内容を網羅

export const places = {
  cordoba: { name: "コルドバ", point: [-4.78, 37.89] },
  granada: { name: "グラナダ", point: [-3.59, 37.18] },
  marrakech: { name: "マラケシュ", point: [-8.00, 31.63] },
  tunis: { name: "チュニス（カイラワーン）", point: [10.18, 36.80] },
  cairo: { name: "カイロ（エジプト）", point: [31.24, 30.04] },
  jerusalem: { name: "エルサレム", point: [35.21, 31.77] },
  damascus: { name: "ダマスクス", point: [36.29, 33.51] },
  baghdad: { name: "バグダード", point: [44.37, 33.32] },
  isfahan: { name: "イスファハーン", point: [51.68, 32.65] },
  tabriz: { name: "タブリーズ", point: [46.29, 38.08] },
  manzikert: { name: "マンジケルト", point: [42.54, 39.14] },
  bukhara: { name: "ブハラ", point: [64.42, 39.77] },
  samarkand: { name: "サマルカンド", point: [66.96, 39.65] },
  kashgar: { name: "カシュガル", point: [75.99, 39.47] },
  ghazna: { name: "ガズナ", point: [68.42, 33.55] },
  delhi: { name: "デリー", point: [77.21, 28.61] },
  mecca: { name: "メッカ", point: [39.83, 21.42] },
  timbuktu: { name: "トンブクトゥ", point: [-3.00, 16.77] },
  ainjalut: { name: "アイン・ジャールート", point: [35.38, 32.55] },
  malindi: { name: "マリンディ（スワヒリ沿岸）", point: [40.12, 13.00] },
};

export const zones = {
  cordoba_caliphate: { color: "#3d7a5a", points: [[-9, 36], [-2, 43], [3, 40], [-5, 36]] },
  fatimid_caliphate: { color: "#225544", points: [[8, 37], [20, 32], [35, 32], [38, 25], [30, 24], [10, 30]] },
  abbasid_realm: { color: "#2d3748", points: [[38, 37], [48, 38], [55, 34], [48, 30], [38, 30]] },
  seljuq_empire: { color: "#4a5568", points: [[30, 41], [45, 42], [65, 41], [70, 34], [55, 28], [40, 33]] },
  ilkhanate: { color: "#744210", points: [[40, 42], [50, 42], [65, 38], [62, 27], [48, 29], [40, 35]] },
  delhi_sultanate: { color: "#2b6cb0", points: [[70, 33], [80, 31], [82, 24], [72, 22], [68, 28]] },
  mali_empire: { color: "#b7791f", points: [[-10, 18], [2, 18], [0, 12], [-10, 12]] },
};

const point = p => typeof p === "string" ? places[p].point : p;
const route = (points, kind = "campaign", options = {}) => ({ points: points.map(point), kind, ...options });
const person = (name, image, at, options = {}) => ({ name, image, at, ...options });
const prop = (name, image, at, options = {}) => ({ name, image, at, kind: "prop", ...options });
const scene = s => ({ frame: [-12, 12, 82, 50], zones: [], pins: [], routes: [], tags: [], facts: [], actors: [], props: [], duration: 3400, ...s });

export const scenes = [
  // 章一：３カリフ並立と西方の自立
  scene({
    id: "cordoba-umayyad", chapter: 0, year: "756年", kicker: "イベリアのイスラーム政権",
    title: "アブド＝アッラフマーン1世が逃れ、\nコルドバに後ウマイヤ朝を開く。",
    body: [
      "750年、アッバース革命によってウマイヤ朝が滅亡した際、ウマイヤ家の若き王族<strong>アブド＝アッラフマーン1世</strong>は追手を逃れて北アフリカを横断し、イベリア半島へと渡った。",
      "756年、彼は<strong>コルドバ</strong>を都として「<strong>後ウマイヤ朝</strong>」を建国。シリアの進んだ農業技術や学術を導入し、コルドバ大モスク（メスキータ）の造営を始めた。"
    ],
    takeaway: "756年・後ウマイヤ朝成立。アブド＝アッラフマーン1世が都コルドバで自立。",
    note: "過酷な逃避行を生き抜いた彼は「クライシュ族の鷹」と呼ばれました。キリスト教徒やユダヤ教徒とも共存（コンビベンシア）しました。",
    focus: "後ウマイヤ朝の成立", mapHeading: "イベリア半島の後ウマイヤ朝",
    before: "ダマスクスから北アフリカを経てイベリアへ", after: "コルドバが西方のイスラーム文化の中心地に",
    zones: ["cordoba_caliphate"], pins: ["cordoba", "baghdad"], capital: "cordoba",
    routes: [route(["baghdad", "tunis", "cordoba"], "move")],
    facts: ["建国者：アブド＝アッラフマーン1世", "都：コルドバ", "名建築：メスキータ（大モスク）"],
    actors: [
      person("アブド＝アッラフマーン1世", "abd-alrahman3", "cordoba", { offset: [0, 0], bubble: "コルドバに新王朝を開く！" })
    ]
  }),

  scene({
    id: "fatimid-cairo", chapter: 0, year: "909年〜969年", kicker: "シーア派の台頭と新都",
    title: "ファーティマ朝が興り、\nエジプトにカイロを建設する。",
    body: [
      "10世紀初頭、北アフリカのチュニジアでシーア派（イスマーイール派）の<strong>ファーティマ朝</strong>が建国。預言者ムハンマドの娘ファーティマの子孫を称し、最初から「カリフ」を宣言した。",
      "969年、豊かな穀倉地帯エジプトを征服。新都<strong>カイロ（アル＝カーヒラ＝勝利の都）</strong>を造営し、シーア派教学の総本山として<strong>アズハル学院</strong>を創設した。"
    ],
    takeaway: "ファーティマ朝がカリフを称し、969年にカイロ遷都・アズハル学院創設。",
    note: "語呂合わせ：「暮れ行く（909）北アフリカにファーティマ」「苦労旧（969）都を捨てカイロへ」。アズハル学院は現在も続く世界最古の大学の一つです。",
    focus: "カイロ建設とアズハル学院", mapHeading: "ファーティマ朝のエジプト征服",
    before: "チュニジアからエジプトへ進出", after: "新都カイロが東地中海随一の大都市へ",
    zones: ["fatimid_caliphate"], pins: ["tunis", "cairo", "mecca"], capital: "cairo",
    routes: [route(["tunis", "cairo"], "campaign")],
    facts: ["宗派：シーア派イスマーイール派", "都：カイロ（969年）", "学府：アズハル学院"],
    actors: [
      person("ファーティマ朝カリフ", "fatimid-caliph", "cairo", { offset: [-20, 0], bubble: "余こそ真のカリフである！" })
    ],
    props: [
      prop("アズハル学院", "azhar-mosque", "cairo", { offset: [35, 0] })
    ]
  }),

  scene({
    id: "three-caliphs", chapter: 0, year: "929年", kicker: "イスラーム世界の多元化",
    title: "アブド＝アッラフマーン3世がカリフを称し、\n３カリフが並立する。",
    body: [
      "ファーティマ朝の伸長に対抗して929年、後ウマイヤ朝第8代君主<strong>アブド＝アッラフマーン3世</strong>も自ら「カリフ」を名乗った。",
      "これにより、バグダードの<strong>アッバース朝</strong>、カイロの<strong>ファーティマ朝</strong>、コルドバの<strong>後ウマイヤ朝</strong>の3人のカリフが同時に並立する「<strong>３カリフ並立時代</strong>」が到来した。世界は多元的な共生圏へと発展した。"
    ],
    takeaway: "929年・３カリフ並立（バグダード・カイロ・コルドバ）。政治的多元化の定着。",
    note: "アブド＝アッラフマーン3世は後ウマイヤ朝の最盛期を現出し、首都コルドバは人口50万を数える大都会となりました。",
    focus: "３人のカリフの並立", mapHeading: "コルドバ・カイロ・バグダードの３極体制",
    before: "単一のカリフ理念から多極並立へ", after: "地中海を挟んで3つのカリフ国家が覇を競う",
    zones: ["cordoba_caliphate", "fatimid_caliphate", "abbasid_realm"],
    pins: ["cordoba", "cairo", "baghdad"],
    tags: [
      { at: [-4.78, 40.5], text: "後ウマイヤ朝（スンナ派カリフ）" },
      { at: [28, 27], text: "ファーティマ朝（シーア派カリフ）" },
      { at: [46, 36], text: "アッバース朝（スンナ派カリフ）" }
    ],
    facts: ["西方カリフ：コルドバ", "中央カリフ：カイロ", "東方カリフ：バグダード"],
    actors: [
      person("アブド＝アッラフマーン3世", "abd-alrahman3", "cordoba", { offset: [0, 0], bubble: "西のカリフは余である！" })
    ]
  }),

  scene({
    id: "berber-dynasties", chapter: 0, year: "1056年〜1269年", kicker: "サハラからイベリアへ",
    title: "ベルベル人のムラービト朝・ムワッヒド朝が\n北アフリカとイベリアを統合する。",
    body: [
      "11世紀中頃、サハラ砂漠の遊牧ベルベル人の中から<strong>ムラービト朝</strong>が興り、都マラケシュを建設。南のガーナ王国を圧迫するとともにイベリア半島へ渡り、レコンキスタ（国土回復運動）に対峙した。",
      "12世紀には同じくベルベル人の一神教運動から<strong>ムワッヒド朝</strong>が興ってムラービト朝を倒し、北アフリカとイベリア南部を強固に統合した。"
    ],
    takeaway: "サハラから興ったベルベル人のムラービト朝・ムワッヒド朝が西方を席巻した。",
    note: "ムワッヒド朝の宮廷では大哲学者イブン＝ルシュド（アヴェロエス）が活躍し、アリストテレス哲学を注釈しました。",
    focus: "ベルベル人王朝の台頭", mapHeading: "マラケシュからイベリアへの進出",
    before: "サハラ遊牧民の宗教改革運動", after: "北アフリカとイベリアを結ぶベルベル一大帝国",
    zones: ["cordoba_caliphate"], pins: ["marrakech", "cordoba", "timbuktu"], capital: "marrakech",
    routes: [route(["marrakech", "cordoba"], "campaign")],
    facts: ["勢力：ベルベル人", "王朝：ムラービト朝→ムワッヒド朝", "都：マラケシュ"],
    actors: [
      person("ベルベル隊商", "sahara-caravan", "marrakech", { offset: [0, 0], bubble: "砂漠を越えて進軍だ！" })
    ]
  }),

  scene({
    id: "saladin-jerusalem", chapter: 0, year: "1169年〜1187年", kicker: "十字軍撃退と聖地奪還",
    title: "英雄サラディンがアイユーブ朝を開き、\nエルサレムを十字軍から奪還する。",
    body: [
      "クルド人の武将<strong>サラディン（サラーフ＝アッディーン）</strong>はエジプトのファーティマ朝を倒して<strong>アイユーブ朝</strong>（1169年）を創始し、スンナ派信仰を復活させた。",
      "エジプトとシリアを統合した彼は1187年、<strong>ヒッティーンの戦い</strong>で十字軍を撃破し、聖地<strong>エルサレム</strong>を88年ぶりに奪還。第3回十字軍（英王リチャード1世ら）とも堂々と渡り合い、巡礼の安全を保障した。"
    ],
    takeaway: "1187年・サラディンがエルサレム奪還。アイユーブ朝でスンナ派を復興。",
    note: "語呂合わせ：「人々離れる（1187）十字軍から聖地奪還」。エルサレム入城時に虐殺を行わず、寛容な騎士道精神で西欧からも称賛されました。",
    focus: "サラディンの聖地奪還", mapHeading: "アイユーブ朝のエルサレム奪還",
    before: "十字軍によるエルサレム占領", after: "サラディンが聖地を解放し平和共存へ",
    zones: ["fatimid_caliphate"], pins: ["cairo", "damascus", "jerusalem"], capital: "cairo",
    routes: [route(["cairo", "damascus", "jerusalem"], "campaign")],
    facts: ["創始者：サラディン（クルド人）", "決戦：ヒッティーンの戦い（1187）", "相手：第3回十字軍"],
    actors: [
      person("サラディン", "saladin", "jerusalem", { offset: [-25, 0], bubble: "エルサレムを取り戻した！" }),
      person("十字軍騎士", "crusader-knight", "jerusalem", { offset: [25, 0], bubble: "サラディンは名将だ…" })
    ]
  }),

  scene({
    id: "baibars-mamluk", chapter: 0, year: "1250年〜1260年", kicker: "軍人奴隷の帝国",
    title: "マムルーク朝のバイバルスが\nモンゴル軍を破り、カリフを保護する。",
    body: [
      "1250年、トルコ系軍人奴隷（マムルーク）が実権を握り、カイロに<strong>マムルーク朝</strong>を開いた。",
      "第5代スルタン・<strong>バイバルス</strong>は1260年、<strong>アイン・ジャールートの戦い</strong>で破竹の勢いだったモンゴル軍を撃退し、シリア・エジプトを守り抜いた。さらに滅亡したアッバース朝の末裔をカイロに迎え入れてカリフに擁立し、スンナ派世界の正統性を手に入れた。"
    ],
    takeaway: "1260年・アイン・ジャールートの戦い。バイバルスがモンゴルを撃破しカイロでカリフ擁立。",
    note: "香辛料貿易を担う「カーリミー商人」の活躍で都カイロは大繁栄。1291年にはアッコンを陥落させ、十字軍を完全に終焉させました。",
    focus: "モンゴル撃退とカリフ保護", mapHeading: "アイン・ジャールートの戦い",
    before: "モンゴルの西征軍がシリアへ迫る", after: "マムルーク朝がモンゴルを阻止しスンナ派盟主に",
    zones: ["fatimid_caliphate"], pins: ["cairo", "ainjalut", "damascus"], capital: "cairo",
    routes: [route(["cairo", "ainjalut"], "campaign")],
    facts: ["名君：バイバルス", "激戦：アイン・ジャールート（1260）", "交易：カーリミー商人"],
    actors: [
      person("バイバルス", "baibars", "ainjalut", { offset: [-20, 0], bubble: "モンゴル軍を押し返すぞ！" }),
      person("カーリミー商人", "karimi-merchant", "cairo", { offset: [25, 0], bubble: "香辛料貿易は大繁盛！" })
    ]
  }),

  scene({
    id: "nasrid-alhambra", chapter: 0, year: "1232年〜1492年", kicker: "イベリア最後の落日",
    title: "ナスル朝がグラナダにアルハンブラ宮殿を築き、\n1492年にレコンキスタが完了する。",
    body: [
      "レコンキスタによってイスラーム都市が次々に奪われる中、イベリア半島南端の山岳地帯に<strong>ナスル朝（グラナダ王国）</strong>が踏みとどまった。",
      "首都グラナダに築かれた<strong>アルハンブラ宮殿</strong>は、精緻なアラベスクや中庭の噴水が調和するイスラーム建築の極美を残した。しかし1492年、スペイン王国に降伏して滅亡。約800年にわたるイベリア半島のイスラーム統治は幕を閉じた。"
    ],
    takeaway: "1492年・グラナダ陥落でナスル朝滅亡。アルハンブラ宮殿を残しレコンキスタ完了。",
    note: "語呂合わせ：「意欲に（1492）燃えるコロンブスとグラナダ陥落」。1492年はコロンブスの新大陸到達と同年の大事件です。",
    focus: "ナスル朝の滅亡", mapHeading: "グラナダ陥落とレコンキスタ完了",
    before: "イベリア半島最後の砦グラナダ", after: "スペイン王国が統一しレコンキスタ完了",
    zones: ["cordoba_caliphate"], pins: ["granada", "cordoba"], capital: "granada",
    facts: ["最後の都：グラナダ", "名建築：アルハンブラ宮殿", "滅亡年：1492年"],
    actors: [
      person("アルハンブラ宮殿", "alhambra-palace", "granada", { offset: [0, 0], bubble: "美しきグラナダの落日…" })
    ]
  }),

  // 章二：東方のトルコ化とセルジューク朝
  scene({
    id: "samanid-renaissance", chapter: 1, year: "875年〜999年", kicker: "東方のペルシア復興",
    title: "サーマーン朝がブハラを都に栄え、\n近世ペルシア文学が花開く。",
    body: [
      "9世紀後半、中央アジアのソグディアナからイラン東部にかけて、イラン系の<strong>サーマーン朝</strong>が自立した。首都<strong>ブハラ</strong>やサマルカンドはシルクロード交易で空前の繁栄を極めた。",
      "スンナ派を信奉しつつ、アラビア文字による近世ペルシア語文学を大いに奨励。大詩人ルーダキーや医学の巨人イブン＝スィーナーらが育ち、「ペルシア・ルネサンス」が開花した。"
    ],
    takeaway: "サーマーン朝がブハラで栄え、近世ペルシア文学と中央アジア学術の黄金期を築いた。",
    note: "中央アジア最初の本格的イスラーム王朝。レンガを精緻に積み上げた「イスマーイール＝サーマーニー廟」は初期イスラーム建築の傑作です。",
    focus: "サーマーン朝とブハラ", mapHeading: "中央アジアのサーマーン朝",
    before: "アッバース朝の地方分権化", after: "ブハラが東方イスラーム学術の最高峰に",
    zones: ["abbasid_realm"], pins: ["bukhara", "samarkand", "baghdad"], capital: "bukhara",
    routes: [route(["baghdad", "bukhara"], "trade")],
    facts: ["都：ブハラ", "民族：イラン系", "文化：ペルシア文学復興"],
    actors: [
      person("ペルシア宮廷人", "buyid-amir", "bukhara", { offset: [0, 0], bubble: "ペルシアの詩と知恵を称えよ！" })
    ]
  }),

  scene({
    id: "buyid-iqta-system", chapter: 1, year: "945年〜946年", kicker: "大アミールと土地制度",
    title: "ブワイフ朝がバグダードに入城し、\n大アミールとなってイクター制を始める。",
    body: [
      "10世紀半ば、イラン系のシーア派（十二イマーム派）軍閥<strong>ブワイフ朝</strong>が台頭。946年、アッバース朝の首都バグダードに入城し、軍事支配を確立した。",
      "カリフから軍事・行政の全権を握る「<strong>大アミール</strong>」に任じられ、カリフは宗教的権威のみの存在に形骸化した。さらに財政破綻した国家は、軍人への現金給与（アター）に代えて土地の徴税権を与える「<strong>イクター制</strong>」を創始した。"
    ],
    takeaway: "ブワイフ朝が大アミールとしてバグダードを掌握し、徴税権を与えるイクター制を導入。",
    note: "イクター制は中世イスラーム社会の根幹制度となり、のちのセルジューク朝やオスマン帝国のティマール制へ引き継がれました。",
    focus: "ブワイフ朝とイクター制", mapHeading: "ブワイフ朝のバグダード制圧",
    before: "アッバース朝カリフの権威低下", after: "シーア派軍閥が政治実権を握りイクター制導入",
    zones: ["abbasid_realm"], pins: ["baghdad", "isfahan"], capital: "baghdad",
    routes: [route(["isfahan", "baghdad"], "campaign")],
    facts: ["称号：大アミール", "宗派：シーア派十二イマーム派", "制度：イクター制導入"],
    actors: [
      person("ブワイフ朝大アミール", "buyid-amir", "baghdad", { offset: [0, 0], bubble: "実権は大アミールが握る！" })
    ]
  }),

  scene({
    id: "qarakhanid-islam", chapter: 1, year: "10世紀中頃", kicker: "トルコ民族の回心",
    title: "カラ＝ハン朝がトルコ系として\n初めて集団でイスラーム教に改宗する。",
    body: [
      "10世紀中頃、天山山脈南北のトルキスタンで、トルコ系遊牧民が<strong>カラ＝ハン朝</strong>を打ち立てた。",
      "彼らは「<strong>トルコ系民族として歴史上初めて集団でイスラーム教を受容</strong>」した。999年にはガズナ朝と挟撃してサーマーン朝を滅ぼし、中央アジアの言語・文化をトルコ化・イスラーム化させる決定打となった。"
    ],
    takeaway: "カラ＝ハン朝がトルコ民族初のイスラーム改宗を遂げ、中央アジアのトルコ化を決定づけた。",
    note: "最古のトルコ語イスラーム文学『クタドゥグ・ビリグ（幸福をもたらす知恵）』が著され、トルコ系イスラーム文明の礎となりました。",
    focus: "トルコ民族のイスラーム化", mapHeading: "カラ＝ハン朝の版図",
    before: "遊牧トルコ社会の固有信仰", after: "中央アジア全域の急速なイスラーム化",
    zones: ["seljuq_empire"], pins: ["kashgar", "bukhara", "samarkand"], capital: "kashgar",
    routes: [route(["kashgar", "samarkand"], "campaign")],
    facts: ["民族：トルコ系遊牧民", "意義：トルコ民族初の集団改宗", "滅亡させた国：サーマーン朝"],
    actors: [
      person("トルコ戦士", "tughril-beg", "kashgar", { offset: [0, 0], bubble: "我らトルコ人もアッラーに従う！" })
    ]
  }),

  scene({
    id: "ghaznavid-raids", chapter: 1, year: "977年〜1030年", kicker: "北インドへの進出",
    title: "ガズナ朝のマフムードが\n北インドへ17回の遠征を繰り返す。",
    body: [
      "アフガニスタンのガズナでトルコ系マムルーク出身者が開いた<strong>ガズナ朝</strong>は、強力な騎兵を誇った。",
      "第6代<strong>マフムード</strong>は北インドへ17回におよぶ親征を敢行。ヒンドゥー寺院ソームナートなどを急襲して莫大な富を持ち去り、インド亜大陸へイスラーム勢力が進出する口火を切った。宮廷には万能の知性ビールーニー（『インド誌』著者）が集まった。"
    ],
    takeaway: "ガズナ朝マフムードの17回に及ぶ北インド遠征が、インドのイスラーム化の契機となった。",
    note: "ビールーニーは遠征に同行してサンスクリット語を習得し、インドの哲学・天文・社会を客観的に記録した『インド誌』を残しました。",
    focus: "ガズナ朝のインド遠征", mapHeading: "ガズナから北インドへの遠征路",
    before: "アフガニスタンの軍事拠点ガズナ", after: "北インドにイスラームの橋頭堡を築く",
    zones: ["seljuq_empire"], pins: ["ghazna", "delhi"], capital: "ghazna",
    routes: [route(["ghazna", "delhi"], "campaign")],
    facts: ["君主：マフムード", "遠征：北インドへ17回", "学者：ビールーニー（『インド誌』）"],
    actors: [
      person("ガズナ朝マフムード", "aibak-sultan", "ghazna", { offset: [0, 0], bubble: "北インドへ進軍せよ！" })
    ]
  }),

  scene({
    id: "seljuq-sultanate", chapter: 1, year: "1038年〜1055年", kicker: "大セルジューク朝の覇権",
    title: "トゥグリル＝ベクがバグダードに入城し、\nカリフから「スルタン」の称号を得る。",
    body: [
      "トルコ系遊牧民オグズを率いる<strong>トゥグリル＝ベク</strong>はイランへ進出し、<strong>セルジューク朝</strong>（1038年）を樹立した。",
      "1055年、アッバース朝カリフの要請を受けてバグダードに入城し、シーア派のブワイフ朝を追放。感謝したカリフから、政治・軍事支配権を公認する「<strong>スルタン（支配者）</strong>」の称号を正式に授与された。スンナ派の宗教的権威（カリフ）と世俗の政治実権（スルタン）の分業が完成した。"
    ],
    takeaway: "1055年・トゥグリル＝ベクがバグダード入城、カリフからスルタンの称号を授与。",
    note: "語呂合わせ：「入れココ（1055）へ！スルタン称号」。これ以後、イスラーム世界の最高実力者は「スルタン」と呼ばれるようになります。",
    focus: "スルタン称号の誕生", mapHeading: "セルジューク朝のバグダード入城",
    before: "ブワイフ朝によるカリフの抑圧", after: "トルコ系セルジューク朝がスンナ派世界を領導",
    zones: ["seljuq_empire"], pins: ["baghdad", "isfahan"], capital: "isfahan",
    routes: [route(["isfahan", "baghdad"], "campaign")],
    facts: ["建国者：トゥグリル＝ベク", "年号：1055年バグダード入城", "称号：スルタン（支配者）"],
    actors: [
      person("トゥグリル＝ベク", "tughril-beg", "baghdad", { offset: [0, 0], bubble: "カリフを守護し、スルタンとなった！" })
    ]
  }),

  scene({
    id: "manzikert-victory", chapter: 1, year: "1071年", kicker: "小アジアへの突破口",
    title: "マンジケルトの戦いでビザンツ軍を撃破、\nアナトリア進出と十字軍を誘発する。",
    body: [
      "セルジューク朝第2代アルプ＝アルスラーンは1071年、東部アナトリアの<strong>マンジケルト（マラーズギルド）の戦い</strong>でビザンツ帝国親征軍を包囲・壊滅させ、皇帝ロマノス4世を捕虜とした。",
      "これによりビザンツの防衛線は崩壊し、トルコ系遊牧民が小アジア（アナトリア）へ雪崩れ込んだ（ルーム＝セルジューク朝）。恐慌をきたしたビザンツ皇帝が西欧教皇に救援を要請したことが、<strong>十字軍</strong>の直接の契機となった。"
    ],
    takeaway: "1071年・マンジケルトの戦いでビザンツを破りアナトリアへ進出、十字軍を誘発。",
    note: "語呂合わせ：「入れない（1071）アナトリアへ進出だ」。今日トルコ人がアナトリア半島に暮らす歴史の原点です。",
    focus: "マンジケルトの戦い", mapHeading: "セルジューク朝のアナトリア進出",
    before: "ビザンツ帝国が小アジアを防衛", after: "小アジアがトルコ化し十字軍運動が勃発",
    zones: ["seljuq_empire"], pins: ["manzikert", "baghdad"],
    routes: [route(["baghdad", "manzikert"], "campaign")],
    facts: ["君主：アルプ＝アルスラーン", "激戦：マンジケルト（1071）", "影響：十字軍運動の引き金"],
    actors: [
      person("十字軍騎士", "crusader-knight", "manzikert", { offset: [0, 0], bubble: "ビザンツ皇帝が捕虜になった！" })
    ]
  }),

  scene({
    id: "nizam-institutions", chapter: 1, year: "1070年代〜1092年", kicker: "統治と教育の完成者",
    title: "名宰相ニザーム＝アルムルクが\nイクター制を法制化しニザーミーヤ学院を創設。",
    body: [
      "セルジューク朝の黄金期を支えたイラン人名宰相<strong>ニザーム＝アルムルク</strong>は、イクター制を法制度として完成させ、過酷な収奪を防ぎつつ全国の軍事財政を安定させた。",
      "さらに台頭するシーア派に対抗するため、バグダードやニーシャープールに官立の高等教育機関「<strong>ニザーミーヤ学院</strong>」を創設。大思想家ガザーリーを教授に迎えてスンナ派神学を体系化し、著書『統治の書』で国家論を説いた。"
    ],
    takeaway: "ニザーム＝アルムルクがイクター制を法制化し、ニザーミーヤ学院でスンナ派神学を確立。",
    note: "ガザーリーはイスラーム神学と神秘主義（スーフィズム）を統合し、正統信仰の深まりをもたらしました。ニザーム自身は暗殺教団に倒れました。",
    focus: "ニザーム＝アルムルクの諸改革", mapHeading: "ニザーミーヤ学院ネットワーク",
    before: "軍人による恣意的な土地支配", after: "法制化されたイクター制と官立学術網の整備",
    zones: ["seljuq_empire"], pins: ["baghdad", "isfahan"], capital: "isfahan",
    facts: ["名宰相：ニザーム＝アルムルク", "学府：ニザーミーヤ学院", "著書：『統治の書』"],
    actors: [
      person("ニザーム＝アルムルク", "nizam-almulk", "baghdad", { offset: [0, 0], bubble: "法と学問こそ帝国の礎なり。" })
    ]
  }),

  // 章三：モンゴルの激震とインド・アフリカ
  scene({
    id: "delhi-slave-dynasty", chapter: 2, year: "1206年", kicker: "インドのイスラーム政権",
    title: "アイバクが奴隷朝を開き、\n300年続くデリー＝スルタン朝が始まる。",
    body: [
      "ゴール朝の軍司令官であったトルコ系マムルーク（奴隷出身）の<strong>アイバク（クトゥブッディーン＝アイバク）</strong>は、1206年にデリーで自立し「<strong>奴隷朝</strong>」を創始した。",
      "これが以後5王朝（奴隷、ハルジー、トゥグルク、サイイド、ロディー）が継承する「<strong>デリー＝スルタン朝</strong>」の幕開けとなった。アイバクは勝利を記念して高さ約72.5mの赤砂岩の尖塔「クトゥブ＝ミナール」を着工した。"
    ],
    takeaway: "1206年・奴隷朝成立。アイバクがデリーでデリー＝スルタン朝を開いた。",
    note: "語呂合わせ：「胃にオウム（1206）鳴く奴隷朝」。ヒンドゥー社会とイスラームの融合が始まり、後のシク教やウルドゥー語誕生につながります。",
    focus: "奴隷朝とクトゥブ＝ミナール", mapHeading: "デリー＝スルタン朝の誕生",
    before: "アフガン勢力の北インド征服", after: "デリーを都とするイスラーム王朝の定着",
    zones: ["delhi_sultanate"], pins: ["delhi", "ghazna"], capital: "delhi",
    routes: [route(["ghazna", "delhi"], "campaign")],
    facts: ["創始者：アイバク（マムルーク出身）", "王朝：奴隷朝（デリー＝スルタン朝第1）", "名塔：クトゥブ＝ミナール"],
    actors: [
      person("アイバク", "aibak-sultan", "delhi", { offset: [-25, 0], bubble: "デリーに奴隷朝を開く！" }),
      person("クトゥブ＝ミナール", "qutb-minar", "delhi", { offset: [25, 0], bubble: "聳える大尖塔！" })
    ]
  }),

  scene({
    id: "hulagu-mongol-fall", chapter: 2, year: "1258年", kicker: "アッバース朝の滅亡",
    title: "モンゴルのフラグがバグダードを攻略、\nアッバース朝が滅亡しイル＝ハン国が立つ。",
    body: [
      "モンゴル帝国皇帝モンケの命を受けた弟<strong>フラグ</strong>は西アジア親征を開始。暗殺教団のアラムート城砦を落とし、1258年にアッバース朝の都バグダードを完全包囲した。",
      "フラグ軍は帝都を蹂躙して最後のカリフを処刑し、500年続いたアッバース朝は完全に滅亡した。フラグはイランに<strong>イル＝ハン国</strong>を建て、タブリーズを都とした。知恵の館の書物はティグリス川に投棄されたと伝えられる。"
    ],
    takeaway: "1258年・フラグがバグダードを陥落させアッバース朝滅亡。イル＝ハン国建国。",
    note: "語呂合わせ：「胃に恐怖（1258）走るモンゴル襲来」。カリフを長とする初期イスラームの政治枠組みが完全に終焉を迎えました。",
    focus: "バグダード陥落とイル＝ハン国", mapHeading: "フラグの西征と帝都壊滅",
    before: "500年間続いたアッバース朝の首都バグダード", after: "帝都壊滅、モンゴル系イル＝ハン国の誕生",
    zones: ["ilkhanate"], pins: ["baghdad", "tabriz"], capital: "tabriz",
    routes: [route(["samarkand", "tabriz", "baghdad"], "campaign")],
    facts: ["征服者：フラグ（モンゴル）", "年号：1258年アッバース朝滅亡", "国家：イル＝ハン国（都タブリーズ）"],
    actors: [
      person("フラグ・ハン", "hulagu-khan", "baghdad", { offset: [0, 0], bubble: "バグダードを完全制圧した！" })
    ]
  }),

  scene({
    id: "ghazan-rashid-history", chapter: 2, year: "1295年", kicker: "モンゴルのイスラーム化",
    title: "ガザン＝ハンがイスラームを国教化し、\nラシード＝アッディーンが『集史』を編纂する。",
    body: [
      "イル＝ハン国第7代君主<strong>ガザン＝ハン</strong>は1295年の即位に際してイスラーム教に改宗し、これを国教と定めた。遊牧支配層が多数派被支配者の文化へ同化した。",
      "ユダヤ系改宗者の知性<strong>ラシード＝アッディーン</strong>を宰相に登用して財政改革を推進。さらにモンゴル史から中国・インド・西欧史まで網羅した、世界初の本格的世界史『<strong>集史</strong>』の編纂を完成させた。"
    ],
    takeaway: "ガザン＝ハンがイスラームを国教化、ラシード＝アッディーンが『集史』を編纂。",
    note: "『集史』の写本には中国絵画の技法を取り入れたイラン細密画（ミニアチュール）が描かれ、東西文明融合の極致を示しました。",
    focus: "イル＝ハン国のイスラーム化", mapHeading: "タブリーズのイル＝ハン国宮廷",
    before: "異教の遊牧政権イル＝ハン国", after: "イスラーム王朝へ同化し世界史書『集史』完成",
    zones: ["ilkhanate"], pins: ["tabriz", "baghdad", "isfahan"], capital: "tabriz",
    facts: ["君主：ガザン＝ハン（改宗）", "宰相：ラシード＝アッディーン", "名著：『集史』（世界初の本格的世界史）"],
    actors: [
      person("ガザン＝ハン", "hulagu-khan", "tabriz", { offset: [0, 0], bubble: "イスラームこそ我が国の国教なり。" })
    ]
  }),

  scene({
    id: "mansa-musa-pilgrimage", chapter: 2, year: "1324年", kicker: "黄金のアフリカ帝国",
    title: "マリ王国のマンサ＝ムーサが巡礼を行い、\nカイロの金相場を大暴落させる。",
    body: [
      "西アフリカでは、サハラの岩塩と南方の黄金を交換するサハラ縦断貿易によって<strong>マリ王国</strong>が空前の繁栄を誇っていた。学術都市トンブクトゥには大学が立ち並んだ。",
      "1324年、熱心なムスリムの国王<strong>マンサ＝ムーサ（カンカン＝ムーサ）</strong>は大量の従者と数トンの黄金を携えてメッカ巡礼へ出発。途中のカイロで惜しみなく黄金をばら撒いたため、カイロの金相場が10年以上も暴落し、ヨーロッパの地図にも「黄金王」として描かれた。"
    ],
    takeaway: "1324年・マンサ＝ムーサのメッカ巡礼。マリ王国の黄金がカイロの相場を暴落させた。",
    note: "トンブクトゥのサンコーレ・モスクには世界中から法学者や天文学者が集まりました。のちマリ王国はソンガイ王国へと交代します。",
    focus: "マンサ＝ムーサのメッカ巡礼", mapHeading: "サハラ縦断黄金巡礼路",
    before: "サハラ南西の黄金帝国マリ", after: "マンサ＝ムーサの巡礼で世界に黄金王の名が轟く",
    zones: ["mali_empire"], pins: ["timbuktu", "cairo", "mecca"], capital: "timbuktu",
    routes: [route(["timbuktu", "cairo", "mecca"], "trade")],
    facts: ["国：マリ王国", "国王：マンサ＝ムーサ", "事件：1324年カイロ金相場暴落"],
    actors: [
      person("マンサ＝ムーサ", "mansa-musa", "timbuktu", { offset: [0, 0], bubble: "聖地メッカへ黄金を捧げよう！" })
    ]
  }),

  scene({
    id: "swahili-monsoon", chapter: 2, year: "14世紀", kicker: "インド洋のネットワーク",
    title: "スワヒリ都市文明が栄え、\nモンスーンに乗ってインド洋を結ぶ。",
    body: [
      "東アフリカ沿岸では、季節風（モンスーン）に乗った木造帆船ダウ船がインド洋を行き交い、<strong>マリンディ</strong>や<strong>キルワ</strong>などの港湾都市が繁栄した。",
      "来航したアラブ・ペルシア商人と現地のバントゥー系諸民族が混淆し、バントゥー語にアラビア語が融合した共通語「<strong>スワヒリ語</strong>」と独自の<strong>スワヒリ文明</strong>が誕生した。金・象牙が輸出され、中国の陶磁器やインドの綿布が輸入された。"
    ],
    takeaway: "東アフリカ沿岸でマリンディやキルワなどスワヒリ都市が栄え、インド洋交易で結ばれた。",
    note: "大旅行家イブン＝バットゥータもキルワを訪れてその美しさを絶賛。15世紀には中国・明朝の鄭和艦隊もマリンディに来航しました。",
    focus: "スワヒリ都市と海の道", mapHeading: "インド洋モンスーン交易路",
    before: "季節風を利用した古くからの沿岸通商", after: "アラビア語と融合したスワヒリ文化が定着",
    pins: ["malindi", "cairo", "mecca"],
    routes: [route(["mecca", "malindi"], "trade")],
    facts: ["都市：マリンディ、キルワ", "言語：スワヒリ語（融合語）", "船：木造帆船ダウ船"],
    actors: [
      person("インド洋商人", "karimi-merchant", "malindi", { offset: [0, 0], bubble: "季節風に乗ってインド洋を渡る！" })
    ]
  }),

  scene({
    id: "polycentric-world", chapter: 2, year: "14〜15世紀", kicker: "多元的共存圏の成熟",
    title: "多様性と統合：法と信仰で結ばれ、\n次なる三大専制帝国へ。",
    body: [
      "政治的には無数の地方政権に分かれながらも、イスラーム世界は共通の「<strong>シャリーア（イスラーム法）</strong>」、商人たちの交易路、そして人々の心をとらえる「<strong>スーフィズム（神秘主義）</strong>」によって強固に結ばれていた。",
      "モロッコを出発したイブン＝バットゥータが約30年・12万kmを旅してどこでも裁判官（カーディー）として受け入れられたことがその証しである。この成熟した世界秩序の上に、やがてティムール帝国、オスマン、サファヴィー、ムガルの近世帝国が聳え立つことになる。"
    ],
    takeaway: "法・交易・神秘主義によって一体性を保ち、近世の火薬の帝国時代へと連なった。",
    note: "スーフィズム教団は辺境や下層民へ深く浸透し、インドや東南アジアへの平和的イスラーム拡大の原動力となりました。",
    focus: "多元的イスラーム世界の統合", mapHeading: "イベリアからインドを結ぶ共存圏",
    before: "統一カリフ帝国の解体", after: "法と交易のネットワークが成熟し三大帝国へ",
    zones: ["cordoba_caliphate", "fatimid_caliphate", "seljuq_empire", "delhi_sultanate"],
    pins: ["cordoba", "cairo", "baghdad", "samarkand", "delhi"],
    routes: [
      route(["cordoba", "cairo", "baghdad", "samarkand", "delhi"], "trade")
    ],
    facts: ["紐帯：シャリーア（法）とウラマー", "民衆信仰：スーフィズム（神秘主義）", "旅行家：イブン＝バットゥータ"],
    actors: [
      person("イスラーム世界", "azhar-mosque", "cairo", { offset: [0, 0], bubble: "広大な世界が信仰と法で結ばれる！" })
    ]
  })
];
