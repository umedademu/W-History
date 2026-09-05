import { places, zones, scenes } from "./umayyad-abbasid-scenes.js?v=0.005";

const NS = "http://www.w3.org/2000/svg";
const project = ([lon, lat]) => [(lon + 12) * 14, (55 - lat) * 14];
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
  const points = [[west, north], [east, south], ...scene.pins.map(k => places[k].point), ...scene.routes.flatMap(r => r.points), ...scene.tags.map(t => t.at)].map(project);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((width - 82) / (maxX - minX), (height - 125) / (maxY - minY));
  const x = width / 2 - (minX + maxX) / 2 * scale, y = height / 2 - (minY + maxY) / 2 * scale;
  return { scale, x, y, toScreen: p => { const q = project(p); return [q[0] * scale + x, q[1] * scale + y]; } };
}

const resolveImg = key => key.includes("/") ? `/images/${key}.png` : `/images/umayyad-abbasid/${key}.png`;

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

  const base = svg("image", { href: "/islamic-world-map.svg", x, y, width: 1316 * scale, height: 630 * scale });
  map.append(base);

  const regions = svg("g", { class: "islam-regions" });
  map.append(regions);
  const polygon = points => points.map(p => toScreen(p).join(",")).join(" ");
  for (const key of scene.zones) {
    const z = zones[key];
    if (z) regions.append(svg("polygon", { points: polygon(z.points), fill: z.color, stroke: z.color, "stroke-width": 1.1 }));
  }

  for (const [p, text] of [[[24, 34.5], "地中海"], [[35, 43.5], "黒海"], [[37.5, 23.5], "紅海"], [[50, 27], "ペルシア湾"]]) {
    const [sx, sy] = toScreen(p);
    if (sx > 40 && sx < width - 40 && sy > 32 && sy < height - 40) {
      map.append(svg("text", { x: sx, y: sy, class: "water-label", "text-anchor": "middle" }, text));
    }
  }

  const arrows = svg("g", { class: "islam-arrows" });
  map.append(arrows);
  const pathData = (pts, progress = 1) => {
    if (pts.length < 2) return "";
    const total = pts.length - 1, target = total * clamp(progress);
    const seg = Math.min(Math.floor(target), total - 1), local = target - seg;
    const out = [`M ${toScreen(pts[0]).join(" ")}`];
    for (let i = 1; i <= seg; i++) out.push(`L ${toScreen(pts[i]).join(" ")}`);
    if (local > 0) {
      const p0 = toScreen(pts[seg]), p1 = toScreen(pts[seg + 1]);
      out.push(`L ${p0[0] + (p1[0] - p0[0]) * local} ${p0[1] + (p1[1] - p0[1]) * local}`);
    }
    return out.join(" ");
  };

  const lineElements = scene.routes.map(r => {
    const stroke = colors[r.kind] || colors.campaign;
    const node = svg("path", { class: `arrow ${r.kind}`, stroke, "stroke-dasharray": r.kind === "move" || r.kind === "trade" ? "6 5" : "none" });
    arrows.append(node);
    return { r, node };
  });

  const cityLayer = svg("g", { class: "islam-cities" });
  map.append(cityLayer);
  for (const key of scene.pins) {
    const place = places[key];
    const [cx, cy] = toScreen(place.point), isCap = key === scene.capital;
    cityLayer.append(
      svg("circle", { cx, cy, r: isCap ? 6 : 4.2, class: `city-dot ${isCap ? "capital" : ""}` }),
      svg("text", { x: cx, y: cy - 9, class: `city-name ${isCap ? "capital-name" : ""}` }, place.name)
    );
  }

  const actorNodes = (scene.actors || []).map(a => {
    const node = svg("g", { class: "map-actor" });
    const img = svg("image", { href: resolveImg(a.image), width: 56, height: 56 });
    node.append(img);
    if (a.bubble) {
      const bubble = svg("g", { class: "actor-bubble" });
      const bg = svg("rect", { rx: 5, ry: 5 });
      const txt = svg("text", { y: -16 }, a.bubble);
      bubble.append(bg, txt);
      node.append(bubble);
      requestAnimationFrame(() => {
        const len = txt.getComputedTextLength?.() || a.bubble.length * 11;
        bg.setAttribute("x", `${-len / 2 - 7}`);
        bg.setAttribute("y", "-30");
        bg.setAttribute("width", `${len + 14}`);
        bg.setAttribute("height", "20");
      });
    }
    map.append(node);
    return { a, node, img };
  });

  const updateEntities = progress => {
    for (const { r, node } of lineElements) {
      const p = clamp((progress - (r.start ?? 0)) / ((r.end ?? 1) - (r.start ?? 0)));
      node.setAttribute("d", pathData(r.points, p));
    }
    for (const { a, node, img } of actorNodes) {
      const offset = a.offset || [0, 0];
      let basePt = typeof a.at === "string" ? places[a.at].point : a.at;
      if (a.route !== undefined) {
        const r = scene.routes[a.route];
        if (r) {
          const p = clamp((progress - (r.start ?? 0)) / ((r.end ?? 1) - (r.start ?? 0)));
          const total = r.points.length - 1, target = total * p;
          const seg = Math.min(Math.floor(target), total - 1), local = target - seg;
          const p0 = r.points[seg], p1 = r.points[seg + 1];
          basePt = [p0[0] + (p1[0] - p0[0]) * local, p0[1] + (p1[1] - p0[1]) * local];
          if (a.afterImage && p >= 0.95) img.setAttribute("href", resolveImg(a.afterImage));
        }
      }
      const [sx, sy] = toScreen(basePt);
      node.setAttribute("transform", `translate(${sx + offset[0] - 28}, ${sy + offset[1] - 40})`);
    }
  };

  if (reduced.matches) {
    updateEntities(1);
    return;
  }

  const start = performance.now();
  let handle = 0;
  const frame = time => {
    const progress = clamp((time - start) / scene.duration);
    updateEntities(progress);
    if (progress < 1) handle = requestAnimationFrame(frame);
  };
  handle = requestAnimationFrame(frame);
  stop = () => cancelAnimationFrame(handle);
}

