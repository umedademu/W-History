import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {modernSeries} from '../public/modern-lesson-13-volumes.js';
import {modernNamesInText, modernNameCatalog} from '../public/modern-geography-13.js';

const workspace = process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root = path.resolve(workspace ?? fileURLToPath(new URL('../', import.meta.url)));
const read = name => fs.readFile(path.join(root, name), 'utf8');
export const escapeHTML = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const plainMarkdown = value => value.replace(/<rt>[\s\S]*?<\/rt>/g,'').replace(/<[^>]+>/g,'').replaceAll('**','');

function safeTag(token) {
  const match = token.match(/^<(\/)?(span|u|ruby|rt|em|br)([^>]*)>$/);
  assert(match, `表示に許可していない原文タグ: ${token}`);
  const [, close, name, tail] = match;
  if (close) { assert.equal(tail.trim(), ''); return `</${name}>`; }
  let remaining = tail;
  const attrs = [];
  while (remaining.trim()) {
    const attr = remaining.match(/^\s+([a-z-]+)="([^"]*)"/);
    assert(attr, `属性の形式が不正: ${token}`);
    const [, key, value] = attr;
    assert(key === 'style' || /^data-source-[a-z-]+$/.test(key), `許可していない属性: ${key}`);
    if (key === 'style') {
      for (const declaration of value.split(';').filter(Boolean)) {
        const [property, ...values] = declaration.split(':');
        if (name === 'span' && property.trim() === 'background' && values.join(':').trim() === 'repeating-linear-gradient(45deg,transparent,transparent 3px,#315837 3px,#315837 4px)') continue;
        assert(['color','background-color','border','padding','text-decoration-color'].includes(property.trim()) || (name === 'ruby' && property.trim() === 'ruby-position' && ['under','over'].includes(values.join(':').trim())) || (name === 'em' && property.trim() === 'font-style' && values.join(':').trim() === 'italic') || (name === 'span' && property.trim() === 'text-decoration' && values.join(':').trim() === 'line-through'), property);
        assert(/^[#a-z0-9.\s%-]+$/i.test(values.join(':')), declaration);
      }
    } else assert(/^[a-z0-9-]+$/.test(value), value);
    attrs.push(`${key}="${escapeHTML(value)}"`);
    remaining = remaining.slice(attr[0].length);
  }
  return `<${name}${attrs.length ? ' '+attrs.join(' ') : ''}>`;
}

// 原文の許可済みタグと太字記号だけを表示用HTMLへ変換する。
// Markdown全般や任意のHTML・属性を実行する処理ではない。
export function inlineHTML(markdown) {
  // 原文にある色の内側・外側の太字を、同じ文字と属性で正しい入れ子へ変換する。
  // 色のタグ内の太字は外側の太字とは別の範囲。原文資料を編集しない。
  let result='';const stack=[],colors=[];
  for(const token of markdown.split(/(<[^>]+>|\*\*)/g).filter(Boolean)) {
    if(token==='**') {
      if(stack.at(-1)==='strong'){stack.pop();result+='</strong>';}
      else {stack.push('strong');result+='<strong class="'+(colors.includes('red')?'source-red-bold':'source-bold')+'">';}
    } else if(token.startsWith('<')) {
      const tag=safeTag(token),match=tag.match(/^<(\/)?([a-z]+)\b/),[,close,name]=match;
      if(close)assert.equal(stack.pop(),name,'原文装飾の閉じる順 '+token);
      else if(name!=='br')stack.push(name);
      if(name==='span'){if(close)colors.pop();else colors.push(tag.match(/data-source-color="([^"]+)"/)?.[1]??'');}
      result+=tag;
    } else result+=escapeHTML(token);
  }
  assert.deepEqual(stack,[],'原文の太字・装飾が閉じている');assert.equal(colors.length,0);return result;
}

function blocksHTML(lines) {
  const out = [];
  for (let index = 0; index < lines.length;) {
    const text = lines[index];
    if (!text.trim()) { index++; continue; }
    if (text.startsWith('>')) {
      const quote = [];
      while (index < lines.length && lines[index].startsWith('>')) quote.push(lines[index++].replace(/^> ?/,''));
      out.push(`<blockquote>${blocksHTML(quote)}</blockquote>`);
      continue;
    }
    if (text.startsWith('|')) {
      const rows = [];
      while (index < lines.length && lines[index].startsWith('|')) {
        const cells = lines[index++].split('|').slice(1,-1).map(cell => cell.trim());
        if (!cells.every(cell => /^:?-+:?$/.test(cell))) rows.push(cells);
      }
      const width = Math.max(...rows.map(row => row.length));
      out.push(`<div class="source-table-wrap"><table><tbody>${rows.map(row => '<tr>'+Array.from({length:width},(_,i)=>`<td>${inlineHTML(row[i] ?? '')}</td>`).join('')+'</tr>').join('')}</tbody></table></div>`);
      continue;
    }
    if (text.startsWith('- ')) {
      const items = [];
      while (index < lines.length && lines[index].startsWith('- ')) items.push(`<li>${inlineHTML(lines[index++].slice(2))}</li>`);
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    const heading = text.match(/^(#{1,6}) (.*)$/);
    if (heading) out.push(`<h${heading[1].length}>${inlineHTML(heading[2])}</h${heading[1].length}>`);
    else out.push(`<p>${inlineHTML(text)}</p>`);
    index++;
  }
  return out.join('\n');
}

export async function loadModernRecords() {
  return {
    selection:JSON.parse(await read('docs/modern-lesson-13/source-selection.json')),
    plan:JSON.parse(await read('docs/modern-lesson-13/reading-plan.json')),
    routes:JSON.parse(await read('docs/modern-lesson-13/routes.json'))
  };
}

export async function verifyModernSource(selection, published = false) {
  if (published) return false;
  const candidates = [process.env.W_HISTORY_MODERN_SOURCE, path.join(root,selection.source_file), 'C:/Users/USER/Desktop/W-History/'+selection.source_file].filter(Boolean);
  for (const filename of [...new Set(candidates)]) {
    let raw;
    try { raw = await fs.readFile(filename); } catch(error) { if(error.code === 'ENOENT') continue; throw error; }
    assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), selection.source_sha256, '参照専用の原文資料が変わっている');
    assert.equal(raw.length, selection.source_bytes);
    const lines = raw.toString('utf8').replace(/^\uFEFF/,'').replaceAll('\r\n','\n').split('\n');
    if (lines.at(-1) === '') lines.pop();
    assert.deepEqual(lines, selection.lines.map(line => line.text), '全行の記録が原文と異なる');
    return true;
  }
  return false;
}

export async function makeModernEdition() {
  const {selection,plan,routes} = await loadModernRecords();
  await verifyModernSource(selection, process.argv.includes('--published'));
  const paragraphs = new Map(selection.paragraphs.map(paragraph => [paragraph.id,paragraph]));
  const modernEdition = Object.fromEntries(modernSeries.map(volume => [volume.id, []]));
  const modernPlaces = Object.fromEntries(modernNameCatalog.filter(entry => entry.kind === 'place').map(entry => [entry.key,{name:entry.name,point:entry.points[0],...(entry.geographicType?{geographicType:entry.geographicType,description:entry.description}:{})}]));
  for (const page of plan) {
    const chosen = page.paragraphs.map(id => { assert(paragraphs.has(id),id); return paragraphs.get(id); });
    const passages = chosen.map(paragraph => {
      const slice = page.slices?.find(item => item.paragraph === paragraph.id);
      const markdownStart = slice?.markdownStart ?? 0;
      const markdownEnd = slice?.markdownEnd ?? paragraph.markdown.length;
      assert(markdownStart >= 0 && markdownEnd > markdownStart && markdownEnd <= paragraph.markdown.length);
      const markdown = paragraph.markdown.slice(markdownStart, markdownEnd);
      return {paragraph:paragraph.id,markdown,lines:paragraph.lines,
        start:plainMarkdown(paragraph.markdown.slice(0,markdownStart)).length,
        end:plainMarkdown(paragraph.markdown.slice(0,markdownEnd)).length};
    });
    const plainBody = passages.map(passage => plainMarkdown(passage.markdown));
    const names = modernNamesInText(plainBody.join(''));
    // 分割で主語が省略された場面は、同じ段落か直前段落の明示された地域だけを引き継ぐ。
    // 人物の所在地や移動は作らず、本文外の地名を名前判定へ混ぜない。
    const contextRegions = page.contextRegions ?? [];
    const paragraphOrder = selection.paragraphs.map(paragraph => paragraph.id);
    const firstParagraphIndex = paragraphOrder.indexOf(chosen[0].id);
    for (const context of contextRegions) {
      const evidence = paragraphs.get(context.paragraph);
      assert(evidence && evidence.part === page.part, page.id+': 文脈地域の根拠は同じ節の原文段落');
      assert(chosen.some(paragraph=>paragraph.id === context.paragraph) || paragraphOrder[firstParagraphIndex-1] === context.paragraph, page.id+': 根拠は親段落または直前段落');
      assert(context.lines.length && context.lines.every(line=>evidence.lines.includes(line)) && context.reason?.trim(), page.id+': 文脈地域の原文行と理由');
      const entry = modernNameCatalog.find(entry=>entry.name === context.name && entry.kind === 'region');
      assert(entry, page.id+': 文脈地域は登録済み地域');
      const source = selection.lines.filter(line=>context.lines.includes(line.line)).map(line=>line.text).join('');
      assert(modernNamesInText(plainMarkdown(source)).some(name=>name.family === entry.family && name.kind === 'region'), page.id+': 指定原文行に同じ地域が明示される');
      assert(!names.some(name=>name.family === entry.family), page.id+': 本文の明示地域と文脈地域は重複しない');
      names.push(entry);
    }
    const routeEntries = routes.filter(route => route.scene === page.id);
    const allPoints = [...names.flatMap(entry => entry.points), ...routeEntries.flatMap(route => route.points)];
    // その場面で説明する地点をすべて含める。実際の拡大上限は共通の画面処理が適用する。
    let frame = allPoints.length ? [Math.max(-180,Math.min(...allPoints.map(p=>p[0]))-7),Math.max(-80,Math.min(...allPoints.map(p=>p[1]))-6),Math.min(180,Math.max(...allPoints.map(p=>p[0]))+7),Math.min(82,Math.max(...allPoints.map(p=>p[1]))+6)] : [-20,-40,55,55];
    const sourcePages = [...new Set(chosen.flatMap(paragraph => paragraph.sourcePages))].sort((a,b)=>a-b);
    const series = modernSeries.find(volume => volume.id === page.volume);
    modernEdition[page.volume].push({
      id:page.id,title:page.title,body:passages.map(passage=>inlineHTML(passage.markdown)),plainBody,
      sourceText:{book:'modern',chapter:3,lesson:13,part:page.part,passages:passages.map(({markdown,...passage})=>passage),sourcePages},
      frame,pins:names.filter(entry=>entry.kind === 'place').map(entry=>entry.key),contextRegions,
      // 川の点は位置関係の参考であり、都市や成功した交易経路として読ませない。
      nameOverrides:Object.fromEntries(names.filter(entry=>entry.geographicType === 'river-reference').map(entry=>[entry.name,entry.name+'（河川の概略参考点）'])),
      tags:names.filter(entry=>entry.kind !== 'place').flatMap(entry=>entry.points.map(at=>({text:entry.name,at,kind:entry.kind}))),
      zones:[],actors:[],props:[],routes:routeEntries.map(({scene,reason,...route})=>route),rivers:[],
      mapHeading:page.title,before:page.title,after:page.title,facts:[page.title],year:series.period,kicker:page.topicHeading??series.label,chapter:page.part-1,duration:routeEntries.length?3200:2000
    });
  }
  const sourcePages = Object.fromEntries(selection.pages.map(page=>[String(page),blocksHTML(selection.lines.filter(line=>line.page === page).map(line=>line.text))]));
  const sourcePageMetadata = Object.fromEntries(selection.pages.map(page=>[String(page),{book:'modern',chapter:3,lesson:13,page,sourceFile:selection.source_file,sourceSha256:selection.source_sha256,...(selection.blank_pages.includes(page)?{blank:true,note:'原書末尾の白紙境界。本文はありません。'}:{})}]));
  return {modernEdition,modernPlaces,sourcePages,sourcePageMetadata};
}

export async function renderModernModule() {
  const data = await makeModernEdition();
  return '// 原文の対応記録と通読した改ページ表から生成。sources は参照専用。\n'+Object.entries(data).map(([name,value])=>`export const ${name} = ${JSON.stringify(value,null,2)};\n`).join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = await renderModernModule();
  const filename = 'public/modern-c03-l13-edition.js';
  if(process.argv.includes('--check')) assert.equal((await read(filename)).replaceAll('\r\n','\n'),output, '近代・現代 第13回の再生成結果が異なる');
  else await fs.writeFile(path.join(root,filename),output);
  console.log('近代・現代 第13回: 5教材と原書23ページの生成結果を確認');
}
