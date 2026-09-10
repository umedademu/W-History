import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceEdition} from '../public/source-edition.js';
const base='http://127.0.0.1:18769';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,PORT:'18769'},windowsHide:true,stdio:'pipe'});
let browser;
try {
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
 const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
 browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.addInitScript(()=>{window.speechSynthesis?.cancel();if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};HTMLMediaElement.prototype.play=async()=>{};});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const output=await mkdtemp(path.join(os.tmpdir(),'w-history-ottoman-layout-'));
 const styles=()=>{
  const p=document.querySelector('#scene-body p'),style=getComputedStyle(p);
  return Object.fromEntries(['paddingTop','paddingRight','paddingBottom','paddingLeft','borderLeftWidth','backgroundColor','fontSize','lineHeight'].map(k=>[k,style[k]]));
 };
 for(const width of [1280,390])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:900});
  await page.goto(base+'/safavid-story.html');await page.waitForSelector('button[data-scene]');
  await page.evaluate(t=>{document.documentElement.dataset.theme=t;},theme);
  const expectedStyle=await page.evaluate(styles);
  for(const id of ['ottoman','ottoman-expansion','ottoman-height']){
   await page.goto(base+'/'+id+'-story.html');await page.waitForSelector('button[data-scene]');
   await page.evaluate(t=>{document.documentElement.dataset.theme=t;},theme);
   assert.deepEqual(await page.evaluate(styles),expectedStyle,id+': 本文の余白・背景を共通化');
   assert.equal(await page.locator('.story-stage').count(),1);
   assert.equal(await page.locator('.animation-controls,.map-location,#orientation-note,#scene-content').count(),0);
   const order=await page.evaluate(()=>{
    const rect=q=>document.querySelector(q).getBoundingClientRect();
    return {mapBeforeText:rect('.map-panel').bottom<=rect('#narrative').top+1,textBeforePages:rect('#narrative').bottom<=rect('#scene-nav').top,controls:getComputedStyle(document.querySelector('.story-controls')).position,overflow:document.documentElement.scrollWidth>innerWidth};
   });
   assert.deepEqual(order,{mapBeforeText:true,textBeforePages:true,controls:'fixed',overflow:false});
   assert.equal(await page.locator('#next').textContent(),'次へ →');
   assert.equal(await page.locator('#previous').textContent(),'← 前へ');
   for(let i=0;i<sourceEdition[id].length;i++){
    await page.locator('button[data-scene]').nth(i).evaluate(b=>b.click());
    const body=await page.locator('#scene-body').evaluate(n=>{const copy=n.cloneNode(true);copy.querySelectorAll('rt').forEach(n=>n.remove());return copy.textContent;});
    assert.equal(body,sourceEdition[id][i].plainBody.join(''));
    assert.equal(await page.locator('#story-map').getAttribute('data-scene'),sourceEdition[id][i].id);
   }
   await page.locator('button[data-scene]').first().click();
   await page.screenshot({path:path.join(output,id+'-'+width+'-'+theme+'.png'),fullPage:true});
  }
 }
 // 通常の動きでも本文は直ちに表示し、地図の押し直しで動きをやり直す。
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(const id of ['ottoman','ottoman-expansion','ottoman-height']){
  await page.goto(base+'/'+id+'-story.html');await page.waitForSelector('button[data-scene]');
  assert.ok(await page.locator('#scene-body').isVisible());
  await page.waitForFunction(()=>Number(document.querySelector('#story-map').dataset.progress)>.08);
  await page.locator('#replay').click();
  assert.ok(Number(await page.locator('#story-map').getAttribute('data-progress'))<.08);
  assert.equal(await page.locator('#story-progress').getAttribute('value'),'1');
  await page.locator('#next').click();assert.equal(await page.locator('#story-progress').getAttribute('value'),'2');
  await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#story-progress').getAttribute('value'),'1');
 }
 assert.deepEqual(errors,[]);
 console.log('09〜11の27ページを明暗・幅1280と390で確認。地図→本文の順、共通の本文書式、操作、通常再生と押し直しも確認しました。');
 console.log('確認画像: '+output);
} finally {await browser?.close();server.kill();}
