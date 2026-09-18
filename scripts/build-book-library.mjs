import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {bookChapters} from '../public/book-chapters.js';
import {allEditions} from '../public/all-editions.js';
import {volumeScenes} from '../public/story-volumes.js';

const root=new URL('../',import.meta.url),read=p=>fs.readFile(new URL(p,root),'utf8');
const version=JSON.parse(await read('package.json')).version;
const write=async(p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const base=await read('public/islam-origin-story.html');
const summary=bookChapters.map(c=>({chapter:c.number,title:c.title,lessons:c.lessons,volumes:c.volumes.map(v=>({id:v.id,label:v.label,number:v.number,lesson:v.lesson,part:v.part,pages:volumeScenes(allEditions,v.id).length}))}));
const total=summary.flatMap(c=>c.volumes).reduce((n,v)=>n+v.pages,0);
const count=summary.flatMap(c=>c.volumes).length;

for(const chapter of bookChapters)for(const v of chapter.volumes) {
  const pages=volumeScenes(allEditions,v.id).length;
  assert.ok(pages>0,`${v.id}: 本文が必要`);
  const links=chapter.volumes.map(o=>`<a href="/${o.id}-story.html"${o.id===v.id?' aria-current="page"':''}>${o.number} ${escape(o.label)}</a>`).join('');
  const nav=`<nav class="story-series-links" aria-label="第${chapter.number}章の教材">${links}</nav>`;
  let html;
  if(chapter.number===6)html=(await read(`public/${v.id}-story.html`)).replace(/<nav class="story-series-links"[\s\S]*?<\/nav>/,nav);
  else {
    html=base
      .replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(v.label)}｜第${v.lesson}回 ${v.part}｜地図でたどる世界史</title>`)
      .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="第${chapter.number}章・${escape(v.label)}。${escape(v.description)}原文に沿う全${pages}ページ。" />`)
      .replace(/\s*<link rel="stylesheet" href="\/islam-origin-story.css[^>]*>/,'')
      .replace(/<script src="\/islam-origin-story.js[^>]*><\/script>/,`<script src="/${chapter.number===1?'ancient-story':'chapter-story'}.js?v=${version}" type="module"></script>`)
      .replace('restored-story islam-origin-story','restored-story ancient-story')
      .replaceAll('アラビア半島の隊商ルート',escape(v.label))
      .replaceAll('イスラーム教の成立と正統カリフの地図',escape(v.label)+'の地図')
      .replaceAll('6世紀後半',escape(v.period))
      .replaceAll('01 / 22',`01 / ${pages}`).replaceAll('1 / 22',`1 / ${pages}`).replaceAll('max="22"',`max="${pages}"`)
      .replace(/<nav class="story-series-links"[\s\S]*?<\/nav>/,nav)
      .replace(/<details>[\s\S]*?<\/details>/,`<details><summary>地図と説明について</summary><p>第${chapter.number}章「${escape(chapter.title)}」の第${v.lesson}回・第${v.part}節を、原文の順番に${pages}ページでたどります。独立したまとめ・比較表・年号欄などは省き、本文は説明のまとまりで区切っています。</p><p>都市は遺跡や現在地に、王朝・人物は本文に関係する拠点に示します。人物や建物は説明用の記号です。肖像や復元図ではありません。矢印と川は大まかな位置・方向を表します。</p><p>基図は<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth の公開地図</a>を使用しています。</p></details>`);
  }
  await write(`public/${v.id}-story.html`,html);
}

const collection=bookChapters.map(c=>{
  return `<section class="book-chapter" id="chapter-${c.number}" aria-labelledby="chapter-${c.number}-title">\n<h2 id="chapter-${c.number}-title">第${c.number}章 ${escape(c.title)}</h2>${c.lessons.map(l=>{
    const volumes=c.volumes.filter(v=>v.lesson===l.lesson);
    return `\n<section class="lesson-group" aria-labelledby="lesson-${l.lesson}">\n<h3 id="lesson-${l.lesson}">第${l.lesson}回 ${escape(l.title)}</h3>\n<ol class="lesson-parts">\n${volumes.map(v=>`<li><a class="part-link" href="/${v.id}-story.html">${escape(v.label)}</a></li>`).join('\n')}\n</ol>\n</section>`;
  }).join('')}\n</section>`;
}).join('\n');
let catalog=await read('public/index.html');
const block=`<!-- book-collection:start -->\n${collection}\n<!-- book-collection:end -->\n    `;
assert.ok(catalog.includes('<!-- book-collection:start -->')&&catalog.includes('<!-- book-collection:end -->'),'目次の生成範囲が必要');
catalog=catalog.replace(/<!-- book-collection:start -->[\s\S]*?<!-- book-collection:end -->\s*/,block);
catalog=catalog.replace(/<meta name="description"[^>]*>/,`<meta name="description" content="W-Historyの教材目次。古代・中世・近世の全7章30回から、学びたい内容を選べます。" />`);
await write('public/index.html',catalog);
await write('docs/catalog/summary.json',JSON.stringify({version,parts:count,pages:total,chapters:summary},null,2)+'\n');
console.log(`全${bookChapters.length}章・${count}パート・${total}ページの入口と一覧を生成しました。`);
