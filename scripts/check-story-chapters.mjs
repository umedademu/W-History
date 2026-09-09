import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chapterGroups,selectChapter} from "../public/story-chapters.js";
import {scenes} from "../public/regional-dynasties-scenes.js";
import {pages} from "../public/ottoman-pages.js";

const catalog=await fs.readFile(new URL("../public/index.html",import.meta.url),"utf8");
for(const [name,source,expected] of [["regional-dynasties",scenes,[18,10,13,8]],["ottoman",pages,[12,13,17]]]) {
  const chapters=chapterGroups[name];
  assert.deepEqual(chapters.map(c=>c.pages.length),expected);
  const covered=chapters.flatMap(c=>c.pages);
  assert.equal(new Set(covered).size,source.length,`${name}: 欠落・重複`);
  assert.deepEqual([...covered].sort((a,b)=>a-b),source.map((_,i)=>i));
  for(let i=0;i<chapters.length;i++) {
    const selection=selectChapter(name,source,`?chapter=${i+1}`);
    assert.equal(selection.chapter,chapters[i]);
    assert.ok(selection.scenes.length<=20);
    assert.ok(selection.scenes.every(Boolean));
    assert.ok(catalog.includes(`href="/${name}-story.html?chapter=${i+1}"`));
  }
  for(const search of ["","?chapter=0","?chapter=-1","?chapter=99","?chapter=1.5","?chapter=abc"])
    assert.equal(selectChapter(name,source,search).index,0);
}
assert.equal(selectChapter("regional-dynasties",scenes,"?chapter=1").scenes.at(-1).id,"date-recap");
assert.equal(selectChapter("regional-dynasties",scenes,"?chapter=4").scenes.at(-1).id,"africa-map-recap");
console.log("03・07の７章について、20ページ以内・全91ページの欠落と重複なし・章の入口・年号まとめの移動を確認しました。");
