import {chromium} from 'playwright';
import {splitVolumes} from '../public/story-volumes.js';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
const base=fileURLToPath(new URL('../',import.meta.url));
const port=Number(process.env.W_HISTORY_TEST_PORT||18766);
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:base,env:{...process.env,PORT:String(port)},windowsHide:true,stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('確認用サーバーが終了しました: '+code)));});
const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
let browser;
try {
const {namesInText,normalizeMapName}=await import(pathToFileURL(base+'public/map-name-coverage.js'));
browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
await page.addInitScript(()=>{window.speechSynthesis?.cancel();if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};HTMLMediaElement.prototype.play=async()=>{};});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results=[];
for(const width of [1280,390]){
 await page.setViewportSize({width,height:900});
 for(const {name,chapter,expected} of ['islam-origin','umayyad-abbasid','regional-dynasties','timur','timur-after','safavid','ottoman','mughal','islamic-culture'].filter(name=>!process.argv[2]||name===process.argv[2]).flatMap(name=>splitVolumes.some(v=>v.source===name)?splitVolumes.filter(v=>v.source===name).map(v=>({name:v.id,chapter:0,expected:v.pages.length})):[{name,chapter:0,expected:({'islam-origin':27,'umayyad-abbasid':27,timur:13,'timur-after':16,safavid:20,mughal:20,'islamic-culture':19})[name]}])){
  await page.goto('http://127.0.0.1:'+port+'/'+name+'-story.html'+(chapter?'?chapter='+chapter:''));
  // 地図本体にも data-scene があるため、移動ボタンだけ数える。
  const buttons=page.locator('button[data-scene]');const total=await buttons.count();
  if(total!==expected)throw new Error(name+': ページ数が一致しません');
  for(let i=0;i<total;i++){
   await buttons.nth(i).evaluate(button=>button.click());
   if(await page.locator('#skip-orientation').isVisible().catch(()=>false)) await page.locator('#skip-orientation').click();
   const skip=page.getByRole('button',{name:'説明へ進む',exact:true}); if(await skip.isVisible().catch(()=>false))await skip.click();
   await page.waitForFunction(n=>Number(document.querySelector('#story-progress').value)===n,i+1);
   await page.waitForFunction(()=>!document.querySelector('#story-map')?.classList.contains('is-orienting'));
   await page.waitForTimeout(50);
   if(await page.locator('#map-characters').count())await page.waitForFunction(()=>!document.querySelector('#map-characters')?.querySelector('img:not([src])')).catch(()=>{});
   await page.waitForFunction(()=>{const root=document.querySelector('#map-characters');return !root||getComputedStyle(root).opacity!=='0';},{},{timeout:10000});
   await page.waitForTimeout(80);
   const data=await page.evaluate(()=>{
    const map=document.querySelector('#story-map');const r=map.getBoundingClientRect();
    const visible=n=>{for(let e=n;e;e=e.parentElement){const s=getComputedStyle(e);if(e.hidden||s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;}const b=n.getBoundingClientRect();return b.width>0&&b.height>0;};
    const nodes=[...map.querySelectorAll('text'),...document.querySelectorAll('#map-characters [class$="-name"],.map-concept-name,.map-action-status,.map-relation,.map-ancestor')];
    const shown=nodes.filter(visible).map(n=>n.textContent);
    const textNodes=[...map.querySelectorAll('text'),...document.querySelectorAll('#map-characters [class$="-name"]')].filter(visible);
    const overflow=textNodes.filter(n=>{const b=n.getBoundingClientRect();return b.left<r.left-1||b.right>r.right+1||b.top<r.top-1||b.bottom>r.bottom+1;}).map(n=>n.textContent);
    const boxes=textNodes.filter(n=>n.dataset.layoutLabel).map(n=>({text:n.textContent,b:n.getBoundingClientRect()}));
    const overlaps=[];for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++){const x=boxes[a].b,y=boxes[b].b;if(x.left<y.right-1&&x.right>y.left+1&&x.top<y.bottom-1&&x.bottom>y.top+1)overlaps.push([boxes[a].text,boxes[b].text]);}
    return {text:document.querySelector('#scene-title').textContent+'。'+document.querySelector('#scene-body').textContent,shown,overflow,overlaps,height:map.clientHeight};
   });
   const required=namesInText(data.text),shown=data.shown.map(normalizeMapName),body=normalizeMapName(data.text);
   const missing=required.filter(n=>!shown.some(s=>s.includes(n.key))).map(n=>n.name);
   const extra=namesInText(data.shown.join('。')).filter(n=>!body.includes(n.key)).map(n=>n.name);
   if(missing.length||extra.length||data.overflow.length||data.overlaps.length||errors.length)results.push({width,name,chapter,page:i+1,missing,extra,overflow:data.overflow,overlaps:data.overlaps,height:data.height,errors:errors.splice(0)});
  }

  console.log(width,name,chapter,total,'issues',results.filter(x=>x.width===width&&x.name===name).length);
 }
}

console.log(JSON.stringify(results,null,2));
if(results.length)process.exitCode=1;
console.log('表示検査の問題件数:',results.length);
} finally { await browser?.close();server.kill(); }