function updateUI() {
  const scene = scenes[index];
  byId("year").textContent = scene.year;
  byId("kicker").textContent = scene.kicker;
  byId("title").textContent = scene.title;
  byId("takeaway").textContent = scene.takeaway;
  byId("scene-counter").textContent = `${index + 1} / ${scenes.length}`;
  byId("btn-prev").disabled = index === 0;
  byId("btn-next").disabled = index === scenes.length - 1;

  const bodyEl = byId("body");
  bodyEl.innerHTML = "";
  for (const p of scene.body) {
    const el = document.createElement("p");
    el.innerHTML = p;
    bodyEl.append(el);
  }

  const notesEl = byId("notes");
  notesEl.innerHTML = scene.note ? `<p><strong>補足：</strong>${scene.note}</p>` : "";

  document.querySelectorAll(".chapter-nav button").forEach(b => {
    const chap = Number(b.dataset.chapter);
    b.setAttribute("aria-current", chap === scene.chapter ? "true" : "false");
  });

  drawMap(scene);
}

export function init() {
  byId("btn-prev")?.addEventListener("click", () => { if (index > 0) { index--; updateUI(); } });
  byId("btn-next")?.addEventListener("click", () => { if (index < scenes.length - 1) { index++; updateUI(); } });
  byId("btn-replay")?.addEventListener("click", () => { drawMap(scenes[index]); });

  document.querySelectorAll(".chapter-nav button").forEach(b => {
    b.addEventListener("click", () => {
      const targetScene = Number(b.dataset.chapter);
      if (!isNaN(targetScene) && targetScene >= 0 && targetScene < scenes.length) {
        index = targetScene;
        updateUI();
      }
    });
  });

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && index > 0) { index--; updateUI(); }
    else if (e.key === "ArrowRight" && index < scenes.length - 1) { index++; updateUI(); }
  });

  window.addEventListener("resize", () => {
    const size = `${map.clientWidth}x${map.clientHeight}`;
    if (size !== lastSize) { lastSize = size; drawMap(scenes[index]); }
  });

  updateUI();
}

init();
