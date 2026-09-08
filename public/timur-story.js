import { characterCamera, characterScenes, renderMapCharacters } from "./timur-characters.js?v=0.044";

const scenes = [
  {
    id: "central-asian-change",
    characters: "culture",
    year: "14世紀半ば", kicker: "まず、中央アジアの変化から", title: "モンゴル人の間で、\n言葉と信仰が変わる。",
    body: ["<strong>モンゴル帝国</strong>が衰えるころ、舞台となる<strong>中央アジア</strong>では、支配階級だった<strong>モンゴル人</strong>にも変化が起きていた。", "<strong>トルコ語</strong>を使う<strong>トルコ化</strong>と、<strong>イスラーム教</strong>へ改宗する<strong>イスラーム化</strong>が進んだ。"],
    takeaway: "中央アジアのモンゴル人に、トルコ化とイスラーム化が進む。",
    note: "「トルコ化」は、主に使う言葉や文化がトルコ系へ変わることを指します。",
    mapHeading: "中央アジア｜モンゴル人のトルコ化・イスラーム化", mapDescription: "モンゴル帝国が衰える時期の中央アジアを強調し、支配階級のモンゴル人にトルコ語の使用とイスラーム教への改宗が広がる変化を人物で示します。",
    regions: ["chagatai"], places: [], labels: ["central"], seas: [], camera: [140, 45, 900, 600], mobileCamera: [300, 70, 610, 405], showCapital: false,
  },
  {
    id: "chagatai-split",
    characters: "split",
    year: "14世紀半ば", kicker: "まとまりが崩れると…", title: "国が東西に分かれ、\n争いが続く。",
    body: ["<strong>モンゴル帝国</strong>が衰えると、中央アジアの<strong>チャガタイ＝ハン国</strong>は東側と西側に分裂し、どちらでも部族の内紛が起きた。", "そのうち<strong>西チャガタイ＝ハン国</strong>の争いを勝ち抜いてきたのが、<strong>ティムール</strong>だった。"],
    takeaway: "チャガタイ＝ハン国が分裂 → 西側からティムールが登場。",
    note: "チャガタイ＝ハン国は「チャガタイ＝ウルス」とも呼ばれます。",
    mapHeading: "チャガタイ＝ハン国（チャガタイ＝ウルス）の東西分裂", mapDescription: "チャガタイ＝ハン国の西側と東側を分け、西チャガタイ＝ハン国からティムールが台頭する位置関係を示します。",
    regions: ["west", "east"], places: [], labels: ["west", "east"], seas: [], camera: [320, 55, 740, 490], mobileCamera: [390, 90, 650, 430], split: true, showCapital: false,
  },
  {
    id: "timurid-founding",
    characters: "marriage",
    year: "14世紀後半", kicker: "ティムール朝の成立", title: "「後継者」の権威で、\nサマルカンドに政権を築く。",
    body: ["<strong>ティムール</strong>は<strong>チャガタイ家</strong>直系の娘の「婿」となり、<strong>チンギス＝ハン</strong>の後継者を称して政権に就いた。本人は直系の子孫ではない。これが<strong>ティムール朝</strong>だ。", "都<strong>サマルカンド</strong>から遠征し、各地の勢力を倒した。征服地の多くを一族に与える方法にも、<strong>モンゴル帝国</strong>の伝統が表れている。"],
    takeaway: "都はサマルカンド。チャガタイ家との婚姻とモンゴルの伝統を権威にする。",
    note: "チンギス＝ハンは「チンギス＝カン」とも表記します。",
    mapHeading: "ティムール朝の都サマルカンド｜チャガタイ家の「婿」", mapDescription: "モンゴル帝国の伝統を背景に、サマルカンドでティムールとチャガタイ家直系の娘が近づき、祖先のチンギス＝ハン（チンギス＝カン）を別枠で示します。",
    regions: ["west"], places: [], labels: ["timurid"], seas: [], camera: [300, 90, 620, 410], mobileCamera: [360, 95, 490, 330], capitalActive: true,
  },
  {
    id: "kipchak-expedition",
    characters: "north",
    year: "北方への遠征", kicker: "遠征① カスピ海の北へ", title: "キプチャク＝ハン国に、\n影響力を広げる。",
    body: ["まず<strong>ティムール</strong>は、都<strong>サマルカンド</strong>のある<strong>中央アジア</strong>から<strong>カスピ海北岸</strong>へ進出し、<strong>キプチャク＝ハン国</strong>へ遠征した。", "キプチャク＝ハン国、別名<strong>ジョチ＝ウルス</strong>の全域へ影響力を伸ばした。"],
    takeaway: "中央アジア → カスピ海北岸 → キプチャク＝ハン国へ影響。",
    note: "斜線は影響が及んだ広い範囲の概略で、同じ方法で直接支配した領土線ではありません。",
    mapHeading: "カスピ海北岸｜キプチャク＝ハン国（ジョチ＝ウルス）", mapDescription: "サマルカンドからカスピ海北岸へ向かうティムールの遠征路と、キプチャク＝ハン国（ジョチ＝ウルス）へ及んだ影響の概略を示します。",
    regions: ["west", "kipchak"], places: ["northShore"], labels: ["kipchak"], seas: ["caspian"], routes: ["north"], camera: [140, 0, 760, 505], mobileCamera: [250, 15, 600, 400],
  },
  {
    id: "iran-expedition",
    characters: "iran",
    year: "イランへの遠征", kicker: "遠征② 今度は南西へ", title: "イル＝ハン国滅亡後の\nイランを支配下へ。",
    body: ["一方、<strong>イル＝ハン国</strong>が滅亡したあとの、<strong>カスピ海</strong>南方の<strong>イラン</strong>では、各地の勢力が分立していた。", "<strong>ティムール</strong>は都<strong>サマルカンド</strong>からそこへ攻め込み、各地の勢力を倒してイランを支配下に組み込んだ。イル＝ハン国は<strong>フレグ＝ウルス</strong>とも呼ばれる。"],
    takeaway: "イル＝ハン国の滅亡後のイラン → ティムールの支配下へ。",
    note: "北方への遠征と前後する出来事ですが、ここでは説明の流れに合わせて地域ごとに見ます。",
    mapHeading: "イル＝ハン国（フレグ＝ウルス）滅亡後のイラン", mapDescription: "サマルカンドからカスピ海の南にあるイランへ向かい、ティムールが現地勢力を倒して支配下に組み込む動きを示します。",
    regions: ["west", "iran"], places: ["iranCenter"], labels: ["iran"], seas: ["caspian"], routes: ["iran"], camera: [145, 120, 720, 480], mobileCamera: [265, 160, 510, 340],
  },
  {
    id: "caucasus-expedition",
    characters: "caucasus",
    year: "二つの海の間へ", kicker: "遠征③ イランから北西へ", title: "アルメニアとグルジアへ、\n軍を進める。",
    body: ["<strong>ティムール</strong>は<strong>イラン</strong>からさらに北西へ向かい、<strong>アルメニア</strong>や<strong>グルジア</strong>にも軍を進めた。", "二つの地域は、<strong>黒海</strong>と<strong>カスピ海</strong>の間に位置する。"],
    takeaway: "黒海 ｜ グルジア・アルメニア ｜ カスピ海",
    note: "この一帯をコーカサスと呼びます。グルジアの現在の日本語国名はジョージアです。",
    mapHeading: "黒海とカスピ海の間｜アルメニア・グルジア", mapDescription: "西の黒海と東のカスピ海の間にアルメニアとグルジアを示し、イランから進むティムールの遠征路を結びます。",
    regions: ["iran", "caucasus"], places: ["georgia", "armenia"], labels: ["iran"], seas: ["black", "caspian"], routes: ["caucasus"], camera: [40, 100, 730, 485], mobileCamera: [115, 155, 540, 360], showCapital: false,
  },
  {
    id: "delhi-expedition",
    characters: "delhi",
    year: "西北インドへの遠征", kicker: "遠征④ さらに南東へ", title: "デリーを占領し、\nトゥグルク朝が衰退。",
    body: ["さらに<strong>ティムール</strong>の軍は、<strong>サマルカンド</strong>のある中央アジアから<strong>西北インド</strong>へ侵入し、<strong>デリー</strong>を占領した。", "このときの略奪が大きな打撃となり、デリーを都とする<strong>トゥグルク朝</strong>は衰退した。"],
    takeaway: "西北インドのデリー占領 → トゥグルク朝が衰退。",
    note: "デリーを占領したことと、インド全体を継続して支配したことは区別します。",
    mapHeading: "西北インド｜デリーとトゥグルク朝", mapDescription: "中央アジアから西北インドのデリーへ進むティムール軍と、占領によってトゥグルク朝が衰退する関係を示します。",
    regions: ["west", "india"], places: ["delhi"], labels: ["northwestIndia"], seas: [], routes: ["india"], camera: [360, 175, 640, 425], mobileCamera: [460, 200, 440, 295],
  },
  {
    id: "syria-baghdad-expedition",
    characters: "syria",
    year: "シリアからアナトリアへ", kicker: "遠征⑤ 西へ向きを変える", title: "ダマスクス、バグダード、\nそしてアナトリアへ。",
    body: ["その後、都<strong>サマルカンド</strong>から西へ遠征した<strong>ティムール</strong>は、<strong>シリア</strong>の<strong>ダマスクス</strong>を占領した。続いて<strong>バグダード</strong>も占領した。", "さらに北西の<strong>アナトリア</strong>へ進撃し、次に<strong>オスマン朝</strong>と衝突する。"],
    takeaway: "シリアのダマスクス → バグダード → アナトリアへ進撃。",
    note: "地図上の人物はダマスクスで一度止まり、その後バグダードへ進みます。",
    mapHeading: "シリアのダマスクス → バグダード → アナトリア", mapDescription: "ティムールがシリアのダマスクス、バグダードの順に占領し、アナトリアへ向かう遠征のつながりを示します。",
    regions: ["iran", "syria"], places: ["damascus", "baghdad"], labels: ["syria", "anatolia", "ottoman"], seas: [], routes: ["syria", "baghdad"], camera: [75, 185, 680, 455], mobileCamera: [105, 240, 470, 315],
  },
  {
    id: "battle-of-ankara",
    characters: "ankara",
    year: "1402年", kicker: "遠征⑥ アンカラの戦い", title: "オスマン朝の\nスルタンを捕らえる。",
    body: ["<strong>アナトリア</strong>へ進んだ<strong>ティムール軍</strong>は、1402年の<strong>アンカラの戦い</strong>で<strong>オスマン朝</strong>を破った。", "オスマン朝の<strong>スルタン</strong>、<strong>バヤジット1世</strong>は捕虜となり、オスマン朝の統一は一時中断した。"],
    takeaway: "1402年・アンカラの戦い → バヤジット1世を捕虜に。",
    note: "オスマン朝が永久に滅んだわけではありません。内紛を経て再統一されます。",
    mapHeading: "1402年 アンカラの戦い｜オスマン朝のスルタンを捕虜に", mapDescription: "アナトリアのアンカラでティムール軍がオスマン朝を破り、スルタンのバヤジット1世を捕虜としたことを人物と経路で示します。",
    regions: ["anatolia"], places: ["ankara"], labels: ["anatolia", "ottoman"], seas: [], routes: ["ankara"], camera: [0, 125, 725, 480], mobileCamera: [35, 185, 480, 320], showCapital: false,
  },
  {
    id: "anatolian-restoration",
    characters: "return",
    year: "アンカラの戦いの後", kicker: "勝利後も西へ進まず", title: "アナトリアを返し、\nバルカン半島へは向かわない。",
    body: ["<strong>アンカラの戦い</strong>の後、<strong>ティムール</strong>は、<strong>オスマン朝</strong>に領地を奪われていた<strong>アナトリア</strong>の旧支配者たちへ、その領地を与えた。", "オスマン朝の本拠地<strong>バルカン半島</strong>には関心を示さず、遠征を広げなかった。関心はむしろ東へ向いていた。"],
    takeaway: "アナトリアの領地は旧支配者へ。バルカン半島には進まない。",
    note: "征服地をすべて本人が直接支配しない点にも、モンゴルの伝統が見えます。",
    mapHeading: "アナトリアの旧支配者へ返還｜バルカン半島には進まず", mapDescription: "オスマン朝が領地を奪っていたアナトリアの旧支配者へ返す動きと、西のバルカン半島へ遠征しなかったことを示します。",
    regions: ["anatolia", "balkans"], places: ["ankara"], labels: ["anatolia", "ottoman", "balkans"], seas: [], camera: [0, 110, 705, 470], mobileCamera: [0, 150, 490, 325], afterAnkara: true, showCapital: false,
  },
  {
    id: "ming-expedition-plan",
    characters: "ming",
    year: "最後の目標は明", kicker: "関心はモンゴル宗家の仇敵へ", title: "元を北へ追った明を、\n中国へ攻めようとする。",
    body: ["<strong>ティムール</strong>の関心は、<strong>モンゴル宗家</strong>の<strong>元</strong>を<strong>中国</strong>から北方へ追いやった仇敵、<strong>明</strong>に向いた。", "そこで都<strong>サマルカンド</strong>へ戻って軍を再編成し、明への遠征に出発した。"],
    takeaway: "モンゴル宗家の元を北へ追った明が、最後の遠征目標になる。",
    note: "青い破線は目標への方向で、明の領内まで到達した行軍路ではありません。",
    mapHeading: "サマルカンドで再編成｜元を北へ追った明へ", mapDescription: "モンゴル宗家の元を中国から北方へ追った明を東に置き、サマルカンドから計画したティムールの遠征方向を破線で示します。",
    regions: ["west", "ming"], places: [], labels: ["ming", "yuan"], seas: [], routes: ["china"], camera: [310, 0, 950, 635], mobileCamera: [450, 40, 810, 540],
  },
  {
    id: "death-at-otrar",
    characters: "death",
    year: "中国遠征の途中", kicker: "明へ届く前に", title: "中央アジアのオトラルで、\nティムールは病死する。",
    body: ["都<strong>サマルカンド</strong>を出発し、<strong>中国</strong>へ向かう遠征の途中、<strong>ティムール</strong>は<strong>中央アジア</strong>の<strong>オトラル</strong>で病死した。", "そのため<strong>明</strong>への遠征は実現せず、オトラルが実際の到達点になった。"],
    takeaway: "中央アジアのオトラルで病死 → 明への遠征は実現しない。",
    note: "ティムール本人の死後も、子孫によるティムール朝は続きます。",
    mapHeading: "実際の到達点は中央アジアのオトラル｜明へは未到達", mapDescription: "サマルカンドからオトラルまでを実線、オトラルから中国の明へ向かう未実現の計画を破線で示し、病死した地点で止めます。",
    regions: ["west", "ming"], places: ["otrar"], labels: ["central", "ming"], seas: [], routes: ["otrar", "chinaFromOtrar"], camera: [310, 0, 950, 635], mobileCamera: [450, 40, 810, 540], stop: true,
  },
  {
    id: "development-map",
    characters: "summary",
    year: "ティムール朝の発展図", kicker: "最後に地名と勢力を結ぶ", title: "ティムールの遠征を、\n一枚の地図で振り返る。",
    body: ["<strong>ティムール朝</strong>の都は<strong>サマルカンド</strong>、西方の主要都市が<strong>ヘラート</strong>。西には<strong>オスマン朝</strong>と、<strong>ビザンツ帝国</strong>の<strong>コンスタンティノープル</strong>があった。", "南西には<strong>マムルーク朝</strong>の<strong>カイロ</strong>、南東には<strong>トゥグルク朝</strong>のデリーが位置する。サマルカンドから伸びる<strong>ティムールの遠征</strong>のうち、オスマン朝との<strong>アンカラの戦い［1402］</strong>を地図上で確かめよう。"],
    takeaway: "都サマルカンドから、北・西・南東へ広がったティムールの遠征。",
    note: "色は位置関係、矢印は主な進行方向の模式です。厳密な国境や行軍路ではありません。",
    mapHeading: "ティムール朝の発展｜ティムールの遠征", mapDescription: "ティムール朝の都サマルカンドとヘラート、ビザンツ帝国のコンスタンティノープル、オスマン朝、マムルーク朝のカイロ、トゥグルク朝のデリー、アンカラの戦い［1402］を一枚に示します。",
    regions: ["timuridOverview", "anatolia", "india"], places: ["constantinople", "cairo", "herat", "delhi", "ankara"], labels: ["timurid", "byzantine", "ottoman", "mamluk", "tughluq"], seas: [], routes: ["north", "iran", "caucasus", "india", "summaryAnkara"], camera: [0, 0, 1260, 720], mobileCamera: [0, 0, 1260, 720], summary: true,
  },
];

