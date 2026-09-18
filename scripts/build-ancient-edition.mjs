import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {ancientSeries} from '../public/ancient-volumes.js';
import {ancientNamesInText,ancientRivers} from '../public/ancient-geography.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/ancient-orient/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/ancient-orient/reading-plan.json'));
const paragraphById = new Map(paragraphs.map(p=>[p.id,p]));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function boldSpans(markdown) {
  let plain='',start=null;const spans=[];
  for(let i=0;i<markdown.length;) {
    if(markdown.slice(i,i+2)==='**') {
      if(start===null)start=plain.length;else {spans.push([start,plain.length]);start=null;}
      i+=2;
    }else plain+=markdown[i++];
  }
  if(start!==null)throw Error('原文の太字記号が閉じていません');
  return spans;
}
function decorate(text,spans,start,end) {
  const bounds=[...new Set([start,end,...spans.flat().filter(i=>i>start&&i<end)])].sort((a,b)=>a-b);
  return bounds.slice(0,-1).map((a,i)=>{
    const b=bounds[i+1],value=escape(text.slice(a,b));
    return spans.some(([x,y])=>x<=a&&y>=b)?`<span class="source-bold">${value}</span>`:value;
  }).join('');
}
// 改ページは通読済みの構成表に従う。段落ごとの文字数では再分割しない。
assert.deepEqual([...new Set(readingPlan.map(p=>p.volume))],ancientSeries.map(v=>v.id));
let paragraphIndex=0,offset=0;
for(const page of readingPlan) {
  assert.ok(page.title&&page.passages.length);
  for(const passage of page.passages) {
    const p=paragraphs[paragraphIndex];
    assert.ok(p&&page.volume===p.volume&&passage.paragraph===p.id,'本文の掲載順');
    assert.ok(Number.isInteger(passage.start)&&Number.isInteger(passage.end));
    assert.equal(passage.start,offset,'本文の欠落・重複');
    assert.ok(passage.end>offset&&passage.end<=p.text.length);
    offset=passage.end;
    if(offset===p.text.length){paragraphIndex++;offset=0;}
  }
}
assert.equal(paragraphIndex,paragraphs.length,'本文の掲載漏れ');
assert.equal(offset,0);

