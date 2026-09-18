import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries} from '../public/chapter-03-volumes.js';
import {chapterNamesInText,chapterRivers} from '../public/chapter-03-geography.js';
import {normalizeMapName} from '../public/map-name-coverage.js';

const chapter=3;
const root=new URL('../',import.meta.url);
const read=p=>fs.readFile(new URL(p,root),'utf8');
const {paragraphs}=JSON.parse(await read('docs/chapter-03/source-selection.json'));
const readingPlan=JSON.parse(await read('docs/chapter-03/reading-plan.json'));
const routes=JSON.parse(await read('docs/chapter-03/routes.json'));
const byId=new Map(paragraphs.map(p=>[p.id,p]));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function spans(markdown){let pos=0,start=null;const result=[];for(let i=0;i<markdown.length;){if(markdown.slice(i,i+2)==='**'){if(start===null)start=pos;else{result.push([start,pos]);start=null;}i+=2;}else{i++;pos++;}}assert.equal(start,null,'太字の閉じ忘れ');return result;}
function decorate(p,start,end){const bold=spans(p.markdown);const bounds=[...new Set([start,end,...bold.flat().filter(x=>x>start&&x<end)])].sort((a,b)=>a-b);return bounds.slice(0,-1).map((a,i)=>{const b=bounds[i+1],t=escape(p.text.slice(a,b));return bold.some(([x,y])=>a>=x&&b<=y)?'<span class="source-bold">'+t+'</span>':t;}).join('');}

assert.deepEqual([...new Set(readingPlan.map(p=>p.volume))],chapterSeries.map(v=>v.id));
let index=0,offset=0;
for(const page of readingPlan)for(const pass of page.passages){const p=paragraphs[index];assert.ok(p);assert.equal(pass.paragraph,p.id);assert.equal(page.volume,p.volume);assert.equal(pass.start,offset);assert.ok(pass.end>offset&&pass.end<=p.text.length);offset=pass.end;if(offset===p.text.length){index++;offset=0;}}
assert.equal(index,paragraphs.length);assert.equal(offset,0);

