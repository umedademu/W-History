import {entities} from "./ottoman-storyboard.js?v=0.014";

const aliases=Object.entries(entities).flatMap(([id,entity])=>entity.aliases.map(term=>({id,term}))).sort((a,b)=>b.term.length-a.term.length);
const escape=text=>text.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const lookup=new Map();
for(const alias of aliases)if(!lookup.has(alias.term))lookup.set(alias.term,alias.id);
const pattern=new RegExp([...lookup.keys()].map(escape).join("|"),"g");

// 長い名称を先に認識し、ルーム＝セルジューク朝を別の王朝と数える等の誤判定を防ぐ。
export function referencesIn(text){
  return [...text.matchAll(pattern)].filter(match=>!(match[0]==="徴税"&&text[match.index+match[0].length]==="権"))
    .map(match=>({id:lookup.get(match[0]),term:match[0],index:match.index}));
}
export function correspondenceIssues(part){
  const named=new Set(referencesIn(part.text).map(n=>n.id)),shown=new Set(part.ids);
  return {mapOnly:[...shown].filter(id=>!named.has(id)),textOnly:[...named].filter(id=>!shown.has(id))};
}
