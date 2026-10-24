# 投稿D1対応・ローカル実装引継ぎ

2026-10-25追記: 統合ブランチ `integration/stamp-rally-preview` へD1固有変更を移植。現行UI、全会場のSTORE_SPOTS・ステージ・演目・エリアを共通投稿対象に使用します。複数ブース店舗は現行の代表IDに統一し、地図と投稿先の対応を維持します。旧GAS投稿連携は廃止し、同一originの `/api/posts` を使用します。共通フッターを全画面に表示します。今回の変更・検証結果は [統合記録](posts-d1-footer-integration.md) を参照してください。

以下は初期D1実装時の契約・導入手順です。ブランチ位置や旧店舗データの説明は2026-10-16時点の履歴であり、現在の統合状態を示しません。

## 範囲と基準

本番接続・公開・preview deploy・remote D1操作は未実施。運用担当による本番導入と実機受入が必要。

- 作業ブランチ: `work/posts-d1-local-v01`
- base: `origin/work/sasaki-map` の `6926488306939e30a8baf37e5cb1c7d634be1956`
- 開始時main: `97da8dec5084c624447fa20e1124da239794eaee`
- PR #6（work/sasaki-map → main）は開始時OPEN、本文なし。
- mainはbaseの祖先。最新の匿名テキストUI、ジャンル、ブース店舗、特殊区画を保持するため開発ブランチを選定。
- 元のworktree/mainには書き込まず、隣接する専用worktreeで実装。開始後の他者変更は取り込まない。

## 利用者の動作

投稿画面表示時、絞り込み変更時、手動更新、投稿成功時のみ同一originのAPIを呼ぶ。周期ポーリングなし。30件ずつ「もっと読む」で取得。店舗とジャンルはSQLのLIMITより前に絞り込む。ジャンル内はOR、店舗内はOR、両者間はAND。

投稿先は地図Spot（stamp-qr除外）と既存の`store-${style}-${code}`店舗IDを共通カタログで解決する。既存データの完全同一な重複店舗は投稿カタログ内で一つにまとめる。異なる対象でIDが重複した場合は起動時に停止し、誤紐付けを防ぐ。名称やジャンルはクライアントの入力を信用せずカタログから解決する。現行店舗データは第1会場のみであり、別会場店舗追加時はID体系の再評価が必須。

本文は1〜500 Unicodeコードポイント、テキスト表示のみ。サーバーがIDと日時を生成。保存エラー時は入力を保持し、同一内容の再試行には同じUUID送信キーを利用する。連打を無効化し、サーバー側も同じキーを一意制約で保護する。成功時は条件を解除して新着に戻り、投稿内容を確認できる。元のモック投稿は一切移行しない。

「いいね」は準備中表示で無効化。永続化される数字を装わない。地図口コミ欄は対象別投稿一覧へのリンクに変更し、地図表示時の取得を廃止。その他の地図操作とGAS/Sheetsスタンプラリー契約は変更しない。

