import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { maximumMapScale, minimumMapSpan } from '../public/map-camera.js';
import { fitCamera, visibleBounds } from '../public/ottoman-orientation.js';

const projectors = [
  ([x, y]) => [(x + 18) * 14, (55 - y) * 14],
  ([x, y]) => [(x - 20) * 12, (58 - y) * 15],
  ([x, y]) => [(x + 180) * 4, (90 - y) * 4]
];
for (const project of projectors) for (const [width, height] of [[320, 440], [728, 530], [1200, 440], [1200, 760]]) {
  const limit = maximumMapScale(project, width, height);
  const origin = project([0, 0]), east = project([1, 0]), north = project([0, 1]);
  assert.ok(width / (limit * Math.abs(east[0] - origin[0])) >= minimumMapSpan.longitude - 1e-8, '縦長画面でも東西の位置関係を保つ');
  assert.ok(height / (limit * Math.abs(north[1] - origin[1])) >= minimumMapSpan.latitude - 1e-8, '横長画面でも南北の位置関係を保つ');
}

const chapters = [];
for (const [number, name] of [[1, 'islam-origin'], [2, 'umayyad-abbasid'], [3, 'regional-dynasties'], [5, 'timur-after'], [6, 'safavid'], [8, 'mughal'], [9, 'islamic-culture']]) {
  const { scenes } = await import(`../public/${name}-scenes.js`);
  chapters.push({ number, scenes: scenes.map(scene => ({ id: scene.id, frame: scene.frame ?? scene.area })) });
}
const timur = await fs.readFile(new URL('../public/timur-story.js', import.meta.url), 'utf8');
const literal = timur.match(/const scenes = (\[[\s\S]*?\n\]);/)[1];
const timurScenes = vm.runInNewContext(`(${literal})`);
chapters.push({ number: 4, scenes: timurScenes.map(scene => {
  const [x, y, w, h] = scene.camera;
  return { id: scene.id, frame: [x / 12 + 20, 58 - (y + h) / 15, (x + w) / 12 + 20, 58 - y / 15] };
}) });
const { pages } = await import('../public/ottoman-pages.js');
chapters.push({ number: 7, scenes: pages });

let total = 0, details = 0;
for (const chapter of chapters.sort((a, b) => a.number - b.number)) {
  let narrow = 0;
  for (const scene of chapter.scenes) {
    total++;
    const frames = [scene.frame, ...(scene.animation ?? []).map(step => step.frame ?? scene.frame)];
    details += frames.length - 1;
    if (scene.frame[2] - scene.frame[0] < minimumMapSpan.longitude && scene.frame[3] - scene.frame[1] < minimumMapSpan.latitude) narrow++;
    for (const bounds of frames) {
      assert.ok(bounds.length === 4 && bounds.every(Number.isFinite), `${scene.id}の地理範囲が不正`);
      for (const [width, height] of [[320, 440], [1200, 440], [1200, 760]]) {
        const actual = visibleBounds(fitCamera(bounds, width, height), width, height);
        assert.ok(actual[2] - actual[0] >= minimumMapSpan.longitude - 1e-8);
        assert.ok(actual[3] - actual[1] >= minimumMapSpan.latitude - 1e-8);
        assert.ok(actual[0] <= bounds[0] && actual[1] <= bounds[1] && actual[2] >= bounds[2] && actual[3] >= bounds[3], '広域の説明範囲は狭めない');
      }
    }
  }
  console.log(`${String(chapter.number).padStart(2, '0')}章：${chapter.scenes.length}ページの範囲を確認（東西・南北とも基準より狭い指定：${narrow}ページ）。`);
}
assert.equal(total, 221, '全章の確認漏れ');
console.log(`全${total}ページ・内部${details}シーン、3種類の投影と画面寸法で地理図の拡大上限を確認しました。`);
