import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {existsSync} from 'node:fs';
import {mkdtemp,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const {chromium}=createRequire(path.join(root,'package.json'))('playwright');
const load=name=>import(pathToFileURL(path.join(root,'public',name)).href);
const [{modernEdition,sourcePages},{modernVisualEdition,modernIllustrationFor,modernVisualScenePlans},{modernSeries:allModernSeries},{series},{allEditions},{namesForScene,normalizeMapName},{modernReferencePages}]=await Promise.all([
  load('modern-c01-l01-edition.js'),load('modern-story-visuals.js'),load('modern-volumes.js'),load('story-volumes.js'),load('all-editions.js'),load('map-name-coverage.js'),load('modern-story-support.js')
]);
const modernSeries = allModernSeries.filter(volume=>volume.lesson===1);
const port=process.env.W_HISTORY_MODERN_CHECK_PORT??'18811',base='http://127.0.0.1:'+port;
const server=spawn(process.execPath,[path.join(root,'scripts/serve.mjs')],{cwd:root,env:{...process.env,PORT:port},windowsHide:true,stdio:'pipe'});

async function muteBeforeOpening(page) {
  // 読み上げを無効にし、音声再生の入口も止めてから検査対象を開く。
  await page.addInitScript(()=>{
    localStorage.setItem('w-history-auto-read','false');
    window.speechSynthesis?.cancel();
    if(window.speechSynthesis)window.speechSynthesis.speak=()=>{};
    HTMLMediaElement.prototype.play=async()=>{};
  });
}
async function settleScene(page,scene) {
  await page.waitForFunction(id=>document.querySelector('#story-map')?.dataset.scene===id&&document.querySelector('#story-map')?.dataset.phase==='complete',scene.id);
  await page.waitForFunction(()=>[...document.querySelectorAll('#map-characters img,#modern-illustration img')].every(image=>image.complete&&image.naturalWidth>0)&&getComputedStyle(document.querySelector('#map-characters')).opacity==='1');
  // 読み込み後の配置と画像の透過範囲の計算が終わるまで待つ。
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
function watchErrors(page,errors) {
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
}
function artworkFile(key) {return '/images/'+(key.includes('/')?key:'modern-c01-l01/'+key)+(/\.png$/.test(key)?'':'.png');}

// 透明な余白は衝突範囲に数えず、実際の絵・姓名・吹き出しを調べる。
function readScene(html) {
  const body=document.querySelector('#scene-body').cloneNode(true);body.querySelectorAll('rt').forEach(node=>node.remove());
  const template=document.createElement('div');template.innerHTML=html;
  const map=document.querySelector('#story-map'),rect=map.getBoundingClientRect();
  const box=node=>{const b=node.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height};};
  const visible=node=>node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden'&&getComputedStyle(node).display!=='none';
  const mapNodes=[...document.querySelectorAll('#map-characters .history-map-item')];
  const owner=node=>{const item=node.closest('.history-map-item');return item?String(mapNodes.indexOf(item)):null;};
  const labels=[...map.querySelectorAll('text'),...document.querySelectorAll('#map-characters .history-name')].filter(visible).map(node=>({text:node.textContent,type:'name',owner:owner(node),b:box(node)}));
  const bubbles=[...document.querySelectorAll('#map-characters .history-bubble')].filter(node=>visible(node)&&node.textContent).map(node=>({text:node.textContent,type:'bubble',owner:owner(node),name:node.closest('.history-map-item').dataset.name,b:box(node)}));
  const art=image=>{
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
    const data=context.getImageData(0,0,canvas.width,canvas.height).data;
    let left=canvas.width,top=canvas.height,right=-1,bottom=-1;
    for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
    const b=box(image),fit=getComputedStyle(image).objectFit;
    const scale=Math.min(b.width/canvas.width,b.height/canvas.height),sx=fit==='contain'?scale:b.width/canvas.width,sy=fit==='contain'?scale:b.height/canvas.height;
    const x=b.left+(b.width-canvas.width*sx)/2,y=b.top+(b.height-canvas.height*sy)/2;
    return {left:x+left*sx,right:x+(right+1)*sx,top:y+top*sy,bottom:y+(bottom+1)*sy,width:(right-left+1)*sx,height:(bottom-top+1)*sy};
  };
  const mapImages=[...document.querySelectorAll('#map-characters .history-figure img')].filter(visible).map(image=>({name:image.alt,owner:owner(image),bubble:image.closest('.history-figure').querySelector('.history-bubble').textContent,src:new URL(image.currentSrc||image.src).pathname,width:image.naturalWidth,height:image.naturalHeight,fitted:image.dataset.spriteFitted==='true',b:art(image),figure:box(image.closest('.history-figure'))}));
  const drawings=mapImages.map(image=>({text:image.name,type:'art',owner:image.owner,b:image.b}));
  const all=[...labels,...bubbles,...drawings],overflow=[];
  for(const item of [...all,...mapImages.map(image=>({text:image.name+'（表示枠）',b:image.figure}))])if(item.b.left<rect.left-1||item.b.right>rect.right+1||item.b.top<rect.top-1||item.b.bottom>rect.bottom+1)overflow.push(item.text);
  const overlaps=[];
  for(let a=0;a<all.length;a++)for(let b=a+1;b<all.length;b++) {
    const first=all[a],second=all[b],x=first.b,y=second.b;
    if(x.left<y.right-1&&x.right>y.left+1&&x.top<y.bottom-1&&x.bottom>y.top+1)overlaps.push([first.type+': '+first.text,second.type+': '+second.text]);
  }
  const panel=document.querySelector('#modern-illustration'),illustrationHidden=panel.hidden;
  const figures=illustrationHidden?[]:[...panel.querySelectorAll('figure.illustration-figure')].map(figure=>{
    const image=figure.querySelector('img'),name=figure.querySelector('.illustration-name'),caption=figure.querySelector('.illustration-caption');
    return {name:name?.textContent,caption:caption?.textContent??'',src:image?new URL(image.currentSrc||image.src).pathname:null,width:image?.naturalWidth??0,height:image?.naturalHeight??0,b:box(figure),nameBox:name?box(name):null,captionBox:caption?box(caption):null,art:image?art(image):null};
  });
  const parts=figures.flatMap(figure=>[{text:'絵: '+figure.name,b:figure.art},{text:'姓名: '+figure.name,b:figure.nameBox},{text:'説明: '+figure.name,b:figure.captionBox}]).filter(part=>part.b?.width>0&&part.b?.height>0);
  if(!illustrationHidden)parts.push(...[...panel.querySelectorAll('h3,h4,.illustration-note')].filter(visible).map(node=>({text:'見出し: '+node.textContent,b:box(node)})));
  const panelBox=box(panel);
  const illustrationOverflow=[...figures.map(figure=>({text:figure.name,b:figure.b})),...parts].filter(part=>part.b.left<Math.max(0,panelBox.left)-1||part.b.right>Math.min(innerWidth,panelBox.right)+1||part.b.top<panelBox.top-1||part.b.bottom>panelBox.bottom+1).map(part=>part.text);
  const illustrationOverlaps=[];
  for(let a=0;a<parts.length;a++)for(let b=a+1;b<parts.length;b++) {
    const x=parts[a].b,y=parts[b].b;
    if(x.left<y.right-1&&x.right>y.left+1&&x.top<y.bottom-1&&x.bottom>y.top+1)illustrationOverlaps.push([parts[a].text,parts[b].text]);
  }
  const selectors=['strong','ruby','[data-source-color="red"]','u','[data-source-background]'],image=map.querySelector('image');
  return {paragraphs:[...body.querySelectorAll(':scope > p')].map(node=>node.textContent),shown:labels.map(item=>item.text),bubbles:bubbles.map(item=>({name:item.name,text:item.text})),mapImages,overflow,overlaps,figures,illustrationHidden,illustrationOverflow,illustrationOverlaps,
    bodyBottom:document.querySelector('#scene-body').getBoundingClientRect().bottom,illustrationTop:panelBox.top,
    decoration:selectors.map(selector=>[document.querySelector('#scene-body').querySelectorAll(selector).length,template.querySelectorAll(selector).length]),
    viewportOverflow:document.documentElement.scrollWidth>innerWidth,
    longitude:rect.width/Number(image.getAttribute('width'))*360,latitude:rect.height/Number(image.getAttribute('height'))*180,
    diagram:document.querySelector('#modern-diagram').hidden?null:document.querySelector('#modern-diagram h3').textContent,
    reference:document.querySelector('#source-reference-body').innerHTML};
}

async function checkMotion(browser,output,errors) {
  const page=await browser.newPage({reducedMotion:'no-preference',viewport:{width:1280,height:900}});
  await muteBeforeOpening(page);watchErrors(page,errors);
  const candidates=modernSeries.flatMap(volume=>modernVisualEdition[volume.id].map((scene,index)=>({volume,scene,index}))),cases=[];
  const switches=candidates.filter(({scene})=>[...(scene.actors??[]),...(scene.props??[])].some(item=>item.afterImage));
  const mover=candidates.find(({scene})=>[...(scene.actors??[]),...(scene.props??[])].some(item=>item.route!==undefined));
  assert.ok(mover,'通常の動きで移動を確認する場面がある');assert.ok(switches.length,'通常の動きで姿の切替を確認する場面がある');
  async function openAndReplay(candidate) {
    await page.goto(`${base}/${candidate.volume.id}-story.html#page-${candidate.index+1}`);
    await page.waitForFunction(id=>document.querySelector('#story-map')?.dataset.scene===id,candidate.scene.id);
    await page.waitForFunction(()=>[...document.querySelectorAll('#map-characters img')].every(image=>image.complete&&image.naturalWidth));
    await page.waitForFunction(()=>document.querySelector('#story-map').dataset.phase==='complete');
    await page.locator('#replay').evaluate(button=>button.click());
    await page.waitForFunction(()=>Number(document.querySelector('#story-map').dataset.progress)<.1);
  }
  const state=()=>page.evaluate(()=>({progress:Number(document.querySelector('#story-map').dataset.progress),phase:document.querySelector('#story-map').dataset.phase,items:[...document.querySelectorAll('.history-map-item')].map(node=>({name:node.dataset.name,key:node.dataset.image,src:new URL(node.querySelector('img').src).pathname,transform:node.style.transform,walking:node.classList.contains('is-walking'),loaded:node.querySelector('img').complete&&node.querySelector('img').naturalWidth>0,bubble:node.querySelector('.history-bubble').textContent}))}));
  for(const [index,candidate] of [...new Map([mover,...switches].map(value=>[value.scene.id,value])).values()].entries()) {
    const {scene}=candidate,items=[...(scene.props??[]),...(scene.actors??[])];
    console.log('通常の動きと姿の切替: '+scene.id);
    await openAndReplay(candidate);const start=await state();
    assert.equal(start.phase,'moving',scene.id+': 再生直後は移動中');
    for(const item of items) {
      const actual=start.items.find(row=>row.name===item.name);assert.ok(actual,scene.id+': 初めの人物がある');
      assert.equal(actual.key,item.image,scene.id+': 初めの姿');assert.equal(actual.src,artworkFile(item.image),scene.id+': 初めの画像');assert.equal(actual.bubble,'',scene.id+': 吹き出しは到着後');
    }
    const firstMoving=items.find(item=>item.route!==undefined),firstRoute=firstMoving?scene.routes[firstMoving.route]:null;
    const from=firstRoute?.start??0,to=firstRoute?.end??1;
    await page.waitForFunction(([low,high])=>{const progress=Number(document.querySelector('#story-map').dataset.progress);return progress>=low&&progress<=high;},[from+(to-from)*.35,from+(to-from)*.65]);
    const middle=await state();
    for(const item of items.filter(item=>item.route!==undefined)) {
      const before=start.items.find(row=>row.name===item.name),during=middle.items.find(row=>row.name===item.name);
      const route=scene.routes[item.route];
      if(middle.progress>=(route.start??0)&&middle.progress<(route.end??1)) {
        assert.notEqual(during.transform,before.transform,scene.id+': 中途で地図上の位置が変わる');assert.ok(during.walking,scene.id+': 移動中の動きを表示');
      }
    }
    if(index===0)await page.screenshot({path:path.join(output,'normal-motion-middle.png'),fullPage:true});
    await page.waitForFunction(()=>document.querySelector('#story-map').dataset.phase==='complete');
    await page.waitForFunction(()=>[...document.querySelectorAll('#map-characters img')].every(image=>image.complete&&image.naturalWidth));
    const end=await state();
    for(const item of items) {
      const actual=end.items.find(row=>row.name===item.name),key=item.afterImage??item.image;
      assert.equal(actual.key,key,scene.id+': 終点の姿');assert.equal(actual.src,artworkFile(key),scene.id+': 終点の画像');assert.ok(actual.loaded,scene.id+': 切替後の画像読み込み');assert.equal(actual.walking,false,scene.id+': 到着後に歩く動きを止める');assert.equal(actual.bubble,item.bubble??'',scene.id+': 到着後の吹き出し');
      if(item.route!==undefined) {
        const destination=scene.routes[item.route].points.at(-1);
        const expected=await page.evaluate(([lon,lat])=>{const image=document.querySelector('#story-map image');return [Number(image.getAttribute('x'))+(lon+180)*4*Number(image.getAttribute('width'))/1440,Number(image.getAttribute('y'))+(90-lat)*4*Number(image.getAttribute('height'))/720];},destination);
        const actualPoint=[...actual.transform.matchAll(/[-\d.]+(?=px)/g)].map(value=>Number(value[0]));assert.equal(actualPoint.length,2);
        assert.ok(actualPoint.every((value,axis)=>Math.abs(value-expected[axis])<1.5),scene.id+': 移動経路の終点へ到着');
      }
    }
    if(index===0)await page.screenshot({path:path.join(output,'normal-motion-end.png'),fullPage:true});
    await page.locator('#replay').evaluate(button=>button.click());const replay=await state();
    for(const item of items.filter(item=>item.afterImage))assert.equal(replay.items.find(row=>row.name===item.name).key,item.image,scene.id+': もう一度見ると初めの姿へ戻る');
    cases.push({id:scene.id,start,middle,end,replay});
  }
  // 取り外した古い人物を保持し、次ページ後に古い再生が更新しないことを調べる。
  const cancellation=switches.find(candidate=>candidate.index<modernVisualEdition[candidate.volume.id].length-1)??switches[0];
  await openAndReplay(cancellation);
  await page.waitForFunction(()=>Number(document.querySelector('#story-map').dataset.progress)>=.15);
  const target=[...(cancellation.scene.actors??[]),...(cancellation.scene.props??[])].find(item=>item.afterImage);
  const nextIndex=cancellation.index<modernVisualEdition[cancellation.volume.id].length-1?cancellation.index+1:cancellation.index-1;
  const detached=await page.evaluate(({name,nextIndex})=>{
    const node=[...document.querySelectorAll('.history-map-item')].find(node=>node.dataset.name===name);window.__cancelledModernFigure=node;
    document.querySelectorAll('button[data-scene]')[nextIndex].click();
    return {key:node.dataset.image,transform:node.style.transform,src:node.querySelector('img').src};
  },{name:target.name,nextIndex});
  await page.waitForFunction(id=>document.querySelector('#story-map').dataset.scene===id,modernVisualEdition[cancellation.volume.id][nextIndex].id);
  await page.waitForTimeout(cancellation.scene.duration+600);
  const cancelled=await page.evaluate(()=>{const node=window.__cancelledModernFigure;return {connected:node.isConnected,key:node.dataset.image,transform:node.style.transform,src:node.querySelector('img').src};});
  assert.equal(cancelled.connected,false,'次の場面では古い人物を取り外す');
  assert.deepEqual({key:cancelled.key,transform:cancelled.transform,src:cancelled.src},detached,'次ページ後に古い再生を取り消す');
  await page.close();return {cases,cancellation:{id:cancellation.scene.id,detached,cancelled}};
}
let browser;
try {
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('確認用サーバーが終了: '+code)));});
  const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
  browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
  const page=await browser.newPage({reducedMotion:'reduce'});
  await muteBeforeOpening(page);
  const errors=[],issues=[],seenPages=new Set(),seenDiagrams=new Set();
  watchErrors(page,errors);
  const output=await mkdtemp(path.join(os.tmpdir(),'w-history-modern-browser-'));
  console.log('確認画像と結果: '+output);
  let inspected=0;
  for(const width of [1280,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/?book=ancient');
    await page.waitForSelector('[data-book-tab="ancient"][aria-selected="true"]');
    assert.equal(await page.locator('#ancient-book .part-link').count(),128);
    assert.equal(await page.locator('#modern-book').isVisible(),false);
    await page.locator('[data-book-tab="modern"]').click();
    assert.equal(await page.locator('#ancient-book').isVisible(),false);
    assert.equal(await page.locator('#modern-book .part-link').count(),75);
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
        const scenes=modernVisualEdition[volume.id];
        await page.goto(`${base}/${volume.id}-story.html`);
        await page.waitForSelector('button[data-scene]');
        assert.equal(await page.locator('button[data-scene]').count(),scenes.length);
        assert.equal(await page.locator('.story-series-links a').count(),5);
        for(const [i,expected] of scenes.entries()) {
          await page.locator('button[data-scene]').nth(i).evaluate(b=>b.click());
          await settleScene(page,expected);
          const original=modernEdition[volume.id][i];
          const actual=await page.evaluate(readScene,original.body.map(p=>'<p>'+p+'</p>').join(''));
          assert.deepEqual(actual.paragraphs,original.plainBody,`${expected.id}: 本文をそのまま表示`);
          for(const [shown,wanted] of actual.decoration)assert.equal(shown,wanted,`${expected.id}: 原資料の装飾`);
          assert.ok(actual.longitude>=32-1e-6&&actual.latitude>=24-1e-6,'共通の地理図拡大上限');
          const plan=modernVisualScenePlans[expected.id],notes=[...(plan.textOnlyPeople??[]),...(plan.excludedPersonNames??[])];
          const names=namesForScene(expected,expected.title+'。'+expected.plainBody.join('')).filter(name=>name.kind!=='concept'&&!notes.some(note=>normalizeMapName(note.name)===name.key));
          const shown=[...actual.shown,...actual.figures.map(figure=>figure.name)].map(normalizeMapName);
          const items=[...(expected.props??[]),...(expected.actors??[])],illustration=modernIllustrationFor(expected),figures=(illustration?.groups??[]).flatMap(group=>group.figures??[]);
          const missing=names.filter(name=>!shown.some(text=>text.includes(name.key))&&!(plan.personAliases??[]).some(alias=>normalizeMapName(alias.name)===name.key&&[...items,...figures].some(item=>item.identity===alias.identity))).map(name=>name.name);
          const families=new Set(names.map(name=>name.family??name.name));
          const preceding=modernEdition[volume.id][i-1],precedingNames=preceding?namesForScene(preceding,preceding.title+'。'+preceding.plainBody.join('')).filter(name=>name.kind!=='person'):[];
          const locationFamilies=new Set([...names,...precedingNames].map(name=>name.family??name.name));
          const narrativeKey=normalizeMapName(expected.title+'。'+expected.plainBody.join(''));
          const extra=[...actual.shown,...actual.figures.map(figure=>figure.name)].filter(name=>namesForScene(expected,name).some(entity=>!(entity.kind==='person'?families:locationFamilies).has(entity.family??entity.name)&&(entity.kind==='person'||!narrativeKey.includes(normalizeMapName(entity.name)))));
          assert.equal(actual.mapImages.length,items.length,expected.id+': すべての地図上の絵を表示');
          assert.equal(actual.figures.length,figures.length,expected.id+': すべての模式欄の絵を表示');
          assert.equal(actual.illustrationHidden,!illustration,expected.id+': 模式欄の有無');
          if(width===390&&illustration)assert.ok(actual.illustrationTop>=actual.bodyBottom-1,expected.id+': 携帯幅では本文の後に模式欄を置く');
          const duplicateNames=[];
          for(const [index,item] of items.entries()) {
            const image=actual.mapImages[index];
            assert.equal(image.name,item.name,expected.id+': 人物・物の絵 '+item.name);assert.ok(image.width>0&&image.height>0&&image.fitted,expected.id+': 透過範囲に合わせて画像を表示');
            assert.equal(image.src,artworkFile(item.afterImage??item.image),expected.id+': 動きを省略したときも終点の絵');
            assert.ok(image.b.width>=12&&image.b.height>=12,expected.id+': 絵が小さく潰れない');
            if(actual.shown.map(normalizeMapName).filter(name=>name===normalizeMapName(item.name)).length!==1)duplicateNames.push(item.name);
            assert.equal(image.bubble,item.bubble??'',expected.id+': 原データの吹き出し');
          }
          for(const [index,figure] of figures.entries()) {
            const image=actual.figures[index];assert.equal(image.name,figure.name,expected.id+': 模式欄の姓名');assert.equal(image.caption,figure.caption??'',expected.id+': 模式欄の説明');
            assert.ok(image.width>0&&image.height>0&&image.art?.width>=12&&image.art?.height>=12,expected.id+': 模式欄の絵を読み込む');assert.equal(image.src,artworkFile(figure.image),expected.id+': 模式欄の画像');
            if(figure.kind==='person'&&items.some(item=>item.identity===figure.identity)) {
              const compared=items.find(item=>item.identity===figure.identity&&item.afterImage);
              assert.ok(compared&&['before','after'].includes(figure.temporalRole),expected.id+': 模式欄と地図で本人の単なる再掲をしない '+figure.name);
              assert.equal(figure.image,figure.temporalRole==='before'?compared.image:compared.afterImage,expected.id+': 本人の前後比較の画像');
            }
          }
          if(missing.length||extra.length||actual.overflow.length||actual.overlaps.length||actual.viewportOverflow||actual.illustrationOverflow.length||actual.illustrationOverlaps.length||duplicateNames.length)issues.push({width,theme,id:expected.id,missing,extra,overflow:actual.overflow,overlaps:actual.overlaps,viewportOverflow:actual.viewportOverflow,illustrationOverflow:actual.illustrationOverflow,illustrationOverlaps:actual.illustrationOverlaps,duplicateNames});
          const pages=modernReferencePages(expected,volume,i);
          for(const sourcePage of pages)seenPages.add(sourcePage);
          const expectedReference=await page.evaluate(html=>{const e=document.createElement('div');e.innerHTML=html;return e.innerHTML;},pages.map(n=>sourcePages[n]).join(''));
          assert.equal(actual.reference,expectedReference,'関係する原書ページを全文掲載');
          assert.equal(await page.locator('#source-reference').getAttribute('open'),null);
          if(actual.diagram)seenDiagrams.add(actual.diagram);
          if(i===0||actual.diagram&&theme==='light')await page.screenshot({path:path.join(output,`${expected.id}-${width}-${theme}.png`),fullPage:true});
          inspected++;
        }
        console.log(`幅${width}・${theme}・第${volume.part}節の全${scenes.length}場面を確認しました。`);
        await page.locator('#source-reference summary').click();
        assert.equal(await page.locator('#source-reference-body').isVisible(),true);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'図表の横スクロールをページ全体にはみ出させない');
        await page.screenshot({path:path.join(output,`supplement-${volume.part}-${width}-${theme}.png`),fullPage:true});
        await page.reload();await page.waitForSelector('button[data-scene]');
        assert.equal(await page.locator('#story-progress').getAttribute('value'),String(scenes.length));
        await page.locator('#next').click();
        const nextVolume = allModernSeries[allModernSeries.findIndex(item=>item.id===volume.id)+1];
        await page.waitForURL(nextVolume?`${base}/${nextVolume.id}-story.html`:`${base}/?book=modern#modern-book`);
        if(!nextVolume)assert.equal(await page.locator('#modern-book').isVisible(),true);
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
  let motion;
  try {motion=await checkMotion(browser,output,errors);}
  catch(error) {
    await writeFile(path.join(output,'result.json'),JSON.stringify({inspected,errors,issues,pages:[...seenPages],diagrams:[...seenDiagrams],motionFailure:error.message},null,2));
    throw error;
  }
  await writeFile(path.join(output,'result.json'),JSON.stringify({inspected,errors,issues,pages:[...seenPages],diagrams:[...seenDiagrams],motion},null,2));
  assert.deepEqual(errors,[]);
  assert.deepEqual(issues,[],'地図の名前・文字の重なり・はみ出し');
  console.log(`近代・現代の全${Object.values(modernEdition).flat().length}場面を幅1280・390、明暗両方で計${inspected}回確認しました。人物・吹き出し・模式欄の絵と名前・重なり・はみ出し、通常の移動と姿の切替${motion.cases.length}場面・再表示・取消、2巻の切替・本文と装飾・原書26ページの補足・3図・末尾移動・旧教材の両端も確認済みです。`);
} finally {await browser?.close();server.kill();}
