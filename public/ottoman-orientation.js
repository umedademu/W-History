// 北を上にしたまま、世界・地域・各場面を同じ座標でつなぐ。
export const worldMap = { url: "/ottoman-world-map.svg?v=0.007", width: 1440, height: 720 };
export const project = ([lon, lat]) => [(lon + 180) * 4, (90 - lat) * 4];
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const ease = p => p * p * (3 - 2 * p);

const locations = {
  founding: ["north", "アナトリア西北部", "ヨーロッパとアジアの間、黒海と地中海にはさまれたアナトリアへ。"],
  bursa: ["north", "アナトリア西北部・ブルサ"],
  edirne: ["north", "海峡を越えてバルカン半島へ"],
  kosovo: ["north", "バルカン半島・コソヴォ"],
  nicopolis: ["north", "バルカン半島・ニコポリス"],
  ankara: ["north", "アナトリア内陸・アンカラ"],
  recovery: ["north", "バルカン半島とアナトリア"],
  conquest: ["north", "ヨーロッパとアジアを結ぶ海峡", "黒海と地中海をつなぐ海峡へ。コンスタンティノープルの位置を確かめます。"],
  istanbul: ["north", "海峡の都・イスタンブル"],
  millet: ["north", "イスタンブルと黒海周辺"],
  chaldiran: ["east", "アナトリア東部・イラン方面", "海峡の都から東へ。アナトリアとイランの境にある戦場へ近づきます。"],
  cairo: ["south", "エジプトとアラビア半島", "地中海の東岸を南へ。アフリカのエジプトと、紅海の向こうのアラビア半島に注目します。"],
  suleiman: ["east", "イラク・バグダード方面", "地中海より東、イラクへ。イスタンブルからバグダードへの方向を確かめます。"],
  vienna1: ["danube", "ヨーロッパ内陸・ウィーン方面", "バルカン半島から北西へ。ヨーロッパ内陸のハンガリーとウィーンに近づきます。"],
  preveza: ["north", "地中海・ギリシア西岸", "ヨーロッパとアフリカの間にある地中海へ。ギリシア西岸の海戦を見ます。"],
  capitulation: ["north", "地中海を結ぶ都・イスタンブル"],
  lepanto: ["north", "地中海・ギリシア西岸", "地中海の東寄り、ギリシア西岸へ。レパントの位置を確かめます。"],
  crisis: ["north", "イスタンブルと帝国の中枢"],
  karlowitz: ["danube", "ウィーンとドナウ川流域", "再びヨーロッパ内陸へ。ウィーンと、条約が結ばれるカルロヴィッツに注目します。"],
  tulip: ["overview", "地中海・中東に広がる帝国", "ヨーロッパ・アジア・アフリカを結ぶ地域へ。これまでの物語の広がりを振り返ります。"]
};

export function locationFor(scene) {
  const [region, label, guidance] = locations[scene.id];
  return { region, label, guidance: guidance ?? `地中海周辺での位置を確かめ、${label}に近づきます。` };
}

export function transitionFor(scene, previous) {
  if (!previous || scene.id === "founding") return "world";
  if (scene.chapter !== previous.chapter || locationFor(scene).region !== locationFor(previous).region) return "region";
  return "nearby";
}

// 表示中の四隅から範囲を求めるので、小地図の枠は拡大・移動にも追従する。
export function visibleBounds(camera, width, height) {
  return [(-camera.x / camera.scale) / 4 - 180,
    90 - ((height - camera.y) / camera.scale) / 4,
    ((width - camera.x) / camera.scale) / 4 - 180,
    90 - (-camera.y / camera.scale) / 4];
}

export function fitCamera(bounds, width, height) {
  const [west, south, east, north] = bounds;
  const [left, top] = project([west, north]), [right, bottom] = project([east, south]);
  const scale = Math.min((width - 36) / (right - left), (height - 100) / (bottom - top));
  return { scale, x: width / 2 - (left + right) / 2 * scale, y: (height - 28) / 2 - (top + bottom) / 2 * scale };
}

function interpolateCamera(a, b, t, width, height) {
  // 中心と倍率を補間し、拡大の途中で目的地が画面の外へ飛び出すのを防ぐ。
  const q = ease(clamp(t)), scale = a.scale * (b.scale / a.scale) ** q;
  const center = key => ((key === "x" ? width : height) / 2 - a[key]) / a.scale * (1 - q)
    + ((key === "x" ? width : height) / 2 - b[key]) / b.scale * q;
  return { scale, x: width / 2 - center("x") * scale, y: height / 2 - center("y") * scale };
}

