import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {modernEdition,sourcePages} from '../public/modern-c01-l01-edition.js';
import {modernSeries} from '../public/modern-volumes.js';
import {series} from '../public/story-volumes.js';
import {allEditions} from '../public/all-editions.js';
import {namesForScene,normalizeMapName} from '../public/map-name-coverage.js';
import {modernReferencePages} from '../public/modern-story-support.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const base='http://127.0.0.1:18811';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'18811'},windowsHide:true,stdio:'pipe'});
let browser;
try {
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('確認用サーバーが終了: '+code)));});
  const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
  browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
  const page=await browser.newPage({reducedMotion:'reduce'});
  // 最初に読み上げと音声を止めてから、確認対象を開く。
  await page.addInitScript(()=>{window.speechSynthesis?.cancel();if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};HTMLMediaElement.prototype.play=async()=>{};});
  const errors=[],issues=[],seenPages=new Set(),seenDiagrams=new Set();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const output=await mkdtemp(path.join(os.tmpdir(),'w-history-modern-browser-'));
  let inspected=0;
  for(const width of [1280,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/?book=ancient');
    await page.waitForSelector('[data-book-tab="ancient"][aria-selected="true"]');
    assert.equal(await page.locator('#ancient-book .part-link').count(),128);
    assert.equal(await page.locator('#modern-book').isVisible(),false);
    await page.locator('[data-book-tab="modern"]').click();
    assert.equal(await page.locator('#ancient-book').isVisible(),false);
    assert.equal(await page.locator('#modern-book .part-link').count(),5);
    await page.locator('#modern-chapter-1>summary').click();
    await page.screenshot({path:path.join(output,`modern-catalog-${width}.png`),fullPage:true});
    await page.reload();
    assert.equal(await page.locator('[data-book-tab="modern"]').getAttribute('aria-selected'),'true');
    await page.goto(base+'/#chapter-1');
    assert.equal(await page.locator('#ancient-book').isVisible(),true,'旧章の直接リンクは保存された巻より優先');
    await page.goto(base+'/?book=modern');
    await page.locator('[data-book-tab="modern"]').focus();
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#ancient-book').isVisible(),true);
    await page.keyboard.press('End');
    assert.equal(await page.locator('#modern-book').isVisible(),true);
    await page.locator('#modern-chapter-1>summary').click();
    await page.locator('#modern-book .part-link').first().click();
    await page.waitForSelector('button[data-scene]');

    for(const theme of ['light','dark']) {
      await page.evaluate(value=>localStorage.setItem('w-history-theme',value),theme);
      for(const [vIndex,volume] of modernSeries.entries()) {
        const scenes=modernEdition[volume.id];
        await page.goto(`${base}/${volume.id}-story.html`);
        await page.waitForSelector('button[data-scene]');
        assert.equal(await page.locator('button[data-scene]').count(),scenes.length);
        assert.equal(await page.locator('.story-series-links a').count(),5);
        for(const [i,expected] of scenes.entries()) {
          await page.locator('button[data-scene]').nth(i).evaluate(b=>b.click());
          await page.waitForFunction(id=>document.querySelector('#story-map').dataset.scene===id,expected.id);
          await page.waitForTimeout(100);
          const actual=await page.evaluate(html=>{
            const body=document.querySelector('#scene-body').cloneNode(true);body.querySelectorAll('rt').forEach(n=>n.remove());
            const template=document.createElement('div');template.innerHTML=html;
            const map=document.querySelector('#story-map'),rect=map.getBoundingClientRect();
            const boxes=[...map.querySelectorAll('text')].map(n=>({text:n.textContent,b:n.getBoundingClientRect()}));
            const overflow=boxes.filter(({b})=>b.left<rect.left-1||b.right>rect.right+1||b.top<rect.top-1||b.bottom>rect.bottom+1).map(x=>x.text);
            const overlaps=[];
            for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++) {
              const x=boxes[a].b,y=boxes[b].b;
              if(x.left<y.right-1&&x.right>y.left+1&&x.top<y.bottom-1&&x.bottom>y.top+1)overlaps.push([boxes[a].text,boxes[b].text]);
            }
            const selectors=['strong','ruby','[data-source-color="red"]','u','[data-source-background]'];
            const image=map.querySelector('image');
            return {paragraphs:[...body.querySelectorAll(':scope > p')].map(p=>p.textContent),shown:boxes.map(x=>x.text),overflow,overlaps,
              decoration:selectors.map(s=>[document.querySelector('#scene-body').querySelectorAll(s).length,template.querySelectorAll(s).length]),
              viewportOverflow:document.documentElement.scrollWidth>innerWidth,
              longitude:rect.width/Number(image.getAttribute('width'))*360,latitude:rect.height/Number(image.getAttribute('height'))*180,
              diagram:document.querySelector('#modern-diagram').hidden?null:document.querySelector('#modern-diagram h3').textContent,
              reference:document.querySelector('#source-reference-body').innerHTML};
          },expected.body.map(p=>'<p>'+p+'</p>').join(''));
          assert.deepEqual(actual.paragraphs,expected.plainBody,`${expected.id}: 本文をそのまま表示`);
          for(const [shown,wanted] of actual.decoration)assert.equal(shown,wanted,`${expected.id}: 原資料の装飾`);
          assert.ok(actual.longitude>=32-1e-6&&actual.latitude>=24-1e-6,'共通の地理図拡大上限');
          const names=namesForScene(expected,expected.title+'。'+expected.plainBody.join('')).filter(n=>n.kind!=='concept');
          const shown=actual.shown.map(normalizeMapName);
          const missing=names.filter(n=>!shown.some(s=>s.includes(n.key))).map(n=>n.name);
          const extra=actual.shown.filter(n=>!normalizeMapName(expected.title+'。'+expected.plainBody.join('')).includes(normalizeMapName(n)));
          if(missing.length||extra.length||actual.overflow.length||actual.overlaps.length||actual.viewportOverflow)issues.push({width,theme,id:expected.id,missing,extra,overflow:actual.overflow,overlaps:actual.overlaps,viewportOverflow:actual.viewportOverflow});
          const pages=modernReferencePages(expected,volume,i);
          for(const sourcePage of pages)seenPages.add(sourcePage);
          const expectedReference=await page.evaluate(html=>{const e=document.createElement('div');e.innerHTML=html;return e.innerHTML;},pages.map(n=>sourcePages[n]).join(''));
          assert.equal(actual.reference,expectedReference,'関係する原書ページを全文掲載');
          assert.equal(await page.locator('#source-reference').getAttribute('open'),null);
          if(actual.diagram)seenDiagrams.add(actual.diagram);
          if(i===0||actual.diagram&&theme==='light')await page.screenshot({path:path.join(output,`${expected.id}-${width}-${theme}.png`),fullPage:true});
          inspected++;
        }
        await page.locator('#source-reference summary').click();
        assert.equal(await page.locator('#source-reference-body').isVisible(),true);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'図表の横スクロールをページ全体にはみ出させない');
        await page.screenshot({path:path.join(output,`supplement-${volume.part}-${width}-${theme}.png`),fullPage:true});
        await page.reload();await page.waitForSelector('button[data-scene]');
        assert.equal(await page.locator('#story-progress').getAttribute('value'),String(scenes.length));
        await page.locator('#next').click();
        await page.waitForURL(vIndex<modernSeries.length-1?`${base}/${modernSeries[vIndex+1].id}-story.html`:`${base}/?book=modern#modern-book`);
        if(vIndex===modernSeries.length-1)assert.equal(await page.locator('#modern-book').isVisible(),true);
        await page.goto(`${base}/${volume.id}-story.html`);await page.waitForSelector('button[data-scene]');
        assert.equal(await page.locator('#previous').isDisabled(),true);
        await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#story-progress').getAttribute('value'),'2');
        await page.locator('#previous').click();assert.equal(await page.locator('#story-progress').getAttribute('value'),'1');
        await page.locator('.home-link').click();await page.waitForURL(`${base}/?book=modern#modern-book`);
        assert.equal(await page.locator('#modern-book').isVisible(),true);
      }
    }
    // 共通処理の変更後も、両端の旧教材で本文と移動先を確認する。
    for(const volume of [series[0],series.at(-1)]) {
      await page.goto(`${base}/${volume.id}-story.html`);await page.waitForSelector('button[data-scene]');
      const expected=allEditions[volume.sections[0]][0];
      const actual=await page.locator('#scene-body').evaluate(node=>{const e=node.cloneNode(true);e.querySelectorAll('rt').forEach(n=>n.remove());return e.textContent;});
      assert.equal(actual,expected.plainBody.join(''));
      if(volume===series.at(-1)) {
        await page.locator('button[data-scene]').last().click();await page.locator('#next').click();
        await page.waitForURL(`${base}/?book=ancient#ancient-book`);
        assert.equal(await page.locator('#ancient-book').isVisible(),true);
      }
    }
  }
  assert.deepEqual([...seenPages].sort((a,b)=>a-b),Array.from({length:26},(_,i)=>i+15),'原書26ページすべてへ到達できる');
  assert.equal(seenDiagrams.size,3,'三つの対立図を表示する');
  await writeFile(path.join(output,'result.json'),JSON.stringify({inspected,errors,issues,pages:[...seenPages],diagrams:[...seenDiagrams]},null,2));
  console.log('確認画像と結果: '+output);
  assert.deepEqual(errors,[]);
  assert.deepEqual(issues,[],'地図の名前・文字の重なり・はみ出し');
  console.log(`近代・現代の全${Object.values(modernEdition).flat().length}場面を幅1280・390、明暗両方で計${inspected}回確認しました。2巻の切替・本文と装飾・原書26ページの補足・3図・末尾移動・旧教材の両端も確認済みです。`);
} finally {await browser?.close();server.kill();}
