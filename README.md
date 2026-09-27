# 市民祭りアプリ

このリポジトリには、独立してビルドする2つのWebアプリがあります。

| ディレクトリ | 役割 | Cloudflare の Root directory | Build command | Build output directory |
| --- | --- | --- | --- | --- |
| `app/` | 祭りの地図・催し案内などを表示するメインアプリ | `app` | `npm run build` | `dist` |
| `stamp-rally/` | スタンプラリーアプリ | `stamp-rally` | `npm run build` | `dist` |

各プロジェクトのルートディレクトリで `npm ci` を実行してからビルドしてください。両アプリとも Vite の `dist/` を出力し、リポジトリのルートにあるファイルをビルドに必要としません。

`stamp-rally` は `VITE_SHEET_WEBHOOK_URL` が未設定でもビルドできます。その場合、登録・スタンプ・景品交換のデータはブラウザの `localStorage` のみに保存されます。Google Sheets 連携の設定説明は [stamp-rally/README-sheet-sync.md](stamp-rally/README-sheet-sync.md) を参照してください。今回の統合では、Cloudflare のプロジェクト設定や本番環境変数は変更していません。

相互移動用の `VITE_STAMP_RALLY_URL` と `VITE_MAIN_APP_URL` は、各アプリのビルド時に埋め込まれます。値を変えた場合は再ビルド・再デプロイが必要です。初回の公開順序とスマホ確認項目は [Cloudflare公開後のスマホ確認手順](docs/cloudflare-smoke-test.md) を参照してください。
