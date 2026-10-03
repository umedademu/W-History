import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {bookChapters} from '../public/book-chapters.js';
import {allEditions} from '../public/all-editions.js';
import {volumeScenes} from '../public/story-volumes.js';
import {bookCollections} from '../public/book-collections.js';
import {modernEdition} from '../public/modern-lessons.js';

const root=new URL('../',import.meta.url),read=p=>fs.readFile(new URL(p,root),'utf8');
const version=JSON.parse(await read('package.json')).version;
const write=async(p,text)=>{
  if(process.argv.includes('--check'))assert.equal((await read(p)).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'),`${p}: 再生成結果と不一致`);
  else await fs.writeFile(new URL(p,root),text);
};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const base=await read('public/islam-origin-story.html');
const summary=bookChapters.map(c=>({chapter:c.number,title:c.title,lessons:c.lessons,volumes:c.volumes.map(v=>({id:v.id,label:v.label,number:v.number,lesson:v.lesson,part:v.part,pages:volumeScenes(allEditions,v.id).length}))}));
const collections=bookCollections.map(book=>{
  const chapters=book.id==='ancient'?summary:book.chapters.map(c=>({chapter:c.number,title:c.title,lessons:c.lessons,volumes:c.volumes.map(v=>({id:v.id,label:v.label,number:v.number,lesson:v.lesson,part:v.part,pages:modernEdition[v.id].length}))}));
  const volumes=chapters.flatMap(c=>c.volumes);
  return {book:book.id,title:book.title,parts:volumes.length,pages:volumes.reduce((n,v)=>n+v.pages,0),chapters};
});
const total=collections.reduce((n,c)=>n+c.pages,0);
const count=collections.reduce((n,c)=>n+c.parts,0);

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
  html=html.replace(/href="[^"]*" class="home-link"/,'href="/?book=ancient#ancient-book" class="home-link"');
  await write(`public/${v.id}-story.html`,html);
}

