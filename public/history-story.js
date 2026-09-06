import { createMapLayout } from "./map-layout.js?v=0.009";

export function mountStory({ places, zones, scenes, imageDirectory }) {
const NS = "http://www.w3.org/2000/svg";
const project = ([lon, lat]) => [(lon + 18) * 14, (55 - lat) * 14];
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const byId = id => document.getElementById(id);
const map = byId("story-map"), reduced = matchMedia("(prefers-reduced-motion: reduce)");
const colors = { campaign: "#b5573f", rival: "#5c7886", move: "#54866b", trade: "#b0882f" };
let index = 0, stop = () => {}, lastSize = "";

function svg(tag, attrs = {}, text) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text) node.textContent = text;
  return node;
}

function geometry(scene, width, height) {
  const [west, south, east, north] = scene.frame;
  const points = [[west, north], [east, south], ...scene.pins.map(k => places[k].point), ...scene.routes.flatMap(r => r.points), ...scene.tags.map(t => t.at), ...[...scene.actors, ...scene.props].map(a => typeof a.at === "string" ? places[a.at].point : a.at)].map(project);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((width - 82) / (maxX - minX), (height - 185) / (maxY - minY));
  const x = width / 2 - (minX + maxX) / 2 * scale, y = (height + 75) / 2 - (minY + maxY) / 2 * scale;
  return { scale, x, y, toScreen: p => { const q = project(p); return [q[0] * scale + x, q[1] * scale + y]; } };
}

const resolveImg = key => key.includes("/") ? `/images/${key}.png` : `/images/${imageDirectory}/${key}.png`;

