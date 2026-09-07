import assert from 'node:assert/strict';
import { alphaBounds, spritePlacement } from '../public/map-sprites.js';

const pixels = new Uint8ClampedArray(192 * 192 * 4);
assert.equal(alphaBounds(pixels, 192, 192), null, '透明画像を拡大しない');
// 添付場面の人物と同じ外寸・余白。半透明な輪郭も欠かさない。
for (let y = 8; y < 184; y++) for (let x = 50; x < 139; x++) pixels[(y * 192 + x) * 4 + 3] = 128;
const bounds = alphaBounds(pixels, 192, 192);
assert.deepEqual(bounds, { left: 50, top: 8, width: 89, height: 176 });
for (const [width, height] of [[70, 105], [54, 81]]) {
  const p = spritePlacement(bounds, width, height);
  const left = p.left + bounds.left * p.scale, top = p.top + bounds.top * p.scale;
  assert.ok(Math.abs(bounds.height * p.scale - height) < .001, '正方形画像の余白で人物が小さくならない');
  assert.ok(left >= 0 && left + bounds.width * p.scale <= width + .001, '人物の左右を切らない');
  assert.ok(top >= -.001 && Math.abs(top + bounds.height * p.scale - height) < .001, '足元を人物枠の下端に揃える');
}
const wide = { left: 2, top: 6, width: 180, height: 80 };
const building = spritePlacement(wide, 76, 76);
assert.equal(wide.width * building.scale, 76, '横長の建物は幅に収める');
assert.ok(wide.height * building.scale < 76, '建物の縦横比を変えない');
assert.equal(spritePlacement({ left: 0, top: 0, width: 16, height: 16 }, 70, 105).scale, 1, '小さな元画像を引き伸ばさない');
console.log('人物画像の余白、足元、携帯幅、横長建物、透明画像の表示寸法を確認しました。');
