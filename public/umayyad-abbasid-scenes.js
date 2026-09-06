// 02 ウマイヤ朝とアッバース朝（27場面）
// 原文 p.321〜324 の流れと固有名詞の対応は docs/umayyad-abbasid-correspondence.md を参照。

export const places = {
  mecca: { name: "メッカ", point: [39.83, 21.42] },
  damascus: { name: "ダマスクス【ダマスカス】", point: [36.29, 33.51] },
  kufa: { name: "クーファ", point: [44.4, 32.03] },
  amu: { name: "アム川", point: [61.2, 40.1] },
  centralAsia: { name: "中央アジア", point: [68, 40] },
  sogdiana: { name: "ソグディアナ地方【マー＝ワラー＝アンナフル】", point: [66.5, 39.7] },
  pakistan: { name: "パキスタン", point: [69, 29] },
  maghrib: { name: "マグリブ地方", point: [9, 34] },
  gibraltar: { name: "ジブラルタル海峡", point: [-5.6, 36] },
  iberia: { name: "イベリア半島", point: [-4, 40] },
  pyrenees: { name: "ピレネー山脈", point: [1.4, 42.8] },
  poitiers: { name: "トゥール・ポワティエ間", point: [0.34, 46.58] },
  khorasan: { name: "ホラーサーン", point: [59, 35.5] },
  baghdad: { name: "バグダード", point: [44.37, 33.32] },
  tigris: { name: "ティグリス川", point: [43.9, 34.4] },
  euphrates: { name: "ユーフラテス川", point: [42.2, 34.1] },
  iraq: { name: "イラク", point: [43.7, 31.2] },
  talas: { name: "タラス河畔", point: [71.38, 42.9] },
  china: { name: "中国", point: [105, 35] },
  uighur: { name: "ウイグル", point: [101, 46] }
};

export const zones = {
  umayyadFull: { color: "#a86c62", points: [[-10, 37], [2, 44], [18, 39], [36, 40], [55, 43], [73, 41], [72, 29], [55, 25], [40, 18], [12, 24], [-8, 29]] },
  umayyadCore: { color: "#b48258", points: [[30, 38], [39, 39], [48, 36], [50, 29], [44, 24], [35, 27]] },
  byzantineEconomy: { color: "#54728c", points: [[19, 43], [31, 43], [37, 37], [35, 31], [27, 30], [20, 35]] },
  sasanianEconomy: { color: "#815846", points: [[43, 39], [53, 40], [62, 36], [60, 28], [50, 27], [43, 32]] },
  westward: { color: "#8a6b75", points: [[-10, 37], [1, 44], [13, 39], [13, 30], [-7, 29]] },
  abbasid: { color: "#5c7f65", points: [[26, 36], [39, 40], [60, 40], [68, 35], [58, 27], [45, 23], [31, 27]] },
  mesopotamia: { color: "#7d8e62", points: [[40, 37], [46, 38], [48, 31], [45, 27], [40, 29]] },
  centralAsia: { color: "#6b7f93", points: [[58, 45], [76, 46], [80, 36], [68, 31], [58, 35]] }
};

const makeScene = data => ({ zones: [], pins: [], routes: [], tags: [], facts: [], actors: [], props: [], duration: 2200, ...data });

