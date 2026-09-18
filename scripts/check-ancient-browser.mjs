import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ancientEdition} from '../public/ancient-edition.js';
import {ancientSeries} from '../public/ancient-volumes.js';
import {ancientNamesInText} from '../public/ancient-geography.js';
import {normalizeMapName} from '../public/map-name-coverage.js';
const root=fileURLToPath(new URL('../',import.meta.url)),base='http://127.0.0.1:18769';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'18769'},windowsHide:true,stdio:'pipe'});
let browser;
try {
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('確認用サーバーが終了: '+code)));});
  const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
  browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
  const page=await browser.newPage({reducedMotion:'reduce'});
  // ページを開く前に、自動読み上げと音声再生を無効にする。
  await page.addInitScript(()=>{window.speechSynthesis?.cancel();if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};HTMLMediaElement.prototype.play=async()=>{};});
  const errors=[],issues=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const output=await mkdtemp(path.join(os.tmpdir(),'w-history-ancient-'));
  let inspected=0;
  for(const width of [1280,390]) {
    await page.setViewportSize({width,height:900});await page.goto(base);
    assert.equal(await page.locator('.story-card').count(),21);
    for(const lesson of [1,2,3])assert.equal(await page.locator(`[aria-labelledby="lesson-${lesson}"] .story-card`).count(),4);
    await page.screenshot({path:path.join(output,`catalog-${width}.png`),fullPage:true});
    for(const v of ancientSeries) {
      const scenes=ancientEdition[v.id];
      await page.goto(`${base}/${v.id}-story.html`);await page.waitForSelector('button[data-scene]');
      assert.equal(await page.locator('button[data-scene]').count(),scenes.length);
      assert.equal(await page.locator('.story-series-links a').count(),12);
      for(let i=0;i<scenes.length;i++) {
        const expected=scenes[i];
        await page.locator('button[data-scene]').nth(i).evaluate(b=>b.click());
        await page.waitForFunction(id=>document.querySelector('#story-map').dataset.scene===id,expected.id);
        await page.waitForFunction(()=>[...document.querySelectorAll('#map-characters img')].every(i=>i.complete&&i.naturalWidth>0));
        await page.waitForTimeout(100);
        const actual=await page.evaluate(()=>{
          const body=document.querySelector('#scene-body').cloneNode(true);body.querySelectorAll('rt').forEach(n=>n.remove());
          const map=document.querySelector('#story-map'),rect=map.getBoundingClientRect();
          const visible=n=>{const b=n.getBoundingClientRect();return b.width>0&&b.height>0&&getComputedStyle(n).visibility!=='hidden';};
          const labels=[...map.querySelectorAll('text'),...document.querySelectorAll('#map-characters .history-name')].filter(visible);
          const boxes=labels.map(n=>({text:n.textContent,b:n.getBoundingClientRect()}));
          const overflow=boxes.filter(({b})=>b.left<rect.left-1||b.right>rect.right+1||b.top<rect.top-1||b.bottom>rect.bottom+1).map(x=>x.text);
          const overlaps=[];
          for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++) {
            const x=boxes[a].b,y=boxes[b].b;
            if(x.left<y.right-1&&x.right>y.left+1&&x.top<y.bottom-1&&x.bottom>y.top+1)overlaps.push([boxes[a].text,boxes[b].text]);
          }
          const image=map.querySelector('image');
          return {text:body.textContent,title:document.querySelector('#scene-title').textContent,
            shown:boxes.map(x=>x.text),overflow,overlaps,red:body.querySelectorAll('.source-red-bold').length,bold:body.querySelectorAll('.source-bold').length,
            viewportOverflow:document.documentElement.scrollWidth>innerWidth,
            longitude:rect.width/Number(image.getAttribute('width'))*360,latitude:rect.height/Number(image.getAttribute('height'))*180};
        });
        assert.equal(actual.text,expected.plainBody.join(''),`${v.id}/${i+1}: 表示本文`);
        assert.equal(actual.title,expected.title);
        assert.equal(actual.bold,(expected.body.join('').match(/source-bold/g)||[]).length);
        assert.equal(actual.red,0,'原画像で未確認の赤字を付けない');
        assert.ok(actual.longitude>=32-1e-6&&actual.latitude>=24-1e-6,'共通の拡大上限');
        const names=ancientNamesInText(actual.title+'。'+actual.text),shown=actual.shown.map(normalizeMapName);
        const missing=names.filter(n=>!shown.some(s=>s.includes(n.key))).map(n=>n.name);
        const extra=actual.shown.filter(n=>!normalizeMapName(actual.title+'。'+actual.text).includes(normalizeMapName(n)));
        if(missing.length||extra.length||actual.overflow.length||actual.overlaps.length||actual.viewportOverflow)issues.push({width,id:expected.id,missing,extra,overflow:actual.overflow,overlaps:actual.overlaps,viewportOverflow:actual.viewportOverflow});
        if(['ancient-egypt-022','north-india-029','indus-002'].includes(expected.id))await page.screenshot({path:path.join(output,`${expected.id}-${width}.png`),fullPage:true});
        inspected++;
      }
      await page.locator('button[data-scene]').first().click();
      await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#story-progress').getAttribute('value'),'2');
      await page.locator('#previous').click();assert.equal(await page.locator('#story-progress').getAttribute('value'),'1');
      await page.goto('about:blank');
      await page.goto(`${base}/${v.id}-story.html#page-${scenes.length}`);await page.waitForSelector('button[data-scene]');
      assert.equal(await page.locator('#story-progress').getAttribute('value'),String(scenes.length));
      await page.reload();await page.waitForSelector('button[data-scene]');
      assert.equal(await page.locator('#story-progress').getAttribute('value'),String(scenes.length));
      await page.locator('#next').click();
      const next=ancientSeries[ancientSeries.indexOf(v)+1]?.id??'islam-origin';
      await page.waitForURL(`${base}/${next}-story.html`);
      console.log(`${width}: ${v.label} ${scenes.length}ページ確認`);
    }
  }
  // 動きを減らさない通常表示でも、再生・再表示・途中の移動が完了する。
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/vedic-india-story.html');await page.waitForSelector('button[data-scene]');
  await page.waitForFunction(()=>document.querySelector('#story-map').dataset.phase==='complete');
  await page.locator('#replay').click();
  await page.waitForFunction(()=>document.querySelector('#story-map').dataset.phase==='moving');
  await page.locator('#next').click();
  await page.waitForFunction(()=>document.querySelector('#story-map').dataset.phase==='complete');
  assert.equal(await page.locator('#story-map').getAttribute('data-scene'),'vedic-india-002');
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1280,390])for(const theme of ['light','dark']) {
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/indus-story.html#page-2');await page.waitForSelector('button[data-scene]');
    await page.evaluate(theme=>{localStorage.setItem('w-history-theme',theme);document.documentElement.dataset.theme=theme;},theme);
    await page.waitForTimeout(150);
    await page.screenshot({path:path.join(output,`indus-${width}-${theme}.png`),fullPage:true});
  }
  await writeFile(path.join(output,'issues.json'),JSON.stringify({errors,issues},null,2));
  console.log(`原文・名称・画面配置を${inspected}画面で照合。確認画像: ${output}`);
  if(issues.length)console.log(JSON.stringify(issues,null,2));
  assert.deepEqual(errors,[]);assert.deepEqual(issues,[]);
}finally{await browser?.close();server.kill();}
