import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
import {characterScenes} from "../public/timur-characters.js";
import {scenes as afterScenes} from "../public/timur-after-scenes.js";
import {scenes as safavidScenes} from "../public/safavid-scenes.js";

const root=fileURLToPath(new URL("../",import.meta.url)),publicRoot=path.join(root,"public");
async function files(dir){return(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const publicFiles=await files(publicRoot),scripts=await files(path.join(root,"scripts"));
for(const file of [...publicFiles,...scripts].filter(f=>/\.(m?js)$/.test(f))){const result=spawnSync(process.execPath,["--check",file],{encoding:"utf8"});if(result.status!==0)throw new Error(result.stderr);}
let references=0;
for(const file of publicFiles.filter(f=>/\.(html|js|css)$/.test(f))){
  const text=await fs.readFile(file,"utf8");
  const refs=file.endsWith(".html")?[...text.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(m=>m[1]):[...text.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)].map(m=>m[1]);
  if(file.endsWith(".css"))refs.push(...[...text.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)].map(m=>m[1]));
  for(const ref of refs){if(/^(https?:|#|data:|mailto:)/.test(ref))continue;const clean=ref.split(/[?#]/)[0];const target=clean.startsWith("/")?path.join(publicRoot,clean==="/"?"index.html":clean):path.resolve(path.dirname(file),clean);await fs.access(target);references++;}
  if(/anki-ume\.vercel\.app|anki-progress-api|cloud-progress\.js|speech\.js/.test(text))throw new Error(`Ankiへの依存が残っています: ${file}`);
}
const catalog=await fs.readFile(path.join(publicRoot,"index.html"),"utf8");
for(const name of ["timur-story","timur-after-story","safavid-story"]){if(!catalog.includes(`href="/${name}.html"`))throw new Error(`教材の入口がありません: ${name}`);}
const config=JSON.parse(await fs.readFile(path.join(root,"vercel.json"),"utf8"));if(config.outputDirectory!=="public")throw new Error("Vercelの公開先が違います。");
const images=new Set();
function collectImages(value,directory){
  if(!value||typeof value!=="object")return;
  for(const [key,item] of Object.entries(value)){
    if(["image","afterImage"].includes(key)&&typeof item==="string")images.add(`images/${item.includes("/")?item:`${directory}/${item}`}.png`);
    else collectImages(item,directory);
  }
}
collectImages(characterScenes,"timur");collectImages(afterScenes,"timur-after");collectImages(safavidScenes,"safavid");
for(const file of images){const data=await fs.readFile(path.join(publicRoot,file));if(data.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw new Error(`画像を確認できません: ${file}`);}
console.log(`構文・参照先${references}件・場面で使う画像${images.size}点・3教材の入口・Ankiからの独立・Vercel設定を確認しました。`);
