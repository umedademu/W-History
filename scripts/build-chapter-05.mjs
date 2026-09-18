import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries} from '../public/chapter-05-volumes.js';
import {chapterNamesInText,chapterRivers} from '../public/chapter-05-geography.js';

const chapter=5;
const root=new URL('../',import.meta.url);
const read=p=>fs.readFile(new URL(p,root),'utf8');
const {paragraphs}=JSON.parse(await read('docs/chapter-05/source-selection.json'));
const readingPlan=JSON.parse(await read('docs/chapter-05/reading-plan.json'));
const routes=JSON.parse(await read('docs/chapter-05/routes.json'));
const byId=new Map(paragraphs.map(p=>[p.id,p]));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function spans(markdown){
  let pos=0,start=null;const result=[];
  for(let i=0;i<markdown.length;){
    if(markdown.slice(i,i+2)==='**'){
      if(start===null)start=pos;
      else{result.push([start,pos]);start=null;}
      i+=2;
    }else{i++;pos++;}
  }
  assert.equal(start,null,'太字の閉じ忘れ');
  return result;
}

function decorate(p,start,end){
  const bold=spans(p.markdown);
  const bounds=[...new Set([start,end,...bold.flat().filter(x=>x>start&&x<end)])].sort((a,b)=>a-b);
  return bounds.slice(0,-1).map((a,i)=>{
    const b=bounds[i+1],t=escape(p.text.slice(a,b));
    return bold.some(([x,y])=>a>=x&&b<=y)?'<span class="source-bold">'+t+'</span>':t;
  }).join('');
}

assert.deepEqual([...new Set(readingPlan.map(p=>p.volume))],chapterSeries.map(v=>v.id));
let index=0,offset=0;
for(const page of readingPlan)for(const pass of page.passages){
  const p=paragraphs[index];assert.ok(p);
  assert.equal(pass.paragraph,p.id);assert.equal(page.volume,p.volume);
  assert.equal(pass.start,offset);assert.ok(pass.end>offset&&pass.end<=p.text.length);
  offset=pass.end;if(offset===p.text.length){index++;offset=0;}
}
assert.equal(index,paragraphs.length);assert.equal(offset,0);

