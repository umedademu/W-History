import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {splitVolumes,series} from '../public/story-volumes.js';
import {scenes} from '../public/regional-dynasties-scenes.js';
import {pages} from '../public/ottoman-pages.js';
const base='http://127.0.0.1:18767';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,PORT:'18767'},windowsHide:true,stdio:'pipe'});
let browser;
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
 const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
 browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.addInitScript(()=>{window.speechSynthesis?.cancel();if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};HTMLMediaElement.prototype.play=async()=>{};});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const output=await mkdtemp(path.join(os.tmpdir(),'w-history-volumes-'));
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:900});
  await page.goto(base);
  assert.equal(await page.locator('.story-card').count(),14);
  assert.equal(await page.locator('.chapter-card,.catalog-chapters').count(),0);
  assert.deepEqual(await page.locator('.cover-number').allTextContents(),series.map(s=>s.number));
  await page.screenshot({path:path.join(output,`catalog-${width}.png`),fullPage:true});
  for(const s of series){
   await page.goto(base);
   await page.locator(`.story-card[href="/${s.id}-story.html"]`).click();
   await page.waitForSelector('button[data-scene]');
   assert.equal(new URL(page.url()).search,'');
   assert.equal(await page.locator('.story-series-links a').count(),14);
   assert.equal(await page.locator('.story-series-links [aria-current=page]').textContent(),`${s.number} ${s.label}`);
   assert.equal(await page.locator('.reading-chapter,.chapter-end').count(),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const v=splitVolumes.find(v=>v.id===s.id);if(!v)continue;
   const data=v.source==='ottoman'?pages:scenes;
   assert.equal(await page.locator('button[data-scene]').count(),v.pages.length);
   assert.equal(await page.locator('#scene-title').textContent(),data[v.pages[0]].title);
   assert.ok((await page.title()).includes(v.title));
   await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('#story-progress').getAttribute('value'),'2');
   await page.locator('#previous').click();
   assert.equal(await page.locator('#story-progress').getAttribute('value'),'1');
   await page.reload();await page.waitForSelector('button[data-scene]');
   assert.equal(await page.locator('button[data-scene]').count(),v.pages.length);
   if(s.id==='seljuq')await page.screenshot({path:path.join(output,`story-${width}.png`),fullPage:true});
   await page.locator('button[data-scene]').last().click();
   assert.equal(await page.locator('#scene-title').textContent(),data[v.pages.at(-1)].title);
   await page.locator('#next').click();
   await page.waitForURL(`${base}/${series[series.indexOf(s)+1].id}-story.html`);
  }
 }
 assert.deepEqual(errors,[]);
 console.log('14教材の一覧・専用ページ・上部の番号と移動先、小カテゴリの撤去、分割７教材の前後移動・再読込・末尾を幅1280と390で確認しました。');
 console.log('確認画像: '+output);
}finally{await browser?.close();server.kill();}
