# 共同開発の進め方

## 1. 正本

`mejiro-hamura-project/hamura-map-app` の `main` がチーム共通の正本です。実装は `app/`、Stamp Rallyは `app/src/features/stamprally/` で開発します。各個人の旧repositoryや古いzipを正本として継続しないでください。

## 2. 作業開始

未コミット変更と現在のbranchを `git status` で確認してから、最新mainを基準に作業branchを作ります。既存の変更を勝手に破棄・上書きしないでください。

```sh
git switch main
git pull --ff-only
git switch -c feature/<short-name>
```

`feature/` は機能開発、`fix/` は修正、`work/` は整理や調査などの目安です。prefixを厳格に固定する必要はなく、作業内容が分かる短い名前を使います。`pull --ff-only` が失敗した場合は履歴の違いを確認し、強制resetで解決しないでください。

## 3. 作業範囲

| 領域 | 場所 |
| --- | --- |
| 地図 | `app/src/features/map/` |
| イベント | `app/src/features/events/` |
| スタンプラリー | `app/src/features/stamprally/` |
| 投稿 | `app/src/features/posts/` |
| 共通UI・型・連携 | `app/src/shared/` |

担当者名でコード所有権を固定せず、変更するfeatureと目的を共有します。次の共有箇所は複数featureやビルド・配信へ影響するため、変更前に共有し、PRにも影響範囲を明示してください。

- `app/src/App.tsx`
- `app/src/shared/`
- `app/src/index.css`
- `app/package.json` / `app/package-lock.json`
- `app/vite.config.*`
- `app/wrangler.jsonc`

## 4. 他の人の変更がmainへ入った場合

作業branchを長期間放置せず、必要に応じて最新mainを取り込みます。作業branch上で `git fetch origin` を実行して差分を確認し、`git merge origin/main` または `git rebase origin/main` を選びます。共有中のbranchの履歴を書き換える場合は関係者と相談してください。merge/rebaseのどちらかを絶対ルールにはしません。

conflictは双方の変更内容を理解して解消し、統合後に影響する箇所を検証します。他の人の変更はGitの差分として取り込み、**旧zipや旧repositoryからディレクトリ全体を上書きしないでください**。

## 5. PR前の検証

依存関係を初めて入れる場合、またはlockfileが更新された場合は `app/` で `npm ci` を実行します。基本の検証は次のとおりです。

```sh
cd app
npm run build
npm run lint
```

変更に応じて追加します。毎回すべての検証を行う必要はありません。

| 変更内容 | `app/` で実行するコマンド |
| --- | --- |
| Stamp Rally | `npm run test:stamprally` |
| QR仕様 | `npm run generate:qr` |
| Cloudflare / Wrangler | build後に `npx wrangler deploy --dry-run` |

QR生成物は `app/qrcodes/` に出力し、commitしません。`--dry-run` は公開を行いません。必要に応じて変更画面の表示・操作も確認し、PRには成功・失敗・未実施を分けて記載します。テストの失敗を成功扱いにしないでください。

## 6. mainへの統合

今回の変更だけをcommitし、作業branchをpushします。

```sh
git push -u origin HEAD
```

PR等で変更と検証結果を確認してmainへmergeします。mainへ直接大きな実装を入れないでください。merge後のmainが次の共通基準です。次の作業は再び最新mainから始めます。

## 7. Cloudflare

現在の公開URLは https://hamura-map-app.academeia.workers.dev/ です。Workers Static Assetsで `app/dist` のみを公開します。

```text
Production branch: main
Root directory: app
Build command: npm run build
Deploy command: npx wrangler deploy
```

通常のfeature開発者がCloudflare設定を変更する必要はありません。配信設定や公開作業が必要な場合は担当者へ共有し、[公開構成と確認手順](cloudflare-workers-static-assets.md) を参照してください。

## 8. 環境変数・機密情報

統合PreviewはGASからD1へ移行し、公開フロントエンド用の外部連携URLは使いません。対象Worker環境でDB binding、共通secret、口コミとラリーの受付フラグを設定します。実DB ID・secret・実データをGitやログへ追加しないでください。

[共通ID・D1運用手順](anonymous-id-d1-operations.md) に、ローカル検証、後日の接続、非表示・再公開、JSON/CSV出力、アクセス制限・終了後の削除手順を記載しています。旧GAS文書は履歴として参照します。