// 原文の移動・征服・交易の記述に対応する概略経路。
// 一つの表示ページに両端の名前がある場合に限って描く。
const routes = [
  [1,173,'ヒッタイト','古バビロニア王国','campaign',[[34.62,40.02],[37,37],[40,35],[44.42,32.54]]],
  [1,209,'上エジプト','下エジプト','campaign',[[32.6,25.7],[31,28],[31,30.5]]],
  [1,273,'シリア','下エジプト','campaign',[[38,35],[35,31.5],[32.5,30.5],[31,30.5]]],
  [1,279,'トトメス3世','シリア','campaign',[[32.6,25.7],[31,30],[35,32],[38,35]]],
  [1,279,'トトメス3世','ヌビア','campaign',[[32.6,25.7],[31,22],[31,20]]],
  [1,325,'下エジプト','カデシュ','campaign',[[31,30.5],[35,32],[36.52,34.56]]],
  [1,325,'ヒッタイト','カデシュ','rival',[[34.62,40.02],[36,37],[36.52,34.56]]],
  [2,92,'ティルス','カルタゴ','trade',[[35.2,33.27],[31,34],[25,34.5],[18,34.5],[10.32,36.85]]],
  [2,113,'エジプト','パレスチナ','move',[[31,30],[33,29.5],[35,31.5]]],
  [2,127,'ユダ王国','バビロン','move',[[35.2,31.6],[37,34],[40,35],[44.42,32.54]]],
  [2,272,'メディア','リディア','campaign',[[48.5,35],[43,37],[37,39],[28,38.5]]],
  [2,297,'スサ','サルデス','trade',[[48.26,32.19],[43.2,36],[39,38],[35,39],[28.04,38.49]]],
  [2,362,'イッソス','アルベラ','campaign',[[36.2,36.84],[39,37],[43.73,36.36]]],
  [2,402,'ローマ','中国','trade',[[12.5,41.9],[29,40],[44,35],[58,37],[70,40],[88,42],[108,34]]],
  [2,433,'ササン朝','インダス','campaign',[[52,31],[60,30],[66,30],[70,29]]],
  [3,79,'カイバル峠','パンジャーブ','move',[[71.1,34.07],[72.3,33],[73.5,31]]],
  [3,91,'インダス','ガンジス','move',[[71,30],[75,29],[79,27],[82,25.5]]],
  [3,269,'マウリヤ朝','カリンガ','campaign',[[85.18,25.61],[85.5,23],[85,20]]],
  [3,285,'インド','スリランカ','move',[[82,18],[81,13],[80.5,10],[80.7,7.6]]],
  [3,354,'ローマ','サータヴァーハナ朝','trade',[[12.5,41.9],[18,34],[29,31],[33,28],[38,19],[44,12],[60,10],[70,13],[73,18]]],
  [3,448,'スリランカ','タイ','move',[[80.7,7.6],[87,7],[95,8],[99,12],[101,15]]],
  [3,450,'クシャーナ朝','中国','move',[[72,33],[73,38],[85,42],[97,39],[108,34]]],
  [3,625,'チョーラ朝','スマトラ島','campaign',[[79.13,10.78],[81,10],[90,8],[98,5],[101,-1]]]
];
const edition={},plans=[];
for(const volume of ancientSeries) {
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)) {
    const selected=page.passages.map(({paragraph,start,end})=>({p:paragraphById.get(paragraph),start,end}));
    const plainBody=selected.map(({p,start,end})=>p.text.slice(start,end));
    const body=selected.map(({p,start,end})=>decorate(p.text,boldSpans(p.markdown),start,end));
    const text=plainBody.join(''),title=page.title;
    const names=ancientNamesInText(title+'。'+text);
    const pins={},tags=[],props=[];
    for(const entry of names) {
      if(entry.kind==='person'||entry.kind==='building') {
        const symbol=entry.kind==='person'?'person':/ピラミッド|スフィンクス/.test(entry.name)?'pyramid':/ジッグラト/.test(entry.name)?'ziggurat':/ストゥーパ/.test(entry.name)?'stupa':'temple';
        props.push({name:entry.name,at:entry.points[0],image:`ancient/${symbol}.svg`,kind:'prop',size:42});
      }else if(entry.kind==='place')pins[entry.name]={name:entry.name,point:entry.points[0]};
      else tags.push({text:entry.name,at:entry.points[0]});
    }
    const activeRoutes=routes.filter(([lesson,line,from,to])=>selected.some(({p})=>p.lesson===lesson&&p.source[0].line===line)&&text.includes(from)&&text.includes(to))
      .map(([,,,,kind,points])=>({kind,points,start:0.08,end:0.95}));
    const points=names.flatMap(n=>n.points);
    const fallback=volume.lesson===3?[60,4,94,36]:[23,18,60,43];
    const frame=points.length?[Math.min(...points.map(p=>p[0]))-5,Math.min(...points.map(p=>p[1]))-5,Math.max(...points.map(p=>p[0]))+5,Math.max(...points.map(p=>p[1]))+5]:fallback;
    const id=`${volume.id}-${String(edition[volume.id].length+1).padStart(3,'0')}`;
    const s={id,title,body,plainBody,year:volume.period,chapter:0,kicker:volume.label,
      sourceText:{chapter:1,passages:page.passages,page:selected[0].p.page},frame,pins:Object.keys(pins),tags,zones:[],actors:[],props,
      routes:activeRoutes,rivers:ancientRivers.filter(r=>text.includes(r.name)),duration:activeRoutes.length?2200:0,
      facts:[title],mapHeading:title,focus:title,before:title,after:title,note:'',takeaway:''};
    edition[volume.id].push(s);plans.push({id,...page});
  }
}
const places=Object.fromEntries(Object.values(edition).flat().flatMap(s=>s.pins.map(name=>[name,{name,point:ancientNamesInText(name)[0].points[0]}])));
await write('public/ancient-edition.js',`// 原文の対応記録から生成。編集は docs/ancient-orient と生成処理へ。\nexport const ancientEdition = ${JSON.stringify(edition,null,2)};\nexport const ancientPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/ancient-orient/page-plan.json',JSON.stringify(plans,null,2)+'\n');

console.log(`第1章の本文を${Object.values(edition).flat().length}ページとして生成しました。`);
