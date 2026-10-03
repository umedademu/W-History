import { modernEdition } from './modern-c01-l02-edition.js?v=0.112';

// 本文・装飾・順序・原書の紙面を保持し、本人・一般集団・道具の説明だけを重ねる。
// 吹き出しは引用ではない。説明図は本文の後に、地理図とは分けて表示する。
const catalog = [];
const assetByKey = new Map();
function asset(key,name,kind,description,options={}) {
  const entry={key,image:`modern-c01-l02/${key}.png`,name,kind,identity:`${kind}:${key}`,
    description,width:192,height:192,requiresGeneration:true,...options};
  catalog.push(entry);assetByKey.set(key,entry);return entry;
}
function reuse(key,name,kind,description,options={}) {
  return asset(key,name,kind,description,{image:`modern-c01-l01/${key}.png`,requiresGeneration:false,...options});
}
for (const [key,name,description] of [
  ['grey','グレイ','1832年のホイッグ党の政治家本人。年配の英国政治家の礼服。'],
  ['shaftesbury','シャフツベリー卿','工場法のために尽力した英国政治家本人。礼服と法の書類。'],
  ['cobden','コブデン','反穀物法同盟の指導者本人。英国事業者・政治家の礼服。'],
  ['bright','ブライト','反穀物法同盟の指導者本人。コブデンと区別する英国政治家の礼服。'],
  ['peel','ピール','穀物法廃止を実現した英国政治家本人。保守党の政治家の礼服。'],
  ['derby','ダービー','第2回選挙法改正の英国政治家本人。英国政治家の礼服。'],
  ['victoria','ヴィクトリア女王','19世紀の英国女王本人。女王のドレスと控えめな冠。'],
  ['thomas-cook','クック','万博の割引旅行を企画した旅行業者本人。旅行の手帳を持つ19世紀の服。'],
  ['disraeli','ディズレーリ','保守党の英国政治家本人。特徴のある髪と政治家の礼服。'],
  ['gladstone','グラッドストン','自由党の英国政治家本人。ディズレーリと区別する年配の礼服姿。'],
  ['cromwell','クロムウェル','過去の征服の参照に用いる本人。17世紀の服。19世紀の当事者にしない。'],
  ['charles-ii','チャールズ2世','1673年の審査法の背景で参照する本人。17世紀の英国国王の服。'],
  ['mary-i','メアリ1世','原書48ページの吹き出しの歴史参照。16世紀の英国女王本人。'],
  ['oconnell','オコンネル','アイルランドのカトリックの政治家本人。19世紀の礼服。'],
  ['wellington','ウェリントン','宗教法の改革時の英国首相本人。19世紀の英国政治家・軍人の礼服。'],
  ['obrien','オブライエン','青年アイルランド党の指導者本人。19世紀の活動家の服。'],
  ['asquith','アスキス','1914年の自治法の英国首相本人。20世紀初頭の政治家の背広。'],
  ['de-valera','デ＝ヴァレラ','独立宣言で説明するアイルランドの政治家本人。眼鏡と20世紀初頭の背広。'],
  ['haussmann','オスマン','セーヌ県知事でパリの改造を担った本人。オスマン帝国の君主ではない。'],
  ['maximilian','マクシミリアン','メキシコ皇帝にされた本人。19世紀の皇帝の軍装。'],
  ['bismarck','ビスマルク','プロイセンの政治家本人。19世紀の軍装または政治家の礼服。'],
  ['thiers','ティエール','フランスの臨時政府首班・大統領となった本人。眼鏡と年配の政治家の礼服。'],
  ['elizabeth-i','エリザベス1世','東インド会社設立の時代の参照に用いる本人。16世紀末の英国女王のドレス。'],
]) asset(key,name,'person',description);

