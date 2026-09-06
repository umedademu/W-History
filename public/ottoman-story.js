import {createMapLayout} from "./map-layout.js?v=0.009";
import {pages as scenes,chapters,mentionsForPage} from "./ottoman-pages.js?v=0.016";
import {entities,positionFor} from "./ottoman-storyboard.js?v=0.014";
import {symbolGraphic,symbolPaths} from "./ottoman-symbols.js?v=0.013";
import {project,worldMap,createOrientation,transitionFor} from "./ottoman-orientation.js?v=0.016";

const byId=id=>document.getElementById(id), map=byId("story-map"),root=byId("map-characters");
const reduced=matchMedia("(prefers-reduced-motion: reduce)"),clamp=n=>Math.max(0,Math.min(1,n));
const colors={campaign:"#b5573f",rival:"#5c7886",move:"#54866b",trade:"#a57d27"};
const resolveImg=key=>"/images/"+(key.includes("/")?key:"ottoman/"+key)+".png";
let index=0,partIndex=0,elapsed=0,playing=!reduced.matches,stop=()=>{};
let lastSize="",displayedScene=null,replayMode="none",pending=false,activeIntro="none";
const currentAnimation=()=>scenes[index].animation;
// 動きを抑える設定では、ページ全体の結果を一枚の地図にまとめる。
function overview(){
  const parts=currentAnimation(),last=parts.at(-1),ids=[...new Set(parts.flatMap(p=>p.ids))];
  const positions=Object.assign({},...parts.map(p=>Object.fromEntries(p.ids.map(id=>[id,positionFor(id,p)]))));
  for(const part of parts)for(const route of part.moves??[])positions[route.who]=route.path.at(-1);
  const frames=parts.map(p=>p.frame);
  return {...last,title:scenes[index].title,caption:scenes[index].body.join(" "),ids,positions,
    frame:[Math.min(...frames.map(f=>f[0])),Math.min(...frames.map(f=>f[1])),Math.max(...frames.map(f=>f[2])),Math.max(...frames.map(f=>f[3]))],
    detail:parts.every(p=>p.detail===last.detail)?last.detail:undefined,
    moves:parts.flatMap(p=>p.moves??[]),messages:parts.flatMap(p=>p.messages??[]),areas:parts.flatMap(p=>p.areas??[]),
    images:Object.assign({},...parts.map(p=>({...p.images,...p.afterImages}))),
    grow:[],fades:[],afterImages:{},afterIcons:{},badges:{},labels:Object.assign({},...parts.map(p=>p.labels))};
}
const currentPart=()=>reduced.matches?overview():currentAnimation()[partIndex];
const orientation=createOrientation({map,svg,onPending:value=>{
  pending=value;
  const hideNarrative=value&&activeIntro!=="nearby";
  byId("narrative").classList.toggle("is-orienting",hideNarrative);
  byId("narrative").setAttribute("aria-busy",String(value));
  byId("scene-content").setAttribute("aria-hidden",String(hideNarrative));
  byId("orientation-note").hidden=!hideNarrative;root.style.visibility=value?"hidden":"";updateControls();
}});
function svg(tag,attrs={},text){
  const node=document.createElementNS("http://www.w3.org/2000/svg",tag);
  for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);
  if(text)node.textContent=text;return node;
}
function geometry(step,width,height){
  const [w,s,e,n]=step.frame??scenes[index].frame;
  const points=[[w,n],[e,s],...step.ids.map(id=>positionFor(id,step)),
    ...(step.moves??[]).flatMap(r=>r.path),...(step.messages??[]).flatMap(r=>r.path),
    ...step.ids.flatMap(id=>entities[id].outline??[]),...(step.areas??[]).flatMap(a=>a.points)].map(project);
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const scale=Math.min((width-90)/(maxX-minX),(height-145)/(maxY-minY));
  const x=width/2-(minX+maxX)/2*scale,y=(height-35)/2-(minY+maxY)/2*scale;
  return {scale,x,y,toScreen:p=>{const q=project(p);return [q[0]*scale+x,q[1]*scale+y];}};
}
function updateControls(){
  const part=currentPart(),finished=reduced.matches||partIndex===currentAnimation().length-1&&elapsed>=part.duration;
  byId("animation-play").disabled=pending||reduced.matches||finished;
  byId("animation-play").textContent=reduced.matches?"静止表示":finished?"再生終了":playing?"一時停止":"再生を再開";
  byId("animation-play").setAttribute("aria-pressed",String(playing));
  byId("animation-state").textContent=pending?"場所を確認しています":finished?"読み終えたら「次のページ」へ":playing?"色の付いた文章を地図で表しています":"動きを一時停止しています";
  document.querySelectorAll("[data-paragraph]").forEach((p,i)=>{
    const active=reduced.matches||i===partIndex;p.classList.toggle("is-current",active);
    if(active)p.setAttribute("aria-current","true");else p.removeAttribute("aria-current");
  });
  document.querySelectorAll("[data-mention]").forEach(n=>n.classList.toggle("is-map-active",part.ids.includes(n.dataset.mention)));
}

