import assert from "node:assert/strict";
import { scenes } from "../public/ottoman-scenes.js";
import { project, fitCamera, visibleBounds, locationFor, transitionFor } from "../public/ottoman-orientation.js";

// 世界地図と拡大した地図で東西・南北が逆転せず、同じ座標へ戻ること。
assert.deepEqual(project([-180, 90]), [0, 0]);
assert.deepEqual(project([180, -90]), [1440, 720]);
for (const [width, height] of [[356, 400], [728, 530], [1000, 440]]) {
  for (const bounds of [[-178, -58, 178, 82], [-18, -5, 82, 65], ...scenes.map(scene => scene.frame)]) {
    const camera = fitCamera(bounds, width, height), actual = visibleBounds(camera, width, height);
    assert.ok(actual.every(Number.isFinite));
    assert.ok(actual[0] <= bounds[0] && actual[1] <= bounds[1] && actual[2] >= bounds[2] && actual[3] >= bounds[3], "端末の縦横比によって注目範囲が切れています");
    const topLeft = project([actual[0], actual[3]]), bottomRight = project([actual[2], actual[1]]);
    assert.ok(Math.abs(topLeft[0] * camera.scale + camera.x) < 1e-8);
    assert.ok(Math.abs(topLeft[1] * camera.scale + camera.y) < 1e-8);
    assert.ok(Math.abs(bottomRight[0] * camera.scale + camera.x - width) < 1e-8);
    assert.ok(Math.abs(bottomRight[1] * camera.scale + camera.y - height) < 1e-8);
  }
}

for (const scene of scenes) {
  const location = locationFor(scene);
  assert.ok(location.region && location.label && location.guidance, `${scene.id} の位置案内がありません`);
}
const scene = id => scenes.find(item => item.id === id);
assert.equal(transitionFor(scene("founding"), null), "world");
assert.equal(transitionFor(scene("founding"), scene("tulip")), "world");
assert.equal(transitionFor(scene("bursa"), scene("founding")), "nearby");
assert.equal(transitionFor(scene("founding"), scene("bursa")), "world");
assert.equal(transitionFor(scene("conquest"), scene("recovery")), "region");
assert.equal(transitionFor(scene("cairo"), scene("chaldiran")), "region");
assert.equal(transitionFor(scene("chaldiran"), scene("cairo")), "region");
assert.equal(transitionFor(scene("vienna1"), scene("suleiman")), "region");
assert.equal(transitionFor(scene("lepanto"), scene("capitulation")), "region");
console.log("オスマン編の地図の向き・表示範囲・20場面の位置案内・移動の切り替えを確認しました。");