reuse('napoleon-i','ナポレオン','person','第1回のナポレオン1世本人。第二帝政では回想・歴史参照に限る。');
reuse('louis-napoleon','ルイ＝ナポレオン','person','第1回の大統領時代の同じ本人。皇帝になる前の振り返り。');
reuse('napoleon-iii','ナポレオン3世','person','第1回の即位後の同じ本人。叔父とは別人。',{identity:'person:louis-napoleon',variantOf:'louis-napoleon'});
asset('napoleon-iii-captive','ナポレオン3世','person','同じ顔の本人。スダンで捕虜になり、落胆した姿。',{identity:'person:louis-napoleon',variantOf:'napoleon-iii'});
for(const [key,name,description] of [
  ['landowners','地主','19世紀の英国地主の一般集団。特定人物の顔は付けず、土地の書類を持つ。'],
  ['irish-tenants','アイルランドの小作人','19世紀のアイルランドの小作農家の一般集団。農作業着と作物。'],
  ['irish-emigrants','アイルランドの移民','19世紀のアイルランドの移民の一般家族。荷物を持つ。'],
  ['british-police','イギリスの警察','19世紀の英国の一般警官。ケニントン広場の弾圧の説明用。'],
  ['british-soldiers','イギリス軍','19世紀の英国の一般兵。特定の連隊や個人の復元ではない。'],
]) asset(key,name,'group',description);
for(const [key,name,kind,description] of [
  ['cotton-loom','綿製品の機械生産','prop','産業革命の機械式織機と綿製品。個別の工場名を付けない。'],
  ['grain-cargo','小麦・穀物','prop','小麦の袋と穂。本文にある輸出・輸入の関係を説明する。'],
  ['healthy-potatoes','ジャガイモ','prop','主食として栽培したジャガイモ。病気の前の作物。'],
  ['blighted-potatoes','凶作のジャガイモ','prop','同じ作物が病気で凶作となった状態。病原体の形状を断定しない。'],
  ['crystal-palace','クリスタル＝パレス（水晶宮）','building','1851年にハイド・パークで開かれた博覧会のガラス張りの建物。'],
  ['public-school','公立学校','building','教育法の説明に用いる一般的な学校。個別の学校の復元ではない。'],
  ['suez-canal','スエズ運河','prop','運河と交易船の模式的な風景。政治家本人の訪問を示さない。'],
  ['paris-boulevard','パリの道路網','prop','直線の道路・街灯・高さを揃えた街区の模式図。'],
  ['paris-sewers','パリの下水道','prop','集中排水する地下の管と通路の模式図。正確な工法の復元ではない。'],
  ['paris-opera','オペラ座','building','原書53ページのパリ改造のコラムで説明する建物。'],
  ['arc-de-triomphe','凱旋門','building','放射状道路網の説明に用いるパリの建物。'],
]) asset(key,name,kind,description);
assetByKey.get('blighted-potatoes').identity='prop:healthy-potatoes';
assetByKey.get('blighted-potatoes').variantOf='healthy-potatoes';
for(const [key,name] of [
  ['industrialists','産業資本家'],['workers','労働者'],['farmers','農民'],['bankers','銀行家'],
  ['revolutionary-citizens','市民'],['french-soldiers','フランス軍'],['prussian-soldiers','プロイセン軍'],['parliament-delegates','議会の代表'],
]) reuse(key,name,'group','第1回の同じ一般役割の集団。固有名の人物の代用にはしない。');
for(const [key,name,kind] of [
  ['steam-factory','産業革命','prop'],['railway','鉄道','prop'],['merchant-cargo','貿易','prop'],
  ['ballot-box','選挙','prop'],['constitution-document','法律・憲法','prop'],['treaty-document','条約','prop'],
  ['parliament-building','議会','building'],['tax-ledger','税・年金','prop'],['crown','帝位・王位','prop'],
  ['calendar','年号','prop'],['barricade','バリケード','prop'],['royal-palace','宮殿','building'],
]) reuse(key,name,kind,'第1回の同じ一般的な道具・施設の記号。本文の役割を名称と説明で示す。');

const point={britain:[-2,54],france:[2,47],ireland:[-8,53.5],ulster:[-6.5,54.8],
  london:[-.13,51.51],manchester:[-2.24,53.48],kennington:[-.11,51.49],hyde:[-.165,51.507],
  paris:[2.35,48.86],dublin:[-6.26,53.35],suez:[32.3,30],india:[78,22],russia:[37,57],
  america:[-96,39],mexico:[-102,23],crimea:[34,45],cochinchina:[106.7,10.8],
  sedan:[4.94,49.7],versailles:[2.12,48.8],bordeaux:[-.58,44.84]};
const explanation=text=>text?`説明：${text}`:undefined;
function actor(key,name,at,options={}) {
  const entry=assetByKey.get(key);if(!entry||!['person','group'].includes(entry.kind))throw new Error(key);
  const {description,afterKey,...rest}=options;
  return {name:name||entry.name,image:entry.image,kind:entry.kind,identity:entry.identity,
    at:typeof at==='string'?point[at]:at,bubble:explanation(description),...rest,
    ...(afterKey?{afterImage:assetByKey.get(afterKey).image}:{})};
}
function prop(key,name,at,options={}) {
  const entry=assetByKey.get(key);if(!entry||!['prop','building'].includes(entry.kind))throw new Error(key);
  const {description,afterKey,...rest}=options;
  return {name:name||entry.name,image:entry.image,kind:'prop',assetKind:entry.kind,identity:entry.identity,size:64,
    at:typeof at==='string'?point[at]:at,bubble:explanation(description),...rest,
    ...(afterKey?{afterImage:assetByKey.get(afterKey).image}:{})};
}
function figure(key,name,caption,temporalRole='current',reason) {
  const entry=assetByKey.get(key);if(!entry)throw new Error(key);
  return {image:entry.image,name:name||entry.name,caption:explanation(caption),kind:entry.kind,
    identity:entry.identity,temporalRole,...(reason?{reason}:{})};
}
const group=(label,...figures)=>({label,figures});
const illustration=(title,...groups)=>({title,groups});
const ref=(key,name,caption)=>figure(key,name,caption,'reference');
const sourceScenes=Object.values(modernEdition).flat();
const plans={};
function scene(part,number,data) {
  const id=`modern-c01-l02-p${String(part).padStart(2,'0')}-${String(number).padStart(3,'0')}`;
  const original=sourceScenes.find(item=>item.id===id);if(!original)throw new Error(id);
  plans[id]={sceneId:id,title:original.title,mapActors:[],mapProps:[],extraRoutes:[],illustration:null,
    hiddenPersonNames:original.tags.filter(tag=>tag.kind==='person').map(tag=>tag.text),
    textOnlyPeople:[],excludedPersonNames:[],personAliases:[],...data};
}

