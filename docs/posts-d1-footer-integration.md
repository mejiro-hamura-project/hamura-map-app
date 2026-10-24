# D1投稿・共通フッターの統合記録（2026-10-25）

対象は `integration/stamp-rally-preview`、開始HEADは `d98674e`。D1参照元は専用commit `181f8fc` です。参照元全体をmergeせず、現在のUI・店舗・イベントデータを基準にD1固有変更を移植しました。main・学生の作業ブランチは変更しません。

## 利用者の動作

- 共通下部メニューを注意事項・遊び方・登録・収集・カメラ・獲得演出・並べ替え・景品交換で表示。
- ラリーへ戻ると、未登録は注意事項、収集中は収集、全取得後は並べ替え、解答済み・交換済みは交換画面へ復帰。登録・コース・取得・解答・交換状態の保存契約は維持。
- 地図の「ここの口コミを書く」は現在の投稿先選択と「最近見た店・イベント」のUIを維持。口コミ閲覧は対象別の投稿一覧へのリンクに変更し、地図表示時の投稿取得・周期ポーリングを廃止。
- 投稿は同一origin `/api/posts` を使用し、本文1〜500 Unicodeコードポイントの文字投稿のみ。API保存成功後だけ完了表示。失敗時は入力を保持し、同じ内容の再試行は同じ送信キーを使う。
- 投稿対象とジャンルでサーバー側絞り込み、30件ずつ追加取得、手動更新に対応。
- 「いいね」は準備中で無効。旧GAS保存・いいね通信や端末内だけの成功表示は使わない。写真投稿・管理画面は追加していない。
- D1未接続時は受付停止・保存不可と取得エラーを表示し、投稿を保存できたようには扱わない。地図・イベント・ラリーへの移動は維持。

## API・配信の境界

- 参照元のmigration、入力検証、同一origin検証、送信キー一意制約、非表示・再公開、同一IPの60秒5件制限を維持。共用回線への影響は未受入。
- カタログは現在の `MOCK_SPOTS` に含まれる全会場店舗・ステージ・演目・エリアから作る。スタンプQRを除き、複数ブース店舗は現在の代表IDを使う。異なる対象のID衝突は拒否する。
- `/api` と `/api/*` をWorker優先にし、JSONエラーをSPAへ転送しない。API応答・fetchはno-store、Service WorkerはAPIをNetworkOnlyとしnavigation fallbackから除外。
- 通常のWrangler設定はDB bindingなし、`POSTS_ENABLED=false`。ローカルD1は `wrangler.local.jsonc` または結合試験の一時設定だけで利用。実DB IDや実secretは含めない。
- スタンプラリーの任意Sheets連携 `VITE_SHEET_WEBHOOK_URL` と保存キーは変更していない。今回の検証では外部連携を未設定にする。
- Previewは既存名 `stamp-rally-preview` のみを使用。`previews: {}` は前回公開時に必要だった同じ設定。Production deployment、Preview Base、リモートD1・secret・環境変数は変更しない。

## 再現コマンド

`app/` で依存導入後に実行する。結合試験は一時ローカルD1・専用localhost・隔離headless Chromiumを使い、終了時に清掃する。通常のChrome/Edgeや既存開発サーバーは使わない。

```sh
npm ci
npm run build
npm run lint
npm run test:stamprally
npm run check:worker
npm run test:posts:unit
npm run test:posts:integration
```

## 今回の検証結果

| 検証 | 結果・範囲 |
| --- | --- |
| npm ci | PASS。lockfile通りに導入。audit報告は9件（low 1/high 8）。依存の一括更新・audit fixは対象外で未実施 |
| npm run build | PASS。アプリTypeScript/Vite/production SW生成。既存の大きなJS chunk警告あり |
| npm run lint | PASS。既存Fast Refresh警告2件。結合harnessも個別lint PASS |
| npm run test:stamprally | PASS、6件 |
| npm run check:worker | PASS |
| npm run test:posts:unit | PASS、9件。現行投稿対象の網羅・ID衝突防止を含む |
| ローカルD1 API | PASS、6グループ。migration、冪等/並行再送、入力/ルート、並行60秒5件、hidden/re-show、絞り込み/ページ送り |
| 隔離Chromium | PASS、browser-only 11グループ・exit0。保存/別context/reload、いいね無効/XSS、地図導線/URL絞り込み、失敗保持/再送、全route footer、進捗復帰、fake camera track停止、480px到達性、SW非cache/hidden反映、D1なし503/UI継続 |
| Worker dry-run | PASS。ASSETSとPOSTS_ENABLED=falseのみ。DB未接続、upload前に終了 |
| 実機iPhone/Android・実カメラ・本番D1 | NOT RUN |

初回full結合試験はAPI6グループ通過後、テストが番号付きの店舗名全体を検索に入力して候補を見つけられずFAIL。現行の店名検索仕様に合わせ、harnessだけを表示名入力へ修正しました。成功済みAPI大量データ試験を繰り返さず、影響するbrowser-only全体を再実行し11グループPASS・exit0を確認。未解消の試験失敗としては残していません。

ブラウザは専用headless Chromium/context、サーバーはWranglerの非対話ローカル起動、DBとfixtureは専用一時runtimeを使用。大量fixtureはブラウザsmoke前に削除。外部HTTP(S)は遮断・失敗扱いとし、実GAS/Sheetsへのテスト送信はありません。終了時にbrowser/server/runtimeを清掃します。

過去のD1参照元検証は [履歴](posts-d1-validation.md) に分離しています。Preview反映結果と対象commitは作業の最終報告で確認してください。既存の公開先は https://stamp-rally-preview-hamura-map-app.academeia.workers.dev/ です。

独立reviewerの最終判定はAPPROVE（BLOCKER/SHOULD_FIXなし）。親agentが差分・ビルド・ローカルD1/隔離ブラウザ結果を確認して統合しました。

## 後続の受入・運用作業

- 大嶋先生のアカウントでD1・bindingを準備し、対象環境を確認してmigrationとsecret設定を行い、最後に受付を有効化する。今回の作業では行わない。
- 会場共用Wi-Fi/NATで60秒5件を利用者が共有する影響を受入確認する。制限値は今回変更しない。
- iPhone/Android実機のセーフエリア、キーボード、実カメラ権限・解放を確認する。
- 90%高さのPageContainerや全画面デザインは維持。狭い画面の余白・スクロールの調整は長谷川さん側の後続作業とし、到達不能な主要操作だけを今回の検証で切り分ける。
