import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pageGroups,sidebars,pageTitles} from './capture-plan.mjs';
const root=new URL('../../',import.meta.url);
const dir='sources/07_近代ヨーロッパの幕開け/';
const names=await fs.readdir(new URL(dir,root));
const toc=await fs.readFile(new URL('sources/sekai_shi_tankyu_mokuji.md',root),'utf8');
const lessons=[],series=[],paragraphs=[],files=[],plan=[];
const periods={22:'14〜16世紀',23:'16世紀',24:'16〜17世紀',25:'16〜18世紀',26:'16〜18世紀',27:'17〜19世紀',28:'1789〜1794年',29:'1794〜1815年',30:'17〜18世紀'};
for(const [lessonString,parts] of Object.entries(pageGroups)){
 const lesson=Number(lessonString),name=names.find(n=>n.startsWith(lesson+'_')),file=dir+name;
 const raw=await fs.readFile(new URL(file,root),'utf8'),lines=raw.split(/\r?\n/);
 const title=toc.match(new RegExp(`### 第${lesson}回 (.*?) ……`))[1];
 lessons.push({lesson,title});
 const section=toc.split(`### 第${lesson}回 `)[1].split(/\n###|\n---/)[0];
 const labels=[...section.matchAll(/^\* (\d+) (.*?) ……/gm)].map(m=>m[2]);
 assert.equal(labels.length,parts.length);
 const included=new Map(),pagesByLine=new Map(),headingByLine=new Map();
 let sourcePage=0,heading='';
 lines.forEach((s,i)=>{if(/^## \d+$/.test(s))sourcePage=Number(s.slice(3));if(/^##### /.test(s)&&!/(クローズアップ|地図|インデックス|凡例|合否|ツボ|寄り道|寄り耳)/.test(s))heading=s.replace(/^#+\s*(▶\s*)?/,'');pagesByLine.set(i+1,sourcePage);headingByLine.set(i+1,heading);});
 for(const [partIndex,groups] of parts.entries()){
  const part=partIndex+1,id=`c07-l${lesson}-p${String(part).padStart(2,'0')}`,label=labels[partIndex];
  series.push({id,label,lesson,part,period:periods[lesson],description:`${label}について、原文に沿って時代の背景と展開をたどります。`,symbol:lesson===22||lesson===24||lesson===27?'ship':lesson===30?'tablet':'crown',chapter:7,number:String(series.length+1).padStart(2,'0'),sections:[id]});
  for(const group of groups.split(';')){
   const passages=[];
   for(const joined of group.split('|')){
    const lineNumbers=joined.split('+').map(Number),start=lineNumbers[0];
    const source=lineNumbers.map(line=>({line,page:pagesByLine.get(line),markdown:lines[line-1]}));
    const markdown=source.map(s=>s.markdown).join(''),text=markdown.replaceAll('**','');
    assert.ok(markdown.length);
    const paragraph={id:`c07-${lesson}-${start}`,volume:id,lesson,part,file,page:pagesByLine.get(start),heading:headingByLine.get(start)||label,source,markdown,text};
    paragraphs.push(paragraph);passages.push({paragraph:paragraph.id,start:0,end:text.length});
    for(const line of lineNumbers){assert.ok(!included.has(line));included.set(line,paragraph.id);}
   }
   const first=paragraphs.find(p=>p.id===passages[0].paragraph);
   plan.push({volume:id,title:first.heading,passages,reason:'話題の導入・説明・結果を読んで指定した区切り。紙面番号や文字数では改ページしない。'});
  }
 }
 const first=Math.min(...included.keys()),last=Math.max(...included.keys());
 let context='';
 const classification=lines.map((markdown,i)=>{
  const line=i+1;if(/^##### /.test(markdown))context=markdown.replace(/^#+\s*/,'');
  let reason;
  if(included.has(line))return {line,page:pagesByLine.get(line),disposition:'included',paragraph:included.get(line),reason:'通常本文（紙面またぎの継続行を含む）',markdown};
  if(!markdown.trim())reason='空行';
  else if(/^#+|^---$/.test(markdown))reason='紙面番号・見出し・区切り（節名とページ見出しとして別途使用）';
  else if(line<first)reason='回の導入・全体の見取り図';
  else if(line>last)reason='回の結び・年号欄・次回予告';
  else if(sidebars[lesson]?.some(([a,b])=>a<=line&&line<=b))reason='独立した補足コラム';
  else if(/^>/.test(markdown))reason='欄外の吹き出し・図解・補助説明';
  else if(/^\s*\||^\s*-|^\d+[.)]\s|^▲/.test(markdown))reason='図表・整理欄・図版キャプション';
  else reason=`図解の文字・整理欄（${context}）`;
  return {line,page:pagesByLine.get(line),disposition:'omitted',reason,markdown};
 });
 files.push({file,sha256:crypto.createHash('sha256').update(raw).digest('hex'),lines:classification});
}
// 長い一段落でも、教説と行動、国内戦と国際戦など、内容が切り替わる地点だけを指定する。
for(const [paragraph,anchor,titles] of [
 ['c07-23-229','すると、「どうせ変わらないなら',['カルヴァンの予定説','予定説と禁欲的な職業倫理']],
 ['c07-25-247','1721年から長期にわたって',['ハノーヴァー朝と国王の役割','ウォルポールと責任内閣制']],
 ['c07-26-77','ドイツのなかだけならこの時点で',['スウェーデンの介入とリュッツェンの戦い','フランスの参戦と三十年戦争の終結']]
]){
 const p=paragraphs.find(p=>p.id===paragraph),offset=p.text.indexOf(anchor);assert.ok(offset>0);
 const index=plan.findIndex(page=>page.passages.some(s=>s.paragraph===paragraph));
 const original=plan[index];assert.equal(original.passages.length,1);
 plan.splice(index,1,...titles.map((title,i)=>({...original,title,passages:[{paragraph,start:i?offset:0,end:i?p.text.length:offset}]})));
 if(paragraph==='c07-25-247'){
  const previous=plan[index-1];assert.equal(previous.passages[0].paragraph,'c07-25-245');
  plan[index].passages.unshift(...previous.passages);plan.splice(index-1,1);
 }
}
for(const page of plan){const title=pageTitles[page.passages[0].paragraph];if(title)page.title=title;}
await fs.writeFile(new URL('public/chapter-07-volumes.js',root),`// 第7章は目次の第22〜30回・35節に対応する。\nexport const chapterLessons = ${JSON.stringify(lessons,null,2)};\nexport const chapterSeries = ${JSON.stringify(series,null,2)};\n`);
await fs.writeFile(new URL('docs/chapter-07/source-selection.json',root),JSON.stringify({chapter:7,files,paragraphs},null,2)+'\n');
await fs.writeFile(new URL('docs/chapter-07/reading-plan.json',root),JSON.stringify(plan,null,2)+'\n');
console.log(`${series.length}節、${paragraphs.length}段落、${plan.length}ページ`);
for(const f of files)for(const l of f.lines)if(l.reason.startsWith('図解')&&l.markdown.length>25)console.log('要確認の省略行',f.file.split('/').at(-1),l.line,l.markdown);
