import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const chapter=Number(path.basename(here).slice(-2));
const pad=n=>String(n).padStart(2,'0');
const folder=fs.readdirSync(path.join(root,'sources')).find(x=>x.startsWith(pad(chapter)+'_'));
const plan=JSON.parse(fs.readFileSync(path.join(here,'editorial-plan.json'),'utf8'));
const paragraphs=[],files=[],reading=[],volumes=[],lessons=[];
for(const [lessonNumber,parts] of Object.entries(plan)){
 const lesson=Number(lessonNumber),file=fs.readdirSync(path.join(root,'sources',folder)).find(x=>x.startsWith(pad(lesson)+'_'));
 const relative='sources/'+folder+'/'+file;
 const raw=fs.readFileSync(path.join(root,relative),'utf8');
 const lines=raw.split(/\r?\n/), selected=new Map();
 const lessonTitle=lines[0].replace(/^# 第\d+回[\s　]*/,'');
 lessons.push({lesson,title:lessonTitle});
 const pageAt=n=>Number(lines.slice(0,n).filter(x=>/^## \d+/.test(x)).at(-1)?.slice(3));
 for(const [pi,part] of parts.entries()){
  const volume='c'+pad(chapter)+'-l'+pad(lesson)+'-p'+pad(pi+1);
  volumes.push({id:volume,label:part.title,lesson,part:pi+1,period:part.period,description:part.pages.map(x=>x[0]).slice(0,3).join('、')+'などを原文に沿ってたどります。',symbol:/交易|海|経済/.test(part.title)?'ship':/文化|文明|百家/.test(part.title)?'tablet':'crown',chapter,number:pad(volumes.length+1),sections:[volume]});
  for(const [title,groups] of part.pages){
   const passages=[];
   for(const group of groups.split(' ')){
    const ns=group.split('+').map(Number);
    for(const n of ns){assert.ok(lines[n-1],file+':'+n);assert.ok(!selected.has(n),'原文行の重複 '+n);selected.set(n,volume);}
    const markdown=ns.map(n=>lines[n-1]).join('');
    const text=markdown.replaceAll('**','');
    const id='c'+pad(chapter)+'-'+lesson+'-'+ns[0];
    paragraphs.push({id,volume,lesson,part:pi+1,file:relative,page:pageAt(ns[0]),heading:title,source:ns.map(n=>({line:n,page:pageAt(n),markdown:lines[n-1]})),markdown,text});
    passages.push({paragraph:id,start:0,end:text.length});
   }
   reading.push({volume,title,passages});
  }
 }
 let heading='',partSeen=false;
 const classifications=lines.map((text,i)=>{
  if(/^#### \d/.test(text))partSeen=true;
  if(/^#{4,5} /.test(text))heading=text.replace(/^#+ /,'');
  const line=i+1;
  if(selected.has(line))return {line,status:'掲載',reason:'通常本文（説明の続きは同一段落に接続）',volume:selected.get(line)};
  let reason;
  if(!text.trim())reason='空行';
  else if(/^---/.test(text))reason='紙面の区切り';
  else if(/^## \d/.test(text)||/^### 第/.test(text)||/^# 第/.test(text))reason='紙面番号・柱見出し';
  else if(/^#### \d/.test(text))reason='目次の節見出し（教材名で使用）';
  else if(!partSeen)reason='章扉・各回の導入・見取り図';
  else if(/年号|次回|最後に年号|最後は年号|最後に.*check|最後.*年号/.test(heading+' '+text))reason='年号欄・次回予告';
  else if(/合否|クローズ|クロース|分かれ目|＋α|ちょっと寄り|まとめ|タテ.*流れ/.test(heading))reason='独立した要点整理・比較欄・欄外補足';
  else if(/^##### /.test(text))reason='小見出し・図表名（本文のページ構成に反映）';
  else if(/^(?:\s*[-|>]|\*\*(?:図|地図|凡例|字形|里甲)|図中|凡例|\x60\x60\x60)/.test(text)||text.startsWith('<img'))reason='図表・地図内文字・吹き出し';
  else reason='独立した図表・比較計算例・節末の案内（本文の説明は掲載）';
  return {line,status:'省略',reason,heading};
 });
 files.push({file:relative,sha256:crypto.createHash('sha256').update(raw).digest('hex'),lineCount:lines.length,classifications});
}
fs.writeFileSync(path.join(here,'source-selection.json'),JSON.stringify({chapter,files,paragraphs},null,2)+'\n');
fs.writeFileSync(path.join(here,'reading-plan.json'),JSON.stringify(reading,null,2)+'\n');
fs.writeFileSync(path.join(root,'public','chapter-'+pad(chapter)+'-volumes.js'),'// 目次の節に対応する教材。章別の構成表から生成。\nexport const chapterLessons = '+JSON.stringify(lessons,null,2)+';\nexport const chapterSeries = '+JSON.stringify(volumes,null,2)+';\n');
console.log('第'+chapter+'章 '+volumes.length+'節 '+reading.length+'ページ '+paragraphs.length+'段落');
