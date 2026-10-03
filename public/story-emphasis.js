import { namesForScene } from "./map-name-coverage.js?v=0.115";
import { chapterKeyTerms } from "./story-emphasis-terms.js?v=0.109";

const normalize = value => value.replace(/【[^】]*】|\[[^\]]*\]/g, "").replace(/[\s＝=・『』「」]/g, "").trim();
const decode = value => value.replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/g, "").replace(/<[^>]*>/g, "")
  .replaceAll("&quot;", '"').replaceAll("&gt;", ">").replaceAll("&lt;", "<").replaceAll("&amp;", "&");
const meaningful = value => value.length > 0 && !/^[\d０-９〜～—－\-年月世紀頃前後第代位]+$/.test(value);
const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 色は本文の主題を示す。原資料の色や試験上の重要度を推定した印ではない。
export function chooseKeyTerms(terms, heading) {
  const candidates = [...new Set(terms.map(normalize))].filter(meaningful);
  const title = normalize(heading);
  const matches = candidates.filter(term => occurrences(title, term).length)
    .sort((a, b) => title.indexOf(a) - title.indexOf(b) || b.length - a.length);
  return new Set(matches.filter(term => !matches.some(other => other !== term && other.includes(term))).slice(0, 4));
}

function occurrences(text, term) {
  // 等号・中黒の表記ゆれを許容し、短い国名を別の漢字語の中から拾わない。
  const pattern = [...term].map(c => /[＝=・]/.test(c) ? "[＝=・]?" : escapePattern(c)).join("");
  const result = [];
  for (const match of text.matchAll(new RegExp(pattern, "g"))) {
    const start = match.index, end = start + match[0].length;
    if (term.length === 1 && (/[一-龯々]/.test(text[start - 1] ?? "") || /[一-龯々]/.test(text[end] ?? ""))) continue;
    if (/^[ァ-ヶー]/.test(term) && /[ァ-ヶー]/.test(text[start - 1] ?? "")) continue;
    if (/[ァ-ヶー]$/.test(term) && /[ァ-ヶー]/.test(text[end] ?? "")) continue;
    if (term === "新" && /^(?:しい|しく|たな|たに)/.test(text.slice(end))) continue;
    if (term === "周" && text[end] === "り") continue;
    if (term === "明" && /^(?:る|ら)/.test(text.slice(end))) continue;
    result.push({ start, end, text: match[0] });
  }
  return result;
}

export function storyEmphasisPlan(scene) {
  if (scene.sourceText?.book === 'modern') return [];
  const chapter = scene.sourceText?.chapter;
  // 第6章は画像照合済みの出現箇所ごとの指定をそのまま使う。
  if (!chapterKeyTerms[chapter]) return [];
  const paragraphs = scene.plainBody ?? scene.body.map(decode);
  const candidates = new Map();
  const add = (term, core = false) => {
    const key = normalize(term);
    if (!key) return;
    const prior = candidates.get(key);
    if (prior) { prior.core ||= core; prior.variants.add(term); }
    else candidates.set(key, { key, core, variants: new Set([term]) });
  };
  for (const term of chapterKeyTerms[chapter]) add(term, true);
  for (const html of scene.body) for (const match of html.matchAll(/<span class="source-bold">([\s\S]*?)<\/span>/g)) add(decode(match[1]));
  const heading = normalize(scene.title);
  for (const name of namesForScene(scene, paragraphs.join("。"))) {
    if (["person", "building"].includes(name.kind) || /(?:朝|王国|帝国|川|河|江|峠)$/.test(name.name) || heading.includes(name.key)) add(name.name);
  }
  const found = [];
  paragraphs.forEach((text, paragraph) => {
    for (const candidate of candidates.values()) for (const term of candidate.variants) {
      for (const occurrence of occurrences(text, term)) found.push({ ...occurrence, paragraph, key: candidate.key, core: candidate.core });
    }
  });
  // 長い正式名称を優先し、その語中の短い名称を重ねて強調しない。
  found.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.paragraph - b.paragraph || a.start - b.start);
  const accepted = [];
  for (const item of found) if (!accepted.some(other => other.paragraph === item.paragraph && other.start < item.end && item.start < other.end)) accepted.push(item);
  accepted.sort((a, b) => a.paragraph - b.paragraph || a.start - b.start);
  const selected = chooseKeyTerms(accepted.map(item => item.key), scene.title);
  // 制度・思想・出来事・文化の重要語は、見出しに名前がないページでも拾う。
  for (const item of accepted) if (item.core && meaningful(item.key) && selected.size < 4) selected.add(item.key);
  if (!selected.size) for (const item of accepted) if (meaningful(item.key) && selected.size < 2) selected.add(item.key);
  // 第6章と同様、同じ語を全出現箇所で一律に色付けしない。
  const seen = new Set();
  const first = accepted.filter(item => { if (seen.has(item.key)) return false; seen.add(item.key); return true; });
  return first.map(({ paragraph, start, end, text, key }) => ({ paragraph, start, end, text, key, primary: selected.has(key) }));
}

export function decorateStoryBody(body, scene) {
  if (scene.sourceText?.book === 'modern') return [];
  if (!chapterKeyTerms[scene.sourceText?.chapter]) return [];
  // 再表示しても追加装飾を重ねない。原資料の印と読み仮名は保持する。
  body.querySelectorAll(".story-key-term, .story-bold").forEach(node => node.replaceWith(...node.childNodes));
  body.normalize();
  const plan = storyEmphasisPlan(scene);
  [...body.querySelectorAll(":scope > p")].forEach((paragraph, index) => {
    const walker = body.ownerDocument.createTreeWalker(paragraph, 4);
    const nodes = [];
    let cursor = 0, node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest("rt")) continue;
      nodes.push({ node, start: cursor, end: cursor + node.textContent.length });
      cursor += node.textContent.length;
    }
    for (const entry of nodes.reverse()) {
      const ranges = plan.filter(range => range.paragraph === index && range.start < entry.end && range.end > entry.start)
        .sort((a, b) => b.start - a.start);
      for (const range of ranges) {
        const start = Math.max(range.start, entry.start) - entry.start;
        const end = Math.min(range.end, entry.end) - entry.start;
        const marked = entry.node.splitText(start);
        marked.splitText(end - start);
        const span = body.ownerDocument.createElement("span");
        span.className = range.primary ? "story-key-term" : "story-bold";
        span.dataset.term = range.key;
        marked.replaceWith(span);
        span.append(marked);
      }
    }
  });
  return plan;
}
