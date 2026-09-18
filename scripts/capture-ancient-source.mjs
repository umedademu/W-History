// 原文は読み取り専用。確認した行だけを、再生成・検査用の対応記録へ保存する。
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {ancientLessons, ancientSeries} from '../public/ancient-volumes.js';

const root = new URL('../', import.meta.url);
const hash = text => createHash('sha256').update(text).digest('hex');
const selections = [
  [
    [46,48,64,66],
    [89,91,93,112,127,[129,137],154,156,173,177,179,181],
    [187,[189,197],199,209,211,244,246,248,263,265,273,277,279,281,285,289,[291,308],310,312,321,325,333],
    [354]
  ],
  [
    [59,61,90,92,111,113,127,129,131],
    [176,178,182,[184,192],206,208,225,244,246],
    [270,272,274,278,295,297,299,313,321,325,327],
    [362,[374,382],400,[402,419],421,425,431,[433,441],463,465,[467,484],488,492,494]
  ],
  [
    [41,45,61,[63,71],73],
    [79,91,93,[97,114],116,131,[133,141],143,145,147,149,[161,178],180,184,186,188,[192,200],206,210,212],
    [238,240,[246,263],265,269,271,283,[285,293],295,299,301,307,311,[313,330],352,354,358,366,368,379,381,383,402,404,406,448,450,454,460,[473,490],492,496,498,512,516,518,520,[524,541],547,562,566,[568,576],578],
    [584,586,588,[590,611],613,617,619,621,623,625,627]
  ]
];
const files = [], paragraphs = [];
for (const {lesson,title} of ancientLessons) {
  const file = `sources/01_オリエント・インドの古代文明/${String(lesson).padStart(2,'0')}_${title}.md`;
  const raw = await fs.readFile(new URL(file,root),'utf8'), lines = raw.split(/\r?\n/);
  let page = 0, heading = '';
  const context = lines.map(line => {
    if (/^## \d+$/.test(line)) page = Number(line.slice(3));
    if (/^##### /.test(line) && !/クローズアップ|合否の分かれ目|年号のツボ|〈/.test(line)) heading = line.slice(6);
    return {page,heading};
  });
  const selected = new Set();
  for (let part = 1; part <= 4; part++) {
    const volume = ancientSeries.find(v=>v.lesson===lesson&&v.part===part);
    for (const selection of selections[lesson-1][part-1]) {
      const refs = [selection].flat();
      refs.forEach(line=>selected.add(line));
      const first = refs[0], source = refs.map(line=>({line,page:context[line-1].page,markdown:lines[line-1]}));
      const markdown = source.map(s=>s.markdown).join('');
      if (source.some(s=>!s.markdown || /^#|^>|^\s*[-*] |^\|/.test(s.markdown))) throw Error(`本文以外の行: ${file}:${first}`);
      paragraphs.push({id:`ancient-${lesson}-${first}`,volume:volume.id,lesson,part,file,
        page:context[first-1].page,heading:context[first-1].heading,source,markdown,text:markdown.replaceAll('**','')});
    }
  }
  // 本文の中に現れる「まとめる」「比較する」は除外条件にしない。
  const omitted = lines.flatMap((text,i)=>{
    if (!text.trim() || selected.has(i+1)) return [];
    const reason = /^##? |^### |^#### |^##### /.test(text) ? '見出し・紙面番号（本文の見出しは別途使用）'
      : context[i].page === ({1:16,2:28,3:44}[lesson]) || context[i].page===15 ? '章扉・回の導入・見取り図'
      : /年号のツボ/.test(context[i].heading) || i+1 >= ({1:379,2:496,3:629}[lesson]) ? '年号まとめ・次回予告'
      : text==='---' ? '紙面の区切り' : /^>/.test(text) ? '欄外・吹き出し・補足欄'
      : '図表・比較表・クローズアップとその注記';
    return [{line:i+1,page:context[i].page,reason,sha256:hash(text)}];
  });
  files.push({file,sha256:hash(raw),selectedLines:[...selected].sort((a,b)=>a-b),omitted});
}
await fs.mkdir(new URL('docs/ancient-orient/',root),{recursive:true});
await fs.writeFile(new URL('docs/ancient-orient/source-selection.json',root),JSON.stringify({files,paragraphs},null,2)+'\n');
console.log(`第1章の本文${paragraphs.length}段落を、原文の行・紙面・掲載／省略範囲とともに記録しました。`);