scene(1,1,{
  mapProps:[prop('steam-factory','産業革命','britain')],
  illustration:illustration('今回の二つの国の見通し',
    group('イギリスの改革',figure('industrialists',null,'成長した産業資本家'),figure('workers',null,'人数を増やした労働者')),
    group('フランスの体制',figure('napoleon-iii',null,'第二帝政の皇帝'))),
  reason:'回の導入を省略せず、二国の体制の違いを示す。皇帝の所在地を固定しない。'
});
scene(1,2,{
  mapProps:[prop('steam-factory','産業革命','britain')],
  illustration:illustration('農業社会から工業社会への変化',
    group('従来の中心',figure('landowners',null,'農業社会では土地を持つ地主が中心')),
    group('工業の発展',figure('industrialists',null,'工場を持つ人が成長'),figure('workers',null,'工場とともに労働者階級が増加'))),
  reason:'社会階級を模式欄で比較し、地主や資本家に固有の人物名を付けない。'
});
scene(1,3,{
  mapProps:[prop('parliament-building','下院・庶民院','britain')],
  illustration:illustration('政治に参加できる側とできない側',
    group('参政権を持つ地主',figure('landowners',null,'議会は地主ばかりで、地主を保護する法律をつくる')),
    group('産業資本家の要求',figure('industrialists',null,'自分たちの意見も聞いてほしい'))),
  reason:'議会は国の制度の記号。原文にない都市や議員個人を加えない。'
});
scene(1,4,{
  mapActors:[actor('workers','都市労働者','britain',{description:'ひどい労働環境が改革の問題となる'})],
  mapProps:[prop('steam-factory','工場','britain',{offset:[42,0]})],
  illustration:illustration('労働環境と改革の必要',group('工場を増やす側',figure('industrialists',null,'給料と設備の費用を抑えたい')),
    group('働く側',figure('workers',null,'生活と労働の環境が悪化する'))),
  reason:'一般の労働者と事業者を区別する。特定の工場や事件は追加しない。'
});
scene(1,5,{
  mapProps:[prop('cotton-loom','綿製品の機械生産','britain'),prop('merchant-cargo','対インド貿易','india')],
  illustration:illustration('貿易独占と輸出の要求',
    group('独占に対する不満',figure('industrialists',null,'機械で大量につくった綿製品を輸出したい'),figure('merchant-cargo','東インド会社','貿易独占のため、他社は自由に貿易できない')),
    group('設立時代の参照',ref('elizabeth-i',null,'東インド会社はこの女王の時代に設立された'))),
  reason:'女王は過去の参照。商品の輸出先や会社の本部を本文以上に固定しない。'
});
scene(1,6,{
  mapProps:[prop('grain-cargo','東欧からの穀物','britain',{route:0,description:'大陸封鎖令がなくなった後の輸入'})],
  illustration:illustration('穀物法ができるまで',
    group('大陸封鎖令の背景',ref('napoleon-i','ナポレオン','大陸封鎖令で穀物を輸入できなくなった')),
    group('地主の利益を守る法律',figure('landowners',null,'囲い込みで増産した地主が安い輸入穀物に反発'),figure('constitution-document','穀物法','輸入禁止から高関税へ。典型的な地主保護法'))),
  reason:'穀物の流れは封鎖令の終了後・穀物法制定前。ナポレオンや地主本人を貿易経路へ動かさない。'
});
scene(1,7,{
  mapProps:[prop('grain-cargo','穀物','britain'),prop('cotton-loom','綿製品','britain',{offset:[46,0]})],
  illustration:illustration('地主と産業資本家の対立',group('農業',figure('landowners',null,'保護貿易を主張する')),
    group('工業',figure('industrialists',null,'自由貿易にして輸出を拡大したい'))),
  reason:'原文43ページの対比。二つの階層を別の役割の画像で示す。'
});
scene(1,8,{
  mapProps:[prop('cotton-loom','マンチェスター','manchester')],
  mapActors:[actor('revolutionary-citizens','選挙法改正運動','britain',{offset:[42,0],description:'七月革命の影響で市民の暴動も発生'})],
  illustration:illustration('人口と議席の不均衡',group('農村の腐敗選挙区',figure('landowners',null,'人口が減っても議席がある')),
    group('工業都市',figure('industrialists','マンチェスターの産業資本家','人口20万人を超えても選挙区がなく議席ゼロ'))),
  reason:'人口流出は制度比較で示し、原文にない村からマンチェスターへの実経路を作らない。'
});
scene(1,9,{
  sourceFigureReferences:[{name:'シャフツベリー卿',page:44,lines:[84],reason:'通常本文直後の1833年改革表に載る人物として参照する。'}],
  mapProps:[prop('ballot-box','第1回選挙法改正','britain')],
  illustration:illustration('1832年の改正と1833年の改革',
    group('改正の実現',figure('grey',null,'ホイッグ党の内閣の下で第1回選挙法改正'),figure('industrialists','中産階級','産業資本家などに選挙権')),
    group('原書44ページの改革表',figure('shaftesbury',null,'工場法のために尽力'),figure('constitution-document','工場法・奴隷制廃止','表の各改革は原書全文と説明図で読める'))),
  reason:'政治家は模式欄で本人を示す。原書44ページの表だけの内容は表の説明であると明記する。'
});
scene(1,10,{
  mapProps:[prop('cotton-loom','マンチェスターの木綿工業','manchester'),prop('grain-cargo','穀物法廃止','britain',{offset:[42,0]})],
  illustration:illustration('穀物法廃止に動く政治家',
    group('反穀物法同盟',figure('cobden',null,'議会の内外で全国的な廃止運動'),figure('bright',null,'コブデンとともに指導する')),
    group('保守党の内部も分かれる',figure('peel',null,'廃止に賛成した内閣のもとで実現'),figure('landowners',null,'猛反対の一方、商工業へ投資する地主もいる'))),
  reason:'三人の本人を区別する。議会や運動の説明から特定の現在地を補わない。'
});
scene(1,11,{
  mapProps:[prop('grain-cargo','地主が恐れたロシアの安い小麦','russia',{description:'地主の輸入への懸念を示す'})],
  illustration:illustration('自由貿易の後の農業',group('地主の心配',figure('landowners',null,'ロシアの安い小麦への懸念')),
    group('経営の改良',figure('farmers','イギリスの農業','経営合理化と農場改良で繁栄する'))),
  reason:'原文は地主が恐れた輸入を説明するため、実際の輸出経路や商品の移動は作らず、静的な比較として示す。'
});
scene(1,12,{
  mapActors:[actor('workers','労働者','britain',{description:'選挙権を求めて組織的な政治運動'})],
  mapProps:[prop('ballot-box','選挙権の要求','britain',{offset:[44,0]})],
  illustration:illustration('第1回の改正の後も残る格差',group('選挙権を得た側',figure('industrialists',null,'第1回改正で選挙権が広がった')),
    group('選挙権を得られない側',figure('workers',null,'自分たちを守る法律を求める'))),
  reason:'チャーティスト運動を労働者の一般集団として示し、架空の指導者を作らない。'
});
scene(1,13,{
  mapActors:[actor('workers','チャーティスト運動','britain',{description:'人民憲章を全国と議会へ提出'})],
  mapProps:[prop('constitution-document','人民憲章','britain',{offset:[44,0]})],
  illustration:illustration('人民憲章の要求',group('選挙と議員の条件',figure('ballot-box','男性普通選挙・秘密投票','貧しい人も政治へ参加するための要求'),figure('tax-ledger','議員有給','労働者も議員として生活できるようにする'))),
  reason:'6カ条は本文と原書の説明図で全文を保持。要求をすでに実現した法律として示さない。'
});
scene(1,14,{
  mapActors:[actor('workers','ケニントン広場の労働者','kennington',{description:'1848年の大規模なデモ'}),
    actor('british-police','警察','kennington',{offset:[42,0],description:'政府が動員して弾圧する'})],
  illustration:illustration('チャーティスト運動の最高潮',group('集まった側',figure('workers',null,'数万人が広場でデモ')),
    group('政府が動員した側',figure('british-soldiers','軍','警察とともに弾圧する'))),
  reason:'原文45ページで場所の明らかな集団をケニントン広場へ置く。政治家個人を現場に作らない。'
});
scene(1,15,{
  sourceFigureReferences:[{name:'鉄道',page:45,lines:[107],reason:'原書の吹き出しが、馬車なしで遠出できる理由を鉄道の開通として説明する。'}],
  mapActors:[actor('workers','労働者','britain',{description:'賃金が上がり生活にゆとり'})],
  illustration:illustration('デモからお出かけへ',group('生活の変化',figure('tax-ledger','給料','少しは生活にゆとりが出る'),figure('railway','鉄道','原書45ページの吹き出しでは遠出できる理由を説明')),
    group('万博を見に行く',figure('crystal-palace','ロンドン万国博覧会','1851年、デモより万博という人も増える'))),
  reason:'賃金と交通の説明であり、本文にない都市からの旅行経路は追加しない。'
});
scene(1,16,{
  mapProps:[prop('ballot-box','第2回選挙法改正','britain')],
  illustration:illustration('選挙権を得る労働者の範囲',group('改正をおこなう内閣',figure('derby',null,'保守党の内閣が1867年に改正')),
    group('都市の選挙区',figure('workers','都市労働者','選挙権が拡大する')),
    group('まだ選挙権のない側',figure('farmers','農業労働者','第2回改正の対象ではない'),figure('workers','鉱山労働者','都市の選挙区だけの変更'))),
  reason:'労働者全員が選挙権を得たとは示さず、原文の都市・農村の制度差を模式欄で明確にする。'
});
scene(1,17,{
  mapProps:[prop('steam-factory','世界の工場','britain'),prop('merchant-cargo','自由貿易','britain',{offset:[44,0]})],
  illustration:illustration('パクス＝ブリタニカの背景',group('圧倒的な工業力',figure('industrialists',null,'工業製品を世界各地へ輸出する')),
    group('時代の呼び名',figure('victoria',null,'女王にちなんでヴィクトリア時代と呼ぶ'))),
  reason:'具体的な植民地や遠征先は原文にないので追加しない。女王は時代の説明として模式欄に置く。'
});
scene(1,18,{
  mapProps:[prop('crystal-palace','クリスタル＝パレス（水晶宮）','hyde'),prop('railway','全国の鉄道網','britain',{offset:[46,0]})],
  illustration:illustration('博覧会と大衆社会',group('人を集める交通と旅行',figure('thomas-cook','クック','万博見物の割引ツアーを企画する'),figure('railway','鉄道','全国から見物客を運ぶ')),
    group('会場',figure('crystal-palace',null,'全面ガラス張りの会場に10万点の展示物'))),
  reason:'会場は本文のハイド・パーク。クック個人の旅程は作らず、鉄道網は模式的な記号とする。'
});
scene(1,19,{
  sourceFigureReferences:[{name:'ディズレーリ',page:46,lines:[139],reason:'原書46ページの二大政党比較欄で保守党の代表者として参照。'},
    {name:'グラッドストン',page:46,lines:[145],reason:'原書46ページの二大政党比較欄で自由党の代表者として参照。'}],
  mapProps:[prop('parliament-building','二大政党制','britain')],
  illustration:illustration('原書46ページの二大政党の比較',
    group('保守党',figure('landowners',null,'地主や貴族が支持基盤'),figure('disraeli',null,'原書比較欄の代表的な政治家')),
    group('自由党',figure('industrialists',null,'産業資本家が支持基盤'),figure('gladstone',null,'原書比較欄の代表的な政治家'))),
  reason:'通常本文の直後の原書46ページの比較欄に接続する。二人の人物の在所は固定しない。'
});
scene(1,20,{
  mapProps:[prop('suez-canal','スエズ運河会社株','suez'),prop('public-school','公立学校','britain')],
  illustration:illustration('二つの内閣の政策',group('保守党',figure('disraeli',null,'スエズ運河会社株の買収やインド帝国の樹立')),
    group('自由党',figure('gladstone',null,'教育法・労働組合法・第3回選挙法改正'),figure('farmers','農業労働者','第3回改正で選挙権が拡大'),figure('workers','鉱山労働者','第3回改正で対象となる'))),
  reason:'運河の地点は株式買収の対象。ディズレーリ本人を運河へ移動させない。原書47ページの改正表も全文で参照する。'
});

