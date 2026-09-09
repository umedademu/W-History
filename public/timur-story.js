import { sourceEdition } from "./source-edition.js?v=0.051";
import { mapNamePlan, renderMapNameConcepts } from "./map-name-coverage.js?v=0.051";
import { characterCamera, characterScenes, renderMapCharacters } from "./timur-characters.js?v=0.051";

const scenes=sourceEdition.timur;

const svgNamespace = "http://www.w3.org/2000/svg";
const project = ([longitude, latitude]) => [(longitude - 20) * 12, (58 - latitude) * 15];
const pointsPath = (points, close = false) => points.map((point, i) => `${i ? "L" : "M"}${project(point).join(",")}`).join(" ") + (close ? " Z" : "");
const places = {
  samarkand: { point: [66.97, 39.65], label: "サマルカンド", offset: [0, 30], anchor: "middle" },
  northShore: { point: [47.2, 47.2], label: "カスピ海北岸", offset: [-13, -16], anchor: "end" },
  iranCenter: { point: [51.68, 32.65], label: "イラン", offset: [10, 27] },
  georgia: { point: [44.8, 41.7], label: "グルジア", offset: [15, -18] },
  armenia: { point: [44.5, 40.2], label: "アルメニア", offset: [12, 30] },
  delhi: { point: [77.21, 28.61], label: "デリー", offset: [13, 7] },
  damascus: { point: [36.29, 33.51], label: "ダマスクス", offset: [-12, 24], anchor: "end" },
  baghdad: { point: [44.37, 33.31], label: "バグダード", offset: [12, 26] },
  ankara: { point: [32.86, 39.93], label: "アンカラ", offset: [-12, -17], anchor: "end" },
  otrar: { point: [68.3, 42.85], label: "オトラル", offset: [14, -16] },
  constantinople: { point: [28.98, 41.01], label: "コンスタンティノープル", offset: [-8, 23], anchor: "end" },
  cairo: { point: [31.24, 30.04], label: "カイロ", offset: [-10, 25], anchor: "end" },
  herat: { point: [62.2, 34.35], label: "ヘラート", offset: [10, 24] },
};
const regions = {
  chagatai: { points: [[58,43],[64,47],[77,48],[87,46],[91,40],[80,35],[68,34],[59,37]] },
  west: { points: [[59,42],[65,45],[71,44],[74,41],[70,36],[64,35],[60,38]] },
  east: { points: [[73,44],[78,48],[87,46],[91,41],[84,36],[74,36],[76,41]], kind: "planned" },
  kipchak: { points: [[37,48],[44,52],[58,54],[72,51],[68,47],[58,46],[48,47],[42,45]], kind: "influence" },
  iran: { points: [[45,38],[54,39],[61,36],[63,29],[58,26],[51,29],[47,33]] },
  caucasus: { points: [[40,43],[45,43],[49,41],[47,38],[42,39]] },
  india: { points: [[71,32],[75,32],[80,30],[80,27],[75,27],[71,29]], kind: "influence" },
  syria: { points: [[35,37],[41,37],[46,35],[47,32],[42,31],[35,32]], kind: "influence" },
  anatolia: { points: [[28,40],[34,42],[41,41],[42,38],[35,36],[29,37]], kind: "opponent" },
  balkans: { points: [[20,44],[26,45],[29,42],[26,40],[23,38],[20,40]], kind: "planned" },
  ming: { points: [[104,39],[112,42],[119,41],[123,36],[122,29],[118,24],[109,21],[104,26],[103,32]], kind: "planned" },
  timuridOverview: { points: [[44,43],[54,48],[70,48],[80,42],[79,29],[69,25],[57,27],[48,32]], kind: "influence" },
};
const labels = {
  central: { point: [77, 47.5], text: "中央アジア" },
  chagatai: { point: [77, 34.5], text: "チャガタイ＝ハン国（チャガタイ＝ウルス）" },
  west: { point: [63, 45.8], text: "西チャガタイ＝ハン国" },
  east: { point: [82.5, 43], text: "東側" },
  kipchak: { point: [57, 51.4], text: "キプチャク＝ハン国（ジョチ＝ウルス）" },
  iran: { point: [55, 35.7], text: "イラン" },
  northwestIndia: { point: [81, 24], text: "西北インド" },
  syria: { point: [37, 36.5], text: "シリア" },
  iraq: { point: [44, 36], text: "イラク" },
  anatolia: { point: [35, 36.2], text: "アナトリア" },
  balkans: { point: [25, 46], text: "バルカン半島" },
  ming: { point: [114, 32], text: "明（中国）" },
  yuan: { point: [111, 49], text: "北へ追われたモンゴル宗家の元" },
  timurid: { point: [58, 39], text: "ティムール朝" },
  byzantine: { point: [25, 45.5], text: "ビザンツ帝国" },
  ottoman: { point: [35, 43.7], text: "オスマン朝" },
  mamluk: { point: [31, 26.5], text: "マムルーク朝" },
  tughluq: { point: [78, 25.5], text: "トゥグルク朝" },
};
const seaLabels = {
  black: { point: [34, 43.8], text: "黒海" },
  caspian: { point: [51, 41.3], text: "カスピ海" },
};
const routes = {
  north: { points: [[66.97,39.65],[69,44.5],[61,49],[53,49.5],[47.2,47.2]] },
  iran: { points: [[66.97,39.65],[61,36.5],[56,35],[51.68,32.65]] },
  caucasus: { points: [[51.68,32.65],[49,37],[46,39],[44.8,41.7]] },
  india: { points: [[66.97,39.65],[69,34.5],[72,31],[77.21,28.61]] },
  syria: { points: [[66.97,39.65],[57,36],[48,36.5],[39,37],[36.29,33.51]] },
  baghdad: { points: [[36.29,33.51],[40,32],[44.37,33.31]], delay: .6 },
  ankara: { points: [[44.37,33.31],[42,37],[37,39],[32.86,39.93]] },
  summaryAnkara: { points: [[66.97,39.65],[57,36],[46,36],[38,38],[32.86,39.93]] },
  china: { points: [[66.97,39.65],[77,43],[91,43],[101,40],[111,36]], planned: true },
  otrar: { points: [[66.97,39.65],[67.4,41],[68.3,42.85]] },
  chinaFromOtrar: { points: [[68.3,42.85],[79,45],[91,43],[101,40],[111,36]], planned: true },
};

