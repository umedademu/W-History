import {scenes as sourceScenes} from "./ottoman-scenes.js?v=0.014";
import {storyboards,entities} from "./ottoman-storyboard.js?v=0.018";

// 主題の順序と、一ページに収める説明を明示する。異なる旧場面の動きも主題に沿ってまとめる。
// 頁番号・写真との照合は scripts/ottoman-reading-order.json で別に管理し、公開画面には出さない。
const plan = [
  ["founding-1",0,"トルコ人戦士がアナトリアへ進出する",["founding:0","founding:1"]],
  ["founding-2",0,"王朝の崩壊から、ベイリクの分立へ",["founding:2","founding:3"]],
  ["bursa-1",0,"オルハンがブルサを奪い、都にする",["bursa:0","bursa:1"]],
  ["bursa-2",0,"宗教を越えて戦士を受け入れる",["bursa:2"]],
  ["edirne-1",0,"首都を避け、アドリアノープルへ進む",["edirne:0","edirne:1"]],
  ["kosovo-1",0,"バルカンの内紛を突き、コソヴォで勝つ",["edirne:2","kosovo:1","kosovo:2"]],
  ["kosovo-2",0,"統治を整え、君主直属の軍を育てる",["kosovo:government","kosovo:0"]],
  ["kosovo-3",0,"デヴシルメからイェニチェリ・官僚へ",["kosovo:3","kosovo:4"]],
  ["nicopolis-1",0,"バヤジット1世の急拡大に十字軍が集まる",["nicopolis:1","nicopolis:0","nicopolis:2"]],
  ["nicopolis-2",0,"ニコポリスで連合十字軍を破る",["nicopolis:3","nicopolis:4"]],
  ["ankara-1",0,"旧君侯の救援要請から、アンカラの敗北へ",["ankara:0","ankara:1","ankara:2"]],
  ["recovery-1",0,"バルカンを足場に、約10年で復活する",["recovery:0","recovery:1","recovery:2"]],
  ["conquest-1",1,"メフメト2世が難攻不落の都を目指す",["conquest:0","conquest:4"]],
  ["timar-foundation",1,"歩兵・騎兵・艦隊を動員する",["crisis:0","crisis:1"]],
  ["conquest-2",1,"城壁と鎖の守りに、巨大大砲で挑む",["conquest:2","conquest:1"]],
  ["conquest-3",1,"軍艦を陸越えさせ、都を攻略する",["conquest:3"]],
  ["istanbul-1",1,"ビザンツ帝国が滅亡し、ローマの後継者を名乗る",["istanbul:0","istanbul:2"]],
  ["istanbul-2",1,"宮殿・モスク・学院・市場を整える",["istanbul:1","istanbul:3"]],
  ["millet-1",1,"バルカンから黒海北岸へ勢力を広げる",["millet:0","millet:1"]],
  ["millet-2",1,"多様な宗教の共同体に、納税と自治を認める",["millet:5","millet:2","millet:6"]],
  ["millet-3",1,"宗教を越えた保護が、商人の活動を支える",["millet:3","millet:4"]],
  ["chaldiran-1",2,"セリム1世がサファヴィー朝を破る",["chaldiran:0","chaldiran:1"]],
  ["chaldiran-2",2,"東方での勝利から、東アナトリアの統治へ",["chaldiran:3","chaldiran:2","chaldiran:4"]],
  ["cairo-1",2,"シリアからエジプトへ進み、マムルーク朝を滅ぼす",["cairo:0","cairo:1"]],
  ["cairo-2",2,"二大聖都を保護し、イスラーム世界の盟主へ",["cairo:2","cairo:3","cairo:4"]],
  ["suleiman-1",3,"交易の力を受け継ぎ、バグダードからイラクへ",["suleiman:0","suleiman:1","suleiman:2"]],
  ["vienna1-1",3,"ハプスブルク家に挟まれたフランスが支援を求める",["vienna1:0","vienna1:1"]],
  ["habsburg-marriages",3,"政略結婚がハプスブルク家とハンガリー王家を結ぶ",["vienna1:marriage"]],
  ["vienna1-2",3,"モハーチの勝利から、第1次ウィーン包囲へ",["vienna1:2","vienna1:succession","vienna1:3"]],
  ["preveza-1",3,"海の拠点を広げ、アルジェリアの提督を登用",["suleiman:4","preveza:0"]],
  ["preveza-2",3,"プレヴェザで連合艦隊を破る",["preveza:1","preveza:3"]],
  ["preveza-3",3,"地中海の優位を固め、インド洋でも争う",["preveza:4","preveza:5","suleiman:5"]],
  ["capitulation-1",3,"フランスとの連携が通商特権へつながる",["capitulation:0","capitulation:1"]],
  ["capitulation-2",3,"法と官僚機構を整え、立法者と呼ばれる",["capitulation:2","suleiman:3"]],
  ["capitulation-3",3,"スィナンの建築が、帝国の繁栄を表す",["capitulation:3"]],
  ["lepanto-1",4,"セリム2世の時代、レパントで敗れる",["lepanto:0","lepanto:1","lepanto:4"]],
  ["lepanto-3",4,"艦隊を再建し、地中海の制海権を保つ",["lepanto:3"]],
  ["crisis-2",4,"戦費の増大と徴税請負制が、従来の軍制を変える",["crisis:2","crisis:3"]],
  ["karlowitz-1",4,"第2次ウィーン包囲も援軍に阻まれる",["karlowitz:0","karlowitz:1"]],
  ["karlowitz-2",4,"カルロヴィッツ条約でハンガリーを割譲する",["karlowitz:3","karlowitz:2","karlowitz:4"]],
  ["tulip-1",5,"広大な帝国に西欧趣味が広がる",["karlowitz:5","tulip:0"]],
  ["tulip-2",5,"イギリスの産業革命と、力関係の変化",["tulip:3"]]
];