export const personInfo = {
  // 宋代・五代十国
  '朱全忠': { image: 'zhu-quanzhong', bubble: '黄巣の乱を鎮圧後に唐を滅ぼし後梁を開く！' },
  '石敬瑭': { image: 'shi-jingtang', bubble: 'キタイの援軍で後唐を滅ぼし燕雲十六州を割譲！' },
  '馮道': { image: 'feng-dao', bubble: '五代の激動期に4王朝10人の君主に仕えた老練宰相！' },
  '趙匡胤': { image: 'song-taizu', bubble: '陳橋の変で擁立され宋を建国！文治主義で藩鎮を抑える！' },
  '恭帝': { image: 'gongdi-zhou', bubble: '後周最後の幼帝、陳橋の変で趙匡胤に禅譲' },
  '真宗': { image: 'song-zhenzong', bubble: 'キタイ（遼）と澶淵の盟を結び毎年銀・絹を贈る' },
  '神宗': { image: 'song-shenzong', bubble: '王安石を宰相に抜擢し新法改革を強力に支援！' },
  '王安石': { image: 'wang-anshi', bubble: '青苗法・市易法・保甲法など新法を実施し富国強兵を推進！' },
  '司馬光': { image: 'sima-guang', bubble: '旧法党の領袖！年代記『資治通鑑』を編纂！' },
  '蘇軾': { image: 'su-shi', bubble: '蘇東坡！赤壁賦を詠み旧法党として新法に反対' },
  '蘇轍': { image: 'su-zhe', bubble: '蘇軾の弟、唐宋八大家の一角として官界で活躍' },
  '曾鞏': { image: 'zeng-gong', bubble: '唐宋八大家の一人、名文家として後進を育成' },
  '徽宗': { image: 'song-huizong', bubble: '風流天子！痩金体の書と花鳥画を究めるも靖康の変で北去' },
  '欽宗': { image: 'song-qinzong', bubble: '北宋最後の皇帝、金軍の侵攻を受け開封陥落' },
  '趙構': { image: 'song-gaozong', bubble: '南宋初代皇帝、臨安（杭州）に都を置き政権を再興！' },
  '岳飛': { image: 'yue-fei', bubble: '「尽忠報国」！金軍を連破した南宋不滅の英雄！' },
  '秦檜': { image: 'qin-hui', bubble: '金との和平を主導し紹興の和議を成立させる' },
  '周敦頤': { image: 'zhou-dunyi', bubble: '『太極図説』を著し宋学・新儒学の先駆を開く！' },
  '朱子': { image: 'zhu-xi', bubble: '理気二元論と性即理を説き朱子学を大成！四書集注を著す' },
  '朱熹': { image: 'zhu-xi', bubble: '理気二元論と性即理を説き朱子学を大成！四書集注を著す' },
  '程顥': { image: 'cheng-hao', bubble: '明道先生、天理の自然と仁を説く' },
  '程頤': { image: 'cheng-yi', bubble: '「性即理」を唱え北宋二程子として道学を確立！' },
  '陸九淵': { image: 'lu-jiuyuan', bubble: '「心即理」を唱え朱熹と鵝湖の会で論争！' },

  // 遼・西夏・金
  '耶律阿保機': { image: 'yelu-abaoji', bubble: '契丹諸部を統一し遼（キタイ）を建国！' },
  '耶律堯骨': { image: 'yelu-deguang', bubble: '後晋から燕雲十六州を獲得し国号を「大遼」と改称！' },
  '耶律大石': { image: 'yelu-dashi', bubble: '中央アジアへ逃れて西遼（カラ・キタイ）を建設！' },
  '聖宗': { image: 'liao-shengzong', bubble: '北宋と澶淵の盟を結び遼の最盛期を統治！' },
  '李元昊': { image: 'li-yuanhao', bubble: '西夏文字を制定し西夏（大夏）の皇帝として即位！' },
  '完顔阿骨打': { image: 'wanyan-aguda', bubble: '女真諸部を統合し金を建国、遼を撃破！' },
  '阿骨打': { image: 'wanyan-aguda', bubble: '女真諸部を統合し金を建国、遼を撃破！' },
  '海陵王': { image: 'prince-hailing', bubble: '金の首都を上京会寧府から燕京（中都）へ遷都！' },

  // モンゴル帝国・元
  'チンギス＝ハン': { image: 'genghis-khan', bubble: 'モンゴル諸部族を統一し世界帝国の礎を築く！' },
  'テムジン': { image: 'genghis-khan', bubble: 'モンゴル諸部族を統一し世界帝国の礎を築く！' },
  'オゴデイ': { image: 'ogedei-khan', bubble: '第2代ハーン！金を滅ぼしカラコルムを建設！' },
  'オゴタイ': { image: 'ogedei-khan', bubble: '第2代ハーン！金を滅ぼしカラコルムを建設！' },
  'グユク': { image: 'guyuk-khan', bubble: '第3代ハーン！ローマ教皇の使節カルピニと引見' },
  'モンケ': { image: 'mongke-khan', bubble: '第4代ハーン！東西への大遠征を命じる' },
  'トゥルイ': { image: 'tolui-noyan', bubble: 'チンギス＝ハンの末子、モンケ・クビライ・フラグの父' },
  'クビライ': { image: 'kublai-khan', bubble: '大元ウルスを創始し大都へ遷都！南宋を滅ぼす！' },
  'フビライ': { image: 'kublai-khan', bubble: '大元ウルスを創始し大都へ遷都！南宋を滅ぼす！' },
  'アリクブケ': { image: 'ariq-boke', bubble: 'カラコルムを拠点にクビライと大ハーン位を争う！' },
  'バトゥ': { image: 'batu-khan', bubble: 'ロシア・東欧へ大遠征しキプチャク＝ハン国を建国！' },
  'フレグ': { image: 'hulagu-khan', bubble: '西アジア遠征でバグダードを攻略、イル＝ハン国を樹立！' },
  'フラグ': { image: 'hulagu-khan', bubble: '西アジア遠征でバグダードを攻略、イル＝ハン国を樹立！' },
  'ガザン＝ハン': { image: 'ghazan-khan', bubble: 'イル＝ハン国でイスラーム教を国教化！' },
  'カイドゥ': { image: 'qaidu-khan', bubble: '中央アジアでクビライに叛旗を翻す（カイドゥの乱）！' },
  'ハイドゥ': { image: 'qaidu-khan', bubble: '中央アジアでクビライに叛旗を翻す（カイドゥの乱）！' },
  'ウズベク＝ハン': { image: 'uzbeg-khan', bubble: 'キプチャク＝ハン国をイスラーム化し最盛期を築く！' },
  'パクパ': { image: 'phagpa-lama', bubble: 'チベット仏教サキャ派の座主、パスパ文字を制定！' },
  'パスパ': { image: 'phagpa-lama', bubble: 'チベット仏教サキャ派の座主、パスパ文字を制定！' },
  '郭守敬': { image: 'guo-shoujing', bubble: '大都の治水と精密な授時暦を作成した科学者！' },
  '韓山童': { image: 'han-shantong', bubble: '白蓮教徒を率いて「弥勒下生」を唱え紅巾の乱を起こす！' },
  '韓林児': { image: 'han-liner', bubble: '小明王として擁立された紅巾軍の最高指導者！' },

  // 明代
  '朱元璋': { image: 'hongwu-emperor', bubble: '紅巾の乱から身を起こし明を建国！六諭を発布！' },
  '洪武帝': { image: 'hongwu-emperor', bubble: '紅巾の乱から身を起こし明を建国！六諭を発布！' },
  '朱標': { image: 'zhu-biao', bubble: '洪武帝の長子、懿文太子として仁政を志すも早逝' },
  '建文帝': { image: 'jianwen-emperor', bubble: '削藩政策を進めるも叔父の燕王に倒される（靖難の役）' },
  '朱棣': { image: 'yongle-emperor', bubble: '北京へ遷都し紫禁城を造営！鄭和の南海遠征を断行！' },
  '永楽帝': { image: 'yongle-emperor', bubble: '北京へ遷都し紫禁城を造営！鄭和の南海遠征を断行！' },
  '燕王朱棣': { image: 'yongle-emperor', bubble: '北京へ遷都し紫禁城を造営！鄭和の南海遠征を断行！' },
  '正統帝': { image: 'zhengtong-emperor', bubble: 'オイラト親征を試みるも土木堡で捕虜となる（土木の変）' },
  '万暦帝': { image: 'wanli-emperor', bubble: '明の衰退期、張居正を信任するも後半は親政放棄' },
  '崇禎帝': { image: 'chongzhen-emperor', bubble: '李自成軍の北京突入に際し景山で自害した明最後の皇帝' },
  '張居正': { image: 'zhang-juzheng', bubble: '一条鞭法を実施し明の財政を立て直した辣腕首輔！' },
  '徐光啓': { image: 'xu-guangqi', bubble: 'マテオ・リッチと交友し『幾何原本』『農政全書』を著述！' },
  '王守仁': { image: 'wang-yangming', bubble: '「心即理」「知行合一」「致良知」を唱え陽明学を開く！' },
  '王陽明': { image: 'wang-yangming', bubble: '「心即理」「知行合一」「致良知」を唱え陽明学を開く！' },
  '顧憲成': { image: 'gu-xiancheng', bubble: '東林書院を再興し政治批判を展開（東林派）！' },
  '魏忠賢': { image: 'wei-zhongxian', bubble: '宦官として専権を極め東林派官僚を徹底弾圧！' },
  '鄭和': { image: 'zheng-he', bubble: '大宝船隊を率い南海・インド洋・アフリカへ7度の大遠征！' },
  '王直': { image: 'wang-zhi', bubble: '東シナ海を席巻した後期倭寇（大船団）の頭目！' },
  '李自成': { image: 'li-zicheng', bubble: '「均田免賦」を掲げ北京を占領、順朝を樹立！' },
  '呉三桂': { image: 'wu-sangui', bubble: '山海関を開いて清軍を招き入れ、後に三藩の乱を起こす！' },
  '鄭成功': { image: 'zheng-chenggong', bubble: 'オランダ人を台湾から駆逐し「滅満興漢」の拠点を築く！' },
  '鄧茂七': { image: 'deng-maoqi', bubble: '福建で抗租運動を起こし明朝を震撼させた農民指導者！' },
  '楊応龍': { image: 'yang-yinglong', bubble: '播州の土司として明朝に大規模反乱を起こす！' },
  'エセン＝ハン': { image: 'attila-hun', bubble: 'オイラトを率いて土木の変で明の正統帝を捕縛！' },
  'アルタン＝ハン': { image: 'modu-chanyu', bubble: 'タタールを率いて北京を包囲（庚戌の変）！' },

  // 清代
  'ヌルハチ': { image: 'nurhaci-emperor', bubble: '女真を統一し八旗を創設、後金を建国！' },
  'ホンタイジ': { image: 'hong-taiji', bubble: '国号を「清」に改め、部族名を「満洲」と改称！' },
  '順治帝': { image: 'shunzhi-emperor', bubble: '山海関を越えて北京に入城した清の中国初代皇帝！' },
  '康熙帝': { image: 'kangxi-emperor', bubble: '三藩の乱を平定し台湾・外モンゴルを統治した名君！' },
  '雍正帝': { image: 'yongzheng-emperor', bubble: '軍機処を設置し文字の獄を強化、独裁体制を確立！' },
  '乾隆帝': { image: 'qianlong-emperor', bubble: '十全武功で領土最大！『四庫全書』を編纂！' },
  '嘉慶帝': { image: 'jiaqing-emperor', bubble: '和珅を処刑し白蓮教徒の乱を鎮圧するも清は衰退へ' },
  'ガルダン＝ハン': { image: 'galdan-khan', bubble: 'ジュンガルを率いてチベット・内モンゴルへ進出！' },
  'ダライ＝ラマ': { image: 'dalai-lama', bubble: 'チベット仏教ゲルク派の最高指導者！' },

  // 東南アジア・朝鮮・日本
  '王建': { image: 'wang-geon', bubble: '後三国を統一し高麗を建国！開京を都と定める' },
  '李舜臣': { image: 'yi-sun-sin', bubble: '亀甲船を率いて閑山島・鳴梁で日本の水軍を撃滅！' },
  '李公蘊': { image: 'ly-thai-to', bubble: '大越国李朝を開き都を昇竜（ハノイ）へ遷都！' },
  '黎利': { image: 'le-loi', bubble: '明軍をベトナムから撃退し黎朝を創始！' },
  '阮福映': { image: 'nguyen-phuc-anh', bubble: '西山の乱を平定しベトナム全土を統一、阮朝を開く！' },
  'ピニョー': { image: 'pigneaux-bishop', bubble: 'フランス宣教師、阮福映のベトナム統一を援助！' },
  'スールヤヴァルマン2世': { image: 'suryavarman2', bubble: 'アンコール＝ワットを造営したアンコール朝の偉大な王！' },
  'ラームカムヘーン': { image: 'ram-khamhaeng', bubble: 'タイ文字を制定しスコータイ朝の最盛期を現出！' },
  'ラーマカムヘン': { image: 'ram-khamhaeng', bubble: 'タイ文字を制定しスコータイ朝の最盛期を現出！' },
  'ラーマ1世': { image: 'rama1-king', bubble: 'バンコクを都としラタナコーシン朝を開く！' },
  'チャクリ': { image: 'rama1-king', bubble: 'バンコクを都としラタナコーシン朝を開く！' },
  'アラウンパヤー': { image: 'alaungpaya-king', bubble: 'コンバウン朝を開きビルマを再統一！' },
  'ウィジャヤ': { image: 'raden-wijaya', bubble: '元の侵略軍を撃退しマジャパヒト王国を創始！' },
  '山田長政': { image: 'yamada-nagamasa', bubble: 'アユタヤ朝の日本人町頭領として王室で重用される！' },
  '尚巴志': { image: 'sho-hashi', bubble: '三山を統一して琉球王国を建国！首里城を築く' },
  '北条時宗': { image: 'hojo-tokimune', bubble: '鎌倉幕府第8代執権！元軍の蒙古襲来を退ける！' },
  '足利義満': { image: 'ashikaga-yoshimitsu', bubble: '「日本国王」として明と勘合貿易を開始！' },
  '豊臣秀吉': { image: 'toyotomi-hideyoshi', bubble: '天下統一を成し遂げ朝鮮へ二度の大出兵を命じる！' },
  '家康': { image: 'tokugawa-ieyasu', bubble: '江戸幕府を開き朱印船貿易を展開！' },
  'アルブケルケ': { image: 'albuquerque-conqueror', bubble: 'ポルトガル艦隊を率いてマラッカを占領！' },
  '義浄': { image: 'yijing-monk', bubble: '海路でインド・シュリーヴィジャヤへ渡り『南海寄帰内法伝』を著す！' },

  // 西洋使節・学者・思想家
  'プラノ＝カルピニ': { image: 'plano-carpini', bubble: '教皇の使節としてカラコルムのグユクに謁見！' },
  'マルコ＝ポーロ': { image: 'marco-polo', bubble: 'クビライに仕え『世界の記述（東方見聞録）』を口述！' },
  'イブン＝バットゥータ': { image: 'ibn-battuta', bubble: 'モロッコから大都・東南アジアを歴訪！' },
  'モンテ＝コルヴィノ': { image: 'montecorvino-bishop', bubble: '大都にカトリックの大司教座を設置！' },
  'ラシード＝アッディーン': { image: 'rashid-al-din', bubble: 'ガザン＝ハンの宰相として世界史『集史』を編纂！' },
  'ラシード＝ウッディーン': { image: 'rashid-al-din', bubble: 'ガザン＝ハンの宰相として世界史『集史』を編纂！' },
  'マテオ＝リッチ': { image: 'matteo-ricci', bubble: '『坤輿万国全図』を刊行し幾何原本を訳出！' },
  '利瑪竇': { image: 'matteo-ricci', bubble: '『坤輿万国全図』を刊行し幾何原本を訳出！' },
  'アダム＝シャール': { image: 'adam-schall', bubble: '西洋天文学で時憲暦を作成！' },
  '湯若望': { image: 'adam-schall', bubble: '西洋天文学で時憲暦を作成！' },
  'フェルビースト': { image: 'ferdinand-verbiest', bubble: '康熙帝に仕え天体観測儀や大砲を製造！' },
  '南懐仁': { image: 'ferdinand-verbiest', bubble: '康熙帝に仕え天体観測儀や大砲を製造！' },
  'ブーヴェ': { image: 'joachim-bouvet', bubble: 'ルイ14世の命で派遣され『康熙帝伝』を著す！' },
  '白晋': { image: 'joachim-bouvet', bubble: 'ルイ14世の命で派遣され『康熙帝伝』を著す！' },
  'レジス': { image: 'jean-regis', bubble: '最新測量術で中国全土の実測地図『皇輿全覧図』を作成！' },
  'カスティリオーネ': { image: 'giuseppe-castiglione', bubble: '円明園の西洋楼を設計し西洋画法を宮廷に伝える！' },
  '郎世寧': { image: 'giuseppe-castiglione', bubble: '円明園の西洋楼を設計し西洋画法を宮廷に伝える！' },
  'インノケンティウス4世': { image: 'innocent4-pope', bubble: 'プラノ・カルピニをモンゴル帝国へ派遣！' },
  'クレメンス11世': { image: 'clement11-pope', bubble: '教皇教書で中国の典礼受容を厳禁！' },
  'ピョートル1世': { image: 'peter-great', bubble: 'ロシア皇帝！康熙帝とネルチンスク条約を締結！' },
  'ルイ14世': { image: 'louis14-sun-king', bubble: 'フランス絶対王政の太陽王、中国へ宣教師使節を派遣！' },
  'ルイ9世': { image: 'louis9-saint', bubble: 'フランス聖王！ルブルックをモンゴル宮廷へ派遣' },
  'ルブルック': { image: 'rubruck-friar', bubble: 'カラコルムを訪れモンケ＝ハンに謁見した修道士' },
  'ヴォルテール': { image: 'voltaire-philosopher', bubble: '啓蒙思想家、中国の道徳・合理主義的統治を称賛！' },
  'モンテスキュー': { image: 'montesquieu-philosopher', bubble: '『法の精神』で三権分立と中国専制政治を論評' },

  // その他
  '趙佗': { image: 'zhaotuo-king', bubble: '南越国を建国した秦の武将' },
  '衛満': { image: 'weiman-king', bubble: '衛氏朝鮮を建国' },
  '公孫氏': { image: 'caocao-warlord', bubble: '遼東を支配した豪族' },
};

