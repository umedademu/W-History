import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries,chapterLessons} from '../public/chapter-04-volumes.js';
import {chapterNamesInText,chapterRivers} from '../public/chapter-04-geography.js';

const root = new URL('../',import.meta.url);
const read = p=>fs.readFile(new URL(p,root),'utf8');
const write = async (p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const {paragraphs} = JSON.parse(await read('docs/chapter-04/source-selection.json'));
const readingPlan = JSON.parse(await read('docs/chapter-04/reading-plan.json'));
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
    11,
    54,
    "黒海",
    "ドナウ川",
    "move",
    [
      [
        32,
        46
      ],
      [
        28,
        45
      ],
      [
        26.5,
        43
      ]
    ]
  ],
  [
    11,
    78,
    "パンノニア",
    "カタラウヌム",
    "campaign",
    [
      [
        19,
        47
      ],
      [
        12,
        48
      ],
      [
        4.36,
        48.96
      ]
    ]
  ],
  [
    11,
    94,
    "バルカン半島",
    "ローマ",
    "move",
    [
      [
        23,
        42
      ],
      [
        17,
        45
      ],
      [
        12.5,
        41.9
      ]
    ]
  ],
  [
    11,
    96,
    "南ガリア",
    "イベリア半島",
    "move",
    [
      [
        1.44,
        43.6
      ],
      [
        -1,
        42
      ],
      [
        -4.03,
        39.86
      ]
    ]
  ],
  [
    11,
    100,
    "イベリア",
    "北アフリカ",
    "move",
    [
      [
        -4,
        40
      ],
      [
        -5.6,
        36
      ],
      [
        0,
        36
      ],
      [
        10.32,
        36.85
      ]
    ]
  ],
  [
    11,
    116,
    "ユトランド半島",
    "ブリタニア",
    "move",
    [
      [
        10,
        55
      ],
      [
        4,
        54
      ],
      [
        0,
        53
      ],
      [
        -1,
        52
      ]
    ]
  ],
  [
    11,
    211,
    "イベリア半島",
    "フランク王国",
    "campaign",
    [
      [
        -4,
        40
      ],
      [
        1,
        42.7
      ],
      [
        0.34,
        46.58
      ]
    ]
  ],
  [
    12,
    81,
    "ノヴゴロド",
    "キエフ",
    "move",
    [
      [
        31.27,
        58.52
      ],
      [
        30,
        56
      ],
      [
        30,
        54
      ],
      [
        30.52,
        50.45
      ]
    ]
  ],
  [
    12,
    99,
    "ノルマンディー",
    "イングランド",
    "campaign",
    [
      [
        0,
        49
      ],
      [
        0.2,
        50
      ],
      [
        0.49,
        50.91
      ]
    ]
  ],
  [
    13,
    80,
    "ヴァンダル王国",
    "イタリア",
    "campaign",
    [
      [
        28.98,
        41.01
      ],
      [
        23,
        37
      ],
      [
        15,
        36
      ],
      [
        10.32,
        36.85
      ],
      [
        12.2,
        44.42
      ]
    ]
  ],
  [
    14,
    138,
    "コンスタンティノープル",
    "イェルサレム",
    "campaign",
    [
      [
        28.98,
        41.01
      ],
      [
        30,
        38
      ],
      [
        36.16,
        36.2
      ],
      [
        35.23,
        31.78
      ]
    ]
  ],
  [
    14,
    164,
    "ヴェネツィア",
    "コンスタンティノープル",
    "campaign",
    [
      [
        12.34,
        45.44
      ],
      [
        17,
        42
      ],
      [
        23,
        36
      ],
      [
        26,
        39
      ],
      [
        28.98,
        41.01
      ]
    ]
  ],
  [
    14,
    182,
    "フランス",
    "エジプト",
    "campaign",
    [
      [
        4,
        43
      ],
      [
        12,
        38
      ],
      [
        22,
        34
      ],
      [
        31,
        30
      ]
    ]
  ],
  [
    14,
    182,
    "フランス",
    "チュニス",
    "campaign",
    [
      [
        4,
        43
      ],
      [
        7,
        40
      ],
      [
        10.18,
        36.8
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
      sourceText:{chapter:4,passages:page.passages,page:selected[0].p.page},frame,pins:Object.keys(pins),tags,zones:[],actors:[],props,
      routes:activeRoutes,rivers:chapterRivers.filter(r=>text.includes(r.name)),duration:activeRoutes.length?2200:0,
      facts:[title],mapHeading:title,focus:title,before:title,after:title,note:'',takeaway:''};
    edition[volume.id].push(s);plans.push({id,...page});
  }
}
const places=Object.fromEntries(Object.values(edition).flat().flatMap(s=>s.pins.map(name=>[name,{name,point:chapterNamesInText(name)[0].points[0]}])));
await write('public/chapter-04-edition.js',`// 原文の対応記録から生成。編集は docs/chapter-04 と生成処理へ。\nexport const chapterEdition = ${JSON.stringify(edition,null,2)};\nexport const chapterPlaces = ${JSON.stringify(places,null,2)};\n`);
await write('docs/chapter-04/page-plan.json',JSON.stringify(plans,null,2)+'\n');

console.log('第4章: '+chapterSeries.length+'節・'+plans.length+'ページ');