// 重複する戦闘は指揮官付きの説明に統合。主筋にない文化の例と、結末を中断する建国の再話は省く。
export const retiredAnimations={
  "preveza:2":"preveza:3 に戦闘と勝敗を統合",
  "lepanto:2":"lepanto:4 に戦闘と勝敗を統合",
  "tulip:1":"印刷機・バロック建築の独立した挿話を除き、宮廷の西欧趣味を tulip:0 に集約",
  "tulip:2":"結末の建国への巻き戻しを除き、宮廷文化から産業革命へ直接つなぐ"
};

// 各文章が、その瞬間の地図に登場する名前と出来事を説明する。
const text = {
  "founding:0": "11世紀、トルコ人戦士はアナトリア（小アジア）へ進出し、セルジューク朝から分かれたルーム＝セルジューク朝にまとまった。",
  "founding:1": "13世紀にモンゴルの遠征を受けると、ルーム＝セルジューク朝は崩壊へ向かった。",
  "founding:2": "王朝の崩壊後、アナトリア（小アジア）各地にトルコ人戦士の小国家ベイリクが分立した。",
  "founding:3": "その一つから現れたオスマン1世が、アナトリア西北部にオスマン朝を建てた。当初は小さな戦士集団にすぎなかった。",
  "bursa:0": "第2代のオルハンは、ビザンツ帝国からブルサを奪った。この獲得がオスマン朝発展の大きな足場となる。",
  "bursa:1": "オルハンはブルサをオスマン朝の都とし、ここからアナトリア（小アジア）のビザンツ帝国領を次々に奪った。",
  "bursa:2": "オルハンはトルコ人のイスラーム戦士だけでなく、キリスト教徒も宗教に関係なく戦士として受け入れた。この柔軟さがオスマン朝の発展を支えた。",
  "edirne:2": "この進出を容易にしたのが、バルカン半島の諸国の内紛だった。セルビアとの抗争でブルガリアは弱まり、そのセルビアも分裂していたため、オスマン軍にまとまって対抗することが難しかった。",
  "edirne:0": "第3代ムラト1世は、守りの堅いビザンツ帝国の首都コンスタンティノープルを避け、バルカン半島へ進んだ。",
  "edirne:1": "ムラト1世はビザンツ帝国第2の都市アドリアノープルを1362年に占領し、エディルネと呼んで1366年に都を移した。",
  "kosovo:1": "1389年、バルカン半島のコソヴォの戦い。セルビア・ボスニアなどのスラヴ連合軍に対し、ムラト1世のオスマン軍がエディルネから戦場へ向かう。",
  "kosovo:2": "コソヴォでオスマン軍はスラヴ連合軍を破った。しかしムラト1世も、戦いの最中に殺された。",
  "kosovo:0": "さらにムラト1世は、マムルークなどの奴隷軍人を手本に、スルタン直属の奴隷身分による常備歩兵軍団イェニチェリを創設した。",
  "kosovo:3": "バルカン半島のキリスト教徒の少年を強制徴募するデヴシルメ制。少年たちはエディルネなどへ集められ、イスラーム法学者（ウラマー）による教育と改宗、軍事訓練を受けた。",
  "kosovo:4": "エディルネなどでデヴシルメ制による教育と訓練を経た人々は、イェニチェリや官僚となる。功績によって将軍・大宰相への道も開かれた。",
  "nicopolis:1": "ムラト1世を継いだ「稲妻」バヤジット1世は、バルカン半島とアナトリア（小アジア）の征服を急速に進めた。",
  "nicopolis:0": "危機感を抱いたヨーロッパでは、イングランド（イギリス）・フランス・ドイツなどの軍がハンガリー王ジギスムントのもとに集まり、ヨーロッパ連合十字軍を結成した。",
  "nicopolis:2": "ハンガリーを中心に、国王ジギスムントが率いるヨーロッパ連合十字軍が南下。ドナウ川沿いのニコポリスの戦いへ向かう。",
  "nicopolis:3": "1396年、ニコポリスでバヤジット1世のオスマン軍が十字軍を破った。この勝利が、スルタンとしての威信を高める。",
  "nicopolis:4": "集団戦法をとるイェニチェリの強さを示したこの勝利以後、オスマン朝の君主はスルタンの称号で呼ばれるようになった。",
  "ankara:0": "アナトリアで領地を奪われた旧君侯たちは、中央アジアのティムールへ救援を求めた。征服を進めたバヤジット1世は、東方からの脅威に直面する。",
  "ankara:1": "1402年、アナトリア内陸のアンカラの戦い。ブルサから進むバヤジット1世と、東から進むティムールが激突し、オスマン軍は敗れた。",
  "ankara:2": "アンカラでバヤジット1世は捕虜となり、オスマン朝は1402年から1413年まで一時中断した。",
  "recovery:0": "アンカラの戦いで敗れた後も、バルカン半島の領地がオスマン朝復興の足場として残った。",
  "recovery:1": "オスマン朝は約10年で復活し、その後およそ半世紀をかけてバルカン半島の領土を回復した。",
  "recovery:2": "バヤジット1世の急拡大では地方支配が追いつかなかったため、復興期には征服地の統治を時間をかけて固めた。",
  "conquest:4": "この都は、なぜ攻略が難しかったのか。ボスポラス海峡に位置するコンスタンティノープルはビザンツ帝国の首都で、過去の防衛では焼夷兵器「ギリシアの火」でも知られた。",
  "conquest:0": "メフメト2世はオスマン軍を率い、1453年にビザンツ帝国の首都コンスタンティノープルを包囲した。",
  "conquest:1": "ハンガリー出身の技術者ウルバンが、600kgもの巨石を飛ばす巨大大砲を鋳造した。メフメト2世はその砲撃で、コンスタンティノープルの守りを崩そうとする。",
  "conquest:2": "コンスタンティノープルのビザンツ守備軍は、テオドシウスの二重城壁で陸側を守る。金角湾の入口には鉄の鎖を渡し、攻撃側の巨大大砲と艦隊に対抗した。",
  "conquest:3": "メフメト2世は72隻とされる軍艦を金角湾北岸の陸上へ引き上げ、鉄の鎖を迂回して湾内へ運び込んだ。城壁を守るビザンツ守備軍を陸と海から攻め、コンスタンティノープルは陥落した。",
  "istanbul:0": "1453年、コンスタンティノープルが陥落してビザンツ帝国は滅亡した。メフメト2世は都をコンスタンティノープル（のちのイスタンブル）へ移した。",
  "istanbul:1": "メフメト2世はイスタンブルのハギア＝ソフィアを、キリスト教の大聖堂からモスクへ転用した。同じ建物が、新たな支配のもとで宗教的中心の一つとなる。",
  "istanbul:2": "ローマ帝国を受け継ぐ国となったオスマン帝国で、メフメト2世はローマ皇帝の後継者を自称し、イスタンブルにトプカプ宮殿を造営した。",
  "istanbul:3": "メフメト2世はイスタンブルにマドラサ（学院）やスーク（市場）も整えた。都を、学問と商業の場として復興していく。",
  "millet:0": "都を整えた後も、メフメト2世のオスマン軍は征服を続けた。バルカン半島ではセルビア・ボスニア・ギリシア・アルバニアへ支配を広げていく。",
  "millet:1": "続いて、黒海北岸のクリミア＝ハン国（クリム＝ハン国）もオスマン帝国に服属した。アナトリアの残る諸勢力も征服し、イスタンブルを中心にバルカン半島と黒海周辺の支配を固めた。",
  "millet:5": "支配下の非イスラーム教徒には信仰を認め、自治と引き換えにオスマン帝国への貢納を求めた。こうした宗教別共同体がミッレトと呼ばれる。",
  "millet:2": "ミッレトという呼び名は、近代以降にヨーロッパ人がムスリムと非ムスリムの共存を説明するときに用いたものである。",
  "millet:6": "ミッレトでは、ユダヤ教徒・ギリシア正教徒・アルメニア教徒など各宗派の最高位の聖職者が信者をまとめた。",
  "millet:3": "オスマン帝国は富裕な商人を宗教に関係なく保護した。",
  "millet:4": "その保護のもと、ユダヤ商人やアルメニア商人が帝国内の交易で活躍した。",
  "chaldiran:0": "16世紀、イランにサファヴィー朝が成立し、トルコ系騎馬軍団を率いてアナトリア（小アジア）へ勢力を広げた。セリム1世はサファヴィー朝に味方したトルコ系部族の反乱を鎮圧した。",
  "chaldiran:1": "1514年のチャルディラーンの戦いで、セリム1世のオスマン軍はサファヴィー朝軍を破った。",
  "chaldiran:3": "チャルディラーンの戦いの勝利により、セリム1世は東アナトリアを獲得した。",
  "chaldiran:2": "チャルディラーンで勝利したセリム1世は、東アナトリアへオスマン帝国の支配を広げた。裁判官カーディーを派遣し、統治を固める。",
  "chaldiran:4": "これで現在のトルコ共和国が位置するアナトリア（小アジア）の全域が、オスマン帝国の支配下に入った。",
  "cairo:0": "サファヴィー朝を破ったセリム1世は、続いてシリアからエジプトへ侵攻し、カイロを目指した。",
  "cairo:1": "1517年、セリム1世はエジプトのカイロを攻略し、マムルーク朝を滅ぼした。オスマン帝国はこの地域を新たな支配下に置いた。",
  "cairo:2": "ヒジャーズは、アラビア半島西部の紅海沿岸にある地域。その中にイスラーム教の二大聖都メッカとメディナが位置する。",
  "cairo:3": "セリム1世はヒジャーズへ進出し、メッカとメディナの保護権を獲得した。二大聖都を保護するイスラーム世界の盟主として、スンナ派世界の主導権を握った。",
  "cairo:4": "18世紀以降にオスマン帝国が唱えたスルタン＝カリフ制は、この1517年にカイロのアッバース家からカリフ位を譲られたとする主張である。",
  "suleiman:0": "セリム1世の後を継ぎ、1520年にイスタンブルで即位したスレイマン1世。オスマン帝国は東地中海を押さえ、紅海・黒海の交易に支えられた経済力を持っていた。",
  "suleiman:3": "シャリーアの枠内でカーヌーンを整えたスレイマン1世は、官僚機構を整備して中央集権体制を確立した。",
  "suleiman:4": "中央ヨーロッパへの進出と並行し、スレイマン1世は地中海で活動するオスマン海軍も強化した。",
  "suleiman:1": "その力を受け継いだスレイマン1世は、サファヴィー朝からイラクを奪う。1534年、タブリーズを経てバグダードを攻略し、東方の支配を広げた。",
  "suleiman:2": "イラクのバグダードからペルシア湾へ通じる道も押さえたスレイマン1世。隊商宿を利用する商人の往来を支え、海と内陸を結ぶ交易の力を強めていく。",
  "suleiman:5": "さらにインド洋では、オスマン海軍がポルトガルの紅海・ペルシア湾への侵入を防ぎ、地中海貿易を守った。",
  "vienna1:0": "東方に続いて、西方の中央ヨーロッパで向き合ったのがハプスブルク家である。カール5世は神聖ローマ皇帝とスペイン王を兼ね、スペインではカルロス1世と呼ばれた。",
  "vienna1:1": "西欧のフランスは、カール5世が支配するスペインと神聖ローマ帝国に挟まれていた。フランス王フランソワ1世は宗教の違いを越えてスレイマン1世に支援を求め、共通の敵ハプスブルク家に対抗しようとした。",
  "vienna1:2": "こうした対立の中で、スレイマン1世はドナウ川沿いに北上した。1526年のモハーチの戦いで、ブダ方面から進むハンガリー王ラヨシュ2世の軍を破り、王は戦死。勝利を足場に、ハンガリーへの支配を広げていく。",
  "vienna1:3": "スレイマン1世はドナウ川沿いに進み、1529年にハプスブルク家の拠点であるオーストリアの都ウィーンを包囲した（第1次ウィーン包囲）。寒気と補給難のため包囲を解き、撤退した。",
  "preveza:0": "スレイマン1世は、アルジェリアで活動した海賊バイバロスを登用してオスマン海軍を強化した。",
  "preveza:1": "スペイン・ヴェネツィア・ローマ教皇の連合艦隊が、ギリシア西岸のプレヴェザへ進んだ。",
  "preveza:3": "1538年のプレヴェザの海戦で、バイバロス率いるオスマン海軍は連合艦隊を破った。",
  "preveza:4": "この勝利により、オスマン帝国はクレタ島とマルタ島を除く、ほぼ全地中海の制海権を握った。",
  "preveza:5": "陸では神聖ローマ皇帝カール5世、海ではスペイン王カルロス1世と対決したが、二つの名は同一人物を指す。",
  "capitulation:0": "スレイマン1世は、対ハプスブルク同盟を結んだフランス王フランソワ1世と共同し、領事裁判権や免税などの特権を認めた。これが後の通商特権カピチュレーションとなる。",
  "capitulation:1": "カピチュレーションはまずフランスに、のちにイングランド（イギリス）やオランダの商人にも与えられ、西ヨーロッパとの交易を盛んにした。",
  "capitulation:2": "一方、国内ではスレイマン1世がイスタンブルを中心に中央集権化を進めた。イスラーム法シャリーアの枠内で世俗法典カーヌーンを整え、官僚機構も充実させた。",
  "capitulation:3": "イスタンブルでは、建築家シナン（スィナン）の設計でスレイマン＝モスクが建立され、スレイマン1世時代の文化的繁栄を示した。",
  "lepanto:0": "スレイマン1世の死後も攻勢は続いたが、セリム2世の時代に海上で衰退の予兆が現れた。",
  "lepanto:1": "スペイン王フェリペ2世は、スペイン・ヴェネツィア・ローマ教皇の連合艦隊をレパントへ送った。",
  "lepanto:4": "1571年のレパントの海戦で、連合艦隊はオスマン海軍を破り、その不敗神話を崩した。",
  "lepanto:3": "それでもオスマン帝国はすぐに艦隊を再建し、地中海の制海権を保った。",
  "crisis:0": "コンスタンティノープル攻略では、歩兵イェニチェリに加え、かつてのイクター制に近いティマール制で統制されたトルコ人騎兵シパーヒーを動員した。",
  "crisis:1": "メフメト2世はイェニチェリとシパーヒー、さらに多数の艦船を組み合わせてビザンツ帝国の首都を攻めた。",
  "crisis:2": "その後、長引く戦争でオスマン帝国は財政難となった。",
  "crisis:3": "財政難から徴税請負制を導入すると、軍役を支えてきたティマール制が崩れ始めた。",
  "karlowitz:0": "1683年、オスマン軍は第2次ウィーン包囲を行ったが失敗した。",
  "karlowitz:1": "オーストリアと、援軍に駆けつけたポーランド軍などが反撃し、オスマン帝国は敗れた。",
  "karlowitz:3": "敗戦後、オスマン帝国はオーストリアとの講和へ進んだ。",
  "karlowitz:2": "1699年のカルロヴィッツ条約で、オスマン帝国はハンガリーをオーストリアへ割譲した。",
  "karlowitz:4": "カルロヴィッツ条約は、オスマン帝国が初めて敗戦国として領土を割譲した条約となった。",
  "karlowitz:5": "ただし、このとき失ったハンガリーは広大なオスマン帝国領の一部で、帝国そのものはなお存続した。",
  "tulip:0": "18世紀前半のアフメト3世時代、宮廷に西欧趣味が広がった。トプカプ宮殿でチューリップ栽培が流行し、この文化的な円熟期はチューリップ時代と呼ばれる。一方、政治・軍事面では後退が進んだ。",
  "tulip:3": "その後の18世紀後半、イギリスで産業革命が始まった。西欧の生産力と経済力が伸びるにつれ、イスタンブルを中心とするオスマン帝国との力関係も変化する。軍事・政治の後退と、西欧の成長が重なる時代へ進んでいく。",
};