const svgNamespace = "http://www.w3.org/2000/svg";
const project = ([longitude, latitude]) => [(longitude - 20) * 12, (58 - latitude) * 15];
const pointsPath = (points, close = false) => points.map((point, i) => `${i ? "L" : "M"}${project(point).join(",")}`).join(" ") + (close ? " Z" : "");
const places = {
  samarkand: { point: [66.97, 39.65], label: "サマルカンド", offset: [0, 30], anchor: "middle" },
  northShore: { point: [47.2, 47.2], label: "カスピ海北岸", offset: [-13, -16], anchor: "end" },
  iranCenter: { point: [51.68, 32.65], label: "イラン", offset: [10, 27] },
  georgia: { point: [44.8, 41.7], label: "グルジア", offset: [15, -18] },
  armenia: { point: [44.5, 40.2], label: "アルメニア", offset: [12, 30] },
  delhi: { point: [77.21, 28.61], label: "デリー", offset: [13, 7] },
  damascus: { point: [36.29, 33.51], label: "ダマスクス", offset: [-12, 24], anchor: "end" },
  baghdad: { point: [44.37, 33.31], label: "バグダード", offset: [12, 26] },
  ankara: { point: [32.86, 39.93], label: "アンカラ", offset: [-12, -17], anchor: "end" },
  otrar: { point: [68.3, 42.85], label: "オトラル", offset: [14, -16] },
  constantinople: { point: [28.98, 41.01], label: "コンスタンティノープル", offset: [-8, 23], anchor: "end" },
  cairo: { point: [31.24, 30.04], label: "カイロ", offset: [-10, 25], anchor: "end" },
  herat: { point: [62.2, 34.35], label: "ヘラート", offset: [10, 24] },
};
const regions = {
  chagatai: { points: [[58,43],[64,47],[77,48],[87,46],[91,40],[80,35],[68,34],[59,37]] },
  west: { points: [[59,42],[65,45],[71,44],[74,41],[70,36],[64,35],[60,38]] },
  east: { points: [[73,44],[78,48],[87,46],[91,41],[84,36],[74,36],[76,41]], kind: "planned" },
  kipchak: { points: [[37,48],[44,52],[58,54],[72,51],[68,47],[58,46],[48,47],[42,45]], kind: "influence" },
  iran: { points: [[45,38],[54,39],[61,36],[63,29],[58,26],[51,29],[47,33]] },
  caucasus: { points: [[40,43],[45,43],[49,41],[47,38],[42,39]] },
  india: { points: [[71,32],[75,32],[80,30],[80,27],[75,27],[71,29]], kind: "influence" },
  syria: { points: [[35,37],[41,37],[46,35],[47,32],[42,31],[35,32]], kind: "influence" },
  anatolia: { points: [[28,40],[34,42],[41,41],[42,38],[35,36],[29,37]], kind: "opponent" },
  balkans: { points: [[20,44],[26,45],[29,42],[26,40],[23,38],[20,40]], kind: "planned" },
  ming: { points: [[104,39],[112,42],[119,41],[123,36],[122,29],[118,24],[109,21],[104,26],[103,32]], kind: "planned" },
  timuridOverview: { points: [[44,43],[54,48],[70,48],[80,42],[79,29],[69,25],[57,27],[48,32]], kind: "influence" },
};
const labels = {
  central: { point: [77, 47.5], text: "中央アジア" },
  chagatai: { point: [77, 34.5], text: "チャガタイ＝ハン国（チャガタイ＝ウルス）" },
  west: { point: [63, 45.8], text: "西チャガタイ＝ハン国" },
  east: { point: [82.5, 43], text: "東側" },
  kipchak: { point: [57, 51.4], text: "キプチャク＝ハン国（ジョチ＝ウルス）" },
  iran: { point: [55, 35.7], text: "イラン" },
  northwestIndia: { point: [81, 24], text: "西北インド" },
  syria: { point: [37, 36.5], text: "シリア" },
  iraq: { point: [44, 36], text: "イラク" },
  anatolia: { point: [35, 36.2], text: "アナトリア" },
  balkans: { point: [25, 46], text: "バルカン半島" },
  ming: { point: [114, 32], text: "明（中国）" },
  yuan: { point: [111, 49], text: "北へ追われたモンゴル宗家の元" },
  timurid: { point: [58, 39], text: "ティムール朝" },
  byzantine: { point: [25, 45.5], text: "ビザンツ帝国" },
  ottoman: { point: [35, 43.7], text: "オスマン朝" },
  mamluk: { point: [31, 26.5], text: "マムルーク朝" },
  tughluq: { point: [78, 25.5], text: "トゥグルク朝" },
};
const seaLabels = {
  black: { point: [34, 43.8], text: "黒海" },
  caspian: { point: [51, 41.3], text: "カスピ海" },
};
const routes = {
  north: { points: [[66.97,39.65],[69,44.5],[61,49],[53,49.5],[47.2,47.2]] },
  iran: { points: [[66.97,39.65],[61,36.5],[56,35],[51.68,32.65]] },
  caucasus: { points: [[51.68,32.65],[49,37],[46,39],[44.8,41.7]] },
  india: { points: [[66.97,39.65],[69,34.5],[72,31],[77.21,28.61]] },
  syria: { points: [[66.97,39.65],[57,36],[48,36.5],[39,37],[36.29,33.51]] },
  baghdad: { points: [[36.29,33.51],[40,32],[44.37,33.31]], delay: .6 },
  ankara: { points: [[44.37,33.31],[42,37],[37,39],[32.86,39.93]] },
  summaryAnkara: { points: [[66.97,39.65],[57,36],[46,36],[38,38],[32.86,39.93]] },
  china: { points: [[66.97,39.65],[77,43],[91,43],[101,40],[111,36]], planned: true },
  otrar: { points: [[66.97,39.65],[67.4,41],[68.3,42.85]] },
  chinaFromOtrar: { points: [[68.3,42.85],[79,45],[91,43],[101,40],[111,36]], planned: true },
};