export const personInfo = {
  // 考古学・文明
  'アンダーソン': { image: 'roman-scholar', bubble: '仰韶文化の彩文土器を発見！' },
  '王国維': { image: 'dongzhongshu-scholar', bubble: '甲骨文字を解読し殷の実在を証明！' },

  // 殷・周
  '湯王': { image: 'king-tang-shang', bubble: '殷（商）を建国！' },
  '紂王': { image: 'king-zhou-shang', bubble: '酒池肉林の暴政' },
  '武王': { image: 'king-wu-zhou', bubble: '牧野の戦いで殷を討ち周を建国！' },
  '周公旦': { image: 'duke-of-zhou', bubble: '封建制と礼楽の基礎を整備' },
  '幽王': { image: 'king-you-zhou', bubble: '褒姒に溺れ西周滅亡' },

  // 春秋五覇
  '桓公': { image: 'duke-huan-qi', bubble: '尊王攘夷！最初の覇者' },
  '晋の文公': { image: 'duke-wen-jin', bubble: '城濮の戦いで楚を破り覇者となる！' },
  '荘王': { image: 'king-zhuang-chu', bubble: '問鼎軽重！中原に覇を唱える' },
  '闔閭': { image: 'king-helu-wu', bubble: '伍子胥・孫武を用い強盛となる' },
  '夫差': { image: 'king-helu-wu', bubble: '臥薪嘗胆、越を破るも後に敗死' },
  '勾践': { image: 'king-goujian-yue', bubble: '会稽の恥を雪ぎ呉を滅ぼす！' },

  // 諸子百家
  '孔子': { image: 'confucius-philosopher', bubble: '仁と礼による徳治政治を説く' },
  '孟子': { image: 'mencius-philosopher', bubble: '性善説と王道政治を主張！' },
  '荀子': { image: 'xunzi-philosopher', bubble: '性悪説を説き礼による矯正を重視' },
  '墨子': { image: 'mozi-philosopher', bubble: '兼愛・非攻と節倹を唱える！' },
  '老子': { image: 'laozi-philosopher', bubble: '無為自然と小国寡民' },
  '荘子': { image: 'zhuangzi-philosopher', bubble: '万物斉同・胡蝶の夢' },
  '商鞅': { image: 'shangyang-reformer', bubble: '変法を実施し秦を強国へ！' },
  '韓非': { image: 'hanfeizi-philosopher', bubble: '法と術による信賞必罰の統治！' },
  '李斯': { image: 'lisi-chancellor', bubble: '法家思想で郡県制と文字統一を推進！' },
  '孫子': { image: 'sunzi-strategist', bubble: '敵を知り己を知れば百戦危うからず' },
  '呉子': { image: 'wuzi-strategist', bubble: '内を修め外を治める兵法' },
  '蘇秦': { image: 'suqin-diplomat', bubble: '六国合従策で秦に対抗！' },
  '張儀': { image: 'zhangyi-diplomat', bubble: '連衡策で六国を各個撃破！' },
  '鄒衍': { image: 'zouyan-philosopher', bubble: '陰陽五行説を提唱' },
  '公孫竜': { image: 'gongsunlong-logician', bubble: '白馬非馬の論を展開' },
  '許行': { image: 'xuxing-agriculturist', bubble: '君民並耕の農家思想' },

  // 秦・楚漢戦争
  '孝公': { image: 'duke-xiao-qin', bubble: '商鞅を登用し秦の富国強兵を断行' },
  '始皇帝': { image: 'shihuangdi-emperor', bubble: '天下を統一し最初の「皇帝」となる！' },
  '蒙恬': { image: 'mengtian-general', bubble: '匈奴を撃退し万里の長城を修築！' },
  '胡亥': { image: 'huhai-emperor', bubble: '二世皇帝として即位' },
  '陳勝': { image: 'chensheng-rebel', bubble: '王侯将相いずくんぞ種あらんや！' },
  '呉広': { image: 'wuguang-rebel', bubble: '大沢郷で陳勝とともに蜂起！' },
  '項羽': { image: 'xiangyu-overlord', bubble: '力抜山兮気蓋世！西楚の覇王' },
  '劉邦': { image: 'liubang-emperor', bubble: '漢を建国！大風起きて雲飛揚す' },
  '高祖': { image: 'liubang-emperor', bubble: '郡国制を敷き天下を平定！' },
  '呂后': { image: 'empress-lu', bubble: '劉氏一族を抑え政権を掌握' },
  '冒頓単于': { image: 'modu-chanyu', bubble: '草原を統一し漢軍を白登山に包囲！' },

  // 前漢
  '景帝': { image: 'emperor-jing-han', bubble: '呉楚七国の乱を鎮圧し中央集権化！' },
  '武帝': { image: 'wudi-emperor', bubble: '前漢の全盛期！塩鉄専売と積極的外征' },
  '董仲舒': { image: 'dongzhongshu-scholar', bubble: '儒教を官学として国教化することを提案！' },
  '司馬遷': { image: 'szumaqian-historian', bubble: '『史記』紀伝体を編纂！' },
  '張騫': { image: 'zhangqian-explorer', bubble: '大月氏へ使節として西域を開拓！' },
  '衛青': { image: 'weiging-general', bubble: '大将軍として匈奴を北方に追撃！' },
  '霍去病': { image: 'huoqubing-general', bubble: '若き名将、河西回廊を制圧！' },
  '李広利': { image: 'liguangli-general', bubble: '大宛（フェルガナ）に遠征し汗血馬を獲得！' },
  '桑弘羊': { image: 'sanghongyang-official', bubble: '均輸法・平準法・専売制を推進！' },
  '趙佗': { image: 'zhaotuo-king', bubble: '南越国を建国' },
  '衛満': { image: 'weiman-king', bubble: '衛氏朝鮮を建国' },
  '哀帝': { image: 'emperor-ai-han', bubble: '限田策を試みるも挫折' },

  // 新・後漢
  '王莽': { image: 'wangmang-usurper', bubble: '新を建て周代の礼制を復古！' },
  '光武帝': { image: 'guangwudi-emperor', bubble: '後漢を創建！洛陽を都とし漢を中興' },
  '劉秀': { image: 'guangwudi-emperor', bubble: '豪族の支持を得て赤眉の乱を収拾！' },
  '班超': { image: 'banchao-protector', bubble: '西域都護として50余国を服属させる！' },
  '甘英': { image: 'ganying-envoy', bubble: '大秦国（ローマ）を目指し条支国へ！' },
  '許慎': { image: 'xushen-scholar', bubble: '『説文解字』で漢字を体系化' },
  '鄭玄': { image: 'zhengxuan-scholar', bubble: '今文学と古文学を統合し訓詁学を大成！' },
  '張角': { image: 'zhangjiao-taiping', bubble: '蒼天已死黄天当立！太平道を率い蜂起' },
  '張陵': { image: 'zhangling-daoist', bubble: '五斗米道（天師道）を創始' },

  // 三国時代
  '曹操': { image: 'caocao-warlord', bubble: '唯才是挙！屯田制で中原を統一' },
  '孫堅': { image: 'sunjian-warlord', bubble: '江東の虎として挙兵' },
  '献帝': { image: 'emperor-xian-han', bubble: '後漢最後の皇帝' },
  '孫権': { image: 'sunquan-warlord', bubble: '赤壁の戦いで曹操を破り呉を建国！' },
  '劉備': { image: 'liubei-warlord', bubble: '三顧の礼で諸葛亮を迎え蜀を建国！' },
  '諸葛亮': { image: 'zhugeliang-strategist', bubble: '天下三分の計！出師表を掲げ北伐' },
  '関羽': { image: 'guanyu-general', bubble: '義勇の武将、荊州を守る' },
  '張飛': { image: 'zhangfei-general', bubble: '長坂橋で曹操軍を一喝！' },
  '曹丕': { image: 'caopi-emperor', bubble: '九品官人法を制定し魏を建国（文帝）！' },
  '文帝': { image: 'caopi-emperor', bubble: '禅譲を受け魏の初代皇帝となる' },
  '公孫氏': { image: 'sunjian-warlord', bubble: '遼東に拠点を置く豪族' },

  // 西晋・五胡十六国・東晋
  '司馬懿': { image: 'simayi-strategist', bubble: '魏の政権を握り晋の基礎を築く' },
  '司馬昭': { image: 'simazhao-general', bubble: '蜀を滅ぼす' },
  '司馬炎': { image: 'sima-yan-emperor', bubble: '三国を統一し西晋を建国（武帝）！' },
  '恵帝': { image: 'emperor-hui-jin', bubble: '八王の乱で西晋が大混乱' },
  '劉淵': { image: 'liuyuan-xiongnu', bubble: '南匈奴を率い前趙を建国！永嘉の乱' },
  '司馬睿': { image: 'simarui-emperor', bubble: '江南の建康に逃れ東晋を建国！' },
  '苻健': { image: 'fujian-ruler', bubble: '氐族を率いて前秦を建国' },
  '苻堅': { image: 'fujian-ruler', bubble: '華北を統一し淝水の戦いで南下！' },

  // 北朝・南北朝・仏教道教
  '拓跋珪': { image: 'tuobagui-emperor', bubble: '鮮卑拓跋部を率いて北魏を建国（道武帝）' },
  '道武帝': { image: 'tuobagui-emperor', bubble: '平城を都とし北魏の基盤を確立' },
  '太武帝': { image: 'taiwudi-emperor', bubble: '華北を統一！寇謙之の道教を国教化し廃仏' },
  '寇謙之': { image: 'kouqianzhi-daoist', bubble: '新天師道を大成し太武帝を補佐' },
  '仏図澄': { image: 'fotudeng-monk', bubble: '西域から後趙に来朝し仏教を布教' },
  'ブドチンガ': { image: 'fotudeng-monk', bubble: '後趙の王に重用された高僧' },
  '鳩摩羅什': { image: 'kumarajiva-monk', bubble: '長安で数多くの仏典を漢訳！' },
  'クマラジーヴァ': { image: 'kumarajiva-monk', bubble: '大乗仏教の経典を美しく漢訳' },
  '道安': { image: 'daoan-monk', bubble: '仏典目録を作り釈姓を提唱' },
  '慧遠': { image: 'huiyuan-monk', bubble: '白蓮社を結び浄土信仰を提唱' },
  '法顕': { image: 'faxian-monk', bubble: 'グプタ朝インドへ往還し『仏国記』を著す！' },
  '孝文帝': { image: 'xiaowendi-emperor', bubble: '洛陽遷都・均田制・漢化政策を断行！' },
  '高歓': { image: 'gaohuan-warlord', bubble: '東魏の実権を掌握' },
  '孝静帝': { image: 'xiaojingdi-emperor', bubble: '東魏の皇帝' },
  '宇文泰': { image: 'yuwentai-warlord', bubble: '西魏を動かし府兵制を創始' },

  // 隋
  '楊堅': { image: 'yangjian-emperor', bubble: '南北朝を統一し隋を建国（文帝）！科挙創始' },
  '煬帝': { image: 'yangdi-emperor', bubble: '大運河を完成させ高句麗遠征を強行！' },

  // 唐初期〜東アジア世界
  '李淵': { image: 'liyuan-emperor', bubble: '長安に入り唐を建国（高祖）！' },
  '李世民': { image: 'taizong-liximin', bubble: '貞観の治！東突厥を破り天可汗と称される' },
  '太宗': { image: 'taizong-liximin', bubble: '律令制を整備し唐の最盛期の礎を築く！' },
  '孔穎達': { image: 'kongyingda-scholar', bubble: '『五経正義』を編纂し科挙の基準を確立' },
  '高宗': { image: 'gaozong-emperor', bubble: '百済・高句麗を滅ぼし唐の最大領域を実現！' },
  'ソンツェン＝ガンポ': { image: 'songtsen-gampo', bubble: '吐蕃を統一しラサに都を置く！' },
  '文成公主': { image: 'wenchang-princess', bubble: '吐蕃のソンツェン＝ガンポに降嫁し仏教を伝える' },
  '大祚栄': { image: 'dazuorong-bohai', bubble: '靺鞨族と高句麗遺民を率いて渤海を建国！' },
  '聖徳太子': { image: 'shotoku-taishi', bubble: '遣隋使を派遣し律令国家を目指す' },
  '小野妹子': { image: 'onono-imoko', bubble: '「日出づる処の天子」の国書を隋に届ける' },
  '阿倍仲麻呂': { image: 'abeno-nakamaro', bubble: '遣唐使として渡り唐の朝廷で高官に就く' },

  // 仏教・思想
  '玄奘': { image: 'xuanzang-monk', bubble: '陸路インドへ旅立ち『大唐西域記』を著す！' },
  '義浄': { image: 'faxian-monk', bubble: '海路インドへ赴き『南海寄帰内法伝』を著す！' },
  '智顗': { image: 'fotudeng-monk', bubble: '天台宗を開く' },
  '最澄': { image: 'buddhist-monk', bubble: '唐に渡り天台宗を日本に伝える' },
  'ハルシャ＝ヴァルダナ': { image: 'harsha-king', bubble: 'ヴァルダナ朝の王、玄奘を厚遇' },

  // 武韋の禍〜玄宗
  '則天武后': { image: 'wuzetien-empress', bubble: '国号を周に改め中国唯一の女帝となる！' },
  '武則天': { image: 'wuzetien-empress', bubble: '科挙官僚を登用し貴族勢力を抑制' },
  '中宗': { image: 'zhongzong-emperor', bubble: '唐を復興するも韋后に毒殺される' },
  '睿宗': { image: 'ruizong-emperor', bubble: '玄宗の父、帝位を譲る' },
  '韋后': { image: 'empress-wei', bubble: '第二の武則天を目指すも李隆基に討たれる' },
  '玄宗': { image: 'xuanzong-emperor', bubble: '開元の治！募兵制・節度使を設置' },
  '李隆基': { image: 'xuanzong-emperor', bubble: '楊貴妃を寵愛し政治を乱す' },
  '楊貴妃': { image: 'yangguifei-consort', bubble: '玄宗の寵愛を一身に受ける' },
  '楊国忠': { image: 'chinese-official', bubble: '楊貴妃の従兄として宰相となり専権を振るう' },
  '安禄山': { image: 'anlushan-rebel', bubble: '三節度使を兼ね安史の乱を起こす！' },
  '史思明': { image: 'nomadic-rider', bubble: '安禄山とともに乱を継続' },
  '安慶緒': { image: 'chinese-soldier', bubble: '安禄山の子' },
  '白居易': { image: 'ancient-scribe', bubble: '『長恨歌』で玄宗と楊貴妃の悲劇を詠む' },
  '白楽天': { image: 'ancient-scribe', bubble: '平易な表現で社会詩を数多く詠む' },

  // 唐末・五代
  '徳宗': { image: 'taizong-liximin', bubble: '両税法を施行' },
  '楊炎': { image: 'chinese-official', bubble: '夏秋二回課税する両税法を建策！' },
  '武宗': { image: 'yangdi-emperor', bubble: '会昌の廃仏を断行' },
  '黄巣': { image: 'huangchao-rebel', bubble: '塩の密売から大反乱を起こし長安を占領！' },
  '王仙芝': { image: 'chensheng-rebel', bubble: '黄巣とともに反乱の口火を切る' },
  '朱全忠': { image: 'zhuhuanchong-warlord', bubble: '黄巣を裏切り唐を滅ぼして後梁を建国！' },
  '朱温': { image: 'zhuhuanchong-warlord', bubble: '宣武節度使として開封を拠点に自立' },
  '全忠': { image: 'zhuhuanchong-warlord', bubble: '哀帝を廃して五代十国時代の幕を開ける' },
  'アレクサンドロス': { image: 'alexander-conqueror', bubble: '大宛の起源に関わるギリシア大王' }
};

