// 見出しに登場する語を主題として優先し、その他の名前と区別する。
export function chooseKeyTerms(terms, heading) {
  const normalize = value => value.replace(/【[^】]*】|\[[^\]]*\]/g, "").replace(/[\s＝=・]/g, "").trim();
  const title = normalize(heading);
  const candidates = [...new Set(terms.map(normalize))].filter(term => term.length > 1 && !/^[\d０-９〜～—－\-年月世紀頃前後第代位]+$/.test(term));
  const matches = candidates.filter(term => title.includes(term)).sort((a,b) => title.indexOf(a)-title.indexOf(b) || b.length-a.length);
  const distinct = matches.filter(term => !matches.some(other => other !== term && other.includes(term)));
  return new Set((distinct.length ? distinct : candidates.slice(0,2)).slice(0,4));
}

function mount() {
  const body = document.getElementById("scene-body");
  const title = document.getElementById("scene-title");
  if (!body || !title) return;
  const normalize = value => value.replace(/【[^】]*】|\[[^\]]*\]/g, "").replace(/[\s＝=・]/g, "").trim();
  function update() {
    const words = [...body.querySelectorAll("strong")];
    const selected = chooseKeyTerms(words.map(word => word.textContent), title.textContent);
    words.forEach(word => word.classList.toggle("key-term", selected.has(normalize(word.textContent))));
  }
  update();
  // 色を付ける属性変更は監視しない。ページ本文の更新時だけ再判定する。
  const observer = new MutationObserver(update);
  observer.observe(body, {childList:true, subtree:true, characterData:true});
  observer.observe(title, {childList:true, subtree:true, characterData:true});
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true});
  else mount();
}
