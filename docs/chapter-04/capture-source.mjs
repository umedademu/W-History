import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const chapter=4,prefix='04';
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const plan=JSON.parse(read('docs/chapter-04/editorial-plan.json'));
const sourceDirectory=fs.readdirSync(new URL('sources/',root)).find(n=>n.startsWith(prefix+'_'));
const sourceFiles=fs.readdirSync(new URL('sources/'+sourceDirectory+'/',root));
const toc=read('sources/sekai_shi_tankyu_mokuji.md').split(/\r?\n/);
let chapterNumber=0,currentLesson=0;const lessons=[],series=[];
for(const line of toc){
const c=line.match(/^## 第(\d+)章/);if(c)chapterNumber=Number(c[1]);
if(chapterNumber!==chapter)continue;
const l=line.match(/^### 第(\d+)回 (.+?) ……/);if(l){currentLesson=Number(l[1]);lessons.push({lesson:currentLesson,title:l[2]});}
const p=line.match(/^\* (\d+) (.+?) ……/);if(p){const part=Number(p[1]),id='c'+prefix+'-l'+String(currentLesson).padStart(2,'0')+'-p'+String(part).padStart(2,'0');series.push({id,label:p[2],lesson:currentLesson,part,period:chapter===2?'古代地中海世界':'中世ヨーロッパ',description:p[2]+'を、原文の説明の流れに沿って地図でたどります。',symbol:'temple',chapter,number:String(series.length+1).padStart(2,'0'),sections:[id]});}
}
const records=[],paragraphs=[],pages=[],unclassified=[];
const excludedColumns={"11":[266],"12":[315,317],"13":[],"14":[],"15":[369]};
for(const [lessonString,parts] of Object.entries(plan)){
 const lesson=Number(lessonString),file='sources/'+sourceDirectory+'/'+sourceFiles.find(n=>Number(n.slice(0,2))===lesson),raw=read(file),lines=raw.split(/\r?\n/),used=new Set();let sourcePage=0,heading='',part=0;const info=[];
 lines.forEach((markdown,i)=>{const pg=markdown.match(/^## (\d+)$/);if(pg)sourcePage=Number(pg[1]);const s=markdown.match(/^#### (\d+)[ 　]+(.+)/);if(s)part=Number(s[1]);if(/^#{3,5} /.test(markdown)&&!/^#### /.test(markdown)&&!(lesson===6&&i===177)&&!(lesson===14&&i===141)&&!/(地図|図内|図：|クローズ|Close-up|分かれ目|年号|ちょっと|〈|第\d+回　)/.test(markdown))heading=markdown.replace(/^#+ /,'').replace(/^◀ /,'');info.push({line:i+1,page:sourcePage,heading,part,markdown});});
 parts.forEach((pageText,index)=>{
 const volume=series.find(v=>v.lesson===lesson&&v.part===index+1);assert.ok(volume);
 for(const group of pageText.split(';')){
  const passages=[];let title='';
  for(const token of group.split(',')){
   const source=token.split('+').map(n=>info[Number(n)-1]);assert.ok(source.every(s=>s&&s.markdown.trim()),'空行を本文として選択: '+lesson+' '+token);
   source.forEach(s=>{assert.ok(!used.has(s.line),'二重選択');used.add(s.line);});
   if(!title)title=source[0].heading||volume.label;
   const markdown=source.map(s=>s.markdown.replace(/^### /,'')).join('');
   const text=markdown.replaceAll('**','');const id='c'+prefix+'-l'+String(lesson).padStart(2,'0')+'-r'+source[0].line;
   paragraphs.push({id,volume:volume.id,lesson,part:index+1,file,page:source[0].page,heading:title,source,markdown,text});passages.push({paragraph:id,start:0,end:text.length});
  }
  pages.push({volume:volume.id,title,passages});
 }
 });
 const firstPart=info.find(i=>i.part>0)?.line||99999;
 const rows=info.map(s=>{
 let kind='省略',reason='';const t=s.markdown.trim();
 if(used.has(s.line)){kind='本文';reason='通常本文。紙面をまたぐ続きも掲載';}
 else if(!t)reason='空行';
 else if(/^#|^---$/.test(t))reason='章・節・小見出し、紙面番号（構成へ反映）';
 else if(/^>/.test(t))reason='欄外注記・紙面の案内';
 else if(/^\||^- |^\d+\.|^[↓↑]/.test(t))reason='表・図・まとめ・年号欄';
 else if(/^\*\*(?:\d|第|中世ヨーロッパ|図：)/.test(t)||/^(地図|図の|図中|凡例|図：)/.test(t))reason='紙面の柱・図の見出し・図中の文字';
 else if(s.line<firstPart)reason='回の導入と学習範囲の案内';
 else if((excludedColumns[lesson]||[]).includes(s.line))reason='独立した補足コラム（ちょっと寄り道・寄り耳）';
 else if(t.length<65)reason='図・表・まとめ欄の表示文字';
 else{reason='未分類';unclassified.push({lesson,line:s.line,text:t});}
 return {line:s.line,kind,reason,markdown:s.markdown};
 });
 records.push({file,sha256:crypto.createHash('sha256').update(raw).digest('hex'),lineCount:lines.length,lines:rows});
}
assert.equal(series.length,chapter===2?20:18);
fs.writeFileSync(new URL('public/chapter-'+prefix+'-volumes.js',root),'// 目次の章・回・節の順序。\nexport const chapterLessons = '+JSON.stringify(lessons,null,2)+';\nexport const chapterSeries = '+JSON.stringify(series,null,2)+';\n');
fs.writeFileSync(new URL('docs/chapter-'+prefix+'/source-selection.json',root),JSON.stringify({chapter,files:records,paragraphs},null,2)+'\n');
fs.writeFileSync(new URL('docs/chapter-'+prefix+'/reading-plan.json',root),JSON.stringify(pages,null,2)+'\n');
console.log(JSON.stringify({chapter,parts:series.length,pages:pages.length,paragraphs:paragraphs.length,unclassified},null,2));
