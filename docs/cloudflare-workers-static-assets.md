# 統合appをCloudflare Workers Static Assetsで公開する

公開する正本は `app/` の1つのSPAです。`app/wrangler.jsonc` はWorker名を `hamura-map-app`、配信する静的ファイルを `./dist`、存在しないパスの処理を `single-page-application` に指定します。Worker entry scriptは追加していません。地図・イベント・投稿・スタンプラリーは同じoriginで動きます。

公開URL：**https://hamura-map-app.academeia.workers.dev/**

Cloudflare Workers deployment成功とスマートフォン実機での基本動作確認は、2026-09-28の運営からの確認報告によります。旧runtimeは削除済みです。PWA/offline最終受入、GAS / Google Sheets実接続、出展者データ統合、複数OS・端末での網羅的な実機試験は未確認です。

Wranglerは `app/package.json` とlockfileに **4.142.0** を固定しています。compatibility dateは同梱workerdで検証する `2026-09-26` です。CloudflareのビルドではこのdevDependencyを含めてインストールしてください。Node.jsは22.12以降を使用します。

## Cloudflare UIの設定

既存Worker `hamura-map-app` の **Settings → Build** で、次の値を設定します。

| 項目 | 値 |
| --- | --- |
| Repository | `mejiro-hamura-project/hamura-map-app` |
| Production branch | `main` |
| Root directory | `app` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

現在はmainをproduction branchとして公開しています。公開するのはビルドされた **`app/dist` のみ**です。WorkersではWranglerの `assets.directory` が出力先を指定するため、PagesのようなBuild output directory欄を別に設定する必要はありません。リポジトリ全体をassetsとして指定しないでください。public内の運営用アイコン対応メモも、Viteがコピーする `.assetsignore` により公開assetから除外します。

この手順の説明は公開作業の実施を意味しません。今回のCodex作業ではCloudflareへの通常deploy・preview deploy、環境変数設定、DNS/domain変更を行いません。

## 任意の環境変数

`VITE_SHEET_WEBHOOK_URL` はViteの **build-time環境変数**です。未設定のままでも登録・取得・景品交換はlocalStorageだけで動きます。空の設定例は `app/.env.example` です。

運営がSheets連携を利用する場合は、CloudflareのBuild variables and secretsで、ビルド時に読める値として設定してから再ビルドしてください。runtime Worker bindingやruntime Secretに置くだけでは、ビルド済みのフロントエンドに反映されません。`VITE_*` の値はフロントエンドの成果物に埋め込まれます。

実際のURLや環境ファイルをGitに含めないでください。今回の作業では実値を設定していません。GASの仕様と既存のキュー再送は [Sheets連携説明](stamprally/sheet-sync.md) を参照してください。

## 公開しないローカル検証

`app/` で実行します。Windowsでnpm.ps1が制限される場合は `npm.cmd` / `npx.cmd` を使います。

```sh
npm ci
npm run build
npm run lint
npm run test:stamprally
npx wrangler deploy --dry-run --outdir .wrangler/dry-run
npx wrangler dev --local
```

`--dry-run` は公開せず設定とbundleを検証します。`.wrangler/` はローカル生成物としてignoreしています。`wrangler dev --local` のURLは通常 `http://localhost:8787` です。終了時はCtrl+Cで停止します。通常の `npx wrangler deploy` は実際にCloudflareへ書き込むため、公開時だけ使用してください。

## New deployment後の確認

ブラウザの新しいprofile/context、またはService Workerを無効にした状態で、以下のURLを直接開き、reloadします。

| URL | 確認する内容 |
| --- | --- |
| `/` | 地図・画像・ナビが表示される |
| `/events` | イベント一覧・タイムテーブルが表示される |
| `/posts` | 投稿画面が表示される |
| `/stamprally` | 未登録は注意事項、登録済みは取得状況へ進む |
| `/stamprally/camera` | 登録済みはカメラ、未登録は注意事項へ戻る |
| `/stamprally/unknown-path` | HTTPでSPAを受信した後、Reactの入口fallbackが動く |

`/stamprally/notice`、`/stamprally/register`、`/stamprally/rally`、`/stamprally/challenge`、`/stamprally/exchange` も直接ロードできることを確認してください。SPA fallbackはサーバーでindex.htmlを返すための設定です。未登録・未完成などによる画面遷移はアプリの既存ガードによるものです。

HTTPだけで確かめる場合の例です。

```sh
curl -i https://<worker>.workers.dev/stamprally/camera
```

深いURLのHTTP成功とindex.htmlの内容、JS/CSS/map画像・注意画像・回答写真の取得、`/manifest.webmanifest` と `/sw.js` の配信を確認します。PWA設定は今回変更していません。SW更新・offlineの最終受入と実機カメラの網羅的な試験は別途行います。

同じoriginの保存キーは維持しています。旧公開先とoriginが異なる場合の進行引継ぎは自動で行われないため、公開切替時に別途確認してください。復元・比較にはGit履歴を使い、開発は `app/` に統一します。

## Cloudflare設定導入時の検証履歴（2026-09-28）

以下は設定導入時点の記録です。後続で公開・スマートフォン基本動作確認・旧runtime削除を実施済みで、現在状態は冒頭を参照してください。

Baseは `origin/main` / `7a5f79db1c05b665dbca1f5220117621106ce5c6`、作業branchは `work/cloudflare-workers-static-assets` です。既存依存のバージョンとアプリ本体、Vite/PWA設定、旧runtimeは変更していません。

| 検証 | 結果 |
| --- | --- |
| `npm ci` / build / lint | PASS。buildでmanifestと単一SWの生成を確認 |
| `npm run test:stamprally` | 6件PASS |
| Wrangler config | 同梱の正式JSON schemaによる検証とWranglerの読み込みPASS |
| `wrangler deploy --dry-run` | PASS。assets directoryは `app/dist`、Wrangler内部のno-op bundleを生成し、upload前に終了 |
| ローカルWorkersのHTTP | 14ルートで200と同じindex.htmlを確認。公開対象33ファイルは元の内容と一致 |
| 隔離ブラウザ | Service Workerをブロックし、主要URLの直接ロード・reload、未知URL、登録済みcameraの模擬拒否・退出を確認。配信エラーなし |
| 公開対象外 | src、repoのdocs、legacy stamp-rally、環境ファイル、運営メモの内容が配信されないことを確認 |

既存のlint警告2件、JS chunkサイズ警告、npmのglob非推奨警告は残ります。Wranglerの設定・ローカル配信に起因する新規warningはありません。初回の依存取得は接続エラー後の再試行で成功し、その後の `npm ci` も成功しました。検証用browserとWrangler processは終了時に停止しています。

Cloudflareの本番・preview deploy、環境変数・DNS/domain変更、実機スマートフォン、PWA/offline最終試験、GAS/Sheets実接続、旧 `stamp-rally/` 削除は実施していません。

## 公式仕様

- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) — JSONC、assets-only Worker、config schema
- [Static Assets SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/) — deep routeのfallback
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) — Root／Build／Deploy、build-time変数