function drawMap(scene) {
  stop();
  const width = map.clientWidth, height = map.clientHeight;
  if (!width || !height) return;
  const { scale, x, y, toScreen } = geometry(scene, width, height);
  map.setAttribute("viewBox", `0 0 ${width} ${height}`);
  map.dataset.scene = scene.id;
  map.replaceChildren(
    svg("title", { id: "map-title" }, scene.mapHeading),
    svg("desc", { id: "map-description" }, `${scene.before}。${scene.after}。${scene.pins.map(k => places[k].name).join("、")}を地図で示します。`)
  );

  const base = svg("image", { href: "/islamic-world-map.svg?v=0.006", x, y, width: 1960 * scale, height: 1134 * scale });
  map.append(base);

  const regions = svg("g", { class: "history-regions" });
  map.append(regions);
  const polygon = points => points.map(p => toScreen(p).join(",")).join(" ");
  for (const key of scene.zones) {
    const z = zones[key];
    if (z) regions.append(svg("polygon", { points: polygon(z.points), fill: z.color, stroke: z.color, "stroke-width": 1.1 }));
  }

  for (const [p, text] of [[[24, 34.5], "地中海"], [[35, 43.5], "黒海"], [[37.5, 23.5], "紅海"], [[50, 27], "ペルシア湾"]]) {
    const [sx, sy] = toScreen(p);
    if (sx > 40 && sx < width - 40 && sy > 32 && sy < height - 40) {
      map.append(svg("text", { x: sx, y: sy, class: "history-water", "text-anchor": "middle" }, text));
    }
  }

  const arrows = svg("g", { class: "history-arrows" });
  map.append(arrows);
  const routeNodes = scene.routes.map((route, i) => {
    const p = route.points.map(toScreen), d = p.map((v, j) => `${j ? "L" : "M"}${v.join(",")}`).join(" ");
    const ghost = svg("path", { d, fill: "none", stroke: colors[route.kind], "stroke-width": 1.5, opacity: .15 });
    const path = svg("path", { d, fill: "none", stroke: colors[route.kind], "stroke-width": route.kind === "trade" ? 2 : 2.7, "stroke-linecap": "round" });
    const head = svg("path", { d: "M-7,-4 L0,0 -7,4", fill: "none", stroke: colors[route.kind], "stroke-width": 2 });
    const dot = svg("circle", { r: 3.5, fill: colors[route.kind], stroke: "#fff9ea", "stroke-width": 1.2, "data-route": i, class: "history-moving-point" });
    if (route.kind === "trade") ghost.setAttribute("stroke-dasharray", "3 4");
    arrows.append(ghost, path, head, dot);
    const length = path.getTotalLength();
    path.setAttribute("stroke-dasharray", `${length} ${length}`);
    let reveal = path;
    if (route.kind === "trade") {
      const mask = svg("mask", { id: `trade-reveal-${i}`, maskUnits: "userSpaceOnUse", x: 0, y: 0, width, height });
      reveal = svg("path", { d, fill: "none", stroke: "white", "stroke-width": 8, "stroke-dasharray": `${length} ${length}` });
      mask.append(reveal); map.prepend(mask);
      path.setAttribute("mask", `url(#trade-reveal-${i})`);
      path.setAttribute("stroke-dasharray", "3 4");
    }
    return { route, path, reveal, head, dot, length };
  });

  const pins = svg("g", { class: "history-pins" }), labels = svg("g", { class: "history-labels" });
  map.append(pins, labels);
  function label(text, point, className) {
    const [px, py] = toScreen(point);
    const node = svg("text", { x: px, y: py + 20, class: className, "text-anchor": "middle", "data-anchor-x": px, "data-anchor-y": py }, text);
    labels.append(node);
  }

  for (const key of scene.pins) {
    const [px, py] = toScreen(places[key].point), capital = scene.capital === key;
    pins.append(capital ? svg("path", { d: `M${px},${py - 5} l5,5 -5,5 -5,-5 Z`, fill: "#b54930", stroke: "#fff9ec", "stroke-width": 1.5 }) : svg("circle", { cx: px, cy: py, r: 3.5, fill: "#3b6d8e", stroke: "#fff9ec", "stroke-width": 1.5 }));
    label(places[key].name, places[key].point, capital ? "history-capital" : "history-city");
  }
  for (const tag of scene.tags) label(tag.text, tag.at, "history-country");

  let ring;
  const target = scene.battle ?? scene.capital;
  if (target && places[target]) {
    const [px, py] = toScreen(places[target].point);
    ring = svg("circle", { cx: px, cy: py, r: 8, fill: "none", stroke: scene.battle ? colors.campaign : colors.move, "stroke-width": 1.6 });
    pins.prepend(ring);
  }

  const imageCache = new Set();
  function preload(key) {
    if (!key || imageCache.has(key)) return;
    imageCache.add(key);
    const img = new Image();
    img.src = resolveImg(key);
  }

  const root = byId("map-characters");
  if (root) { root.replaceChildren(); root.dataset.scene = scene.id; root.dataset.phase = "loading"; }
  const small = matchMedia("(max-width: 740px)").matches;
  const items = (root ? [...(scene.props ?? []), ...(scene.actors ?? [])] : []).map(item => {
    const node = document.createElement("div");
    node.className = `history-map-item${item.kind === "prop" ? " is-prop" : ""}${item.compact ? " is-compact" : ""}`;
    node.dataset.name = item.name;
    const size = item.kind === "prop" ? (item.size ?? 76) : item.compact ? (small ? 44 : 54) : (small ? 54 : 70);
    node.style.setProperty("--item-width", `${size}px`);
    node.style.setProperty("--item-height", `${item.kind === "prop" ? size : size * 1.5}px`);
    node.innerHTML = `<span class="history-connector"></span><div class="history-figure"><span class="history-bubble"></span><img src="${resolveImg(item.image)}" width="${item.kind === "prop" ? 192 : 128}" height="192" alt="${item.name}" draggable="false"><span class="history-name">${item.name}</span></div>`;
    root.append(node);
    node.querySelector(".history-bubble").textContent = item.bubble || "";
    preload(item.image);
    if (item.afterImage) preload(item.afterImage);
    return { item, node, figure: node.querySelector(".history-figure"), image: node.querySelector("img"), bubble: node.querySelector(".history-bubble"), connector: node.firstElementChild };
  });

  const placeContents = createMapLayout({ map, root, items });
  let frame = 0, cancelled = false;
  const update = p => {
    if (root) root.dataset.phase = p >= 1 ? "complete" : "moving";
    map.dataset.progress = p.toFixed(3); map.dataset.phase = p >= 1 ? "complete" : "moving";
    byId("map-status").textContent = p >= 1 ? scene.after : scene.before;
    regions.style.opacity = String(.2 + .12 * p);
    for (const { route, path, reveal, head, dot, length } of routeNodes) {
      const q = clamp((p - (route.start ?? 0)) / ((route.end ?? 1) - (route.start ?? 0))), at = path.getPointAtLength(q * length), prev = path.getPointAtLength(Math.max(0, q * length - 1));
      reveal.setAttribute("stroke-dashoffset", length * (1 - q));
      const opacity = scene.fadeRoutes ? 1 - .8 * p : 1;
      path.setAttribute("opacity", opacity); dot.setAttribute("opacity", q > 0 && q < 1 ? opacity : 0); head.setAttribute("opacity", q > 0 ? opacity : 0);
      dot.setAttribute("cx", at.x); dot.setAttribute("cy", at.y); dot.dataset.progress = q.toFixed(3);
      head.setAttribute("transform", `translate(${at.x},${at.y}) rotate(${Math.atan2(at.y - prev.y, at.x - prev.x) * 180 / Math.PI})`);
    }
    for (const { item, node, figure, image, bubble, connector } of items) {
      let pos;
      const r = item.route === undefined ? null : routeNodes[item.route].route;
      const moving = r && p >= (r.start ?? 0) && p < (r.end ?? 1);
      if (item.route !== undefined && routeNodes[item.route]) {
        const { route, path, length } = routeNodes[item.route];
        const q = clamp((p - (route.start ?? 0)) / ((route.end ?? 1) - (route.start ?? 0)));
        const at = path.getPointAtLength(q * length);
        pos = [at.x, at.y];
      } else {
        const rawPoint = typeof item.at === "string" ? places[item.at]?.point ?? [0, 0] : item.at;
        pos = toScreen(rawPoint);
      }
      const arrival = item.route === undefined ? 1 : clamp((p - .78) / .22);
      const offset = (item.offset ?? [0, 0]).map(v => v * arrival);
      node.hidden = p < (item.from ?? 0);
      node.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
      figure.style.transform = `translate(calc(-50% + ${offset[0]}px),${offset[1]}px)`;
      connector.style.width = `${Math.hypot(...offset)}px`;
      connector.style.transform = `rotate(${Math.atan2(offset[1], offset[0])}rad)`;
      const changed = p >= 1;
      const key = changed && item.afterImage ? item.afterImage : item.image;
      const currentSrc = resolveImg(key);
      if (node.dataset.image !== key) { image.src = currentSrc; node.dataset.image = key; }
      node.classList.toggle("is-walking", Boolean(moving && !reduced.matches));
      bubble.textContent = changed && item.bubble ? item.bubble : "";
    }
    placeContents();
    if (ring) { ring.setAttribute("r", 8 + 7 * Math.sin(p * Math.PI)); ring.setAttribute("opacity", .45 + .45 * p); }
  };

  if (reduced.matches || !scene.duration) update(1);
  else {
    update(0);
    const start = performance.now() + 300;
    const tick = now => {
      if (cancelled) return;
      const p = clamp((now - start) / scene.duration);
      update(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }
  stop = () => { cancelled = true; cancelAnimationFrame(frame); };
}

function show(scroll = false) {
  const scene = scenes[index];
  for (const [id, value] of Object.entries({
    "scene-number": `${String(index + 1).padStart(2, "0")} / ${scenes.length}`,
    "scene-year": scene.year,
    "scene-kicker": scene.kicker,
    "scene-title": scene.title,
    "scene-takeaway": scene.takeaway,
    "scene-note": scene.note,
    "map-heading": scene.mapHeading,
    "map-focus": scene.focus,
    "progress-label": `${index + 1} / ${scenes.length}`
  })) byId(id).textContent = value;

  byId("scene-body").innerHTML = scene.body.map(text => `<p>${text}</p>`).join("");
  byId("map-facts").replaceChildren(...scene.facts.map(text => { const item = document.createElement("li"); item.textContent = text; return item; }));
  byId("previous").disabled = index === 0;
  byId("next").textContent = index === scenes.length - 1 ? "最初から ↻" : "次へ →";
  byId("story-progress").value = index + 1;
  byId("story-progress").textContent = `${index + 1} / ${scenes.length}`;
  document.querySelectorAll("button[data-scene]").forEach(b => {
    if (Number(b.dataset.scene) === index) b.setAttribute("aria-current", "step");
    else b.removeAttribute("aria-current");
  });
  document.querySelectorAll("[data-chapter]").forEach(b => {
    if (scenes[Number(b.dataset.chapter)].chapter === scene.chapter) b.setAttribute("aria-current", "step");
    else b.removeAttribute("aria-current");
  });
  drawMap(scene);
  if (scroll && matchMedia("(max-width: 740px)").matches) {
    document.querySelector(".chapter-nav").scrollIntoView({ block: "start", behavior: "instant" });
  }
}

function go(next) {
  next = clamp(next, 0, scenes.length - 1);
  if (next === index) return;
  index = next;
  show(true);
}

scenes.forEach((scene, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.scene = i;
  b.textContent = String(i + 1).padStart(2, "0");
  b.setAttribute("aria-label", `${i + 1}. ${scene.title.replace("\n", "")}`);
  b.title = b.getAttribute("aria-label");
  b.addEventListener("click", () => go(i));
  byId("scene-nav").append(b);
});

byId("previous").addEventListener("click", () => go(index - 1));
byId("next").addEventListener("click", () => go(index === scenes.length - 1 ? 0 : index + 1));
byId("replay").addEventListener("click", () => drawMap(scenes[index]));
document.querySelectorAll("[data-chapter]").forEach(b => b.addEventListener("click", () => go(Number(b.dataset.chapter))));

document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat || event.target.closest("input,textarea,select,[contenteditable=true],details")) return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    go(index + (event.key === "ArrowRight" ? 1 : -1));
  }
});

new ResizeObserver(() => {
  const size = `${map.clientWidth},${map.clientHeight}`;
  if (size === lastSize) return;
  lastSize = size;
  drawMap(scenes[index]);
}).observe(map);

reduced.addEventListener("change", () => drawMap(scenes[index]));
byId("story-progress").max = scenes.length;
show();
}
