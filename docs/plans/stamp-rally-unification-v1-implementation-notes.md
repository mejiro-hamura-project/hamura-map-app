# スタンプラリー統合v1 — Phase 1・2実装メモ

Status: IMPLEMENTED（Phase 1・2。本番公開の受入は含まない）

- 実施日：2026-09-28
- Branch：`work/stamp-rally-unification-v1`
- Base：`origin/main` / `a8c41239415c70f9bc5a207e661070a13ef809ab`
- 計画：`docs/plans/stamp-rally-unification-v1.md`
- 今回の依頼：`codex_stamp_rally_unification_phase1_2.md`。計画内の将来のPhase 3や外部操作を今回の実施指示とは扱わず、今回指定されたPhase 1・2に限定した。

計画のbase以降にmainへ入った変更は計画書のmergeのみで、移植対象のアプリ実装に追加差分はなかった。旧 `work/app-integration-v1` の相互URL方式は取り込んでいない。

## 実装した範囲

単一のapp root／BrowserRouterを維持し、`/stamprally/*` の親Layoutが既存 `useStampRally()` の状態を1回だけ所有する。子画面はOutlet contextを利用する。通常画面はBottomNavを表示し、camera・reveal・exchangeは隠す。resultはexchangeへ移すalias。入場ガード・未知URL・退出リンク・ナビを除いた画面高さを整えた。

| 領域 | 統合先・内容 |
| --- | --- |
| 画面・ロジック | `app/src/features/stamprally/` に8画面、components、hooks、types、5コースを移植 |
| i18n・CSS | 75言語の元ファイルと小学生表示を維持。featureのsectionにlangを設定し、専用の色トークン・selectorで既存appへの影響を抑えた |
| 永続化 | 3つのv1キーと既存の補完／fallbackを維持。shared storageにraw読み書きを追加。既存loadStateをfeature内のstateStorageへ分離 |
| 地図 | sharedのread契約をAppでfeature adapterへ接続。位置1〜7と取得ID1〜35を対応させ、登録の有無で入口／既存cameraへ遷移 |
| カメラ・演出 | 既存読取と判定を維持。startの失敗を再throwしない。StrictModeでstop/clearと次のstartを順序付け、再生開始前の停止競合と退出後のcallbackを防止。演出・長押しタイマーも退出時に解除 |
| 画像・QR | 注意画像を `app/public/stamprally/`、回答写真4枚をfeature assetsへ移植。QR生成は `app/scripts/stamprally/generate-qrcodes.ts` |
| 任意Sheets | 既存payload・キュー再送をshared storage経由で維持。空の `app/.env.example` と統合先の説明を追加 |
| 依存 | QR・confettiのruntime、QR生成用のdev依存を追加。既存appの依存バージョンは変更なし |

データ・翻訳・回答画像・typesの計84ファイルは比較元とバイト単位で一致する。旧 `stamp-rally/`、地図の出展者データ、taxonomy、時計Provider、PWA設定、production設定は変更していない。

## 検証結果

| 検証 | 結果・範囲 |
| --- | --- |
| 移植前のapp | `npm ci` / `npm run build` / `npm run lint` PASS |
| 移植前のstamp-rally | 同3コマンド PASS |
| 統合app | `npm ci` / build（tsc込み）/ lint PASS |
| 保存・位置変換の自動テスト | `npm run test:stamprally` PASS、6件。現行／不足フィールド／破損JSON、全35IDの位置変換、readの再読込、番号とキューの独立性 |
| QR生成 | `npm run generate:qr` PASS。PNG7枚とコース別の文字対応表付きprint.htmlを `app/qrcodes/` に生成 |
| 既存画面 | Home／Events／Postsの直接ロードと移植前後の色・フォント・shell／nav寸法の比較 PASS。会場切替、zoom／pan、検索、タイムテーブル、投稿作成・filterもPASS |
| ラリーの操作 | 注意欄scroll・同意→遊び方→登録→取得→並べ替え→正答写真→交換 PASS。短tap・長押し・cancel／confirm・交換済みreload・result aliasを確認 |
| 保存と地図 | 登録／取得／途中phraseSlots／交換のreload、course 2〜5の取得表示、resetProgress後の地図、resetAll後の番号／キュー継続、小学生コース PASS |
| URL・表示 | 深いURLの直接ロード、入場・途中guard、未知URL、back／forward、BottomNav条件、320／375／420／960px、英語・繁体・簡体・ja fallback・退出後lang PASS |
| QRとカメラの模擬試験 | production／開発StrictModeで生成QRをcanvas映像から実際のhtml5-qrcodeで認識。対象外・重複・位置1/2→ID8/9・再入場・非同期start中の退出・全映像トラック停止 PASS |
| 演出中の退出 | reduced motionを解除してreveal中にホームへ退出。保留タイマーによる再遷移とconfetti canvasの残存なし、取得済みIDを維持 PASS |
| ブラウザエラー・画像 | 上記PCブラウザで未処理エラーなし、画像等の400以上のレスポンスなし。主要画面のスクリーンショットを目視確認 |
| 実機スマートフォン | NOT RUN。iOS Safari／Android Chrome、実カメラ許可・拒否・背面選択・背景復帰・safe-area／キーボードの実測は残る |
| Sheets実送信・外部設定 | NOT RUN。URL未設定での完結を確認。GAS／Sheets／Cloudflareを操作していない |
| SW更新・offline | NOT RUN。PC試験はService Workerをブロックして実施。既存の単一SW生成とmanifest出力はbuildで確認 |

PC試験は一時ディレクトリに置いたPlaywrightと独立Edge context／localhostサーバーで実施し、外部リクエストを遮断した。実利用者のprofile・データは使用していない。終了時に検証browser/context/serverを閉じた。大規模E2E基盤はrepoに追加していない。

既存のapp lint警告2件（MapProviderContext、DevClockContextのonly-export-components）を維持。大きいJS chunkの警告は比較元の旧ラリーにもあり、統合appにも出る。既存のnpm glob非推奨警告と、開発時の翻訳不足→ja fallback警告も修正対象にしていない。警告を隠すための設定変更やaudit fixは行っていない。

## 計画との差分とPhase 3

今回の依頼の範囲に合わせ、計画13章・Phase 2のPWA cache最適化／SW更新／offline検証を後続へ残した。PWAはappの既存設定を維持する。旧hash URLの橋渡し、別originのデータ引継ぎ、旧runtime削除、配信切替も今回追加していない。保存禁止時の既存挙動、別タブ購読、デモreset常時表示、Sheets再送の重複可能性は元仕様を維持する。

Phase 3では次を受入・決定する。

1. iOS／Android実カメラで許可・拒否・重複・連続開閉・背景復帰・退出後の停止を測定する。
2. 実運用originと現利用者の保存形式を確認し、同originでの引継ぎ／別origin時の方針を決める。
3. 管理者がCloudflareの配信方式・SPA fallback・環境変数・旧URL方針を確認し、深いURLのreloadを公開previewで検証する。
4. 単一SWの更新、保存状態付き更新、必要画像cache、offline保証を検証する。
5. Sheetsを利用する場合は承認済み検証endpointでpayloadと再送を確認する。
6. 受入後に独立commitで旧 `stamp-rally/` を削除し、GASコード例と残る旧pathコメントを整理する。

review時は親Layoutの単一状態、全35IDと7位置、3保存キー、ナビとscroll境界、カメラcleanup、旧runtime／本番設定に差分がないことを優先して確認する。