export const buildingInfo = {
  '紫禁城': { image: 'forbidden-city', size: 54, bubble: '明・清の皇帝が君臨した世界最大の宮殿群！' },
  '円明園': { image: 'yuanmingyuan-palace', size: 50, bubble: 'カスティリオーネらが設計したバロック様式の離宮！' },
  '東林書院': { image: 'donglin-academy', size: 48, bubble: '顧憲成らが再興し正義を論じた江南の学問所！' },
  'アンコール＝ワット': { image: 'angkor-wat', size: 52, bubble: 'スールヤヴァルマン2世が建立したヒンドゥー教大寺院！' },
  'アンコール＝トム': { image: 'angkor-thom', size: 50, bubble: '微笑む観音菩薩の巨顔塔がそびえる王都バイヨン！' },
  'ボロブドゥール': { image: 'borobudur-temple', size: 52, bubble: 'シャイレーンドラ朝が築いた世界最大級の仏教石造遺跡！' },
  'プランバナン寺院群': { image: 'prambanan-temple', size: 50, bubble: 'シヴァ神を祀る尖塔群が天を突く古マタラムのヒンドゥー寺院！' },
  '万里の長城': { image: 'great-wall-china', size: 52, bubble: '北方騎馬民族の侵入を防ぐため修築された長大な城壁！' },
};

