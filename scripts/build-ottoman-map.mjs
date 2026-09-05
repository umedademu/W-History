import { writeFile } from "node:fs/promises";

const baseUrl = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";
const layers = await Promise.all(["ne_110m_land", "ne_110m_lakes"].map(async (name) => {
  const response = await fetch(`${baseUrl}/${name}.geojson`);
  if (!response.ok) throw new Error(`地図を取得できません: ${response.status}`);
  return response.json();
}));

// 経度12〜52度、緯度18〜52度
const MIN_LON = 12, MAX_LON = 52;
const MIN_LAT = 18, MAX_LAT = 52;
const WIDTH = (MAX_LON - MIN_LON) * 20; // 800
const HEIGHT = (MAX_LAT - MIN_LAT) * 20; // 680

function clipRing(ring) {
  let result = ring;
  for (const [axis, edge, greater] of [[0, MIN_LON, true], [0, MAX_LON, false], [1, MIN_LAT, true], [1, MAX_LAT, false]]) {
    const input = result;
    result = [];
    if (!input.length) break;
    let previous = input.at(-1);
    let wasInside = greater ? previous[axis] >= edge : previous[axis] <= edge;
    for (const point of input) {
      const inside = greater ? point[axis] >= edge : point[axis] <= edge;
      if (inside !== wasInside) {
        const fraction = (edge - previous[axis]) / (point[axis] - previous[axis]);
        result.push([previous[0] + (point[0] - previous[0]) * fraction, previous[1] + (point[1] - previous[1]) * fraction]);
      }
      if (inside) result.push(point);
      previous = point;
      wasInside = inside;
    }
  }
  return result;
}

function paths(layer) {
  return layer.features.flatMap(({ geometry }) => {
    const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.type === "MultiPolygon" ? geometry.coordinates : [];
    return polygons.map((polygon) => polygon.map(clipRing).filter((ring) => ring.length >= 3).map((ring) => ring.map(([lon, lat], i) => `${i ? "L" : "M"}${((lon - MIN_LON) * 20).toFixed(1)},${((MAX_LAT - lat) * 20).toFixed(1)}`).join(" ") + "Z").join(" ")).filter(Boolean);
  }).map((d) => `<path d="${d}"/>`).join("\n");
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<title>オスマン帝国と地中海・中東の地形概略図</title>
<desc>Natural Earth 1:110m の陸地と湖を使用。国境なし。経度12〜52度、緯度18〜52度の範囲。</desc>
<rect width="${WIDTH}" height="${HEIGHT}" fill="#e6eded"/>
<g fill="#f0eddf" stroke="#bdc5b8" stroke-width="1.2" fill-rule="evenodd">${paths(layers[0])}</g>
<g fill="#e6eded" stroke="#bdc5b8" stroke-width="1.2" fill-rule="evenodd">${paths(layers[1])}</g>
</svg>\n`;

await writeFile(new URL("../public/ottoman-map.svg", import.meta.url), svg);
console.log(`オスマン帝国の地形図を作成しました（${Buffer.byteLength(svg).toLocaleString()} バイト）。`);
