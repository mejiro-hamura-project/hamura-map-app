# 投稿D1対応 検証記録（2026-10-16）

対象: work/posts-d1-local-v01 / base 6926488306939e30a8baf37e5cb1c7d634be1956。
Node22.15.0 / 同梱Wrangler4.142.0 / Playwright1.64.1 / 専用localhost・隔離Chromium context。

|検証|結果|証跡・範囲|
|---|---|---|
|build|PASS|TypeScript app + Vite + production SW生成。既存の大きなbundle警告あり|
|lint|PASS|exit0。既存DevClockContext/MapProviderContextのFast Refresh警告2件。変更範囲に警告なし|
|Worker型検査|PASS|npm run check:worker|
|Worker unit|PASS|7件。受付OFF/設定欠落/IP欠落/入力/JSON/サイズ/origin/GET/ルーティング|
|既存stamprally unit|PASS|6件。state保存/読み込み等の既存契約|
|local D1 migration|PASS|一時runtime、remote false、--local明示。本番IDなし|
|重複/再送|PASS|逐次再送は同じID、並行6再送は新規1件、内容変更キー409|
|不正/過大入力|PASS|空本文/501文字/不正target/SQL形式target/JSON/9KB/メソッド/cursor/limit/API404|
|サーバー頻度制限|PASS|同一IPの同時10件のうち5件201、5件429、Retry-After60|
|非表示/復旧|PASS|SQL hiddenで一覧から除外、同一キー再送409、visible復旧|
|絞り込み/ページ送り|PASS|75件fixture+7件API保存、13件ずつ82件、重複なし新着順。古い対象も絞り込みで取得|
|ブラウザ/PWA|PASS|別context参照/reload保持/XSSエスケープ/通信エラー/同一key再送/idle無取得/SPA route/SW非表示・APIキャッシュなし|
|終了清掃・最新コードブラウザ再検証|PASS|browser-only 5グループ、exit0。専用runtime削除と関連process不在を確認|
|実機/本番/preview受入|NOT RUN|今回の対象外。本番接続・公開未実施|

## 初回検証で判明し修正した事項

- 既存店舗JSONの完全同一重複store-pink-1でカタログ一意チェックが停止。データ自体は変更せず同一内容を統合、異なる内容の衝突は引き続き停止。
- Wrangler4.142.0は--no-browserを受け付けない。非対話stdio・CI=true・BROWSER=none・--show-interactive-dev-session=falseに変更。
- レビューでDB未接続かつ空の絞り込み結果が200となる不整合を発見し、未接続503へ統一。
- 手動更新後の最新fetchも画面離脱時にabortするようcleanupを調整。

- 結合試験は10グループすべてPASS後、Windowsのworkerd trace-storeロックでcleanupがEBUSYとなりexit1。機能検証成功とプロセス全体の終了失敗を区別。削除retryを追加し、旧runtimeは絶対パスとtemp親ディレクトリを確認して清掃。修正後のbrowser-only試験は5グループPASS・exit0。最新通信キャンセル修正を含むbuildで再検証し、一時runtimeと関連processが残らないことを確認した。

失敗した初回の状態を完了扱いにはしていない。修正後の検査と実D1結合試験の結果を上表に記録する。高件数fixtureはブラウザ試験前に削除し、試験runtimeは終了時に清掃する。

## 実施者と独立レビュー

親agent: 基準選定/隔離worktree/フロント・PWA・共通catalog/文書/統合とdiff確認。
worker posts_backend: Worker/D1/schema/config/unit/型検査。
worker posts_tests: 実ローカルD1+隔離ブラウザの再現可能な結合harnessと実行。
reviewer posts_review: 差分とAPI/DB/フロント/PWA契約を独立確認。最終判定APPROVE、BLOCKER/SHOULD_FIX/OPTIONALなし（終了清掃再検証もPASS）。
使用不能なagent/modelなし。親はコード・SQL・generated SW・検証結果を確認して統合。