const elements = Object.fromEntries([
  "story-map", "map-heading", "map-title", "map-description", "map-regions", "map-labels", "map-routes", "map-places", "map-annotations",
  "narrative", "scene-number", "scene-year", "scene-kicker", "scene-title", "scene-body", "scene-takeaway", "scene-note",
  "previous", "next", "replay", "story-progress", "progress-label", "scene-nav", "map-characters",
].map((id) => [id, document.getElementById(id)]));
const mobile = window.matchMedia("(max-width: 740px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let sceneIndex = 0;
let stopCharacters = () => {};

function svgElement(tag, attributes = {}, text) {
  const element = document.createElementNS(svgNamespace, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  if (text !== undefined) element.textContent = text;
  return element;
}

function mapText(point, text, className = "region-label", extra = {}) {
  const [x, y] = project(point);
  return svgElement("text", { x, y, class: className, "text-anchor": "middle", ...extra }, text);
}

function drawPlace(key, scene) {
  const place = places[key];
  const [x, y] = project(place.point);
  const { x: left, y: top, width, height } = elements["story-map"].viewBox.baseVal;
  if (x < left || x > left + width || y < top || y > top + height) return;
  const capital = key === "samarkand";
  const active = !capital || scene.capitalActive;
  const group = svgElement("g");
  if (active && !reducedMotion.matches) group.append(svgElement("circle", { cx: x, cy: y, r: 12, class: "place-ring" }));
  group.append(capital
    ? svgElement("path", { d: `M${x},${y - 8} l8,8 -8,8 -8,-8 Z`, class: "capital-dot" })
    : svgElement("circle", { cx: x, cy: y, r: 6, class: `place-dot${active ? " active" : ""}` }));
  const summaryAnkara = scene.summary && mobile.matches && key === "ankara";
  const scale = elements["story-map"].clientWidth / width;
  const definition = (scene.characterDefinition ?? characterScenes[scene.characters]);
  const hasPerson = definition.cast.some((item) => !item.travel && item.point[0] === place.point[0] && item.point[1] === place.point[1]) || definition.destination === key;
  const offset = hasPerson ? [0, (mobile.matches ? 45 : 48) / scale] : summaryAnkara ? [15, 30] : [...place.offset];
  if (scene.characters === "syria" && key === "damascus") offset[0] = -10 / scale;
  if (scene.characters === "syria" && key === "baghdad") offset[0] = 10 / scale;
  if (capital && scene.regions.includes("ming")) { offset[0] = 0; offset[1] = (mobile.matches ? 66 : 48) / scale; }
  group.append(svgElement("text", {
    x: x + offset[0], y: y + offset[1], "data-anchor-x": x, "data-anchor-y": y,
    class: capital ? "capital-label" : `place-label${active ? " active" : ""}`,
    "text-anchor": scene.characters === "syria" && key === "damascus" ? "end" : scene.characters === "syria" && key === "baghdad" ? "start" : hasPerson ? "middle" : summaryAnkara ? "start" : place.anchor ?? "start",
    style: `font-size:${(mobile.matches ? 10.5 : 12) / scale}px`,
  }, place.label));
  elements["map-places"].append(group);
}

function drawRoute(key, scene) {
  const route = routes[key];
  const d = pointsPath(route.points);
  const path = svgElement("path", { d, pathLength: 1, class: `route${route.planned ? " planned" : ""}` });
  // 破線の長さは画面上の長さで指定するため、正規化しない。
  if (route.planned) path.removeAttribute("pathLength");
  if (route.delay) path.style.animationDelay = `${route.delay}s`;
  elements["map-routes"].append(path);
}

function renderMap(scene) {
  if(elements["story-map"].dataset.scene!==scene.id) elements["story-map"].style.minHeight="";
  elements["story-map"].dataset.scene=scene.id;
  const mapItems=[
    ...[...(scene.showCapital === false ? [] : ["samarkand"]),...scene.places].map(k=>({text:places[k].label,at:places[k].point})),
    ...scene.labels.map(k=>({text:labels[k].text,at:labels[k].point})),...scene.seas.map(k=>({text:seaLabels[k].text,at:seaLabels[k].point})),
    ...(scene.characterDefinition ?? characterScenes[scene.characters]).cast.map(a=>({text:a.name,at:a.point}))
  ];
  const names=mapNamePlan(scene,mapItems);
  scene={...scene,nameTags:names.tags};
  renderMapNameConcepts(elements["story-map"],names.concepts);
  stopCharacters();
  ["map-regions", "map-labels", "map-routes", "map-places", "map-annotations"].forEach((id) => elements[id].replaceChildren());
  const map = elements["story-map"];
  map.setAttribute("viewBox", characterCamera(scene, routes, project, map.clientWidth, map.clientHeight, mobile.matches).join(" "));
  elements["story-map"].classList.toggle("eastward", scene.regions.includes("ming"));
  elements["story-map"].classList.toggle("overview", Boolean(scene.summary));
  elements["map-heading"].textContent = scene.mapHeading;
  elements["map-title"].textContent = scene.mapHeading;
  elements["map-description"].textContent = scene.mapDescription;
  for (const key of scene.regions) {
    const region = regions[key];
    elements["map-regions"].append(svgElement("path", { d: pointsPath(region.points, true), class: `region ${region.kind ?? ""}` }));
  }
  for (const key of scene.seas) {
    const sea = seaLabels[key];
    elements["map-labels"].append(mapText(sea.point, sea.text, "sea-label"));
  }
  for (const key of scene.labels) {
    const label = labels[key];
    const point = mobile.matches && key === "central" ? [77, 55] : label.point;
    elements["map-labels"].append(mapText(point, label.text, "region-label active"));
  }
  for (const key of scene.routes ?? []) drawRoute(key, scene);
  if (scene.showCapital !== false) drawPlace("samarkand", scene);
  for (const key of scene.places) drawPlace(key, scene);
  if (scene.split) {
    elements["map-annotations"].append(svgElement("path", { d: pointsPath([[74,46],[72.6,43],[74,40],[72.5,36]]), fill: "none", stroke: "#fdfaf4", "stroke-width": 5, "stroke-dasharray": "6 5" }));
    elements["map-annotations"].append(mapText([65,33], "西側からティムール", "map-callout"));
  }
  if (scene.afterAnkara) elements["map-annotations"].append(mapText([41,30], "旧支配者へ領地を戻す", "map-callout"));
  if (scene.stop) {
    const [x,y] = project(places.otrar.point);
    elements["map-annotations"].append(svgElement("path", { d: `M${x - 7},${y - 8} l14,16 m0,-16 l-14,16`, fill: "none", stroke: "#a6422c", "stroke-width": 4 }));
  }
  for (const tag of scene.nameTags) elements["map-labels"].append(mapText(tag.at,tag.text,"map-name-label"));
  stopCharacters = renderMapCharacters(elements["map-characters"], scene, { map, routes, project, reducedMotion: reducedMotion.matches });
}

function renderScene({ moveToStage = false } = {}) {
  const scene = scenes[sceneIndex];
  elements["scene-number"].textContent = `${String(sceneIndex + 1).padStart(2, "0")} / ${scenes.length}`;
  elements["scene-year"].textContent = scene.year;
  elements["scene-kicker"].textContent = scene.kicker;
  elements["scene-title"].replaceChildren(...scene.title.split("\n").flatMap((line, i) => i ? [document.createElement("br"), document.createTextNode(line)] : [document.createTextNode(line)]));
  // 本文はこのファイルで管理する固定の説明文だけを使う。
  elements["scene-body"].innerHTML = scene.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
  elements["scene-takeaway"].textContent = scene.takeaway;
  elements["scene-note"].textContent = scene.note;
  elements.previous.disabled = sceneIndex === 0;
  elements.next.replaceChildren(document.createTextNode(sceneIndex === scenes.length - 1 ? "最初から" : "次へ"), Object.assign(document.createElement("span"), { textContent: sceneIndex === scenes.length - 1 ? "↻" : "→" }));
  elements["story-progress"].value = sceneIndex + 1;
  elements["story-progress"].textContent = `${sceneIndex + 1} / ${scenes.length}`;
  elements["progress-label"].textContent = `${sceneIndex + 1} / ${scenes.length}`;
  for (const button of elements["scene-nav"].children) {
    if (Number(button.dataset.scene) === sceneIndex) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  }
  const chapter = sceneIndex < 3 ? 0 : sceneIndex < 10 ? 3 : 10;
  document.querySelectorAll("[data-chapter]").forEach((button) => {
    if (Number(button.dataset.chapter) === chapter) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  renderMap(scene);
  elements.narrative.classList.remove("scene-enter");
  void elements.narrative.offsetWidth;
  elements.narrative.classList.add("scene-enter");
  if (moveToStage) document.querySelector(".story-stage").scrollIntoView({ block: "start", behavior: "instant" });
}

function goTo(index, moveToStage = true) {
  const nextIndex = Math.max(0, Math.min(scenes.length - 1, index));
  if (nextIndex === sceneIndex) return;
  sceneIndex = nextIndex;
  renderScene({ moveToStage });
}

scenes.forEach((scene, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.scene = index;
  button.textContent = String(index + 1).padStart(2, "0");
  button.title = `${index + 1}. ${scene.title.replace("\n", "")}`;
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", () => goTo(index));
  elements["scene-nav"].append(button);
});
elements.previous.addEventListener("click", () => goTo(sceneIndex - 1));
elements.next.addEventListener("click", () => goTo(sceneIndex === scenes.length - 1 ? 0 : sceneIndex + 1));
elements.replay.addEventListener("click", () => {
  renderMap(scenes[sceneIndex]);
});
document.querySelectorAll("[data-chapter]").forEach((button) => button.addEventListener("click", () => goTo(Number(button.dataset.chapter))));
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
  if (event.target.closest("input, textarea, select, [contenteditable=true], details")) return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    goTo(sceneIndex + (event.key === "ArrowRight" ? 1 : -1), false);
  }
});
let mapSize = "";
elements["story-map"].addEventListener("map-layout-resize",()=>renderMap(scenes[sceneIndex]));
new ResizeObserver(() => {
  const map = elements["story-map"];
  const size = `${map.clientWidth},${map.clientHeight}`;
  if (size === mapSize) return;
  mapSize = size;
  renderMap(scenes[sceneIndex]);
}).observe(elements["story-map"]);
reducedMotion.addEventListener("change", () => renderMap(scenes[sceneIndex]));
// 独立した無音のページ。学習用の音声・設定・履歴は読み込まない。
renderScene();