export const scenes = [
  makeScene({
    id: "umayyad-founding", chapter: 0, year: "661年", frame: [32, 18, 43, 36], zones: ["umayyadCore"], pins: ["mecca", "damascus"],
    routes: [{ points: [[39.83, 21.42], [36.29, 33.51]], kind: "move" }],
    tags: [{ at: [40.5, 23], text: "クライシュ族の名門ウマイヤ家" }, { at: [34.5, 35], text: "カリフ位を世襲" }],
    facts: ["ウマイヤ朝【661〜750年】：661年に建国", "ムアーウィヤ【位661〜680年】が開いた世襲の王朝"],
    actors: [{ name: "ムアーウィヤ", image: "muawiya-ruler", at: "mecca", route: 0, bubble: "次のカリフは息子に継がせる" }],
    title: "ムアーウィヤがウマイヤ朝を開き、\nカリフ位を世襲化する。", kicker: "選挙から世襲の王朝へ", mapHeading: "メッカの名門からダマスクスのカリフへ", focus: "ウマイヤ朝の成立とカリフ位の世襲",
    before: "クライシュ族の名門ウマイヤ家からムアーウィヤが現れる", after: "ダマスクスでカリフとなりウマイヤ朝を開く",
    body: ["<strong>661年</strong>、<strong>メッカ</strong>の<strong>クライシュ族</strong>の名門<strong>ウマイヤ家</strong>出身の<strong>ムアーウィヤ【位661〜680年】</strong>は、<strong>ダマスクス【ダマスカス】</strong>で正式に<strong>カリフ</strong>となり、<strong>ウマイヤ朝【661〜750年】</strong>を開いた。", "ムアーウィヤは各地の有力者に、次のカリフを息子へ継がせると認めさせた。カリフ位が<strong>世襲</strong>される<strong>王朝</strong>が始まった。"],
    takeaway: "カリフ位の世襲によって、ウマイヤ朝が成立した。", note: "『〜朝』は、一族が地位を継ぐ王朝であることを表します。"
  }),
  makeScene({
    id: "ali-supporters", chapter: 0, year: "661年以後", frame: [33, 28, 47, 37], zones: ["umayyadCore"], pins: ["damascus", "kufa"],
    routes: [{ points: [[44.4, 32.03], [40, 33], [36.29, 33.51]], kind: "rival" }],
    tags: [{ at: [42, 35], text: "アリー支持派" }, { at: [38, 31], text: "アリーとその子孫" }],
    facts: ["アリーの息子を立てて対抗するが敗北", "正統な後継者をイマームとよぶシーア派"],
    actors: [{ name: "アリーの息子を支持する人びと", image: "shia-rebel", at: "kufa", route: 0, bubble: "アリーの血統こそ正統だ" }],
    title: "アリー支持派は敗れ、\nシーア派へつながる。", kicker: "王朝を認めない反体制派", mapHeading: "クーファのアリー支持派とダマスクスのウマイヤ朝", focus: "アリーの血統とイマーム",
    before: "アリー支持派がアリーの息子を立てる", after: "ウマイヤ朝に敗れシーア派として対抗する",
    body: ["<strong>アリー支持派</strong>は<strong>アリーの息子</strong>を立て、<strong>クーファ</strong>から<strong>ダマスクス【ダマスカス】</strong>の<strong>ウマイヤ朝</strong>に対抗したが、攻撃を受けて敗れた。", "以後、<strong>アリーとその子孫</strong>だけを正統な後継者である<strong>イマーム</strong>と考え、ウマイヤ朝を認めない人びとが<strong>シーア派</strong>となった。"],
    takeaway: "アリーの血統を正統とするシーア派が形成された。", note: "シーアは『アリーを支持する人びと』という意味です。"
  }),
  makeScene({
    id: "sunni-majority", chapter: 0, year: "宗派の分裂", frame: [33, 28, 47, 37], zones: ["umayyadCore"], pins: ["damascus", "kufa"],
    routes: [{ points: [[44.4, 32.03], [40, 33], [36.29, 33.51]], kind: "rival" }],
    tags: [{ at: [37, 35.5], text: "スンナ派【スンニー派】" }, { at: [43, 30], text: "シーア派" }],
    facts: ["スンナ派：ウマイヤ朝と代々のカリフを正統とする多数派", "スンナ：ムハンマドの言行"],
    actors: [{ name: "スンナ派の多数派", image: "abd-almalik", at: "damascus", bubble: "共同体の統一を保とう" }, { name: "シーア派", image: "shia-rebel", at: "kufa", bubble: "イマームはアリーの子孫だけだ" }],
    title: "共同体の統一を重んじる多数派が、\nスンナ派となる。", kicker: "スンナに従う多数派", mapHeading: "ダマスクスの体制派とクーファのアリー支持派", focus: "スンナ派とシーア派の違い",
    before: "後継者をめぐり共同体が分かれる", after: "多数派のスンナ派と少数派のシーア派になる",
    body: ["<strong>ダマスクス【ダマスカス】</strong>を中心とする<strong>ウマイヤ朝</strong>と<strong>代々のカリフ</strong>を正統と考え、<strong>共同体</strong>の統一を重視する<strong>多数派</strong>が、<strong>スンナ派【スンニー派】</strong>となった。", "<strong>スンナ</strong>とは<strong>ムハンマド</strong>の言行を意味する。これに対し、<strong>クーファ</strong>側の<strong>シーア派</strong>はアリーの子孫だけを<strong>イマーム</strong>と認めた。"],
    takeaway: "後継者をめぐる対立が、スンナ派とシーア派の分裂へつながった。", note: "スンナ派も、ムアーウィヤ個人を無条件に支持した集団という意味ではありません。"
  }),
  makeScene({
    id: "abd-almalik-authority", chapter: 0, year: "第5代カリフ", frame: [30, 26, 44, 38], zones: ["umayyadCore"], pins: ["damascus"],
    tags: [{ at: [39, 36], text: "政治・経済・社会のアラブ化" }],
    facts: ["第5代アブド＝アルマリクが内乱を収拾", "秩序回復のためカリフ権を強化"],
    actors: [{ name: "アブド＝アルマリク", image: "abd-almalik", at: "damascus", bubble: "王朝の秩序を立て直す" }],
    title: "アブド＝アルマリクが内乱を収め、\nカリフ権を強める。", kicker: "王朝の秩序を回復", mapHeading: "ダマスクスから王朝の統一を回復する", focus: "第5代カリフとアラブ化",
    before: "シーア派の反発で各地の内乱が続く", after: "アブド＝アルマリクがカリフ権を強化する",
    body: ["<strong>シーア派</strong>の反発から再び<strong>内乱</strong>が起きたが、<strong>第5代</strong>カリフの<strong>アブド＝アルマリク</strong>がこれを収拾した。", "アブド＝アルマリクは<strong>ダマスクス【ダマスカス】</strong>を中心に<strong>カリフ権</strong>を強め、<strong>政治・経済・社会のアラブ化</strong>を進めた。"],
    takeaway: "アブド＝アルマリクは、統治をアラブ化して王朝を立て直した。", note: "次の二場面で、言語と貨幣の統一を確認します。"
  }),
  makeScene({
    id: "arabic-official-language", chapter: 0, year: "685〜705年", frame: [26, 25, 50, 40], zones: ["umayyadCore"], pins: ["damascus"],
    routes: [{ points: [[36.29, 33.51], [31, 36]], kind: "move" }, { points: [[36.29, 33.51], [45, 31]], kind: "move" }],
    tags: [{ at: [31, 37], text: "アラビア語" }, { at: [45, 30], text: "公用語" }],
    facts: ["アブド＝アルマリク：アラビア語を公用語にする", "行政の命令をすべてアラビア語で発行"],
    actors: [{ name: "アブド＝アルマリク", image: "abd-almalik", at: "damascus", bubble: "行政の言葉を一つにする" }],
    title: "アラビア語を公用語にし、\n行政命令を統一する。", kicker: "政治のアラブ化", mapHeading: "ダマスクスからアラビア語の命令を出す", focus: "アラビア語の公用語化",
    before: "地域ごとに異なる言語で行政を行う", after: "すべての行政命令をアラビア語で出す",
    body: ["<strong>アブド＝アルマリク</strong>は<strong>アラビア語</strong>を<strong>公用語</strong>とし、<strong>ダマスクス【ダマスカス】</strong>から出す<strong>行政</strong>の命令をすべてアラビア語へ統一した。", "共通の言語を使うことで、広い領土を一つの王朝として統治しやすくした。"],
    takeaway: "公用語の統一が、中央からの行政を支えた。", note: "言語の統一は、政治のアラブ化を具体化した政策です。"
  }),
  makeScene({
    id: "arabic-coins", chapter: 0, year: "貨幣の統一", frame: [18, 24, 64, 44], zones: ["byzantineEconomy", "sasanianEconomy"], pins: ["damascus"],
    routes: [{ points: [[28, 36], [36.29, 33.51], [52, 34]], kind: "trade" }],
    tags: [{ at: [27, 40], text: "旧東ローマ【ビザンツ】帝国の経済圏" }, { at: [53, 39], text: "旧ササン朝の経済圏" }],
    facts: ["ディナール金貨：アラビア語を刻印", "ディルハム銀貨：二つの経済圏を結ぶ"],
    actors: [{ name: "アブド＝アルマリク", image: "abd-almalik", at: "damascus", bubble: "金貨と銀貨を統一しよう" }],
    title: "金貨と銀貨を統一し、\n二つの経済圏を結ぶ。", kicker: "経済のアラブ化", mapHeading: "旧東ローマと旧ササン朝の経済圏を接続する", focus: "ディナール金貨とディルハム銀貨",
    before: "旧東ローマは金貨、旧ササン朝は銀貨を使う", after: "アラビア語を刻んだ貨幣で交易圏を結ぶ",
    body: ["貨幣は、アラビア語を刻んだ<strong>ディナール金貨</strong>と<strong>ディルハム銀貨</strong>へ統一された。", "<strong>ダマスクス【ダマスカス】</strong>を中心に、金貨を使う<strong>旧東ローマ【ビザンツ】帝国の経済圏</strong>と、銀貨を使う<strong>旧ササン朝の経済圏</strong>を結び、<strong>交易</strong>を活発にした。"],
    takeaway: "共通貨幣が、東西の経済圏を結びつけた。", note: "言語と貨幣の統一は、政治だけでなく交易にも作用しました。"
  }),
  makeScene({
    id: "eastward-expansion", chapter: 0, year: "ワリード1世以後", frame: [33, 24, 75, 47], zones: ["umayyadFull", "centralAsia"], pins: ["damascus", "amu", "centralAsia", "sogdiana", "pakistan"],
    routes: [{ points: [[36.29, 33.51], [50, 36], [61.2, 40.1], [66.5, 39.7], [69, 29]], kind: "campaign" }],
    facts: ["ウマイヤ朝：ワリード1世【位705〜715年】以後の領土拡大", "イスラーム軍：アム川を越え中央アジアと現在のパキスタンへ"],
    actors: [{ name: "ワリード1世時代以後のイスラーム軍", image: "arab-cavalry", at: "damascus", route: 0, bubble: "アム川の向こうへ進む" }],
    title: "アム川を越え、\n中央アジアへ進出する。", kicker: "ウマイヤ朝の東方拡大", mapHeading: "ダマスクスからアム川の向こうへ", focus: "ソグディアナ地方と現在のパキスタン",
    before: "ワリード1世時代以後に東方遠征を進める", after: "アム川を越えソグディアナ地方と現在のパキスタンへ至る",
    body: ["<strong>ワリード1世【位705〜715年】</strong>の時代以後、<strong>ウマイヤ朝</strong>の<strong>イスラーム軍</strong>は<strong>ダマスクス【ダマスカス】</strong>から東方へ進み、<strong>アム川</strong>を越えた。", "<strong>中央アジア</strong>の<strong>ソグディアナ地方【マー＝ワラー＝アンナフル】</strong>へ侵攻し、領域は<strong>現在のパキスタン</strong>まで広がった。マー＝ワラー＝アンナフルは『川向こう』を意味する。"],
    takeaway: "ウマイヤ朝は、中央アジアと現在のパキスタンまで広がった。", note: "東方ではアム川が、広がりを理解する位置の基準になります。"
  }),
  makeScene({
    id: "visigoth-conquest", chapter: 0, year: "711年", frame: [-11, 27, 39, 41], zones: ["umayyadFull", "westward"], pins: ["damascus", "maghrib", "gibraltar", "iberia"],
    routes: [{ points: [[36.29, 33.51], [9, 34], [-5.6, 36], [-4, 40]], kind: "campaign" }], tags: [{ at: [-1, 39], text: "西ゴート王国" }],
    facts: ["北アフリカのマグリブ地方を征服", "騎馬軍団を持たない西ゴート王国が711年に滅亡"], actors: [{ name: "ウマイヤ朝のイスラーム軍", image: "arab-cavalry", at: "damascus", route: 0, bubble: "海峡を渡りイベリア半島へ" }],
    title: "ジブラルタル海峡を渡り、\n西ゴート王国を滅ぼす。", kicker: "ウマイヤ朝の西方拡大", mapHeading: "北アフリカからイベリア半島へ", focus: "マグリブ地方・ジブラルタル海峡・711年",
    before: "北アフリカのマグリブ地方を征服する", after: "ジブラルタル海峡を渡り西ゴート王国を滅ぼす",
    body: ["西方では、<strong>ダマスクス【ダマスカス】</strong>から進んだ<strong>ウマイヤ朝</strong>の<strong>イスラーム軍</strong>が<strong>北アフリカ</strong>の<strong>マグリブ地方</strong>を征服し、<strong>ジブラルタル海峡</strong>を渡って<strong>イベリア半島</strong>へ進んだ。", "<strong>騎馬軍団</strong>を持たなかった<strong>西ゴート王国</strong>は敗れ、<strong>711年</strong>に滅亡した。"],
    takeaway: "北アフリカから海峡を越え、イベリア半島を征服した。", note: "北アフリカから海峡を渡り、半島へ入る経路に注目しましょう。"
  }),
  makeScene({
    id: "tours-poitiers", chapter: 0, year: "732年", frame: [-9, 34, 6, 50], zones: ["westward"], pins: ["iberia", "pyrenees", "poitiers"],
    routes: [{ points: [[-4, 40], [1.4, 42.8], [0.34, 46.58]], kind: "campaign" }, { points: [[3, 49], [0.34, 46.58]], kind: "rival" }], tags: [{ at: [3, 48], text: "フランク王国軍" }],
    facts: ["トゥール・ポワティエ間の戦い【732年】", "カール＝マルテルがウマイヤ朝軍を撃退"], actors: [{ name: "ウマイヤ朝のイスラーム軍", image: "arab-cavalry", at: "iberia", route: 0, bubble: "ピレネー山脈を越える" }, { name: "カール＝マルテルのフランク王国軍", image: "frank-ambassador", at: [3, 49], route: 1, bubble: "ここで北上を止める" }],
    title: "トゥール・ポワティエ間の戦いで、\nフランク王国軍に敗れる。", kicker: "西方拡大の到達点", mapHeading: "イベリア半島からピレネー山脈を越えて北上する", focus: "カール＝マルテルと732年の戦い",
    before: "イベリア半島からピレネー山脈を越える", after: "トゥール・ポワティエ間の戦いで撃退される",
    body: ["<strong>ウマイヤ朝</strong>の<strong>イスラーム軍</strong>は<strong>イベリア半島</strong>から<strong>ピレネー山脈</strong>を越えて北上した。", "<strong>732年</strong>の<strong>トゥール・ポワティエ間の戦い</strong>で、<strong>カール＝マルテル</strong>率いる<strong>フランク王国軍</strong>に撃退された。"],
    takeaway: "ウマイヤ朝の北上は、フランク王国軍に阻まれた。", note: "戦いの位置と、イベリア半島からの移動方向を一続きで示します。"
  }),
  makeScene({
    id: "arab-empire", chapter: 0, year: "8世紀前半", frame: [-12, 15, 75, 49], zones: ["umayyadFull"], pins: ["iberia", "damascus", "centralAsia", "pakistan"],
    routes: [{ points: [[36.29, 33.51], [-4, 40]], kind: "move" }, { points: [[36.29, 33.51], [68, 40], [69, 29]], kind: "move" }], tags: [{ at: [34, 43], text: "アラブ帝国" }, { at: [30, 31], text: "政治・社会のアラブ化" }],
    facts: ["アラブ人：アター【俸給】を受給し免税", "領域：イベリア半島から中央アジア・現在のパキスタンまで"], actors: [{ name: "特権を持つアラブ人", image: "arab-cavalry", at: "damascus", bubble: "アターを受け取り免税される" }],
    title: "征服者のアラブ人が特権を持つ、\n『アラブ帝国』となる。", kicker: "広い領土と不平等", mapHeading: "イベリア半島から中央アジア・現在のパキスタンまで", focus: "政治・社会のアラブ化とアラブ人の特権",
    before: "ウマイヤ朝が東西へ領土を広げる", after: "アラブ人がアターを受け免税されるアラブ帝国になる",
    body: ["<strong>ダマスクス【ダマスカス】</strong>を都とする<strong>ウマイヤ朝</strong>は<strong>イベリア半島</strong>から<strong>中央アジア</strong>・<strong>現在のパキスタン</strong>まで広がり、<strong>政治・社会のアラブ化</strong>を進めた。", "征服者である<strong>アラブ人</strong>は国から<strong>アター【俸給】</strong>を受け、<strong>免税</strong>される特権を持った。このためウマイヤ朝は『<strong>アラブ帝国</strong>』ともよばれる。"],
    takeaway: "領土の拡大とともに、アラブ人の特権が目立つようになった。", note: "次の場面では、改宗した非アラブ人との待遇差を見ます。"
  }),
  makeScene({
    id: "mawali-discontent", chapter: 0, year: "ウマイヤ朝後半", frame: [32, 27, 59, 40], zones: ["umayyadCore"], pins: ["damascus"], routes: [{ points: [[55, 35], [46, 34], [36.29, 33.51]], kind: "rival" }],
    facts: ["マワーリー【改宗者】にもジズヤ【人頭税】・ハラージュ【土地税】を課す／ジズヤは信仰の自由を保証する税", "アラブ人はアター【俸給】を受給し免税／『コーラン』はムスリムの平等を説く"], actors: [{ name: "税を負担するマワーリー", image: "mawali-farmer", at: [55, 35], route: 0, bubble: "改宗しても税が続くのは不平等だ" }, { name: "ウマイヤ朝の徴税官", image: "abd-almalik", at: "damascus", bubble: "税収を保つ" }],
    title: "マワーリーへの課税が続き、\n不満が高まる。", kicker: "改宗しても残る待遇差", mapHeading: "征服地のマワーリーからダマスクスへ向かう不満", focus: "ジズヤ・ハラージュと『コーラン』の平等",
    before: "非アラブ人がイスラーム教へ改宗しマワーリーが増える", after: "不平等への不満をアッバース家の革命運動が吸収する",
    body: ["<strong>ダマスクス【ダマスカス】</strong>を中心とする王朝のもとで、非アラブ人の<strong>マワーリー【改宗者】</strong>は、<strong>イスラーム教</strong>へ改宗しても<strong>ジズヤ【人頭税】</strong>と<strong>ハラージュ【土地税】</strong>を課されることがあった。ジズヤは本来、<strong>信仰の自由</strong>を保証するための税だった。", "一方、<strong>アラブ人</strong>は<strong>アター【俸給】</strong>を受けて<strong>免税</strong>された。『<strong>コーラン</strong>』が説く<strong>ムスリムの平等</strong>に反するという不満を、<strong>アッバース家</strong>の<strong>革命運動</strong>が吸収した。"],
    takeaway: "マワーリーへの不平等な課税が、王朝への反発を強めた。", note: "税の種類と、改宗後も続いた負担を区別して示します。"
  }),
  makeScene({
    id: "abbasid-uprising", chapter: 1, year: "8世紀半ば", frame: [34, 29, 64, 40], zones: ["abbasid"], pins: ["khorasan", "kufa", "damascus"], routes: [{ points: [[59, 35.5], [50, 34], [44.4, 32.03], [36.29, 33.51]], kind: "campaign" }],
    facts: ["アッバース家：『ムハンマドの家系が統治権を持つべき』とウマイヤ朝に対抗", "マワーリーとシーア派を吸収しホラーサーンで挙兵"], actors: [{ name: "アッバース家の革命運動", image: "shia-rebel", at: "khorasan", route: 0, bubble: "不満を集めて西へ進む" }],
    title: "アッバース家がホラーサーンで挙兵し、\n革命軍が西へ進む。", kicker: "不満を集めた革命運動", mapHeading: "ホラーサーンからクーファ・ダマスクスへ", focus: "マワーリーとシーア派の参加",
    before: "アッバース家がムハンマドの家系による統治を掲げる", after: "マワーリーとシーア派を集めホラーサーンで挙兵する",
    body: ["<strong>アッバース家</strong>は『<strong>ムハンマドの家系</strong>が統治権を持つべきだ』と掲げ、<strong>革命運動</strong>を進めた。", "<strong>ウマイヤ朝</strong>に不満を持つ<strong>マワーリー</strong>と<strong>シーア派</strong>を吸収し、<strong>ホラーサーン</strong>で<strong>挙兵</strong>して、<strong>クーファ</strong>から<strong>ダマスクス【ダマスカス】</strong>へ進んだ。"],
    takeaway: "ホラーサーンの挙兵が、ウマイヤ朝を倒す革命へ発展した。", note: "革命に参加した集団と、軍が西へ向かう経路を同時に示します。"
  }),
  makeScene({
    id: "abbasid-founding", chapter: 1, year: "750年", frame: [33, 28, 63, 40], zones: ["abbasid"], pins: ["khorasan", "kufa", "damascus"], routes: [{ points: [[59, 35.5], [44.4, 32.03], [36.29, 33.51]], kind: "campaign" }],
    facts: ["750年にアッバース朝【750〜1258年】が成立", "アブー＝アルアッバース【サッファーフ・位750〜754年】が初代カリフ"], actors: [{ name: "アブー＝アルアッバース【サッファーフ】", image: "abu-alabbas", at: "kufa", bubble: "ウマイヤ朝を倒し新王朝を開く" }],
    title: "アブー＝アルアッバースがカリフとなり、\nアッバース朝を開く。", kicker: "750年の王朝交代", mapHeading: "ホラーサーンの革命からアッバース朝成立へ", focus: "ウマイヤ朝の滅亡と新カリフ",
    before: "革命軍がウマイヤ朝を倒す", after: "ムハンマドの叔父の家系がアッバース朝を開く",
    body: ["革命軍は<strong>750年</strong>に<strong>ウマイヤ朝</strong>を倒した。<strong>ムハンマドの叔父の家系</strong>である<strong>アブー＝アルアッバース【サッファーフ・位750〜754年】</strong>が<strong>カリフ</strong>となった。", "ここに<strong>アッバース朝【750〜1258年】</strong>が成立した。<strong>ホラーサーン</strong>から<strong>クーファ</strong>・<strong>ダマスクス【ダマスカス】</strong>へ進んだ革命が、王朝を交代させた。"],
    takeaway: "750年、アッバース革命によって新しい王朝が成立した。", note: "建国者の別名サッファーフと在位年も一緒に覚えましょう。"
  }),
  makeScene({
    id: "shia-suppression", chapter: 1, year: "建国後", frame: [34, 29, 49, 38], zones: ["abbasid"], pins: ["kufa", "baghdad"], routes: [{ points: [[44.4, 32.03], [44.37, 33.32]], kind: "rival" }],
    facts: ["アッバース朝：スンナ派を保護", "アリーの血統を掲げるシーア派を弾圧し反乱を鎮圧"], actors: [{ name: "反乱するシーア派", image: "shia-rebel", at: "kufa", route: 0, bubble: "協力したのに弾圧された" }, { name: "アッバース朝のスンナ派", image: "abu-alabbas", at: "baghdad", bubble: "王朝の正統性を守る" }],
    title: "建国後はスンナ派を保護し、\nシーア派を弾圧する。", kicker: "革命の協力者との決裂", mapHeading: "クーファの反乱とアッバース朝の鎮圧", focus: "アリーの血統とアッバース家の対立",
    before: "シーア派がアッバース革命に協力する", after: "アッバース朝がシーア派の反乱を鎮圧する",
    body: ["<strong>シーア派</strong>の協力で成立した<strong>アッバース朝</strong>は、建国後には<strong>スンナ派</strong>を保護し、シーア派を<strong>弾圧</strong>した。", "<strong>アッバース家</strong>は<strong>アリーの血統</strong>ではないため、シーア派の考えを王朝への脅威とみなした。<strong>クーファ</strong>などで起きた<strong>反乱</strong>は<strong>バグダード</strong>側に<strong>鎮圧</strong>された。"],
    takeaway: "革命に協力したシーア派は、建国後のアッバース朝と対立した。", note: "協力から弾圧へ転じた順番を分けて示します。"
  }),
  makeScene({
    id: "mawali-tax-reform", chapter: 1, year: "アッバース革命後", frame: [34, 28, 62, 39], zones: ["abbasid"], pins: ["khorasan", "baghdad"], routes: [{ points: [[59, 35.5], [44.37, 33.32]], kind: "move" }],
    facts: ["マワーリーのジズヤを免除し『コーラン』が説くムスリムの平等へ", "ウマイヤ朝末期からアラブ人の土地所有者にもハラージュ"], actors: [{ name: "ジズヤを免除されたマワーリー", image: "mawali-farmer", at: "khorasan", route: 0, bubble: "同じムスリムとして扱われる" }],
    title: "マワーリーのジズヤを免除し、\nムスリムの平等へ近づく。", kicker: "不満を解消する税制改革", mapHeading: "ホラーサーンのマワーリーへ税制改革を広げる", focus: "ジズヤ免除とハラージュ",
    before: "改宗後もマワーリーにジズヤを課す", after: "アッバース朝がマワーリーのジズヤを免除する",
    body: ["<strong>バグダード</strong>を中心とする<strong>アッバース朝</strong>は、<strong>ホラーサーン</strong>などの<strong>マワーリー</strong>の不満を解消するため、<strong>ジズヤ</strong>を<strong>免除</strong>した。『<strong>コーラン</strong>』の理念に沿う<strong>ムスリムの平等</strong>へ近づいた。", "一方、<strong>ウマイヤ朝末期</strong>から、<strong>アラブ人の土地所有者</strong>にも土地税の<strong>ハラージュ</strong>を課すようになっていた。"],
    takeaway: "改宗者のジズヤ免除により、信徒間の不平等を改めた。", note: "ジズヤは人に、ハラージュは土地にかかる税として区別します。"
  }),
  makeScene({
    id: "tax-system-comparison", chapter: 1, year: "二王朝の税制", frame: [32, 27, 49, 38], zones: ["umayyadCore", "abbasid"], pins: ["damascus", "baghdad"], routes: [{ points: [[36.29, 33.51], [44.37, 33.32]], kind: "move" }],
    tags: [{ at: [35, 36], text: "アラブ帝国" }, { at: [46, 36], text: "イスラーム帝国" }],
    facts: ["ジズヤ【人頭税】：ウマイヤ朝は改宗者にも課税する不平等／アッバース朝はムスリムを免税し平等へ", "ハラージュ【土地税】：アッバース朝ではアラブ人・改宗者・異教徒に課税"], actors: [{ name: "イスラーム教徒のアラブ人", image: "arab-cavalry", at: "damascus", bubble: "ウマイヤ朝では特権を持つ" }, { name: "イスラーム教徒の改宗者", image: "mawali-farmer", at: "baghdad", bubble: "アッバース朝では平等になる" }],
    title: "『アラブ帝国』から、\n『イスラーム帝国』へ変わる。", kicker: "税制表で比べる二王朝", mapHeading: "ダマスクスのウマイヤ朝とバグダードのアッバース朝", focus: "ジズヤ・ハラージュと三つの身分",
    before: "ウマイヤ朝ではアラブ人が特権を持つ", after: "アッバース朝ではムスリム間の平等を進める",
    body: ["<strong>ダマスクス【ダマスカス】</strong>の<strong>ウマイヤ朝</strong>では、<strong>イスラーム教徒のアラブ人</strong>は<strong>ジズヤ【人頭税】</strong>を免れたが、<strong>改宗者</strong>と<strong>異教徒</strong>には課された。<strong>ハラージュ【土地税】</strong>も、末期を除けばアラブ人は免れ、改宗者と異教徒が負担した。", "<strong>バグダード</strong>の<strong>アッバース朝</strong>ではアラブ人と改宗者のジズヤを免除し、異教徒には課した。ハラージュは土地を持つ<strong>アラブ人</strong>・改宗者・異教徒が負担した。<strong>不平等</strong>な『<strong>アラブ帝国</strong>』から、<strong>平等</strong>を進める『<strong>イスラーム帝国</strong>』へ変わった。"],
    takeaway: "民族ではなく、信仰と土地を基準に税制を整えた。", note: "二つの都を結びながら、王朝交代による税制の変化を比べます。"
  }),
  makeScene({
    id: "mansur-baghdad", chapter: 1, year: "762年", frame: [38, 27, 50, 38], zones: ["mesopotamia"], pins: ["baghdad", "tigris", "euphrates"], routes: [{ points: [[42.2, 34.1], [44.37, 33.32], [43.9, 34.4]], kind: "trade" }],
    facts: ["第2代マンスール【位754〜775年】", "バグダード『平安の都【マディーナト＝アッサラーム】』を762年に建設", "二つの川を使う交易の国際都市"], actors: [{ name: "第2代マンスール", image: "mansur-calm", at: "baghdad", bubble: "二つの川で物産を集める" }],
    title: "マンスールが二つの川の間に、\n新都バグダードを築く。", kicker: "交易に適した新しい都", mapHeading: "ティグリス川とユーフラテス川の間のバグダード", focus: "762年の平安の都",
    before: "新王朝にふさわしい国際都市を計画する", after: "二つの川の物産が集まるバグダードを建設する",
    body: ["<strong>第2代マンスール【位754〜775年】</strong>は、<strong>762年</strong>、<strong>ティグリス川</strong>流域に新都<strong>バグダード</strong>を建設した。都は『<strong>平安の都【マディーナト＝アッサラーム】</strong>』ともよばれた。", "<strong>ユーフラテス川</strong>とティグリス川の両方を使って各地の物産を集められる、<strong>交易</strong>に適した<strong>国際都市</strong>として計画された。"],
    takeaway: "二つの川と交易路が、バグダードの立地を決めた。", note: "都の位置を、ティグリス川とユーフラテス川の関係から確認します。"
  }),
  makeScene({
    id: "round-city-roads", chapter: 1, year: "新都の整備", frame: [39, 27, 50, 39], zones: ["mesopotamia"], pins: ["baghdad"], routes: [{ points: [[44.37, 33.32], [44.37, 38]], kind: "move" }, { points: [[44.37, 33.32], [49, 30]], kind: "move" }, { points: [[44.37, 33.32], [40, 29]], kind: "move" }, { points: [[44.37, 33.32], [39, 35]], kind: "move" }],
    tags: [{ at: [44.4, 37], text: "ホラーサーン門" }, { at: [48, 30], text: "バスラ門" }, { at: [40, 29], text: "クーファ門" }, { at: [40, 36], text: "シリア門" }], facts: ["中央に円城を置き四つの門から街道を延ばす", "帝国全土の主要街道に駅伝制を整備"], props: [{ name: "バグダードの円城", image: "baghdad-round-city", kind: "prop", at: "baghdad", size: 68 }],
    title: "円城の四つの門から街道を延ばし、\n駅伝制を整える。", kicker: "都と帝国全土を結ぶ", mapHeading: "バグダードの円城から四方の街道へ", focus: "四門と駅伝制",
    before: "バグダード中央に円城を築く", after: "四つの門から帝国全土へ街道と駅伝制を広げる",
    body: ["<strong>バグダード</strong>の中央には<strong>円城</strong>が置かれ、<strong>ホラーサーン門</strong>・<strong>バスラ門</strong>・<strong>クーファ門</strong>・<strong>シリア門</strong>の四つの門が設けられた。", "四門から<strong>帝国全土</strong>へ<strong>街道</strong>を延ばし、主要街道に<strong>駅伝制</strong>を整えた。"],
    takeaway: "バグダードを起点に、道路と情報の網が帝国へ広がった。", note: "四つの門は都の構造を示す模式的な配置です。"
  }),
  makeScene({
    id: "bureaucracy-centralization", chapter: 1, year: "中央集権体制", frame: [34, 25, 61, 41], zones: ["abbasid", "mesopotamia"], pins: ["iraq", "baghdad", "khorasan"], routes: [{ points: [[59, 35.5], [50, 35], [44.37, 33.32]], kind: "move" }], tags: [{ at: [43, 29], text: "メソポタミア" }, { at: [47, 37], text: "官僚機構" }],
    facts: ["イラク：農地開発を進め食糧生産の中心地へ", "ワズィール【宰相】・ディーワーン【中央官庁】にイラン人の書記を登用", "アケメネス朝・ササン朝の仕組みを取り入れ中央集権化"], actors: [{ name: "イラン人の改宗者", image: "wazir-persian", at: "khorasan", route: 0, bubble: "官僚として帝国を支える" }],
    title: "イラン人官僚を登用し、\n中央集権体制を整える。", kicker: "農業・官僚・旧帝国の制度", mapHeading: "ホラーサーンからメソポタミアの統治拠点へ", focus: "イラクの農地開発とイラン人官僚",
    before: "イラクで農地開発を進める", after: "イラン人の改宗者を官僚に登用し中央集権化する",
    body: ["<strong>バグダード</strong>周辺の<strong>イラク</strong>で<strong>農地開発</strong>を進めて<strong>食糧生産</strong>の中心地とし、<strong>メソポタミア</strong>を帝国支配の拠点にした。", "<strong>ホラーサーン</strong>などの<strong>イラン人の改宗者</strong>を<strong>官僚機構</strong>へ登用し、<strong>ワズィール【宰相】</strong>を置いた。<strong>ディーワーン【中央官庁】</strong>では<strong>イラン人の書記</strong>が働き、<strong>アケメネス朝</strong>や<strong>ササン朝</strong>の仕組みを取り入れて<strong>中央集権</strong>を進めた。"],
    takeaway: "農業とイラン人官僚が、アッバース朝の中央集権を支えた。", note: "征服地の人材と旧帝国の制度を取り込んだ点が重要です。"
  }),
  makeScene({
    id: "ulama-sharia", chapter: 1, year: "イスラーム法の整備", frame: [37, 26, 51, 39], zones: ["abbasid"], pins: ["baghdad"], tags: [{ at: [47, 36], text: "イスラーム法【シャリーア】" }], facts: ["『コーラン』を根拠に法学者【ウラマー】が構築", "政治・経済から人びとの日常生活までを規定"], actors: [{ name: "法学者【ウラマー】", image: "ulama-jurist", at: "baghdad", bubble: "『コーラン』から規範を整える" }],
    title: "ウラマーが『コーラン』を根拠に、\nシャリーアを整える。", kicker: "信仰から生活の規範へ", mapHeading: "バグダードでイスラーム法を整える", focus: "法学者と政治・経済・日常生活",
    before: "『コーラン』を法の根拠とする", after: "ウラマーがシャリーアを構築する",
    body: ["<strong>バグダード</strong>などで<strong>法学者【ウラマー】</strong>が、『<strong>コーラン</strong>』を根拠に<strong>イスラーム法【シャリーア】</strong>を構築していった。", "シャリーアは<strong>政治・経済</strong>から人びとの<strong>日常生活</strong>までを規定した。"],
    takeaway: "ウラマーが、信仰を社会と生活の規範へ結びつけた。", note: "法学者の役割と、法が及ぶ範囲を同じ場面で示します。"
  }),
  makeScene({
    id: "harun-golden-age", chapter: 2, year: "786〜809年", frame: [37, 25, 51, 39], zones: ["abbasid", "mesopotamia"], pins: ["baghdad", "iraq"], tags: [{ at: [47, 36], text: "人口100万人を超える大都市" }], facts: ["第5代ハールーン＝アッラシード【位786〜809年】", "交易・農業に支えられアッバース朝が全盛期へ", "『千夜一夜物語』に何度も登場"], actors: [{ name: "第5代ハールーン＝アッラシード", image: "harun-alrashid", at: "baghdad", bubble: "学芸と都市の繁栄を支える" }],
    title: "ハールーン＝アッラシードの時代に、\nアッバース朝が全盛期を迎える。", kicker: "人口100万人のバグダード", mapHeading: "イラクの農業と交易がバグダードを支える", focus: "第5代カリフと大都市の繁栄",
    before: "イラクの農業と帝国の交易が発展する", after: "バグダードが人口100万人を超える大都市になる",
    body: ["<strong>第5代ハールーン＝アッラシード【位786〜809年】</strong>の時代、<strong>アッバース朝</strong>は<strong>全盛期</strong>を迎えた。", "<strong>イラク</strong>の<strong>農業</strong>と広域の<strong>交易</strong>に支えられ、<strong>バグダード</strong>は<strong>人口100万人</strong>を超える<strong>大都市</strong>へ成長した。ハールーン＝アッラシードは『<strong>千夜一夜物語</strong>』にも何度も登場する。"],
    takeaway: "農業と交易が、全盛期のバグダードを支えた。", note: "物語上の登場については、歴史上の本人の発言として扱いません。"
  }),
  makeScene({
    id: "east-west-trade", chapter: 2, year: "アッバース朝全盛期", frame: [38, 17, 112, 43], zones: ["abbasid"], pins: ["baghdad", "china"], routes: [{ points: [[44.37, 33.32], [61, 25], [80, 22], [105, 35]], kind: "trade" }], facts: ["東西交易：アラブ系ムスリム商人が海路を中心に活躍", "中国ではアッバース朝の人びとを大食とよぶ"], actors: [{ name: "アラブ系ムスリム商人", image: "islam-origin/quraysh-merchant", at: "baghdad", route: 0, bubble: "海路で中国まで進む" }],
    title: "ムスリム商人が海路で東西を結び、\n中国で『大食』とよばれる。", kicker: "バグダードから中国へ", mapHeading: "アラブ系ムスリム商人が海路で中国へ向かう", focus: "東西交易と大食",
    before: "バグダードに各地の物産が集まる", after: "アラブ系ムスリム商人が中国まで海路を進む",
    body: ["<strong>東西交易</strong>では、<strong>バグダード</strong>を起点とする<strong>アラブ系ムスリム商人</strong>が<strong>海路</strong>を中心に活躍した。", "商人は遠く<strong>中国</strong>まで至り、中国ではアッバース朝の人びとが『<strong>大食</strong>』とよばれた。"],
    takeaway: "海路のムスリム商人が、バグダードと中国を結んだ。", note: "大食は、中国側で使われた呼び名です。"
  }),
  makeScene({
    id: "house-of-wisdom", chapter: 2, year: "813〜833年", frame: [36, 25, 52, 40], zones: ["abbasid"], pins: ["baghdad"], tags: [{ at: [48, 37], text: "哲学・数学・医学・天文学" }], facts: ["ハールーン＝アッラシード：学芸を奨励しギリシア語文献をアラビア語へ翻訳", "第7代マームーン【位813〜833年】：知恵の館【バイト＝アルヒクマ】へ発展", "ムスリムの学者が学問を発展／イスラーム文化の黄金期"], actors: [{ name: "第7代マームーン", image: "mamun-scholar", at: "baghdad", bubble: "翻訳から学問を発展させる" }], props: [{ name: "知恵の館【バイト＝アルヒクマ】", image: "house-of-wisdom", kind: "prop", at: [47, 33], size: 62 }],
    title: "知恵の館で文献を翻訳し、\nさまざまな学問を発展させる。", kicker: "イスラーム文化の黄金期", mapHeading: "バグダードの知恵の館に文献と学者が集まる", focus: "ギリシア語からアラビア語への翻訳",
    before: "ハールーン＝アッラシードがギリシア語の文献を集める", after: "マームーンが知恵の館へ発展させる",
    body: ["<strong>ハールーン＝アッラシード</strong>は<strong>学芸</strong>を奨励し、<strong>バグダード</strong>に<strong>ギリシア語</strong>の文献を集めて<strong>アラビア語</strong>へ翻訳させた。<strong>イスラーム文化</strong>は<strong>黄金期</strong>を迎えた。", "<strong>第7代マームーン【位813〜833年】</strong>の時代に、翻訳の場は『<strong>知恵の館【バイト＝アルヒクマ】</strong>』へ発展した。<strong>哲学</strong>・<strong>数学</strong>・<strong>医学</strong>・<strong>天文学</strong>の文献が翻訳され、<strong>ムスリムの学者</strong>が学問を発展させた。"],
    takeaway: "翻訳と研究が、イスラーム文化の黄金期を形づくった。", note: "翻訳の取り組みがハールーンからマームーンへ発展する順で示します。"
  }),
  makeScene({
    id: "talas-islam", chapter: 2, year: "751年", frame: [38, 26, 108, 48], zones: ["abbasid", "centralAsia"], pins: ["baghdad", "talas", "centralAsia"], routes: [{ points: [[44.37, 33.32], [58, 38], [71.38, 42.9]], kind: "campaign" }, { points: [[95, 39], [82, 41], [71.38, 42.9]], kind: "rival" }], tags: [{ at: [95, 39], text: "唐" }], facts: ["タラス河畔の戦い【751年】：アッバース朝が唐を破る", "中央アジアにイスラームが広がる"], actors: [{ name: "アッバース朝軍", image: "arab-cavalry", at: "baghdad", route: 0, bubble: "タラス河畔へ進む" }],
    title: "タラス河畔の戦いで唐を破り、\n中央アジアへイスラームが広がる。", kicker: "751年の東方での戦い", mapHeading: "バグダードと唐からタラス河畔へ", focus: "アッバース朝・唐・中央アジア",
    before: "アッバース朝軍と唐の軍がタラス河畔へ進む", after: "アッバース朝が唐を破り中央アジアへイスラームが広がる",
    body: ["<strong>751年</strong>、<strong>アッバース朝</strong>は<strong>タラス河畔の戦い</strong>で<strong>唐</strong>を破った。", "この戦いを経て、<strong>中央アジア</strong>へ<strong>イスラーム</strong>が広がった。地図では<strong>バグダード</strong>側と唐側から<strong>タラス河畔</strong>へ向かう動きを示す。"],
    takeaway: "タラス河畔の戦いが、中央アジアへのイスラーム拡大につながった。", note: "戦いの両軍と、その後にイスラームが広がる方向へ注目しましょう。"
  }),
  makeScene({
    id: "turk-migration", chapter: 2, year: "9世紀後半", frame: [57, 32, 110, 52], zones: ["centralAsia"], pins: ["uighur", "centralAsia"], routes: [{ points: [[101, 46], [86, 44], [74, 42], [68, 40]], kind: "move" }], facts: ["9世紀後半：ウイグルが滅亡", "トルコ人が中央アジアへ多数移動"], actors: [{ name: "移動するトルコ人", image: "mamluk-guard", at: "uighur", route: 0, bubble: "中央アジアへ移る" }],
    title: "ウイグルの滅亡後、\nトルコ人が中央アジアへ移動する。", kicker: "マムルーク登場の背景", mapHeading: "ウイグルから中央アジアへの移動", focus: "9世紀後半のトルコ人移動",
    before: "9世紀後半にウイグルが滅亡する", after: "トルコ人が中央アジアへ多数移動する",
    body: ["<strong>9世紀後半</strong>に<strong>ウイグル</strong>が<strong>滅亡</strong>すると、<strong>トルコ人</strong>が多数移動した。", "移動先となった<strong>中央アジア</strong>では、イスラーム世界とトルコ人の接触が深まっていった。"],
    takeaway: "トルコ人の中央アジア移動が、マムルーク登場の背景になった。", note: "王朝名を先取りせず、人びとの移動だけを示します。"
  }),
  makeScene({
    id: "mamluk-guards", chapter: 2, year: "9世紀頃", frame: [39, 27, 79, 48], zones: ["abbasid", "centralAsia"], pins: ["centralAsia", "baghdad"], routes: [{ points: [[68, 40], [58, 38], [44.37, 33.32]], kind: "move" }], facts: ["9世紀頃のマムルーク：トルコ人奴隷出身の軍人による騎馬軍団", "イスラームへ改宗しカリフに忠誠を誓う親衛隊"], actors: [{ name: "マムルーク", image: "mamluk-guard", at: "centralAsia", route: 0, bubble: "カリフの親衛隊となる" }],
    title: "トルコ人のマムルークを集め、\nカリフの親衛隊をつくる。", kicker: "軍の中核となる騎馬軍団", mapHeading: "中央アジアからバグダードの親衛隊へ", focus: "改宗・忠誠・トルコ人のイスラーム化",
    before: "中央アジアにトルコ人が多数移動する", after: "アッバース朝がマムルークで親衛隊を編成する",
    body: ["<strong>9世紀</strong>頃から、<strong>アッバース朝</strong>は<strong>トルコ人奴隷出身の軍人</strong>である<strong>マムルーク</strong>を集め、強力な<strong>騎馬軍団</strong>を編成した。", "マムルークは<strong>イスラーム</strong>へ<strong>改宗</strong>し、<strong>カリフ</strong>に絶対の<strong>忠誠</strong>を誓う<strong>親衛隊</strong>となった。これにより<strong>トルコ人のイスラーム化</strong>が進んだ。<strong>中央アジア</strong>から<strong>バグダード</strong>への移動を地図で示す。"],
    takeaway: "マムルークが、アッバース朝軍の中核になった。", note: "ここでいう奴隷は、単純な強制労働者を意味しません。"
  }),
  makeScene({
    id: "mamluk-power", chapter: 2, year: "9世紀以後", frame: [37, 25, 57, 40], zones: ["abbasid"], pins: ["baghdad"], routes: [{ points: [[44.37, 33.32], [48, 36]], kind: "rival" }, { points: [[44.37, 33.32], [53, 31]], kind: "move" }], tags: [{ at: [48, 37], text: "カリフの廃立" }, { at: [53, 30], text: "自立して王朝を建てる" }], facts: ["マムルーク：強制労働者ではなく君主の側近から司令官・総督となる支配階級", "カリフの権力が弱まりイスラーム世界は分裂へ"], actors: [{ name: "強大化したマムルーク軍団", image: "mamluk-guard", at: "baghdad", route: 0, bubble: "カリフの人選にも介入する" }],
    title: "マムルーク軍団が政治へ介入し、\nカリフの権力が弱まる。", kicker: "分裂の時代へ", mapHeading: "バグダードで強大化するマムルーク軍団", focus: "司令官・総督・カリフの廃立",
    before: "マムルークが君主の側近と親衛隊になる", after: "政治介入と自立でカリフの権力が弱まる",
    body: ["<strong>マムルーク</strong>は<strong>強制労働</strong>に従事する存在ではなく、<strong>君主の側近</strong>として実力を認められると<strong>司令官</strong>や<strong>総督</strong>になる<strong>支配階級</strong>だった。", "強大化した<strong>マムルーク軍団</strong>は<strong>カリフの廃立</strong>などの<strong>政治介入</strong>を始め、自立して<strong>王朝</strong>を建てる者も現れた。<strong>バグダード</strong>の<strong>カリフの権力</strong>は弱まり、<strong>イスラーム世界</strong>は<strong>分裂</strong>の時代へ進んだ。"],
    takeaway: "軍を支えたマムルークの強大化が、カリフ権力を弱めた。", note: "次の教材では、各地に自立した政権を具体的にたどります。"
  })
];
