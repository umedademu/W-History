import { places } from "./ottoman-scenes.js?v=0.010";

// 本文に登場する名前と、地図に描く地点・範囲・役割を対応させる。
const point = value => typeof value === "string" ? places[value].point : value;
const geo = (name, at, aliases = [], outline) => ({ name, at: point(at), aliases: [name, ...aliases], kind: "place", outline });
const person = (name, at, image, aliases = []) => ({ name, at: point(at), image, aliases: [name, ...aliases], kind: "person", icon: "person" });
const symbol = (name, at, icon, aliases = []) => ({ name, at: point(at), aliases: [name, ...aliases], kind: "symbol", icon });
const state = (name, at, aliases = []) => ({ ...geo(name, at, aliases), kind: "state" });
const anatolia = [[26,39],[27,41],[33,42],[39,41],[43,39],[42,37],[36,36],[29,36]];
const balkans = [[19,40],[20,45],[26,45],[29,41],[25,38],[21,37]];
export const entities = {
  anatolia: geo("アナトリア（小アジア）", [34,39], ["アナトリア","小アジア"], anatolia),
  northwest: geo("アナトリア西北部", [29.5,40], ["アナトリア北西部"], [[27.5,39],[31,39],[31,41],[28,41.5]]),
  eastAnatolia: geo("東アナトリア", [40,39], ["アナトリア東部"], [[37,37],[43,37],[44,40],[40,41],[37,40]]),
  balkans: geo("バルカン半島", [23,42], ["バルカン"], balkans),
  europe: geo("ヨーロッパ", [16,49]), asia: geo("アジア", [43,43]), africa: geo("アフリカ", [24,25]),
  centralAsia: geo("中央アジア", [65,40]), westEurope: geo("西欧", [4,48], ["西ヨーロッパ"]),
  mediterranean: geo("地中海", [20,34]), eastMediterranean: geo("東地中海", [30,33]), blackSea: geo("黒海", [34,43.8]),
  redSea: geo("紅海", [37.5,23.5]), gulf: geo("ペルシア湾", [50,27]),
  danube: geo("ドナウ川", [23,44.4], ["ドナウ"], [[16.4,48.2],[19,47.5],[19.9,45.2],[22,44.6],[25,43.7],[29,45.1]]),
  dardanelles: geo("ダーダネルス海峡", [26.5,40.2]), bosphorus: geo("ボスポラス海峡", [29.04,41.07]),
  sogut: geo("ソグート", "sogut"), bursa: geo("ブルサ", "bursa"), edirne: geo("エディルネ（アドリアノープル）", "edirne", ["エディルネ","アドリアノープル"]),
  constantinople: geo("コンスタンティノープル", "istanbul"), istanbul: geo("イスタンブル", "istanbul"),
  kosovo: geo("コソヴォ", "kosovo"), nicopolis: geo("ニコポリス", "nicopolis"), ankara: geo("アンカラ", "ankara"),
  chaldiran: geo("チャルディラーン", "chaldiran"), tabriz: geo("タブリーズ", "tabriz"),
  cairo: geo("カイロ", "cairo"), damascus: geo("ダマスクス", "damascus"), mecca: geo("メッカ", "mecca"), medina: geo("メディナ", "medina"),
  baghdad: geo("バグダード", "baghdad"), mohacs: geo("モハーチ", "mohacs"), buda: geo("ブダ", "buda"), vienna: geo("ウィーン", "vienna"),
  preveza: geo("プレヴェザ", "preveza"), lepanto: geo("レパント", "lepanto"), karlowitz: geo("カルロヴィッツ", "karlowitz"),
  serbia: geo("セルビア", [20.8,43.5]), bosnia: geo("ボスニア", [17.8,44]), bulgaria: geo("ブルガリア", [25.3,42.7]),
  hungary: geo("ハンガリー", [19.5,47], [], [[16.5,46],[20,45.5],[23,47],[21,49],[17,48.5]]),
  austria: geo("オーストリア", [14,47.5]), poland: geo("ポーランド", [20,52]), france: geo("フランス", [2.5,47]),
  spain: geo("スペイン", [-3.7,40.4]), venice: geo("ヴェネツィア", [12.33,45.44]), rome: geo("ローマ教皇庁", [12.45,41.9], ["ローマ教皇","教皇庁"]),
  england: geo("イングランド", [-1,52], ["イギリス"]), netherlands: geo("オランダ", [5,52]),
  greece: geo("ギリシア", [23,38.8]), cyprus: geo("キプロス島", [33.2,35]),
  iran: geo("イラン", [49,35]), iraq: geo("イラク", [44,33], ["メソポタミア"]), syria: geo("シリア", [37,35]), egypt: geo("エジプト", [30,27]),
  arabia: geo("アラビア半島", [44,25]), northAfrica: geo("北アフリカ", [12,31]),
  osman: person("オスマン1世", "sogut", "osman-calm"), orhan: person("オルハン", "bursa", "orhan-calm"),
  murad: person("ムラト1世", "edirne", "murad-calm"), bayezid: person("バヤジット1世", "bursa", "bayezid-angry", ["稲妻","ユルドゥルム"]),
  timur: person("ティムール", [65,40], "timur-march"), mehmed1: person("メフメト1世", "edirne", "mehmed1-calm"), murad2: person("ムラト2世", "edirne", "murad2-calm"),
  mehmed: person("メフメト2世", "istanbul", "mehmed-calm", ["ルームのカイサル","ローマ皇帝"]), urban: person("ウルバン", "istanbul", "urban-engineer", ["技術者ウルバン"]),
  selim: person("セリム1世", "istanbul", "selim-angry"), ismail: person("イスマーイール1世", "tabriz", "ismail-worried"),
  suleiman: person("スレイマン1世", "istanbul", "suleiman-calm", ["壮麗帝","立法者","カーヌーニー"]), barbaros: person("バルバロス（ハイレディン）", [3,36.8], "barbaros-admiral", ["バルバロス","ハイレディン"]),
  sigismund: person("ジギスムント", "buda", "sigismund-king", ["ハンガリー王ジギスムント"]), charles: person("カール5世", [8,49], "charles-emperor"), francis: person("フランソワ1世", [2.35,48.86], "francis-king"),
  sinan: person("建築家スィナン", "istanbul", "sinan-architect", ["スィナン","ミマール＝シナン"]), selim2: person("セリム2世", "istanbul", "selim2-calm"),
  philip: person("フェリペ2世", [-3.7,40.4], "philip-king"), sobieski: person("ヤン3世ソビエスキ", [19.94,50.06], "sobieski-king"), ahmed: person("アフメト3世", "istanbul", "ahmed-calm"),
  mongols: { ...symbol("モンゴル軍", [44,40], "cavalry", ["モンゴル"]), image: "mongol-cavalry" }, rum: state("ルーム＝セルジューク朝", [33,38.4]),
  beyliks: { ...symbol("ベイリク（小国家群）", [31,38], "town", ["ベイリク","小国家","小領邦"]), image: "beylik-castles" },
  ghazis: { ...symbol("トルコ人戦士（ガーズィー）", [29,39], "army", ["トルコ人戦士","トルコ人のイスラーム戦士","イスラーム戦士","戦士集団","ガーズィー"]), image: "ghazi-warrior" },
  ottoman: state("オスマン朝", "sogut", ["オスマン帝国"]), byzantine: state("ビザンツ帝国", "istanbul", ["ビザンツ","東ローマ帝国","ローマ帝国"]),
  ottomanArmy: { ...symbol("オスマン軍", "edirne", "army"), image: "ottoman-infantry" }, christian: { ...symbol("キリスト教徒の戦士", "bursa", "army", ["キリスト教徒"]), image: "christian-warrior" },
  slavs: { ...symbol("スラヴ連合軍", [19,44], "army", ["スラヴ軍"]), image: "slavic-knight" }, crusaders: { ...symbol("ヨーロッパ連合十字軍", "buda", "army", ["連合十字軍","十字軍"]), image: "crusader-knight" },
  nobles: { ...symbol("アナトリアの旧君侯", [35,38.5], "person", ["旧君侯"]), image: "beylik-noble" }, heirs: { ...symbol("後継者たち", "bursa", "person", ["後継者"]), image: "ottoman-princes" },
  residents: { ...symbol("住民", "edirne", "person"), image: "ottoman-resident" }, jurists: { ...symbol("イスラーム法学者", "edirne", "scroll"), image: "ulama-jurist" },
  boys: { ...symbol("キリスト教徒の少年", [23,42], "child"), image: "devshirme-boy" }, janissaries: { ...symbol("イェニチェリ", "edirne", "army"), image: "janissary-soldier" },
  devshirme: { ...symbol("デヴシルメ制", "edirne", "scroll"), image: "devshirme-registry" }, officials: { ...symbol("官僚・将軍・大宰相", "edirne", "person", ["官僚","将軍","宰相","大宰相"]), image: "grand-vizier" },
  sipahi: { ...symbol("スィパーヒー", "bursa", "cavalry", ["シパーヒー"]), image:"sipahi-cavalry" },
  qizilbash: { ...symbol("キジルバシュ騎兵", "tabriz", "cavalry", ["キジルバシュ"]), image: "qizilbash-cavalry" }, qadi: { ...symbol("裁判官カーディー", [40,39], "scroll", ["カーディー"]), image: "qadi-judge" },
  safavid: state("サファヴィー朝（シーア派）", "tabriz", ["サファヴィー朝","シーア派"]), mamluk: state("マムルーク朝", "cairo"),
  crimea: state("クリミア＝ハン国", "crimea", ["クリミア"]), abbasid: { ...symbol("カイロのアッバース家", "cairo", "person", ["アッバース家"]), image: "abbasid-caliph" },
  sunni: { ...symbol("スンナ派の聖都保護", "mecca", "scroll", ["スンナ派"]), image: "holy-cities-key" }, caliph: { ...symbol("スルタン＝カリフ制の主張", "istanbul", "scroll", ["スルタン＝カリフ制","カリフ位"]), image: "caliphate-symbol" },
  millet: { ...symbol("ミッレット制（宗教別共同体）", "istanbul", "scroll", ["ミッレット制","ミッレット","宗教別共同体"]), image: "millet-system" },
  jewish: { ...symbol("ユダヤ人商人", [-3.7,40.4], "merchant", ["ユダヤ人","ユダヤ教徒","ユダヤ"]), image: "jewish-merchant" },
  greek: { ...symbol("ギリシア人商人", [23,38], "merchant", ["ギリシア人"]), image: "greek-merchant" }, armenian: { ...symbol("アルメニア人商人", "istanbul", "merchant", ["アルメニア人","アルメニア商人","アルメニア"]), image:"armenian-merchant" },
  tax: { ...symbol("税の納入", "istanbul", "coin", ["税納入","徴税"]), image: "tax-collection" }, leaders: { ...symbol("共同体の宗教指導者", "istanbul", "person", ["首長"]), image: "millet-leader" },
  habsburg: state("ハプスブルク家・神聖ローマ帝国", [13,48], ["ハプスブルク家","ハプスブルク","神聖ローマ帝国","神聖ローマ皇帝"]),
  hungarianArmy: { ...symbol("ハンガリー王と軍", "mohacs", "army", ["ハンガリー王"]), image: "hungarian-cavalry" },
  ottomanFleet: { ...symbol("オスマン海軍", [26,36], "fleet", ["オスマン艦隊"]), image:"ottoman-galley" },
  allianceFleet: { ...symbol("連合艦隊", [18,37], "fleet", ["神聖同盟連合艦隊"]), image: "holy-league-galley" }, holyLeague: { ...symbol("神聖同盟諸国", "vienna", "army", ["神聖同盟"]), image: "holy-league-soldier" },
  walls: { ...symbol("テオドシウスの二重城壁", [28.948,41.015], "wall", ["テオドシウス","二重城壁","城壁","要塞"]), image: "theodosian-walls" },
  goldenHorn: geo("金角湾", [28.965,41.04]), chain: { ...symbol("金角湾の鉄の鎖", [28.985,41.029], "chain", ["鉄の鎖"]), image: "golden-horn-chain" },
  defenders: { ...symbol("ビザンツ守備軍", [28.975,41.015], "army"), image: "byzantine-defender" },
  cannon: { ...symbol("巨大大砲", [28.946,41.02], "cannon", ["ウルバンの巨砲","大砲"]), image:"giant-cannon" },
  guns: { ...symbol("鉄砲隊", "chaldiran", "army", ["鉄砲","火器部隊"]), image:"ottoman-gunner" },
  ships: { ...symbol("山越え軍艦", [29.02,41.06], "fleet", ["軍艦","艦船"]), image:"ottoman-galley" },
  topkapi: { ...symbol("トプカプ宮殿", [28.984,41.012], "palace"), image:"topkapi-palace" },
  hagia: { ...symbol("ハギア＝ソフィア", [28.980,41.0085], "church", ["大聖堂"]), image: "hagia-sophia-cathedral" },
  suleymaniye: { ...symbol("スレイマニエ＝モスク", [28.964,41.016], "mosque", ["スレイマニエ"]), image:"suleymaniye-mosque" },
  inn: { ...symbol("隊商宿", "istanbul", "town"), image:"ottoman-inn" },
  capitulation: { ...symbol("カピチュレーション", "istanbul", "scroll", ["通商特権","領事裁判権"]), image: "capitulation-charter" },
  frenchMerchants: { ...symbol("フランス商人", [5.37,43.3], "merchant"), image: "french-merchant" }, sharia: { ...symbol("シャリーア（イスラーム法）", "istanbul", "scroll", ["シャリーア","イスラーム法"]), image: "sharia-law" },
  kanun: { ...symbol("カーヌーン（世俗法典）", "istanbul", "scroll", ["カーヌーン","世俗法典","法典"]), image: "kanun-code" },
  timar: { ...symbol("ティマール制", "bursa", "scroll", ["ティマール"]), image: "timar-land" }, iltizam: { ...symbol("徴税請負制（イルティザーム）", "bursa", "coin", ["徴税請負制","イルティザーム"]), image: "iltizam-tax" },
  ayan: { ...symbol("地方有力者（アーヤーン）", [32,39], "person", ["アーヤーン","地方有力者"]), image: "ayan-notable" },
  treasury: { ...symbol("帝国の財政", "istanbul", "coin", ["軍事費","財政難","インフレ"]), image: "imperial-treasury" },
  treaty: { ...symbol("カルロヴィッツ条約", "karlowitz", "scroll"), image: "karlowitz-treaty" },
  tulip: { ...symbol("チューリップ", "istanbul", "flower", ["チューリップ時代"]), image:"tulip-flower" },
  press: { ...symbol("印刷機", "istanbul", "press"), image: "printing-press" }, baroque: { ...symbol("西欧風バロック建築", "istanbul", "palace", ["バロック建築"]), image: "ottoman-baroque" },
  industry: { ...symbol("産業革命", [-1.9,52.5], "factory"), image: "industrial-revolution" },
};