export function createOrientation({ map, svg, onPending }) {
  const mini = document.getElementById("world-locator"), miniFrame = document.getElementById("locator-frame");
  const skip = document.getElementById("skip-orientation"), status = document.getElementById("map-status");
  const description = document.getElementById("orientation-description"), heading = document.getElementById("orientation-heading");
  let frame = 0, layer = null, finish = null, current = null;

  function cancel() {
    cancelAnimationFrame(frame);
    finish = null;
    layer?.remove(); layer = null;
    map.classList.remove("is-orienting");
    skip.hidden = true;
    onPending(false);
  }

  function locate(camera, width, height) {
    current = camera;
    const bounds = visibleBounds(camera, width, height);
    const [left, top] = project([bounds[0], bounds[3]]), [right, bottom] = project([bounds[2], bounds[1]]);
    const x = clamp(left, 0, worldMap.width), y = clamp(top, 0, worldMap.height);
    miniFrame.setAttribute("x", x); miniFrame.setAttribute("y", y);
    miniFrame.setAttribute("width", Math.max(0, clamp(right, 0, worldMap.width) - x));
    miniFrame.setAttribute("height", Math.max(0, clamp(bottom, 0, worldMap.height) - y));
    mini.dataset.bounds = bounds.map(v => v.toFixed(4)).join(",");
  }

  function run({ scene, target, mode, stationary = false, done }) {
    cancel();
    const width = map.clientWidth, height = map.clientHeight, place = locationFor(scene);
    document.getElementById("location-name").textContent = place.label;
    mini.setAttribute("aria-label", `世界地図の枠は、いま大きな地図に表示している範囲です。${place.label}をたどります。`);
    map.dataset.transition = mode;
    if (mode === "none" || stationary && mode === "nearby") { locate(target, width, height); done(); return; }
    const wide = fitCamera([-178, -58, 178, 82], width, height);
    const regional = fitCamera([-18, -5, 82, 65], width, height);
    const start = mode === "world" ? wide : current ?? regional;
    const stops = mode === "world"
      ? [[0, wide], [550, wide], [1500, regional], [1900, regional], [3200, target]]
      : mode === "region" ? [[0, start], [650, regional], [1100, regional], [2400, target]]
      : [[0, start], [650, target]];
    const duration = stops.at(-1)[0];
    layer = svg("g", { class: "orientation-layer", "aria-hidden": "true" });
    const base = svg("image", { href: worldMap.url });
    const focus = svg("rect", { fill: "#b9563030", stroke: "#a4432d", "stroke-width": 2, rx: 3 });
    layer.append(base, focus);
    const continentLabels = [[[15, 57], "ヨーロッパ"], [[82, 43], "アジア"], [[12, 2], "アフリカ"], [[-104, 40], "北アメリカ"], [[-62, -19], "南アメリカ"], [[133, -25], "オセアニア"]];
    const regionLabels = [[[15, 53], "ヨーロッパ"], [[63, 45], "アジア"], [[14, 15], "アフリカ"], [[20, 33], "地中海"], [[35, 44], "黒海"]];
    const labels = [...continentLabels, ...regionLabels].map(([at, text], i) => {
      const node = svg("text", { class: "orientation-label", "text-anchor": "middle" }, text);
      layer.append(node); return { at, node, continent: i < continentLabels.length };
    });
    const marker = svg("g"), markerDot = svg("circle", { r: 4, fill: "#a4432d", stroke: "#fff9ec", "stroke-width": 2 });
    marker.append(markerDot); layer.append(marker); map.append(layer);
    map.classList.add("is-orienting"); map.dataset.phase = "orienting"; map.dataset.progress = "0";
    heading.textContent = mode === "nearby" ? "次の場所へ移動しています" : "世界から、物語の舞台へ";
    description.textContent = place.guidance;
    document.getElementById("orientation-hint").textContent = stationary
      ? "位置を確かめたら「説明へ進む」を押してください。"
      : "地図が近づいたら、説明が始まります。";
    onPending(true); skip.hidden = false;
    const targetBounds = visibleBounds(target, width, height);
    const targetLeft = project([targetBounds[0], targetBounds[3]]), targetRight = project([targetBounds[2], targetBounds[1]]);
    const targetPoint = placesPoint(scene);
    const began = performance.now();

    finish = () => {
      cancel(); locate(target, width, height);
      done();
    };
    function render(camera, elapsed = 0) {
      locate(camera, width, height);
      base.setAttribute("x", camera.x); base.setAttribute("y", camera.y);
      base.setAttribute("width", worldMap.width * camera.scale); base.setAttribute("height", worldMap.height * camera.scale);
      const screen = p => [p[0] * camera.scale + camera.x, p[1] * camera.scale + camera.y];
      const [x, y] = screen(targetLeft), [right, bottom] = screen(targetRight);
      focus.setAttribute("x", x); focus.setAttribute("y", y); focus.setAttribute("width", right - x); focus.setAttribute("height", bottom - y);
      focus.setAttribute("opacity", clamp((duration - elapsed) / 300));
      const span = width / camera.scale / 4;
      for (const { at, node, continent } of labels) {
        const [px, py] = screen(project(at));
        node.setAttribute("x", px); node.setAttribute("y", py);
        node.style.display = (continent ? span > 175 : span <= 175 && span > 45) && px > 48 && px < width - 48 && py > 24 && py < height - 55 ? "" : "none";
      }
      marker.setAttribute("transform", `translate(${screen(project(targetPoint)).join(",")})`);
      status.textContent = stationary ? `赤い枠が物語の舞台。${place.label}に注目`
        : mode === "nearby" ? `${place.label}へ移動しています` : span > 175 ? "印のある地域へ。ヨーロッパ・アジア・アフリカの間に注目" : `地中海周辺から、${place.label}へ`;
      map.dataset.cameraProgress = (elapsed / duration).toFixed(3);
    }
    function tick(now) {
      const elapsed = Math.min(duration, now - began);
      let part = 1;
      while (part < stops.length - 1 && elapsed > stops[part][0]) part++;
      const [t0, a] = stops[part - 1], [t1, b] = stops[part];
      render(interpolateCamera(a, b, (elapsed - t0) / (t1 - t0), width, height), elapsed);
      if (elapsed < duration) frame = requestAnimationFrame(tick);
      else finish?.();
    }
    if (stationary) render(mode === "world" ? wide : regional);
    else tick(began);
  }
  // 目印は領域の中心。都市・人物の表示は拡大が終わってから行う。
  function placesPoint(scene) { return [(scene.frame[0] + scene.frame[2]) / 2, (scene.frame[1] + scene.frame[3]) / 2]; }
  skip.addEventListener("click", () => { const action = finish; document.getElementById("show-location").focus({ preventScroll: true }); action?.(); });
  return { run, cancel };
}
