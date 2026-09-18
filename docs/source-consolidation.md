# 書き起こしの統合記録

2026年9月18日、v0.061。全7章の統合版から、編集注・重複ページの説明・照合保留30項目・出典案内を利用者の依頼により削除した。各章の書き起こし本文、ページ番号、「第○回」の見出し、埋め込み画像は保持している。

## 完成ファイル

| 章 | 統合版 | ページ区切り | 回 |
| --- | --- | --- | --- |
| 第1章 オリエント・インドの古代文明 | [transcription.md](../sources/chapter-01_orient-india/transcription.md) | 15〜62 | 第1〜3回 |
| 第2章 古代の地中海世界 | [transcription.md](../sources/chapter-02_mediterranean/transcription.md) | 63〜128 | 第4〜7回 |
| 第3章 古代の東アジア | [transcription.md](../sources/chapter-03_ancient-east-asia/transcription.md) | 129〜180 | 第8〜10回 |
| 第4章 中世ヨーロッパ | [transcription.md](../sources/chapter-04_medieval-europe/transcription.md) | 181〜252 | 第11〜15回 |
| 第5章 東アジア世界の変容 | [transcription.md](../sources/chapter-05_east-asia/transcription.md) | 253〜314 | 第16〜19回 |
| 第6章 イスラーム世界 | [transcription.md](../sources/chapter-06_islamic-world/transcription.md) | 315〜348 | 第20〜21回 |
| 第7章 近代ヨーロッパの幕開け | [transcription.md](../sources/chapter-07_modern-europe/transcription.md) | 349〜480 | 第22〜30回 |

16〜480ページの区切りは465個。15ページは目次から章名と番号だけを補った章扉であり、原書からの書き起こしではない。統合は既存の書き起こし相互の比較に基づく。原書との全面照合は行っていない。

## 旧資料の削除

各章の legacy にあった24ファイルは、削除直前に統合時の記録と内容が一致することを確認し、利用者の指示によりすべて削除した。空のフォルダ7個については、自動承認審査が削除操作を拒否したため残っている。フォルダ内にファイルはない。

## 確認記録

- 編集時の追記を除き、全ページの本文が今回の作業前と一致することを確認した。15ページは編集注の文だけを除いた。
- 第1〜30回の見出しと264ページの埋め込み画像を保持した。共通の目次は変更していない。
- [照合記録](source-consolidation.json)の出典名・旧資料の識別値は過去の統合作業の記録。削除済みのファイルを現在の参照先として示すものではない。
- 統合版・目次・写真は従来どおり公開管理の対象外。
- 検査は npm run check:transcriptions で実行する。本文と見出しの保持、編集時の追記の除去、旧資料24本の削除、残存フォルダが空であることを確認する。
- 既存アプリの本文は変更していない。旧資料の直接照合に代わり、既存の本文・画像照合記録を使って検査する。

全体検査（npm run check）と公開用検査（npm run build）は成功した。別途確認した旧単独検査 scripts/check-timur-source.mjs は、旧構成の場面 central-asian-change を探して失敗する。変更前の処理でも同じ失敗を確認した。現在の教材本文は全体検査内の原文照合で確認している。
