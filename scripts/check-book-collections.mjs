import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {bookCollections} from '../public/book-collections.js';
import {series,volumeNavigation} from '../public/story-volumes.js';
import {modernSeries} from '../public/modern-volumes.js';
import {modernEdition} from '../public/modern-lessons.js';
import {allEditions} from '../public/all-editions.js';
import {namesForScene} from '../public/map-name-coverage.js';
import {modernNamesInText} from '../public/modern-geography.js';
import {modernNamesInText as secondModernNamesInText} from '../public/modern-geography-02.js';
import {modernNamesInText as thirdModernNamesInText} from '../public/modern-geography-03.js';
import {modernNamesInText as fourthModernNamesInText} from '../public/modern-geography-04.js';
import {modernNamesInText as fifthModernNamesInText} from '../public/modern-geography-05.js';
import {modernNamesInText as sixthModernNamesInText} from '../public/modern-geography-06.js';
import {modernNamesInText as seventhModernNamesInText} from '../public/modern-geography-07.js';
import {modernNamesInText as eighthModernNamesInText} from '../public/modern-geography-08.js';
import {modernNamesInText as ninthModernNamesInText} from '../public/modern-geography-09.js';
import {modernNamesInText as tenthModernNamesInText} from '../public/modern-geography-10.js';
import {modernNamesInText as eleventhModernNamesInText} from '../public/modern-geography-11.js';
import {modernNamesInText as twelfthModernNamesInText} from '../public/modern-geography-12.js';
import {modernNamesInText as thirteenthModernNamesInText} from '../public/modern-geography-13.js';
import {modernNamesInText as fourteenthModernNamesInText} from '../public/modern-geography-14.js';
import {modernNamesInText as fifteenthModernNamesInText} from '../public/modern-geography-15.js';
import {modernNamesInText as sixteenthModernNamesInText} from '../public/modern-geography-16.js';
import {storyEmphasisPlan} from '../public/story-emphasis.js';
import {modernReferencePages,modernDiagramFor} from '../public/modern-lessons.js';

