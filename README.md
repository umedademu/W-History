# W-History

地図と物語で世界史の流れを学ぶ、クリックで進む紙芝居教材です。現在の版は **v0.053** です。

公開先：**https://w-history-one.vercel.app**

保存先：https://github.com/umedademu/W-History

| 番号 | 教材 | ページ数 | ページ |
| --- | --- | ---: | --- |
| 01 | イスラーム成立 | 22 | /islam-origin-story.html |
| 02 | ウマイヤ・アッバース | 19 | /umayyad-abbasid-story.html |
| 03 | イスラーム世界の分裂と三カリフ | 7 | /regional-dynasties-story.html |
| 04 | トルコ人の台頭とセルジューク朝 | 9 | /seljuq-story.html |
| 05 | 西方・エジプト・北インドの諸王朝 | 13 | /western-dynasties-story.html |
| 06 | アフリカの諸王国と交易 | 6 | /african-kingdoms-story.html |
| 07 | ティムールの遠征とその後 | 9 | /timur-story.html |
| 08 | サファヴィー | 9 | /safavid-story.html |
| 09 | オスマン帝国 — 建国とバルカン進出 | 9 | /ottoman-story.html |
| 10 | オスマン帝国 — 都の征服とイスラーム世界への拡大 | 8 | /ottoman-expansion-story.html |
| 11 | オスマン帝国 — 最盛期とその後 | 10 | /ottoman-height-story.html |
| 12 | ムガル | 20 | /mughal-story.html |
| 13 | イスラーム文化 | 14 | /islamic-culture-story.html |

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

`npm ci` 後、`npm run check:browser` で全155ページをパソコン幅と携帯幅で確認します。インストール済みのChromeまたはEdgeを使用します。他の場所の実行ファイルは `W_HISTORY_BROWSER` で指定できます。音声の再生は検査開始前に無効化します。詳しくは [名称の表示確認](docs/map-name-coverage.md) を参照してください。

## 原文本文と装飾

全13教材の本文は原文の文章と順序を保ち、囲み・図表・年号まとめの文章化による重複を除いています。原画像の赤太字と黒太字を別の強調にし、画像で確認した読み仮名も表示します。

本文と装飾の対応記録は [原文の再現方針](docs/source-edition/README.md)。再生成は `npm run build:source`、全文と装飾の画面確認は `npm run check:source:browser` です。`sources/` 内の資料は変更しません。