export const propInfo = {
  '万里の長城': { image: 'great-wall-china', size: 48 },
  '阿房宮': { image: 'epang-palace', size: 48 },
  '驪山陵': { image: 'terracotta-army', size: 44 },
  '驪山': { image: 'terracotta-army', size: 44 },
  '兵馬俑': { image: 'terracotta-army', size: 44 },
  '雲岡': { image: 'yungang-grottoes', size: 46 },
  '竜門': { image: 'yungang-grottoes', size: 46 },
  '大雲寺': { image: 'dayun-temple', size: 44 },
  '大秦寺': { image: 'daqin-nestorian-stele', size: 44 },
  '大秦景教流行中国碑': { image: 'daqin-nestorian-stele', size: 44 },
  '仏国寺': { image: 'bulguksa-temple', size: 44 },
  '石窟庵': { image: 'bulguksa-temple', size: 44 },
  'ナーランダー僧院': { image: 'nalanda-monastery', size: 46 },
  '紫禁城': { image: 'epang-palace', size: 48 },
  '円明園': { image: 'epang-palace', size: 48 }
};

// 主要な戦い・対決・行軍演出ルール
export const customSceneRules = {
  // 牧野の戦い（殷周革命）：武王 vs 紂王
  'c03-l08-p02-003': {
    targetActor: { name: '紂王', at: [114.32, 36.1], image: 'king-zhou-shang', bubble: '牧野で周軍に敗北し自害！', afterImage: 'chinese-defeated' }
  },
  // 垓下の戦い（楚漢戦争）：項羽 vs 劉邦
  'c03-l08-p05-007': {
    targetActor: { name: '項羽', at: [117.6, 33.2], image: 'xiangyu-overlord', bubble: '四面楚歌……烏江で自刃', afterImage: 'chinese-defeated' }
  },
  // 白登山の戦い：劉邦 vs 冒頓単于
  'c03-l09-p01-002': {
    targetActor: { name: '冒頓単于', at: [113.4, 40.15], image: 'modu-chanyu', bubble: '漢の高祖を白登山に7日間包囲！' }
  },
  // 赤壁の戦い：曹操 vs 孫権・諸葛亮
  'c03-l09-p03-002': {
    targetActor: { name: '曹操', at: [114.13, 29.86], image: 'caocao-warlord', bubble: '水軍が全滅……北へ撤退！', afterImage: 'chinese-retreat' }
  },
  // 淝水の戦い：苻堅 vs 東晋
  'c03-l09-p04-004': {
    targetActor: { name: '苻堅', at: [116.6, 32.6], image: 'fujian-ruler', bubble: '草木皆兵……大敗し撤退', afterImage: 'chinese-retreat' }
  },
  // 安史の乱：玄宗 vs 安禄山
  'c03-l10-p04-007': {
    targetActor: { name: '安禄山', at: [116.4, 39.9], image: 'anlushan-rebel', bubble: '大燕皇帝を自称し長安へ進軍！' }
  },
  // 黄巣の乱
  'c03-l10-p05-005': {
    targetActor: { name: '黄巣', at: [108.94, 34.27], image: 'huangchao-rebel', bubble: '長安を占領し大斉皇帝と号す！' }
  }
};

