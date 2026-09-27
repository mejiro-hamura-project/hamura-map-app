# Cloudflare公開後のスマホ確認手順

## ビルド設定

| アプリ | Root directory | Build command | Output directory | 環境変数 |
| --- | --- | --- | --- | --- |
| メイン | `app` | `npm run build` | `dist` | `VITE_STAMP_RALLY_URL`：スタンプラリーの公開URL |
| スタンプラリー | `stamp-rally` | `npm run build` | `dist` | `VITE_MAIN_APP_URL`：メインの公開URL |

依存関係は各Root directoryで `npm ci` により導入します。`VITE_SHEET_WEBHOOK_URL` は既存のSpreadsheet同期用で、未設定ならブラウザ内保存で動作します。`VITE_EXHIBITOR_DETAIL_BASE_URL` は正式な `exhibitor_id` が店舗データに入るまで接続には使いません。環境変数の記入例は各アプリの `.env.example` にあります。実URLやWebhook値はリポジトリへ記録しないでください。

Viteの `VITE_*` はビルド時に埋め込まれます。Cloudflare側で値を追加・変更した後は、対象アプリを再ビルド・再デプロイしてください。

## 初回の公開順序

1. 上の設定で両アプリを環境変数未設定のまま一度デプロイし、それぞれの公開URLを取得します。
2. メイン側に `VITE_STAMP_RALLY_URL` としてスタンプラリーのURLを設定します。
3. スタンプラリー側に `VITE_MAIN_APP_URL` としてメインのURLを設定します。`VITE_SHEET_WEBHOOK_URL` は今回設定しません。
4. 両アプリを再デプロイし、相互リンクが入ったビルドを公開します。
5. 同じスマホで次の項目を確認します。

## スマホsmoke test

- [ ] メインのURLが開き、地図が表示される。
- [ ] メインから催し画面へ移動できる。
- [ ] 下部の「スタンプラリー」から実アプリへ同じタブで移動できる。
- [ ] スタンプラリーの初期画面が開き、参加登録からラリー画面へ進める。
- [ ] QRカメラ起動まで進める。
- [ ] 「祭り案内へ戻る」からメインへ移動できる。
- [ ] スタンプラリーへ戻ってリロードしても、登録と進行状況が想定どおり残る。
- [ ] ブラウザの戻る操作で意図した画面に戻れる。
- [ ] 出展者詳細は未実施：正式な `exhibitor_id` 待ち。条件は [出展者詳細への接続条件](exhibitor-link-blocker.md) を参照。