export function resolvePerson(name, text, volumeId) {
  if (name === '太祖') {
    if (/洪武帝|朱元璋/.test(text) || volumeId.startsWith('c05-l18-p01')) return { image: 'hongwu-emperor', bubble: '明の太祖！皇帝独裁体制を確立！' };
    if (/耶律阿保機/.test(text) || volumeId.startsWith('c05-l16-p04')) return { image: 'yelu-abaoji', bubble: '契丹の太祖！草原を統一し大遼を建設！' };
    return { image: 'song-taizu', bubble: '宋の太祖！文治主義で武人の横暴を防ぐ！' };
  }
  if (name === '太宗') {
    if (/ホンタイジ/.test(text) || volumeId.startsWith('c05-l18-p04')) return { image: 'hong-taiji', bubble: '清の太宗！国号を大清と改称！' };
    if (/耶律堯骨/.test(text) || volumeId === 'c05-l16-p04-001') return { image: 'yelu-deguang', bubble: '遼の太宗！燕雲十六州を獲得！' };
    if (/阿骨打/.test(text) || volumeId === 'c05-l16-p04-005') return { image: 'jin-taizong', bubble: '金の太宗！北宋を滅ぼし紹興の和議を結ぶ！' };
    return { image: 'song-taizong', bubble: '宋の太宗！中国統一を完成！' };
  }
  if (name === '世宗') {
    if (/雍正帝/.test(text) || volumeId.startsWith('c05-l18-p04')) return { image: 'yongzheng-emperor', bubble: '清の世宗！軍機処を置き独裁を固める！' };
    return { image: 'taizong-liximin', bubble: '後周の世宗！五代随一の名君として統一を進める！' };
  }
  if (name === '高宗') {
    if (/乾隆帝/.test(text) || volumeId.startsWith('c05-l18-p04')) return { image: 'qianlong-emperor', bubble: '清の高宗！十全武功で最大版図を実現！' };
    return { image: 'song-gaozong', bubble: '南宋の高宗！臨安に都を再興！' };
  }
  return personInfo[name] || { image: 'chinese-official', bubble: name };
}

