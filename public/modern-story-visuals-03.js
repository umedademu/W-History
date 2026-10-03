import { modernEdition } from './modern-c01-l03-edition.js?v=0.113';

// 原文の本文と紙面を変えず、本人・一般集団・道具の模式的な説明を重ねる。
// 図の注釈は説明であり、史実上の発言の引用ではない。
const catalog=[];
const assetByKey=new Map();
function asset(key,name,kind,description,options={}) {
  const entry={key,image:`modern-c01-l03/${key}.png`,name,kind,identity:`${kind}:${key}`,description,width:192,height:192,requiresGeneration:true,...options};
  catalog.push(entry);assetByKey.set(key,entry);return entry;
}
function reuse(key,name,kind,description,directory='modern-c01-l01') {
  return asset(key,name,kind,description,{image:`${directory}/${key}.png`,requiresGeneration:false});
}
for(const [key,name,description] of [
  ['madison','マディソン','第4代大統領のジェームズ・マディソン本人。白髪と19世紀初頭の礼服。'],
  ['andrew-jackson','ジャクソン','西部出身大統領アンドルー・ジャクソン本人。広がる白髪と礼服。'],
  ['jefferson','ジェファソン','第3代大統領トーマス・ジェファソン本人。赤褐色寄りの髪と礼服。デヴィスとは別人。'],
  ['lincoln','リンカン','大統領エイブラハム・リンカン本人。顎髭・黒い礼服・高帽子。'],
  ['jefferson-davis','ジェファソン＝デヴィス','南部連合の大統領ジェファソン・デヴィス本人。灰髪・黒い礼服。ジェファソン、リンカンと別の顔。'],
  ['robert-e-lee','リー','南軍将軍ロバート・リー本人。白髭と灰色軍装。'],
  ['ulysses-grant','グラント','北軍将軍ユリシーズ・グラント本人。茶色の髭と青色軍装。'],
  ['perry','ペリー','日本へ派遣されたマシュー・ペリー本人。19世紀の海軍制服。'],
  ['carnegie','カーネギー','鉄鋼事業者アンドルー・カーネギー本人。白髭と年配の背広姿。'],
  ['jp-morgan','モルガン','銀行家J・P・モルガン本人。口髭と背広。'],
  ['rockefeller','ロックフェラー','石油事業者ジョン・ロックフェラー本人。薄い髪と年配の背広姿。'],
  ['harriet-stowe','ストウ夫人','原書61・64ページの参考欄に登場するハリエット・ストウ本人。19世紀の女性作家の服と本。'],
])asset(key,name,'person',description);
for(const [key,name,description] of [
  ['american-settlers','アメリカの開拓者','西部へ移る白人開拓家族の一般集団。日常服と荷物。'],
  ['native-displaced-families','強制移住させられた先住民','先住民家族の一般集団。日常服と荷物。誇張した羽根冠や民族の固定はしない。'],
  ['southern-planters','南部のプランター','南部農場主の一般集団。書類と礼服。'],
  ['enslaved-black-workers','奴隷として働かされた黒人','黒人農業労働者の一般集団。作業着、尊厳ある姿で鎖や暴力を描かない。'],
  ['freed-black-citizens','解放された黒人市民','解放された黒人男女の一般集団。市民権・投票・学校の説明。'],
  ['union-soldiers','北軍','青色の制服を着た北軍の一般兵。特定の連隊・個人の復元ではない。'],
  ['confederate-soldiers','南軍','灰色の制服を着た南軍の一般兵。旗や英雄的な演出を付けない。'],
  ['black-union-volunteers','北軍に加わった黒人','青色の制服で北軍に加わる黒人の一般集団。役割を示し特定個人を同定しない。'],
  ['german-emigrants','ドイツ系移民','渡米するドイツ系の一般家族。日常服と旅行荷物。'],
  ['italian-emigrants','イタリア系移民','南イタリアからの一般移民家族。日常服と旅行荷物。'],
  ['jewish-emigrants','ロシアからのユダヤ人移民','迫害を逃れた一般家族。日常服と荷物。身体的な誇張をしない。'],
  ['chinese-railway-workers','中国系の鉄道労働者','中国系の一般鉄道労働者。19世紀の作業着と道具。誇張した身体表現をしない。'],
  ['japanese-emigrants','日本人移民','明治期の一般家族。日常服と旅行荷物。'],
])asset(key,name,'group',description);
assetByKey.get('enslaved-black-workers').identity='group:black-escapees';
assetByKey.get('black-union-volunteers').identity='group:black-escapees';
assetByKey.get('black-union-volunteers').variantOf='enslaved-black-workers';
for(const [key,name,kind,description] of [
  ['cotton-bales','綿花','prop','原料として輸出する綿花の俵。'],
  ['gold-pan','金鉱開発','prop','砂金採りの皿と金。ゴールドラッシュの説明。'],
  ['steel-beams','鉄鋼','prop','鉄鋼材の束。工業の発展と鉄道の需要を説明。'],
  ['oil-derrick','石油','prop','19世紀の木造油井の模式絵。特定の油田を精密に復元しない。'],
  ['homestead-farm','開墾・定住・耕作','prop','小農家の畑・農具・家の模式絵。個別農園の位置を与えない。'],
  ['fort-sumter','サムター要塞','building','海上の要塞の模式絵。南北戦争の開戦を説明。'],
  ['ford-theatre','フォード劇場','building','劇場の模式絵。リンカン暗殺の場所を説明し、流血は描かない。'],
  ['carnegie-hall','カーネギー・ホール','building','ニューヨークのホールの模式絵。文化事業への出資を説明。'],
])asset(key,name,kind,description);
for(const [key,name] of [['washington','ワシントン'],['james-monroe','モンロー'],['napoleon-i','ナポレオン']])reuse(key,name,'person','第1回の同じ本人。別人の代わりとして顔を流用しない。');
asset('james2-stuart','ジェームズ2世','person','英国のジェームズ2世本人。ホイッグの名称の由来でのみ参照する過去の国王。',{image:'ancient/james2-stuart.png',requiresGeneration:false,width:128,height:192});
reuse('bismarck','ビスマルク','person','第2回の同じ本人。今回は次回案内の参照だけに用いる。','modern-c01-l02');
for(const [key,name] of [['industrialists','産業資本家'],['workers','労働者'],['parliament-delegates','上院の代表']])reuse(key,name,'group','第1回の同じ一般役割。国固有の兵士や固有人物の代用にはしない。');
for(const [key,name,kind] of [['steam-factory','工業','prop'],['railway','鉄道','prop'],['merchant-cargo','工業製品','prop'],['ballot-box','選挙','prop'],['constitution-document','法律・憲法','prop'],['treaty-document','条約','prop'],['calendar','年号','prop']])reuse(key,name,kind,'第1回の同じ一般的な道具の記号。原文の役割は表示名と説明で示す。');
for(const [key,name,kind] of [['cotton-loom','綿製品の生産','prop'],['public-school','公立学校','building'],['irish-emigrants','アイルランド系移民','group'],['blighted-potatoes','ジャガイモの凶作','prop']])reuse(key,name,kind,'第2回の同じ一般役割・道具。固有人物の代替にしない。','modern-c01-l02');
const explanation=text=>text?`説明：${text}`:undefined;
function actor(key,name,at,options={}) {const entry=assetByKey.get(key);if(!entry||!['person','group'].includes(entry.kind))throw new Error(key);const {description,afterKey,...rest}=options;return {name:name||entry.name,image:entry.image,kind:entry.kind,identity:entry.identity,at,bubble:explanation(description),...rest,...(afterKey?{afterImage:assetByKey.get(afterKey).image}:{})};}
function prop(key,name,at,options={}) {const entry=assetByKey.get(key);if(!entry||!['prop','building'].includes(entry.kind))throw new Error(key);const {description,...rest}=options;return {name:name||entry.name,image:entry.image,kind:'prop',assetKind:entry.kind,identity:entry.identity,size:64,at,bubble:explanation(description),...rest};}
function figure(key,name,caption,temporalRole='current',reason) {const entry=assetByKey.get(key);if(!entry)throw new Error(key);return {image:entry.image,name:name||entry.name,caption:explanation(caption),kind:entry.kind,identity:entry.identity,temporalRole,...(reason?{reason}:{})};}
const group=(label,...figures)=>({label,figures});
const illustration=(title,...groups)=>({title,groups});
const ref=(key,name,caption)=>figure(key,name,caption,'reference');
const sourceScenes=Object.values(modernEdition).flat();
const plans={};
function scene(part,number,data) {const id=`modern-c01-l03-p${String(part).padStart(2,'0')}-${String(number).padStart(3,'0')}`;const original=sourceScenes.find(item=>item.id===id);if(!original)throw new Error(id);plans[id]={sceneId:id,title:original.title,mapActors:[],mapProps:[],extraRoutes:[],illustration:null,hiddenPersonNames:original.tags.filter(tag=>tag.kind==='person').map(tag=>tag.text),textOnlyPeople:[],excludedPersonNames:[],personAliases:[],...data};}
const p={britain:[-2,54],france:[2,47],north:[-78,42],south:[-82,33],west:[-110,39],texas:[-99,31],california:[-119.5,37.2],alaska:[-150,64],japan:[138,37],sumter:[-79.874,32.752],gettysburg:[-77.232,39.83],richmond:[-77.437,37.541],ford:[-77.025,38.897],pennsylvania:[-77.5,41],newyork:[-74.006,40.713]};
scene(1,1,{illustration:illustration('東部の独立国から西部開拓・工業発展へ',group('西へ広がる国',figure('american-settlers',null,'西部の開拓が進む')),group('発展の大きな山場',figure('union-soldiers','南北戦争','奴隷問題以外にも発展の方向が争われた'),figure('steam-factory','工業国','19世紀末には世界1位の工業国になる'))),reason:'導入を全文保持し、西部拡大・南北戦争・工業発展を見通す。'});
scene(1,2,{illustration:illustration('両国との関係と中立宣言',group('アメリカの判断',figure('washington',null,'ヨーロッパに干渉せず中立を宣言する')),group('二つの国との関係',figure('treaty-document','イギリス','ミシシッピ川以東のルイジアナを得た'),figure('treaty-document','フランス','独立戦争で助けてもらった'))),reason:'初代大統領本人を模式欄に置き、米国首都の同名の地名とは分ける。'});
scene(1,3,{illustration:illustration('中立でも貿易が妨害される',group('大陸封鎖令',figure('napoleon-i','ナポレオン','イギリスに対する封鎖を命じた')),group('イギリスの逆封鎖',figure('merchant-cargo','アメリカの貿易','ヨーロッパとの貿易が妨害される'))),reason:'封鎖による妨害を静的に示し、実際に成功した輸出とは描かない。'});
scene(1,4,{illustration:illustration('国内が一致しないままの開戦',group('大統領',figure('madison',null,'1812年にイギリスへ宣戦布告する')),group('戦争',figure('constitution-document','米英戦争','アメリカ＝イギリス戦争とも呼ぶ'))),reason:'マディソン本人を用い、首都や戦場への所在は補わない。'});
scene(1,5,{mapProps:[prop('cotton-loom','綿製品の国内生産',p.north)],illustration:illustration('輸入が止まり、自分たちでつくる',group('不足した生活必需品',figure('cotton-loom','綿製品','服を国内でつくる必要が生じた'),figure('steel-beams','鉄','生活必需品が不足した'))),reason:'英国製品の停止から国内生産への因果を示す。占領された都市ワシントンは地理で示す。'});
scene(1,6,{mapProps:[prop('steam-factory','綿工業・鉄鋼業',p.north)],illustration:illustration('政治的独立の後に経済的自立へ',group('国内産業の発達',figure('industrialists',null,'綿工業や鉄鋼業が発達する')),group('国民意識',figure('constitution-document','第2次独立戦争','イギリスから経済的に自立するきっかけ'))),reason:'戦争の呼び名と経済・意識の変化を本人の架空の発言にせず説明する。'});
scene(1,7,{mapProps:[prop('merchant-cargo','イギリスの工業製品',p.north,{route:0,description:'戦争後に対米輸出を再開する'})],illustration:illustration('輸入再開と国内産業の保護',group('戦争が終わる背景',ref('napoleon-i','ナポレオン','ナポレオン戦争の終結で封鎖がなくなる')),group('北部の産業',figure('industrialists',null,'イギリス製品に対抗して保護貿易を主張する'),figure('steam-factory','産業革命','1840年代から北部を中心に始まる'))),reason:'実際の英国製品の輸出再開だけを動かす。ナポレオンは戦争終結の歴史参照。'});
scene(1,8,{illustration:illustration('西への拡大とヨーロッパの排除',group('モンロー宣言',figure('james-monroe','モンロー','北米へのヨーロッパ諸国の介入を排除したい')),group('背景の地域',figure('constitution-document','カナダとの国境問題','イギリス領との関係が背景'),figure('treaty-document','アラスカ','ロシアの進出も背景となった'))),reason:'宣言の国際的な背景と領土拡大を示す。国の代表位置は現在の厳密な境界ではない。'});
scene(1,9,{mapActors:[actor('american-settlers','西部へ移る開拓者',p.west,{route:0,description:'移住と開拓が西へ進む'})],illustration:illustration('小農民の移住とフロンティア',group('新しい生活を目指す人びと',figure('american-settlers',null,'西部に多数の小農民が現れる')),group('開拓地の境界',figure('homestead-farm','西部の農地','開拓地と未開拓地の境界が西へ移る'))),reason:'本文にある移住を一般家族で示す。特定民族の土地が無人だったとする境界の塗分けはしない。'});
scene(1,10,{illustration:illustration('西部を自分たちの利益に結びつけたい',group('北部',figure('industrialists',null,'西部へ工業製品を売りたい')),group('南部',figure('southern-planters',null,'西部にも奴隷を使う農場を広げたい'))),reason:'二つの開発の希望を静的に比較し、まだ起きていない農場の拡大を動かさない。'});
scene(1,11,{illustration:illustration('北部・南部は東部の呼び方',group('東側の建国13州',figure('constitution-document','北部・南部','建国13州を中心とする東部を南北に分ける')),group('西側',figure('homestead-farm','西部','残りが西部で、開拓とともに大きくなる'))),reason:'原書の模式的な地域説明を併用し、現在の全米を南北に二分する誤読を防ぐ。'});
scene(1,12,{illustration:illustration('小農民が多い西部から大統領へ',group('1828年の当選',figure('andrew-jackson','ジャクソン','初の西部出身の大統領となる')),group('支持する人びと',figure('american-settlers','西部の小農民','西部の人口の大多数'))),reason:'本人の当選と西部の支持を示す。所在地や軍事行動は補わない。'});
scene(1,13,{illustration:illustration('白人の民衆へ広がる政治参加',group('政策を進める大統領',figure('andrew-jackson','ジャクソン','北部の資本家を抑えて大統領権限を強化する')),group('政策',figure('ballot-box','白人男性普通選挙','政治参加を広げる'),figure('public-school','公立学校','学校を増やす'),figure('constitution-document','スポイルズ・システム','政権交代時に官僚を交代させる'))),reason:'民主主義の対象が白人に限られる点を表示名で保持し、黒人への平等を獲得した絵にしない。'});
scene(1,14,{mapActors:[actor('native-displaced-families','先住民の強制移住',[-97,35],{route:0,description:'ミシシッピ川以西へ移住を強制される'})],illustration:illustration('民主主義から除外された人びと',group('白人限定の政策',figure('andrew-jackson','ジャクソン','奴隷制を擁護し、先住民強制移住法を制定する')),group('排除と強制移住',figure('enslaved-black-workers','黒人','民主主義から除外された'),figure('native-displaced-families','先住民','食糧不足・病気で多くが命を落とした涙の旅路'))),reason:'強制と犠牲を説明で明記する。移動を自由な移住の喜ばしい姿として扱わず、民族の厳密な行路も作らない。'});
scene(1,15,{illustration:illustration('支持する側と反対する側の政党',group('ジャクソン反対派',figure('industrialists','北部の資本家','専制政治に反対してホイッグ党をつくる')),group('ジャクソン支持派',figure('andrew-jackson','ジャクソン','民主主義を支持する民主党の中心'),figure('southern-planters','南部の農場主','小農民・東部労働者とともに支持する')),group('ホイッグの名称の由来',ref('james2-stuart','ジェームズ2世','過去のイギリスで専制政治に反対した勢力の呼び名'))),reason:'まだ民主党・共和党ではない時期として示す。英国のジェームズ2世は名称の由来として本文で読む。'});
scene(2,1,{illustration:illustration('独立直後に広がった領土',group('1783年のパリ条約',figure('treaty-document','ミシシッピ川以東のルイジアナ','イギリスから獲得し領土が倍になった')),group('その後の西への拡大',figure('american-settlers','西部の開拓者','西への領土拡大が続く'))),reason:'東西のルイジアナを区別し、現在のルイジアナ州の境界で古い広域を代表しない。'});
scene(2,2,{illustration:illustration('購入によって広がる領土',group('1803年の購入',figure('jefferson',null,'第3代大統領の時に西側のルイジアナを買収する'),figure('napoleon-i','ナポレオン','ハイチの独立運動鎮圧の戦費を補おうとして売却する')),group('その後の買収',figure('treaty-document','フロリダ','スペインから買収して東海岸の領土が広がる'))),reason:'両国の本人を別の顔で置き、当時の買収地域は代表位置と原書の表で確認する。'});
scene(2,3,{illustration:illustration('領土拡大を正当化する主張',group('アメリカが唱えた論理',figure('constitution-document','マニフェスト＝デスティニー','自由・民主主義を広げる使命だと主張する')),group('狙われた地域',figure('treaty-document','テキサス','メキシコから奪う領土拡大の口実として説明される'))),reason:'当時の主張を本文の批判とともに説明し、アプリ自身が神の使命や文明の優劣を肯定する図にしない。'});
scene(2,4,{mapActors:[actor('american-settlers','テキサスへの入植者',p.texas,{route:0,description:'移民禁止後もアメリカ系の入植者が増える'})],illustration:illustration('入植・独立・併合の流れ',group('入植者の増加',figure('american-settlers','アメリカ系住民','メキシコ人の4倍になる')),group('独立から併合へ',figure('constitution-document','テキサス共和国','独立運動をアメリカが支援する'),figure('treaty-document','テキサス併合','アメリカ系住民の併合運動を受けて実現する'))),reason:'入植の実際の移動を一般家族で示す。併合の希望と結果を分け、本文にない軍の進行は描かない。'});
scene(2,5,{illustration:illustration('米墨戦争とメキシコの領土喪失',group('戦争',figure('constitution-document','アメリカ＝メキシコ戦争','両国の軍隊の衝突から始まる')),group('結果',figure('treaty-document','カリフォルニアなど','アメリカが奪い、メキシコは領土の半分以上を失う'))),reason:'領土の喪失と太平洋岸への到達を示す。史料にない作戦経路や軍隊の復元は加えない。'});
scene(2,6,{mapProps:[prop('gold-pan','カリフォルニアの金鉱',p.california)],illustration:illustration('金鉱発見と人口の急増',group('1848年の発見',figure('gold-pan','ゴールドラッシュ','世界から一発を狙う人びとが集まる')),group('人口の変化',figure('american-settlers','集まった人びと','カリフォルニアの人口が急増する'))),reason:'金の発見は実際の地域で示す。原書の現在人口の説明を校訂しない。'});
scene(2,7,{mapProps:[prop('treaty-document','日米和親条約',p.japan),prop('treaty-document','アラスカ購入',p.alaska)],sourceFigureReferences:[],illustration:illustration('太平洋岸からアジアへ関心を向ける',group('日本へ派遣された本人',figure('perry',null,'1854年の日米和親条約により日本の開国を実現する')),group('さらに広がる領土',figure('treaty-document','アラスカ','1867年にロシアから購入する')),group('原書60ページの独立コラム',figure('constitution-document','開国から明治維新へ','日本の開国・不平等条約・明治維新の全文を原書60ページで読む'))),reason:'ペリーは本人の模式欄と日本の訪問先を分ける。航路や米国の出発港を補わず、60ページの独立コラムも参照可能にする。'});
scene(3,1,{illustration:illustration('奴隷問題以外にもある対立の原因',group('北部と南部の戦争',figure('union-soldiers','北軍','アメリカ史上最多の犠牲者を出す戦争'),figure('confederate-soldiers','南軍','発展の方向にかかわる対立が背景'))),reason:'南北戦争の前提を読み、最初から奴隷問題だけに圧縮しない。'});
scene(3,2,{illustration:illustration('工業と農業、どちらを重視するか',group('北部の工業',figure('industrialists',null,'工業発展を目指す'),figure('steam-factory','工業','工業優先の発展')),group('南部の農業',figure('southern-planters',null,'農業を重視したい'),figure('cotton-bales','綿花','プランテーションの発展'))),reason:'原書62ページの比較表を併用する。北部・南部の産業の対立を位置と模式欄の両方で示す。'});
scene(3,3,{illustration:illustration('北部が求めた保護貿易と統合',group('産業資本家',figure('industrialists',null,'イギリス製品の流入を阻止して自分たちの商品を売りたい')),group('政治上の要求',figure('constitution-document','連邦主義','内政は州自治、対外政策は合衆国全体で統一する'))),reason:'連邦主義を中央集権と混同しないよう、本文の区別を明記する。'});
scene(3,4,{mapProps:[prop('cotton-bales','イギリスへの綿花輸出',p.britain,{route:0,description:'南部の生産した綿花を輸出する'})],illustration:illustration('南部が求めた自由貿易と州の権限',group('プランテーションの経営',figure('southern-planters',null,'綿花をイギリスへ輸出して利益を得る')),group('政治上の要求',figure('constitution-document','州権主義','貿易政策も各州で決めたい'))),reason:'本文が説明する綿花の輸出だけを動かし、自由貿易と各州の判断を比較する。'});
scene(3,5,{illustration:illustration('政策の主張と選挙の難しさ',group('大統領を出すための選挙',figure('ballot-box','大統領選挙','4年に一度、主張を実現する候補を選ぶ')),group('伝わりにくい政策',figure('constitution-document','複雑な主張','一般の人びとに伝わらなければ選挙に勝てない'))),reason:'一般の選挙の仕組みを道具で示す。候補の実名や所在を原文から補わない。'});
scene(3,6,{illustration:illustration('選挙の争点として前に出た奴隷制',group('北部の主張',figure('constitution-document','奴隷制反対','南部は人道的ではないと主張する')),group('南部の主張',figure('southern-planters','奴隷制維持','北部だけで廃止すればよいと主張する')),group('制度の下に置かれた人びと',figure('enslaved-black-workers','黒人奴隷','対立の争点として扱われた人びと'))),reason:'政治的な争点と奴隷制下の人びとを分け、奴隷制を単なる道具の絵に置き換えない。'});
scene(3,7,{illustration:illustration('13州から州が増えていく',group('独立当初',figure('constitution-document','建国13州','当初の州の数')),group('新しい州',figure('american-settlers','開拓地の住民','領土への移住が進み州が増えていく'))),reason:'州の設置の前提を保持し、次の人口基準の説明へつなぐ。'});
scene(3,8,{illustration:illustration('北西部条例で決めた人口基準',group('成人男性5000人',figure('constitution-document','準州','州になる準備が始まる')),group('人口6万人',figure('constitution-document','州','連邦に加入する'))),reason:'原書の人口基準を数字のまま示し、選挙権の制度や行政区を独自に補わない。'});
scene(3,9,{illustration:illustration('州の数が上院の議員数を変える',group('自由州',figure('parliament-delegates','北部の味方','各州2名ずつの上院代表を送る')),group('奴隷州',figure('parliament-delegates','南部の味方','同じく各州2名ずつの代表を送る')),group('1819年の均衡',figure('constitution-document','11州ずつ','州が増えると議会の均衡が崩れる'))),reason:'原書にない州を追加せず、11対11と各州2名の勢力争いを模式欄で比較する。'});
scene(3,10,{illustration:illustration('ミズーリ協定の取り決め',group('ミズーリ州',figure('constitution-document','奴隷州として加入','ミズーリ州を例外として加入させる')),group('以後の境界',figure('constitution-document','北緯36度30分','これより北には奴隷制を認めない'))),reason:'原書の取り決めを比較図で示す。本文にないメイン州や正確な州境を補わない。'});
scene(3,11,{mapProps:[prop('gold-pan','ゴールドラッシュ',p.california)],illustration:illustration('人口急増と自由州への加入',group('カリフォルニア',figure('gold-pan','金鉱の発見','人口が10万人を超え、州になる条件を満たす')),group('住民投票',figure('ballot-box','自由州','住民投票で自由州となり、南部が反発する'))),reason:'領域が境界をまたぐことと議会の均衡の問題を読む。原書の住民投票の記述もそのまま保持する。'});
scene(3,12,{sourceFigureReferences:[{name:'ストウ夫人',page:64,lines:[273],reason:'通常本文のすぐ後の小説を扱う独立コラムに登場する本人を参考として示す。'}],illustration:illustration('住民投票と北部の反発',group('カンザス・ネブラスカ法',figure('ballot-box','自由州・奴隷州の決定','住民投票に任せ、ミズーリ協定を否定する')),group('北部の反応',figure('constitution-document','共和党','奴隷制反対派が結成する')),group('原書64ページの独立コラム',ref('harriet-stowe','ストウ夫人','小説アンクル＝トムの小屋の説明を原書全文で読む'))),reason:'カンザスでの武力衝突と法の変更を示す。ストウ夫人は原書のコラムの参照であり新しい通常本文を加えない。'});
scene(3,13,{illustration:illustration('リンカンの主張は奴隷制の拡大反対',group('1860年の当選',figure('lincoln',null,'共和党の候補として当選する')),group('主張の範囲',figure('constitution-document','新しい州では奴隷制を認めない','合衆国の統合を最優先し、南部での即時廃止とは言わない'))),reason:'当選時の拡大反対と後の解放宣言を混同しない。'});
scene(3,14,{illustration:illustration('南部11州が合衆国から離脱',group('南部連合',figure('jefferson-davis','ジェファソン＝デヴィス','大統領となり、首都はリッチモンド')),group('憲法の主張',figure('constitution-document','奴隷制擁護と州権主義','開戦前7州・開戦後4州の合計11州が離脱する'))),reason:'第3代大統領ジェファソンとは別の本人を用い、南部連合の首都と本人の固定所在地を分ける。'});
scene(3,15,{mapProps:[prop('fort-sumter','サムター要塞',p.sumter)],illustration:illustration('独立を認めないリンカンと要塞攻撃',group('合衆国の維持',figure('lincoln',null,'南部の独立を認めない')),group('1861年の開戦',figure('fort-sumter','サムター要塞','南部にある合衆国基地への攻撃で戦争が始まる'))),reason:'本文が明記する施設を地理図に置く。リンカン本人を要塞に配置しない。'});
scene(3,16,{mapProps:[prop('cotton-bales','イギリスへの綿花',p.britain,{route:0,offset:[-12,0],description:'本文にある実際の綿花輸出'}),prop('cotton-bales','フランスへの綿花',p.france,{route:1,offset:[12,0],description:'本文にある実際の綿花輸出'})],illustration:illustration('南軍の優勢と期待していた支援',group('開戦初期の南軍',figure('robert-e-lee','リー','南軍を率いて優勢だった'),figure('confederate-soldiers','南軍','領土を守る戦争として戦う')),group('英仏に対する期待',figure('treaty-document','イギリス・フランスの支援への期待','援軍が来れば有利になるという期待であり、実際の派兵を示さない'))),reason:'実際の経済関係である綿花輸出のみ動かす。南北からの英仏援軍は期待・仮定の説明として静的に分ける。'});
scene(3,17,{illustration:illustration('軍事だけでなく世論を味方にする',group('リンカンの判断',figure('lincoln',null,'国内外の世論を味方にし、政治で勝つことを目指す')),group('避けたい事態',figure('constitution-document','英仏や西部の支援','南部に加わると北部が不利になるという懸念'))),reason:'まだ起きていない英仏参戦や西部の南部支持の線を動かさない。'});
scene(3,18,{mapProps:[prop('homestead-farm','西部の自営農地',p.west)],illustration:illustration('三つの条件で160エーカーの土地',group('ホームステッド法',figure('homestead-farm','開墾・定住・耕作','5年間の定住など3条件を満たせば無償で土地を得る')),group('西部の反応',figure('american-settlers','西部の農民','合衆国に残れば土地が得られ、北軍を支持する'))),reason:'農地の制度と支持を示す。本文にない土地の境界線や人物の訪問を地理へ加えない。'});
scene(3,19,{illustration:illustration('英仏を参戦させないための宣言',group('南部との貿易関係',figure('cotton-bales','安い綿花','英仏は南部から安い綿花を輸入する')),group('リンカンの策',figure('lincoln',null,'英仏の援軍を阻止するため奴隷解放宣言を出す'))),reason:'英仏が利益から南部を支持しうるという予測とリンカンの政策を分ける。援軍が実際に来たという動きは付けない。'});
scene(3,20,{mapActors:[actor('enslaved-black-workers','北部へ逃れて北軍に加わる黒人',p.north,{route:0,afterKey:'black-union-volunteers',description:'南部から北部へ逃れ、北軍に加わる一般集団の役割の変化'})],illustration:illustration('宣言の国内的な影響',group('北部へ向かう人びと',figure('enslaved-black-workers','南部の奴隷','自由を求めて北部へ逃れる','before')),group('北軍への参加',figure('black-union-volunteers','北軍に加わる黒人','北軍に加わって北部が優勢になっていく','after','一般集団の役割の前後を示す。特定個人の顔の同一性を断定しない'))),reason:'本文の逃亡と北軍参加の実際の移動を動かす。集団の状態を制服へ切り替え、同じ特定個人の肖像とは扱わない。'});
scene(3,21,{illustration:illustration('独立戦争から奴隷解放のための内戦へ',group('戦争の位置づけを変える',figure('lincoln',null,'奴隷解放宣言で国内外の世論を動かす')),group('英仏の判断',figure('treaty-document','内戦なので介入しない','自国で奴隷制を廃止した英仏は支援できなくなる'))),reason:'原書67ページの二つの視点の比較図を併用する。宣言と不介入は静的な政治上の関係。'});
scene(3,22,{mapActors:[actor('union-soldiers','ゲティスバーグの北軍',p.gettysburg,{description:'南北戦争最大の激戦で決定的な勝利を収める'})],illustration:illustration('勝利と人民のための政治',group('ゲティスバーグの戦い',figure('union-soldiers','北軍','決定的な勝利を収める')),group('演説',figure('lincoln',null,'人民の人民による人民のための政治という演説の一節'))),reason:'戦場は原文の場所、本人は模式欄に置く。演説の正式な引用は原書の独立コラムで全文参照する。'});
scene(3,23,{mapActors:[actor('union-soldiers','北軍の勝利',p.richmond,{description:'リッチモンドが陥落し、南北戦争が終わる'})],illustration:illustration('リッチモンド陥落と戦争の終結',group('将軍の活躍',figure('ulysses-grant','グラント','活躍によって北軍が勝利する')),group('結果',figure('constitution-document','南北戦争終結','リッチモンドが陥落した'))),reason:'明記された陥落の都市と将軍本人を分ける。グラント本人の正確な当日の位置を補わない。'});
scene(3,24,{mapProps:[prop('ford-theatre','フォード劇場',p.ford)],illustration:illustration('戦争直後に暗殺された大統領',group('1865年4月の事件',figure('lincoln',null,'2期目の就任後、フォード劇場で暗殺される')),group('その後の国',figure('constitution-document','統合の維持','アメリカ合衆国は一つの国として維持された'))),reason:'劇場は原書が述べた現地で表示する。流血・襲撃の再現や新しい犯人の実名は付けない。'});
scene(4,1,{illustration:illustration('法で認められた権利',group('憲法修正',figure('constitution-document','第13条・第14条・第15条','奴隷制廃止、市民権、投票権を認める')),group('黒人市民',figure('freed-black-citizens',null,'白人と同じ市民のはずだが差別は残った'))),reason:'憲法上の権利と社会の差別が残る実態を分ける。'});
scene(4,2,{illustration:illustration('分益小作と残った貧困',group('地主から借りる',figure('southern-planters','プランター','土地と農具を貸す')),group('解放された黒人',figure('freed-black-citizens','シェアクロッパー','収穫物の半分以上を現物で納め、貧困に置かれる')),group('得られた自由',figure('constitution-document','やめられる自由','奴隷と違い小作人をやめる自由は得た'))),reason:'奴隷から小作人への変化を社会の比較で示し、経済的な制約も保持する。'});
scene(4,3,{illustration:illustration('政治・学校への参加と反黒人の暴力',group('解放後の参加',figure('freed-black-citizens','黒人市民','学校へ通い、投票に参加する'),figure('public-school','学校','日常の場に参加が広がる')),group('暴力と排除',figure('constitution-document','KKK','反黒人組織がつくられ、リンチや家への襲撃が起きた'))),reason:'被害を受けた人びとの尊厳を保ち、暴力集団の英雄的な画像や襲撃の場面は作らない。'});
scene(4,4,{illustration:illustration('州法で制限された権利と人種隔離',group('法による制限',figure('constitution-document','黒人取締法','市民権・投票権を制限し、選挙権を剥奪する')),group('ジム＝クロウ制度',figure('freed-black-citizens','黒人市民','学校・交通など社会の場で白人と分離される'))),reason:'差別の内容を示し、憲法修正で全差別が消えたという印象にしない。南アフリカは本文の比較だけである。'});
scene(4,5,{mapProps:[prop('steam-factory','北部の工業発展',p.north)],illustration:illustration('工業優先の政策で発展する産業',group('共和党政権の政策',figure('constitution-document','工業優先','北部の勝利後、工業を優先する政策が続く')),group('発展を促す産業',figure('steel-beams','鉄鋼','鉄道建設で需要が増える'),figure('oil-derrick','石油','石油産業が勃興する'))),reason:'工業優先の政策と鉄道・鉄鋼・石油の関係を説明する。'});
scene(4,6,{mapProps:[prop('railway','東西を往来する鉄道',[-119,38],{route:0,description:'人・物・情報が大陸を行き来する'})],illustration:illustration('1869年の鉄道開通と西部開拓',group('大陸横断鉄道',figure('railway',null,'15年の間に5本の鉄道が完成する')),group('東西の往来',figure('american-settlers','移動する人びと','人・物・情報が行き来し、西部開拓が進む'))),reason:'米国内の東西往来だけを概略で動かす。原書図内のシカゴとサンフランシスコを1869年線の正確な終点とは断定しない。'});
scene(4,7,{mapProps:[prop('carnegie-hall','カーネギー・ホール',[-73.98,40.765])],illustration:illustration('鉄鋼事業と文化・慈善事業',group('鉄鋼王',figure('carnegie',null,'糸巻き工から大企業をつくり、売却後に文化・慈善へ寄付する')),group('銀行家',figure('jp-morgan','モルガン','鉄道投資で富を得てUSスティール社を設立する'))),reason:'カーネギー・モルガン本人とホールの現地を分ける。本文の同じ本人の役割を別人の画像で代用しない。'});
scene(4,8,{mapProps:[prop('oil-derrick','ペンシルヴェニアの油田',p.pennsylvania)],illustration:illustration('石油王の事業と鉄道との連携',group('ロックフェラー',figure('rockefeller',null,'油田に目をつけ、鉄道会社と組んで競争相手を圧倒する')),group('スタンダード石油トラスト',figure('oil-derrick','石油精製','全米の精製の9割を支配する'))),reason:'原文の油田の地域と事業者本人を別々に示し、特定の油井に本人がいたとは描かない。'});
scene(4,9,{illustration:illustration('工業生産世界1位と拝金主義',group('保護貿易に支えられた大企業',figure('industrialists',null,'政府の保護貿易政策で発展する')),group('1890年ごろ',figure('steam-factory','世界一の工業国','工業生産でイギリスを抜く'),figure('gold-pan','金ぴか時代','儲かればよいという拝金主義の風潮'))),reason:'ゴールドラッシュと金ぴか時代を同じ出来事とはしない。金の道具は富を求める風潮の一般的な象徴と明記する。'});
scene(4,10,{illustration:illustration('工場だけでなく働く人が必要',group('工業化',figure('steam-factory','工場','1840年代には産業革命が始まる')),group('労働需要',figure('workers','移民の労働者','工場を支える働く人が必要になった'))),reason:'労働需要という本文の説明を一般の労働者の役割で示し、出身地をこの段階で固定しない。'});
scene(4,11,{mapActors:[actor('irish-emigrants','アイルランド系移民',p.north,{route:0,description:'渡米し、工場や東からの鉄道建設で働く'})],illustration:illustration('飢饉を背景とするアイルランドからの移民',group('移民の背景',ref('blighted-potatoes','ジャガイモ飢饉','100万人以上の移民の背景となった')),group('アメリカでの労働',figure('irish-emigrants','アイルランド系移民','北部工場や東からの鉄道建設に従事する'))),reason:'第2回と同じ一般移民の役割を再利用する。個人・家族の固定した同一性は断定しない。'});
scene(4,12,{mapActors:[actor('german-emigrants','ドイツ系移民',[-95,42],{route:0,description:'渡米し、中西部の農業地帯へ移る人も多い'})],illustration:illustration('政治的亡命と貧しい農民の移住',group('ドイツ系移民',figure('german-emigrants',null,'三月革命後の亡命者や南ドイツの貧しい農民')),group('金鉱発見による加速',figure('gold-pan','ゴールドラッシュ','移民流入の第1波を加速させる'))),reason:'本文のドイツから中西部への移民を動かす。金鉱に来た全員をドイツ人とする描き方はしない。'});
scene(4,13,{mapActors:[actor('italian-emigrants','イタリア系移民',p.north,{route:0,offset:[-15,0],description:'南イタリアからアメリカへ移民する'}),actor('jewish-emigrants','ロシアからのユダヤ人移民',p.north,{route:1,offset:[15,0],description:'ポグロムを逃れて渡米する'})],illustration:illustration('1880年代以降に増えた南欧・東欧からの移民',group('イタリア系移民',figure('italian-emigrants',null,'統一後の保護貿易で農産物輸出が減り、貧しくなった農民')),group('ロシアからの人びと',figure('jewish-emigrants','ユダヤ人移民','迫害であるポグロムを逃れた人びと'))),reason:'二つの一般集団と背景を区別し、実際の渡米を別の概略経路で示す。'});
scene(4,14,{illustration:illustration('アメリカン・ドリームの裏にある差別',group('カトリック教徒として差別された人びと',figure('irish-emigrants','アイルランド系移民','カトリックの多い人びと'),figure('italian-emigrants','イタリア系移民','同じくカトリックとして差別を受ける')),group('夢と現実',figure('constitution-document','プロテスタント中心の社会','夢破れるだけでなく差別に苦しむ場合もあった'))),reason:'移民全員が富を得たという成功の絵にせず、宗教上の差別を説明で明記する。'});
scene(4,15,{mapActors:[actor('chinese-railway-workers','西部の中国系移民',p.california,{description:'鉱山や西からの鉄道建設の労働を担う'})],illustration:illustration('アジアからの移民が担った労働',group('中国系移民',figure('chinese-railway-workers',null,'アヘン戦争後の貧困のなか契約移民となる')),group('西部の労働需要',figure('railway','西からの鉄道建設','低賃金の労働に多くの中国系移民が従事した'))),reason:'本文の受入先の西部を示す。世界図の端を跨ぐ架空のユーラシア横断航路は付けない。歴史的な呼び名は原文で保持する。'});
scene(4,16,{illustration:illustration('移民排斥運動と最初の移民制限',group('労働者への反感',figure('chinese-railway-workers','中国系移民','増加が白人下層労働者に脅威と受け取られた')),group('1882年の制限',figure('constitution-document','中国人労働者移民排斥法','アメリカ史上初の移民制限として制定される'))),reason:'排斥をアプリの肯定的な評価にせず、本文の差別と制度の説明として示す。'});
scene(4,17,{illustration:illustration('明治期の日本から海外へ',group('中国系移民の禁止後',figure('japanese-emigrants','日本人移民','貧しくなった農民が海外にも移住する')),group('移民の背景',figure('steam-factory','日本の工業化','国内都市への流出と海外への移住が起きる'))),reason:'日本人移民の受入地域・出発港・正確な航路を補わず、本文の背景を模式欄で示す。'});
scene(4,18,{illustration:illustration('今回の年号と次回の案内',group('原書71ページの年号欄',figure('calendar','年号のツボ','米英戦争・強制移住法・金鉱・南北戦争・解放宣言・鉄道を確認する')),group('次回の人物',figure('bismarck','ビスマルク','ドイツ・イタリア統一の次回に登場する','preview'))),reason:'次回案内も通常本文として保持し、ビスマルクをアメリカの同時代の現場に同席させない。'});
function freezeDeep(value) {if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freezeDeep);Object.freeze(value);}return value;}
export const modernVisualAssetCatalog=freezeDeep(catalog);
export const modernVisualScenePlans=freezeDeep(plans);
export function withModernVisuals(original) {const plan=modernVisualScenePlans[original.id];if(!plan)return original;const hidden=new Set(plan.hiddenPersonNames);return {...original,actors:plan.mapActors.map(item=>({...item})),props:plan.mapProps.map(item=>({...item})),routes:[...original.routes,...plan.extraRoutes].map(item=>({...item,points:item.points.map(at=>[...at])})),tags:original.tags.filter(tag=>!(tag.kind==='person'&&hidden.has(tag.text))).map(tag=>({...tag})),namesOutsideMap:[...new Set((plan.illustration?.groups??[]).flatMap(item=>item.figures).filter(item=>item.kind==='person').map(item=>item.name))],textOnlyPeople:plan.textOnlyPeople.map(item=>({...item})),excludedPersonNames:plan.excludedPersonNames.map(item=>({...item})),personAliases:plan.personAliases.map(item=>({...item})),duration:original.duration||2600};}
export function modernIllustrationFor(sceneOrId) {return modernVisualScenePlans[typeof sceneOrId==='string'?sceneOrId:sceneOrId?.id]?.illustration||null;}
export const modernVisualEdition=Object.fromEntries(Object.entries(modernEdition).map(([lesson,scenes])=>[lesson,scenes.map(withModernVisuals)]));