APIレスポンスとブラウザfetchはno-store。Service Workerは/apiと/api/*をNetworkOnlyとし、SPA navigation fallbackからも除外。既に表示中の画面はpush更新されないため、非表示は次回更新/画面表示で反映。ネットワーク切断時の再取得で古い投稿一覧を復活表示しない。

## ローカルのみの起動

`app`内で依存導入・build後、ローカル限定設定を使う。

```powershell
npm ci
npm run build
# .dev.varsに32文字以上のランダムなPOST_RATE_LIMIT_SECRETを設定（Git除外）
npx wrangler d1 migrations apply DB --local --config wrangler.local.jsonc
npx wrangler dev --local --config wrangler.local.jsonc --ip 127.0.0.1 --port 8787 --show-interactive-dev-session=false
```

同梱Wranglerは--no-browser非対応のため、テストは非対話stdio・CI=true・BROWSER=none・--show-interactive-dev-session=falseでブラウザ自動起動を抑止する。

既定のwrangler.jsoncはDB未接続、POSTS_ENABLED=false。地図等の配信は維持する。API未設定時はJSONの503を返す。ローカル設定には本番DB IDを含めない。開発Vite単体にはAPIがないため、投稿検証にはbuild+Wranglerを使用。

## 連投制限と本番有効化の条件

サーバーでCloudflareのCF-Connecting-IPをHMAC-SHA256化し、D1にhashだけを保存。生IPやsecretを保存・ログ出力しない。1IPあたり直近60秒間の新規保存を5件に制限する。非表示投稿もカウントする。COUNTとINSERTは単一SQL、INSERTと再送照会はD1 transactional batchで実行し、並行処理で上限を突破させない。429にはRetry-After:60。同一送信キーの同一投稿の再送は件数を増やさない。hidden投稿の再送は409、再公開しない。

追加の有料rate limiter bindingは不要。分散IP攻撃を防ぐものではなく、会場Wi-Fi/NATでは利用者間で上限を共有する。実環境のアクセス量に応じた受入と制限値評価が必要。CF-Connecting-IPの信頼境界はCloudflare直結Workerであり、別の公開プロキシを挟む場合は保証を再確認する。

DB binding、migration、十分な長さのsecret、POSTS_ENABLED=trueがそろわなければ受付OFF。IPヘッダー欠落でも拒否。本番で条件を満たす前にtrueへ変更しない。secretローテーションはhashを変え、既存IPの60秒制限を引き継がないため、受付停止中に行う。

## 運営SQL（D1コンソール、対象DBを確認）

対象DBと投稿ID・本文・日時をSELECTで確認し、IDの完全一致で1件だけ操作する。以下の`確認済み投稿ID`は実値へ置換する。通常運用でDELETEしない。復旧は再公開なので責任者が内容を再確認する。request_key/author_hashは公開・共有しない。

```sql
SELECT id, spot_id, caption, created_at, status FROM posts
ORDER BY created_at DESC, id DESC LIMIT 50;
SELECT id, spot_id, caption, created_at, status FROM posts
WHERE id = '確認済み投稿ID';
UPDATE posts SET status = 'hidden'
WHERE id = '確認済み投稿ID' AND status = 'visible';
SELECT id, status FROM posts WHERE id = '確認済み投稿ID';
-- 復旧（再公開の承認後のみ）
UPDATE posts SET status = 'visible'
WHERE id = '確認済み投稿ID' AND status = 'hidden';
```

## 本番導入時にのみ必要な作業（今回未実施）

1. 統合とローカル再検証、Cloudflareの自動build/branch deploy設定確認。今回の作業ブランチをpreview対象にしない。
2. 運用担当が対象アカウント・環境を確定しD1を作成。実DB IDとbinding DBをその環境の設定に登録。ローカル設定をdeployしない。
3. 受付OFFのまま対象DBへmigrationを適用。migrationとDB binding、静的SPA、GET一覧を確認。既存モックは投入しない。
4. ランダムsecretをCloudflare secret POST_RATE_LIMIT_SECRETとして設定。ソースや共有文書へ記録しない。
5. 受付OFF、異常入力、非表示・復旧、rate limit、二重送信、別端末、PWAアップデートを本番相当環境で受入。
6. 運営の監視・非表示担当を確定してからその環境でPOSTS_ENABLED=trueを設定。課金/公開設定は別途許可された担当者が行う。
7. 停止/ロールバックは最初にPOSTS_ENABLED=false。DBを削除せずデータを保全する。必要なら前版Worker/フロントへ戻すが、前版モック投稿が表示される点に注意。schemaを破壊的に戻さない。

## 後日の統合

統合直前にfetchし、その時点のorigin/main、origin/work/sasaki-map（PR #6）、本ブランチを比較。base以降の本変更のみのdiffと、mainからのUI開発差分を別々に確認する。本ブランチには未マージの投稿UI/地図開発履歴も含まれるため、そのままmainへ適用するとUIブランチ全体も統合される。先にUIを統合するか、baseから本変更だけをcherry-pickするかを統合担当が決める。自動mergeなし。

競合候補: PostsScreen、PostCreateSheet、FeedItem、HomeScreen、SpotPostList、usePosts、vite.config、wrangler設定、package/lock。依存: mocks/spots、areaSpots、storesとJSON、taxonomy/GENRES、Spot型とstoreSpotId。店舗ID/ジャンル更新時にはWorkerとフロント両方の共通カタログを確認。

変更が入った範囲に応じてbuild/lint/Worker型検査、API入力/並行投稿/非表示、対象別ページ送り、PWA offline、地図/イベント/スタンプラリールート、別context再読込を再実施。変更のない広いテストを繰り返す必要はない。戻す場合は今回の専用commitだけをrevertし、UI開発コミットを巻き戻さない。

## 公式仕様確認

同梱Wrangler 4.142.0を維持。run_worker_firstは/apiと/api/*だけを指定し、静的アセット全体をWorker経由にしない。

- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/d1/best-practices/local-development/
- https://developers.cloudflare.com/d1/reference/migrations/

検証は`npm run test:posts:unit`、`npm run check:worker`、`npm run test:posts:integration`で再現できる。ブラウザ試験初回は`npx playwright install chromium`が必要。結合試験は一時DBへmigrationを適用し、サーバー・ブラウザ・runtimeをfinallyで清掃する。高件数fixtureはAPIページ送り試験だけに使用し、ブラウザsmoke前に取り除く。

検証結果はposts-d1-validation.mdに記録する。実機・本番受入はNOT RUN。


## 今回の変更ファイル（baseからの差分）

- Worker/API/schema: `app/worker/index.ts`、`app/worker/tsconfig.json`、`app/migrations/0001_posts.sql`
- 共通対象/取得: `app/src/shared/postTargets.ts`、`app/src/api/usePosts.ts`
- 投稿画面: `app/src/features/posts/PostsScreen.tsx`、`components/PostCreateSheet.tsx`、`FeedItem.tsx`、`PostCreateFab.tsx`、`PostFilterFab.tsx`
- 地図口コミ導線: `app/src/features/map/HomeScreen.tsx`、`components/SpotPostList.tsx`
- 設定: `app/wrangler.jsonc`、`app/wrangler.local.jsonc`、`app/vite.config.ts`
- 検証/依存: `app/worker/index.test.ts`、`app/scripts/posts/integration.ts`、`app/package.json`、`app/package-lock.json`（Playwrightテスト依存のみ追加、既存依存の更新なし）
- 記録: `docs/posts-d1-local-handoff.md`、`docs/posts-d1-validation.md`
