import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceEdition} from '../public/source-edition.js';
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
  for(const [id,scenes] of Object.entries({...sourceEdition,timur:[...sourceEdition.timur,...sourceEdition["timur-after"]]}).filter(([id])=>id!=="timur-after")){
   await page.goto(`${base}/${id}-story.html`);await page.waitForSelector('button[data-scene]');
   for(let i=0;i<scenes.length;i++){
    await page.locator('button[data-scene]').nth(i).evaluate(b=>b.click());
    await page.waitForFunction(n=>Number(document.querySelector('#story-progress').value)===n,i+1);
    const actual=await page.locator('#scene-body').evaluate(body=>{const copy=body.cloneNode(true);copy.querySelectorAll('rt').forEach(n=>n.remove());return {text:copy.textContent,red:body.querySelectorAll('.source-red-bold').length,bold:body.querySelectorAll('.source-bold').length,ruby:body.querySelectorAll('ruby').length};});
    const expected=scenes[i];assert.equal(actual.text,expected.plainBody.join(''),`${id}/${i+1}: 画面の本文と原文が不一致`);
    for(const type of ['red-bold','bold'])assert.equal(actual[type==='bold'?'bold':'red'],(expected.body.join('').match(new RegExp('class="[^"\\n]*\\bsource-'+type+'\\b','g'))??[]).length);
    assert.equal(actual.ruby,(expected.body.join('').match(/<ruby>/g)??[]).length);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id}: 横にはみ出し`);
    inspected++;
   }
  }
 }
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
