// 01 イスラーム教の成立と正統カリフ（全15場面）
// 参考書 第20回「イスラーム世界の形成」（p.316〜p.320）の内容を網羅

export const places = {
  mecca: { name: "メッカ", point: [39.83, 21.42] },
  medina: { name: "メディナ（ヤスリブ）", point: [39.61, 24.47] },
  damascus: { name: "ダマスクス", point: [36.29, 33.51] },
  jerusalem: { name: "エルサレム", point: [35.21, 31.77] },
  alexandria: { name: "アレクサンドリア", point: [29.92, 31.20] },
  fustat: { name: "フスタート", point: [31.24, 30.00] },
  basra: { name: "バスラ", point: [47.78, 30.51] },
  kufa: { name: "クーファ", point: [44.40, 32.03] },
  ctesiphon: { name: "クテシフォン", point: [44.58, 33.09] },
  nihavand: { name: "ニハーヴァンド", point: [48.37, 34.19] },
  siffin: { name: "シッフィーン", point: [38.5, 35.8] },
  yemen: { name: "イエメン", point: [44.2, 15.3] },
};

export const zones = {
  byzantine: { color: "#54728c", points: [[25, 42], [35, 42], [37, 36], [34, 31], [28, 31], [25, 35]] },
  sasanian: { color: "#8b5648", points: [[44, 38], [52, 38], [60, 36], [62, 30], [54, 27], [46, 30], [43, 34]] },
  islam_core: { color: "#3a7d44", points: [[38, 28], [42, 28], [44, 22], [41, 19], [37, 21]] },
  caliphate_expanded: { color: "#43894e", points: [[28, 32], [37, 37], [48, 38], [58, 36], [55, 27], [46, 18], [37, 18], [30, 25]] },
};

const point = p => typeof p === "string" ? places[p].point : p;
const route = (points, kind = "campaign", options = {}) => ({ points: points.map(point), kind, ...options });
const person = (name, image, at, options = {}) => ({ name, image, at, ...options });
const prop = (name, image, at, options = {}) => ({ name, image, at, kind: "prop", ...options });
const scene = s => ({ frame: [28, 14, 58, 38], zones: [], pins: [], routes: [], tags: [], facts: [], actors: [], props: [], duration: 3400, ...s });

