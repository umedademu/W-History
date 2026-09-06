import assert from "node:assert/strict";
import { findSpace, intersects } from "../public/map-layout.js";

for (const width of [286, 356, 728]) {
  const area = { left: 10, right: width - 10, top: 10, bottom: 520 };
  const occupied = [{ left: width / 2 - 48, right: width / 2 + 48, top: 220, bottom: 250 }];
  for (let i = 0; i < 4; i++) {
    let result;
    while (!(result = findSpace({ width: 110, top: 124, bottom: 28 }, [width / 2, 250], area, occupied)) && area.bottom < 1000) area.bottom += 96;
    assert.ok(result, "名前・吹き出しを含む人物の置き場所が見つかりません");
    assert.ok(!occupied.some(box => intersects(result.box, box)), "地名または別の人物と重なっています");
    assert.ok(result.box.left >= area.left && result.box.right <= area.right && result.box.top >= area.top && result.box.bottom <= area.bottom, "表示範囲からはみ出しています");
    occupied.push(result.box);
  }
}
const area = { left: 0, right: 100, top: 0, bottom: 100 };
assert.equal(findSpace({ width: 40, top: 20, bottom: 20 }, [50, 50], area, [area]), null, "空きがない場合は地図を広げるため、重なる位置を返しません");
assert.equal(findSpace({ width: 200, top: 20, bottom: 20 }, [50, 50], area, []), null);
console.log("文字・人物の重なり回避、画面端の収まり、空きがない場合の判定を確認しました。");
