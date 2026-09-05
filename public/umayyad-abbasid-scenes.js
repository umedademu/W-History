// 02 ウマイヤ朝とアッバース朝（全16場面）
// 参考書 第20回「イスラーム世界の形成」（p.321〜p.324）の内容を網羅

export const places = {
  damascus: { name: "ダマスクス", point: [36.29, 33.51] },
  baghdad: { name: "バグダード", point: [44.37, 33.32] },
  jerusalem: { name: "エルサレム", point: [35.21, 31.77] },
  toledo: { name: "トレド", point: [-4.02, 39.86] },
  cordoba: { name: "コルドバ", point: [-4.78, 37.89] },
  poitiers: { name: "トゥール・ポワティエ", point: [0.34, 46.58] },
  talas: { name: "タラス", point: [71.38, 42.90] },
  merv: { name: "メルヴ", point: [62.18, 37.66] },
  kufa: { name: "クーファ", point: [44.40, 32.03] },
  carthage: { name: "カルタゴ（チュニス）", point: [10.18, 36.80] },
  samarkand: { name: "サマルカンド", point: [66.96, 39.65] },
  aachen: { name: "アーヘン（フランク）", point: [6.08, 50.77] },
};

export const zones = {
  umayyad_full: { color: "#3d7a5a", points: [[-9, 37], [0, 43], [15, 36], [30, 32], [45, 37], [65, 38], [70, 30], [55, 23], [40, 16], [20, 22], [-10, 28]] },
  abbasid_core: { color: "#22332a", points: [[25, 32], [38, 37], [48, 38], [65, 40], [72, 35], [60, 27], [45, 22], [32, 25]] },
  frankish: { color: "#4f637a", points: [[-4, 43], [4, 51], [12, 50], [8, 44], [2, 43]] },
  tang: { color: "#8c564b", points: [[72, 44], [80, 42], [80, 35], [74, 37]] },
};

const point = p => typeof p === "string" ? places[p].point : p;
const route = (points, kind = "campaign", options = {}) => ({ points: points.map(point), kind, ...options });
const person = (name, image, at, options = {}) => ({ name, image, at, ...options });
const prop = (name, image, at, options = {}) => ({ name, image, at, kind: "prop", ...options });
const scene = s => ({ frame: [-10, 15, 78, 52], zones: [], pins: [], routes: [], tags: [], facts: [], actors: [], props: [], duration: 3400, ...s });

