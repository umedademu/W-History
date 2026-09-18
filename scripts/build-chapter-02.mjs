import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries,chapterLessons} from '../public/chapter-02-volumes.js';
import {chapterNamesInText,chapterRivers} from '../public/chapter-02-geography.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/chapter-02/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/chapter-02/reading-plan.json'));
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
  // 閉じ記号だけの原文上の誤記は表示装飾にしない（対応記録に記載）。
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
assert.deepEqual([...new Set(readingPlan.map(p=>p.volume))],chapterSeries.map(v=>v.id));
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

const routes = [
  [
    4,
    342,
    "アケメネス朝",
    "ミレトス",
    "campaign",
    [
      [
        52.8,
        29.9
      ],
      [
        44,
        34
      ],
      [
        36,
        37
      ],
      [
        27.3,
        37.5
      ]
    ]
  ],
  [
    4,
    376,
    "ペルシア",
    "マラトン",
    "campaign",
    [
      [
        27.3,
        38
      ],
      [
        26,
        38
      ],
      [
        24,
        38.15
      ]
    ]
  ],
  [
    5,
    180,
    "アナトリア",
    "イッソス",
    "campaign",
    [
      [
        27.23,
        40.32
      ],
      [
        30,
        38
      ],
      [
        33,
        37
      ],
      [
        36.2,
        36.84
      ]
    ]
  ],
  [
    5,
    184,
    "地中海東岸",
    "エジプト",
    "campaign",
    [
      [
        35.2,
        33.3
      ],
      [
        34,
        31
      ],
      [
        29.9,
        31.2
      ]
    ]
  ],
  [
    5,
    223,
    "バビロン",
    "ペルセポリス",
    "campaign",
    [
      [
        44.42,
        32.54
      ],
      [
        48.26,
        32.19
      ],
      [
        52.89,
        29.93
      ]
    ]
  ],
  [
    5,
    227,
    "バクトリア",
    "インダス川",
    "campaign",
    [
      [
        67,
        37
      ],
      [
        70,
        35
      ],
      [
        72,
        33
      ],
      [
        71,
        30
      ]
    ]
  ],
  [
    6,
    202,
    "アルプス",
    "カンネー",
    "campaign",
    [
      [
        6.5,
        46.5
      ],
      [
        8,
        45
      ],
      [
        12,
        43
      ],
      [
        16.15,
        41.3
      ]
    ]
  ],
  [
    6,
    204,
    "北アフリカ",
    "ザマ",
    "campaign",
    [
      [
        10.32,
        36.85
      ],
      [
        9.3,
        36
      ]
    ]
  ],
  [
    6,
    363,
    "ガリア",
    "ローマ",
    "campaign",
    [
      [
        3,
        47
      ],
      [
        8,
        45
      ],
      [
        12.42,
        44.13
      ],
      [
        12.5,
        41.9
      ]
    ]
  ],
  [
    7,
    371,
    "パレスチナ",
    "ギリシア",
    "move",
    [
      [
        35.2,
        31.8
      ],
      [
        36,
        36
      ],
      [
        30,
        38
      ],
      [
        23.7,
        38
      ]
    ]
  ]
];
const edition={},plans=[];
for(const volume of chapterSeries) {
  edition[volume.id]=[];
  for(const page of readingPlan.filter(p=>p.volume===volume.id)) {
    const selected=page.passages.map(({paragraph,start,end})=>({p:paragraphById.get(paragraph),start,end}));
    const plainBody=selected.map(({p,start,end})=>p.text.slice(start,end));
    const body=selected.map(({p,start,end})=>decorate(p.text,boldSpans(p.markdown),start,end));
    const text=plainBody.join(''),title=page.title;
    const names=chapterNamesInText(title+'。'+text);
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
    const fallback=[-12,28,40,60];
    const frame=points.length?[Math.min(...points.map(p=>p[0]))-5,Math.min(...points.map(p=>p[1]))-5,Math.max(...points.map(p=>p[0]))+5,Math.max(...points.map(p=>p[1]))+5]:fallback;
    const id=`${volume.id}-${String(edition[volume.id].length+1).padStart(3,'0')}`;
    const s={id,title,body,plainBody,year:volume.period,chapter:0,kicker:volume.label,
      sourceText:{chapter:2,passages:page.passages,page:selected[0].p.page},frame,pins:Object.keys(pins),tags,zones:[],actors:[],props,
      routes:activeRoutes,rivers:chapterRivers.filter(r=>text.includes(r.name)),duration:activeRoutes.length?2200:0,
      facts:[title],mapHeading:title,focus:title,before:title,after:title,note:'',takeaway:''};
    edition[volume.id].push(s);plans.push({id,...page});
  }
}
const places=Object.fromEntries(Object.values(edition).flat().flatMap(s=>s.pins.map(name=>[name,{name,point:chapterNamesInText(name)[0].points[0]}])));
await write('public/chapter-02-edition.js',`// 原文の対応記録から生成。編集は docs/chapter-02 と生成処理へ。\nexport const chapterEdition = ${JSON.stringify(edition,null,2)};\nexport const chapterPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/chapter-02/page-plan.json',JSON.stringify(plans,null,2)+'\n');

console.log('第2章: '+chapterSeries.length+'節・'+plans.length+'ページ');