const ensurePng = name => {
  const p = name.includes('/') ? name : `ancient/${name}`;
  return p.endsWith('.png') ? p : `${p}.png`;
};

const edition={},places={};
for(const volume of chapterSeries){
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)){
    const body=page.passages.map(p=>decorate(byId.get(p.paragraph),p.start,p.end));
    const plainBody=page.passages.map(p=>byId.get(p.paragraph).text.slice(p.start,p.end));
    const text=plainBody.join('');
    const fullText = page.title + '。' + text;
    const names=chapterNamesInText(fullText);
    const pins=[],tags=[],props=[];
    const actors=[];

    const id=volume.id+'-'+String(edition[volume.id].length+1).padStart(3,'0');
    const rule = customSceneRules[id] || {};

    for(const entry of names){
      if(entry.kind==='place'){
        places[entry.name]={name:entry.name,point:entry.points[0]};
        pins.push(entry.name);
      } else if(entry.kind==='person'){
        const p = personInfo[entry.name];
        const defaultImage = /儒|思想|孔子|孟子|道|老子/.test(fullText) ? 'confucius-philosopher'
          : /秦|始皇帝/.test(fullText) ? 'shihuangdi-emperor'
          : /漢|武帝|高祖/.test(fullText) ? 'liubang-emperor'
          : /唐|太宗|李世民/.test(fullText) ? 'taizong-liximin'
          : 'chinese-official';
        const actor = {
          name: entry.name,
          at: entry.points[0],
          image: ensurePng(p?.image ?? defaultImage),
          bubble: p?.bubble ?? ''
        };
        if(p?.offset) actor.offset = p.offset;
        if(p?.afterImage) actor.afterImage = ensurePng(p.afterImage);
        actors.push(actor);
      } else if(entry.kind==='building'){
        const b = propInfo[entry.name];
        if(b){
          props.push({name:entry.name,at:entry.points[0],image:ensurePng(b.image),kind:'prop',size:b.size});
        } else {
          const symbol=/長城/.test(entry.name)?'great-wall-china':/寺|院|仏|塔/.test(entry.name)?'dayun-temple':'epang-palace';
          props.push({name:entry.name,at:entry.points[0],image:ensurePng(symbol),kind:'prop',size:44});
        }
      } else {
        tags.push({text:entry.name,at:entry.points[0]});
      }
    }

    const activeRoutes=routes.filter(r=>page.passages.some(p=>p.paragraph===r.paragraph)).map(({kind,points})=>({kind,points,start:0.08,end:0.95}));

    // ルート連動アクター
    if (activeRoutes.length > 0) {
      if (rule.routeActor) {
        const ra = { ...rule.routeActor, image: ensurePng(rule.routeActor.image) };
        if (ra.afterImage) ra.afterImage = ensurePng(ra.afterImage);
        const idx = actors.findIndex(a => normalizeMapName(a.name) === normalizeMapName(ra.name));
        if (idx >= 0) {
          actors[idx] = { ...actors[idx], ...ra };
        } else if (normalizeMapName(fullText).includes(normalizeMapName(ra.name))) {
          actors.push({ at: activeRoutes[ra.route]?.points[0] ?? [0,0], ...ra });
        }
      } else if (actors.length > 0 && actors[0].route === undefined) {
        actors[0].route = 0;
      }
    } else {
      for (const a of actors) delete a.route;
    }

    // 迎撃アクター
    if (rule.targetActor && normalizeMapName(fullText).includes(normalizeMapName(rule.targetActor.name))) {
      const ta = { ...rule.targetActor, image: ensurePng(rule.targetActor.image) };
      if (ta.afterImage) ta.afterImage = ensurePng(ta.afterImage);
      actors.push(ta);
    }

    // もし人物が1人もいないページなら、本文中に実在する地域名から象徴アクターを安全に配置
    if (actors.length === 0) {
      const candidate = names.find(n => n.kind === 'region' || n.kind === 'place');
      if (candidate) {
        const cName = candidate.name;
        const defaultImage = /殷|商/.test(cName) ? 'king-tang-shang'
          : /周/.test(cName) ? 'king-wu-zhou'
          : /秦/.test(cName) ? 'shihuangdi-emperor'
          : /漢/.test(cName) ? 'liubang-emperor'
          : /唐/.test(cName) ? 'taizong-liximin'
          : /吐蕃|チベット/.test(cName) ? 'songtsen-gampo'
          : /新羅|百済|高句麗|朝鮮/.test(cName) ? 'dazuorong-bohai'
          : /日本|倭/.test(cName) ? 'shotoku-taishi'
          : 'chinese-official';
        actors.push({
          name: candidate.name,
          at: candidate.points[0],
          image: ensurePng(defaultImage),
          bubble: ''
        });
      }
    }

    // 重複位置アクターの微細オフセット調整
    const posCounts = {};
    for (const a of actors) {
      const k = `${a.at[0].toFixed(2)},${a.at[1].toFixed(2)}`;
      posCounts[k] = (posCounts[k] || 0) + 1;
      if (posCounts[k] > 1 && !a.offset) {
        const angle = ((posCounts[k] - 1) * Math.PI * 2) / 4;
        a.offset = [Math.cos(angle) * 1.5, Math.sin(angle) * 1.5];
      }
    }

    const pts=[...names.flatMap(e=>e.points),...activeRoutes.flatMap(r=>r.points)];
    const frame=pts.length?[Math.min(...pts.map(p=>p[0]))-5,Math.min(...pts.map(p=>p[1]))-5,Math.max(...pts.map(p=>p[0]))+5,Math.max(...pts.map(p=>p[1]))+5]:[90,16,130,48];
    const title=page.title;

    edition[volume.id].push({
      id,
      title,
      body,
      plainBody,
      year:volume.period,
      chapter:3,
      kicker:volume.label,
      sourceText:{chapter,passages:page.passages,page:byId.get(page.passages[0].paragraph).page},
      frame,
      pins,
      tags,
      zones:[],
      actors,
      props,
      routes:activeRoutes,
      rivers:chapterRivers.filter(r=>text.includes(r.name)),
      duration:activeRoutes.length?2200:0,
      facts:[title],
      mapHeading:title,
      focus:title,
      before:title,
      after:title,
      note:'',
      takeaway:''
    });
  }
}

const output='// 章専用の原文対応・明示的構成表から生成。共通ファイルは更新しない。\nexport const chapterEdition = '+JSON.stringify(edition,null,2)+';\nexport const chapterPlaces = '+JSON.stringify(places,null,2)+';\n';
const target='public/chapter-03-edition.js';
if(process.argv.includes('--check'))assert.equal((await read(target)).replaceAll('\r\n','\n'),output);
else await fs.writeFile(new URL(target,root),output);
console.log('第'+chapter+'章 '+chapterSeries.length+'節 '+Object.values(edition).flat().length+'ページの生成・照合完了');
