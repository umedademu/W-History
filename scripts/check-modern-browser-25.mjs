import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {existsSync} from 'node:fs';
import {mkdtemp,writeFile,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const motionOnly=process.argv.includes('--motion-only');
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const {chromium}=createRequire(path.join(root,'package.json'))('playwright');
const load=name=>import(pathToFileURL(path.join(root,'public',name)).href);
const [{modernEdition,sourcePages:lessonSourcePages},{modernVisualEdition,modernIllustrationFor,modernVisualScenePlans},{modernSeries},{series},{allEditions},{namesForScene,normalizeMapName},{modernReferencePages,modernDiagrams},{modernEdition:previousEdition},{modernSeries:previousSeries}]=await Promise.all([
  load('modern-c05-l25-edition.js'),load('modern-story-visuals-25.js'),load('modern-lesson-25-volumes.js'),load('story-volumes.js'),load('all-editions.js'),load('map-name-coverage.js'),load('modern-story-support-25.js'),load('modern-c05-l24-edition.js'),load('modern-lesson-24-volumes.js')
]);
const {modernSeries:allModernSeries}=await load('modern-volumes.js');
const {sourcePages}=await load('modern-lessons.js');
for(const [page,html] of Object.entries(lessonSourcePages))assert.equal(sourcePages[page],html,'共通入口でも第25回の原書全ページをそのまま保持する');
const sourceRecord=JSON.parse(await readFile(path.join(root,'docs/modern-lesson-25/source-selection.json'),'utf8'));
const sourceLines=new Map(sourceRecord.lines.map(line=>[line.line,line]));
// 同じ人物の別表記だけを家族識別で束ねる。
const family=entity=>entity.family??entity.name;
const contextRecords=new Map(JSON.parse(await readFile(path.join(root,'docs/modern-lesson-25/visual-plan.json'),'utf8')).scenes.map(scene=>[scene.sceneId,scene]));
const sourceParagraphs=new Map(sourceRecord.paragraphs.map(paragraph=>[paragraph.id,paragraph]));
const sourceParagraphOrder=sourceRecord.paragraphs.map(paragraph=>paragraph.id);
const readingPlan=new Map(JSON.parse(await readFile(path.join(root,'docs/modern-lesson-25/reading-plan.json'),'utf8')).map(scene=>[scene.id,scene]));
function contextEntities(scene,visualPlan) {
  const planned=readingPlan.get(scene.id),contexts=scene.contextRegions??[];
  assert.deepEqual(contexts,planned.contextRegions??[],scene.id+': 地域の引継ぎを読み分け表と照合する');
  assert.deepEqual(contexts,visualPlan.contextRegions??[],scene.id+': 配置記録にも地域の原文根拠を保持する');
  const direct=namesForScene(scene,scene.plainBody.join(''));
  assert.equal(new Set(contexts.map(context=>context.name)).size,contexts.length,scene.id+': 文脈地域を重複しない');
  return contexts.map(context=>{
    const paragraph=sourceParagraphs.get(context.paragraph),first=sourceParagraphOrder.indexOf(planned.paragraphs[0]);
    assert.ok(paragraph&&(planned.paragraphs.includes(paragraph.id)||sourceParagraphOrder[first-1]===paragraph.id),scene.id+': 同じ親段落または直前段落の地域だけを引き継ぐ');
    assert.ok(paragraph.lines.every(line=>Math.max(1,[26,338,470].filter(start=>start<=line).length)===scene.sourceText.part),scene.id+': 文脈地域は同じ節の原文を根拠とする');
    assert.ok(context.reason?.trim()&&context.lines.length&&context.lines.every(line=>paragraph.lines.includes(line)&&sourceLines.get(line)?.kind==='body'),scene.id+': 地域を明示する通常本文の行と理由を記録する');
    assert.equal(new Set(context.lines).size,context.lines.length,scene.id+': 根拠行を重複しない');
    const entry=namesForScene(scene,context.name).find(entry=>entry.name===context.name&&entry.kind==='region');
    assert.ok(entry?.points.length,scene.id+': 文脈では所在地をもつ地域だけを補う');
    const text=context.lines.map(line=>sourceLines.get(line).text).join('').replace(/<rt>[\s\S]*?<\/rt>/g,'').replace(/<[^>]*>/g,'').replaceAll('**','');
    assert.ok(namesForScene(scene,text).some(found=>found.kind==='region'&&family(found)===family(entry)),scene.id+': 指定した根拠行に同じ地域が明示される');
    assert.ok(!direct.some(found=>family(found)===family(entry)),scene.id+': 本文に明示された地域と重ねない');
    for(const point of entry.points)assert.ok(scene.tags.some(tag=>tag.text===entry.name&&JSON.stringify(tag.at)===JSON.stringify(point)),scene.id+': 文脈地域の静的な参照点が地図に残る');
    return entry;
  });
}

const port=process.env.W_HISTORY_MODERN_CHECK_PORT??'19029',base='http://127.0.0.1:'+port;
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
function artworkFile(key) {return '/images/'+(key.includes('/')?key:'modern-c05-l25/'+key)+(/\.png$/.test(key)?'':'.png');}

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
    const scale=fit==='cover'?Math.max(b.width/canvas.width,b.height/canvas.height):Math.min(b.width/canvas.width,b.height/canvas.height),scaled=fit==='contain'||fit==='cover',sx=scaled?scale:b.width/canvas.width,sy=scaled?scale:b.height/canvas.height;
    const [px,py]=getComputedStyle(image).objectPosition.split(' ').map(value=>Number.parseFloat(value)/100);
    const x=b.left+(b.width-canvas.width*sx)*px,y=b.top+(b.height-canvas.height*sy)*py;
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
    return {name:name?.textContent,caption:caption?.textContent??'',group:figure.closest('.illustration-group')?.querySelector('h4')?.textContent??'',title:panel.querySelector('h3')?.textContent??'',src:image?new URL(image.currentSrc||image.src).pathname:null,width:image?.naturalWidth??0,height:image?.naturalHeight??0,wide:figure.classList.contains('illustration-figure-wide'),imageBox:image?box(image):null,b:box(figure),nameBox:name?box(name):null,captionBox:caption?box(caption):null,art:image?art(image):null};
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
  const selectors=['strong','ruby','[data-source-color="red"]','u','[data-source-background]','[data-source-marker="double-line"]','[data-source-line-style="dashed"]','[data-source-line-style="dotted"]','[data-source-border-shape="circle"]'],image=map.querySelector('image');
  return {paragraphs:[...body.querySelectorAll(':scope > p')].map(node=>node.textContent),shown:labels.map(item=>item.text),bubbles:bubbles.map(item=>({name:item.name,text:item.text})),mapImages,overflow,overlaps,figures,illustrationHidden,illustrationOverflow,illustrationOverlaps,
    bodyBottom:document.querySelector('#scene-body').getBoundingClientRect().bottom,illustrationTop:panelBox.top,
    decoration:selectors.map(selector=>[document.querySelector('#scene-body').querySelectorAll(selector).length,template.querySelectorAll(selector).length]),
    viewportOverflow:document.documentElement.scrollWidth>innerWidth,
    longitude:rect.width/Number(image.getAttribute('width'))*360,latitude:rect.height/Number(image.getAttribute('height'))*180,
    diagram:document.querySelector('#modern-diagram').hidden?null:document.querySelector('#modern-diagram h3').textContent,
    reference:document.querySelector('#source-reference-body').innerHTML};
}

