// 原書の比較欄・表に沿う説明図。紙面全文は別途 sourcePages で表示する。
export const modernDiagrams = {
  trade: {title:'地主と産業資本家の貿易政策',page:43,columns:[
    ['地主','農業','保護貿易'],['産業資本家','工業','自由貿易']
  ]},
  reform1833: {title:'1833年におこなわれた改革',page:44,columns:[
    ['奴隷制廃止','人道的改革','すでに1807年に奴隷貿易禁止'],
    ['工場法（一般工場法）','シャフツベリー卿らが尽力','おもに児童や青少年の労働条件の保護を決定'],
    ['東インド会社の対中国貿易独占権廃止・商業活動停止','1833年に議決、1834年に実施','東インド会社は純粋なインド統治機関となる']
  ]},
  charter: {title:'人民憲章の6カ条',page:45,columns:[
    ['参政権と投票','男性普通選挙','無記名秘密投票'],
    ['議員の条件','議員の財産資格の廃止','議員有給'],
    ['選挙区と議会','均等選挙区','議会の毎年改選']
  ]},
  parties: {title:'イギリスの二大政党制',page:46,columns:[
    ['保守党','右派のトーリ党を基盤とする','おもに地主が支持基盤','植民地を拡大する大英国主義','代表的な政治家はディズレーリ'],
    ['自由党','左派のホイッグ党の流れを受け継ぐ','おもに産業資本家が支持基盤','植民地の拡大に反対する小英国主義','代表的な政治家はグラッドストン']
  ]},
  voting: {title:'イギリスの選挙法改正',page:47,columns:[
    ['第1回（1832）','グレイ（ホイッグ党）','産業資本家などの中産階級 ［4.5%］'],
    ['第2回（1867〜68）','ダービー（保守党）','都市労働者 ［9%］'],
    ['第3回（1884）','グラッドストン（自由党）','農業・鉱山労働者 ［19%］'],
    ['第4回（1918）','ロイド＝ジョージ（挙国一致）※ロイド＝ジョージは自由党','21歳以上の男性普通選挙、30歳以上の女性参政権 ［46%］'],
    ['第5回（1928）','ボールドウィン（保守党）','21歳以上の男女平等普通選挙 ［62%］'],
    ['第6回（1969）','ウィルソン（労働党）','18歳以上の男女平等普通選挙 ［71%］']
  ]},
  famine: {title:'ジャガイモ飢饉の前後',page:49,columns:[
    ['ジャガイモ飢饉の前','アイルランドの小作人：ジャガイモ栽培（主食）・小麦栽培','小麦はイギリスへ','不在地主の支配'],
    ['ジャガイモ飢饉','ジャガイモは凶作','小作人は多数が餓死','小麦はこれまで通りイギリスへ','不在地主の支配']
  ]},
  ireland: {title:'アイルランドの自治と独立の要求',page:50,columns:[
    ['アイルランド国民党','自治権を要求'],['シン＝フェイン党','独立を主張']
  ]},
  bonapartism: {title:'ボナパルティズムと三階級',page:'51・52',columns:[
    ['小農民','最大多数','ナポレオンの思い出に訴える'],
    ['産業資本家','成長し始めている','イギリスほど発展しているわけじゃない'],
    ['労働者','イギリスほど多いわけじゃない','各階層への人気取り']
  ]},
  paris: {title:'パリの全面的改造事業',page:53,columns:[
    ['改造前','入り組んだ路地・ごみの山','煤煙・不衛生な貧民街'],
    ['地上の整備','凱旋門から放射状に伸びる道路網','街灯・建物の高さ・オペラ座・公園・ボンマルシェ百貨店'],
    ['地下の整備','下水道の整備','不衛生な下水を集中排水']
  ]}
};

const sceneDiagrams = {
  'modern-c01-l02-p01-007':'trade','modern-c01-l02-p01-009':'reform1833',
  'modern-c01-l02-p01-013':'charter','modern-c01-l02-p01-019':'parties',
  'modern-c01-l02-p01-020':'voting','modern-c01-l02-p02-006':'famine',
  'modern-c01-l02-p02-009':'ireland','modern-c01-l02-p03-003':'bonapartism',
  'modern-c01-l02-p03-004':'paris'
};
export function modernDiagramFor(scene) {
  return modernDiagrams[sceneDiagrams[scene.id]];
}
export function modernReferencePages(scene, volume, index) {
  const diagram = modernDiagramFor(scene);
  const linked = [...scene.plainBody.join('').matchAll(/P\.(\d+)/g)].map(match=>Number(match[1])).filter(page=>page>=41&&page<=54);
  const diagramPages = diagram ? String(diagram.page).split('・').map(Number) : [];
  return [...new Set([...(index===0&&volume.part===1?[41]:[]),...scene.sourceText.sourcePages,...linked,...diagramPages])].sort((a,b)=>a-b);
}