const additions={
  "kosovo:government":{
    title:"ウラマーを登用し、君主中心の統治へ",year:"14世紀後半・統治の整備",duration:3200,frame:[20,35,42,47],
    text:"領土を広げる一方、ムラト1世はイスラーム法学者（ウラマー）を登用して宰相制度を整え、君主を中心とする支配体制をつくった。",
    ids:["murad","jurists","edirne"],positions:{murad:[26,41],jurists:[28,42]},
    messages:[{path:[[26,41],[28,42]],kind:"trade",label:"登用・統治の整備"}],grow:["jurists"]
  },
  "vienna1:marriage":{
    title:"二つの政略結婚で王家を結ぶ",year:"1515年の婚姻協定から1520年代へ",duration:3200,frame:[9,30,26,61],
    text:"一方、ハプスブルク家は政略結婚によってハンガリー王家と結びついていた。カール5世の弟はラヨシュ2世の姉と、カール5世の妹はラヨシュ2世と結婚した。この二つの婚姻が、後の王位継承をめぐる対立にもつながる。",
    ids:["habsburg","hungarianRoyal","charlesBrother","charlesSister","lajosSister","lajos"],
    labels:{lajos:"ラヨシュ2世",habsburg:"ハプスブルク家"},images:{lajos:false},icons:{lajos:"person"},
    positions:{habsburg:[10,57],hungarianRoyal:[25,57],charlesBrother:[10,46],lajosSister:[25,46],charlesSister:[10,34],lajos:[25,34]},
    messages:[{path:[[10,46],[25,46]],kind:"trade",label:"弟の政略結婚"},{path:[[10,34],[25,34]],kind:"trade",label:"妹の政略結婚"}],
    note:"王家と人物の配置・線は、婚姻関係を示す模式図です。国の領域、婚礼の場所、人の移動経路を示してはいません。"
  },
  "vienna1:succession":{
    title:"婚姻関係が王位の主張につながる",year:"1526年以降",duration:3200,frame:[12,40,31,53],
    text:"ラヨシュ2世が亡くなると、ハプスブルク家は婚姻関係をもとにハンガリーの王位を主張した。スレイマン1世の進出とぶつかり、対立はさらに強まる。",
    ids:["lajos","habsburg","hungary","suleiman"],labels:{lajos:"ラヨシュ2世"},images:{lajos:false},icons:{lajos:"person"},positions:{lajos:[20,47],habsburg:[14,48],suleiman:[27,42]},fades:["lajos"],
    messages:[{path:[[14,48],[19.5,47]],kind:"trade",label:"婚姻を根拠に王位を主張"},{path:[[27,42],[19.5,47]],kind:"campaign",label:"支配をめぐる対立"}]
  }
};

