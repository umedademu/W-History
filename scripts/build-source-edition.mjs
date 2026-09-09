import fs from 'node:fs/promises';
import {namesInText, normalizeMapName, plainText} from '../public/map-name-coverage.js';

const root=new URL('../',import.meta.url);
const read=async p=>JSON.parse(await fs.readFile(new URL(p,root),'utf8'));
const paragraphs=await read('docs/source-edition/paragraphs.json');
const plan=await read('docs/source-edition/page-plan.json');
const templates=await read('scripts/source-map-templates.json');
for(const id of ['ottoman-expansion','ottoman-height'])templates[id].entities=templates.ottoman.entities;
const audits=[];
for(const name of await fs.readdir(new URL('docs/source-edition/',root)))if(/^decoration-\d+\.json$/.test(name))audits.push(await read('docs/source-edition/'+name));
const formatting=new Map(audits.flatMap(a=>a.paragraphs).map(p=>[p.id,p]));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const norm=normalizeMapName;
const errors=[];
function ranges(p,items){return (items??[]).flatMap(item=>{
  let start=-1,from=0;
  for(let n=0;n<(item.occurrence??1);n++){start=p.text.indexOf(item.quote,from);if(start<0)break;from=start+item.quote.length;}
  if(start<0){errors.push(`${p.id}: ${item.quote} (${item.occurrence??1})`);return [];}
  return [{...item,start,end:start+item.quote.length}];
});}
function decorate(p,start,end){
  const audit=formatting.get(p.id);if(!audit)return escape(p.text.slice(start,end));
  const spans=ranges(p,audit.spans),ruby=ranges(p,audit.ruby).filter(r=>r.start>=start&&r.end<=end);
  const styled=(a,b)=>{
    const boundaries=[...new Set([a,b,...spans.flatMap(s=>[s.start,s.end]).filter(x=>x>a&&x<b)])].sort((x,y)=>x-y);
    return boundaries.slice(0,-1).map((x,i)=>{
      const y=boundaries[i+1],styles=[...new Set(spans.filter(s=>s.start<=x&&s.end>=y).map(s=>s.style))];
      const value=escape(p.text.slice(x,y));
      return styles.length?`<span class="${styles.map(s=>'source-'+s).join(' ')}">${value}</span>`:value;
    }).join('');
  };
  let cursor=start,out='';
  for(const r of ruby.sort((a,b)=>a.start-b.start)){if(r.start<cursor)continue;out+=styled(cursor,r.start)+`<ruby>${styled(r.start,r.end)}<rt>${escape(r.reading)}</rt></ruby>`;cursor=r.end;}
  return out+styled(cursor,end);
}
function nameInText(name,text){
  const cleaned=name.replace(/[（(]模式[）)]/g,'').trim();
  if(norm(text).includes(norm(cleaned)))return cleaned;
  const base=cleaned.replace(/[【（].*?[】）]/g,'');
  if(base&&norm(text).includes(norm(base)))return base;
  const terms=namesInText(cleaned).filter(n=>norm(text).includes(n.key));
  return terms[0]?.name;
}
function suitable(title,text){return namesInText(title).every(n=>norm(text).includes(n.key));}
function shortTitle(candidate,p,text){
  if(suitable(candidate,text))return candidate.replaceAll('\n','');
  const names=namesInText(text).filter(n=>n.name.length>2).slice(0,3).map(n=>n.name);
  return names.length?names.join('・'):p.heading;
}
function cleanGeneric(s,t,text,title){
  const locations=t.places;
  s.pins=(s.pins??[]).filter(key=>nameInText(locations[key].name,text));
  s.nameOverrides=Object.fromEntries(s.pins.map(key=>[locations[key].name,nameInText(locations[key].name,text)]));
  s.tags=(s.tags??[]).flatMap(tag=>{const name=nameInText(tag.text,text);return name?[{...tag,text:name}]:[];});
  for(const key of ['actors','props'])s[key]=(s[key]??[]).flatMap(item=>{
    const name=nameInText(item.name,text);return name?[{...item,name,bubble:''}]:[];
  });
  const anchors=Object.values(locations).filter(p=>nameInText(p.name,text)).map(p=>p.point);
  const near=p=>anchors.some(a=>Math.hypot(a[0]-p[0],a[1]-p[1])<6);
  const keep=(s.routes??[]).map((r,i)=>({r,i})).filter(({r})=>r.points.length>1&&near(r.points[0])&&near(r.points.at(-1))&&/侵|征服|進|移|逃|交易|遠征|占領|奪|戻|派遣|支配/.test(text));
  for(const a of [...s.actors,...s.props])if(a.route!==undefined){const i=keep.findIndex(x=>x.i===a.route);if(i<0)delete a.route;else a.route=i;}
  s.routes=keep.map(x=>x.r);
  if(s.capital&&!s.pins.includes(s.capital))delete s.capital;
  if(s.battle&&!s.pins.includes(s.battle))delete s.battle;
  s.facts=[title];s.before=title;s.after=title;s.mapHeading=title;s.focus=title;s.relation=title;s.note='';s.takeaway='';
  return s;
}
function cleanTimur(s,t,text,title){
  s.places=s.places.filter(k=>nameInText(t.places[k].label,text));
  s.labels=s.labels.filter(k=>nameInText(t.labels[k].text,text));
  s.seas=s.seas.filter(k=>nameInText(t.seaLabels[k].text,text));
  s.showCapital=norm(text).includes(norm('サマルカンド'));
  const def=structuredClone(t.characters[s.characters]);
  def.cast=def.cast.flatMap(a=>{const name=nameInText(a.name,text);return name?[{...a,name}]:[];});
  def.before=title;def.after=title;def.result='';delete def.ancestor;
  s.characterDefinition=def;s.mapHeading=title;s.mapDescription=title;s.note='';s.takeaway='';
  return s;
}
function cleanOttoman(s,t,text,title){
  const aliases=Object.entries(t.entities).flatMap(([id,e])=>e.aliases.map(term=>({id,term}))).sort((a,b)=>b.term.length-a.term.length);
  const mentioned=aliases.filter(a=>norm(text).includes(norm(a.term)));
  const ids=[...new Set(mentioned.map(a=>a.id))];
  // 既存の動きと模式図を保持し、本文にない登場物だけを除く。
  s.animation=s.animation.map(part=>{
    const a=structuredClone(part);a.ids=ids;a.text=text;a.title=title;a.caption=title;
    for(const key of ['moves','messages'])a[key]=(a[key]??[]).filter(r=>(!r.who||ids.includes(r.who))&&suitable(r.label??'',text));
    for(const key of ['positions','labels','images','icons','afterImages','afterIcons','badges'])if(a[key])a[key]=Object.fromEntries(Object.entries(a[key]).filter(([id])=>ids.includes(id)));
    for(const key of ['grow','fades'])if(a[key])a[key]=a[key].filter(id=>ids.includes(id));
    if(a.areas)a.areas=a.areas.filter(x=>ids.includes(x.id));
    if(a.capital&&!ids.includes(a.capital))delete a.capital;
    delete a.note;return a;
  });
  // 一つの本文を複数の段落へ重複して割り当てない。
  if(s.animation.length>1){const a=s.animation[0];a.moves=s.animation.flatMap(x=>x.moves??[]);a.messages=s.animation.flatMap(x=>x.messages??[]);a.positions=Object.assign({},...s.animation.map(x=>x.positions));s.animation=[a];}
  s.notes=[];return s;
}
const edition={};
for(const item of plan){
  const p=paragraphs.find(p=>p.id===item.paragraph),text=p.text.slice(item.start,item.end),t=templates[item.volume];
  const original=t.scenes.find(s=>s.id===item.template);if(!original)throw Error(item.template);
  let s=structuredClone(original);const title=shortTitle(item.title,p,text);
  if(item.volume==='timur')s=cleanTimur(s,t,text,title);
  else if(item.volume.startsWith('ottoman'))s=cleanOttoman(s,t,text,title);
  else s=cleanGeneric(s,t,text,title);
  Object.assign(s,{id:item.id,title,body:[decorate(p,item.start,item.end)],plainBody:[text],sourceText:{paragraph:p.id,start:item.start,end:item.end,page:p.page},chapter:0,kicker:p.heading});
  (edition[item.volume]??=[]).push(s);
}
if(errors.length)throw Error('装飾位置の照合失敗:\n'+[...new Set(errors)].join('\n'));
await fs.writeFile(new URL('public/source-edition.js',root),'// 原文本文と画像で確認した装飾。scripts/build-source-edition.mjs から生成。\nexport const sourceEdition = '+JSON.stringify(edition,null,2)+';\n');
console.log(`原文本文${paragraphs.length}段落・${plan.length}ページ、装飾確認済み${paragraphs.filter(p=>formatting.has(p.id)).length}段落。`);