const elements = Object.fromEntries([
  "story-map", "map-heading", "map-title", "map-description", "map-regions", "map-labels", "map-routes", "map-places", "map-annotations",
  "narrative", "scene-number", "scene-year", "scene-kicker", "scene-title", "scene-body", "scene-takeaway", "scene-note",
  "previous", "next", "replay", "story-progress", "progress-label", "scene-nav", "map-characters",
].map((id) => [id, document.getElementById(id)]));
const mobile = window.matchMedia("(max-width: 740px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let sceneIndex = 0;
let stopCharacters = () => {};

function svgElement(tag, attributes = {}, text) {
  const element = document.createElementNS(svgNamespace, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  if (text !== undefined) element.textContent = text;
  return element;
}

function mapText(point, text, className = "region-label", extra = {}) {
  const [x, y] = project(point);
  return svgElement("text", { x, y, class: className, "text-anchor": "middle", ...extra }, text);
}

function drawPlace(key, scene) {
  const place = places[key];
  const [x, y] = project(place.point);
  const { x: left, y: top, width, height } = elements["story-map"].viewBox.baseVal;
  if (x < left || x > left + width || y < top || y > top + height) return;
  const capital = key === "samarkand";
  const active = !capital || scene.capitalActive;
  const group = svgElement("g");
  if (active && !reducedMotion.matches) group.append(svgElement("circle", { cx: x, cy: y, r: 12, class: "place-ring" }));
  group.append(capital
    ? svgElement("path", { d: `M${x},${y - 8} l8,8 -8,8 -8,-8 Z`, class: "capital-dot" })
    : svgElement("circle", { cx: x, cy: y, r: 6, class: `place-dot${active ? " active" : ""}` }));
  const summaryAnkara = scene.summary && mobile.matches && key === "ankara";
  const scale = elements["story-map"].clientWidth / width;
  const definition = characterScenes[scene.characters];
  const hasPerson = definition.cast.some((item) => !item.travel && item.point[0] === place.point[0] && item.point[1] === place.point[1]) || definition.destination === key;
  const offset = hasPerson ? [0, (mobile.matches ? 45 : 48) / scale] : summaryAnkara ? [15, 30] : [...place.offset];
  if (scene.characters === "syria" && key === "damascus") offset[0] = -10 / scale;
  if (scene.characters === "syria" && key === "baghdad") offset[0] = 10 / scale;
  if (capital && scene.regions.includes("ming")) { offset[0] = 0; offset[1] = (mobile.matches ? 66 : 48) / scale; }
  group.append(svgElement("text", {
    x: x + offset[0], y: y + offset[1], "data-anchor-x": x, "data-anchor-y": y,
    class: capital ? "capital-label" : `place-label${active ? " active" : ""}`,
    "text-anchor": scene.characters === "syria" && key === "damascus" ? "end" : scene.characters === "syria" && key === "baghdad" ? "start" : hasPerson ? "middle" : summaryAnkara ? "start" : place.anchor ?? "start",
    style: `font-size:${(mobile.matches ? 10.5 : 12) / scale}px`,
  }, place.label));
  elements["map-places"].append(group);
}

function drawRoute(key, scene) {
  const route = routes[key];
  const d = pointsPath(route.points);
  const path = svgElement("path", { d, pathLength: 1, class: `route${route.planned ? " planned" : ""}` });
  // 破線の長さは画面上の長さで指定するため、正規化しない。
  if (route.planned) path.removeAttribute("pathLength");
  if (route.delay) path.style.animationDelay = `${route.delay}s`;
  elements["map-routes"].append(path);
}

function renderMap(scene) {
  stopCharacters();
  ["map-regions", "map-labels", "map-routes", "map-places", "map-annotations"].forEach((id) => elements[id].replaceChildren());
  const map = elements["story-map"];
  map.setAttribute("viewBox", characterCamera(scene, routes, project, map.clientWidth, map.clientHeight, mobile.matches).join(" "));
  elements["story-map"].classList.toggle("eastward", scene.regions.includes("ming"));
  elements["story-map"].classList.toggle("overview", Boolean(scene.summary));
  elements["map-heading"].textContent = scene.mapHeading;
  elements["map-title"].textContent = scene.mapHeading;
  elements["map-description"].textContent = scene.mapDescription;
  for (const key of scene.regions) {
    const region = regions[key];
    elements["map-regions"].append(svgElement("path", { d: pointsPath(region.points, true), class: `region ${region.kind ?? ""}` }));
  }
  for (const key of scene.seas) {
    const sea = seaLabels[key];
    elements["map-labels"].append(mapText(sea.point, sea.text, "sea-label"));
  }
  for (const key of scene.labels) {
    const label = labels[key];
    const point = mobile.matches && key === "central" ? [77, 55] : label.point;
    elements["map-labels"].append(mapText(point, label.text, "region-label active"));
  }
  for (const key of scene.routes ?? []) drawRoute(key, scene);
  if (scene.showCapital !== false) drawPlace("samarkand", scene);
  for (const key of scene.places) drawPlace(key, scene);
  if (scene.split) {
    elements["map-annotations"].append(svgElement("path", { d: pointsPath([[74,46],[72.6,43],[74,40],[72.5,36]]), fill: "none", stroke: "#fdfaf4", "stroke-width": 5, "stroke-dasharray": "6 5" }));
    elements["map-annotations"].append(mapText([65,33], "西側からティムール", "map-callout"));
  }
  if (scene.afterAnkara) elements["map-annotations"].append(mapText([41,30], "旧支配者へ領地を戻す", "map-callout"));
  if (scene.stop) {
    const [x,y] = project(places.otrar.point);
    elements["map-annotations"].append(svgElement("path", { d: `M${x - 7},${y - 8} l14,16 m0,-16 l-14,16`, fill: "none", stroke: "#a6422c", "stroke-width": 4 }));
  }
  stopCharacters = renderMapCharacters(elements["map-characters"], scene, { map, routes, project, reducedMotion: reducedMotion.matches });
}

function renderScene({ moveToStage = false } = {}) {
  const scene = scenes[sceneIndex];
  elements["scene-number"].textContent = `${String(sceneIndex + 1).padStart(2, "0")} / ${scenes.length}`;
  elements["scene-year"].textContent = scene.year;
  elements["scene-kicker"].textContent = scene.kicker;
  elements["scene-title"].replaceChildren(...scene.title.split("\n").flatMap((line, i) => i ? [document.createElement("br"), document.createTextNode(line)] : [document.createTextNode(line)]));
  // 本文はこのファイルで管理する固定の説明文だけを使う。
  elements["scene-body"].innerHTML = scene.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
  elements["scene-takeaway"].textContent = scene.takeaway;
  elements["scene-note"].textContent = scene.note;
  elements.previous.disabled = sceneIndex === 0;
  elements.next.replaceChildren(document.createTextNode(sceneIndex === scenes.length - 1 ? "最初から" : "次へ"), Object.assign(document.createElement("span"), { textContent: sceneIndex === scenes.length - 1 ? "↻" : "→" }));
  elements["story-progress"].value = sceneIndex + 1;
  elements["story-progress"].textContent = `${sceneIndex + 1} / ${scenes.length}`;
  elements["progress-label"].textContent = `${sceneIndex + 1} / ${scenes.length}`;
  for (const button of elements["scene-nav"].children) {
    if (Number(button.dataset.scene) === sceneIndex) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  }
  const chapter = sceneIndex < 3 ? 0 : sceneIndex < 10 ? 3 : 10;
  document.querySelectorAll("[data-chapter]").forEach((button) => {
    if (Number(button.dataset.chapter) === chapter) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  renderMap(scene);
  elements.narrative.classList.remove("scene-enter");
  void elements.narrative.offsetWidth;
  elements.narrative.classList.add("scene-enter");
  if (moveToStage) document.querySelector(".story-stage").scrollIntoView({ block: "start", behavior: "instant" });
}

function goTo(index, moveToStage = true) {
  const nextIndex = Math.max(0, Math.min(scenes.length - 1, index));
  if (nextIndex === sceneIndex) return;
  sceneIndex = nextIndex;
  renderScene({ moveToStage });
}

scenes.forEach((scene, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.scene = index;
  button.textContent = String(index + 1).padStart(2, "0");
  button.title = `${index + 1}. ${scene.title.replace("\n", "")}`;
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", () => goTo(index));
  elements["scene-nav"].append(button);
});
elements.previous.addEventListener("click", () => goTo(sceneIndex - 1));
elements.next.addEventListener("click", () => goTo(sceneIndex === scenes.length - 1 ? 0 : sceneIndex + 1));
elements.replay.addEventListener("click", () => {
  renderMap(scenes[sceneIndex]);
});
document.querySelectorAll("[data-chapter]").forEach((button) => button.addEventListener("click", () => goTo(Number(button.dataset.chapter))));
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
  if (event.target.closest("input, textarea, select, [contenteditable=true], details")) return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    goTo(sceneIndex + (event.key === "ArrowRight" ? 1 : -1), false);
  }
});
let mapSize = "";
new ResizeObserver(() => {
  const map = elements["story-map"];
  const size = `${map.clientWidth},${map.clientHeight}`;
  if (size === mapSize) return;
  mapSize = size;
  renderMap(scenes[sceneIndex]);
}).observe(elements["story-map"]);
reducedMotion.addEventListener("change", () => renderMap(scenes[sceneIndex]));
// 独立した無音のページ。学習用の音声・設定・履歴は読み込まない。
renderScene();
