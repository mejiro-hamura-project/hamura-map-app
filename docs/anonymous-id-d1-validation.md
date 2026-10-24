# 共通匿名ID・D1統一の検証記録（2026-10-25）

対象は `integration/stamp-rally-preview`、開始HEADは `c9b8db5`。fetch後のmainは `aee811a`、PR #7のheadは `8418b78`。どちらも統合ブランチの祖先であり、佐々木さんの地図・店舗・演目変更と長谷川さんのスタンプラリー変更を保ったまま実装している。

## 実装契約

- 共通匿名UUID v4を `app.anonymousId.v1` に保存し、口コミとラリーで共有する。
- ラリーは `stampRally.v2` を使用。旧v1テスト登録は移行せず、画面用参加者番号は従来のcounterで維持する。
- 投稿制限はIPではなく共通IDのHMAC内部キーごとに60秒5件。口コミと参加者テーブルは同一secret・同一HMACで関連付けできる。
- 既存 `0001_posts.sql` を変更せず、`0002_participants.sql` を追加。参加者の公開取得API、個別スタンプの保存、ニックネーム保存は追加しない。
- 登録・交換は端末で先に確定し、最新snapshot一件だけを非同期送信する。通信失敗は進行を止めず、成功JSONの `saved:true` を確認した場合だけキューを消す。
- GAS送信といいね表示を廃止。既存の地図・イベント・投稿先・フッター・進捗復帰を維持する。
- 実Cloudflare D1、GAS、Sheetsには接続しない。運用手順は [共通ID・D1運用手順](anonymous-id-d1-operations.md) を参照する。

## 検証結果

| 検証 | 結果 |
| --- | --- |
| 共通ID unit | PASS、5件。UUID保存・再利用、旧ID非移行、独立ブラウザ、Safari乱数fallback、保存制限時の同page継続 |
| 端末状態・同期 unit | PASS。state 7件、sync 6件。旧v1無視、counter、最新queue、競合、失敗/timeout保持、保存ack確認 |
| Worker型検査 | PASS |
| Worker unit | PASS、12件。ID単位制限、canonical HMAC、snapshot入力、upsert契約、API no-store |
| CSV unit | PASS、3件。Wrangler JSON、引用符/改行/UTF-8、数式文字列の無効化、空/不正結果 |
| app build | PASS。TypeScript/Vite/production SW生成。大きなJS chunk警告あり |
| lint | PASS。既存Fast Refresh警告2件 |
| 実ローカルD1 API | PASS、8グループ。0001のみのDBから0002へupgrade・再適用no-op、ID制限/IP分離/冪等、非表示/再公開、参加者逆順upsert/共有HMAC/validation、絞り込み/ページ送り |
| 隔離Chromium | PASS、browser-only 12グループ・exit0。両利用順の共通ID、独立context、v1無視、reload、最新queue/online再送、persistent profile再起動、既存導線/フッター/進捗、SW非cache、D1なし継続 |
| PWA旧版からの更新 | PASS。旧c9b8db5 build/SWから新版へ同じlocaloriginで更新し、新assetsと共通ID・無関係storageの保持を確認（skipなし） |
| Worker dry-run | PASS。DB bindingなし、POSTS_ENABLED=false、RALLY_SYNC_ENABLED=false、uploadなし |
| 運営削除SQLの日時guard | PASS。未置換・不正日付は対象ゼロ、確認済みUTC ISO日時だけ対象判定 |
| 実機iPhone/Android、実D1、本番 | NOT RUN |

初回full結合試験はAPI8グループ成功後、harnessが番号付き店舗名を検索に入力して候補を見つけられずFAIL。現行検索仕様に合わせ、harnessだけを `spotDisplayName(target.name)` 入力へ修正し、影響するbrowser-onlyの全12グループを再実行してPASS・exit0を確認した。実装コードの失敗としては残っていない。

旧 `c9b8db5` のビルドを専用一時フォルダーへ保存し、PWA更新試験にのみ使用した。通常のブラウザ・既存サーバー・本番DBは使わない。harnessはlocalhost以外のブラウザ通信を遮断し、DB・fixture・ブラウザ・サーバーを終了時に清掃する。

PWA更新は新SW反映後の再読み込みで確認した。開きっぱなしの旧タブを即時強制再読み込みする仕組みは追加せず、実機の更新タイミングは後続受入とする。

今回の追加依存はなく、lockfileは変更していない。QR読み取り自体の仕様変更はなく、全面的な再試験は行わない。

独立reviewerの最終判定はAPPROVE（BLOCKER/SHOULD_FIX/OPTIONALなし）。親agentが実装差分、単体結果、実ローカルD1と隔離ブラウザの結果を確認して統合した。

## 反映と残る受入

検証後に同じ統合ブランチへ通常commit・pushし、既存Previewだけを更新する。mainへは統合PRを作成するが、mergeしない。PR #7のcloseや学生の作業ブランチ変更、本番deployは行わない。実行結果・commit・Preview・PRはこの作業の最終報告に記録する。

運営によるD1作成・binding・secret・受付フラグの設定、実機のカメラ/キーボード/セーフエリア受入は後続作業。匿名UUIDは本人認証ではなく、景品交換の正式記録は現地の紙・Googleフォーム等とする。
