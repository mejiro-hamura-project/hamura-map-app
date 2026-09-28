# 市民祭りアプリ

地図・イベント・投稿・スタンプラリーを `app/` の1つのWebアプリで開発・ビルドします。スタンプラリーの実装の正本は `app/src/features/stamprally/` です。

```sh
cd app
npm ci
npm run dev
```

`app/` で `npm run build` を実行すると `app/dist/` に出力します。検証は `npm run lint` と `npm run test:stamprally`、運営用QRの生成は `npm run generate:qr` です。QR画像7枚とコース別の文字対応表を含む印刷ページは `app/qrcodes/` に生成され、Gitには含めません。

`VITE_SHEET_WEBHOOK_URL` が未設定でも登録から景品交換まで利用できます。進行状況は同じoriginのブラウザストレージに保存します。任意のSheets連携は [設定説明](docs/stamprally/sheet-sync.md)、ルートと地図の取得表示は [連携説明](docs/integration-notes.md) を参照してください。

`stamp-rally/` はPhase 1・2の比較・復旧用として残しています。今後の機能変更は統合先の `app/` に行ってください。旧ディレクトリの削除、公開originやCloudflare設定の変更、実機・PWA更新の受入はPhase 3で扱います。今回の作業は公開切替を含みません。実装範囲と検証結果は [実装メモ](docs/plans/stamp-rally-unification-v1-implementation-notes.md) に記録しています。
