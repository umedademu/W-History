# W-History の構成

現在の版は v0.005（2026年9月6日）。中東史全9編、合計153場面、画像171点を収録しています。参考書全33枚の情報を体系化した資料集（sourcesフォルダ・全5編＋対照表）を整理し、保管しています（公開管理からは除外）。

## 公開ファイル

- `public/index.html`：全9教材を選ぶ一覧（通史順に再編）。
- `public/library.css`：一覧・更新情報・見つからないページの見た目。
- `public/changelog.html`：利用者向け更新情報。
- `public/404.html`：存在しないページの案内。
- `public/islam-origin-story.*` と `islam-origin-scenes.js`：01 イスラーム教の成立と正統カリフ。15場面。
- `public/umayyad-abbasid-story.*` と `umayyad-abbasid-scenes.js`：02 ウマイヤ朝とアッバース朝。16場面。
- `public/regional-dynasties-story.*` と `regional-dynasties-scenes.js`：03 分裂と地方政権の興亡。20場面。
- `public/timur-story.*`：04 ティムールの遠征。13場面。
- `public/timur-after-story.*` と `timur-after-scenes.js`：05 ティムール死後。16場面。
- `public/safavid-story.*` と `safavid-scenes.js`：06 サファヴィー朝。20場面。
- `public/ottoman-story.*` と `ottoman-scenes.js`：07 オスマン帝国。20場面。
- `public/mughal-story.*` と `mughal-scenes.js`：08 ムガル帝国。18場面。
- `public/islamic-culture-story.*` と `islamic-culture-scenes.js`：09 イスラーム文化。15場面。
- `public/islamic-world-map.svg`：イベリアから中央アジア・インドまでを網羅する広域高精細基図。
- `public/timur-map.svg`：中央アジア・中東・インドを収める広域基図。
- `public/ottoman-map.svg`：地中海・中東・ヨーロッパを収めるオスマン帝国専用の基図。
- `public/images/`：各教材専用の透過ドット絵PNG画像。

各教材は独立したHTMLのまま維持し、教材一覧と相互リンクから開きます。地図のSVGは維持し、人物・建物・道具にはPNG画像を使います。前後ボタン・左右キー・章・場面番号・動きの再表示に対応します。

## 編集と確認

`npm run check` は構文、ローカル参照先、教材の入口、Ankiへの依存、公開設定を検査します。実際の表示は `npm run dev` で確認します。`npm run build` も同じ検査を実施し、生成処理なしで `public` を公開します。

## データと将来の連携

現時点では固定教材の閲覧のみで、利用者の記録を保存しません。追加のサービスへの接続や秘密情報は不要です。Anki側のコードを共有せず、相互リンクやスコア連携を追加する際は接続方法を別途決めます。
