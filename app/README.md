# 市民祭りアプリ（統合app）

現在の実装の正本はこの `app/` です。開発場所・公開URL・関連資料は [repository README](../README.md)、Gitの進め方は [development workflow](../docs/development-workflow.md) を参照してください。

```sh
npm ci
npm run dev
```

PR前は `npm run build` / `npm run lint`、Stamp Rally変更時は `npm run test:stamprally` を実行します。buildの出力は `dist/`、Cloudflare設定は `wrangler.jsonc` です。

運営用QRは `npm run generate:qr` で `qrcodes/` に生成します。生成物と環境変数の実値はcommitしません。任意のSheets設定例は `.env.example`、説明は [sheet-sync.md](../docs/stamprally/sheet-sync.md) にあります。