export const scenes = [
  // 章一：アラブ帝国ウマイヤ朝
  scene({
    id: "umayyad-founding", chapter: 0, year: "661年", kicker: "ダマスクスに新王朝",
    title: "ムアーウィヤがウマイヤ朝を開き、\nカリフ位を世襲化する。",
    body: [
      "アリー暗殺後、シリア総督<strong>ムアーウィヤ</strong>がカリフ位を宣言し、<strong>ウマイヤ朝</strong>（661〜750年）を開いた。",
      "都を交易の要衝<strong>ダマスクス</strong>に遷都。それまでの選挙制を廃止して、カリフ位をウマイヤ家で独占・世襲化した。"
    ],
    takeaway: "661年・ウマイヤ朝成立。都ダマスクス。カリフ位の世襲化。",
    note: "語呂合わせ：「無理に（661）都をダマスクスへ」。合議制の「正統カリフ」から世襲王朝へと大きく転換しました。",
    focus: "ウマイヤ朝の成立", mapHeading: "ダマスクスへの遷都",
    before: "メディナからシリアのダマスクスへ遷都", after: "ウマイヤ家によるカリフ世襲王朝が成立",
    zones: ["umayyad_full"], pins: ["damascus", "kufa"], capital: "damascus",
    facts: ["創始者：ムアーウィヤ", "都：ダマスクス", "制度：カリフ世襲制"],
    actors: [
      person("ムアーウィヤ", "muawiya-ruler", "damascus", { offset: [0, 0], bubble: "ウマイヤ朝の世襲だ！" })
    ]
  }),
  scene({
    id: "sunni-shia", chapter: 0, year: "宗派の分岐", kicker: "合否の分かれ目",
    title: "スンナ派とシーア派、\n二大宗派の対立が決定的になる。",
    body: [
      "歴代カリフの正統性を認め、預言者の慣行（スンナ）に従う多数派は「<strong>スンナ派（スンニー）</strong>」と呼ばれる。",
      "一方、ムハンマドの血を引く「アリーとその子孫（イマーム）」のみを正統な指導者と信じる人々は「<strong>シーア派（アリーの党派）</strong>」としてウマイヤ朝に対抗した。"
    ],
    takeaway: "スンナ派（多数派・慣行重視） vs シーア派（アリーとその子孫を擁護）。",
    note: "680年、アリーの次男フサインがウマイヤ軍に虐殺された「カルバラーの悲劇」により、シーア派の結束は決定的なものとなりました。",
    focus: "宗派の対立", mapHeading: "スンナ派とシーア派の広がり",
    before: "スンナ派が政権を支え、シーア派が反抗", after: "イスラーム世界の二大宗派が定着",
    pins: ["damascus", "kufa"],
    facts: ["スンナ派：代々のカリフ公認・多数派", "シーア派：アリーの子孫のみ正統・少数派"],
    actors: [
      person("ウマイヤ朝側", "muawiya-ruler", "damascus", { offset: [-30, 0], bubble: "スンナ（慣行）を守る" }),
      person("シーア派指導者", "shia-rebel", "kufa", { offset: [30, 0], bubble: "アリーの子孫こそ正統！" })
    ]
  }),
  scene({
    id: "abd-almalik", chapter: 0, year: "685〜705年", kicker: "帝国の制度改革",
    title: "アブド＝アルマリクが、\nアラビア語と独自通貨を定める。",
    body: [
      "第5代カリフ・<strong>アブド＝アルマリク</strong>は、公用語を各地のギリシア語やペルシア語から<strong>アラビア語</strong>に統一した。",
      "さらに独自のディナール金貨・ディルハム銀貨を鋳造してビザンツ・ササン朝貨幣を追放し、聖地エルサレムに<strong>岩のドーム</strong>を建立した。"
    ],
    takeaway: "アブド＝アルマリク：アラビア語公用語化 ＋ 独自貨幣 ＋ 岩のドーム。",
    note: "岩のドームは、預言者ムハンマドが一夜にして昇天したとされる聖なる岩の上に建てられたイスラーム初期の最高建築です。",
    focus: "アブド＝アルマリク", mapHeading: "ダマスクスとエルサレム",
    before: "帝国の行政言語をアラビア語に統一", after: "金貨・銀貨を鋳造し、岩のドームを建設",
    pins: ["damascus", "jerusalem"], capital: "damascus",
    facts: ["公用語：アラビア語", "通貨：ディナール金貨・ディルハム銀貨", "建築：岩のドーム"],
    actors: [
      person("アブド＝アルマリク", "abd-almalik", "damascus", { offset: [-30, 0], bubble: "アラビア語と金貨を定めよ！" }),
      prop("岩のドーム", "dome-of-rock", "jerusalem", { offset: [32, 0] })
    ]
  }),
  scene({
    id: "visigoth-conquest", chapter: 0, year: "711年", kicker: "ジブラルタルを越えて",
    title: "イベリア半島へ渡り、\n西ゴート王国を滅ぼす。",
    body: [
      "ウマイヤ朝は北アフリカ西端まで勢力を伸ばし、711年、ターリク率いるイスラーム軍がジブラルタル海峡を渡航。",
      "トレドを都とするゲルマン系の<strong>西ゴート王国</strong>を撃破して滅亡させ、イベリア半島の大部分をイスラームの領土に組み入れた。"
    ],
    takeaway: "711年・ジブラルタル海峡渡海 → 西ゴート王国滅亡。イベリア領有。",
    note: "ジブラルタルの名は、司令官ターリクにちなむ「ジャバル・ターリク（ターリクの山）」に由来します。",
    focus: "西方大遠征", mapHeading: "北アフリカからイベリア半島へ",
    before: "海峡を渡り、西ゴート王国と激突", after: "711年、西ゴート滅亡。イベリアを征服",
    zones: ["umayyad_full"], pins: ["carthage", "toledo", "cordoba"],
    routes: [route(["carthage", "cordoba", "toledo"])],
    facts: ["年号：711年", "滅亡：西ゴート王国", "地域：イベリア半島（アンダルス）"],
    actors: [
      person("ウマイヤ軍", "arab-cavalry", "cordoba", { offset: [0, 0], bubble: "イベリア半島を平定！" })
    ]
  }),
  scene({
    id: "tours-poitiers", chapter: 0, year: "732年", kicker: "ヨーロッパ進出の限界",
    title: "トゥール・ポワティエ間の戦いで、\nフランク王国軍に敗れる。",
    body: [
      "ピレネー山脈を越えてフランク王国領内へと侵入したイスラーム軍は、732年、<strong>トゥール・ポワティエ間の戦い</strong>でフランク軍と衝突。",
      "宮相<strong>カール＝マルテル</strong>率いる重装歩兵軍に撃退され、イスラーム軍の西欧キリスト教世界への進出はピレネー山脈南側で食い止められた。"
    ],
    takeaway: "732年・トゥール・ポワティエ間の戦い → カール＝マルテルに敗退。",
    note: "語呂合わせ：「波に（732）乗れないウマイヤ軍」。西欧がキリスト教世界として保たれる重大な転換点となりました。",
    focus: "トゥール・ポワティエ", mapHeading: "フランス中部での激突",
    before: "ピレネーを越えて北上するイスラーム軍", after: "カール＝マルテルに敗れ、ピレネー以南へ後退",
    zones: ["umayyad_full", "frankish"], pins: ["toledo", "poitiers"], battle: "poitiers",
    routes: [route(["toledo", [ -1, 43 ], "poitiers"])],
    tags: [{ at: [6, 48], text: "フランク王国" }],
    facts: ["戦い：トゥール・ポワティエ間の戦い（732年）", "相手：カール＝マルテル"],
    actors: [
      person("ウマイヤ軍", "arab-cavalry", "poitiers", { offset: [-30, 0], bubble: "重装兵に阻まれた…" }),
      person("フランク使節（模式）", "frank-ambassador", "poitiers", { offset: [30, 0], bubble: "西欧を守り抜いた！" })
    ]
  }),
  scene({
    id: "arab-empire-crisis", chapter: 0, year: "730〜740年代", kicker: "アラブ帝国としての限界",
    title: "改宗民マワーリーへの差別が、\n社会の不満を爆発させる。",
    body: [
      "ウマイヤ朝はアラブ人を特権階級とする「<strong>アラブ帝国</strong>」だった。新たにイスラームに改宗した非アラブ人（ペルシア人等）は<strong>マワーリー</strong>と呼ばれた。",
      "マワーリーはイスラームに改宗したにもかかわらず<strong>人頭税（ジズヤ）を免除されず</strong>、アター（給与）も差別されたため、激しい怒りが渦巻いた。"
    ],
    takeaway: "ウマイヤ朝＝アラブ帝国。マワーリー（改宗非アラブ人）へのジズヤ差別。",
    note: "全住民の平等を説くイスラームの原点から逸脱したため、シーア派や敬虔な信徒たちも激しく反発しました。",
    focus: "マワーリーの不満", mapHeading: "イラン・イラクに広がる反感",
    before: "マワーリーにジズヤを課し続ける差別", after: "ウマイヤ朝打倒の気運が東方で高まる",
    pins: ["damascus", "kufa", "merv"],
    facts: ["特質：アラブ至上主義（アラブ帝国）", "被差別者：マワーリー（非アラブ改宗者）", "原因：ジズヤ賦課の継続"],
    actors: [
      person("ウマイヤ官僚", "muawiya-ruler", "damascus", { offset: [-30, 0], bubble: "アラブ人が最優先だ" }),
      person("マワーリー農民", "mawali-farmer", "kufa", { offset: [30, 0], bubble: "同じ教徒なのに差別するな！" })
    ]
  }),

  // 章二：アッバース革命と平等の確立
  scene({
    id: "abbasid-revolution", chapter: 1, year: "750年", kicker: "黒旗を掲げる革命",
    title: "アッバース革命が起き、\nウマイヤ朝が滅亡する。",
    body: [
      "ムハンマドの叔父アッバースの子孫<strong>アブー＝アルアッバース</strong>は、東方ホラーサーン（イラン東部）でマワーリーの不満とシーア派の支援を結集。",
      "黒い旗を掲げて挙兵し、750年、ウマイヤ朝を打倒して<strong>アッバース朝</strong>（750〜1258年）を創始した。ウマイヤ家の一族は徹底的に処刑された。"
    ],
    takeaway: "750年・アッバース革命。アブー＝アルアッバースがウマイヤ朝打倒。",
    note: "語呂合わせ：「なご（750）やかにアッバース革命」。アブー＝アルアッバースは容赦なく敵を討ったため「サッファーフ（血を流す者）」と呼ばれました。",
    focus: "アッバース革命", mapHeading: "東方からの挙兵とウマイヤ朝打倒",
    before: "ホラーサーンから黒旗を掲げて進撃", after: "750年、アッバース朝が成立",
    zones: ["abbasid_core"], pins: ["merv", "kufa", "damascus"],
    routes: [route(["merv", "kufa", "damascus"])],
    facts: ["年号：750年", "建国者：アブー＝アルアッバース", "協力勢力：マワーリー・シーア派"],
    actors: [
      person("アブー＝アルアッバース", "abu-alabbas", "kufa", { offset: [-30, 0], bubble: "黒旗のもとに集え！" }),
      person("蜂起軍", "shia-rebel", "merv", { offset: [30, 0] })
    ]
  }),
  scene({
    id: "islamic-empire", chapter: 1, year: "750年代", kicker: "信徒の平等を確立",
    title: "マワーリーのジズヤを免除し、\n「イスラーム帝国」へと変貌する。",
    body: [
      "アッバース朝は、すべてのムスリム（教徒）に平等の権利を認めた。改宗者マワーリーの<strong>人頭税（ジズヤ）を完全免除</strong>。",
      "土地税（ハラージュ）は全ムスリムに一律に課し、ペルシア人官僚を宰相（<strong>ワズィール</strong>）に重用。民族の壁を超えた真の「<strong>イスラーム帝国</strong>」が誕生した。"
    ],
    takeaway: "マワーリーのジズヤ免除 ＋ ペルシア人官僚（ワズィール）登用 ＝ イスラーム帝国。",
    note: "ウマイヤ朝の「アラブ帝国」から、民族を問わず教徒全員が平等な「イスラーム帝国」への脱皮が完了しました。",
    focus: "税制改革と官僚制", mapHeading: "イラクを中心とする新体制",
    before: "改宗者のジズヤを免除し平等を保障", after: "ペルシア人を登用し国際帝国へ発展",
    zones: ["abbasid_core"], pins: ["kufa", "damascus"],
    facts: ["税制：全ムスリムのジズヤ免除・ハラージュ一律", "官僚：ペルシア系ワズィール（宰相）登用"],
    actors: [
      person("アブー＝アルアッバース", "abu-alabbas", "kufa", { offset: [-30, 0], bubble: "全教徒は平等である！" }),
      person("ペルシア系宰相", "wazir-persian", "kufa", { offset: [30, 0], bubble: "行政を整えます" })
    ]
  }),
  scene({
    id: "baghdad-building", chapter: 1, year: "762年", kicker: "平安の都の誕生",
    title: "第2代マンスールが、\n円形都市バグダードを造営。",
    body: [
      "第2代カリフ・<strong>マンスール</strong>は、ティグリス河畔の肥沃で交易に便利な地に新都「<strong>バグダード</strong>（平安の都マディーナ・アッサラーム）」を建設した。",
      "同心円状の三重の城壁に囲まれた壮麗な<strong>円形都市</strong>で、中央にカリフの宮殿とモスクを配置。世界中から商人や学者が集まる国際大都市へ成長した。"
    ],
    takeaway: "762年・第2代マンスールが都バグダード（円形都市）を建設。",
    note: "バグダードは東西の幹線道路が交差する位置にあり、水上交通と隊商路の結節点として未曾有の繁栄を誇りました。",
    focus: "第2代マンスールとバグダード", mapHeading: "ティグリス河畔の新都バグダード",
    before: "同心円の三重城壁をもつ都を建設", after: "762年、帝国の首都バグダードが完成",
    zones: ["abbasid_core"], pins: ["baghdad"], capital: "baghdad",
    facts: ["第2代カリフ：マンスール", "新首都：バグダード（762年）", "都市構造：三重の円形都市"],
    actors: [
      person("マンスール", "mansur-calm", "baghdad", { offset: [-30, 0], bubble: "平安の都をここに築く！" }),
      prop("円形都市バグダード", "baghdad-round-city", "baghdad", { offset: [32, 0] })
    ]
  }),
  scene({
    id: "talas-paper", chapter: 1, year: "751年", kicker: "東西帝国の激突と製紙法",
    title: "タラス河畔の戦いで唐を破り、\n製紙法が西方へ伝わる。",
    body: [
      "751年、中央アジアの領有をめぐり、アッバース朝軍は唐（玄宗朝）の名将・高仙芝の軍と<strong>タラス河畔の戦い</strong>で激突して大勝。",
      "捕虜の中に中国人紙漉き職人がいたことから、サマルカンドを経てバグダードへ<strong>製紙法</strong>が伝来。安価な紙の普及がイスラーム学問の大発展をもたらした。"
    ],
    takeaway: "751年・タラス河畔の戦い → 唐を撃破。製紙法が西方世界へ伝播。",
    note: "語呂合わせ：「紙の（751）歴史はタラスから」。パピルスや羊皮紙に代わり、学問と文化の普及に決定的な役割を果たしました。",
    focus: "タラス河畔の戦い", mapHeading: "中央アジアでの東西決戦",
    before: "唐軍と中央アジアで衝突", after: "唐を破り、捕虜から製紙法が西伝",
    zones: ["abbasid_core", "tang"], pins: ["samarkand", "talas"], battle: "talas",
    routes: [route(["samarkand", "talas"])],
    facts: ["合戦：タラス河畔の戦い（751年）", "相手：唐（高仙芝）", "世界史的影響：製紙法の西伝"],
    actors: [
      person("唐将・高仙芝", "gao-xianzhi", "talas", { offset: [30, 0], bubble: "アッバース軍に敗れた…" }),
      person("紙漉き職人", "paper-craftsman", "samarkand", { offset: [-30, 0], bubble: "製紙の技術を伝えます" })
    ]
  }),

  // 章三：最盛期と帝国の変容
  scene({
    id: "harun-golden-age", chapter: 2, year: "786〜809年", kicker: "黄金期のカリフ",
    title: "ハールーン＝アッラシード、\n未曾有の黄金期を築く。",
    body: [
      "第5代カリフ・<strong>ハールーン＝アッラシード</strong>の治世は、アッバース朝の絶頂期。『<strong>千夜一夜物語（アラビアンナイト）</strong>』の主人公として親しまれた。",
      "首都バグダードにはインド・中国・東アフリカからの宝物が溢れ、フランク王国のカール大帝とも友好使節や贈答品（時計や白象）を交わした。"
    ],
    takeaway: "第5代ハールーン＝アッラシード：アッバース朝の黄金期。千夜一夜物語。",
    note: "当時のバグダードは人口100万人を超える世界最大の国際都市であり、「円形都市」からティグリス川両岸へと市街地が大きく拡大しました。",
    focus: "ハールーン＝アッラシード", mapHeading: "東西世界を結ぶ黄金のバグダード",
    before: "フランク王国カール大帝と使節を交換", after: "千夜一夜物語の舞台となる大繁栄",
    zones: ["abbasid_core"], pins: ["baghdad", "aachen"], capital: "baghdad",
    routes: [route(["baghdad", "damascus", "aachen"], "trade")],
    facts: ["第5代カリフ：ハールーン＝アッラシード", "交流：カール大帝に使節派遣", "文学：千夜一夜物語の舞台"],
    actors: [
      person("ハールーン＝アッラシード", "harun-alrashid", "baghdad", { offset: [-30, 0], bubble: "我が都の繁栄を見よ！" }),
      person("フランク使節", "frank-ambassador", "aachen", { offset: [30, 0] })
    ]
  }),
  scene({
    id: "house-of-wisdom", chapter: 2, year: "813〜833年", kicker: "学術の殿堂",
    title: "第7代マームーンが、\n「知恵の館」で大翻訳を推進。",
    body: [
      "第7代カリフ・<strong>マームーン</strong>は、バグダードに総合研究機関「<strong>知恵の館（バイト＝アルヒクマ）</strong>」を創設。",
      "ギリシア哲学、天文学、医学、インドの数学などの文献をアラビア語へ翻訳させ、イスラーム科学と哲学の基礎を築いた。"
    ],
    takeaway: "第7代マームーン：知恵の館（バイト＝アルヒクマ）設立。ギリシア文献の翻訳。",
    note: "ここでアラビア語に訳されたアリストテレスなどの古典が、のちにラテン語に再翻訳されてヨーロッパの「12世紀ルネサンス」を生み出します。",
    focus: "マームーンと知恵の館", mapHeading: "バグダードの学術研究機関",
    before: "ギリシアやインドの文献を集める", after: "知恵の館でアラビア語への翻訳を推進",
    zones: ["abbasid_core"], pins: ["baghdad"], capital: "baghdad",
    facts: ["第7代カリフ：マームーン", "機関：知恵の館（バイト＝アルヒクマ）", "事業：古代ギリシア学術の翻訳"],
    actors: [
      person("マームーン", "mamun-scholar", "baghdad", { offset: [-30, 0], bubble: "世界の知恵を集めよ！" }),
      prop("知恵の館", "house-of-wisdom", "baghdad", { offset: [32, 0] })
    ]
  }),
  scene({
    id: "ulama-and-sharia", chapter: 2, year: "9世紀", kicker: "法と信仰の守り手",
    title: "ウラマーが活躍し、\nイスラーム法（シャリーア）が整う。",
    body: [
      "コーランや預言者の言行録（ハディース）を研究するイスラーム法学者「<strong>ウラマー</strong>」たちが社会の精神的指導者として台頭。",
      "生活全般を律する「<strong>シャリーア（イスラーム法）</strong>」が体系化され、4つのスンナ派法学派が成立。政治の混乱に関わらず社会の基盤を支えた。"
    ],
    takeaway: "ウラマー（法学者）の台頭 ＋ シャリーア（イスラーム法）の体系化。",
    note: "ウラマーはモスクやマドラサ（学校）で人々を教え、裁判官（カーディー）として日常生活の紛争を裁きました。",
    focus: "ウラマーとシャリーア", mapHeading: "各地に広がるイスラーム法秩序",
    before: "コーランとハディースを厳密に研究", after: "シャリーアに基づく法秩序が定着",
    pins: ["baghdad", "kufa", "damascus"],
    facts: ["学者層：ウラマー（イスラーム知識人）", "法体系：シャリーア（宗教法）"],
    actors: [
      person("ウラマー", "ulama-jurist", "baghdad", { offset: [-28, 0], bubble: "シャリーアに従いなさい" }),
      person("信徒農民", "mawali-farmer", "kufa", { offset: [28, 0] })
    ]
  }),
  scene({
    id: "mamluk-rise", chapter: 2, year: "9世紀半ば", kicker: "親衛隊の軍事独裁",
    title: "トルコ人奴隷兵「マムルーク」が、\n軍の実権を握る。",
    body: [
      "アラブ人戦士の忠誠心低下に悩むカリフたちは、中央アジアからトルコ系軍人奴隷「<strong>マムルーク</strong>」を買い集めて親衛隊を組織した。",
      "優れた弓騎兵であるマムルーク軍団はやがて強大化し、カリフの廃立にまで介入して政治の実権を奪うようになった。"
    ],
    takeaway: "マムルーク（トルコ人軍人奴隷）の親衛隊登用 → 軍閥化して実権掌握。",
    note: "マムルークの台頭により、アッバース朝カリフは実権を失い、宗教的権威のみの存在へと転落していきました。",
    focus: "マムルークの台頭", mapHeading: "近衛兵の軍閥化",
    before: "優秀な騎兵として奴隷兵を大量採用", after: "マムルーク軍団が政治を牛耳る",
    zones: ["abbasid_core"], pins: ["baghdad", "samarkand"],
    facts: ["兵種：マムルーク（軍人奴隷）", "出身：中央アジアのトルコ系遊牧民", "結果：カリフの傀儡化"],
    actors: [
      person("アッバース朝カリフ", "mamun-scholar", "baghdad", { offset: [-30, 0], bubble: "兵に権力を奪われる…" }),
      person("マムルーク兵", "mamluk-guard", "baghdad", { offset: [30, 0], bubble: "我らが軍を動かす！" })
    ]
  }),
  scene({
    id: "empire-splintering", chapter: 2, year: "9世紀後半", kicker: "地方政権の分立へ",
    title: "中央の統治が緩み、\n各地で地方政権が自立する。",
    body: [
      "マムルークの内紛と黒人奴隷の大反乱（ザンジュの乱）でアッバース朝の財政と治安は破綻。",
      "イランにサッファール朝、中央アジアにサーマーン朝、エジプトにトゥールーン朝が自立し、大帝国は多極化の時代へと向かった。"
    ],
    takeaway: "中央の衰微 → 各地で地方王朝が自立。多極化の時代へ。",
    note: "次の教材「03 分裂と地方政権の興亡」では、3人のカリフが並立し、セルジューク朝や十字軍が激突する激動の時代へと進みます。",
    focus: "帝国の分裂", mapHeading: "地方政権の台頭",
    before: "中央の統制が崩壊し、地方が自立", after: "イスラーム世界は各地の王朝へ多極化",
    pins: ["baghdad", "merv", "damascus"],
    facts: ["衰退要因：ザンジュの乱・軍閥専横", "次代への展開：3カリフ並立と地方王朝"],
    actors: [
      person("衰退するカリフ", "mamun-scholar", "baghdad", { offset: [-30, 0], bubble: "地方の自立を止められぬ" }),
      person("マムルーク将軍", "mamluk-guard", "damascus", { offset: [30, 0] })
    ]
  }),
  scene({
    id: "legacy-transition", chapter: 2, year: "時代の結び", kicker: "イスラーム世界の広がり",
    title: "アラブ帝国からイスラーム帝国、\nそして世界宗教へ。",
    body: [
      "ウマイヤ朝がアラビア半島から大西洋・中央アジアまで領土を広げ、アッバース朝が信徒の平等と高度な学術都市文化を築き上げた。",
      "二つの大帝国の時代を経て、イスラーム文明は多様な民族と地域を結ぶ普遍的な世界文明として不動の地位を確立した。"
    ],
    takeaway: "領土のウマイヤ朝 ＋ 平等と文化のアッバース朝 ＝ 世界文明イスラーム。",
    note: "この基盤の上に、西方（スペイン）、エジプト、イラン、中央アジア、そしてインド・アフリカへと豊かな文化が花開きます。",
    focus: "大帝国の遺産", mapHeading: "大西洋からインダス川まで",
    before: "二大帝国が築いた国際的な法と文化", after: "各地の地方政権へと歴史が受け継がれる",
    zones: ["umayyad_full"], pins: ["cordoba", "damascus", "baghdad", "samarkand"],
    facts: ["ウマイヤ朝：最大領土・アラブ帝国", "アッバース朝：平等社会・イスラーム帝国"],
    actors: [
      person("アブド＝アルマリク", "abd-almalik", "damascus", { offset: [-30, 0] }),
      person("ハールーン＝アッラシード", "harun-alrashid", "baghdad", { offset: [30, 0], bubble: "文化と学問の遺産" })
    ]
  }),
];