const mapEdits = {
  "crisis:1": {omit:["istanbul"],add:["janissaries","edirne"]},
  "millet:0": {add:["mehmed"]},
  "millet:1": {add:["anatolia"]},
  "cairo:4": {add:["ottoman"]},
  "suleiman:0": {add:["selim"]},
  "vienna1:1": {add:["spain"]},
  "preveza:1": {omit:["westEurope"],add:["charles"]},
  "suleiman:5": {add:["mediterranean","cape"]},
  "capitulation:0": {add:["francis"]},
  "capitulation:2": {add:["officials"]},
  "crisis:3": {omit:["bursa","edirne"],add:["timar"]},
  "tulip:0": {omit:["europe"],add:["westEurope"]},
  "lepanto:1": {add:["holyLeague","charles"]},
  "nicopolis:0": {add:["westEurope"]},
  "preveza:5": {add:["spain"]},
  "lepanto:4": {add:["philip"]},
  "capitulation:1": {add:["europe"]},
  "karlowitz:3": {add:["holyLeague"]},
  "founding:3": {
    "add": [
      "beyliks"
    ]
  },
  "bursa:0": {
    "omit": [
      "northwest",
      "ottoman",
      "beyliks"
    ]
  },
  "nicopolis:2": {
    "omit": [
      "europe"
    ]
  },
  "ankara:0": {
    "omit": [
      "europe"
    ]
  },
  "conquest:2": {
    "omit": [
      "bosphorus"
    ]
  },
  "conquest:3": {
    "omit": [
      "bosphorus"
    ],
    "add": [
      "constantinople"
    ]
  },
  "istanbul:2": {
    "omit": [
      "byzantine",
      "ottoman",
      "europe"
    ]
  },
  "millet:2": {
    "omit": [
      "istanbul"
    ]
  },
  "millet:6": {
    "omit": [
      "istanbul"
    ]
  },
  "millet:4": {
    "add": [
      "blackSea"
    ]
  },
  "chaldiran:4": {
    "omit": [
      "anatolia"
    ]
  },
  "vienna1:3": {
    "omit": [
      "europe",
      "ottoman"
    ]
  },
  "preveza:3": {
    "add": [
      "mediterranean"
    ]
  },
  "karlowitz:1": {
    "omit": [
      "holyLeague"
    ]
  },
  "karlowitz:2": {
    "omit": [
      "europe"
    ]
  },
  "karlowitz:4": {
    "omit": [
      "karlowitz"
    ]
  },
};