const read=p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');
const catalog=await read('public/index.html');
const version=JSON.parse(await read('package.json')).version;
assert.ok(catalog.includes(`<span class="version">v${version}</span>`));
assert.deepEqual(bookCollections.map(b=>b.id),['ancient','modern']);
assert.equal(series.length,128);
assert.equal(Object.values(allEditions).flat().length,1013);
assert.deepEqual(bookCollections[0].chapters.flatMap(c=>c.volumes),series);
assert.deepEqual(bookCollections[1].chapters.flatMap(c=>c.volumes),modernSeries);
assert.equal(modernSeries.length,71);
assert.deepEqual(bookCollections[1].chapters.map(chapter=>({number:chapter.number,title:chapter.title,lessons:chapter.lessons.map(lesson=>lesson.lesson)})),[{number:1,title:'国民国家の形成',lessons:[1,2,3,4,5,6]},{number:2,title:'列強の侵略とアジアの変革',lessons:[7,8,9,10]},{number:3,title:'帝国主義と第一次世界大戦',lessons:[11,12,13]},{number:4,title:'戦間期と第二次世界大戦',lessons:[14,15,16]}]);
for(const chapter of bookCollections[1].chapters)assert.deepEqual(chapter.volumes.map(volume=>volume.number),chapter.volumes.map((_,index)=>String(index+1).padStart(2,'0')),'教材番号は章ごとに1から始める');
const all=bookCollections.flatMap(b=>b.chapters.flatMap(c=>c.volumes));
assert.equal(new Set(all.map(v=>v.id)).size,all.length);
const ids=[...catalog.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'巻の間で見出しの識別名を重複させない');
for(const book of bookCollections) {
  const block=catalog.split(`<!-- collection:${book.id}:start -->`)[1]?.split(`<!-- collection:${book.id}:end -->`)[0];
  assert.ok(block);
  assert.deepEqual([...block.matchAll(/class="part-link" href="\/([^"/]+)-story.html"/g)].map(m=>m[1]),book.chapters.flatMap(c=>c.volumes).map(v=>v.id));
  assert.ok(catalog.includes(`aria-controls="${book.id}-book"`));
}
let destination;
globalThis.location={assign:url=>{destination=url;}};
for(const book of [series,modernSeries])for(const [i,volume] of book.entries()) {
  const navigation=volumeNavigation(volume);
  navigation.finish();
  assert.equal(destination,i<book.length-1?`/${book[i+1].id}-story.html`:volume.book==='modern'?'/?book=modern#modern-book':'/?book=ancient#ancient-book');
}
delete globalThis.location;
for(const volume of series)assert.ok((await read(`public/${volume.id}-story.html`)).includes('href="/?book=ancient#ancient-book" class="home-link"'),'旧教材の一覧リンクも同じ巻へ戻る');
const referencedPages=new Set(),diagrams=new Set();
for(const volume of modernSeries) {
  const html=await read(`public/${volume.id}-story.html`);
  assert.ok(html.includes(`<span class="version">v${version}</span>`));
  assert.ok(html.includes('/modern-story.js?v='));
  const chapter=bookCollections[1].chapters.find(chapter=>chapter.number===volume.chapter);
  assert.ok(html.includes('第'+chapter.number+'章「'+chapter.title+'」'),'説明欄に正しい章名を表示する');
  const previous=modernSeries[modernSeries.findIndex(item=>item.id===volume.id)-1];
  if(previous)assert.ok(html.includes('id="previous-volume-link" href="/'+previous.id+'-story.html#page-'+modernEdition[previous.id].length+'"'),'章をまたいで前の教材へ戻る');
  assert.ok(!html.includes('/chapter-story.js'));
  assert.ok(html.includes('id="source-reference-body"'));
  assert.ok(html.includes('href="/?book=modern#modern-book"'));
  const nav=html.match(/<nav class="story-series-links"[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.deepEqual([...nav.matchAll(/href="\/([^"/]+)-story.html"/g)].map(m=>m[1]),modernSeries.filter(v=>v.lesson===volume.lesson).map(v=>v.id));
  for(const [index,scene] of modernEdition[volume.id].entries()) {
    modernReferencePages(scene,volume,index).forEach(n=>referencedPages.add(n));
    const diagram=modernDiagramFor(scene);
    if(diagram)diagrams.add(diagram.title);
    if(scene.plainBody.join('').includes('次ページの図➡P.30'))assert.ok(modernReferencePages(scene,volume,index).includes(30));
    const text=scene.plainBody.join('');
    assert.deepEqual(namesForScene(scene,text),({1:modernNamesInText,2:secondModernNamesInText,3:thirdModernNamesInText,4:fourthModernNamesInText,5:fifthModernNamesInText,6:sixthModernNamesInText,7:seventhModernNamesInText,8:eighthModernNamesInText,9:ninthModernNamesInText,10:tenthModernNamesInText,11:eleventhModernNamesInText,12:twelfthModernNamesInText,13:thirteenthModernNamesInText,14:fourteenthModernNamesInText,15:fifteenthModernNamesInText,16:sixteenthModernNamesInText}[scene.sourceText.lesson])(text),'各回の名称辞書を当てる');
    assert.deepEqual(storyEmphasisPlan(scene),[],'原資料の強調を古代の語で上書きしない');
  }
}
assert.equal(diagrams.size,12+new Set(modernSeries.filter(v=>v.lesson>=3).flatMap(v=>modernEdition[v.id].map(scene=>modernDiagramFor(scene)?.title).filter(Boolean))).size);
assert.deepEqual([...referencedPages].sort((a,b)=>a-b),Array.from({length:295},(_,i)=>15+i));
const summary=JSON.parse(await read('docs/catalog/summary.json'));
assert.equal(summary.parts,199);
assert.equal(summary.pages,1013+Object.values(modernEdition).flat().length);
assert.deepEqual(summary.collections.map(c=>({book:c.book,parts:c.parts,pages:c.pages})),[
  {book:'ancient',parts:128,pages:1013},{book:'modern',parts:71,pages:Object.values(modernEdition).flat().length}
]);
console.log('2巻の目次・識別名・集計・末尾移動・名称と強調の分離を確認しました。');