async function checkMotion(browser,output,errors) {
 const page=await browser.newPage({reducedMotion:'no-preference',viewport:{width:1440,height:900}});
 await muteBeforeOpening(page);watchErrors(page,errors);
 const candidates=modernSeries.flatMap(volume=>modernVisualEdition[volume.id].map((scene,index)=>({volume,scene,index}))),cases=[];
 const items=scene=>[...(scene.props??[]),...(scene.actors??[])];
 const staticIds=new Set([5,16,18,20,30,32,36,40,58,108,139,159,163,165,167,177,183,185,187,191,211,224,230,246,248,252,272,276,282,290,292,296,320,322,324,342,348,350,352,354,438,460,476,484,486,549,551,553,555,561,598,616,626,628,630,640,642,644,648,650,668,674,678,690,708].map(line=>{const row=candidates.find(({scene})=>scene.sourceText.passages.some(p=>p.lines.includes(line))&&!scene.routes.some(r=>!r.informationOnly));assert.ok(row,line+': 静止を確認する場面');return row.scene.id;}));
 const selected=candidates.filter(({scene})=>scene.routes.length||items(scene).length||staticIds.has(scene.id));
 const physicalMovements=candidates.flatMap(({scene})=>items(scene).filter(item=>item.route!==undefined)).length,switches=candidates.flatMap(({scene})=>items(scene).filter(item=>item.afterImage)).length;
 async function openAndReplay(candidate){await page.goto(base+'/'+candidate.volume.id+'-story.html#page-'+(candidate.index+1));await settleScene(page,candidate.scene);await page.locator('#replay').evaluate(button=>button.click());await page.waitForFunction(()=>Number(document.querySelector('#story-map').dataset.progress)<.1);}
 const state=()=>page.evaluate(()=>({progress:Number(document.querySelector('#story-map').dataset.progress),phase:document.querySelector('#story-map').dataset.phase,
  items:[...document.querySelectorAll('.history-map-item')].map(node=>({name:node.dataset.name,key:node.dataset.image,src:new URL(node.querySelector('img').src).pathname,transform:node.style.transform,walking:node.classList.contains('is-walking'),loaded:node.querySelector('img').complete&&node.querySelector('img').naturalWidth>0,bubble:node.querySelector('.history-bubble').textContent})),
  figures:[...document.querySelectorAll('#modern-illustration figure')].map(node=>({name:node.querySelector('.illustration-name')?.textContent,src:new URL(node.querySelector('img').src).pathname,loaded:node.querySelector('img').complete&&node.querySelector('img').naturalWidth>0})),
  routes:[...document.querySelectorAll('.history-moving-point')].map(node=>({index:Number(node.dataset.route),progress:Number(node.dataset.progress),x:Number(node.getAttribute('cx')),y:Number(node.getAttribute('cy')),opacity:Number(node.getAttribute('opacity'))})),
  information:[...document.querySelectorAll('.history-information-line')].map(node=>({index:Number(node.dataset.route),d:node.getAttribute('d'),label:node.getAttribute('aria-label'),dash:node.getAttribute('stroke-dasharray'),mask:node.getAttribute('mask'),offset:node.getAttribute('stroke-dashoffset')}))
 }));
 for(const candidate of selected){
  const {scene}=candidate,placed=items(scene);console.log('通常再生・静止/移動/姿切替: '+scene.id);
  await openAndReplay(candidate);const start=await state();assert.equal(start.phase,'moving');
  for(const item of placed){const actual=start.items.find(row=>row.name===item.name);assert.ok(actual);assert.equal(actual.key,item.image);assert.equal(actual.src,artworkFile(item.image));assert.equal(actual.bubble,'');}
  const first=placed.find(item=>item.route!==undefined),route=first?scene.routes[first.route]:null,from=route?.start??0,to=route?.end??1;
  await page.waitForFunction(([low,high])=>{const progress=Number(document.querySelector('#story-map').dataset.progress);return progress>=low&&progress<=high;},[from+(to-from)*.35,from+(to-from)*.65]);
  const middle=await state();
  assert.equal(middle.routes.length,scene.routes.filter(route=>!route.informationOnly).length,scene.id+': 実際の経路と情報線を区別する');
  assert.equal(middle.information.length,scene.routes.filter(route=>route.informationOnly).length);
  for(const item of placed){const before=start.items.find(row=>row.name===item.name),during=middle.items.find(row=>row.name===item.name);
   if(item.route!==undefined){const r=scene.routes[item.route];assert.ok(!r.informationOnly,scene.id+': 情報線に人・物を乗せない');if(middle.progress>=(r.start??0)&&middle.progress<(r.end??1)){assert.notEqual(during.transform,before.transform,scene.id+': 明示された実移動だけ途中で位置を変える');assert.equal(during.walking,true);}}
   else {assert.equal(during.transform,before.transform,scene.id+': 所在と思想の参照は途中で動かさない');assert.equal(during.walking,false);}
   assert.equal(during.bubble,'',scene.id+': 説明は到着・再生完了後に表示');
  }
  for(const r of middle.routes){const definition=scene.routes[r.index];if(middle.progress>=(definition.start??0)&&middle.progress<(definition.end??1))assert.ok(r.progress>0&&r.progress<1,scene.id+': 経路の途中を表示');}
  assert.deepEqual(middle.figures,start.figures,scene.id+': 参考欄の人物・コラムの絵を動かさない');assert.deepEqual(middle.information,start.information,scene.id+': 情報の接続は静的な線のまま');
  await page.waitForFunction(()=>document.querySelector('#story-map').dataset.phase==='complete');await page.waitForFunction(()=>[...document.querySelectorAll('#map-characters img')].every(img=>img.complete&&img.naturalWidth));const end=await state();
  for(const item of placed){const actual=end.items.find(row=>row.name===item.name),before=start.items.find(row=>row.name===item.name),key=item.afterImage??item.image;assert.equal(actual.key,key);assert.equal(actual.src,artworkFile(key));assert.ok(actual.loaded);assert.equal(actual.walking,false);assert.equal(actual.bubble,item.bubble??'');
   if(item.route!==undefined){const destination=scene.routes[item.route].points.at(-1),expected=await page.evaluate(([lon,lat])=>{const image=document.querySelector('#story-map image');return [Number(image.getAttribute('x'))+(lon+180)*Number(image.getAttribute('width'))/360,Number(image.getAttribute('y'))+(90-lat)*Number(image.getAttribute('height'))/180];},destination),position=[...actual.transform.matchAll(/[-\d.]+(?=px)/g)].map(value=>Number(value[0]));assert.equal(position.length,2);assert.ok(position.every((value,axis)=>Math.abs(value-expected[axis])<1.5),scene.id+': 原文に対応する経路の終点へ到着');}
   else assert.equal(actual.transform,before.transform,scene.id+': 完了時も静止位置を保つ');
  }
  for(const r of end.information)assert.equal(r.label,scene.routes[r.index].informationLabel||'電信の情報接続を示す線',scene.id+': 関係線に内容に合う説明を付ける');for(const r of end.routes)assert.equal(r.progress,1,scene.id+': 実経路の表示を完了');assert.deepEqual(end.figures,start.figures);assert.deepEqual(end.information,start.information);
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(output,scene.id+'-normal-complete.png'),fullPage:true});
  await page.locator('#replay').evaluate(button=>button.click());const replay=await state();assert.ok(replay.progress<.1);assert.deepEqual(replay.figures,start.figures);assert.deepEqual(replay.information,start.information);
  for(const item of placed){const actual=replay.items.find(row=>row.name===item.name);assert.equal(actual.key,item.image);assert.equal(actual.bubble,'');if(item.route!==undefined)assert.equal(actual.transform,start.items.find(row=>row.name===item.name).transform,scene.id+': 再表示で出発点へ戻る');}
  cases.push({id:scene.id,mode:scene.routes.some(route=>!route.informationOnly)||placed.some(item=>item.route!==undefined)?'movement':placed.some(item=>item.afterImage)?'switch':'static',start,middle,end,replay});
 }
 const cancellation=selected.find(({scene,index,volume})=>scene.routes.some(route=>!route.informationOnly)&&index<modernVisualEdition[volume.id].length-1)??selected[0];assert.ok(cancellation);
 await openAndReplay(cancellation);await page.waitForFunction(()=>Number(document.querySelector('#story-map').dataset.progress)>=.15);
 const nextIndex=cancellation.index<modernVisualEdition[cancellation.volume.id].length-1?cancellation.index+1:cancellation.index-1;
 const detached=await page.evaluate(nextIndex=>{window.__cancelledModernNodes=[...document.querySelectorAll('.history-moving-point,.history-information-line,.history-map-item')];document.querySelectorAll('button[data-scene]')[nextIndex].click();return window.__cancelledModernNodes.map(node=>({tag:node.tagName,attributes:[...node.attributes].map(a=>[a.name,a.value]),image:node.querySelector('img')?.src??null}));},nextIndex);
 await page.waitForFunction(id=>document.querySelector('#story-map').dataset.scene===id,modernVisualEdition[cancellation.volume.id][nextIndex].id);await page.waitForTimeout(cancellation.scene.duration+600);
 const cancelled=await page.evaluate(()=>({connected:window.__cancelledModernNodes.some(node=>node.isConnected),nodes:window.__cancelledModernNodes.map(node=>({tag:node.tagName,attributes:[...node.attributes].map(a=>[a.name,a.value]),image:node.querySelector('img')?.src??null}))}));
 assert.equal(cancelled.connected,false);assert.deepEqual(cancelled.nodes,detached,'次ページ後に古い線と本人の更新を取り消す');await page.close();
 return {physicalMovements,switches,staticScenes:cases.filter(row=>row.mode==='static').map(row=>row.id),cases,cancellation:{id:cancellation.scene.id,detached,cancelled}};
}

