# CLAUDE.md — 市民祭りデジタルパンフレットアプリ（2026-10-25更新）

このリポジトリで開発する際に参照するプロジェクトガイドです。**現在の実装と残作業は [開発・運用引継ぎ](docs/handover-20261025.md) を優先**し、`docs/`の初期仕様・UIプロトタイプ・旧GAS手順は設計履歴として参照してください。

## 正本と公開境界

- Repository: `mejiro-hamura-project/hamura-map-app`、チーム共通の正本は`main`。
- 動くアプリの正本: `app/`。rootのHTMLや過去のzip/別repoは正本ではない。
- React + Vite + TypeScript + Tailwind + PWA。Cloudflare Workers Static Assets + Worker REST API + D1。
- 通常公開環境は`main`をProduction branchとしてビルドする設定。mainの変更で公開デプロイが動き得る。正式イベント利用の受入とは別。
- ローカル起動: `cd app && npm ci && npm run dev`。build: `npm run build`、lint: `npm run lint`。詳細は[共同開発手順](docs/development-workflow.md)。

## 実装済み機能

- ホーム地図・会場画像・店舗/ブース・イベント/演目・検索・ポップアップ: `app/src/features/map/`、`events/`、`app/src/mocks/`。
- 全画面共通フッター4メニュー: `app/src/App.tsx`、`app/src/shared/ui/BottomNav.tsx`。
- スタンプラリー: `app/src/features/stamprally/`。注意事項→参加登録→QR収集→合言葉→景品交換。進捗は`stampRally.v2`に端末保存。QR7種と5コースを維持。
- 口コミ: `app/src/features/posts/`、`app/src/api/usePosts.ts`。投稿・閲覧・絞り込み・再送重複防止。**「いいね」と写真投稿は採用しない**。
- 共通匿名ID: `app/src/shared/utils/deviceUser.ts`、`app.anonymousId.v1`。口コミ・ラリーは同じUUID v4を使用（ログイン・本人認証ではない）。
- Worker+D1: `app/worker/index.ts`、`app/migrations/0001_posts.sql`／`0002_participants.sql`。口コミとラリー参加・交換日時を扱い、個別スタンプ取得履歴はD1へ送らない。
- **GAS・Google Sheetsへの送信は現行アプリから撤去済み**。旧GAS手順は履歴として残す。
- D1が未接続でも地図・イベント・ラリーは継続利用可能。`POSTS_ENABLED=false`／`RALLY_SYNC_ENABLED=false`が初期設定で、投稿受付・ラリー補助同期は停止。

## アーキテクチャ／作業上の注意

1. 現行の型・命名・データ・UIを確認してから改修し、スタンプラリー本体を不用意に作り直さない。カメラ読み取り、状態保存、PR #7のUI、フッター、進捗復帰の動作を維持する。
2. 地図×スポット×投稿の共通モデル、`MapProvider`、共有タクソノミーとストレージ窓口を使用。ブラウザストレージをfeature内で直接操作せず`shared/storage`を経由する。
3. 現行データは`app/src/mocks/`の店舗・会場・演目・地図資産。`docs/stores.json`や古い仕様書は現行データの正本ではない。QRの印刷と設置位置は別途確認する。
4. 口コミはD1保存が成功したときだけ成功表示。APIは同一origin、`/api/*`をPWAキャッシュ対象外にする。匿名UUIDをHMAC化して頻度制限（60秒5件）、公開APIに秘密・内部キーを出さない。
5. スタンプラリーは端末内で完結させ、補助D1同期は失敗しても利用者を止めない。景品交換の正式管理は現地の紙／Googleフォーム。個別スタンプ履歴のサーバー保存は不要。
6. D1作成・migration・binding・secret・運営非表示・データ保存期限の手順は[現行運用文書](docs/anonymous-id-d1-operations.md)。実secret、DB ID、個人情報、CSV・バックアップをGitに入れない。
7. 共同作業では`app/src/App.tsx`、`app/src/shared/`、`app/vite.config.ts`、`app/wrangler.jsonc`、`app/package*.json`などの共有箇所の変更を明示し、必ず最新mainとの差分を調べる。
8. 原則は最新mainから作業branch→テスト→PR→統合。学生の既存PRのコミットがすでに統合済みなら二重にマージしない。`main`をforce pushしない。
9. 変更後は`npm run build`／`npm run lint`、関連する`test:stamprally`、`test:identity`、`check:worker`、`test:posts:unit`、`test:posts:integration`を適切に実行。成功済みの無関係なテストを無意味に繰り返さない。

## 未完了・運営への引継ぎ

- 大嶋先生のCloudflareアカウントと正式URLの確定、D1実DB接続・migrations・secret・フラグ有効化。
- iPhone Safari／Android Chromeでの画面・セーフエリア・キーボード・実カメラ・PWA更新の受入。
- 長谷川さんのUIの余白・スクロール調整、佐々木さんの地図PNG・店舗／イベント情報、QR設置位置の最終確認。
- 投稿の手動非表示担当、参加者の登録データ保持期間・削除日、実DBからのCSV出力・運用。

## 文書の参照順

1. [開発・運用引継ぎ](docs/handover-20261025.md) — 現在の全体像
2. [D1運用手順](docs/anonymous-id-d1-operations.md) — DB・投稿管理・CSV・削除
3. [統合検証記録](docs/anonymous-id-d1-validation.md) — 検証済みと未検証
4. [共同開発手順](docs/development-workflow.md) — Git・PR・テスト
5. 旧[仕様書](docs/市民祭りアプリ_仕様書.md)・[UIプロトタイプ](docs/市民祭りアプリ_UIプロトタイプ.html)・[初期開発手順](docs/市民祭りアプリ_開発手順書.md)・[元スタンプ仕様](docs/stamp_rally_prompt.md) — 必要時に履歴としてのみ参照
