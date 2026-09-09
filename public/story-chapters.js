const range = (first, last) => Array.from({length:last-first+1}, (_, i) => first+i-1);

// 原文との照合番号を保持したまま、公開時の読む順番を章ごとに定義する。
export const chapterGroups = {
  "regional-dynasties": [
    {title:"イスラーム世界の分裂と三カリフ", pages:[...range(1,17),48], description:"三カリフの並立と各地の自立を見渡し、イラン人政権とイクター制を学びます。冒頭の王朝紹介は全体の見取り図です。"},
    {title:"トルコ人の台頭とセルジューク朝", pages:range(18,27), description:"中央アジアの王朝交代から、セルジューク朝の拡大・統治・分裂へ進みます。"},
    {title:"西方・エジプト・北インドの諸王朝", pages:range(28,40), description:"北アフリカとイベリア半島、エジプト、北インドの順に、各地の王朝をたどります。"},
    {title:"アフリカの諸王国と交易", pages:range(41,48), description:"古代のナイル流域から、西・東・南部アフリカの王国と交易へ進みます。"}
  ],
  ottoman: [
    {title:"建国とバルカン進出", pages:range(1,12), description:"アナトリアの小国家からバルカンへ。軍制の整備、アンカラの敗北と復活をたどります。"},
    {title:"都の征服とイスラーム世界への拡大", pages:range(13,25), description:"コンスタンティノープル征服と多宗教の統治から、セリム1世の東方・エジプト征服へ進みます。"},
    {title:"最盛期とその後", pages:range(26,42), description:"スレイマン1世の最盛期から、軍制・国際関係の変化とチューリップ時代をたどります。"}
  ]
};

export function selectChapter(name, source, search = "") {
  const chapters = chapterGroups[name];
  const value = new URLSearchParams(search).get("chapter");
  const number = /^[1-9]\d*$/.test(value ?? "") ? Number(value) : 1;
  const index = number <= chapters.length ? number-1 : 0;
  const chapter = chapters[index];
  return {name, chapters, index, chapter, scenes:chapter.pages.map(i => source[i])};
}

export function mountChapter(selection) {
  const {name, chapters, index, chapter} = selection;
  const href = i => `/${name}-story.html?chapter=${i+1}`;
  document.title = `${chapter.title}｜${name === "ottoman" ? "07 オスマン帝国" : "03 地方政権"}｜W-History`;
  document.querySelector('meta[name="description"]').content = `${chapter.description} 全${chapter.pages.length}ページ。`;
  const header = document.createElement("section");
  header.className = "reading-chapter";
  const title = document.createElement("h1");
  title.textContent = `第${index+1}章　${chapter.title}`;
  const description = document.createElement("p");
  description.textContent = `${chapter.description}（全${chapter.pages.length}ページ）`;
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "読む章を選ぶ");
  chapters.forEach((entry, i) => {
    const a = document.createElement("a");
    a.href = href(i);
    a.textContent = `${i+1}. ${entry.title}（${entry.pages.length}ページ）`;
    if (i === index) a.setAttribute("aria-current", "page");
    nav.append(a);
  });
  header.append(title, description, nav);
  document.querySelector(".story-series-links").after(header);
  // 旧通巻用の章ボタンは、章内番号とは対応しないため除く。
  document.querySelector(".chapter-nav")?.remove();
  const end = document.createElement("nav");
  end.className = "chapter-end";
  end.setAttribute("aria-label", "章を読み終えたら");
  for (const [label, url] of [
    ...(index > 0 ? [["← 前の章", href(index-1)]] : []),
    ["教材一覧へ", "/"],
    ...(index+1 < chapters.length ? [["次の章へ →", href(index+1)]] : [])
  ]) {
    const a = document.createElement("a"); a.textContent = label; a.href = url; end.append(a);
  }
  document.querySelector("#scene-nav").after(end);
  return {
    nextLabel:index+1 < chapters.length ? "次の章へ →" : "教材一覧へ →",
    finish:() => location.assign(index+1 < chapters.length ? href(index+1) : "/")
  };
}