let browser;
try {
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('確認用サーバーが終了: '+code)));});
  const executablePath=process.env.W_HISTORY_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
  browser=await chromium.launch({executablePath,headless:true,args:['--mute-audio']});
  const page=await browser.newPage({reducedMotion:'reduce'});
  await muteBeforeOpening(page);
  const errors=[],issues=[],seenPages=new Set(),seenDiagrams=new Set(),referenceChecks=[],savedDiagrams=new Set();
  const candidates=modernSeries.flatMap(volume=>modernEdition[volume.id]);
  const findScene=(line,word)=>{const scene=candidates.find(scene=>scene.sourceText.passages.some(p=>p.lines.includes(line))&&scene.plainBody.join('').includes(word));assert.ok(scene,word+': 重要な参照を開く場面がある');return scene.id;};
  const criticalReferences=new Map([[5,"さて、アジアの戦",["454","さて、アジアの戦"]],[16,"現代の世界で、戦",["454","現代の世界で、戦"]],[18,"さらに、イランと",["454","さらに、イランと"]],[20,"それじゃあ、戦後",["454","それじゃあ、戦後"]],[30,"現代まで続く中東",["455","現代まで続く中東"]],[32,"第一次世界大戦に",["455","第一次世界大戦に"]],[36,"そして第一次世界",["455","そして第一次世界"]],[40,"第二次世界大戦中",["455","456","第二次世界大戦中"]],[58,"そして、事態はど",["456","そして、事態はど"]],[108,"こうして1947",["457","こうして1947"]],[139,"開戦してみると、",["457","458","開戦してみると、"]],[159,"パレスチナ戦争に",["458","パレスチナ戦争に"]],[163,"こうした不満をそ",["458","こうした不満をそ"]],[165,"そして1952年",["458","そして1952年"]],[167,"バンドン会議でイ",["458","バンドン会議でイ"]],[169,"エジプトの中立外",["458","459","エジプトの中立外"]],[177,"反発したナセルは",["459","反発したナセルは"]],[181,"こうして1956",["459","こうして1956"]],[183,"こうして国連緊急",["459","こうして国連緊急"]],[185,"英仏を撤退に追い",["459","英仏を撤退に追い"]],[187,"アラブ民族主義を",["459","アラブ民族主義を"]],[191,"さらに、ナセルの",["459","460","さらに、ナセルの"]],[209,"こうしたアラブの",["460","こうしたアラブの"]],[211,"第2次中東戦争や",["460","第2次中東戦争や"]],[224,"ここでちょっと思",["460","ここでちょっと思"]],[230,"そこで、1961",["461","そこで、1961"]],[232,"1967年6月5",["461","1967年6月5"]],[246,"実はこの作戦のた",["461","実はこの作戦のた"]],[248,"この戦争で増えて",["461","この戦争で増えて"]],[252,"あまりにもあっけ",["461","462","あまりにもあっけ"]],[272,"ナセルの死後、副",["462","ナセルの死後、副"]],[274,"こうして1973",["462","こうして1973"]],[276,"でも、これだけで",["462","でも、これだけで"]],[282,"第4次中東戦争が",["462","463","第4次中東戦争が"]],[290,"エジプトでは、サ",["463","エジプトでは、サ"]],[292,"一方、イスラエル",["463","一方、イスラエル"]],[294,"こうして1977",["463","こうして1977"]],[296,"これを見たアラブ",["463","これを見たアラブ"]],[298,"一方のイスラエル",["463","464","一方のイスラエル"]],[320,"冷戦が終わって米",["464","冷戦が終わって米"]],[322,"これは、PLOの",["464","これは、PLOの"]],[324,"ただ、和平を進め",["464","ただ、和平を進め"]],[342,"話は変わって、イ",["464","話は変わって、イ"]],[348,"そして、「イラン",["465","そして、「イラン"]],[350,"これに対し、世界",["465","これに対し、世界"]],[352,"一方、イラクでは",["465","一方、イラクでは"]],[354,"しかし、イギリス",["465","しかし、イギリス"]],[360,"アメリカの援助で",["465","466","アメリカの援助で"]],[430,"一方で、国内でシ",["467","一方で、国内でシ"]],[434,"イラン＝イラク戦",["467","イラン＝イラク戦"]],[436,"これに対し、国連",["467","これに対し、国連"]],[438,"この時フセインは",["467","この時フセインは"]],[440,"2001年、アメ",["467","468","2001年、アメ"]],[458,"そして2003年",["468","そして2003年"]],[460,"フセイン政権は倒",["468","フセイン政権は倒"]],[476,"それじゃあ、アフ",["468","469","それじゃあ、アフ"]],[484,"1954年、ジュ",["469","1954年、ジュ"]],[486,"アルジェリアでは",["469","アルジェリアでは"]],[549,"アフリカでは、す",["470","アフリカでは、す"]],[551,"まず1957年に",["470","まず1957年に"]],[553,"そして1960年",["470","そして1960年"]],[555,"そして、1963",["470","そして、1963"]],[557,"ただ、1966年",["470","ただ、1966年"]],[561,"さて、独立を達成",["470","さて、独立を達成"]],[567,"1960年にイギ",["471","1960年にイギ"]],[571,"同じように資源を",["471","同じように資源を"]],[573,"1963年には国",["471","1963年には国"]],[598,"最近では、スーダ",["471","472","最近では、スーダ"]],[616,"第一次世界大戦直",["472","第一次世界大戦直"]],[620,"第二次世界大戦前",["472","第二次世界大戦前"]],[626,"南アフリカ戦争【",["472","南アフリカ戦争【"]],[628,"でも人種差別はな",["472","でも人種差別はな"]],[630,"こうした政策に反",["472","473","こうした政策に反"]],[640,"こうした批判に対",["473","こうした批判に対"]],[642,"いくら独立したと",["473","いくら独立したと"]],[644,"その後、ローデシ",["473","その後、ローデシ"]],[648,"じゃあ、南アフリ",["473","じゃあ、南アフリ"]],[650,"そんな南アフリカ",["473","474","そんな南アフリカ"]],[668,"そして、1994",["474","そして、1994"]],[674,"それじゃあ最後に",["474","それじゃあ最後に"]],[676,"まずはルワンダ内",["474","まずはルワンダ内"]],[678,"その後、国連など",["474","その後、国連など"]],[682,"もう一つがソマリ",["474","475","もう一つがソマリ"]],[690,"じゃあ、今回はこ",["475","じゃあ、今回はこ"]],[708,"さあ、残すところ",["475","さあ、残すところ"]]].map(([line,word,phrases])=>[findScene(line,word),phrases]));
  watchErrors(page,errors);
  const output=await mkdtemp(path.join(os.tmpdir(),'w-history-modern-browser-25-'));
  console.log('確認画像と結果: '+output);
  let inspected=0;
  if(!motionOnly) {
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/?book=ancient');
    await page.waitForSelector('[data-book-tab="ancient"][aria-selected="true"]');
    assert.equal(await page.locator('#ancient-book .part-link').count(),series.length);
    assert.equal(await page.locator('#modern-book').isVisible(),false);
    await page.locator('[data-book-tab="modern"]').click();
    assert.equal(await page.locator('#ancient-book').isVisible(),false);
    assert.equal(await page.locator('#modern-book .part-link').count(),allModernSeries.length,'登録済みの全教材を目次から開ける');
    for(const lesson of [...new Set(allModernSeries.map(volume=>volume.lesson))])assert.equal(await page.locator('#modern-book .lesson-group[data-lesson="'+lesson+'"] .part-link').count(),allModernSeries.filter(volume=>volume.lesson===lesson).length,'各回の節数を登録済み教材から照合');
    const lessonLinks=await page.locator('#modern-book .part-link').evaluateAll(links=>links.map(link=>({href:new URL(link.href).pathname,text:link.textContent})));
    assert.deepEqual(lessonLinks.filter(link=>/modern-c05-l25/.test(link.href)).map(link=>link.href),modernSeries.map(volume=>'/'+volume.id+'-story.html'),'第25回の3教材の掲載順');
    await page.locator('#modern-chapter-4>summary').click();
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
    await page.locator('#modern-chapter-4>summary').click();
    await page.locator('#modern-chapter-4 .lesson-group[data-lesson="19"] .part-link').first().click();
    await page.waitForSelector('button[data-scene]');

    for(const theme of ['light','dark']) {
      await page.evaluate(value=>localStorage.setItem('w-history-theme',value),theme);
      for(const [vIndex,volume] of modernSeries.entries()) {
        const scenes=modernVisualEdition[volume.id];
        await page.goto(`${base}/${volume.id}-story.html`);
        await page.waitForSelector('button[data-scene]');
        assert.equal(await page.locator('button[data-scene]').count(),scenes.length);
        assert.equal(await page.locator('.story-series-links a').count(),modernSeries.length,'第25回内だけの節番号を表示');
        assert.deepEqual(await page.locator('.story-series-links a').evaluateAll(links=>links.map(link=>new URL(link.href).pathname)),modernSeries.map(volume=>'/'+volume.id+'-story.html'),'第25回の節番号から同じ回の各節へ移る');
        for(const [i,expected] of scenes.entries()) {
          await page.locator('button[data-scene]').nth(i).evaluate(b=>b.click());
          await settleScene(page,expected);
          const original=modernEdition[volume.id][i];
          const actual=await page.evaluate(readScene,original.body.map(p=>'<p>'+p+'</p>').join(''));
          assert.deepEqual(actual.paragraphs,original.plainBody,`${expected.id}: 本文をそのまま表示`);
          for(const [shown,wanted] of actual.decoration)assert.equal(shown,wanted,`${expected.id}: 原資料の装飾`);
          assert.ok(actual.longitude>=32-1e-6&&actual.latitude>=24-1e-6,'共通の地理図拡大上限');
          const plan=modernVisualScenePlans[expected.id],notes=[...(plan.textOnlyPeople??[]),...(plan.excludedPersonNames??[])];
          const narrativeNames=[...namesForScene(expected,expected.title+'。'+expected.plainBody.join('')),...contextEntities(expected,contextRecords.get(expected.id))];
          const names=narrativeNames.filter(name=>name.kind!=='concept'&&!notes.some(note=>normalizeMapName(note.name)===name.key));
          const shown=[...actual.shown,...actual.figures.map(figure=>figure.name)].map(normalizeMapName);
          const items=[...(expected.props??[]),...(expected.actors??[])],illustration=modernIllustrationFor(expected),figures=(illustration?.groups??[]).flatMap(group=>group.figures??[]);
          const missing=names.filter(name=>!shown.some(text=>text.includes(name.key))&&!(plan.personAliases??[]).some(alias=>normalizeMapName(alias.name)===name.key&&[...items,...figures].some(item=>item.identity===alias.identity))).map(name=>name.name);
          // 団体・会社は所在地や本人の表示を要求しないが、本文と同じ団体の別表記は許可する。
          const concepts=namesForScene(expected,expected.title+'。'+expected.plainBody.join('')).filter(name=>name.kind==='concept');
          // 名前を文字で示す本人も、本文に登場する本人の集合には含める。
          const families=new Set(narrativeNames.map(name=>family(name))),referenceEntities=[];
          for(const reference of plan.sourceFigureReferences??[]){
            const item=items.find(item=>normalizeMapName(item.name)===normalizeMapName(reference.displayName??reference.name));
            if(!item)continue;
            assert.ok([...item.bubble.matchAll(/原書(\d+(?:・\d+)*)ページ/g)].some(m=>m[1].split('・').map(Number).includes(reference.page)),expected.id+': 省略された主語の原書ページを見える説明に記す');
            assert.ok(modernReferencePages(expected,volume,i).includes(reference.page),expected.id+': 主語の原書ページへ到達する');
            assert.ok(reference.lines.length&&reference.lines.every(line=>sourceLines.get(line)?.page===reference.page),expected.id+': 主語の根拠行は指定した原書ページにある');
            const cited=reference.lines.map(line=>sourceLines.get(line).text).join('').replace(/<rt>[\s\S]*?<\/rt>/g,'').replace(/<[^>]*>/g,'').replaceAll('**','');
            referenceEntities.push(...namesForScene(expected,cited));
            const matching=namesForScene(expected,cited).filter(entity=>entity.kind==='person'&&namesForScene(expected,reference.name).some(person=>person.kind==='person'&&family(person)===family(entity)));
            if(item.kind==='person')assert.ok(matching.length,expected.id+': 主語本人の名前を原文で照合する');
            else assert.ok(normalizeMapName(cited).includes(normalizeMapName(reference.name)),expected.id+': 集団・道具を原文で照合する');
            matching.forEach(entity=>families.add(family(entity)));
          }
          const preceding=modernEdition[volume.id][i-1],precedingNames=preceding?namesForScene(preceding,preceding.title+'。'+preceding.plainBody.join('')).filter(name=>name.kind!=='person'):[];
          const locationFamilies=new Set([...names,...concepts,...precedingNames,...referenceEntities].map(name=>family(name)));
          const narrativeKey=normalizeMapName(expected.title+'。'+expected.plainBody.join(''));
          const extra=actual.shown.filter(name=>namesForScene(expected,name).filter(entity=>['place','region','person','building'].includes(entity.kind)).some(entity=>!(entity.kind==='person'?families:locationFamilies).has(family(entity))&&(entity.kind==='person'||!narrativeKey.includes(normalizeMapName(entity.name)))));
          const reachablePages=modernReferencePages(expected,volume,i);
          for(const figure of actual.figures) {
            const visible=[figure.title,figure.group,figure.caption].join('。');
            const claimed=[...new Set([...visible.matchAll(/原書(\d+(?:・\d+)*)ページ/g)].flatMap(match=>match[1].split('・').map(Number)))];
            assert.ok(claimed.every(page=>reachablePages.includes(page)),expected.id+': 図の補足ページを表示で識別し、その原文へ到達する');
            const referenceName=figure.name.replace(/（本人名の参照）$/,'');
            const references=(plan.sourceFigureReferences??[]).filter(reference=>normalizeMapName(reference.displayName??reference.name)===normalizeMapName(referenceName));
            for(const reference of references)assert.ok(claimed.includes(reference.page),expected.id+': 原書補足の人物・施設の紙面を表示で識別できる '+reference.name);
            const sourced=new Set(references.flatMap(reference=>[...namesForScene(expected,reference.lines.map(line=>sourceLines.get(line).text).join('')),...namesForScene(expected,reference.name)]).map(family));
            const allowedPeople=new Set([...families,...sourced]),allowedLocations=new Set([...locationFamilies,...sourced]);
            if(namesForScene(expected,figure.name).some(entity=>['place','region','person','building'].includes(entity.kind)&&!(entity.kind==='person'?allowedPeople:allowedLocations).has(family(entity))&&(entity.kind==='person'||!narrativeKey.includes(normalizeMapName(entity.name)))))extra.push(figure.name);
          }
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
            assert.equal(image.wide,Boolean(figure.wide),expected.id+': 横長の絵だけ専用の枠で表示する');
            if(figure.wide){assert.ok(image.art.width>=120&&image.art.height>=24,expected.id+': 航空機・戦車・舟艇・艦船・施設の絵を読み取れる寸法で表示する');assert.ok(image.art.left>=image.imageBox.left-1&&image.art.right<=image.imageBox.right+1&&image.art.top>=image.imageBox.top-1&&image.art.bottom<=image.imageBox.bottom+1,expected.id+': 横長の絵の実際の描画部分を切り落とさない');}
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
          if(criticalReferences.has(expected.id)) {
            await page.locator('#source-reference summary').click();
            assert.equal(await page.locator('#source-reference-body').isVisible(),true,expected.id+': 征服・制度・国民運動の原書参照を開ける');
            const visibleReference=await page.locator('#source-reference-body').evaluate(node=>{const clone=node.cloneNode(true);clone.querySelectorAll('rt').forEach(rt=>rt.remove());return clone.textContent;});
            for(const phrase of criticalReferences.get(expected.id))assert.ok(visibleReference.includes(phrase),expected.id+': 補足を開いた画面にも全文の字句がある '+phrase);
            assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),expected.id+': 原書補足を開いても横幅に収まる');
            referenceChecks.push({id:expected.id,width,theme,pages});
            await page.locator('#source-reference summary').click();
            assert.equal(await page.locator('#source-reference').getAttribute('open'),null,expected.id+': 原書参照を閉じられる');
          }
          if(actual.diagram)seenDiagrams.add(actual.diagram);
          if(i===0||actual.diagram&&theme==='light'&&!savedDiagrams.has(width+':'+actual.diagram)){savedDiagrams.add(width+':'+actual.diagram);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(output,`${expected.id}-${width}-${theme}.png`),fullPage:true});}
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
        const nextVolume=allModernSeries[allModernSeries.findIndex(item=>item.id===volume.id)+1];
        await page.waitForURL(nextVolume?base+'/'+nextVolume.id+'-story.html':base+'/?book=modern#modern-book');
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
  // 第24回末尾から第25回冒頭へ進み、前回末尾へ戻れる。
  const previousVolume=previousSeries.at(-1),previousScenes=previousEdition[previousVolume.id],previousLast=previousScenes.at(-1);
  const previousHref='/'+previousVolume.id+'-story.html#page-'+previousScenes.length;
  await page.goto(base+previousHref);
  await page.waitForFunction(id=>document.querySelector('#story-map')?.dataset.scene===id,previousLast.id);
  assert.equal(await page.locator('#next').isDisabled(),false,'第24回末尾から第25回へ進める');
  await page.locator('#next').click();await settleScene(page,modernVisualEdition[modernSeries[0].id][0]);
  assert.equal(await page.locator('#previous-volume-link').getAttribute('href'),previousHref,'第25回冒頭から第24回末尾への案内');
  await page.locator('#previous-volume-link').click();
  await page.waitForFunction(id=>document.querySelector('#story-map')?.dataset.scene===id,previousLast.id);
  assert.equal(await page.locator('#story-progress').getAttribute('value'),String(previousScenes.length),'前回の末尾へ戻る');
  await page.locator('#next').click();await settleScene(page,modernVisualEdition[modernSeries[0].id][0]);
  // 同じ節内の番号指定でも、文書を読み直さず正しい場面へ移る。
  const firstVolume=modernSeries[0],firstScenes=modernVisualEdition[firstVolume.id];
  await page.goto(base+'/'+firstVolume.id+'-story.html#page-1');await settleScene(page,firstScenes[0]);
  await page.evaluate(()=>{location.hash='#page-3';});await settleScene(page,firstScenes[2]);
  assert.equal(await page.locator('#story-progress').getAttribute('value'),'3','同じ文書内の番号指定を表示へ反映');
  await page.reload();await settleScene(page,firstScenes[2]);
  assert.equal(await page.locator('#story-progress').getAttribute('value'),'3','再読込しても番号指定の場面を保持');
  assert.deepEqual([...seenPages].filter(page=>page>=454&&page<=475).sort((a,b)=>a-b),Array.from({length:22},(_,i)=>i+454),'表と独立欄を含む回内22ページすべてへ到達');
  assert.deepEqual([...seenPages].filter(page=>page<454||page>475).sort((a,b)=>a-b),[],'回外の原書参照を補わない');
  assert.deepEqual([...seenDiagrams].sort(),Object.values(modernDiagrams).map(diagram=>diagram.title).sort(),'今回の比較・表・コラムに沿う説明図をすべて表示する');
  }
  let motion;
  try {motion=await checkMotion(browser,output,errors);}
  catch(error) {
    await writeFile(path.join(output,'result.json'),JSON.stringify({inspected,errors,issues,pages:[...seenPages],lessonPages:[...seenPages].filter(p=>p>=454&&p<=475),externalPages:[...seenPages].filter(p=>p<454||p>475),diagrams:[...seenDiagrams],referenceChecks,contextRegions:[...readingPlan.values()].filter(scene=>scene.contextRegions?.length).map(scene=>({id:scene.id,regions:scene.contextRegions})),motionFailure:error.message},null,2));
    throw error;
  }
  await writeFile(path.join(output,'result.json'),JSON.stringify({inspected,errors,issues,pages:[...seenPages],lessonPages:[...seenPages].filter(p=>p>=454&&p<=475),externalPages:[...seenPages].filter(p=>p<454||p>475),diagrams:[...seenDiagrams],referenceChecks,contextRegions:[...readingPlan.values()].filter(scene=>scene.contextRegions?.length).map(scene=>({id:scene.id,regions:scene.contextRegions})),motion},null,2));
  if(!motionOnly)assert.equal(referenceChecks.length,criticalReferences.size*4,'地図・独立コラム・政治団体・年号の重要場面を2幅・2色で開閉して確認する');
  assert.deepEqual(errors,[]);
  assert.deepEqual(issues,[],'地図の名前・文字の重なり・はみ出し');
  console.log(motionOnly?`近代第25回の通常再生を確認しました。静止${motion.staticScenes.length}場面、実移動${motion.physicalMovements}件、姿切替${motion.switches}件、途中・到着・再表示・取消を確認済みです。`:`近代・現代 第25回の全${Object.values(modernEdition).flat().length}場面を幅1440・390、明暗両方で計${inspected}回確認しました。人物・吹き出し・模式欄の絵と名前・重なり・はみ出し、通常再生での静止保持${motion.staticScenes.length}場面・実移動${motion.physicalMovements}件・姿切替${motion.switches}件・再表示・取消、3節の切替・本文と装飾・回内原書22ページの補足・${seenDiagrams.size}図・末尾移動・旧教材の両端も確認済みです。`);
} finally {await browser?.close();server.kill();}
