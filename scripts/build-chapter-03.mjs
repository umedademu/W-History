import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapterSeries} from '../public/chapter-03-volumes.js';
import {chapterNamesInText,chapterRivers} from '../public/chapter-03-geography.js';
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
const edition={},places={};
for(const volume of chapterSeries){edition[volume.id]=[];for(const page of readingPlan.filter(p=>p.volume===volume.id)){
 const body=page.passages.map(p=>decorate(byId.get(p.paragraph),p.start,p.end));
 const plainBody=page.passages.map(p=>byId.get(p.paragraph).text.slice(p.start,p.end));
 const text=plainBody.join(''), names=chapterNamesInText(page.title+'。'+text), pins=[],tags=[],props=[];
 for(const e of names){if(e.kind==='place'){places[e.name]={name:e.name,point:e.points[0]};pins.push(e.name);}else if(e.kind==='person'||e.kind==='building'){props.push({name:e.name,at:e.points[0],image:'ancient/'+(e.kind==='person'?'person':'temple')+'.svg',kind:'prop',size:42});}else tags.push({text:e.name,at:e.points[0]});}
 const activeRoutes=routes.filter(r=>page.passages.some(p=>p.paragraph===r.paragraph)).map(({kind,points})=>({kind,points,start:0.08,end:0.95}));
 const pts=[...names.flatMap(e=>e.points),...activeRoutes.flatMap(r=>r.points)];
 const frame=pts.length?[Math.min(...pts.map(p=>p[0]))-5,Math.min(...pts.map(p=>p[1]))-5,Math.max(...pts.map(p=>p[0]))+5,Math.max(...pts.map(p=>p[1]))+5]:[90,16,130,48];
 const id=volume.id+'-'+String(edition[volume.id].length+1).padStart(3,'0');
 const title=page.title;
 edition[volume.id].push({id,title,body,plainBody,year:volume.period,chapter:0,kicker:volume.label,sourceText:{chapter,passages:page.passages,page:byId.get(page.passages[0].paragraph).page},frame,pins,tags,zones:[],actors:[],props,routes:activeRoutes,rivers:chapterRivers.filter(r=>text.includes(r.name)),duration:activeRoutes.length?2200:0,facts:[title],mapHeading:title,focus:title,before:title,after:title,note:'',takeaway:''});
}}
const output='// 章専用の原文対応・明示的構成表から生成。共通ファイルは更新しない。\nexport const chapterEdition = '+JSON.stringify(edition,null,2)+';\nexport const chapterPlaces = '+JSON.stringify(places,null,2)+';\n';
const target='public/chapter-03-edition.js';
if(process.argv.includes('--check'))assert.equal((await read(target)).replaceAll('\r\n','\n'),output);
else await fs.writeFile(new URL(target,root),output);
console.log('第'+chapter+'章 '+chapterSeries.length+'節 '+Object.values(edition).flat().length+'ページの生成・照合完了');