function drawMap(mode="none",restart=false){
  stop();orientation.cancel();activeIntro=mode;
  const scene=scenes[index],step=currentPart(),width=map.clientWidth,height=map.clientHeight;
  if(!width||!height)return;lastSize=width+","+height;
  const camera=geometry(step,width,height),{scale,x,y,toScreen}=camera;
  const polygon=points=>points.map(p=>toScreen(p).join(",")).join(" ");
  const line=points=>points.map((p,i)=>(i?"L":"M")+toScreen(p).join(",")).join(" ");
  map.setAttribute("viewBox","0 0 "+width+" "+height);map.dataset.scene=scene.id;map.dataset.part=partIndex;
  map.replaceChildren(svg("title",{id:"map-title"},step.title),svg("desc",{id:"map-description"},step.text??step.caption),
    svg("image",{href:worldMap.url,x,y,width:worldMap.width*scale,height:worldMap.height*scale}));
  root.replaceChildren();root.dataset.scene=scene.id;root.dataset.part=partIndex;root.dataset.phase="loading";
  byId("map-heading").textContent=step.title;byId("map-focus").textContent=step.ids.map(id=>entities[id].name).join(" ／ ");
  // 世界地図では省略される金角湾と海峡を、位置関係の模式図として描く。
  if(step.detail){
    map.append(svg("rect",{width,height,fill:"#e5dfc9"}));
    for(const points of [
      [[28.85,40.97],[29.10,40.97],[29.08,41.012],[29.015,41.006],[28.98,41.004],[28.94,40.994]],
      [[29.015,41.006],[29.08,41.012],[29.061,41.045],[29.06,41.12],[29.04,41.12],[29.03,41.073],[29.025,41.05],[28.994,41.025]],
      [[28.994,41.025],[28.997,41.035],[28.975,41.045],[28.955,41.05],[28.936,41.058],[28.95,41.04],[28.97,41.03]]
    ])map.append(svg("polygon",{points:polygon(points),fill:"#d9e9e7",stroke:"#a7bbb0","stroke-width":1}));
    if(step.detail==="siege")map.append(svg("path",{d:line([[28.928,41.003],[28.942,41.032],[28.95,41.04]]),stroke:"#857865","stroke-width":7,fill:"none","data-wall":"true"}),
      svg("path",{d:line([[28.98,41.024],[28.994,41.035]]),stroke:"#647779","stroke-width":3,"stroke-dasharray":"3 3",fill:"none"}));
  }
  const areaNodes=[];
  for(const id of step.ids){
    const entity=entities[id];if(!entity.outline)continue;
    const node=svg(id==="danube"?"polyline":"polygon",{points:polygon(entity.outline),fill:id==="danube"?"none":"#55968b","fill-opacity":.2,stroke:id==="danube"?"#5c92a6":"#4f8b7d","stroke-width":id==="danube"?3:1.5,"stroke-dasharray":id==="danube"?"none":"5 4"});
    map.append(node);areaNodes.push({node,mode:"locate"});
  }
  for(const area of step.areas??[]){
    const node=svg("polygon",{points:polygon(area.points),fill:"#b96544",stroke:"#a25439","stroke-width":1.5});
    map.append(node);areaNodes.push({...area,node});
  }
  const settlements=(step.settlements??[]).map((p,i)=>{
    const [sx,sy]=toScreen(p),node=svg("g",{"data-settlement":i});
    node.append(svg("circle",{cx:sx,cy:sy,r:19,fill:["#af8153","#778f73","#bba257"][i%3],"fill-opacity":.38}),
      svg("path",{d:"M"+(sx-6)+","+(sy+6)+" v-10 l6,-5 6,5 v10 Z",fill:"#f9ebcd",stroke:"#786b51","stroke-width":1.5}));
    map.append(node);return node;
  });
  const routeNodes=[...(step.moves??[]),...(step.messages??[])].map((route,i)=>{
    const d=line(route.path),color=colors[route.kind];
    const ghost=svg("path",{d,fill:"none",stroke:color,"stroke-width":1.5,opacity:.18});
    const path=svg("path",{d,fill:"none",stroke:color,"stroke-width":2.7,"stroke-linecap":"round","data-route":i});
    const head=svg("path",{d:"M-7,-4 L0,0 -7,4",fill:"none",stroke:color,"stroke-width":2});
    map.append(ghost,path,head);
    const length=path.getTotalLength();let reveal=path;
    path.setAttribute("stroke-dasharray",length+" "+length);
    if(route.kind==="trade"){
      const mask=svg("mask",{id:"route-reveal-"+i,maskUnits:"userSpaceOnUse",x:0,y:0,width,height});
      reveal=svg("path",{d,fill:"none",stroke:"white","stroke-width":9,"stroke-dasharray":length+" "+length});
      mask.append(reveal);map.prepend(mask);path.setAttribute("mask","url(#route-reveal-"+i+")");path.setAttribute("stroke-dasharray","3 5");
    }
    return {route,path,reveal,head,length};
  });
  const labels=svg("g",{class:"ottoman-labels"}),pins=svg("g",{class:"ottoman-pins"});map.append(pins,labels);
  const locateNodes=[];
  function label(text,point,attrs={}){
    const [px,py]=toScreen(point),node=svg("text",{x:px,y:py+20,"text-anchor":"middle","data-anchor-x":px,"data-anchor-y":py,...attrs},text);
    labels.append(node);return node;
  }
  for(const id of step.ids){
    const e=entities[id],point=positionFor(id,step),[px,py]=toScreen(point);
    pins.append(step.capital===id ? svg("path",{d:"M"+px+","+(py-6)+" l6,6 -6,6 -6,-6 Z",fill:"#a84932",stroke:"#fff9ec","stroke-width":1.5}) : svg("circle",{cx:px,cy:py,r:3.5,fill:"#437a7c",stroke:"#fff9ec","stroke-width":1.4}));
    if(!["place","state"].includes(e.kind))continue;
    const ring=svg("circle",{cx:px,cy:py,r:8,fill:"none",stroke:"#ad6042","stroke-width":1.5});
    pins.append(ring);locateNodes.push(ring);
    label(step.labels?.[id]??e.name,point,{class:e.kind==="state"?"ottoman-country":"ottoman-city","data-entity":id});
  }
  routeNodes.forEach(({route})=>{if(route.label)label(route.label,route.path[Math.floor((route.path.length-1)/2)],{class:"ottoman-route-label"});});
  const small=width<500;
  const items=step.ids.filter(id=>!["place","state"].includes(entities[id].kind)).map(id=>{
    const imgKey=step.images?.[id]??entities[id].image;
    const e={...entities[id],name:step.labels?.[id]??entities[id].name,icon:step.icons?.[id]??entities[id].icon,image:imgKey},node=document.createElement("div"),size=e.kind==="person"?(small?48:58):(small?45:55);
    node.className="ottoman-map-item";node.dataset.entity=id;node.dataset.name=e.name;
    node.style.setProperty("--item-width",size+"px");node.style.setProperty("--item-height",(e.image&&e.kind==="person"?size*1.5:size)+"px");
    node.innerHTML='<span class="ottoman-connector"></span><div class="ottoman-figure"><span class="ottoman-bubble"></span>'+
      (e.image?'<img src="'+resolveImg(e.image)+'" alt="" draggable="false">':symbolGraphic(e.icon))+'<span class="ottoman-name"></span></div>';
    node.querySelector(".ottoman-name").textContent=e.name;root.append(node);
    return {id,item:{...e,bubble:step.badges?.[id]},node,figure:node.querySelector(".ottoman-figure"),graphic:node.querySelector("img,.ottoman-symbol"),bubble:node.querySelector(".ottoman-bubble"),connector:node.firstElementChild};
  });
  const placeContents=createMapLayout({map,root,items});let frame=0,cancelled=false;
  function update(p){
    map.dataset.progress=p.toFixed(3);map.dataset.phase=p>=1?"complete":"moving";root.dataset.phase=map.dataset.phase;
    byId("map-status").textContent=reduced.matches?"このページ全体の位置と関係":step.text;
    areaNodes.forEach(({node,mode})=>{
      node.style.opacity=String(mode==="fade"||mode==="split"?.5*(1-p)+.06:mode==="locate"?.65+.35*p:.12+.3*p);
      if(mode==="transfer")node.setAttribute("fill",p<.5?"#b96544":"#5c8394");
      if(mode==="grow"){const b=node.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;node.setAttribute("transform","translate("+cx+","+cy+") scale("+(.15+.85*p)+") translate("+(-cx)+","+(-cy)+")");}
    });
    settlements.forEach((node,i)=>node.style.opacity=String(clamp((p-i*.12)*4)));
    locateNodes.forEach((node,i)=>{node.setAttribute("r",8+8*Math.sin(clamp(p*1.8-i*.12)*Math.PI));node.setAttribute("opacity",.4+.5*p);});
    routeNodes.forEach(({route,path,reveal,head,length})=>{
      const q=clamp((p-(route.start??0))/((route.end??1)-(route.start??0))),at=path.getPointAtLength(length*q),prev=path.getPointAtLength(Math.max(0,length*q-1));
      reveal.setAttribute("stroke-dashoffset",length*(1-q));head.setAttribute("opacity",q>0?1:0);
      head.setAttribute("transform","translate("+at.x+","+at.y+") rotate("+(Math.atan2(at.y-prev.y,at.x-prev.x)*180/Math.PI)+")");path.dataset.progress=q.toFixed(3);
    });
    for(const {id,node,figure,graphic,bubble} of items){
      const moving=routeNodes.find(r=>r.route.who===id),q=moving?clamp((p-(moving.route.start??0))/((moving.route.end??1)-(moving.route.start??0))):p;
      const at=moving?moving.path.getPointAtLength(moving.length*q):null,pos=at?[at.x,at.y]:toScreen(positionFor(id,step));
      node.style.transform="translate("+pos[0]+"px,"+pos[1]+"px)";figure.style.transform="translate(-50%,0)";
      graphic.style.opacity=String(step.fades?.includes(id)?1-.65*p:step.grow?.includes(id)?.2+.8*p:.7+.3*p);
      graphic.style.clipPath=step.grow?.includes(id)?"inset("+((1-p)*100)+"% 0 0 0)":"none";
      if(step.afterImages?.[id]){
        const nextImg=p>=.5?step.afterImages[id]:(step.images?.[id]??entities[id].image);
        if(node.dataset.image!==nextImg){
          const targetSrc=resolveImg(nextImg);
          const img=node.querySelector("img");
          if(img&&img.getAttribute("src")!==targetSrc){img.src=targetSrc;}
          node.dataset.image=nextImg;
        }
      }
      if(step.afterIcons?.[id]&&!entities[id].image){
        const icon=p>=.5?step.afterIcons[id]:entities[id].icon;
        if(node.dataset.icon!==icon){graphic.innerHTML=symbolPaths[icon];node.dataset.icon=icon;}
      }
      bubble.textContent=p>=.96?step.badges?.[id]??"":"";
      node.classList.toggle("is-walking",Boolean(moving&&q>0&&q<1&&playing&&!reduced.matches));
    }
    // 名前は残し、図像や領域の弱まりで敗退・解体を示す。
    for(const id of step.fades??[]){const n=labels.querySelector('[data-entity="'+id+'"]');if(n)n.style.fill=p>.5?"#777767":"";}
    const wall=map.querySelector("[data-wall]");if(wall)wall.style.opacity=step.fades?.includes("walls")?String(1-.65*p):"1";
    placeContents();byId("animation-progress").value=reduced.matches?1:(partIndex+p)/currentAnimation().length;
  }
  stop=()=>{cancelled=true;cancelAnimationFrame(frame);};
  function start(){
    if(cancelled)return;activeIntro="none";
    if(reduced.matches){elapsed=step.duration;playing=false;update(1);updateControls();return;}
    update(clamp(elapsed/step.duration));if(!playing)return;
    let previous=performance.now();
    function tick(now){
      if(cancelled)return;elapsed+=Math.max(0,now-previous);previous=now;update(clamp(elapsed/step.duration));
      // 同じ主題の動きを一続きに見せ、対応する文章も同時に強調する。
      if(elapsed>=step.duration){
        if(partIndex===currentAnimation().length-1){playing=false;updateControls();return;}
        if(elapsed>=step.duration+900){partIndex++;elapsed=0;drawMap("nearby");return;}
      }
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  }
  updateControls();orientation.run({scene:{...scene,frame:step.frame??scene.frame},target:camera,mode,restart,stationary:reduced.matches,done:start});
}
function markNames(scene){
  const mentions=mentionsForPage(scene),seen=new Set(),alternatives=mentions.filter(m=>{if(seen.has(m.term))return false;seen.add(m.term);return true;});
  const escape=s=>s.replace(/[.*+?^\u0024{}()|[\]\\]/g,"\\$&");
  const pattern=new RegExp(alternatives.map(m=>escape(m.term)).join("|"),"g"),lookup=new Map(alternatives.map(m=>[m.term,m]));
  const walker=document.createTreeWalker(byId("scene-body"),NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const text of nodes){
    const fragment=document.createDocumentFragment();let end=0;
    for(const match of text.textContent.matchAll(pattern)){
      fragment.append(text.textContent.slice(end,match.index));
      const name=document.createElement("span");name.className="map-mention";name.dataset.mention=lookup.get(match[0]).id;name.textContent=match[0];
      fragment.append(name);end=match.index+match[0].length;
    }
    fragment.append(text.textContent.slice(end));text.replaceWith(fragment);
  }
}

function show(scroll=false){
  const scene=scenes[index];partIndex=0;elapsed=0;playing=!reduced.matches;
  for(const [id,value] of Object.entries({"scene-number":String(index+1).padStart(2,"0")+" / "+scenes.length,"scene-year":scene.year,"scene-kicker":scene.kicker,"scene-title":scene.title,"scene-note":scene.notes.join(" "),"progress-label":(index+1)+" / "+scenes.length}))byId(id).textContent=value;
  byId("scene-body").replaceChildren(...scene.body.map((text,i)=>{const p=document.createElement("p");p.dataset.paragraph=i;p.textContent=text;return p;}));markNames(scene);
  byId("previous").disabled=index===0;byId("next").textContent=index===scenes.length-1?"最初のページへ ↻":"次のページ →";
  byId("story-progress").max=scenes.length;byId("story-progress").value=index+1;
  byId("page-select").value=index;
  document.querySelectorAll("button[data-scene]").forEach(b=>{if(+b.dataset.scene===index)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  document.querySelectorAll("[data-chapter]").forEach(b=>{if(scenes[+b.dataset.chapter].chapter===scene.chapter)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current");});
  const mode=transitionFor(scene,displayedScene);replayMode=mode==="nearby"?"none":mode;displayedScene=scene;drawMap(mode);
  if(scroll)byId("page-controls").scrollIntoView({block:"start",behavior:"instant"});
}

function go(next){next=Math.max(0,Math.min(scenes.length-1,next));if(next===index)return;index=next;show(true);}
const chapterNav=document.querySelector(".chapter-nav");
chapters.forEach((title,chapter)=>{
  const first=scenes.findIndex(s=>s.chapter===chapter),b=document.createElement("button");b.type="button";b.dataset.chapter=first;b.textContent=title;b.addEventListener("click",()=>go(first));chapterNav.append(b);
});
scenes.forEach((scene,i)=>{
  const b=document.createElement("button");b.type="button";b.dataset.scene=i;b.textContent=String(i+1).padStart(2,"0")+"　"+scene.title;b.addEventListener("click",()=>go(i));byId("scene-nav").append(b);
  const option=document.createElement("option");option.value=i;option.textContent=(i+1)+". "+scene.title;byId("page-select").append(option);
});
byId("page-select").addEventListener("change",e=>go(+e.target.value));
byId("previous").addEventListener("click",()=>go(index-1));
byId("next").addEventListener("click",()=>go(index===scenes.length-1?0:index+1));
byId("replay").addEventListener("click",()=>{partIndex=0;elapsed=0;playing=!reduced.matches;drawMap(replayMode,true);});
byId("show-location").addEventListener("click",()=>{replayMode="world";drawMap("world");});
byId("animation-play").addEventListener("click",()=>{
  if(pending||reduced.matches)return;playing=!playing;drawMap();
});

document.addEventListener("keydown",event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.repeat||event.target.closest("input,textarea,select,[contenteditable=true],details"))return;
  if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();go(index+(event.key==="ArrowRight"?1:-1));}
});
new ResizeObserver(()=>{const size=map.clientWidth+","+map.clientHeight;if(size===lastSize)return;drawMap(activeIntro);}).observe(map);
reduced.addEventListener("change",()=>{playing=!reduced.matches;drawMap(activeIntro);});
show();
