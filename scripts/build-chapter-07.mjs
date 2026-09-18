import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries as ancientSeries} from '../public/chapter-07-volumes.js';
import {chapterNamesInText as ancientNamesInText,chapterRivers as ancientRivers} from '../public/chapter-07-geography.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/chapter-07/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/chapter-07/reading-plan.json'));
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
 [22,183,'ポルトガル','喜望峰','move',[[-9.14,38.72],[-18,27],[-19,8],[-1,-1],[10,-15],[15,-30],[18.48,-34.36]]],
 [22,185,'喜望峰','カリカット','trade',[[18.48,-34.36],[25,-36],[40,-15],[48,-4],[62,5],[75.78,11.26]]],
 [22,197,'ホルムズ','ゴア','campaign',[[56.45,27.06],[60,23],[68,18],[73.83,15.49]]],
 [22,223,'ゴア','マラッカ','campaign',[[73.83,15.49],[75,9],[81,4],[91,5],[98,5],[102.25,2.2]]],
 [22,243,'パロス','サンサルバドル','move',[[-6.89,37.23],[-17,29],[-35,25],[-55,23],[-74.5,24.1]]],
 [22,363,'アカプルコ','マニラ','trade',[[-99.88,16.86],[-130,18],[-165,14],[-180,13]]],
 [22,363,'アカプルコ','マニラ','trade',[[180,13],[155,13],[130,13],[120.98,14.6]]],
 [24,280,'バタヴィア','マラッカ','trade',[[106.85,-6.21],[105,-4],[104,0],[102.25,2.2]]],
 [24,294,'オランダ','喜望峰','trade',[[4.9,52.37],[-5,49],[-13,35],[-19,10],[0,-5],[12,-25],[18.48,-34.36]]],
 [27,75,'西アフリカ','カリブ海','trade',[[-15,12],[-35,14],[-55,15],[-72,15]]],
 [27,75,'カリブ海','イギリス','trade',[[-72,15],[-60,26],[-43,35],[-25,44],[-2.99,53.41]]],
 [27,75,'イギリス','西アフリカ','trade',[[-2.99,53.41],[-8,42],[-17,27],[-15,12]]],
 [26,535,'スウェーデン','ポルタヴァ','campaign',[[18.07,59.33],[25,56],[30,53],[34.55,49.59]]],
 [29,86,'フランス','エジプト','campaign',[[5.4,43.1],[9,40],[16,35],[25,33],[30.08,31.32]]],
 [29,248,'プロイセン','ベルリン','campaign',[[11,50],[12,51],[13.41,52.52]]],
 [29,290,'ナポレオン','モスクワ','campaign',[[21,52],[25,54],[30,54.5],[34,55],[37.62,55.75]]],
 [29,296,'パリ','ライプツィヒ','rival',[[12.37,51.34],[9,50],[6,49],[2.35,48.86]]]
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
    const fallback=[-12,34,35,64];
    const frame=points.length?[Math.min(...points.map(p=>p[0]))-5,Math.min(...points.map(p=>p[1]))-5,Math.max(...points.map(p=>p[0]))+5,Math.max(...points.map(p=>p[1]))+5]:fallback;
    const id=`${volume.id}-${String(edition[volume.id].length+1).padStart(3,'0')}`;
    const s={id,title,body,plainBody,year:volume.period,chapter:0,kicker:volume.label,
      sourceText:{chapter:7,passages:page.passages,page:selected[0].p.page},frame,pins:Object.keys(pins),tags,zones:[],actors:[],props,
      routes:activeRoutes,rivers:ancientRivers.filter(r=>text.includes(r.name)),duration:activeRoutes.length?2200:0,
      facts:[title],mapHeading:title,focus:title,before:title,after:title,note:'',takeaway:''};
    edition[volume.id].push(s);plans.push({id,...page});
  }
}
const places=Object.fromEntries(Object.values(edition).flat().flatMap(s=>s.pins.map(name=>[name,{name,point:ancientNamesInText(name)[0].points[0]}])));
await write('public/chapter-07-edition.js',`// 原文の対応記録から生成。編集は docs/chapter-07 と生成処理へ。\nexport const chapterEdition = ${JSON.stringify(edition,null,2)};\nexport const chapterPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/chapter-07/page-plan.json',JSON.stringify(plans,null,2)+'\n');
