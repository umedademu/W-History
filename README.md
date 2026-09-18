# W-History

地図と物語で世界史の流れを学ぶ、クリックで進む紙芝居教材です。現在の版は **v0.066** です。

公開先：**https://w-history-one.vercel.app**

保存先：https://github.com/umedademu/W-History

番号は章ごとに付けています。第1〜3回が第1章、第20〜21回が第6章です。

| 番号 | 回・節 | 教材 | ページ数 | ページ |
| --- | --- | --- | ---: | --- |
| 01 | 第1回・1 | 古代オリエント世界の特徴 | 4 | /orient-geography-story.html |
| 02 | 第1回・2 | メソポタミア文明 | 14 | /mesopotamia-story.html |
| 03 | 第1回・3 | エジプト文明 | 24 | /ancient-egypt-story.html |
| 04 | 第1回・4 | オリエントの文化 | 2 | /orient-culture-story.html |
| 05 | 第2回・1 | 地中海東岸のセム語系民族 | 13 | /levant-peoples-story.html |
| 06 | 第2回・2 | アッシリアと4国分立時代 | 10 | /assyria-story.html |
| 07 | 第2回・3 | アケメネス朝ペルシアのオリエント統一 | 13 | /achaemenid-story.html |
| 08 | 第2回・4 | パルティアとササン朝 | 15 | /parthia-sasanian-story.html |
| 09 | 第3回・1 | インダス文明 | 5 | /indus-story.html |
| 10 | 第3回・2 | 古代インド世界の形成 | 22 | /vedic-india-story.html |
| 11 | 第3回・3 | 北インドの王朝の変遷 | 48 | /north-india-story.html |
| 12 | 第3回・4 | 南インドの展開 | 12 | /south-india-story.html |
| 01 | 第20回・1 | イスラーム教の成立〜正統カリフ時代 | 22 | /islam-origin-story.html |
| 02 | 第20回・2 | ウマイヤ朝とアッバース朝 | 19 | /umayyad-abbasid-story.html |
| 03 | 第20回・3 | 3カリフの並立とイスラーム世界の変容 | 16 | /regional-dynasties-story.html |
| 04 | 第20回・4 | 地方政権の興亡 | 19 | /western-dynasties-story.html |
| 05 | 第21回・1 | ティムール朝 | 9 | /timur-story.html |
| 06 | 第21回・2 | サファヴィー朝 | 9 | /safavid-story.html |
| 07 | 第21回・3 | オスマン帝国 | 27 | /ottoman-story.html |
| 08 | 第21回・4 | ムガル帝国 | 20 | /mughal-story.html |
| 09 | 第21回・5 | イスラーム文化 | 14 | /islamic-culture-story.html |

入口は `/` の教材一覧です。前後ボタン、左右キー、場面番号から移動できます。音声と自動の場面送りはありません。全ページでライト・ダークを切り替えられ、選んだ表示は次回も引き継がれます。各教材のページ番号から直接移動できます。一時停止や本文の名前からの見直しもでき、端末の「動きを減らす」設定では結果を静止表示します。

## 手元で確認する

Node.js を用意して、このフォルダで次のコマンドを実行します。外部の追加部品や環境変数は不要です。

```sh
node scripts/serve.mjs
```

`http://127.0.0.1:8766/` を開きます。終了は Ctrl+C。確認用コマンドは `node scripts/check.mjs`、公開前の確認は `npm run build` です。

## Vercelで公開する

このフォルダを単独のリポジトリとして登録し、Vercelで取り込みます。ルートはこのフォルダ、公開対象は `public` です。`vercel.json` に設定済みのため、構築コマンドは `npm run build`、種類は Other を使用します。環境変数やデータベースは不要です。

詳しくは [公開手順](docs/deployment.md)、[構成と編集方法](docs/specification.md)、[追加５編の原文対応と見直し](docs/content-review.md)、[移行記録](docs/migration.md)、[更新履歴](docs/changelog.md) を参照してください。

## Ankiとの関係

本アプリだけで閲覧できます。Ankiの単語集・ログイン・音声設定・学習記録を使いません。今後の相互リンクやスコア連携は未実装です。元のAnkiからは3教材と専用画像・資料を削除し、このプロジェクトで管理します。

## 地図の名称を確認する

`npm ci` 後、`npm run check:browser` で第6章の全155ページをパソコン幅と携帯幅で確認します。第1章の全182ページは `npm run check:ancient:browser` で確認します。インストール済みのChromeまたはEdgeを使用します。他の場所の実行ファイルは `W_HISTORY_BROWSER` で指定できます。音声の再生は検査開始前に無効化します。詳しくは [名称の表示確認](docs/map-name-coverage.md) を参照してください。

## 原文本文と装飾

第1章「オリエント・インドの古代文明」を目次どおり第1〜3回各4パート、合計182ページで収録しました。第6章と合わせて全21パート・337ページです。第1章は原文本文161段落をそのまま掲載し、独立したまとめ・比較表・年号欄などを省いています。書き起こしにある太字を再現し、色と読み仮名は追加していません。掲載範囲・地図・検査については [第1章の対応記録](docs/ancient-orient/README.md) を参照してください。

第6章の全9教材の本文は原文の文章と順序を保ち、囲み・図表・年号まとめの文章化による重複を除いています。原画像の赤太字と黒太字を別の強調にし、画像で確認した読み仮名も表示します。

本文と装飾の対応記録は [原文の再現方針](docs/source-edition/README.md)。再生成は `npm run build:source`、全文と装飾の画面確認は `npm run check:source:browser` です。旧版は利用者の指示により削除済みで、既存の本文・画像照合記録を使って検査します。書き起こしは全30回を各回1ファイルで、番号と日本語の章名を付けたフォルダに保管しています。番号と書籍の日本語の題名で整理した[全30ファイルの一覧](docs/source-consolidation.md)から参照できます。

原文資料の章別の保管先と命名方針は [原文資料の保管方針](docs/source-storage.md) を参照してください。