const step = (title, caption, ids, extra = {}) => ({ title, caption, ids, duration: 3200, ...extra });
const move = (who, path, kind = "campaign", extra = {}) => ({ who, path: path.map(p => typeof p === "string" ? entities[p]?.at ?? point(p) : p), kind, ...extra });
const message = (path, label) => ({ path: path.map(p => entities[p]?.at ?? p), kind:"trade", label });

export const storyboards = {
  founding: [
    step("アナトリアの位置", "黒海と地中海の間がアナトリア。西北部のソグートが、後のオスマン朝の出発点です。", ["anatolia","northwest","blackSea","mediterranean","sogut"], { year:"位置の確認", frame:[24,33,46,46], effect:"locate" }),
    step("モンゴルの侵入と王朝の弱体化", "東方からモンゴル軍が侵入。ルーム＝セルジューク朝の支配が弱まり、解体へ向かいます。", ["anatolia","rum","mongols"], { year:"13世紀", frame:[25,34,47,44], moves:[move("mongols",[[45,40],[40,39.5],[35,38.5]],"rival")], fades:["rum"], areas:[{id:"rum",points:[[30,37],[36,36.5],[40,39],[35,41],[30,40]],mode:"fade"}] }),
    step("小国家が各地に分立", "統一した支配が弱まると、トルコ人戦士（ガーズィー）のベイリクが各地に現れます。", ["anatolia","beyliks","ghazis"], { year:"13世紀後半", frame:[25,34,44,44], settlements:[[27.5,38.5],[29,37.5],[31,38],[33,37.5],[36,39],[30,40]], note:"小国家の数・範囲・配置は、分立を説明する模式図です。" }),
    step("ソグートからオスマン朝へ", "小国家の一つとして、オスマン1世がアナトリア西北部に戦士を集め、オスマン朝を築きます。", ["anatolia","northwest","sogut","osman","ghazis","ottoman"], { year:"1299年頃", frame:[25,35,43,43], positions:{ghazis:[30.8,39.5],ottoman:[29,40.7]}, moves:[move("ghazis",[[33,38],[31,39],"sogut"],"move")], areas:[{id:"ottoman",points:[[28.5,39.3],[30.8,39.3],[30.8,40.7],[28.5,40.7]],mode:"grow"}] })
  ],
  bursa: [
    step("ビザンツ領ブルサへ", "オルハンの軍がソグート方面からブルサへ進み、ビザンツ帝国の都市を奪います。", ["northwest","sogut","bursa","orhan","byzantine","ottoman","beyliks"], { positions:{byzantine:[28.5,40.8],ottoman:"sogut"}, moves:[move("orhan",["sogut","bursa"])], fades:["byzantine"] }),
    step("ブルサを都にする", "ブルサに都の印を置き、周辺の戦士と交易が集まる拠点をつくります。", ["bursa","orhan","ottoman","inn"], { capital:"bursa",positions:{ottoman:[29.5,40.6],inn:"bursa"}, grow:["inn"] }),
    step("宗教を越えて戦士を受け入れる", "トルコ人のイスラーム戦士と地元のキリスト教徒の戦士が、同じブルサへ集まります。", ["bursa","ghazis","christian","orhan"], { moves:[move("ghazis",[[31,39],"bursa"],"move"),move("christian",[[27.5,40.7],"bursa"],"move")] })
  ],
  edirne: [
    step("海峡と二つの大陸", "アジア側のブルサから、コンスタンティノープルを迂回し、ダーダネルス海峡を越えてバルカン半島へ進みます。", ["asia","europe","balkans","bursa","constantinople","dardanelles","murad"], { frame:[18,35,40,49],positions:{asia:[36,39],europe:[21,47]},moves:[move("murad",["bursa","dardanelles","edirne"])] }),
    step("エディルネへの遷都", "ムラト1世がビザンツの都市アドリアノープルを占領。エディルネを新しい都にします。", ["edirne","murad","byzantine","ottoman"], { capital:"edirne",positions:{byzantine:[27,42.5],ottoman:"edirne"},fades:["byzantine"] }),
    step("バルカン諸国の内紛", "ブルガリアやセルビアが分裂・内紛で弱まり、バルカン半島への進出を容易にしました。", ["balkans","bulgaria","serbia","ottomanArmy"], { moves:[move("ottomanArmy",["edirne","bulgaria","serbia"])],areas:[{id:"bulgaria",points:[[23,42],[27,42],[27,44],[23,44]],mode:"split"},{id:"serbia",points:[[19,42],[22,42],[22,45],[19,45]],mode:"split"}] })
  ],
  kosovo: [
    step("セルビア・ボスニアの連合軍", "セルビアやボスニアなどのスラヴ連合軍と、ムラト1世のオスマン軍がコソヴォへ向かいます。", ["balkans","serbia","bosnia","kosovo","edirne","murad","ottomanArmy","slavs"], {moves:[move("ottomanArmy",["edirne","kosovo"]),move("slavs",["bosnia","serbia","kosovo"],"rival")]}),
    step("勝利とムラト1世の死", "オスマン軍は連合軍を撃破しますが、ムラト1世は戦いの最中に殺されます。", ["kosovo","murad","ottomanArmy","slavs"], {positions:{murad:"kosovo",ottomanArmy:[21.8,42.5],slavs:[20.6,42.5]},fades:["slavs","murad"]}),
    step("少年の徴募と改宗・教育", "デヴシルメ制では、バルカンのキリスト教徒の少年を強制徴募し、イスラームの教育と軍事訓練を施しました。", ["balkans","boys","devshirme","jurists","edirne"], {year:"14〜15世紀・制度の成立過程",moves:[move("boys",[[22,43],"edirne"],"move"),move("jurists",[[27,40.5],"edirne"],"move")],note:"制度の成立過程を説明する図です。コソヴォの戦いの当日に制度が始まったという意味ではありません。"}),
    step("スルタン直属の軍人・官僚へ", "教育と訓練を経た人々がイェニチェリや官僚となり、将軍・大宰相への昇進の道も開かれました。", ["edirne","janissaries","officials","devshirme"], {year:"軍制・統治の仕組み",grow:["janissaries","officials"]})
  ],
  nicopolis: [
    step("二つの地域へ征服を拡大", "ムラト1世の後を継いだバヤジット1世が、バルカンとアナトリアへ支配を広げます。", ["murad","bayezid","balkans","anatolia","ottoman"], {frame:[17,34,45,47],fades:["murad"],moves:[move("bayezid",["bursa","edirne"])],areas:[{id:"ottoman",points:balkans,mode:"grow"}]}),
    step("ジギスムントと十字軍", "ハンガリー王ジギスムントを中心とするヨーロッパ連合十字軍が、ドナウ川を通じてニコポリスへ迫ります。", ["europe","hungary","danube","nicopolis","sigismund","crusaders"], {frame:[14,40,31,52],moves:[move("sigismund",["buda","nicopolis"],"rival"),move("crusaders",[[18,48],"buda","nicopolis"],"rival")]}),
    step("ニコポリスでオスマン軍が勝利", "南から来たバヤジット1世の軍が十字軍を破り、スルタンとしての威信を高めます。", ["nicopolis","bayezid","ottomanArmy","crusaders"], {moves:[move("bayezid",["edirne","nicopolis"]),move("ottomanArmy",[[26,42],"nicopolis"])],positions:{crusaders:"nicopolis"},fades:["crusaders"]})
  ],
  ankara: [
    step("旧君侯がティムールへ救援を求める", "アナトリアの旧君侯から、中央アジアのティムールへ救援の要請が届きます。", ["anatolia","nobles","centralAsia","timur","bayezid","europe"], {frame:[20,30,73,49],positions:{bayezid:"bursa",europe:[22,46]},messages:[message(["nobles","timur"],"救援の要請")]}),
    step("アンカラで二軍が衝突", "バヤジット1世は西から、ティムールは東からアンカラへ進軍し、オスマン軍が敗れます。", ["anatolia","ankara","bursa","bayezid","timur","ottomanArmy"], {frame:[25,34,45,45],moves:[move("bayezid",["bursa","ankara"]),move("timur",[[43,39],"ankara"],"rival")],positions:{ottomanArmy:"ankara"},fades:["ottomanArmy"]}),
    step("捕虜と後継者争い", "バヤジット1世は捕虜となり、オスマン朝では後継者争いが起こります。バルカンの領地が再建の足場として残ります。", ["bayezid","heirs","ottoman","balkans","ankara"], {positions:{bayezid:"ankara",ottoman:"bursa"},badges:{bayezid:"敗北・捕虜"},areas:[{id:"ottoman",points:anatolia,mode:"split"}]})
  ],
  recovery: [
    step("アナトリアの喪失とバルカンの支え", "アンカラの敗戦後、アナトリアの領地は縮小。バルカンの住民とエディルネの拠点が残ります。", ["ankara","anatolia","balkans","residents","edirne","bayezid"], {frame:[19,35,43,46],fades:["bayezid"],areas:[{id:"anatolia",points:anatolia,mode:"fade"}]}),
    step("メフメト1世が再統一", "約10年の後継者争いを収めたメフメト1世が、エディルネを拠点に国家を再統一します。", ["heirs","mehmed1","edirne","ottoman"], {positions:{heirs:[28,40.5],ottoman:"edirne"},fades:["heirs"],grow:["mehmed1"]}),
    step("ムラト2世のもとで統治を固める", "ムラト2世のもとでも官僚機構と軍制を整え、バルカンとアナトリアの統治を再建していきます。", ["murad2","officials","janissaries","balkans","anatolia"], {frame:[19,35,43,46],moves:[move("officials",["edirne","bursa"],"move")],grow:["janissaries"]})
  ],
  conquest: [
    step("ビザンツの首都を包囲", "メフメト2世のオスマン軍がエディルネから進み、ボスポラス海峡の都コンスタンティノープルを包囲します。", ["edirne","constantinople","bosphorus","byzantine","mehmed","ottomanArmy"], {moves:[move("mehmed",["edirne","constantinople"])]}),
    step("ハンガリー人ウルバンの巨砲", "ハンガリー出身の技術者ウルバンを起用し、巨大大砲を準備して攻略に投入します。", ["hungary","urban","cannon","mehmed","constantinople"], {frame:[16,37,33,49],positions:{urban:"constantinople",cannon:[28,41]},messages:[message(["hungary","urban"],"技術者の出身地")],grow:["cannon"]}),
    step("城壁と金角湾の鎖", "テオドシウスの二重城壁が陸側を守り、金角湾入口の鉄の鎖が艦隊の進入を妨げます。", ["constantinople","goldenHorn","bosphorus","walls","chain","defenders","cannon"], {frame:[28.91,40.99,29.075,41.10],detail:"siege",positions:{constantinople:[28.974,41.008],cannon:[28.936,41.018]},messages:[{path:[[28.936,41.018],[28.95,41.018]],kind:"campaign",label:"砲撃"}],note:"海峡・湾・城壁の位置関係を示す模式図。実際の市街図ではありません。"}),
    step("軍艦が陸を越え、湾内から攻める", "軍艦を金角湾の北側の陸上へ引き上げ、鎖を迂回して湾内へ運び込みます。陸と海からの攻撃で都が陥落します。", ["goldenHorn","bosphorus","walls","chain","ships","defenders","mehmed"], {frame:[28.91,40.99,29.075,41.10],detail:"siege",positions:{mehmed:[28.93,41.035]},moves:[move("ships",[[29.035,41.065],[29.012,41.075],[28.985,41.062],[28.965,41.047]],"move")],fades:["defenders","walls"],note:"船の輸送方向を示す模式図。鎖を破って海から通過したのではなく、陸を迂回しました。"})
  ],
  istanbul: [
    step("ビザンツ帝国の滅亡と遷都", "ビザンツ帝国が滅亡し、メフメト2世は征服した都へ移ります。以後ここをイスタンブルとしてたどります。", ["byzantine","constantinople","istanbul","edirne","mehmed","ottoman"], {positions:{ottoman:[29.8,40.8]},moves:[move("mehmed",["edirne","istanbul"],"move")],fades:["byzantine"],capital:"istanbul"}),
    step("ハギア＝ソフィアをモスクへ", "同じ建物がキリスト教の大聖堂からモスクへ用途を変え、帝国の宗教的中心の一つとなります。", ["istanbul","hagia","mehmed"], {frame:[28.94,40.995,29.02,41.04],detail:"city",afterIcons:{hagia:"mosque"},afterImages:{hagia:"suleymaniye-mosque"},badges:{hagia:"大聖堂 → モスク"},note:"建物のドット絵の変化は、大聖堂からモスクへの用途変更を示します。"}),
    step("トプカプ宮殿の造営", "メフメト2世が新宮殿を造営。ローマ皇帝の後継者も自称し、旧都の遺産を受け継いで帝国の中心を整えます。", ["istanbul","topkapi","mehmed","byzantine","ottoman","europe"], {frame:[20,36,37,46],positions:{europe:[22,44],byzantine:[28,42],ottoman:[31,40]},grow:["topkapi"],badges:{mehmed:"ルームのカイサルを自称"}}),
  ],
  millet: [
    step("バルカンから黒海北岸へ", "バルカンを支配する帝国が、黒海北岸のクリミア＝ハン国も従えます。", ["balkans","blackSea","crimea","ottoman","istanbul"], {frame:[18,35,40,49],positions:{ottoman:"istanbul"},messages:[message(["istanbul","crimea"],"服属関係")]}),
    step("納税と宗教共同体の自治", "キリスト教徒やユダヤ教徒の共同体が税を納め、宗教指導者を通じて信仰・婚姻・裁判などの自治を保ちます。", ["istanbul","christian","jewish","millet","tax","leaders"], {labels:{christian:"キリスト教徒の共同体",jewish:"ユダヤ教徒の共同体"},icons:{christian:"person"},images:{christian:"ottoman-resident"},positions:{christian:[27.5,41],jewish:[30.5,41],leaders:[29,40.2]},moves:[move("tax",[[30.5,41],"istanbul"],"trade")],note:"共同体は各地に存在しました。図はイスタンブル周辺にまとめた制度の模式図です。"}),
    step("スペインからユダヤ人商人が移住", "スペインを追われたユダヤ人たちがオスマン領へ移住し、商業にも参加します。", ["spain","jewish","istanbul","ottoman"], {frame:[-8,30,38,47],positions:{ottoman:[31,40]},moves:[move("jewish",["spain",[12,36],"istanbul"],"move")]}),
    step("多様な商人が交易を担う", "ギリシア人・アルメニア人・ユダヤ人の商人が、都や黒海沿岸の交易を結びます。", ["greek","armenian","jewish","istanbul","crimea","inn"], {frame:[20,35,38,48],positions:{jewish:"istanbul",inn:"istanbul"},moves:[move("greek",[[23,38],"istanbul"],"trade"),move("armenian",["istanbul","crimea"],"trade")]})
  ],
  chaldiran: [
    step("イランからアナトリアへの影響", "イランのシーア派サファヴィー朝がアナトリアへ影響を伸ばし、セリム1世が危機感を強めます。", ["iran","anatolia","safavid","selim","istanbul"], {frame:[26,32,54,46],messages:[message(["safavid","anatolia"],"宗教・政治的な影響")]}),
    step("チャルディラーンで火器と騎兵が対決", "セリム1世の軍が東進。イスマーイール1世とキジルバシュ騎兵を、鉄砲と大砲を備えたオスマン軍が破ります。", ["chaldiran","tabriz","selim","ismail","qizilbash","guns","cannon","ottomanArmy"], {frame:[38,35,49,43],positions:{ottomanArmy:"chaldiran",selim:[42,39],guns:[43,38.5],cannon:[43,39.5]},moves:[move("qizilbash",["tabriz","chaldiran"],"rival"),move("selim",[[40,39],"chaldiran"])],fades:["qizilbash"]}),
    step("東アナトリアの統治", "東アナトリアで支配を広げ、裁判官カーディーを派遣して統治を固めます。", ["eastAnatolia","chaldiran","qadi","selim","ottoman"], {frame:[29,34,47,45],positions:{selim:"chaldiran",ottoman:[38,40]},moves:[move("qadi",["istanbul",[40,39]],"move")],areas:[{id:"eastAnatolia",points:entities.eastAnatolia.outline,mode:"grow"}]})
  ],
  cairo: [
    step("シリアからエジプトへ", "セリム1世の軍がアナトリアからシリアを経てエジプトへ進みます。", ["anatolia","syria","egypt","damascus","cairo","selim","ottomanArmy"], {frame:[25,23,45,44],moves:[move("selim",["istanbul","damascus","cairo"])]}),
    step("カイロ攻略とマムルーク朝滅亡", "1517年にカイロを攻略し、マムルーク朝を滅ぼします。", ["egypt","cairo","mamluk","selim","ottoman"], {frame:[27,25,36,33],positions:{selim:"cairo",ottoman:"cairo"},fades:["mamluk"]}),
    step("紅海の向こうの二大聖都", "アラビア半島のメッカとメディナの保護権を得て、スンナ派イスラーム世界での権威を高めます。", ["arabia","redSea","mecca","medina","sunni","selim","cairo"], {frame:[28,19,48,33],positions:{selim:"cairo"},messages:[message(["cairo","mecca"],"聖都の保護"),message(["cairo","medina"],"聖都の保護")]}),
    step("後世に形成されたカリフ位継承の主張", "カイロのアッバース家からカリフ位を譲られたという主張は、後世に形成されました。", ["cairo","abbasid","istanbul","caliph"], {year:"後世・18世紀以降の主張",messages:[message(["abbasid","caliph"],"後世の継承説")],note:"1517年に実際の譲位式があったと断定する図ではありません。"})
  ],
  suleiman: [
    step("三つの海を押さえる帝国", "即位したスレイマン1世は、紅海・黒海・東地中海に広がる帝国の力を受け継ぎます。", ["suleiman","istanbul","redSea","blackSea","eastMediterranean","ottoman"], {frame:[22,20,45,47],positions:{ottoman:[33,38]}}),
    step("タブリーズからバグダードへ", "サファヴィー朝へ遠征し、タブリーズを経てバグダードを攻略。イラクを支配下に組み込みます。", ["suleiman","safavid","tabriz","baghdad","iraq"], {frame:[30,28,52,44],moves:[move("suleiman",[[33,39],"tabriz","baghdad"])],fades:["safavid"]}),
    step("ペルシア湾と交易路", "バグダードからペルシア湾へ通じる道を押さえ、海と内陸の交易路を結びます。", ["baghdad","iraq","gulf","suleiman","inn"], {frame:[39,23,55,38],positions:{suleiman:"baghdad",inn:"baghdad"},messages:[message(["baghdad",[47.8,30.5],"gulf"],"交易路")]}),
    step("壮麗帝・立法者", "ヨーロッパでは壮麗帝、帝国内では法典を整えた立法者として知られるスレイマン1世です。", ["europe","suleiman","kanun","istanbul"], {frame:[13,35,39,51],grow:["kanun"],badges:{suleiman:"壮麗帝／立法者"}})
  ],
  vienna1: [
    step("フランスとハプスブルクの対立", "カール5世のハプスブルク勢力に対抗し、フランソワ1世がスレイマン1世に支援を求めます。", ["westEurope","france","habsburg","charles","francis","suleiman"], {frame:[-2,37,34,54],messages:[message(["francis","suleiman"],"支援要請")]}),
    step("モハーチでハンガリー軍を破る", "スレイマン1世が北上し、1526年のモハーチの戦いでハンガリー王と軍を破ります。", ["hungary","mohacs","buda","suleiman","hungarianArmy","danube"], {frame:[14,39,31,51],moves:[move("suleiman",["istanbul","mohacs"]),move("hungarianArmy",["buda","mohacs"],"rival")],fades:["hungarianArmy"]}),
    step("第1次ウィーン包囲と撤退", "ドナウ川沿いに進み、1529年にウィーンを包囲。寒気と補給難で包囲を解きます。", ["vienna","austria","danube","suleiman","habsburg","europe","ottoman"], {frame:[12,41,30,52],positions:{habsburg:"vienna",europe:[13,51],ottoman:[23,43]},moves:[move("suleiman",["mohacs","vienna","mohacs"])],badges:{suleiman:"包囲 → 撤退"}})
  ],
  preveza: [
    step("北アフリカの提督を登用", "スレイマン1世が北アフリカで活動したバルバロスを海軍総司令官に登用します。", ["northAfrica","barbaros","suleiman","istanbul","mediterranean"], {frame:[-2,27,36,47],messages:[message(["suleiman","barbaros"],"海軍総司令官に任命")]}),
    step("スペイン・ヴェネツィア・教皇の連合", "スペイン、ヴェネツィア、ローマ教皇庁の勢力が艦隊を結集し、ギリシア西岸へ向かいます。", ["spain","venice","rome","allianceFleet","preveza","greece","westEurope"], {frame:[-8,30,29,49],messages:[message(["spain","allianceFleet"],"連合"),message(["venice","allianceFleet"],"連合"),message(["rome","allianceFleet"],"連合")],moves:[move("allianceFleet",[[16,37],"preveza"],"rival")]}),
    step("プレヴェザでオスマン海軍が勝利", "1538年、バルバロス率いるオスマン海軍が連合艦隊を破り、地中海での優位を強めます。", ["preveza","barbaros","ottomanFleet","allianceFleet","mediterranean","ottoman"], {frame:[15,32,29,43],positions:{barbaros:[22,38],ottoman:[27,39]},moves:[move("ottomanFleet",[[25,36],"preveza"]),move("allianceFleet",[[17,38],"preveza"],"rival")],fades:["allianceFleet"]})
  ],
  capitulation: [
    step("フランスに通商特権", "対ハプスブルクで連携するフランスへ、スレイマン1世が通商特権を与えます。フランス商人の往来が活発になります。", ["france","habsburg","suleiman","capitulation","frenchMerchants","istanbul"], {frame:[-2,35,35,53],moves:[move("frenchMerchants",[[5.37,43.3],[15,36],"istanbul"],"trade")]}),
    step("英・蘭にも広がる特権", "のちにイングランドやオランダにも特権が広がり、ヨーロッパとオスマン領を結ぶ貿易が発展します。", ["england","netherlands","capitulation","ottoman","istanbul"], {frame:[-6,34,35,56],positions:{ottoman:[32,39]},messages:[message(["england",[10,36],"istanbul"],"交易"),message(["netherlands",[15,36],"istanbul"],"交易")]}),
    step("シャリーアとカーヌーン", "イスラーム法シャリーアを基本に、世俗法典カーヌーンを整備して統治を支えます。", ["istanbul","suleiman","sharia","kanun"], {positions:{sharia:[28,41.6],kanun:[30,41.6]},grow:["kanun"]}),
    step("スィナンとスレイマニエ", "建築家スィナンが設計し、イスタンブルにスレイマニエ＝モスクが建てられます。", ["istanbul","sinan","suleymaniye","suleiman"], {frame:[28.93,40.99,29.02,41.05],detail:"city",grow:["suleymaniye"],positions:{sinan:[28.965,41.027],suleiman:[28.99,41.021]}})
  ],
  lepanto: [
    step("セリム2世の時代、キプロス島へ", "スレイマン1世の死後、セリム2世のもとでオスマン軍がキプロス島を征服します。", ["suleiman","selim2","cyprus","ottomanArmy","eastMediterranean"], {frame:[23,29,39,44],fades:["suleiman"],moves:[move("ottomanArmy",[[32,36.5],"cyprus"])]}),
    step("フェリペ2世と神聖同盟艦隊", "スペイン王フェリペ2世らが対抗し、連合艦隊がギリシア沖へ向かいます。", ["spain","philip","allianceFleet","greece","lepanto"], {frame:[-8,30,29,47],messages:[message(["philip","allianceFleet"],"神聖同盟の結成")],moves:[move("allianceFleet",[[15,37],"lepanto"],"rival")]}),
    step("レパントでオスマン海軍が敗北", "1571年のレパントの海戦で、オスマン海軍は連合艦隊に大敗します。", ["lepanto","greece","ottomanFleet","allianceFleet","mediterranean"], {frame:[16,32,29,43],moves:[move("ottomanFleet",[[26,37],"lepanto"]),move("allianceFleet",[[18,37],"lepanto"],"rival")],fades:["ottomanFleet"]}),
    step("艦隊再建と東地中海の維持", "敗戦後に艦隊を再建し、東地中海での支配は維持しました。不敗神話の崩壊と支配の消滅は別です。", ["ottomanFleet","istanbul","cyprus","eastMediterranean","ottoman"], {frame:[22,29,39,45],positions:{ottomanFleet:[30,35],ottoman:"istanbul"},grow:["ottomanFleet"]})
  ],
  crisis: [
    step("ティマール制と騎兵", "スィパーヒーは地方の徴税権を受け取り、戦時には騎兵として従軍する仕組みでした。", ["anatolia","balkans","bursa","sipahi","timar","tax","istanbul"], {frame:[20,35,42,46],positions:{tax:"bursa"},messages:[message(["istanbul","sipahi"],"徴税権"),message(["sipahi","istanbul"],"軍役")]}),
    step("火器歩兵の増員と軍事費", "鉄砲の普及で騎兵の役割が変化。イェニチェリなどの火器歩兵と軍事費が増え、財政を圧迫します。", ["sipahi","janissaries","guns","treasury","timar"], {positions:{janissaries:"istanbul",guns:[30,40],treasury:[29,42]},fades:["timar"],grow:["janissaries","guns"]}),
    step("徴税請負制と地方有力者", "徴税権を請け負う仕組みが広がり、地方有力者アーヤーンが力を伸ばします。銀の流入による物価上昇も財政難に重なりました。", ["iltizam","ayan","treasury","tax","bursa","edirne"], {messages:[message(["treasury","iltizam"],"徴税権の請負"),message(["iltizam","treasury"],"納入金")],grow:["ayan"],badges:{treasury:"軍事費増・物価上昇"}})
  ],
  karlowitz: [
    step("第2次ウィーン包囲", "1683年、オスマン軍が再びウィーンへ進み、オーストリアの都を包囲します。", ["istanbul","vienna","austria","ottomanArmy","hungary","danube"], {frame:[12,39,31,52],moves:[move("ottomanArmy",["istanbul","mohacs","vienna"])]}),
    step("ポーランド王の援軍と敗退", "ヤン3世ソビエスキらの援軍が北方から到着し、オスマン軍は包囲を解いて敗退します。", ["poland","sobieski","vienna","ottomanArmy","holyLeague"], {frame:[13,42,29,55],moves:[move("sobieski",[[19.94,50.06],"vienna"],"rival"),move("ottomanArmy",["vienna","mohacs"])],badges:{ottomanArmy:"包囲失敗・敗退"}}),
    step("カルロヴィッツ条約と領土割譲", "神聖同盟諸国との戦争に敗れ、1699年に条約を締結。ハンガリーの大部分などをオーストリアへ割譲します。", ["karlowitz","treaty","hungary","austria","holyLeague","ottoman","europe"], {frame:[12,39,31,53],positions:{ottoman:[27,42],europe:[13,52]},areas:[{id:"hungary",points:entities.hungary.outline,mode:"transfer"}],messages:[message(["hungary","austria"],"領土の割譲")],grow:["treaty"]})
  ],
  tulip: [
    step("アフメト3世の宮廷とチューリップ", "ヨーロッパとの平和のもと、アフメト3世の宮廷でチューリップを愛でる文化が花開きます。", ["ahmed","tulip","istanbul","europe"], {frame:[14,35,37,51],grow:["tulip"]}),
    step("西欧文化・印刷・建築", "西欧の文化を取り入れ、印刷機の導入やバロック風の建築も進みました。", ["westEurope","press","baroque","istanbul","ahmed"], {frame:[-3,34,37,54],messages:[message(["westEurope","istanbul"],"文化・技術の受容")],grow:["press","baroque"]}),
    step("小国家から三大陸の帝国へ", "アナトリアの小国家から、ヨーロッパ・アジア・アフリカにまたがるオスマン帝国へと歩みを振り返ります。", ["anatolia","beyliks","ottoman","europe","asia","africa"], {frame:[10,19,51,55],positions:{ottoman:"istanbul",beyliks:"sogut"},areas:[{id:"ottoman",points:[[17,48],[26,46],[43,42],[47,31],[33,23],[29,30],[19,38]],mode:"grow"}],note:"色は帝国が広がった地域の概略で、同じ年代の厳密な国境ではありません。"}),
    step("西欧の産業革命へ", "この後、西欧で産業革命が進みます。オスマン帝国と西欧の関係は近代にさらに変化していきます。", ["westEurope","england","industry","ottoman","istanbul"], {year:"18世紀後半以降へ",frame:[-7,33,39,57],positions:{ottoman:[32,40]},grow:["industry"],note:"チューリップ時代より後の変化を見通す場面です。"})
  ]
};

export function positionFor(id, step) {
  const value = step.positions?.[id] ?? entities[id].at;
  return typeof value === "string" ? entities[value]?.at ?? places[value]?.point : value;
}
export function mentionsFor(scene) {
  const ids = [...new Set(storyboards[scene.id].flatMap(step => step.ids))];
  return ids.flatMap(id => entities[id].aliases.map(term => ({ term, id, step: storyboards[scene.id].findIndex(s => s.ids.includes(id)) }))).sort((a,b) => b.term.length - a.term.length);
}
