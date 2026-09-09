import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {scenes} from '../public/regional-dynasties-scenes.js';
import {selectVolume} from '../public/story-volumes.js';
import {sceneMapItems, namesInText, normalizeMapName, mapDisplayName} from '../public/map-name-coverage.js';
import {places} from '../public/regional-dynasties-scenes.js';

const reference=JSON.parse(await fs.readFile(new URL('./regional-main-text-reference.json',import.meta.url),'utf8'));
const hash=text=>createHash('sha256').update(text).digest('hex');
let source;
try { source=await fs.readFile(new URL('../'+reference.file,import.meta.url),'utf8'); }
catch(error) { if(error.code!=='ENOENT')throw error; }
const actualIds=[];
for(const expected of reference.volumes){
  const selected=selectVolume('regional-dynasties',scenes,'/'+expected.id+'-story.html').scenes;
  assert.equal(selected.length,expected.pages);
  const actual=selected.flatMap(scene=>scene.body).join('');
  assert.equal(hash(actual),expected.sha256,`${expected.id}: 原文本文の欠落・加筆・書き換え・重複があります`);
  if(source){
    const paragraphs=expected.paragraphStarts.map(start=>{
      const found=source.split(/\r?\n/).filter(line=>line.startsWith(start));
      assert.equal(found.length,1,`原文の段落を一意に確認できません: ${start}`);
      return found[0];
    });
    assert.equal(actual,paragraphs.join(''),`${expected.id}: 参照専用の原文本文と一致しません`);
  }
  for(const scene of selected){
    actualIds.push(scene.id);
    assert.ok(scene.sourceText?.page>=324&&scene.sourceText.page<=328);
    const body=normalizeMapName(scene.body.join(''));
    // 見出しや地図に新しい固有名詞を足して本文へ逆流させない。
    const shown=[scene.title,...sceneMapItems(scene,places).map(item=>mapDisplayName(item.text,scene)),...scene.actors.map(a=>a.bubble)];
    for(const name of namesInText(shown.join('。')))assert.ok(body.includes(name.key),`${scene.id}: 本文にない「${name.name}」があります`);
  }
}
assert.equal(new Set(actualIds).size,16);
assert.equal(scenes.filter(s=>s.sourceText).length,16);
assert.ok(!scenes.some(s=>/outline|century-map|date-recap/.test(s.id)), '囲み・時代別地図・年号の再説明が残っています');
console.log(`03・04の16ページは原文本文11段落と完全一致${source?'（原文への直接照合済み）':'（公開用の照合値で確認）'}。`);
