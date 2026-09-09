import assert from "node:assert/strict";
import {chromium} from "playwright";
import {spawn} from "node:child_process";
import {existsSync} from "node:fs";
import {mkdtemp} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chapterGroups} from "../public/story-chapters.js";
import {scenes} from "../public/regional-dynasties-scenes.js";
import {pages} from "../public/ottoman-pages.js";

const port=18767,base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,["scripts/serve.mjs"],{cwd:fileURLToPath(new URL("../",import.meta.url)),env:{...process.env,PORT:String(port)},windowsHide:true,stdio:"pipe"});
let browser;
try {
  await new Promise((resolve,reject)=>{server.stdout.once("data",resolve);server.once("error",reject);});
  const executablePath=process.env.W_HISTORY_BROWSER||["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
  browser=await chromium.launch({executablePath,headless:true,args:["--mute-audio"]});
  const page=await browser.newPage({reducedMotion:"reduce"});
  await page.addInitScript(()=>{window.speechSynthesis?.cancel();if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};HTMLMediaElement.prototype.play=async()=>{};});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const output=await mkdtemp(path.join(os.tmpdir(),"w-history-chapters-"));
  for(const width of [1280,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base);
    assert.equal(await page.locator(".story-card").count(),9);
    assert.equal(await page.locator(".catalog-chapters a").count(),7);
    assert.equal(await page.locator("a a").count(),0);
    await page.screenshot({path:path.join(output,`catalog-${width}.png`),fullPage:true});
    for(const [name,chapters] of Object.entries(chapterGroups)) {
      const source=name==="ottoman"?pages:scenes;
      for(let i=0;i<chapters.length;i++) {
        await page.goto(base);
        await page.locator(`.catalog-chapters a[href="/${name}-story.html?chapter=${i+1}"]`).click();
        await page.waitForSelector("button[data-scene]");
        assert.equal(await page.locator("button[data-scene]").count(),chapters[i].pages.length);
        assert.equal(await page.locator("#scene-title").textContent(),source[chapters[i].pages[0]].title);
        assert.ok((await page.locator(".reading-chapter h1").textContent()).includes(chapters[i].title));
        assert.equal(await page.locator(".reading-chapter [aria-current=page]").count(),1);
        assert.ok(await page.locator("#previous").isDisabled());
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#story-progress").getAttribute("value"),"2");
        await page.locator("#previous").click();
        assert.equal(await page.locator("#story-progress").getAttribute("value"),"1");
        await page.reload();
        await page.waitForSelector("button[data-scene]");
        assert.equal(await page.locator("button[data-scene]").count(),chapters[i].pages.length);
        if(i===1)await page.screenshot({path:path.join(output,`${name}-${width}.png`),fullPage:true});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name}: 横にはみ出し`);
        await page.locator("button[data-scene]").last().click();
        assert.equal(await page.locator("#scene-title").textContent(),source[chapters[i].pages.at(-1)].title);
        await page.locator("#next").click();
        if(i+1<chapters.length) {
          await page.waitForURL(`${base}/${name}-story.html?chapter=${i+2}`);
          await page.waitForSelector("button[data-scene]");
          assert.equal(await page.locator("#scene-title").textContent(),source[chapters[i+1].pages[0]].title);
        } else await page.waitForURL(base+"/");
      }
      for(const query of ["","?chapter=999","?chapter=bad"]) {
        await page.goto(`${base}/${name}-story.html${query}`);
        await page.waitForSelector("button[data-scene]");
        assert.equal(await page.locator("button[data-scene]").count(),chapters[0].pages.length);
      }
    }
  }
  assert.deepEqual(errors,[]);
  console.log("７章の一覧入口・見出し・ページ数・再読込・前後移動・章末・不正な指定・横幅を、1280pxと390pxで確認しました。");
  console.log("確認画像: "+output);
} finally {await browser?.close();server.kill();}
