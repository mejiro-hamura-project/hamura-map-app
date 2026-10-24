# 市民祭りアプリ

地図・イベント・投稿・スタンプラリーを1つのWebアプリとして提供する、市民祭りアプリの正本repositoryです。チーム共通の正本は `main`、現在の実装の正本は `app/` です。

Cloudflare通常公開URL（Production）：**https://hamura-map-app.academeia.workers.dev/**。イベント正式版の公開可否は別途運営側で判断します。実際の配信commitはCloudflareで確認してください。

従来版のCloudflare公開とスマートフォン実機での基本動作は運営から確認報告があります。2026-10-25の統合版では地図・イベント・口コミ・スタンプラリーを統合し、口コミ／参加登録の保存先をD1へ統一しました。**実Cloudflare D1は未接続**で投稿受付・ラリー補助記録は無効です。統合最新版の実機iPhone／Android、PWA/offline、実D1接続と正式公開の受入は残っています。

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

Stamp Rallyの正式な開発場所は `app/src/features/stamprally/` です。旧runtimeは削除済みで、復元が必要な場合はGit履歴を参照します。リポジトリ直下にあった電卓・おみくじ・ルーレット・タイマーの無関係な試作品は整理し、必要時はGit履歴から参照します。`docs/`内の初期仕様・UIプロトタイプは履歴資料として残しています。

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

**引継ぎの入口は [開発・運用引継ぎ（2026-10-25）](docs/handover-20261025.md) です。** 佐々木さんの地図等（PR #6）、長谷川さんのスタンプラリーUI（PR #7）、共通フッター、共通匿名UUID、口コミ・ラリーD1（PR #8）をmainへ統合します。D1未接続・受付停止が既定で、地図・イベント・ラリーは継続利用できます。[共通ID・D1運用手順](docs/anonymous-id-d1-operations.md) と [今回の検証記録](docs/anonymous-id-d1-validation.md) を参照してください。

GAS通信は廃止しました。共通IDとラリー進行は同じoriginのブラウザストレージへ保存し、登録・交換のD1通信は非同期です。保存先未接続・オフラインでもラリーを続行できます。実DB ID・secret・実データはcommitしません。

Cloudflare Workerは `/api/*` を処理し、その他を `app/dist` の静的配信へ渡します。Production branchは `main`、Root directoryは `app`、Build commandは `npm run build`、Deploy commandは `npx wrangler deploy` です。通常のfeature開発ではCloudflare設定を変更する必要はありません。

- [共同開発の進め方](docs/development-workflow.md)
- [Stamp Rally統合・地図連携](docs/integration-notes.md)
- [共通匿名ID・D1導入・手動管理・CSV出力](docs/anonymous-id-d1-operations.md)
- [旧Sheets連携・GASの履歴](docs/stamprally/sheet-sync.md)
- [Cloudflareの公開構成・検証手順](docs/cloudflare-workers-static-assets.md)
- [Migration Plan（設計履歴）](docs/plans/stamp-rally-unification-v1.md)
- [Phase 1・2の実装履歴と後続状況](docs/plans/stamp-rally-unification-v1-implementation-notes.md)
