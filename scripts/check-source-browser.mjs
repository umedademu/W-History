import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {allEditions as sourceEdition} from '../public/all-editions.js';
import {series,volumeScenes} from '../public/story-volumes.js';
import {storyEmphasisPlan} from '../public/story-emphasis.js';
const base='http://127.0.0.1:18768';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,PORT:'18768'},windowsHide:true,stdio:'pipe'});
let browser;
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
 const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
 browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.addInitScript(()=>{window.speechSynthesis?.cancel();if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};HTMLMediaElement.prototype.play=async()=>{};});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const output=await mkdtemp(path.join(os.tmpdir(),'w-history-source-'));
 let inspected=0;
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:900});
  for(const [id,scenes] of series.map(v=>[v.id,volumeScenes(sourceEdition,v.id)])){
   await page.goto(`${base}/${id}-story.html`);await page.waitForSelector('button[data-scene]');
   for(let i=0;i<scenes.length;i++){
    await page.locator('button[data-scene]').nth(i).evaluate(b=>b.click());
    await page.waitForFunction(n=>Number(document.querySelector('#story-progress').value)===n,i+1);
    const actual=await page.locator('#scene-body').evaluate(body=>{
     const copy=body.cloneNode(true);copy.querySelectorAll('rt').forEach(n=>n.remove());
     const added=new Map();
     for(const span of body.querySelectorAll('.story-key-term,.story-bold')){
      const key=span.dataset.term,style=getComputedStyle(span);
      const item=added.get(key)??{key,text:'',primary:span.classList.contains('story-key-term')};
      item.text+=span.textContent;added.set(key,item);
      if(+style.fontWeight<700||style.fontSize!==getComputedStyle(body).fontSize)throw Error('強調語の太さ・文字サイズが不正: '+span.textContent);
     }
     return {text:copy.textContent,red:body.querySelectorAll('.source-red-bold').length,bold:body.querySelectorAll('.source-bold').length,ruby:body.querySelectorAll('ruby').length,added:[...added.values()]};
    });
    assert.equal(await page.locator(".map-name-concepts").count(),0);
    if(id.startsWith("ottoman"))assert.equal(await page.locator("#map-status").count(),0);
    const expected=scenes[i];assert.equal(actual.text,expected.plainBody.join(''),`${id}/${i+1}: 画面の本文と原文が不一致`);
    assert.deepEqual(actual.added,storyEmphasisPlan(expected).map(({key,text,primary})=>({key,text,primary})),`${id}/${i+1}: 追加した強調語`);
    for(const type of ['red-bold','bold'])assert.equal(actual[type==='bold'?'bold':'red'],(expected.body.join('').match(new RegExp('class="[^"\\n]*\\bsource-'+type+'\\b','g'))??[]).length);
    assert.equal(actual.ruby,(expected.body.join('').match(/<ruby>/g)??[]).length);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id}: 横にはみ出し`);
    inspected++;
   }
  }
 }
 // 各章の色・本文色の太字を、同じ配色・太さ・文字サイズで表示する。
 for(const chapter of [1,2,3,4,5,6,7]){
  const volumes=series.filter(v=>v.chapter===chapter);
  const choices=volumes.flatMap(v=>volumeScenes(sourceEdition,v.id).map((scene,index)=>({v,scene,index,plan:storyEmphasisPlan(scene)})));
  const sample=chapter===6?choices.find(c=>c.scene.body.join('').includes('source-red-bold')&&c.scene.body.join('').includes('source-bold')):
   choices.find(c=>c.plan.some(t=>t.primary)&&c.plan.some(t=>!t.primary)&&c.scene.body.join('').includes('source-bold')&&c.scene.plainBody.join('').length<550)??choices[0];
  for(const width of [1280,390])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:900});await page.goto(`${base}/${sample.v.id}-story.html#page-${sample.index+1}`);await page.waitForSelector('button[data-scene]');
   await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;},theme);
   const styles=await page.locator('#scene-body').evaluate(body=>{
    const primary=body.querySelector('.story-key-term,.source-red-bold');
    const secondary=body.querySelector('.story-bold')??body.querySelector('.source-bold');
    const read=node=>{const s=getComputedStyle(node);return {color:s.color,weight:s.fontWeight,size:s.fontSize};};
    return {primary:read(primary),secondary:read(secondary),body:read(body)};
   });
   assert.equal(styles.primary.color,theme==='light'?'rgb(157, 56, 37)':'rgb(255, 180, 159)');
   assert.equal(styles.secondary.color,styles.body.color);assert.equal(styles.primary.weight,'700');assert.equal(styles.secondary.weight,'700');
   assert.equal(styles.primary.size,styles.body.size);assert.equal(styles.secondary.size,styles.body.size);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#narrative').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(output,`chapter-${chapter}-${width}-${theme}.png`),fullPage:true});
  }
 }
 // 既存の太字・読み仮名をまたいでも本文を保ち、再適用で印を増やさない。
 await page.goto(`${base}/c03-l09-p03-story.html`);await page.waitForSelector('button[data-scene]');
 await page.evaluate(async()=>{
  const {decorateStoryBody}=await import('/story-emphasis.js?v=0.082');
  const body=document.createElement('div');body.innerHTML='<p><ruby><span class="source-bold">九品</span><rt>きゅうひん</rt></ruby>中正を始めた。九品中正を学ぶ。</p>';
  const scene={title:'九品中正',body:[body.firstChild.innerHTML],plainBody:['九品中正を始めた。九品中正を学ぶ。'],sourceText:{chapter:3}};
  decorateStoryBody(body,scene);const initial=body.innerHTML;decorateStoryBody(body,scene);
  if(body.innerHTML!==initial||body.querySelector('rt').textContent!=='きゅうひん'||body.querySelectorAll('.source-bold').length!==1)throw Error('太字・読み仮名・再適用の不整合');
  const copy=body.cloneNode(true);copy.querySelectorAll('rt').forEach(n=>n.remove());if(copy.textContent!==scene.plainBody[0])throw Error('読み仮名をまたぐ装飾で本文が変わった');
 });
 // 両方の強調がある03を、明暗・画面幅別に実際の色と太さで確認する。
 for(const width of [1280,390])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:900});await page.goto(`${base}/regional-dynasties-story.html`);await page.waitForSelector('button[data-scene]');
  await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;},theme);
  const styles=await page.locator('#scene-body').evaluate(body=>{const red=body.querySelector('.source-red-bold'),bold=body.querySelector('.source-bold');return {red:getComputedStyle(red).color,bold:getComputedStyle(bold).color,redWeight:getComputedStyle(red).fontWeight,boldWeight:getComputedStyle(bold).fontWeight};});
  assert.notEqual(styles.red,styles.bold);assert.ok(+styles.redWeight>=700&&+styles.boldWeight>=700);
  await page.locator('#narrative').scrollIntoViewIfNeeded();await page.evaluate(()=>window.scrollBy(0,150));await page.screenshot({path:path.join(output,`03-${width}-${theme}.png`),fullPage:true});
 }
 assert.deepEqual(errors,[]);
 console.log(`原文本文と装飾を${inspected}画面で照合し、明暗両方の太字・強調色も確認しました。`);
 console.log('確認画像: '+output);
}finally{await browser?.close();server.kill();}