function editedAnimation(key){
  const [sourceId,reference]=key.split(":");
  const ref=Number(reference),original=sourceScenes.find(s=>s.id===sourceId);
  const part=structuredClone(additions[key]??storyboards[sourceId][ref]);
  if(key==="kosovo:3")part.note="制度の成立過程を示す模式図です。";
  if(key==="tulip:3")part.note="18世紀後半以降の変化を見通す場面です。";
  if(key==="cairo:3")part.title="ヒジャーズの服属と二大聖都の保護";
  if(key==="preveza:3")part.title="プレヴェザの海戦";
  if(key==="crisis:1"){
    part.messages=[{path:[[26.6,41.7],[29.1,40.2]],kind:"trade",label:"徴税権"},{path:[[29.1,40.2],[26.6,41.7]],kind:"trade",label:"軍役"}];
    part.positions={...part.positions,janissaries:[27.5,42.5]};
    part.year="14〜15世紀・征服を支えた軍制";
  }
  if(key==="suleiman:3")part.year="1520〜1566年・統治と呼び名";
  if(key==="tulip:0")part.messages=[{path:[[4,48],[29,41]],kind:"trade",label:"宮廷で文化を受容"}];
  if(key==="karlowitz:3"||key==="karlowitz:4")part.messages=[];
  const revisedTitles={
    "millet:5":"信仰と自治を認める宗教別共同体",
    "millet:2":"ミッレトという呼び名",
    "millet:6":"宗派ごとの共同体",
    "preveza:5":"カール5世とカルロス1世",
    "karlowitz:3":"オーストリアとの講和へ",
    "karlowitz:4":"敗戦国として初めて領土を割譲"
  };
  if(revisedTitles[key])part.title=revisedTitles[key];
  const edit=mapEdits[key]??{};
  part.ids=[...part.ids.filter(id=>!edit.omit?.includes(id)),...edit.add??[]];
  part.text=part.text??text[key];
  const aliases=Object.entries(entities).flatMap(([id,entity])=>entity.aliases.map(term=>({id,term}))).sort((a,b)=>b.term.length-a.term.length);
  const escaped=value=>value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const aliasPattern=new RegExp(aliases.map(({term})=>escaped(term)).join("|"),"g");
  const aliasId=new Map(aliases.map(({id,term})=>[term,id]));
  const mentionedIds=value=>[...new Set([...value.matchAll(aliasPattern)].map(match=>aliasId.get(match[0])))];
  part.ids=mentionedIds(part.text);
  const namedOutsideText=value=>mentionedIds(value??"").some(id=>!part.ids.includes(id));
  if(namedOutsideText(part.title))part.title="説明に合わせた地図";
  for(const routeName of ["moves","messages"])
    if(part[routeName])part[routeName]=part[routeName].filter(route=>(!route.who||part.ids.includes(route.who))&&!namedOutsideText(route.label));
  for(const name of ["positions","labels","images","icons","afterImages","afterIcons","badges"])
    if(part[name])part[name]=Object.fromEntries(Object.entries(part[name]).filter(([id,value])=>part.ids.includes(id)&&!namedOutsideText(String(value))));
  for(const name of ["grow","fades"])if(part[name])part[name]=part[name].filter(id=>part.ids.includes(id));
  if(part.areas)part.areas=part.areas.filter(a=>part.ids.includes(a.id));
  if(part.capital&&!part.ids.includes(part.capital))delete part.capital;
  delete part.note;
  return {...part,sourceId,sourceRef:reference,sourceKey:key,frame:part.frame??original.frame};
}

export const chapters=["建国と試練","征服と多民族の統治","東方と聖都への拡大","スレイマン1世の全盛期","敗退と制度の変化","文化と近代への展望"];
export const pages=plan.map(([id,chapter,title,keys])=>{
  const animation=keys.map(editedAnimation),sourceId=animation[0].sourceId;
  const original=sourceScenes.find(s=>s.id===sourceId);
  return {id,sourceId,chapter,title,kicker:chapters[chapter],
    locationLabel:[...new Set(animation.flatMap(a=>a.ids))].filter(id=>entities[id].kind==="place").slice(0,3).map(id=>entities[id].name).join("・")||title,
    year:id==="millet-2"?"帝国の宗教共同体":id==="millet-3"?"15世紀末以降・移住と交易":id==="suleiman-1"?"1520年即位 → 1534年東方遠征":id==="preveza-1"?"1522〜1530年代・海軍の強化":id==="tulip-2"?"18世紀後半以降":animation[0].year??original.year,
    frame:animation[0].frame,animation,body:animation.map(a=>a.text),
    notes:[...new Set(animation.map(a=>a.note).filter(Boolean))]};
});