export const scenes = [
  // 章一：砂漠の交易路と預言者ムハンマド
  scene({
    id: "trade-route", chapter: 0, year: "6世紀後半", kicker: "砂漠を行き交う隊商",
    title: "交易路の変化で、\nメッカが繁栄する。",
    body: [
      "6世紀、ササン朝ペルシアとビザンツ帝国（東ローマ帝国）の長い抗争により、従来のシルクロード（陸上交易路）が寸断された。",
      "商人たちは危険を避けてアラビア半島を経由する新ルートを利用。中継地となった<strong>商業都市メッカ</strong>やヤスリブ（メディナ）が急速に発展した。"
    ],
    takeaway: "二大帝国の対立 → アラビア半島の交易路が栄え、メッカが急成長。",
    note: "メッカは古くからアラビア多神教の聖地でもあり、アラビア各地から巡礼者が集まる拠点でした。",
    focus: "メッカと交易路", mapHeading: "アラビア半島の隊商ルート",
    before: "ササン朝とビザンツの対立を避けて南下", after: "メッカが東西交易の重要拠点に",
    zones: ["byzantine", "sasanian"], pins: ["mecca", "medina", "damascus", "yemen"],
    routes: [route(["yemen", "mecca", "medina", "damascus"], "trade")],
    tags: [{ at: [30, 37], text: "ビザンツ帝国" }, { at: [50, 33], text: "ササン朝ペルシア" }],
    facts: ["交易路：紅海東岸の陸路", "中心都市：メッカ・ヤスリブ"],
    actors: [person("アラブ商人", "quraysh-merchant", "mecca", { offset: [30, 0], bubble: "メッカが大繁盛だ！" })]
  }),
  scene({
    id: "quraysh-greed", chapter: 0, year: "6世紀末〜7世紀初頭", kicker: "富の独占と社会不安",
    title: "クライシュ族が富を握り、\n貧富の格差が広がる。",
    body: [
      "メッカを支配していたのは強力な<strong>クライシュ族</strong>の大商人たち。隊商貿易の利益を独占し、富豪と貧困層の格差が深刻化した。",
      "クライシュ族は<strong>カーバ神殿</strong>に祀られた多数の偶像崇拝を利用して巡礼者から富を集めたが、部族間の血の復讐など社会秩序は乱れていた。"
    ],
    takeaway: "クライシュ族の富の独占 ＋ 多神教信仰 → 社会不安の増大。",
    note: "クライシュ族の中でも、富裕なウマイヤ家と、やや貧しいハーシム家などの格差も存在しました。",
    focus: "メッカの社会矛盾", mapHeading: "メッカの繁栄とカーバ神殿",
    before: "大商人がカーバ神殿の偶像で儲ける", after: "貧富の差が広がり、社会不安が高まる",
    pins: ["mecca"], capital: "mecca",
    facts: ["支配部族：クライシュ族", "聖所：カーバ神殿（多神教偶像）"],
    actors: [
      person("クライシュ族商人", "quraysh-merchant", "mecca", { offset: [-30, 0], bubble: "富は我らのもの！" }),
      prop("カーバ神殿", "kaaba-sanctuary", "mecca", { offset: [32, 0] })
    ]
  }),
  scene({
    id: "revelation", chapter: 0, year: "610年頃", kicker: "ヒラー山での天啓",
    title: "ムハンマドに、\n唯一神アッラーの啓示が下る。",
    body: [
      "クライシュ族のハーシム家に生まれた<strong>ムハンマド</strong>（570年頃生）。孤児として育ち、裕福な未亡人<strong>ハディージャ</strong>と結婚して隊商を率いた。",
      "40歳頃、メッカ郊外のヒラー山の洞窟で瞑想中、天使ジブリール（ガブリエル）を通じて<strong>唯一神アッラーの啓示</strong>を受け、預言者としての自覚を得た。"
    ],
    takeaway: "610年頃・ムハンマドが唯一神アッラーの啓示を受ける。",
    note: "ムハンマドは神そのものではなく、神の言葉を人々に伝える「最後にして最大の預言者（使徒）」と位置づけられます。",
    focus: "預言者ムハンマド", mapHeading: "ヒラー山とメッカ",
    before: "瞑想の中で天使ジブリールが現れる", after: "唯一神の言葉を人々に語り始める",
    pins: ["mecca"],
    facts: ["誕生：570年頃・ハーシム家", "妻：ハディージャ", "啓示：610年頃"],
    actors: [
      person("教団の象徴", "prophet-banner", "mecca", { offset: [-30, 0], bubble: "神の啓示が下った" }),
      person("ハディージャ", "khadija-merchant", "mecca", { offset: [30, 0], bubble: "あなたを信じます" })
    ]
  }),
  scene({
    id: "quran-teachings", chapter: 0, year: "610年代", kicker: "神の前での平等",
    title: "コーランの教えは、\n偶像崇拝を否定し平等を説く。",
    body: [
      "ムハンマドが語った神の言葉は『<strong>コーラン（クルアーン）</strong>』としてまとめられた。偶像崇拝を厳しく否定し、<strong>神の前での人間の平等</strong>を説いた。",
      "この世の終わりには「<strong>最後の審判</strong>」があり、信徒は天国へ、不信者は地獄に落ちると教えたため、貧しい人々や虐げられた人々に希望を与えた。"
    ],
    takeaway: "コーランの教え＝唯一神信仰・偶像崇拝否定・神の前の平等・最後の審判。",
    note: "コーランは神からアラビア語で直接下された啓示とされるため、正文の翻訳は禁じられました。",
    focus: "イスラームの教え", mapHeading: "メッカに広がる新しい教え",
    before: "偶像崇拝を捨て、神の前の平等を説く", after: "虐げられた人々が信徒に加わる",
    pins: ["mecca"],
    facts: ["経典：コーラン（アラビア語）", "教義：神の前の平等・最後の審判"],
    actors: [
      person("イスラームの旗", "prophet-banner", "mecca", { offset: [-28, 0], bubble: "アッラーの前に皆平等！" }),
      person("アブー＝バクル", "abu-bakr-calm", "mecca", { offset: [28, 0], bubble: "真理に従おう" })
    ]
  }),
  scene({
    id: "faith-duties", chapter: 0, year: "教義の確立", kicker: "信じる柱と行う義務",
    title: "「六信五行」が、\n信徒の日常を支える柱になる。",
    body: [
      "イスラーム教の教えは、信じるべき6つの基本「<strong>六信</strong>」と、実践すべき5つの義務「<strong>五行</strong>」に整理された。",
      "神・天使・諸経典・預言者・来世・天命を信じ（六信）、<strong>信仰告白・礼拝（1日5回）・喜捨・断食（ラマダーン）・巡礼</strong>（五行）を行うことで強い絆を結んだ。"
    ],
    takeaway: "六信（信じる柱） ＋ 五行（実践する義務）＝ ムスリムの生き方。",
    note: "喜捨（ザカート）は困窮者を助ける財産税であり、共同体内の福祉の役割も果たしました。",
    focus: "六信五行", mapHeading: "イスラームの基本生活規定",
    before: "信仰と日常の実践が一体となる", after: "教徒（ムスリム）の強い連帯が生まれる",
    pins: ["mecca"],
    facts: ["六信：神・天使・経典・預言者・来世・天命", "五行：信仰告白・礼拝・喜捨・断食・巡礼"],
    actors: [
      person("イスラームの旗", "prophet-banner", "mecca", { offset: [-30, 0] }),
      person("敬虔な信徒", "abu-bakr-calm", "mecca", { offset: [30, 0], bubble: "五行を実践する" })
    ]
  }),

  // 章二：聖遷と教団国家の誕生
  scene({
    id: "hijra", chapter: 1, year: "622年", kicker: "迫害を逃れて北へ",
    title: "ヒジュラ（聖遷）により、\nメッカからメディナへ脱出。",
    body: [
      "偶像崇拝の否定や平等の教えは、カーバ神殿の巡礼で私腹を肥やすクライシュ族の大商人にとって容認できない脅威だった。信徒への激しい迫害が始まる。",
      "622年、ムハンマドは信徒を率いて北方のオアシス都市<strong>ヤスリブ（メディナ）</strong>へ移住。この「<strong>ヒジュラ（聖遷）</strong>」の年がイスラーム暦（ヒジュラ暦）元年となった。"
    ],
    takeaway: "622年・ヒジュラ（聖遷）＝ メッカからメディナへ。イスラーム暦元年。",
    note: "語呂合わせ：「群れに（622）加わるヒジュラかな」。ヤスリブは後に「預言者の町（メディナ）」と改称されました。",
    focus: "ヒジュラ（聖遷）", mapHeading: "メッカからメディナへの移動",
    before: "迫害を逃れ、北のメディナへ脱出", after: "622年がイスラーム暦の元年となる",
    pins: ["mecca", "medina"],
    routes: [route(["mecca", [39.7, 23.0], "medina"], "move")],
    facts: ["年代：622年（イスラーム暦元年）", "目的地：ヤスリブ（メディナ）"],
    actors: [
      person("教団の移動", "prophet-banner", "mecca", { route: 0, offset: [-28, 0], bubble: "メディナへ向かう！" }),
      person("アブー＝バクル", "abu-bakr-calm", "medina", { offset: [28, 0], bubble: "新天地で国を築く" })
    ]
  }),
  scene({
    id: "ummah", chapter: 1, year: "622〜629年", kicker: "信仰で結ばれた共同体",
    title: "メディナで、\n教団共同体「ウンマ」を結成。",
    body: [
      "メディナに移ったムハンマドは、血縁や部族の枠組みを超えた信仰の共同体「<strong>ウンマ</strong>」を組織した。",
      "ムハンマドは宗教の指導者にとどまらず、政治・軍事・裁判の最高指導者となり、教団国家としての基礎を固めてメッカ軍の攻撃を撃退していった。"
    ],
    takeaway: "メディナでウンマ（教団共同体）を結成。政治・軍事も統合。",
    note: "部族の争いをやめ、アッラーのもとで一つの共同体として結束したことが、その後の大躍進の原動力となりました。",
    focus: "ウンマの成立", mapHeading: "メディナの教団国家",
    before: "血縁を超えた信徒の共同体をつくる", after: "政治・軍事・宗教がひとつに統合",
    zones: ["islam_core"], pins: ["medina"], capital: "medina",
    facts: ["共同体名：ウンマ", "指導者：ムハンマド（宗教＋政治＋軍事）"],
    actors: [
      person("ウンマの旗", "prophet-banner", "medina", { offset: [-28, 0], bubble: "ウンマの団結！" }),
      person("アリー", "ali-calm", "medina", { offset: [28, 0], bubble: "共同体を守る！" })
    ]
  }),
  scene({
    id: "mecca-conquest", chapter: 1, year: "630・632年", kicker: "聖地の奪還と預言者の死",
    title: "メッカを無血開城させ、\nカーバの偶像を一掃する。",
    body: [
      "勢力を強大化させたウンマは、630年に大軍で故郷<strong>メッカを無血征服</strong>。クライシュ族は降伏してイスラームを受け入れた。",
      "ムハンマドはカーバ神殿の360体におよぶ多神教の偶像を自ら打ち壊し、唯一神アッラーを祀る聖殿とした。アラビア半島の諸部族を統合した後の632年、病により死去した。"
    ],
    takeaway: "630年・メッカ無血開城 → カーバの偶像破壊。632年・ムハンマド死去。",
    note: "ムハンマドは後継者を指名せずに世を去ったため、共同体は選挙によって指導者を選ぶことになります。",
    focus: "メッカ奪回と偶像破壊", mapHeading: "メッカへの凱旋と統合",
    before: "メッカを無血開城させ偶像を破壊", after: "アラビア半島が統一され、預言者が逝去",
    zones: ["islam_core"], pins: ["mecca", "medina"], capital: "medina",
    routes: [route(["medina", "mecca"], "campaign")],
    facts: ["630年：メッカ征服・偶像破壊", "632年：ムハンマド死去"],
    actors: [
      person("教団軍", "prophet-banner", "medina", { route: 0, offset: [-30, 0], bubble: "偶像を破壊せよ！" }),
      prop("カーバ神殿", "kaaba-sanctuary", "mecca", { offset: [32, 0] })
    ]
  }),

  // 章三：正統カリフの拡大と分裂
  scene({
    id: "abu-bakr", chapter: 2, year: "632〜634年", kicker: "初代カリフの選出",
    title: "アブー＝バクルが即位し、\n半島の離反部族を鎮圧する。",
    body: [
      "預言者の死後、信徒たちの合議・選挙によって親友で岳父の<strong>アブー＝バクル</strong>が初代カリフ（後継者・代理人）に選ばれた。",
      "ムハンマドの死に乗じてアラビア各地で部族の反乱や偽預言者が蜂起したが、アブー＝バクルは断固として鎮圧し、半島の再統一を果たした。"
    ],
    takeaway: "初代カリフ・アブー＝バクル。離反部族を鎮圧して半島を再統一。",
    note: "初代から第4代までの合議・選挙で選ばれた時代を「正統カリフ時代（632〜661年）」と呼びます。",
    focus: "初代アブー＝バクル", mapHeading: "アラビア半島の再統一",
    before: "預言者亡き後の反乱を鎮圧", after: "初代カリフのもとで結束を取り戻す",
    zones: ["islam_core"], pins: ["medina", "mecca"], capital: "medina",
    facts: ["初代カリフ：アブー＝バクル", "合議制で選ばれた「正統カリフ」"],
    actors: [
      person("アブー＝バクル", "abu-bakr-calm", "medina", { offset: [-28, 0], bubble: "共同体を守り抜く！" }),
      person("アラブ戦士", "arab-warrior", "medina", { offset: [28, 0] })
    ]
  }),
  scene({
    id: "umar-expansion", chapter: 2, year: "634〜644年", kicker: "領土の大拡大",
    title: "第2代ウマルが、\nシリアとエジプトを征服。",
    body: [
      "第2代カリフとなった<strong>ウマル</strong>は、信仰を守る聖戦「<strong>ジハード</strong>」を号令し、二大帝国に向かって大遠征を開始した。",
      "ビザンツ帝国軍を破って<strong>シリア（ダマスクス・エルサレム）</strong>を奪い、さらに穀倉地帯の<strong>エジプト（アレクサンドリア）</strong>を征服して大帝国へと急成長した。"
    ],
    takeaway: "第2代ウマル：ビザンツからシリア・エジプトを奪う大躍進。",
    note: "ウマルは質素な生活を送り、公正な統治者として知られます。ヒジュラ暦の制定もウマルの時代です。",
    focus: "第2代ウマル", mapHeading: "シリア・エジプトへの大進軍",
    before: "メディナから北と西へ大遠征", after: "シリア・エジプトをビザンツから奪取",
    zones: ["caliphate_expanded"], pins: ["medina", "damascus", "jerusalem", "alexandria"],
    routes: [route(["medina", "jerusalem", "damascus"]), route(["jerusalem", "alexandria"])],
    facts: ["第2代カリフ：ウマル", "征服地：シリア・エジプト"],
    actors: [
      person("ウマル", "umar-march", "medina", { route: 0, offset: [-30, 0], bubble: "ジハードを率いる！" }),
      person("アラブ騎兵", "arab-cavalry", "damascus", { offset: [30, 0] })
    ]
  }),
  scene({
    id: "nihavand", chapter: 2, year: "642年", kicker: "ササン朝の息根を止める",
    title: "ニハーヴァンドの戦いで、\nササン朝ペルシアを破る。",
    body: [
      "東方では、イラン高原に君臨するササン朝ペルシア軍と決戦に及んだ。642年、<strong>ニハーヴァンドの戦い</strong>でアラブ軍はペルシア軍を完膚なきまでに撃破した。",
      "これによりササン朝は事実上壊滅し（651年最後の王ヤズデギルド3世が暗殺され滅亡）、イラン全土がイスラームの支配下に入った。"
    ],
    takeaway: "642年・ニハーヴァンドの戦い → ササン朝ペルシア軍壊滅（651年滅亡）。",
    note: "語呂合わせ：「無死に（642）なるペルシア、ニハーヴァンド」。古代以来のペルシア帝国が終焉を迎えました。",
    focus: "ニハーヴァンドの戦い", mapHeading: "イラン高原での決戦",
    before: "アラブ軍がペルシア軍本隊と激突", after: "ササン朝壊滅、イラン全域を征服",
    zones: ["caliphate_expanded"], pins: ["ctesiphon", "nihavand"], battle: "nihavand",
    routes: [route(["ctesiphon", "nihavand"])],
    facts: ["合戦：ニハーヴァンドの戦い（642年）", "ササン朝滅亡（651年）"],
    actors: [
      person("ウマル軍", "umar-march", "ctesiphon", { route: 0, offset: [-30, 0], bubble: "ペルシアを破った！" }),
      person("アラブ戦士", "arab-warrior", "nihavand", { offset: [30, 0] })
    ]
  }),
  scene({
    id: "misr-and-atar", chapter: 2, year: "統治体制の整備", kicker: "軍営都市と戦士の給与",
    title: "軍営都市ミスルを築き、\nアター（恩給）を支給する。",
    body: [
      "広大な征服地を統治するため、ウマルはアラブ戦士が現地民の土地を奪うことを禁じ、軍の駐屯拠点として<strong>ミスル（軍営都市）</strong>を建設した。",
      "イラクの<strong>バスラ</strong>や<strong>クーファ</strong>、エジプトの<strong>フスタート</strong>などがミスルとして建設され、戦士たちには国庫の税収から現金給料「<strong>アター</strong>」が分配された。"
    ],
    takeaway: "軍営都市ミスル（バスラ・クーファ・フスタート）＋ 戦士の給与アター。",
    note: "フスタートは後のカイロの母体となり、クーファやバスラは新興のイスラーム学術都市へと発展しました。",
    focus: "軍営都市ミスル", mapHeading: "各地に建設された軍営都市",
    before: "征服地に軍事拠点を新設", after: "戦士をミスルに駐屯させアターを支給",
    zones: ["caliphate_expanded"], pins: ["fustat", "kufa", "basra"],
    facts: ["ミスル：フスタート・クーファ・バスラ", "戦士手当：アター（現金給料）"],
    actors: [
      prop("ミスル城塞", "misr-fortress", "fustat", { offset: [-30, 0] }),
      person("アラブ戦士", "arab-warrior", "kufa", { offset: [30, 0], bubble: "アターを受け取る" })
    ]
  }),
  scene({
    id: "jizya-and-kharaj", chapter: 2, year: "税制の確立", kicker: "二大税制と宗教寛容",
    title: "ジズヤとハラージュを課し、\n啓典の民に信仰の自由を認める。",
    body: [
      "征服地のキリスト教徒やユダヤ教徒は、聖書を持つ者として「<strong>啓典の民（ジンミー）</strong>」と位置づけられ、強制改宗されず信仰の自由を保障された。",
      "その代償として人頭税「<strong>ジズヤ</strong>」を納め、農民には土地税「<strong>ハラージュ</strong>」が課された。寛容な税制と支配は、現地住民から歓迎された。"
    ],
    takeaway: "ジズヤ（人頭税）＋ ハラージュ（地租）。啓典の民の信仰の自由を保障。",
    note: "ビザンツ帝国の過酷な宗教弾圧と重税に苦しんでいた現地のキリスト教徒は、イスラーム支配をむしろ好意的に受け入れました。",
    focus: "税制と寛容策", mapHeading: "広大な征服地の統治",
    before: "非ムスリムに信仰の自由を認める", after: "ジズヤとハラージュで国庫を支える",
    zones: ["caliphate_expanded"], pins: ["damascus", "alexandria", "ctesiphon"],
    facts: ["ジズヤ：人頭税（生命・財産の保護代）", "ハラージュ：地租（土地税）"],
    actors: [
      person("長老カリフ", "umar-calm", "damascus", { offset: [-30, 0], bubble: "信仰の自由を認める" }),
      person("保護民（ジンミー）", "arab-elder", "alexandria", { offset: [30, 0] })
    ]
  }),
  scene({
    id: "uthman-dilemma", chapter: 2, year: "644〜656年", kicker: "第3代の光と影",
    title: "第3代ウスマン、\nコーランを結集するが暗殺される。",
    body: [
      "ウマルの死後、富裕なウマイヤ家出身の<strong>ウスマン</strong>が第3代カリフに就任。各地で読み方が分かれていた『<strong>コーラン</strong>』の正本を結集・編纂した。",
      "しかし、要職に自分のウマイヤ家一族を露骨に優遇したため各地の戦士や不満派の反発を買い、656年、メディナの自宅で不満派によって暗殺された。"
    ],
    takeaway: "第3代ウスマン：コーラン正本の結集完了。ウマイヤ家優遇で暗殺。",
    note: "ウスマンが定めたコーランの標準正本は、現在世界中で読まれているコーランの底本となっています。",
    focus: "第3代ウスマン", mapHeading: "メディナの動揺",
    before: "コーランの正本を結集して統一", after: "身内びいきへの不満から暗殺される",
    zones: ["caliphate_expanded"], pins: ["medina"], capital: "medina",
    facts: ["第3代カリフ：ウスマン", "功績：コーランの正本結集", "結末：暗殺（656年）"],
    actors: [
      person("ウスマン", "uthman-calm", "medina", { offset: [-28, 0], bubble: "コーランを結集した" }),
      person("不満派戦士", "arab-warrior", "medina", { offset: [28, 0], bubble: "身内びいきは許さぬ！" })
    ]
  }),
  scene({
    id: "ali-and-fitna", chapter: 2, year: "656〜661年", kicker: "内乱と正統カリフの終焉",
    title: "第4代アリーとムアーウィヤが激突、\n内乱の末に暗殺される。",
    body: [
      "第4代カリフにムハンマドの従弟で娘婿の<strong>アリー</strong>が選ばれたが、シリア総督<strong>ムアーウィヤ</strong>（ウマイヤ家）がウスマン暗殺の責任を追及して反旗を翻した。",
      "シッフィーンの戦いでアリーが妥協に応じると、急進派の<strong>ハワーリジュ派</strong>が離脱。661年、アリーはハワーリジュ派に暗殺され、正統カリフ時代は幕を閉じた。"
    ],
    takeaway: "アリー vs ムアーウィヤの内乱。ハワーリジュ派離脱。661年アリー暗殺。",
    note: "このアリー暗殺とムアーウィヤの台頭が、後の「スンナ派」と「シーア派」の決定的分裂へと直結します。",
    focus: "第4代アリーと内乱", mapHeading: "シッフィーンの戦いとアリー暗殺",
    before: "アリーとムアーウィヤがシッフィーンで激突", after: "661年アリー暗殺、正統カリフ時代終了",
    zones: ["caliphate_expanded"], pins: ["kufa", "damascus", "siffin"], battle: "siffin",
    routes: [route(["kufa", "siffin"]), route(["damascus", "siffin"])],
    facts: ["第4代カリフ：アリー（ムハンマドの娘婿）", "敵対：ムアーウィヤ（シリア総督）", "661年：アリー暗殺"],
    actors: [
      person("アリー", "ali-calm", "kufa", { offset: [-32, 0], bubble: "正義を貫く！" }),
      person("ムアーウィヤ", "muawiya-calm", "damascus", { offset: [32, 0], bubble: "ウマイヤ家の復讐だ！" })
    ]
  }),
];