scene(2,1,{
  mapActors:[actor('irish-tenants','アイルランド人','ireland',{description:'宗教と土地の二つの問題を抱える'})],
  mapProps:[prop('grain-cargo','穀物','britain',{route:0,description:'不在地主に渡る穀物'})],
  illustration:illustration('宗教と土地の違い',group('過去の征服',ref('cromwell',null,'アイルランド征服の歴史参照')),
    group('不在地主',figure('landowners','イギリス人地主','アイルランド人の農地を奪った支配層'))),
  reason:'征服者は過去の参照。不在地主をアイルランドにいる人として描かず、穀物だけを動かす。'
});
scene(2,2,{
  mapProps:[prop('constitution-document','1801年の併合','ireland'),prop('parliament-building','本国議会','britain')],
  illustration:illustration('併合と公職の制限',group('議員を送れる地域となる',figure('irish-tenants','アイルランド人','連合王国の一部になる')),
    group('残っていた審査法',figure('constitution-document','審査法','議員を送れることと、議員になれることは違う'))),
  reason:'制度の変化を比較する。代表者がダブリンからロンドンへ旅行したという経路は追加しない。'
});
scene(2,3,{
  sourceFigureReferences:[{name:'メアリ1世',page:48,lines:[226],reason:'原書48ページの吹き出しに登場する過去の女王。通常本文の当事者として追加しない。'}],
  mapProps:[prop('parliament-building','議会と公職','britain')],
  illustration:illustration('宗教差別が残った理由',group('1673年の背景',ref('charles-ii',null,'カトリック政策に対抗して議会が審査法をつくった')),
    group('原書48ページの吹き出し',ref('mary-i',null,'国教会とカトリックの対立の歴史参照')),
    group('19世紀まで残る規定',figure('constitution-document','審査法','公職就任者を国教徒に限定する'))),
  reason:'過去の王と女王を19世紀の当事者や同時代の人物として同席させない。'
});
scene(2,4,{
  mapProps:[prop('ballot-box','オコンネルの当選','ireland')],
  illustration:illustration('当選取消と二段階の改革',group('当選しても議員になれない',figure('oconnell',null,'審査法のため当選を取り消された')),
    group('反乱寸前の状況への対応',figure('wellington',null,'首相が法の改革に踏み切った')),
    group('原文の二段階',figure('constitution-document','審査法廃止','非国教徒の公職就任が可能になる'),figure('constitution-document','カトリック教徒解放法','翌年、宗教差別を撤廃する'))),
  reason:'原文の法の説明と順序を保持し、二人の現在地や当選後の移動を補わない。'
});
scene(2,5,{
  mapProps:[prop('healthy-potatoes','ジャガイモ（主食）','ireland'),prop('grain-cargo','小麦','britain',{route:0,description:'不在地主へ渡る小麦'})],
  illustration:illustration('小麦をつくっても食べられない',group('小作人の食事',figure('irish-tenants','小作人','小麦を取られるため、ジャガイモを主食にする')),
    group('地主への小麦',figure('landowners','不在地主','アイルランドには住んでいない地主'))),
  reason:'農作物の行き先と小作人の生活を分ける。個別の農場や地主の居所は追加しない。'
});
scene(2,6,{
  mapActors:[actor('irish-emigrants','アイルランドからの移民','america',{route:1,description:'新天地アメリカへ移民が急増'})],
  mapProps:[prop('healthy-potatoes','ジャガイモ','ireland',{afterKey:'blighted-potatoes',description:'病気による凶作で主食が失われる'}),
    prop('grain-cargo','イギリスへの小麦輸出','britain',{route:0,description:'小麦の輸出はほぼ変わらない'})],
  illustration:illustration('飢饉と移民の増加',group('アイルランドの生活',figure('irish-tenants','小作人','100万人を超えるともいわれる餓死者')),
    group('原書49ページの図との対照',figure('blighted-potatoes','ジャガイモの凶作','小麦は採れても小作人の主食がなくなる'))),
  reason:'作物の前後の姿を切り替える。移民の米国側は代表位置で、到着都市や大西洋の正確な航路ではない。'
});
scene(2,7,{
  mapActors:[actor('irish-tenants','小作人の救済運動','ireland',{description:'土地と自治を求める運動が続く'})],
  illustration:illustration('武装蜂起と政治的な要求',group('1848年の独立を目指す蜂起',figure('obrien',null,'青年アイルランド党の蜂起は鎮圧される')),
    group('50年代以降の運動',figure('irish-tenants','小作人同盟','3F運動で小作人を救済する'),figure('constitution-document','フィニアン党・アイルランド国民党','独立や自治権を求める運動も続く'))),
  reason:'各組織の要求を混同せず、蜂起が成功したという絵や原文にない武装経路を作らない。'
});
scene(2,8,{
  mapProps:[prop('constitution-document','アイルランド土地法','ireland'),prop('parliament-building','自治法案の審議','britain')],
  illustration:illustration('土地改革と自治の要求',group('自由党の改革',figure('gladstone',null,'小作権を安定させ、地代を下げる')),
    group('アイルランド人の要求',figure('irish-tenants',null,'土地と自治権を求める')),
    group('議会での反対',figure('landowners','保守党・上院の地主','自治法案は2度否決された'))),
  reason:'土地法の成立と自治法案の否決を分ける。政治家がアイルランドを訪問したという移動は作らない。'
});
scene(2,9,{
  mapProps:[prop('constitution-document','自治か独立か','ireland')],
  illustration:illustration('二つの政党の要求',group('アイルランド国民党',figure('constitution-document','自治権','自治権を要求する')),
    group('シン＝フェイン党',figure('ballot-box','完全独立','1905年に結成され、独立を主張する'))),
  reason:'政党を固有の政治家の顔で代用しない。自治と独立を同じ要求として混ぜない。'
});
scene(2,10,{
  mapProps:[prop('constitution-document','アイルランド自治法','ireland'),prop('calendar','実施延期','ireland',{offset:[45,0]})],
  illustration:illustration('成立しても実施されない自治法',group('1914年の成立',figure('asquith',null,'自由党の内閣が自治法を成立させる')),
    group('実施の延期',figure('calendar','第一次世界大戦','大戦の開始を理由に実施は延期された'))),
  reason:'法律の成立を自治の即時実施と同じ動きにしない。第一次世界大戦の出兵や部隊は本文にないので足さない。'
});
scene(2,11,{
  mapActors:[actor('revolutionary-citizens','ダブリンの急進独立派','dublin',{description:'1916年のイースター蜂起'})],
  mapProps:[prop('ballot-box','シン＝フェイン党の圧勝','ireland')],
  illustration:illustration('蜂起の後に高まる独立運動',group('独立宣言の指導者',figure('de-valera',null,'党首を中心にイギリスからの独立を宣言する')),
    group('議員の態度',figure('parliament-delegates','シン＝フェイン党の議員','本国議会への出席を拒否する'))),
  reason:'一般の市民像は独立派の模式的な記号。デ＝ヴァレラを蜂起の現場の司令官として配置せず、その後の宣言の役割に限る。'
});
scene(2,12,{
  mapProps:[prop('constitution-document','アイルランド自由国','ireland'),prop('crown','イギリス側の北部','ulster')],
  illustration:illustration('1922年の南部のみの自治領',group('南部',figure('constitution-document','アイルランド自由国','南部のみが自治領となる')),
    group('北部',figure('crown','アルスター地方','イングランド系・国教徒が多い北部を切り離す'))),
  reason:'国の代表位置で制度を示す。原文の文字だけから厳密な境界線や北部全域の割り当てを描かない。'
});
scene(2,13,{
  mapProps:[prop('constitution-document','エール・アイルランド共和国','ireland'),prop('crown','イギリス領の北部','ulster')],
  illustration:illustration('独立までの段階',group('1937年',figure('ballot-box','人民投票','新憲法でエールとして独立を宣言する')),
    group('1949年',figure('constitution-document','アイルランド共和国','完全な独立国家となる')),
    group('残った問題',figure('crown','北部アルスター地方','イギリス領のまま、戦後まで問題が続く'))),
  reason:'1937年の宣言を当時の英国承認と混同せず、南北の違いと1949年の独立を保持する。'
});

