import { writeFile } from "node:fs/promises";

// 既存の地図と同じ Natural Earth の陸地・湖を、全球の範囲で使う。
const base = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";
const layers = await Promise.all(["ne_110m_land", "ne_110m_lakes"].map(async name => {
  const response = await fetch(`${base}/${name}.geojson`);
  if (!response.ok) throw new Error(`地図を取得できません: ${response.status}`);
  return response.json();
}));
function paths(layer) {
  return layer.features.flatMap(({geometry}) => {
    const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.type === "MultiPolygon" ? geometry.coordinates : [];
    return polygons.map(polygon => polygon.map(ring => ring.map(([lon,lat],i) => `${i ? "L" : "M"}${((lon+180)*4).toFixed(3)},${((90-lat)*4).toFixed(3)}`).join(" ")+"Z").join(" "));
  }).map(d=>`<path d="${d}"/>`).join("\n");
}
await writeFile(new URL("../public/ottoman-world-map.svg",import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 720">
<title>北を上にした世界地形図</title>
<desc>Natural Earth 1:110m の陸地と湖。国境なし。経度−180〜180度、緯度−90〜90度。</desc>
<rect width="1440" height="720" fill="#e6eded"/>
<g fill="#e6dfca" stroke="#a8b5a5" stroke-width="0.1" fill-rule="evenodd">${paths(layers[0])}</g>
<g fill="#e6eded" stroke="#a8b5a5" stroke-width="0.1" fill-rule="evenodd">${paths(layers[1])}</g>
</svg>\n`);
console.log("オスマン編の導入と小地図に使う世界地図を作成しました。");
