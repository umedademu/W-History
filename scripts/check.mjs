import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
import {scenes as islamOriginScenes} from "../public/islam-origin-scenes.js";
import {scenes as umayyadAbbasidScenes} from "../public/umayyad-abbasid-scenes.js";
import {scenes as regionalDynastiesScenes} from "../public/regional-dynasties-scenes.js";
import {characterScenes} from "../public/timur-characters.js";
import {scenes as afterScenes} from "../public/timur-after-scenes.js";
import {scenes as safavidScenes} from "../public/safavid-scenes.js";
import {scenes as ottomanScenes} from "../public/ottoman-scenes.js";
import {scenes as mughalScenes} from "../public/mughal-scenes.js";
import {scenes as islamicCultureScenes} from "../public/islamic-culture-scenes.js";
import "./check-ottoman-orientation.mjs";
import "./check-map-layout.mjs";
import "./check-ottoman-storyboard.mjs";
import "./check-ottoman-pages.mjs";
import "./check-mughal-culture-order.mjs";

const root=fileURLToPath(new URL("../",import.meta.url)),publicRoot=path.join(root,"public");
async function files(dir){return(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const publicFiles=await files(publicRoot),scripts=await files(path.join(root,"scripts"));
for(const file of [...publicFiles,...scripts].filter(f=>/\.(m?js)$/.test(f))){const result=spawnSync(process.execPath,["--check",file],{encoding:"utf8"});if(result.status!==0)throw new Error(result.stderr);}
let references=0;
for(const file of publicFiles.filter(f=>/\.(html|js|css)$/.test(f))){
  const text=await fs.readFile(file,"utf8");
  const refs=file.endsWith(".html")?[...text.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(m=>m[1]):[...text.matchAll(/(?:\bfrom\s+|\bimport\s*)["']([^"']+)["']/g)].map(m=>m[1]);
  if(file.endsWith(".css"))refs.push(...[...text.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)].map(m=>m[1]));
  for(const ref of refs){if(/^(https?:|#|data:|mailto:)/.test(ref))continue;const clean=ref.split(/[?#]/)[0];const target=clean.startsWith("/")?path.join(publicRoot,clean==="/"?"index.html":clean):path.resolve(path.dirname(file),clean);await fs.access(target);references++;}
  if(/anki-ume\.vercel\.app|anki-progress-api|cloud-progress\.js|speech\.js/.test(text))throw new Error(`Ankiへの依存が残っています: ${file}`);
}
const htmlFiles=publicFiles.filter(file=>file.endsWith(".html"));
for(const file of htmlFiles){
  const html=await fs.readFile(file,"utf8");
  if(!html.includes('/theme.js?v=0.024')||!html.includes('/theme.css?v=0.024'))throw new Error(`明暗テーマの共通部品がありません: ${file}`);
}
const themeScript=await fs.readFile(path.join(publicRoot,"theme.js"),"utf8");
const themeStyle=await fs.readFile(path.join(publicRoot,"theme.css"),"utf8");
for(const required of ["prefers-color-scheme: dark","localStorage.setItem","dataset.themeToggle"]){if(!themeScript.includes(required))throw new Error(`明暗テーマの切り替え処理が不足しています: ${required}`);}
for(const required of ['html[data-theme="dark"]','.theme-toggle','#story-map image']){if(!themeStyle.includes(required))throw new Error(`ダークテーマの配色が不足しています: ${required}`);}
const catalog=await fs.readFile(path.join(publicRoot,"index.html"),"utf8");
const allModules=[
  "islam-origin-story",
  "umayyad-abbasid-story",
  "regional-dynasties-story",
  "timur-story",
  "timur-after-story",
  "safavid-story",
  "ottoman-story",
  "mughal-story",
  "islamic-culture-story"
];
for(const name of allModules){if(!catalog.includes(`href="/${name}.html"`))throw new Error(`教材の入口がありません: ${name}`);}
const config=JSON.parse(await fs.readFile(path.join(root,"vercel.json"),"utf8"));if(config.outputDirectory!=="public")throw new Error("Vercelの公開先が違います。");
const images=new Set();
function collectImages(value,directory){
  if(!value||typeof value!=="object")return;
  for(const [key,item] of Object.entries(value)){
    if(["image","afterImage"].includes(key)&&typeof item==="string")images.add(`images/${item.includes("/")?item:`${directory}/${item}`}.png`);
    else collectImages(item,directory);
  }
}
collectImages(islamOriginScenes,"islam-origin");
collectImages(umayyadAbbasidScenes,"umayyad-abbasid");
collectImages(regionalDynastiesScenes,"regional-dynasties");
collectImages(characterScenes,"timur");
collectImages(afterScenes,"timur-after");
collectImages(safavidScenes,"safavid");
collectImages(ottomanScenes,"ottoman");
collectImages(mughalScenes,"mughal");
collectImages(islamicCultureScenes,"islamic-culture");
for(const file of images){const data=await fs.readFile(path.join(publicRoot,file));if(data.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw new Error(`画像を確認できません: ${file}`);}
// 参照先の地名や経路が欠けると、その場面を開いたときだけ停止してしまう。
// 追加５編は、全場面の地理データと入口の操作部品も検査する。
let reviewedScenes=0;
for(const name of ["islam-origin","umayyad-abbasid","regional-dynasties","mughal","islamic-culture"]){
  const {places,zones,scenes}=await import(`../public/${name}-scenes.js`);
  const ids=new Set();
  function fail(scene,message){throw new Error(`${name}/${scene.id}: ${message}`);}
  function coordinate(scene,p){
    if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)||p[0]<-18||p[0]>122||p[1]<-26||p[1]>55)fail(scene,"地図の範囲外、または不正な座標です。");
  }
  for(const scene of scenes){
    if(ids.has(scene.id))fail(scene,"場面の識別名が重複しています。");ids.add(scene.id);
    for(const field of ["title","year","kicker","takeaway","note","mapHeading","focus","before","after"]){if(typeof scene[field]!=="string"||!scene[field].trim())fail(scene,`${field}がありません。`);}
    if(scene.body.length<2||!scene.facts.length)fail(scene,"本文か地図の見どころが不足しています。");
    if(!Number.isFinite(scene.duration)||scene.duration<0)fail(scene,"表示時間が不正です。");
    if(scene.frame.length!==4||!scene.frame.every(Number.isFinite)||scene.frame[0]>=scene.frame[2]||scene.frame[1]>=scene.frame[3])fail(scene,"地図の表示範囲が不正です。");
    for(const key of [...scene.pins,...[scene.capital,scene.battle].filter(Boolean)]){if(!places[key])fail(scene,`地名 ${key} がありません。`);coordinate(scene,places[key].point);}
    for(const key of scene.zones){if(!zones[key])fail(scene,`地域 ${key} がありません。`);zones[key].points.forEach(p=>coordinate(scene,p));}
    scene.tags.forEach(t=>coordinate(scene,t.at));
    for(const route of scene.routes){
      if(route.points.length<2||!["campaign","rival","move","trade"].includes(route.kind)||(route.start??0)>=(route.end??1))fail(scene,"経路または移動の時間が不正です。");
      route.points.forEach(p=>coordinate(scene,p));
    }
    for(const actor of [...scene.actors,...scene.props]){
      coordinate(scene,typeof actor.at==="string"?places[actor.at]?.point:actor.at);
      if(actor.route!==undefined&&(!Number.isInteger(actor.route)||!scene.routes[actor.route]))fail(scene,`${actor.name} の移動先がありません。`);
    }
    reviewedScenes++;
  }
  const html=await fs.readFile(path.join(publicRoot,`${name}-story.html`),"utf8");
  for(const id of ["map-heading","map-characters","map-status","map-facts","scene-nav","story-progress","previous","next","replay"]){if(!html.includes(`id="${id}"`))throw new Error(`${name}: ${id}がありません。`);}
  const chapters=[...html.matchAll(/data-chapter="(\d+)"/g)].map(m=>Number(m[1]));
  const starts=scenes.flatMap((s,i)=>i===0||scenes[i-1].chapter!==s.chapter?[i]:[]);
  if(JSON.stringify(chapters)!==JSON.stringify(starts))throw new Error(`${name}: 章の入口が場面と一致しません。`);
}
console.log(`追加５編の${reviewedScenes}場面について、地名・座標・経路・人物・章・操作部品を確認しました。`);
console.log(`構文・参照先${references}件・場面で使う画像${images.size}点・9教材の入口・Ankiからの独立・Vercel設定を確認しました。`);