scene(3,1,{
  mapProps:[prop('ballot-box','国民投票','france')],
  illustration:illustration('同じ人物が皇帝へ',
    group('即位前の振り返り',figure('louis-napoleon',null,'第1回で説明した人物','before','原文が即位前の名と即位後の名を接続する')),
    group('1852年の即位後',figure('napoleon-iii',null,'皇帝の座を維持するには人気が必要','after','ルイ＝ナポレオンと同じ本人の礼装の違い'))),
  reason:'同一人物の前後の姿を意図して対比する。叔父のナポレオン1世の画像は使わない。'
});
scene(3,2,{
  mapActors:[actor('farmers','フランスの小農民','france',{description:'土地を持つ小農民が最大多数'})],
  illustration:illustration('フランスとイギリスの違い',group('フランスの小農民',figure('farmers',null,'土地を持ち、わざわざ都市の労働者になろうとしない')),
    group('イギリスとの比較',figure('landowners','第2次囲い込み','小作人を追い出した英国との違い')),
    group('人気を取るための回想',ref('napoleon-i','ナポレオン','ナポレオンの思い出に訴える'))),
  reason:'叔父は小農民の回想の参照。皇帝ナポレオン3世と同じ本人として示さない。'
});
scene(3,3,{
  mapProps:[prop('crown','独裁政治の維持','france')],
  illustration:illustration('三階級への人気取り',group('小農民',figure('farmers',null,'最大多数の勢力')),
    group('産業資本家',figure('industrialists',null,'成長し始めたが英国ほど発展していない')),
    group('労働者',figure('workers',null,'英国ほど多くないが無視できない')),
    group('皇帝と中心となる勢力',figure('napoleon-iii',null,'各階層への人気取りを続ける'),figure('bankers','大資本家','軍部とともに中心となる'))),
  reason:'三階級の比較は地理的な地域の分割ではない。ナポレオン3世の所在地を固定しない。'
});
scene(3,4,{
  sourceFigureReferences:[{name:'凱旋門',page:53,lines:[362],reason:'パリ改造のコラムで道路網の中心となる建物として参照。'},
    {name:'オペラ座',page:53,lines:[362],reason:'パリ改造のコラムの地上の整備として参照。'},
    {name:'下水道',page:53,lines:[362],reason:'パリ改造のコラムの地下の整備として参照。'}],
  mapProps:[prop('paris-boulevard','パリの全面的改造','paris'),prop('steam-factory','フランスの産業革命','france',{offset:[46,0]})],
  illustration:illustration('パリの改造と各階層への政策',group('改造の指示と担当',figure('napoleon-iii',null,'オスマンにパリの改造を命じる'),figure('haussmann','オスマン','セーヌ県知事として改造を担当')),
    group('原書53ページの地上の整備',figure('arc-de-triomphe','凱旋門','放射状の道路網'),figure('paris-opera','オペラ座','景観を変えた建物')),
    group('原書53ページの地下の整備',figure('paris-sewers','下水道','集中排水で街を衛生的にする')),
    group('労働者への政策',figure('tax-ledger','年金制度','生活改善で人気を取る'))),
  reason:'県知事を国家オスマン帝国と混同しない。都市の詳細は原書53ページのコラムと模式図へ分け、地理図の拡大上限を保つ。'
});
scene(3,5,{
  mapActors:[actor('french-soldiers','インドシナへ進出するフランス軍','cochinchina',{route:0,description:'コーチシナやカンボジアへの進出を宣伝する'}),
    actor('british-soldiers','クリミア戦争で協調するイギリス軍','crimea',{description:'イギリスとともにオスマン帝国を支援'})],
  illustration:illustration('遠征と権威の誇示',group('皇帝の方針',figure('napoleon-iii',null,'イギリスと敵対しないようにする')),
    group('回想の強いナポレオン',ref('napoleon-i','ナポレオン','過去の神話に訴えて人気を取る')),
    group('イタリア統一戦争',figure('treaty-document','講和','サルデーニャ支援のはずが勝手に講和する'))),
  reason:'遠征の軍は一般集団。皇帝本人をすべての戦場へ動かさない。ここでのオスマン帝国は国家であり、パリの県知事の絵を使わない。'
});
scene(3,6,{
  mapProps:[prop('constitution-document','自由帝政','france')],
  illustration:illustration('自由主義運動への歩み寄り',group('権力の維持を図る',figure('napoleon-iii',null,'国民に歩み寄る姿勢を見せる')),
    group('認める権利',figure('parliament-delegates','議会','議会の権限を認める'),figure('workers',null,'団結権を認める'),figure('constitution-document','言論','規制をゆるめる'))),
  reason:'自由帝政は皇帝の退位ではない。制度の変更を地理的な領域や遠征にしない。'
});
scene(3,7,{
  mapActors:[actor('french-soldiers','フランス軍のメキシコ出兵と撤退','france',{route:0,description:'アメリカの反発を受けて撤退'}),
    actor('british-soldiers','イギリス軍の出兵と先行撤退','britain',{route:1,description:'イギリスは先に撤退する'})],
  illustration:illustration('メキシコ出兵の失敗',group('出兵を進めた皇帝',figure('napoleon-iii',null,'イギリスとスペインを誘って出兵')),
    group('メキシコ皇帝にされた人物',figure('maximilian',null,'オーストリア皇帝の弟')),
    group('アメリカの反発',figure('treaty-document','モンロー宣言','南北戦争後、アメリカが猛反発する'))),
  reason:'出兵と撤退の順序だけを軍の動きにする。マクシミリアンの渡航やナポレオン3世の訪問経路は本文にないので作らない。'
});
scene(3,8,{
  mapActors:[actor('napoleon-iii','ナポレオン3世','sedan',{afterKey:'napoleon-iii-captive',description:'スダンで本人が捕虜となり退位する'})],
  mapProps:[prop('crown','第二帝政の崩壊','france')],
  illustration:illustration('ドイツ統一の阻止から普仏戦争へ',group('利用した側',figure('bismarck',null,'皇帝の強硬な発言を利用する')),
    group('戦争の帰結',figure('constitution-document','第三共和政','第二帝政の崩壊後の体制'))),
  reason:'原文で場所の明らかな皇帝本人だけをスダンへ置き、同じ顔の捕虜姿へ切り替える。ビスマルクを戦闘の現場へ配置しない。'
});
scene(3,9,{
  mapActors:[actor('prussian-soldiers','パリからヴェルサイユへ進むプロイセン軍','versailles',{route:0,description:'パリを占領して宮殿へ進む'}),
    actor('thiers','ティエール','bordeaux',{description:'ボルドーの臨時政府の首班'})],
  mapProps:[prop('royal-palace','ヴェルサイユ宮殿','versailles',{offset:[46,0]})],
  illustration:illustration('占領と臨時政府の降伏',group('原文54ページの出来事',figure('constitution-document','ドイツ帝国','ヴェルサイユ宮殿で成立'),figure('treaty-document','臨時政府の降伏','ドイツへ降伏した'))),
  reason:'本文で場所の明らかな政府首班をボルドーへ置く。宮殿の画像は一般的な模式記号であり、実建物の復元ではない。'
});
scene(3,10,{
  mapActors:[actor('revolutionary-citizens','パリ市民・労働者','paris',{description:'臨時政府からの自立を宣言する'})],
  mapProps:[prop('barricade','パリ＝コミューン','paris',{offset:[42,0]})],
  illustration:illustration('自治政府と鎮圧する側',group('パリ＝コミューン',figure('workers',null,'史上初の労働者による自治政府')),
    group('ティエール政権',figure('thiers',null,'武装解除を求め、徹底的に鎮圧する')),
    group('協力するドイツ軍',figure('prussian-soldiers','ドイツ軍','労働者の台頭を抑えたい利害が一致する'))),
  reason:'自治政府と臨時政府を分ける。協力を新しい遠征の経路にしない。「血の週間」の原文表記を本文で保持する。'
});
scene(3,11,{
  mapProps:[prop('treaty-document','フランクフルト講和条約','france'),prop('constitution-document','第三共和政憲法','france',{offset:[44,0]})],
  illustration:illustration('講和条件と共和国の確立',group('講和の条件',figure('treaty-document','アルザス・ロレーヌの割譲','石炭や鉄鉱石などの資源がとれる地域'),figure('tax-ledger','賠償金','50億フランを支払う')),
    group('共和国の大統領',figure('thiers',null,'正式に初代大統領となる')),
    group('1875年',figure('constitution-document','第三共和政憲法','第三共和政が確立する'))),
  reason:'講和条約の名称から調印場所や大統領の所在地を補わない。資源の地域の割譲は条約の記号と名称で示す。'
});
scene(3,12,{
  mapProps:[prop('calendar','年号の確認','britain')],
  illustration:illustration('原書54ページの年号と次回案内',group('年号を確認する',figure('calendar','年号のツボ','選挙法改正・アイルランド自由国・普仏戦争')),
    group('次回',figure('constitution-document','アメリカ合衆国','重要ポイントの多い次回へ進む','preview'))),
  reason:'今回の締めと次回案内も原文の通常本文として保持する。アメリカの次回の人物や事件を先取りしない。'
});