export const customSceneRules = {
  'c05-l16-p02-007': {
    // 澶淵の盟
    actors: [
      { name: '真宗', at: [114.3, 34.8], action: 'face_north' },
      { name: '聖宗', at: [118.85, 43.98], action: 'face_south' }
    ],
    afterImage: '澶淵の盟（銀・絹の贈与による和平）',
    duration: 3200
  },
  'c05-l16-p03-002': {
    // 靖康の変
    actors: [
      { name: '徽宗', at: [114.3, 34.8] },
      { name: '欽宗', at: [114.3, 34.8] }
    ],
    afterImage: '靖康の変（北宋の滅亡と二帝北去）',
    duration: 3200
  },
  'c05-l16-p03-003': {
    // 紹興の和議
    actors: [
      { name: '岳飛', at: [120.15, 30.25] },
      { name: '秦檜', at: [120.15, 30.25] },
      { name: '趙構', at: [120.15, 30.25] }
    ],
    afterImage: '紹興の和議（淮河を境とする南北対峙）',
    duration: 3400
  },
  'c05-l17-p01-002': {
    // チンギス＝ハン即位
    actors: [
      { name: 'チンギス＝ハン', at: [103.0, 47.0] }
    ],
    afterImage: '大モンゴル国（千戸制と遊牧軍団）',
    duration: 3000
  },
  'c05-l17-p01-005': {
    // バトゥの西征
    actors: [
      { name: 'バトゥ', at: [46.0, 47.0] }
    ],
    afterImage: 'バトゥの西征（ワールシュタットの戦い）',
    duration: 3200
  },
  'c05-l17-p01-007': {
    // カイドゥの乱
    actors: [
      { name: 'クビライ', at: [116.4, 39.9] },
      { name: 'カイドゥ', at: [85.0, 44.0] }
    ],
    afterImage: 'カイドゥの乱（大ハーン vs 遊牧諸王）',
    duration: 3200
  },
  'c05-l17-p02-001': {
    // 崖山の戦い（南宋滅亡）
    actors: [
      { name: 'クビライ', at: [116.4, 39.9] }
    ],
    afterImage: '崖山の戦い（南宋滅亡・元による中国再統一）',
    duration: 3200
  },
  'c05-l17-p02-002': {
    // 元寇
    actors: [
      { name: 'クビライ', at: [116.4, 39.9] },
      { name: '北条時宗', at: [139.6, 35.3] }
    ],
    afterImage: '元寇（文永・弘安の役）',
    duration: 3200
  },
  'c05-l17-p04-002': {
    // 紅巾の乱
    actors: [
      { name: '朱元璋', at: [118.8, 32.0] },
      { name: '韓山童', at: [117.0, 33.0] }
    ],
    afterImage: '紅巾の乱（朱元璋の蜂起）',
    duration: 3200
  },
  'c05-l18-p01-003': {
    // 靖難の役
    actors: [
      { name: '朱棣', at: [116.4, 39.9] },
      { name: '建文帝', at: [118.8, 32.0] }
    ],
    afterImage: '靖難の役（燕王の南進と永楽帝即位）',
    duration: 3400
  },
  'c05-l18-p02-003': {
    // 鄭和の遠征
    actors: [
      { name: '鄭和', at: [118.8, 32.0] },
      { name: '永楽帝', at: [116.4, 39.9] }
    ],
    afterImage: '鄭和の大航海（南海諸国への威風）',
    duration: 3400
  },
  'c05-l18-p02-007': {
    // 北虜南倭・土木の変
    actors: [
      { name: 'エセン＝ハン', at: [91.0, 46.0] },
      { name: '正統帝', at: [116.4, 39.9] }
    ],
    afterImage: '土木の変（正統帝の捕縛）',
    duration: 3200
  },
  'c05-l18-p03-003': {
    // 文禄・慶長の役
    actors: [
      { name: '豊臣秀吉', at: [135.5, 34.7] },
      { name: '李舜臣', at: [127.7, 34.7] }
    ],
    afterImage: '閑山島・鳴梁海戦（李舜臣の亀甲船）',
    duration: 3400
  },
  'c05-l18-p04-003': {
    // 李自成の乱
    actors: [
      { name: '李自成', at: [108.94, 34.27] },
      { name: '崇禎帝', at: [116.4, 39.9] }
    ],
    afterImage: '北京陥落と明の滅亡',
    duration: 3200
  },
  'c05-l18-p04-004': {
    // 呉三桂の投降
    actors: [
      { name: '呉三桂', at: [102.0, 25.0] },
      { name: '李自成', at: [108.94, 34.27] }
    ],
    afterImage: '山海関開門（清軍の中国本土侵入）',
    duration: 3200
  },
  'c05-l18-p04-005': {
    // 鄭氏台湾
    actors: [
      { name: '鄭成功', at: [120.2, 23.0] }
    ],
    afterImage: 'ゼーランディア城包囲と反清復明',
    duration: 3200
  },
  'c05-l18-p04-007': {
    // ネルチンスク条約
    actors: [
      { name: '康熙帝', at: [116.4, 39.9] },
      { name: 'ピョートル1世', at: [30.3, 59.9] }
    ],
    afterImage: 'ネルチンスク条約（スタノヴォイ山脈を境界に画定）',
    duration: 3200
  },
  'c05-l18-p04-008': {
    // ジュンガル親征
    actors: [
      { name: '康熙帝', at: [116.4, 39.9] },
      { name: 'ガルダン＝ハン', at: [91.0, 44.0] }
    ],
    afterImage: 'ジュンガル親征（昭莫多の戦い）',
    duration: 3200
  },
  'c05-l19-p03-003': {
    // マジャパヒト王国
    actors: [
      { name: 'クビライ', at: [116.4, 39.9] },
      { name: 'ウィジャヤ', at: [112.38, -7.55] }
    ],
    afterImage: '元軍撃退とマジャパヒト王国建国',
    duration: 3200
  }
};

