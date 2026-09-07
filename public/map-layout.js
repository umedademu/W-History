const NS = "http://www.w3.org/2000/svg";
const gap = 6;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const intersects = (a, b) => a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;

// 障害物の四辺も候補に含める。置けない場合に重なる位置を採用しない。
export function findSpace(size, desired, area, occupied, previous) {
  const minX = area.left + size.width / 2, maxX = area.right - size.width / 2;
  const minY = area.top + size.top, maxY = area.bottom - size.bottom;
  if (minX > maxX || minY > maxY) return null;
  const xs = [desired[0], previous?.[0], minX, maxX];
  const ys = [desired[1], previous?.[1], minY, maxY];
  for (const b of occupied) {
    xs.push(b.left - gap - size.width / 2, b.right + gap + size.width / 2);
    ys.push(b.top - gap - size.bottom, b.bottom + gap + size.top);
  }
  const unique = (values, min, max) => [...new Set(values.filter(Number.isFinite).map(v => clamp(v, min, max)))];
  let best = null, score = Infinity;
  for (const x of unique(xs, minX, maxX)) for (const y of unique(ys, minY, maxY)) {
    const distance = (x - desired[0]) ** 2 + (y - desired[1]) ** 2
      + (previous ? .2 * ((x - previous[0]) ** 2 + (y - previous[1]) ** 2) : 0);
    if (distance >= score) continue;
    const box = { left: x - size.width / 2, right: x + size.width / 2, top: y - size.top, bottom: y + size.bottom };
    if (occupied.some(b => intersects(box, b))) continue;
    best = { x, y, box }; score = distance;
  }
  return best;
}

// 地名、人物、名前、登場後の吹き出しを一つの配置計算で扱う。
// 地理上の印と移動経路は動かさず、ずらした表示を引き出し線で結ぶ。
export function createMapLayout({ map, root, items }) {
  const width = map.clientWidth, height = map.clientHeight;
  const viewport = map.getBoundingClientRect();
  const localRect = element => {
    const b = element.getBoundingClientRect();
    return { left: b.left - viewport.left, right: b.right - viewport.left, top: b.top - viewport.top, bottom: b.bottom - viewport.top };
  };
  const fixed = [...map.parentElement.querySelectorAll(".north-mark,.map-action-status,.map-relation,.map-ancestor,.city-plan")].map(localRect);
  const area = { left: 10, right: width - 10, top: 10, bottom: height - 60 };
  // 画面内へ出ているラベルだけを配置する。遠くの地名を呼び寄せない。
  const labels = [...map.querySelectorAll("text")].filter(node => !node.closest(".city-plan,.orientation-layer")).flatMap(node => {
    const b = localRect(node);
    if (b.right < 0 || b.left > width || b.bottom < 0 || b.top > height) return [];
    const matrix = node.getScreenCTM();
    const x = Number(node.getAttribute("x")), y = Number(node.getAttribute("y"));
    const at = new DOMPoint(x, y).matrixTransform(matrix);
    const anchor = new DOMPoint(Number(node.dataset.anchorX ?? x), Number(node.dataset.anchorY ?? y)).matrixTransform(matrix);
    const guide = document.createElementNS(NS, "line");
    for (const [key, value] of Object.entries({ stroke: "#617e7c", "stroke-width": .8, "vector-effect": "non-scaling-stroke", opacity: .65, "pointer-events": "none" })) guide.setAttribute(key, value);
    node.before(guide);
    node.dataset.layoutLabel = "true";
    return [{ node, guide, x, y, matrix, anchor: [anchor.x - viewport.left, anchor.y - viewport.top],
      desired: [(b.left + b.right) / 2, at.y - viewport.top],
      centerOffset: (b.left + b.right) / 2 - (at.x - viewport.left),
      size: { width: b.right - b.left + 6, top: at.y - viewport.top - b.top + 3, bottom: b.bottom - (at.y - viewport.top) + 3 } }];
  });
  const occupied = [...fixed];
  let fits = true;
  for (const label of labels) {
    const chosen = findSpace(label.size, label.desired, area, occupied);
    if (!chosen) { fits = false; break; }
    occupied.push(chosen.box);
    const inverse = label.matrix.inverse();
    const at = new DOMPoint(chosen.x - label.centerOffset + viewport.left, chosen.y + viewport.top).matrixTransform(inverse);
    const start = new DOMPoint(label.anchor[0] + viewport.left, label.anchor[1] + viewport.top).matrixTransform(inverse);
    label.node.setAttribute("x", at.x); label.node.setAttribute("y", at.y);
    label.guide.setAttribute("x1", start.x); label.guide.setAttribute("y1", start.y);
    label.guide.setAttribute("x2", at.x); label.guide.setAttribute("y2", at.y);
    label.guide.hidden = Math.hypot(chosen.x - label.anchor[0], chosen.y - label.anchor[1]) < 24;
    label.guide.style.display = label.guide.hidden ? "none" : "";
  }

  const entries = items.map(entry => {
    const { figure, bubble, node, item } = entry;
    const wasHidden = node.hidden, text = bubble.textContent;
    node.hidden = false;
    bubble.textContent = entry.reserveSpeech ?? item.bubble ?? text;
    figure.style.marginLeft = "0px";
    const name = figure.querySelector("[class$='-name']");
    name.style.overflowWrap = "anywhere";
    const size = {
      width: Math.max(figure.offsetWidth, name.offsetWidth, bubble.offsetWidth) + 10,
      top: figure.offsetHeight + (bubble.textContent ? bubble.offsetHeight + 8 : 0) + 5,
      bottom: name.offsetHeight + 9
    };
    bubble.textContent = text; node.hidden = wasHidden;
    let connector = entry.connector;
    if (!connector) {
      connector = document.createElement("span"); node.prepend(connector);
      connector.style.cssText = "position:absolute;left:0;top:0;height:0;border-top:1px dashed #536f78b0;transform-origin:left center;";
    }
    figure.dataset.layoutFigure = "true";
    return { ...entry, connector, size, previous: null };
  });

  function expand() {
    // 混雑時は表示を隠したり重ねたりせず、地図の高さを確保して再配置する。
    map.style.minHeight = `${height + 96}px`;
    root.style.opacity = "0";
  }
  return () => {
    if (!fits) { expand(); return; }
    const boxes = [...occupied];
    for (const entry of entries) {
      const { node, figure, item, connector, size } = entry;
      if (node.hidden) continue;
      const matrix = new DOMMatrixReadOnly(node.style.transform);
      const anchor = [matrix.e, matrix.f], offset = item.offset ?? [0, 0];
      const desired = [anchor[0] + offset[0], anchor[1] + offset[1]];
      const previous = entry.previous ? [anchor[0] + entry.previous[0], anchor[1] + entry.previous[1]] : null;
      const chosen = findSpace(size, desired, area, boxes, previous);
      if (!chosen) { expand(); return; }
      boxes.push(chosen.box);
      const dx = chosen.x - anchor[0], dy = chosen.y - anchor[1];
      entry.previous = [dx, dy];
      figure.style.marginLeft = "0px";
      figure.style.transform = `translate(calc(-50% + ${dx}px),${dy}px)`;
      connector.style.width = `${Math.hypot(dx, dy)}px`;
      connector.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      connector.style.display = Math.hypot(dx, dy) > 8 ? "" : "none";
    }
    root.style.opacity = "1";
  };
}
