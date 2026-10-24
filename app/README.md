# 市民祭りアプリ（統合app）

現在の実装の正本はこの `app/` です。開発場所・公開URL・関連資料は [repository README](../README.md)、Gitの進め方は [development workflow](../docs/development-workflow.md) を参照してください。

```sh
npm ci
npm run dev
```

PR前は `npm run build` / `npm run lint`、Stamp Rally変更時は `npm run test:stamprally` を実行します。buildの出力は `dist/`、Cloudflare設定は `wrangler.jsonc` です。

運営用QRは `npm run generate:qr` で `qrcodes/` に生成します。生成物・DB ID・secretの実値はcommitしません。口コミとラリーは共通匿名UUIDとD1を使用し、GAS通信は廃止しています。[D1運用手順](../docs/anonymous-id-d1-operations.md) に接続・非表示・CSV出力と個人情報の保持手順を記載しています。
