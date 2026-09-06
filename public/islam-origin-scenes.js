// 01 イスラーム教の成立と正統カリフ（27場面）
// 原文 p.316〜320 の流れと固有名詞の対応は docs/islam-origin-correspondence.md を参照。

export const places = {
  iberia: { name: "イベリア半島", point: [-4, 40] },
  centralAsia: { name: "中央アジア", point: [68, 40] },
  constantinople: { name: "コンスタンティノープル", point: [28.98, 41.01] },
  alexandria: { name: "アレクサンドリア", point: [29.92, 31.2] },
  damascus: { name: "ダマスクス", point: [36.29, 33.51] },
  medina: { name: "メディナ【ヤスリブ】", point: [39.61, 24.47] },
  mecca: { name: "メッカ", point: [39.83, 21.42] },
  yemen: { name: "イエメン", point: [44.2, 15.3] },
  hormuz: { name: "ホルムズ", point: [56.46, 27.06] },
  ctesiphon: { name: "クテシフォン", point: [44.58, 33.09] },
  nihavand: { name: "ニハーヴァンド", point: [48.37, 34.19] },
  kufa: { name: "クーファ", point: [44.4, 32.03] },
  basra: { name: "バスラ", point: [47.78, 30.51] },
  fustat: { name: "フスタート", point: [31.24, 30] },
  baghdad: { name: "バグダード", point: [44.37, 33.31] },
  tours: { name: "トゥール・ポワティエ間", point: [0.68, 46.58] },
  talas: { name: "タラス河畔", point: [72.24, 42.52] }
};

export const zones = {
  byzantine: { color: "#54728c", points: [[25, 42], [35, 42], [37, 36], [34, 31], [28, 31], [25, 35]] },
  sasanian: { color: "#8b5648", points: [[44, 38], [52, 38], [60, 36], [62, 30], [54, 27], [46, 30], [43, 34]] },
  arabia: { color: "#b0882f", points: [[35, 29], [43, 31], [51, 26], [55, 19], [49, 12], [42, 12], [36, 18]] },
  hijaz: { color: "#b87543", points: [[37.2, 26.3], [40.4, 27], [42, 20], [40.3, 16.5], [37.5, 18.5]] },
  yemen: { color: "#6d8b63", points: [[41.5, 17], [46.5, 17], [49.5, 13], [43, 11.5]] },
  islamCore: { color: "#3a7d44", points: [[36, 29], [43, 31], [51, 26], [54, 18], [48, 12], [40, 13], [35, 20]] },
  caliphateExpanded: { color: "#43894e", points: [[28, 32], [37, 37], [48, 38], [58, 36], [55, 27], [46, 18], [37, 18], [30, 25]] },
  umayyadPreview: { color: "#aa6b68", points: [[-10, 37], [3, 44], [20, 39], [37, 40], [55, 42], [74, 43], [73, 32], [52, 25], [35, 18], [12, 24], [-7, 29]] }
};

const makeScene = data => ({ zones: [], pins: [], routes: [], tags: [], facts: [], actors: [], props: [], duration: 2200, ...data });