for(const chapter of bookCollections[1].chapters)for(const v of chapter.volumes) {
  const lesson=chapter.lessons.find(item=>item.lesson===v.lesson);
  const previous=chapter.volumes[chapter.volumes.findIndex(item=>item.id===v.id)-1];
  const pages=modernEdition[v.id].length;
  assert.ok(pages>0,`${v.id}: 本文が必要`);
  const links=chapter.volumes.filter(o=>o.lesson===v.lesson).map(o=>`<a href="/${o.id}-story.html"${o.id===v.id?' aria-current="page"':''}>${String(o.part).padStart(2,'0')} ${escape(o.label)}</a>`).join('');
  const nav=`<nav class="story-series-links" aria-label="近代・現代 第${v.lesson}回の教材">${links}</nav>`;
  const reference=`<section id="modern-diagram" class="modern-diagram" aria-label="本文に沿う関係図" hidden></section>\n    <details id="source-reference" class="modern-reference"><summary>原文の図表・補足</summary><p>この場面に関係する原書ページの全文を確認できます。本文と重なる部分も含め、図表内の文字・吹き出し・囲み・年号欄を原文の順番で掲載しています。地図の領域や絵画そのものの再現は含みません。</p><div id="source-reference-body" class="modern-reference-body"></div></details>`;
  const html=base
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(v.label)}｜近代・現代 第${v.lesson}回 ${v.part}｜地図でたどる世界史</title>`)
    .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="近代・現代 第${v.lesson}回 ${escape(lesson.title)}。第${v.part}節 ${escape(v.label)}。原文に沿う全${pages}場面と地図・図表・補足。" />`)
    .replace(/\s*<link rel="stylesheet" href="\/islam-origin-story.css[^>]*>/,`\n  <link rel="stylesheet" href="/modern-story.css?v=${version}" />`)
    .replace(/<script src="\/islam-origin-story.js[^>]*><\/script>/,`<script src="/modern-story.js?v=${version}" type="module"></script>`)
    .replace('restored-story islam-origin-story','restored-story modern-story')
    .replaceAll('アラビア半島の隊商ルート',escape(v.label))
    .replaceAll('イスラーム教の成立と正統カリフの地図',escape(v.label)+'の地図')
    .replaceAll('6世紀後半',escape(v.period))
    .replace(/(?:01|1) \/ (?:22|27)/g,`1 / ${pages}`).replace(/max="(?:22|27)"/,`max="${pages}"`)
    .replace('<div id="scene-body" class="scene-body"></div>','<div id="scene-body" class="scene-body"></div><p id="source-page-label" class="source-page-label"></p><section id="modern-illustration" class="modern-illustration" aria-label="本文に沿う人物と道具の模式図" hidden></section>')
    .replace('<nav id="scene-nav"',reference+'\n    <nav id="scene-nav"')
    .replace(/<nav class="story-series-links"[\s\S]*?<\/nav>/,nav + (previous ? `<p class="previous-volume"><a id="previous-volume-link" href="/${previous.id}-story.html#page-${modernEdition[previous.id].length}">← 前の教材の最後へ</a></p>` : ''))
    .replace(/href="[^"]*" class="home-link"/,'href="/?book=modern#modern-book" class="home-link"')
    .replace(/<footer([\s\S]*?)<details>[\s\S]*?<\/details>/,`<footer$1<details><summary>地図と説明について</summary><p>近代・現代 第1章「国民国家の形成」の第${v.lesson}回・第${v.part}節を、原文の順番に${pages}場面でたどります。元の太字・色・下線・読み仮名を保持し、関係する原書ページは「原文の図表・補足」で全文を確認できます。</p><p>人物・集団・建物・道具は本文に沿うドット絵で示します。人物の移動や姿の切替は本文にある出来事の概略です。会議や同じ都市の勢力は、本文の後の模式図でも見比べられます。人物名だけの印は本文に関係する代表地点で、所在や活動範囲を断定するものではありません。地図の文字は見やすい位置に移し、元の地点へ細い線で結びます。矢印は本文にある移動・独立運動の方向の概略です。</p><p>基図は<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth の公開地図</a>を使用しています。関係図は原文の対立関係を整理した模式図です。</p></details>`);
  await write(`public/${v.id}-story.html`,html);
}

const chapterList=(chapters,prefix)=>chapters.map(c=>{
  return `<details class="book-chapter" id="${prefix}chapter-${c.number}">\n<summary><h2><span class="chapter-number">第${c.number}章</span> ${escape(c.title)}</h2></summary>\n<div class="chapter-lessons">${c.lessons.map(l=>{
    const volumes=c.volumes.filter(v=>v.lesson===l.lesson);
    return `\n<section class="lesson-group"${prefix ? ` data-lesson="${l.lesson}"` : ''} aria-labelledby="${prefix}lesson-${l.lesson}">\n<h3 id="${prefix}lesson-${l.lesson}">第${l.lesson}回 ${escape(l.title)}</h3>\n<ol class="lesson-parts">\n${volumes.map(v=>`<li><a class="part-link" href="/${v.id}-story.html">${escape(v.label)}</a></li>`).join('\n')}\n</ol>\n</section>`;
  }).join('')}\n</div>\n</details>`;
}).join('\n');
const collection=`<div class="book-tabs" data-book-tabs role="tablist" aria-label="読む巻を選ぶ" hidden>${bookCollections.map(book=>`<button type="button" id="${book.id}-tab" role="tab" aria-selected="${book.id==='ancient'}" aria-controls="${book.id}-book" data-book-tab="${book.id}">${book.title}</button>`).join('')}</div>\n`+bookCollections.map(book=>`<section class="book-panel" id="${book.id}-book" data-book-panel="${book.id}" role="tabpanel" aria-labelledby="${book.id}-tab">\n<h2 class="book-heading">${book.title}</h2><p class="book-description">${book.id==='ancient'?'全7章・30回を収録しています。':'第1〜6回を収録しています。'}</p>\n<!-- collection:${book.id}:start -->\n${chapterList(book.chapters,book.id==='ancient'?'':'modern-')}\n<!-- collection:${book.id}:end -->\n</section>`).join('\n');
let catalog=await read('public/index.html');
const block=`<!-- book-collection:start -->\n${collection}\n<!-- book-collection:end -->\n    `;
assert.ok(catalog.includes('<!-- book-collection:start -->')&&catalog.includes('<!-- book-collection:end -->'),'目次の生成範囲が必要');
catalog=catalog.replace(/<!-- book-collection:start -->[\s\S]*?<!-- book-collection:end -->\s*/,block);
catalog=catalog.replace(/<meta name="description"[^>]*>/,`<meta name="description" content="W-Historyの教材目次。古代・中世・近世と近代・現代を選び、章・回・節から学べます。近代・現代は第1〜6回を収録。" />`);
await write('public/index.html',catalog);
await write('docs/catalog/summary.json',JSON.stringify({version,parts:count,pages:total,chapters:summary,collections},null,2)+'\n');
console.log(`2巻・${count}パート・${total}場面の入口と一覧を生成しました。`);
