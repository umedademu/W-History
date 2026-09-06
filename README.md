# W-History

地図と物語で世界史の流れを学ぶ、クリックで進む紙芝居教材です。現在の版は **v0.019** です。

公開先：**https://w-history-one.vercel.app**

保存先：https://github.com/umedademu/W-History

| 番号 | 教材 | 場面数 | ページ |
| ---: | --- | ---: | --- |
| 01 | イスラーム教の成立と正統カリフ | 16 | `/islam-origin-story.html` |
| 02 | ウマイヤ朝とアッバース朝 | 17 | `/umayyad-abbasid-story.html` |
| 03 | 分裂と地方政権の興亡 | 27 | `/regional-dynasties-story.html` |
| 04 | ティムールの遠征 | 13 | `/timur-story.html` |
| 05 | ティムールの、その後 | 16 | `/timur-after-story.html` |
| 06 | サファヴィー朝 | 20 | `/safavid-story.html` |
| 07 | オスマン帝国 | 53 | `/ottoman-story.html` |
| 08 | ムガル帝国 | 22 | `/mughal-story.html` |
| 09 | イスラーム文化 | 22 | `/islamic-culture-story.html` |

入口は `/` の教材一覧です。前後ボタン、左右キー、章・場面番号から移動できます。音声と自動の場面送りはありません。07は53ページで、一時停止や本文の名前からの見直しができます。端末の「動きを減らす」設定では結果を静止表示します。

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