export const scenes = [
  makeScene({
    id: "world-overview", chapter: 0, year: "イスラーム世界の入口", frame: [-12, 8, 82, 49], zones: ["arabia"], pins: ["iberia", "mecca", "centralAsia"],
    routes: [{ points: [[39.83, 21.42], [-4, 40]], kind: "move" }, { points: [[39.83, 21.42], [68, 40]], kind: "move" }],
    tags: [{ at: [14, 43], text: "キリスト教" }, { at: [82, 36], text: "仏教" }],
    facts: ["イスラーム世界：政治と宗教が一体／『コーラン』・カリフ・スルタン", "イスラーム教の重要語：ジハード・シャリーア"],
    props: [{ name: "イスラーム教と『コーラン』", image: "prophet-banner", kind: "prop", at: "mecca", size: 58 }],
    title: "アラビア半島から、\nイスラーム世界が広がる。", kicker: "まず大きな範囲をつかむ", mapHeading: "アラビア半島からイベリア半島・中央アジアへ", focus: "イスラーム教の広がりと基本語",
    before: "アラビア半島にイスラーム教が現れる", after: "イベリア半島から中央アジアへ広がる",
    body: ["<strong>アラビア半島</strong>の<strong>メッカ</strong>に現れた<strong>イスラーム教</strong>は、のちに<strong>イベリア半島</strong>から<strong>中央アジア</strong>まで広がり、<strong>キリスト教</strong>・<strong>仏教</strong>と並ぶ大きな宗教になった。", "政治と宗教が一体で、『<strong>コーラン</strong>』が暮らしにも関わる。これから<strong>カリフ</strong>、<strong>スルタン</strong>、<strong>ジハード</strong>、<strong>シャリーア</strong>という語も順に見ていこう。"],
    takeaway: "イスラーム教は、信仰と政治・生活を結ぶ世界を形づくった。", note: "この場面は全体の見取り図。スルタンとシャリーアの具体像は、後の時代で深めます。"
  }),
  makeScene({
    id: "desert-oasis", chapter: 0, year: "イスラーム以前", frame: [33, 13, 55, 31], zones: ["arabia"], pins: [],
    tags: [{ at: [47, 24], text: "アラビア半島" }, { at: [43, 19], text: "オアシス" }], facts: ["アラブ人：オアシスの周辺で農業", "地下水を灌漑に利用"],
    actors: [{ name: "オアシスのアラブ人", image: "arab-elder", at: [43, 19], bubble: "地下水を灌漑に使おう" }],
    title: "砂漠の半島で、\nオアシス農業が営まれる。", kicker: "乾燥地での暮らし", mapHeading: "アラビア半島の砂漠とオアシス", focus: "アラブ人の定住生活",
    before: "アラビア半島の大部分は砂漠", after: "アラブ人が地下水を灌漑に使いオアシスで農業を営む",
    body: ["<strong>アラビア半島</strong>の大部分は砂漠だった。定住する<strong>アラブ人</strong>は、地下水を<strong>灌漑</strong>に使える<strong>オアシス</strong>の周辺で農業を営んだ。", "水の得られる場所が、人びとの暮らしと交易をつなぐ拠点になった。"],
    takeaway: "砂漠では、地下水を使えるオアシスが生活の中心だった。", note: "オアシスに住む人びとと、砂漠を移動する人びとでは生活の形が異なります。"
  }),
  makeScene({
    id: "happy-arabia", chapter: 0, year: "古代からの中継地", frame: [24, 8, 67, 36], zones: ["yemen"], pins: ["yemen"],
    routes: [{ points: [[65, 10], [44.2, 15.3], [37.5, 23.5], [24, 34.5]], kind: "trade" }],
    tags: [{ at: [55, 10], text: "インド洋" }, { at: [37.5, 23.5], text: "紅海" }, { at: [24, 34.5], text: "地中海" }], facts: ["イエメン：農業が盛んな南西部", "紅海貿易の中継点『幸福のアラビア』"],
    actors: [{ name: "イエメンの交易商人", image: "quraysh-merchant", at: "yemen", bubble: "海と陸の品物を中継する" }],
    title: "イエメンは、\n「幸福のアラビア」とよばれた。", kicker: "農業と紅海貿易", mapHeading: "インド洋・紅海・地中海を結ぶイエメン", focus: "幸福のアラビア",
    before: "インド洋から品物が運ばれる", after: "イエメンが紅海貿易の中継点として栄える",
    body: ["半島南西部の<strong>イエメン</strong>は農業が盛んで、<strong>インド洋</strong>と<strong>地中海</strong>を結ぶ<strong>紅海貿易</strong>の中継点にもなった。", "その豊かさから、古くは「<strong>幸福のアラビア</strong>」とよばれた。"],
    takeaway: "イエメンは農業と紅海貿易によって栄えた。", note: "海上交易と陸上交易が接続する位置を地図で確認しましょう。"
  }),
  makeScene({
    id: "bedouin-caravan", chapter: 0, year: "砂漠の移動生活", frame: [35, 12, 53, 30], zones: ["arabia"], pins: [],
    routes: [{ points: [[44.2, 15.3], [42, 20], [39.83, 21.42], [39.61, 24.47]], kind: "trade" }], tags: [{ at: [48, 26], text: "アラビア半島" }], facts: ["ベドウィン：砂漠の遊牧民", "ラクダ・羊の飼育と隊商貿易"],
    actors: [{ name: "ベドウィン（ラクダ・羊）", image: "arab-cavalry", at: "yemen", route: 0, bubble: "隊商貿易で砂漠を進む" }],
    title: "ベドウィンは、\n家畜とともに砂漠を移動する。", kicker: "遊牧民と隊商", mapHeading: "アラビア半島を移動するベドウィン", focus: "ラクダを使った隊商貿易",
    before: "ベドウィンがラクダや羊を連れて移動する", after: "一部はラクダで隊商貿易を担う",
    body: ["砂漠地帯の遊牧民<strong>ベドウィン</strong>は、<strong>ラクダ</strong>や<strong>羊</strong>を飼いながら<strong>アラビア半島</strong>を移動した。", "その一部はラクダを使う<strong>隊商貿易</strong>にも携わった。"],
    takeaway: "ベドウィンの移動生活が、砂漠を横断する交易を支えた。", note: "定住農業と遊牧・隊商が、同じ半島の中で共存していました。"
  }),
  makeScene({
    id: "trade-route-shift", chapter: 0, year: "6世紀後半", frame: [23, 12, 62, 43], zones: ["byzantine", "sasanian", "hijaz"], pins: ["alexandria", "ctesiphon", "hormuz", "mecca", "yemen"],
    routes: [{ points: [[29.92, 31.2], [36, 34], [44.58, 33.09], [56.46, 27.06]], kind: "rival", start: 0, end: .48 }, { points: [[56.46, 27.06], [44.2, 15.3], [39.83, 21.42], [29.92, 31.2]], kind: "trade", start: .48, end: 1 }],
    tags: [{ at: [29, 39], text: "東ローマ【ビザンツ】帝国" }, { at: [51, 38], text: "ササン朝" }, { at: [42, 34], text: "メソポタミア" }, { at: [39, 18], text: "ヒジャーズ地方" }],
    facts: ["もともとの主要交易路：メソポタミアの『オアシスの道』", "6世紀以降活発となった交易路：アラビア半島・ヒジャーズ経由"],
    actors: [{ name: "国境紛争を避ける商人", image: "quraysh-merchant", at: "hormuz", route: 1, bubble: "争いを避けて道を変えよう" }],
    title: "二大国の抗争で、\n交易路がヒジャーズへ移る。", kicker: "戦争が変えた商人の道", mapHeading: "オアシスの道からアラビア半島経由へ", focus: "国境紛争と交易路の変化",
    before: "東ローマ帝国とササン朝の国境紛争でオアシスの道が危険になる", after: "商人がヒジャーズ地方を通る交易路へ移る",
    body: ["6世紀後半、<strong>東ローマ【ビザンツ】帝国</strong>と<strong>ササン朝</strong>の<strong>国境紛争</strong>が激しくなり、<strong>メソポタミア</strong>を通る「<strong>オアシスの道</strong>」が危険になった。地図では<strong>アレクサンドリア</strong>・<strong>クテシフォン</strong>・<strong>ホルムズ</strong>を結ぶ、もともとの主要交易路を先に示す。", "商人は争いを避け、<strong>イエメン</strong>から<strong>アラビア半島</strong>西部の<strong>ヒジャーズ地方</strong>を通る道へ移った。地図の後半が、6世紀以降活発となった<strong>メッカ</strong>経由の交易路だ。"],
    takeaway: "二大国の抗争が、交易の重心をヒジャーズへ移した。", note: "動きをもう一度押すと、旧道から新道への切り替わりを最初から確認できます。"
  }),
  makeScene({
    id: "mecca-commerce", chapter: 0, year: "6世紀後半", frame: [36.8, 18.7, 42.8, 23.9], zones: ["hijaz"], pins: ["mecca"], facts: ["メッカ：農業に不向きな商業都市", "クライシュ族の大商人：国際的な中継貿易"],
    actors: [{ name: "クライシュ族の大商人", image: "quraysh-merchant", at: "mecca", bubble: "国際的な中継貿易で栄える" }],
    title: "メッカとクライシュ族が、\n中継貿易で栄える。", kicker: "ヒジャーズの商業都市", mapHeading: "交易路の中継地メッカ", focus: "クライシュ族と大商人", before: "交易路がメッカを通る", after: "クライシュ族の大商人が中継貿易で富を得る",
    body: ["農業に向かない<strong>メッカ</strong>は、食料も交易で得る<strong>商業都市</strong>になった。住民の<strong>クライシュ族</strong>は、広く商業に関わった。", "とくに<strong>大商人</strong>は、国際的な<strong>中継貿易</strong>によって大きな富を得た。"],
    takeaway: "交易路の変化が、メッカの繁栄を生んだ。", note: "この富と従来の信仰が、のちにムハンマドへの反発と結びつきます。"
  }),
  makeScene({
    id: "religions-kaaba", chapter: 0, year: "イスラーム以前", frame: [36.8, 18.7, 42.8, 23.9], pins: ["mecca"],
    tags: [{ at: [38.4, 23.2], text: "ユダヤ教" }, { at: [41.3, 23.2], text: "キリスト教" }, { at: [41.2, 20], text: "多神教" }], facts: ["アラブ人の多く：多神教徒", "メッカ：カーバ神殿【イスラームではカーバ聖殿】"],
    props: [{ name: "カーバ神殿【カーバ聖殿】", image: "kaaba-sanctuary", kind: "prop", at: "mecca", size: 82 }],
    title: "多神教の聖地メッカに、\nカーバ神殿が立つ。", kicker: "イスラーム以前の信仰", mapHeading: "ユダヤ教・キリスト教・多神教が伝わるアラビア", focus: "メッカとカーバ神殿", before: "アラビア半島にユダヤ教とキリスト教も伝わる", after: "アラブ人の多くは多神教を信じメッカのカーバ神殿を聖地とする",
    body: ["アラビア半島には<strong>ユダヤ教</strong>や<strong>キリスト教</strong>も伝わっていたが、<strong>アラブ人</strong>の多くは<strong>多神教</strong>を信じていた。", "<strong>メッカ</strong>はその聖地の一つで、<strong>カーバ神殿</strong>には多神教の神々が祭られていた。イスラーム教では<strong>カーバ聖殿</strong>とよぶ。"],
    takeaway: "イスラーム以前のカーバ神殿は、多神教の聖所だった。", note: "同じ建物が、のちに唯一神を礼拝する中心へ変わります。"
  }),
  makeScene({
    id: "muhammad-youth", chapter: 0, year: "570年頃〜", frame: [36.8, 18.7, 43.2, 24.4], pins: ["mecca"], facts: ["ムハンマド：クライシュ族ハーシム家", "孤児となり、親戚のもとで隊商貿易に従事"],
    props: [{ name: "ムハンマド（象徴の旗）", image: "prophet-banner", kind: "prop", at: "mecca", size: 58 }], actors: [{ name: "ハーシム家の隊商", image: "quraysh-merchant", at: "mecca", offset: [45, 0] }],
    title: "ムハンマドは、\n隊商貿易の中で育つ。", kicker: "クライシュ族ハーシム家", mapHeading: "メッカに生まれたムハンマド", focus: "孤児から隊商貿易へ", before: "ムハンマドがメッカのクライシュ族ハーシム家に生まれる", after: "孤児となり親戚に育てられ隊商貿易に携わる",
    body: ["6世紀後半、<strong>ムハンマド</strong>は<strong>メッカ</strong>の<strong>クライシュ族</strong>、その<strong>ハーシム家</strong>に生まれた。", "両親と祖父を失って<strong>孤児</strong>となり、父方の親戚に引き取られて<strong>隊商貿易</strong>に携わった。のちに結婚し、暮らしを築いた。"],
    takeaway: "ムハンマドは、商業都市メッカと隊商の世界で育った。", note: "この生い立ちと隊商経験が、次の啓示の場面へつながります。"
  }),
  makeScene({
    id: "revelation", chapter: 0, year: "610年頃", frame: [36.8, 18.7, 43.2, 24.4], pins: ["mecca"], tags: [{ at: [41.2, 23.1], text: "メッカ近郊の洞窟" }, { at: [41.5, 20.3], text: "唯一神アッラー" }],
    facts: ["天使ガブリエルを通じた啓示＝イスラーム教の始まり", "預言者ムハンマドの言葉→『コーラン【クルアーン】』"], props: [{ name: "天使ガブリエルの啓示", image: "prophet-banner", kind: "prop", at: [41.2, 23.1], size: 62 }],
    title: "アッラーの啓示から、\nイスラーム教が始まる。", kicker: "メッカ近郊の洞窟", mapHeading: "ムハンマドが啓示を受けた場所", focus: "天使ガブリエルと唯一神アッラー", before: "ムハンマドがメッカ近郊の洞窟で瞑想する", after: "天使ガブリエルを通じ神アッラーの啓示を受ける",
    body: ["40歳頃、<strong>ムハンマド</strong>が<strong>メッカ近郊の洞窟</strong>で瞑想していると、<strong>天使ガブリエル</strong>を通じて唯一神<strong>アッラー</strong>の<strong>啓示</strong>を受けた。", "ムハンマドは神の言葉を預かった<strong>預言者</strong>として帰依を説いた。これが<strong>イスラーム教</strong>の始まりで、20年以上にわたる啓示が聖典『<strong>コーラン【クルアーン】</strong>』にまとめられた。"],
    takeaway: "ムハンマドは、アッラーの言葉を伝える預言者となった。", note: "人物そのものを描かず、地図上では旗を象徴として用いています。"
  }),
  makeScene({
    id: "equality-idolatry", chapter: 0, year: "イスラーム教の特徴", frame: [36.8, 18.7, 43.2, 24.4], pins: ["mecca"], facts: ["偶像崇拝を厳格に禁止／カーバ聖殿の黒石", "ムスリムは部族・人種を越えて平等／聖職者を置かない"],
    props: [{ name: "カーバ聖殿の黒石", image: "kaaba-sanctuary", kind: "prop", at: "mecca", size: 82 }], actors: [{ name: "平等なムスリム", image: "arab-elder", at: "mecca", offset: [55, 0] }],
    title: "偶像を禁じ、\nムスリムの平等を説く。", kicker: "部族や人種を越える信仰", mapHeading: "カーバ聖殿とムスリム", focus: "偶像崇拝の禁止・平等・聖職者の否定", before: "多神教の偶像が信仰される", after: "偶像崇拝を禁じカーバ聖殿の黒石を信仰の中心とする",
    body: ["イスラーム教は<strong>偶像崇拝</strong>を厳格に禁じ、<strong>メッカ</strong>の<strong>カーバ聖殿の黒石</strong>を信仰の中心に置いた。", "イスラーム教徒である<strong>ムスリム</strong>は、<strong>部族</strong>や<strong>人種</strong>に関係なく神の前で平等とされ、神と人の間に立つ<strong>聖職者</strong>も認めない。"],
    takeaway: "偶像を置かず、ムスリムは神の前で平等とされた。", note: "カーバ聖殿そのものを神とみなす、という意味ではありません。"
  }),
  makeScene({
    id: "six-beliefs-five-pillars", chapter: 0, year: "信仰と実践", frame: [33, 14, 54, 30], pins: ["mecca"], routes: [{ points: [[50, 28], [44, 25], [39.83, 21.42]], kind: "move" }],
    tags: [{ at: [43, 28], text: "六信" }, { at: [49, 19], text: "五行" }], facts: ["六信：アッラー・天使・コーラン・預言者・来世・天命", "五行：信仰告白・礼拝・断食・喜捨・巡礼"],
    actors: [{ name: "礼拝・巡礼するムスリム", image: "arab-elder", at: [50, 28], route: 0 }], props: [{ name: "六信五行", image: "kaaba-sanctuary", kind: "prop", at: "mecca", size: 70 }],
    title: "六信五行が、\n信仰と実践の柱になる。", kicker: "何を信じ、何を行うか", mapHeading: "六信と五行をメッカへの動きで確認", focus: "六信五行", before: "ムスリムがアッラー・天使・コーラン・預言者・来世・天命を信じる", after: "信仰告白・礼拝・断食・喜捨・巡礼を実践する",
    body: ["<strong>ムスリム</strong>が何を信じるかを示す<strong>六信</strong>は、<strong>アッラー</strong>・<strong>天使</strong>・<strong>コーラン</strong>・<strong>預言者</strong>・<strong>来世</strong>・<strong>天命</strong>への信仰をいう。", "何を行うかを示す<strong>五行</strong>は、<strong>信仰告白</strong>・<strong>礼拝</strong>・<strong>断食</strong>・<strong>喜捨</strong>・<strong>巡礼</strong>をいう。巡礼では<strong>メッカ</strong>を訪れる。"],
    takeaway: "六信は信じる内容、五行は実践する行い。", note: "地図の移動は、各地のムスリムがメッカへ巡礼する向きを表します。"
  }),
  makeScene({
    id: "ramadan-life", chapter: 0, year: "生活全般の規定", frame: [36.8, 18.7, 43.2, 24.4], pins: ["mecca"], facts: ["ラマダーン（断食月）：昼間は飲食を断つ", "『コーラン』：政治・経済・社会・文化と生活／豚肉を禁じる"], props: [{ name: "『コーラン』の生活規定", image: "prophet-banner", kind: "prop", at: "mecca", size: 60 }],
    title: "『コーラン』は、\n毎日の暮らしも定める。", kicker: "ラマダーンと生活規定", mapHeading: "メッカから広がる『コーラン』の教え", focus: "ラマダーン（断食月）と豚肉の禁止", before: "ラマダーンに断食を行う", after: "『コーラン』が政治・経済・社会・文化と生活全般を規定する",
    body: ["<strong>メッカ</strong>から広がった教えでは、<strong>ラマダーン</strong>（<strong>断食月</strong>）の昼間に、食べ物だけでなく水も口にしない。", "『<strong>コーラン</strong>』は<strong>政治</strong>・<strong>経済</strong>・<strong>社会</strong>・<strong>文化</strong>を含む生活全般に関わり、<strong>豚肉</strong>を食べないことなども定める。"],
    takeaway: "イスラームの教えは、信仰だけでなく生活全般に関わる。", note: "最初の場面で示した『政治と宗教が一体』という特徴につながります。"
  }),
  makeScene({
    id: "persecution-hijra", chapter: 1, year: "622年", frame: [36, 18, 44, 27], zones: ["hijaz"], pins: ["mecca", "medina"], routes: [{ points: [[39.83, 21.42], [39.2, 23], [39.61, 24.47]], kind: "move" }],
    facts: ["ムハンマドと約70人のムスリム", "ヒジュラ【聖遷】＝イスラーム暦元年／純粋な太陰暦354・355日"],
    actors: [{ name: "ムハンマドと70人のムスリム", image: "prophet-banner", at: "mecca", route: 0, bubble: "メディナへ逃れよう" }, { name: "迫害する大商人・ハーシム家", image: "quraysh-merchant", at: "mecca", offset: [-45, 0] }],
    title: "迫害を逃れ、\nメディナへ聖遷する。", kicker: "ヒジュラ【聖遷】", mapHeading: "メッカからメディナ【ヤスリブ】へ", focus: "約70人の移住とイスラーム暦", before: "多神教の否定と富の独占批判でムハンマドが迫害される", after: "622年に約70人のムスリムがメディナへヒジュラする",
    body: ["<strong>ムハンマド</strong>が<strong>多神教</strong>を否定し、<strong>大商人</strong>による富の独占を批判すると、メッカの支配者は彼を迫害し、<strong>ハーシム家</strong>も守らなくなった。", "622年、ムハンマドは約<strong>70人</strong>の<strong>ムスリム</strong>と<strong>メッカ</strong>を離れ、<strong>メディナ【ヤスリブ】</strong>へ逃れた。これが<strong>ヒジュラ【聖遷】</strong>で、この年を元年とする純粋な<strong>太陰暦</strong>（354・355日）が<strong>イスラーム暦</strong>である。"],
    takeaway: "622年のヒジュラが、イスラーム暦の起点になった。", note: "移動の理由、人数、目的地、暦までを一つの流れで示します。"
  }),
  makeScene({
    id: "ummah-defense", chapter: 1, year: "622〜629年", frame: [36, 18, 44, 27], zones: ["islamCore"], pins: ["mecca", "medina"],
    routes: [{ points: [[39.83, 21.42], [39.4, 23], [39.61, 24.47]], kind: "rival" }, { points: [[39.61, 24.47], [39.4, 23], [39.83, 21.42]], kind: "campaign", start: .35 }],
    facts: ["ウンマ＝メディナのイスラーム信仰共同体", "政治と宗教が一体／ムスリムに共同体防衛の義務"],
    actors: [{ name: "ウンマを率いるムハンマド", image: "prophet-banner", at: "medina", bubble: "共同体を守る" }, { name: "クライシュ族のメッカ軍", image: "arab-warrior", at: "mecca", route: 0 }],
    title: "メディナでウンマを築き、\nメッカ軍を退ける。", kicker: "信仰共同体の成立", mapHeading: "メディナのウンマとクライシュ族", focus: "政治と宗教が一体の共同体", before: "クライシュ族のメッカ軍がメディナへ向かう", after: "ウンマが攻撃を退けアラビア半島の諸部族と同盟する",
    body: ["<strong>メディナ</strong>でムハンマドは、イスラームの信仰共同体<strong>ウンマ</strong>をつくった。政治と宗教が一体で、すべての<strong>ムスリム</strong>が属し、共同体を守るため武装して戦う義務も負った。", "ウンマは<strong>クライシュ族</strong>の<strong>メッカ</strong>軍を退け、<strong>アラビア半島の諸部族</strong>と同盟して味方を増やした。"],
    takeaway: "ウンマは、信仰・政治・防衛を結ぶ共同体だった。", note: "地図の二方向の矢印で、来襲と防衛を区別しています。"
  }),
  makeScene({
    id: "mecca-unification", chapter: 1, year: "630〜632年", frame: [34, 12, 55, 31], zones: ["islamCore"], pins: ["mecca", "medina"],
    routes: [{ points: [[39.61, 24.47], [39.83, 21.42]], kind: "campaign", start: 0, end: .55 }, { points: [[39.83, 21.42], [44.2, 15.3]], kind: "move", start: .55 }],
    facts: ["1万人の軍／630年メッカ無血征服／アラビア半島統一", "メッカ巡礼後の632年にムハンマド死去／墓のあるメディナは第二の聖地"],
    actors: [{ name: "1万人のムハンマド軍", image: "arab-cavalry", at: "medina", route: 0, bubble: "メッカへ" }, { name: "降伏するクライシュ族", image: "quraysh-merchant", at: "mecca", offset: [45, 0] }], props: [{ name: "メッカ無血征服（630年）", image: "kaaba-sanctuary", kind: "prop", at: "mecca", size: 72, offset: [-45, 0] }],
    title: "1万人の軍でメッカを無血征服し、\n半島を統一する。", kicker: "共同体から半島統一へ", mapHeading: "メディナからメッカ、アラビア半島統一へ", focus: "630年の無血征服と632年の死", before: "1万人に増えたムハンマド軍がメッカへ進む", after: "クライシュ族が降伏しアラビア半島が統一される",
    body: ["約<strong>1万人</strong>に増えた<strong>ムハンマド</strong>軍を見て、<strong>クライシュ族</strong>は降伏した。630年の<strong>メッカ無血征服</strong>後、周辺部族にも勝って<strong>アラビア半島</strong>を統一した。", "ムハンマドは信者と<strong>メッカ巡礼</strong>を行ったのち病に倒れ、632年に死去した。墓のある<strong>メディナ</strong>は<strong>第二の聖地</strong>となった。"],
    takeaway: "630年にメッカを無血征服し、632年までに半島をまとめた。", note: "メッカは第一の聖地、ムハンマドの墓があるメディナは第二の聖地です。"
  }),
  makeScene({
    id: "caliph-selection", chapter: 2, year: "632年", frame: [36, 18, 44, 27], zones: ["islamCore"], pins: ["medina"], facts: ["カリフ：ウンマ【イスラーム国家】の後継指導者／ムハンマドは最後の預言者", "選挙制で選ぶ正統カリフ：最初の4人／初代アブー＝バクル"],
    actors: [{ name: "初代カリフ アブー＝バクル", image: "abu-bakr-calm", at: "medina", bubble: "軍とウンマを導く" }], props: [{ name: "ジハード【聖戦】", image: "prophet-banner", kind: "prop", at: "medina", size: 50, offset: [48, 0] }],
    title: "信者の総意で、\n正統カリフを選ぶ。", kicker: "ムハンマドの後継者", mapHeading: "メディナで選ばれた初代カリフ", focus: "アブー＝バクルと正統カリフ", before: "ムハンマドが後継者を決めずに死去する", after: "ウンマがアブー＝バクルを初代カリフに選ぶ",
    body: ["ムハンマドの死後、軍を指揮し異教徒との<strong>ジハード【聖戦】</strong>を進めるため、<strong>ウンマ【イスラーム国家】</strong>には後継者が必要だった。<strong>メディナ</strong>の有力者は話し合いによる<strong>選挙制</strong>で、<strong>アブー＝バクル</strong>を<strong>カリフ</strong>に選んだ。", "信者の総意で選ばれた最初の4人を<strong>正統カリフ</strong>という。ムハンマドが<strong>最後の預言者</strong>なので、カリフに神の啓示や宗教的権限はなく、政治・軍事・社会の指導者だった。"],
    takeaway: "カリフは預言者ではなく、ウンマの政治・軍事の指導者。", note: "『後継者』が何を引き継ぎ、何を引き継がないかが重要です。"
  }),
  makeScene({
    id: "abu-bakr-reconquest", chapter: 2, year: "632〜634年", frame: [33, 11, 56, 31], zones: ["arabia"], pins: ["medina"], routes: [{ points: [[39.61, 24.47], [47, 24]], kind: "campaign" }, { points: [[39.61, 24.47], [44.2, 15.3]], kind: "campaign" }],
    tags: [{ at: [49, 20], text: "アラビア半島の諸部族" }], facts: ["アブー＝バクル：離反した諸部族を討伐しアラビア半島を再征服", "次の段階：アラブの大征服"], actors: [{ name: "アブー＝バクルの討伐軍", image: "arab-warrior", at: "medina", route: 1, bubble: "政治的な離反を鎮める" }],
    title: "離反部族を討ち、\nアラビア半島を再征服する。", kicker: "政教一致を守る戦い", mapHeading: "メディナから半島各地への討伐", focus: "アブー＝バクルとアラブの大征服", before: "アラビア半島の諸部族が政治的な服従を拒む", after: "アブー＝バクルが半島を再征服しアラブの大征服へ進む",
    body: ["<strong>アブー＝バクル</strong>の即位後、<strong>アラビア半島の諸部族</strong>は「信仰は続けても政治的には従わない」と離反した。", "彼は<strong>メディナ</strong>から討伐軍を送り、政治だけの自立を認めず<strong>アラビア半島を再征服</strong>した。ここから領土を外へ広げる「<strong>アラブの大征服</strong>」が始まる。"],
    takeaway: "半島の再統一が、外への大征服の出発点になった。", note: "信仰共同体と国家が一体だったため、政治的離反も討伐の対象になりました。"
  }),
  makeScene({
    id: "weakened-empires", chapter: 2, year: "7世紀前半", frame: [24, 15, 63, 43], zones: ["byzantine", "sasanian", "arabia"], pins: [], tags: [{ at: [29, 38], text: "東ローマ帝国" }, { at: [53, 37], text: "ササン朝" }], facts: ["二大国：長い国境紛争で弱体化", "アラブのイスラーム軍：北方へ対外発展"], actors: [{ name: "アラブのイスラーム軍", image: "arab-cavalry", at: [39.61, 24.47], bubble: "弱った二大国の境へ" }],
    title: "二大帝国の疲弊が、\n大征服の条件をつくる。", kicker: "北方への対外発展", mapHeading: "東ローマ帝国とササン朝の間へ", focus: "アラブの大征服が進んだ背景", before: "ササン朝と東ローマ帝国が国境紛争を続ける", after: "弱った二大国へアラブのイスラーム軍が進出する",
    body: ["アラビア半島の北では、<strong>ササン朝</strong>と<strong>東ローマ帝国</strong>が長い国境紛争で弱っていた。", "その間へ<strong>アラブのイスラーム軍</strong>が進出できる条件が整い、<strong>アラブの大征服</strong>が本格化した。"],
    takeaway: "二大帝国の消耗が、アラブ軍の進出を助けた。", note: "交易路を変えた同じ抗争が、今度は征服の背景になります。"
  }),
  makeScene({
    id: "umar-west", chapter: 2, year: "634〜644年", frame: [26, 18, 44, 36], zones: ["byzantine", "caliphateExpanded"], pins: ["medina", "damascus", "alexandria"], routes: [{ points: [[39.61, 24.47], [36.29, 33.51]], kind: "campaign", start: 0, end: .52 }, { points: [[36.29, 33.51], [29.92, 31.2]], kind: "campaign", start: .52 }],
    tags: [{ at: [34, 35], text: "シリア" }, { at: [29, 28], text: "エジプト" }, { at: [29, 38], text: "東ローマ帝国" }], facts: ["第2代正統カリフ：ウマル", "東ローマ帝国からシリア・エジプトを奪う"], actors: [{ name: "ウマルのアラブ軍", image: "umar-march", afterImage: "umar-calm", at: "medina", route: 0, bubble: "ウンマを西へ広げる" }],
    title: "ウマルはシリアを奪い、\nエジプトへ進む。", kicker: "第2代正統カリフの征服", mapHeading: "メディナからシリア・アレクサンドリアへ", focus: "ウマルとウンマの西方拡大", before: "第2代正統カリフのウマル軍がシリアへ進む", after: "東ローマ帝国からシリアとエジプトを奪いアレクサンドリアへ入る",
    body: ["<strong>第2代正統カリフ</strong>の<strong>ウマル</strong>の時代、<strong>ウンマ</strong>は<strong>メディナ</strong>から一気に拡大した。まず<strong>東ローマ帝国</strong>を破って<strong>シリア</strong>の<strong>ダマスクス</strong>へ進んだ。", "さらに<strong>アレクサンドリア</strong>へ攻め込み、<strong>エジプト</strong>を征服した。"],
    takeaway: "ウマルは、東ローマ帝国からシリアとエジプトを奪った。", note: "進軍を二段階にし、シリアの次にエジプトへ進んだ順番を示します。"
  }),
  makeScene({
    id: "umar-east", chapter: 2, year: "642年", frame: [38, 25, 59, 40], zones: ["sasanian", "caliphateExpanded"], pins: ["ctesiphon", "nihavand"], routes: [{ points: [[40, 31], [44.58, 33.09]], kind: "campaign", start: 0, end: .48 }, { points: [[44.58, 33.09], [48.37, 34.19], [55, 35]], kind: "campaign", start: .48 }],
    tags: [{ at: [45, 29], text: "イラク" }, { at: [54, 37], text: "イラン高原" }, { at: [54, 31], text: "ササン朝" }], facts: ["ササン朝の都クテシフォンを攻略、王が敗走", "ニハーヴァンドの戦い【642年】で圧勝→ササン朝が事実上崩壊"], actors: [{ name: "ウマル時代のアラブ軍", image: "umar-march", afterImage: "umar-calm", at: [40, 31], route: 0 }],
    title: "クテシフォンを攻略し、\nニハーヴァンドで圧勝する。", kicker: "ササン朝の事実上の崩壊", mapHeading: "イラクからイラン高原へ", focus: "ニハーヴァンドの戦い【642年】", before: "アラブ軍がササン朝の都クテシフォンを攻略する", after: "642年ニハーヴァンドの戦いに勝ちイラクからイラン高原を支配する",
    body: ["東では<strong>ササン朝</strong>の都<strong>クテシフォン</strong>を攻略して王を敗走させ、<strong>イラク</strong>へ支配を広げた。", "642年の<strong>ニハーヴァンドの戦い</strong>で圧勝すると、ササン朝は事実上崩壊し、<strong>イラン高原</strong>までが支配下に入った。"],
    takeaway: "クテシフォン攻略の後、642年の勝利でササン朝を崩した。", note: "クテシフォン攻略からニハーヴァンドの勝利へ、順番を分けて表示します。", battle: "nihavand"
  }),
  makeScene({
    id: "misr-cities", chapter: 2, year: "大征服後", frame: [27, 24, 52, 36], zones: ["caliphateExpanded"], pins: ["fustat", "kufa", "basra"], facts: ["ミスル【軍営都市】：征服地を支配する拠点", "フスタート・クーファ・バスラを建設"], props: [{ name: "ミスル【軍営都市】", image: "misr-fortress", kind: "prop", at: "kufa", size: 78 }], actors: [{ name: "アラブ人の駐屯軍", image: "arab-warrior", at: "fustat" }],
    title: "三つのミスルを築き、\n征服地を固める。", kicker: "軍営都市による支配", mapHeading: "フスタート・クーファ・バスラ", focus: "ミスル【軍営都市】", before: "征服した地域にアラブ人の軍を置く", after: "フスタート・クーファ・バスラのミスルから支配を固める",
    body: ["広がった征服地には、<strong>ミスル【軍営都市】</strong>を築いてアラブ人の軍を駐屯させた。", "エジプトの<strong>フスタート</strong>、イラクの<strong>クーファ</strong>と<strong>バスラ</strong>が代表的なミスルとなり、支配の拠点になった。"],
    takeaway: "ミスルは、征服地を軍事的に支える新しい都市だった。", note: "三都市の位置を並べ、軍営都市としての共通点を示します。"
  }),
  makeScene({
    id: "people-of-book", chapter: 2, year: "征服地の統治", frame: [27, 23, 53, 38], zones: ["caliphateExpanded"], pins: [], tags: [{ at: [30, 35], text: "キリスト教徒" }, { at: [37, 36], text: "ユダヤ教徒" }], facts: ["啓典の民：ユダヤ教徒・キリスト教徒", "ジズヤを納めれば信仰の自由を保証"], actors: [{ name: "啓典の民", image: "arab-elder", at: [34, 31], bubble: "ジズヤを納め信仰を守る" }],
    title: "統治を大きく変えず、\n啓典の民の信仰を認める。", kicker: "反発を抑えた支配", mapHeading: "広い征服地と啓典の民", focus: "ジズヤと信仰の自由", before: "アラブ人が征服地の統治体制をほぼ維持する", after: "ユダヤ教徒とキリスト教徒がジズヤを納め信仰の自由を得る",
    body: ["<strong>アラブ人</strong>は征服地の統治体制をほとんど変えず、征服された人びとの反発を抑えた。", "一神教を信じる<strong>ユダヤ教徒</strong>と<strong>キリスト教徒</strong>は「<strong>啓典の民</strong>」とされ、<strong>ジズヤ</strong>を納めれば<strong>信仰の自由</strong>を認められた。"],
    takeaway: "統治を大きく変えず、ジズヤと引き換えに信仰を認めた。", note: "広い征服地を一色で示し、統治方法に注目します。"
  }),
  makeScene({
    id: "uthman-quran", chapter: 2, year: "644〜656年", frame: [28, 22, 51, 37], zones: ["caliphateExpanded"], pins: ["medina", "damascus", "kufa", "basra"], routes: [{ points: [[39.61, 24.47], [36.29, 33.51]], kind: "move" }, { points: [[39.61, 24.47], [44.4, 32.03], [47.78, 30.51]], kind: "move" }],
    facts: ["第3代カリフ ウスマーン：ウマイヤ家・クライシュ族／ムハンマドの教えを『コーラン』に統一", "ウンマの古参ムスリムが同族優遇に反発し656年暗殺"], actors: [{ name: "ウスマーン", image: "uthman-calm", at: "medina", bubble: "『コーラン』を各地へ送る" }, { name: "古参ムスリム", image: "arab-warrior", at: "medina", offset: [50, 0] }], props: [{ name: "『コーラン』の正本", image: "prophet-banner", kind: "prop", at: "medina", size: 48, route: 1 }],
    title: "ウスマーンはコーランを整えるが、\n同族優遇で暗殺される。", kicker: "第3代カリフと内乱", mapHeading: "メディナから各地へ送られた『コーラン』", focus: "ウスマーンとウマイヤ家", before: "領土拡大で『コーラン』を口承だけで伝えるのが難しくなる", after: "正本を各地へ送る一方ウマイヤ家優遇への反発で暗殺される",
    body: ["ウマルの次に、<strong>クライシュ族</strong>の有力家系<strong>ウマイヤ家</strong>出身の<strong>ウスマーン</strong>が第3代カリフになった。領土拡大で口承が難しくなったため、ムハンマドの教えを現在の『<strong>コーラン</strong>』の形にまとめ、<strong>メディナ</strong>から<strong>ダマスクス</strong>、<strong>クーファ</strong>、<strong>バスラ</strong>など各地へ送った。", "しかしウマイヤ家は<strong>メッカ征服</strong>までムハンマドに敵対した家系で、ウスマーンは同族を優遇した。<strong>ヒジュラ</strong>をともにした古参ムスリムが反発し、<strong>ウンマ</strong>は内乱となり、656年にウスマーンは暗殺された。"],
    takeaway: "コーランの統一と、ウマイヤ家優遇への反発が同時に進んだ。", note: "二本の線は、メディナからシリアとイラク方面へ正本を送る動きを表します。", capital: "medina"
  }),
  makeScene({
    id: "ali-muawiya", chapter: 2, year: "656〜661年", frame: [33, 21, 49, 38], zones: ["caliphateExpanded"], pins: ["medina", "kufa", "damascus"], routes: [{ points: [[39.61, 24.47], [44.4, 32.03]], kind: "move", start: 0, end: .48 }, { points: [[36.29, 33.51], [40, 34], [44.4, 32.03]], kind: "rival", start: .48 }], tags: [{ at: [35, 36], text: "シリア" }, { at: [42, 36], text: "ハワーリジュ派" }],
    facts: ["第4代カリフ アリー：ムハンマドの従弟・娘ファーティマの夫／クーファ遷都", "シリア総督ムアーウィヤ（ウマイヤ家）が対抗／ハワーリジュ派がアリーを暗殺→ウマイヤ朝"],
    actors: [{ name: "アリー", image: "ali-march", afterImage: "ali-calm", at: "medina", route: 0, bubble: "クーファへ遷都する" }, { name: "ムアーウィヤ（シリア総督）", image: "muawiya-calm", afterImage: "muawiya-ruler", at: "damascus", route: 1, bubble: "カリフを名乗る" }, { name: "ハワーリジュ派", image: "arab-warrior", at: "kufa", offset: [52, 0], from: .55 }],
    title: "アリーとムアーウィヤが対立し、\n正統カリフ時代が終わる。", kicker: "クーファ遷都と内乱", mapHeading: "メディナからクーファへ、シリアから対抗", focus: "アリー・ムアーウィヤ・ハワーリジュ派", before: "古参ムスリムがアリーを第4代カリフに選ぶ", after: "クーファ遷都後も内乱が続きハワーリジュ派がアリーを暗殺する",
    body: ["<strong>メディナ</strong>の古参ムスリムに支持された<strong>アリー</strong>は、ムハンマドの従弟で、娘<strong>ファーティマ</strong>の夫だった。第4代<strong>カリフ</strong>になると<strong>クーファ遷都</strong>に踏み切った。", "ところが<strong>ウマイヤ家</strong>の<strong>シリア総督ムアーウィヤ</strong>が<strong>ダマスクス</strong>を足場に反発してカリフを名乗った。和解に反対する<strong>ハワーリジュ派</strong>がアリーを暗殺し、ムアーウィヤが<strong>ウマイヤ朝</strong>を開くことになる。"],
    takeaway: "アリー暗殺で正統カリフ時代が終わり、ウマイヤ朝へ移る。", note: "内乱、和解への反対、暗殺という因果関係を地図上の対立で示します。", capital: "kufa"
  }),
  makeScene({
    id: "development-centers", chapter: 2, year: "三時代の中心地", frame: [24, 17, 51, 44], zones: ["umayyadPreview", "caliphateExpanded", "islamCore"], pins: ["constantinople", "damascus", "baghdad", "medina", "mecca", "alexandria"],
    routes: [{ points: [[39.83, 21.42], [39.61, 24.47]], kind: "move" }],
    facts: ["ムハンマド時代→正統カリフ時代→ウマイヤ朝時代", "ヒジュラ【622】：メッカからメディナへ"],
    tags: [{ at: [29, 43], text: "ウマイヤ朝時代" }, { at: [48, 40], text: "正統カリフ時代" }, { at: [47, 18], text: "ムハンマド時代" }],
    title: "三つの時代と、\n六つの中心地を重ねる。", kicker: "イスラームの発展を見渡す", mapHeading: "ムハンマド時代・正統カリフ時代・ウマイヤ朝時代", focus: "ヒジュラ【622】と六つの都市", before: "メッカからメディナへヒジュラする", after: "正統カリフ時代を経てウマイヤ朝時代へ領域が広がる",
    body: ["地図の色を重ねると、<strong>ムハンマド時代</strong>のアラビア半島から、<strong>正統カリフ時代</strong>のシリア・エジプト・イラク・イランへ、さらに<strong>ウマイヤ朝時代</strong>へと領域が広がる。出発点は<strong>ヒジュラ【622】</strong>だった。", "中心地の位置は、<strong>メッカ</strong>、<strong>メディナ</strong>、<strong>アレクサンドリア</strong>、<strong>ダマスクス</strong>、<strong>バグダード</strong>、<strong>コンスタンティノープル</strong>で確認する。"],
    takeaway: "三時代の領域と、歴史をたどる六都市の位置を結びつける。", note: "色は時代ごとの広がりを比べるための模式図です。"
  }),
  makeScene({
    id: "development-west", chapter: 2, year: "732年までの西方", frame: [-12, 24, 42, 50], zones: ["umayyadPreview"], pins: ["damascus", "alexandria", "tours"],
    routes: [{ points: [[36.29, 33.51], [29.92, 31.2], [15, 38], [0.68, 46.58]], kind: "campaign" }],
    facts: ["西方への広がり：ダマスクス→アレクサンドリア→イベリア方面", "トゥール・ポワティエ間の戦い【732】"],
    tags: [{ at: [13, 47], text: "ウマイヤ朝時代" }],
    title: "西への広がりは、\nトゥール・ポワティエへ至る。", kicker: "発展地図の西半分", mapHeading: "ダマスクスから西方へ", focus: "トゥール・ポワティエ間の戦い【732】", before: "ウマイヤ朝時代にダマスクスからアレクサンドリアを経て西へ進む", after: "トゥール・ポワティエ間の戦い【732】へ至る",
    body: ["<strong>ウマイヤ朝時代</strong>の西方では、<strong>ダマスクス</strong>から<strong>アレクサンドリア</strong>を経て、イベリア方面へ領域が広がる。", "その先の位置に、<strong>トゥール・ポワティエ間の戦い【732】</strong>を置く。詳しい経緯は次の教材でたどる。"],
    takeaway: "西方への広がりを、732年の戦いの位置まで見通す。", note: "一枚の広域地図を西半分に分け、地名の重なりを避けています。"
  }),
  makeScene({
    id: "development-east", chapter: 2, year: "642〜751年の東方", frame: [35, 15, 78, 49], zones: ["umayyadPreview", "caliphateExpanded", "islamCore"], pins: ["mecca", "medina", "baghdad", "nihavand", "talas"],
    routes: [{ points: [[39.83, 21.42], [39.61, 24.47]], kind: "move", start: 0, end: .2 }, { points: [[39.61, 24.47], [48.37, 34.19]], kind: "campaign", start: .2, end: .55 }, { points: [[44.37, 33.31], [72.24, 42.52]], kind: "campaign", start: .55 }],
    facts: ["ニハーヴァンドの戦い【642】：正統カリフ時代の東方拡大", "タラス河畔の戦い【751】：さらに東へ進んだ時代の目印"],
    tags: [{ at: [57, 47], text: "ウマイヤ朝時代" }, { at: [52, 40], text: "正統カリフ時代" }, { at: [46, 18], text: "ムハンマド時代" }],
    title: "東への広がりは、\nニハーヴァンドからタラスへ続く。", kicker: "発展地図の東半分", mapHeading: "メッカ・メディナから中央アジア方面へ", focus: "ニハーヴァンド【642】とタラス河畔【751】", before: "ムハンマド時代のメッカ・メディナから正統カリフ時代にニハーヴァンドへ進む", after: "バグダードを位置の基準にタラス河畔の戦い【751】まで見渡す",
    body: ["東方では、<strong>ムハンマド時代</strong>の<strong>メッカ</strong>・<strong>メディナ</strong>から、<strong>正統カリフ時代</strong>の<strong>ニハーヴァンドの戦い【642】</strong>へ進む。<strong>バグダード</strong>も位置の基準になる。", "<strong>ウマイヤ朝時代</strong>を越えてさらに東へ続く流れの先に、<strong>タラス河畔の戦い【751】</strong>を置く。詳しい経緯は次の教材でたどる。"],
    takeaway: "アラビアからイラン高原を越え、中央アジア方面へ広がる。", note: "発展地図を東半分に分け、年代順の移動を見やすくしました。"
  })
];
