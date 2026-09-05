# W-History の構成

現在の版は v0.004（2026年9月6日）。教材4本、合計69場面、画像91点を収録しています。参考書全33枚の情報を体系化した資料集（sourcesフォルダ・全5編＋対照表）を整理し、保管しています（公開管理からは除外）。

## 公開ファイル

- `public/index.html`：4教材を選ぶ一覧。
- `public/library.css`：一覧・更新情報・見つからないページの見た目。
- `public/changelog.html`：利用者向け更新情報。
- `public/404.html`：存在しないページの案内。
- `public/timur-story.*`：ティムールの遠征。13場面。
- `public/timur-after-story.*` と `timur-after-scenes.js`：ティムール死後。16場面。
- `public/safavid-story.*` と `safavid-scenes.js`：サファヴィー朝。20場面。
- `public/ottoman-story.*` と `ottoman-scenes.js`：オスマン帝国。20場面。
- `public/timur-characters.js`：人物の表情・移動などに使う共通処理。
- `public/timur-map.svg`：海岸線を含む共通の基図。
- `public/ottoman-map.svg`：地中海・中東・ヨーロッパを収めるオスマン帝国専用の基図。
- `public/images/timur/`、`timur-after/`、`safavid/`、`ottoman/`：透過画像。18点・22点・26点・25点。

各教材は独立したHTMLのまま維持し、教材一覧と相互リンクから開きます。地図のSVGは維持し、人物・建物・道具にはPNG画像を使います。前後ボタン・左右キー・章・場面番号・動きの再表示に対応します。

## 編集と確認

内容の構成は [遠征](timur-story.md)、[死後](timur-after-story.md)、[サファヴィー朝](safavid-story.md)、[オスマン帝国](ottoman-story.md) を参照してください。画像の記録は各 `*-images.md` にあります。

`npm run check` は構文、ローカル参照先、教材の入口、Ankiへの依存、公開設定を検査します。実際の表示は `npm run dev` で確認します。`npm run build` も同じ検査を実施し、生成処理なしで `public` を公開します。

`scripts/build-timur-map.mjs` は基図の再生成用です。通常の公開では実行しません。実行すると外部の公開地図を取得するため、地図を変更するときだけ使用してください。

移行時は教材本体の中身を変えていないため、一部の読み込みURLには移行元の `v=0.188` が残ります。これは保存された画像・プログラムの識別子で、W-Historyの表示版は v0.001 です。次回そのファイルを変更するときに読み込み側の識別子も更新してください。

## データと将来の連携

現時点では固定教材の閲覧のみで、利用者の記録を保存しません。追加のサービスへの接続や秘密情報は不要です。Anki側のコードを共有せず、相互リンクやスコア連携を追加する際は接続方法を別途決めます。