const edition={},places={};
for(const volume of chapterSeries){
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)){
    const body=page.passages.map(p=>decorate(byId.get(p.paragraph),p.start,p.end));
    const plainBody=page.passages.map(p=>byId.get(p.paragraph).text.slice(p.start,p.end));
    const text=plainBody.join('');
    const names=chapterNamesInText(page.title+'。'+text);
    const pins=[],tags=[],props=[];

    for(const e of names){
      if(e.kind==='place'){
        places[e.name]={name:e.name,point:e.points[0]};
        pins.push(e.name);
      } else if(e.kind==='person'){
        const pInf = resolvePerson(e.name, text, volume.id);
        props.push({
          name: e.name,
          at: e.points[0],
          image: 'ancient/' + pInf.image + '.png',
          bubble: pInf.bubble,
          kind: 'prop',
          size: 42
        });
      } else if(e.kind==='building'){
        const bInf = buildingInfo[e.name] || { image: 'great-wall-china', size: 50, bubble: e.name };
        props.push({
          name: e.name,
          at: e.points[0],
          image: 'ancient/' + bInf.image + '.png',
          bubble: bInf.bubble,
          kind: 'prop',
          size: bInf.size || 50
        });
      } else {
        tags.push({text:e.name,at:e.points[0]});
      }
    }

    const activeRoutes=routes.filter(r=>page.passages.some(p=>p.paragraph===r.paragraph)).map(({kind,points})=>({kind,points,start:0.08,end:0.95}));
    const pts=[...names.flatMap(e=>e.points),...activeRoutes.flatMap(r=>r.points)];
    const frame=pts.length?[Math.min(...pts.map(p=>p[0]))-5,Math.min(...pts.map(p=>p[1]))-5,Math.max(...pts.map(p=>p[0]))+5,Math.max(...pts.map(p=>p[1]))+5]:[90,16,130,48];
    const id=volume.id+'-'+String(edition[volume.id].length+1).padStart(3,'0');
    const title=page.title;
    const rule=customSceneRules[id];

    // Format actors with correct images if custom rule exists
    let sceneActors = [];
    if (rule && rule.actors) {
      sceneActors = rule.actors.map(act => {
        const pInf = resolvePerson(act.name, text, volume.id);
        return {
          name: act.name,
          at: act.at,
          image: 'ancient/' + (act.image || pInf.image) + '.png',
          bubble: act.bubble || pInf.bubble || act.name,
          action: act.action || 'battle'
        };
      });
    }

    const sceneDuration = rule?.duration || (activeRoutes.length ? 2200 : (sceneActors.length ? 3000 : 0));
    const afterImage = rule?.afterImage || title;

    edition[volume.id].push({
      id,
      title,
      body,
      plainBody,
      year:volume.period,
      chapter:0,
      kicker:volume.label,
      sourceText:{chapter,passages:page.passages,page:byId.get(page.passages[0].paragraph).page},
      frame,
      pins,
      tags,
      zones:[],
      actors: sceneActors,
      props,
      routes:activeRoutes,
      rivers:chapterRivers.filter(r=>text.includes(r.name)),
      duration: sceneDuration,
      facts:[title],
      mapHeading:title,
      focus:title,
      before:title,
      after: afterImage,
      note:'',
      takeaway:''
    });
  }
}

const output='// 章専用の原文対応・明示的構成表から生成。共通ファイルは更新しない。\nexport const chapterEdition = '+JSON.stringify(edition,null,2)+';\nexport const chapterPlaces = '+JSON.stringify(places,null,2)+';\n';
const target='public/chapter-05-edition.js';
if(process.argv.includes('--check'))assert.equal((await read(target)).replaceAll('\r\n','\n'),output);
else await fs.writeFile(new URL(target,root),output);
console.log('第'+chapter+'章 '+chapterSeries.length+'節 '+Object.values(edition).flat().length+'ページの生成・照合完了');
