import assert from 'node:assert/strict';
import {allEditions} from '../public/all-editions.js';
import {bookChapters} from '../public/book-chapters.js';
import {volumeScenes} from '../public/story-volumes.js';
import {storyEmphasisPlan,chooseKeyTerms} from '../public/story-emphasis.js';

const example=(chapter,title,text,html=text)=>({title,body:[html],plainBody:[text],sourceText:{chapter}});
const primary=scene=>storyEmphasisPlan(scene).filter(s=>s.primary).map(s=>s.text);

// 元の本文が無装飾でも、人物だけでなく制度・思想を強調する。
assert.deepEqual(primary(example(3,'九品中正と門閥貴族','九品中正が行われ、門閥貴族が成立した。')),['九品中正','門閥貴族']);
assert.deepEqual(primary(example(7,'カルヴァンの改革','カルヴァンは予定説を説いた。')),['カルヴァン','予定説']);
assert.deepEqual(primary(example(2,'民衆の権利','ホルテンシウス法によって平民会の決議は国法となった。')),['ホルテンシウス法','平民会']);
assert.deepEqual([...chooseKeyTerms(['アテネ','アテネ民主政','前5世紀'],'アテネ民主政の成立')],['アテネ民主政']);
assert.ok(!storyEmphasisPlan(example(5,'契丹','契丹はキタイと呼ばれた。')).some(s=>s.key==='タイ'),'キタイから国名のタイを拾わない');
assert.deepEqual(storyEmphasisPlan(example(3,'説明','新しい制度を周りの人に明るく説明した。')),[],'一般の言葉から王朝名を拾わない');
const repeated=storyEmphasisPlan(example(7,'ルネサンス','ルネサンスは復活を意味する。ルネサンスを学ぼう。'));
assert.equal(repeated.filter(s=>s.key==='ルネサンス').length,1,'同じ語はページ最初の出現だけを追加装飾する');
assert.deepEqual(storyEmphasisPlan(example(6,'イスラーム教','イスラーム教を学ぶ。','<span class="source-bold">イスラーム教</span>を学ぶ。')),[]);
assert.deepEqual(storyEmphasisPlan({...example(6,'カリフ','カリフを学ぶ。'),sourceText:{paragraph:'01-1'}}),[],'第6章の旧形式も再判定しない');

let pages=0,addedPages=0;
for(const chapter of bookChapters) {
  const scenes=chapter.volumes.flatMap(v=>volumeScenes(allEditions,v.id));
  let colored=0,bold=0;
  for(const scene of scenes) {
    pages++;
    const plan=storyEmphasisPlan(scene);
    if(chapter.number===6){assert.deepEqual(plan,[]);continue;}
    addedPages++;
    assert.ok(plan.some(s=>s.primary),`${scene.id}: 主題の強調がない`);
    assert.ok(plan.filter(s=>s.primary).length<=4,`${scene.id}: 色の付け過ぎ`);
    assert.equal(new Set(plan.map(s=>s.key)).size,plan.length,`${scene.id}: 同語の重複`);
    for(const [i,span] of plan.entries()) {
      assert.ok(span.start>=0&&span.end>span.start&&span.end<=scene.plainBody[span.paragraph].length);
      assert.equal(scene.plainBody[span.paragraph].slice(span.start,span.end),span.text);
      assert.ok(!/^\d+[年世紀]*$/.test(span.text),`${scene.id}: 年代だけを選択`);
      for(const other of plan.slice(i+1))if(other.paragraph===span.paragraph)assert.ok(span.end<=other.start||other.end<=span.start,`${scene.id}: 重なる装飾`);
    }
    colored+=plan.filter(s=>s.primary).length;bold+=plan.filter(s=>!s.primary).length;
  }
  console.log(`第${chapter.number}章 ${scenes.length}ページ: ${chapter.number===6?'画像照合済み装飾を保持':`主題${colored}箇所・関連語${bold}箇所`}`);
}
assert.equal(pages,1013);assert.equal(addedPages,858);
console.log('全7章の強調範囲、文脈による選択、語中の誤検出防止を確認しました。');
