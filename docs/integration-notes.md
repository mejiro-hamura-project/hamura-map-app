# 統合スタンプラリーと地図の連携

Status: COMPLETED（一体化・旧runtime整理）。現在の実装の正本は `app/src/features/stamprally/` です。旧runtimeは削除済みで、比較・復元にはGit履歴を使います。

統合appの現在の公開URLは https://hamura-map-app.academeia.workers.dev/ です。Cloudflare Workers deployment成功とスマートフォン実機での基本動作確認、後続のサブドメイン変更は、2026-09-28の運営からの確認報告によります。PWA/offlineの最終受入、GAS / Google Sheets実接続、出展者データ統合、複数OS・端末での網羅的な実機試験は未確認です。

## Routerと状態

`app/src/App.tsx` の単一BrowserRouterに以下を登録しています。`StampRallyLayout` が `useStampRally()` を1回呼び、子画面はOutletのcontextから同じ状態と操作を受け取ります。

| URL | 用途 |
| --- | --- |
| `/stamprally` | 未登録ならnotice、登録済みならrallyへ |
| `/stamprally/notice` | 注意事項・同意 |
| `/stamprally/howto` | 遊び方 |
| `/stamprally/register` | 参加登録 |
| `/stamprally/rally` | 取得状況 |
| `/stamprally/camera` | 既存のhtml5-qrcodeで読取 |
| `/stamprally/reveal` | 獲得演出 |
| `/stamprally/challenge` | 合言葉の並べ替え |
| `/stamprally/exchange` | 長押し・確認による景品交換 |
| `/stamprally/result` | exchangeへの互換alias |

未登録で途中画面を開いた場合はnoticeへ戻します。未完成のchallenge、未解答のexchange、location stateのないrevealは元実装のガードを維持しています。未知のfeature内URLは入口へ、全体の未知URLはホームへ戻します。旧HashRouterや別originへの橋渡しは追加していません。

camera・reveal・exchangeではBottomNavを隠し、それ以外では表示します。全画面表示中のヘッダーに祭り案内への退出リンクを設けています。i18nの `lang` はfeature内のsectionに設定し、祭り案内の `html.lang` は書き換えません。

## 地図の位置番号とコース固有ID

5コースと各7文字の正本は `app/src/features/stamprally/data/checkpoints.ts` です。物理QRの値は全コース共通の `stamp-rally-position-1` から `stamp-rally-position-7`。コース固有の取得IDは1〜35です。

`Spot.stampCheckpointId` は物理位置1〜7を表します。たとえばcourse 2で位置1を読んだ取得IDは8ですが、地図では位置1のマーカーを取得済みにします。read adapterは選択中コースの `phraseIndex + 1` と `collectedIds.includes(id)` を対応させます。出展者データやSpotのIDをコースに合わせて変更しません。

## 読み取り契約

共有契約は `app/src/shared/integrations/stampRally/`、実体はfeature内の `integrations/readPort.ts` です。Appで `StampRallyReadProvider` に実体を渡し、QrMarkerとQrPopupは `useStampRallyReadPort()` を使います。shared層はfeatureをimportしません。

read adapterは描画時に既存の保存状態を読み、Reactの進行状態を別に保持しません。ラリーから地図へ戻ると取得・リセットを反映します。未登録や不明なコースは未取得扱いです。別タブの更新を購読する仕組みは今回追加していません。

地図の「カメラで読み取る」は登録済みなら `/stamprally/camera`、未登録なら入口へ遷移します。カメラの読取判定・状態更新は移植した既存実装を使います。

## 保存と運用

3つの保存キーと元のJSON／数値文字列を維持し、共有storageユーティリティ経由でアクセスします。旧originが異なる場合の自動引継ぎは行いません。任意のSheets設定と保全したGASコード例は [sheet-sync.md](stamprally/sheet-sync.md)、実装履歴と残作業は [実装メモ](plans/stamp-rally-unification-v1-implementation-notes.md)、共同開発の進め方は [development workflow](development-workflow.md) を参照してください。

## 旧runtime削除前の棚卸し（2026-09-28）

Base mainは `64da12051962a1bbb817387ab1199ef010b6d1c0`。旧側と統合先を比較し、次を確認しました。

| 対象 | 保全・整理先 |
| --- | --- |
| 8画面・components・hooks・業務ロジック | feature内に移植済み。差分は統合ルート、CSSの適用範囲、shared storage、画面・カメラ・タイマーのcleanup等の既存統合変更 |
| data・75言語の翻訳・回答写真4枚・types | 計84ファイルが旧側とバイト単位で一致 |
| 注意画像・favicon | 注意画像は `app/public/stamprally/app-icon.png`、faviconは `app/public/favicon.svg`。双方とも旧側と一致 |
| GAS / Sheet sync | payload・再送キューはfeature内。旧説明だけにあったGASコード例・設定・確認・終了後の管理手順を `docs/stamprally/sheet-sync.md` に保全 |
| QR生成 | `app/scripts/stamprally/generate-qrcodes.ts` に移植済み。差分はimport先と出力先のみ。生成物8ファイルは既存ignore設定に合わせてGit追跡を解除 |
| `.env.example`・package scripts | `app/.env.example` と `app/package.json` に必要な設定口・起動・build・lint・QR生成を保全済み |
| 独立appのroot・config・README | 統合appのroot・Router・PWA・Cloudflare構成と現行docsに置換済み。独立開発用のserver設定、未使用basic-ssl依存は移植不要 |
| `public/icons.svg` | runtime / HTMLから参照なし。旧テンプレート資産として削除 |

旧側だけに残る必要情報はGAS運用説明の移行で保全しました。旧runtimeのコピーは残さず、Migration文書内の旧path・SHA・当時の検証結果は設計履歴として保持しています。外部 `festival-stamp-rally` repositoryはこの整理の対象外です。

## 削除後の検証（2026-09-28）

| Check | Result |
| --- | --- |
| `npm ci` | PASS |
| `npm run build` | PASS。TypeScript検査、manifestと単一SW生成を含む |
| `npm run lint` | PASS。既存のonly-export-components警告2件のみ |
| `npm run test:stamprally` | PASS、6件 |
| `npm run generate:qr` | PASS。PNG7枚と5コースの文字対応表付きprint.htmlを生成。Git追跡なし |
| `npx wrangler deploy --dry-run --outdir .wrangler/dry-run` | PASS。配信元は `app/dist`、upload前に終了 |
| 旧path依存検索 | PASS。runtime import、script、package、Vite、Wranglerに旧pathなし。MigrationとCloudflare設定導入時の記録内の旧pathは履歴として残る |
| docs・作業場所 | PASS。更新docsのローカルリンク29件とfeatureの実pathを確認 |
| 軽量browser smoke | PASS。ローカルWorkersで `/`、`/events`、`/posts`、`/stamprally`、`/stamprally/camera` の直接ロード・reload、未登録guard、登録済みcameraの模擬拒否・戻るを確認。ブラウザ例外と400以上のasset応答は0件 |

ブラウザ試験は新しいheadless Edge contextでService Workerをブロックし、外部リクエストを遮断した。Wranglerは `dev --local --show-interactive-dev-session=false` で自動ブラウザ起動を無効にして使用し、終了時にcontext・browser・起動したWorkers process treeを停止した。実機カメラやPWA/offlineの最終受入を代替するものではない。

既存のJS chunkサイズ警告・glob非推奨警告、依存監査のhigh 1件はこの整理の対象外で、依存更新やaudit fixは行っていない。Cloudflare本番・preview再deploy、設定変更、GAS / Sheets実接続は行っていない。