function freezeDeep(value) {
  if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freezeDeep);Object.freeze(value);}
  return value;
}
export const modernVisualAssetCatalog=freezeDeep(catalog);
export const modernVisualScenePlans=freezeDeep(plans);
export function withModernVisuals(original) {
  const plan=modernVisualScenePlans[original.id];if(!plan)return original;
  const hidden=new Set(plan.hiddenPersonNames);
  return {...original,actors:plan.mapActors.map(item=>({...item})),props:plan.mapProps.map(item=>({...item})),
    routes:[...original.routes,...plan.extraRoutes].map(item=>({...item,points:item.points.map(at=>[...at])})),
    tags:original.tags.filter(tag=>!(tag.kind==='person'&&hidden.has(tag.text))).map(tag=>({...tag})),
    namesOutsideMap:[...new Set((plan.illustration?.groups??[]).flatMap(item=>item.figures).filter(item=>item.kind==='person').map(item=>item.name))],
    textOnlyPeople:plan.textOnlyPeople.map(item=>({...item})),excludedPersonNames:plan.excludedPersonNames.map(item=>({...item})),
    personAliases:plan.personAliases.map(item=>({...item})),duration:original.duration||2600};
}
export function modernIllustrationFor(sceneOrId) {
  return modernVisualScenePlans[typeof sceneOrId==='string'?sceneOrId:sceneOrId?.id]?.illustration||null;
}
export const modernVisualEdition=Object.fromEntries(Object.entries(modernEdition).map(([lesson,scenes])=>[lesson,scenes.map(withModernVisuals)]));
