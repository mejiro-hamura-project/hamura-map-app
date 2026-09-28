# 市民祭りアプリ

地図・イベント・投稿・スタンプラリーを1つのWebアプリとして提供する、市民祭りアプリの正本repositoryです。チーム共通の正本は `main`、現在の実装の正本は `app/` です。

公開URL：**https://hamura-map-app.academeia.workers.dev/**

Stamp Rallyの一体化とCloudflare Workersへの公開は完了し、スマートフォン実機で基本動作を確認済みです（運営からの確認報告）。PWA/offlineの最終受入、GAS / Google Sheets実接続、出展者データ統合、複数OS・端末での網羅的な実機試験は残っています。

## 主な作業場所

| やりたいこと | 主な場所 |
| --- | --- |
| 地図 | `app/src/features/map/` |
| イベント | `app/src/features/events/` |
| スタンプラリー | `app/src/features/stamprally/` |
| 投稿 | `app/src/features/posts/` |
| 共通UI・型・連携 | `app/src/shared/` |
| QR生成 | `app/scripts/stamprally/` |
| Cloudflare設定 | `app/wrangler.jsonc` |

Stamp Rallyの正式な開発場所は `app/src/features/stamprally/` です。旧runtimeは削除済みで、復元が必要な場合はGit履歴を参照します。rootのHTML・JSXやdocs内のプロトタイプは過去の試作資料です。

## ローカル起動

Node.js 22.12以降を使用します。

```sh
cd app
npm ci
npm run dev
```

WindowsでPowerShellの実行ポリシーにより起動できない場合は `npm.cmd` / `npx.cmd` を使います。

## 最低限の検証

```sh
cd app
npm run build
npm run lint
```

Stamp Rallyを変更した場合は `npm run test:stamprally` も実行します。buildの出力は `app/dist/` です。

運営用QRの生成は別用途です。QR仕様を変更した場合、または印刷用データが必要な場合に `app/` で `npm run generate:qr` を実行します。PNG7枚と5コースの文字対応表付き `print.html` は `app/qrcodes/` に生成され、Gitには含めません。

## Git開発フロー

最新の `main` から作業branchを作り、変更をpushしてPR等で統合します。共有箇所の変更、他の人の変更の取り込み、PR前の検証は [development workflow](docs/development-workflow.md) を参照してください。

## 設定と関連docs

`VITE_SHEET_WEBHOOK_URL` が未設定でも登録から景品交換まで利用できます。進行状況は同じoriginのブラウザストレージに保存します。設定例は `app/.env.example`。実際の環境変数やWebhook URLはcommitしません。

Cloudflare Workers Static Assetsは `app/dist` のみを公開します。Production branchは `main`、Root directoryは `app`、Build commandは `npm run build`、Deploy commandは `npx wrangler deploy` です。通常のfeature開発ではCloudflare設定を変更する必要はありません。

- [共同開発の進め方](docs/development-workflow.md)
- [Stamp Rally統合・地図連携](docs/integration-notes.md)
- [任意のSheets連携・GASコード例](docs/stamprally/sheet-sync.md)
- [Cloudflareの公開構成・検証手順](docs/cloudflare-workers-static-assets.md)
- [Migration Plan（設計履歴）](docs/plans/stamp-rally-unification-v1.md)
- [Phase 1・2の実装履歴と後続状況](docs/plans/stamp-rally-unification-v1-implementation-notes.md)
