# 市民祭りアプリ

このリポジトリには、独立してビルドする2つのWebアプリがあります。

| ディレクトリ | 役割 | Cloudflare の Root directory | Build command | Build output directory |
| --- | --- | --- | --- | --- |
| `app/` | 祭りの地図・催し案内などを表示するメインアプリ | `app` | `npm run build` | `dist` |
| `stamp-rally/` | スタンプラリーアプリ | `stamp-rally` | `npm run build` | `dist` |

各プロジェクトのルートディレクトリで `npm ci` を実行してからビルドしてください。両アプリとも Vite の `dist/` を出力し、リポジトリのルートにあるファイルをビルドに必要としません。

`stamp-rally` は `VITE_SHEET_WEBHOOK_URL` が未設定でもビルドできます。その場合、登録・スタンプ・景品交換のデータはブラウザの `localStorage` のみに保存されます。Google Sheets 連携の設定説明は [stamp-rally/README-sheet-sync.md](stamp-rally/README-sheet-sync.md) を参照してください。今回の統合では、Cloudflare のプロジェクト設定や本番環境変数は変更していません。
