# Stamp Rally Unification v1 Migration Plan

## 1. Goal

`app/` を唯一のアプリケーションシェルとし、独立した `stamp-rally/` の業務機能を `app/src/features/stamprally/` に移す。最終形は単一のWebサイト、React root、BrowserRouter、ビルド、PWAとする。URLリンクで2アプリを維持する形やiframeは採用しない。

**この成果物は調査・設計・計画のみ。以下の変更案と検証は将来の実装作業用であり、今回実施したものではない。** アプリ実装、依存追加・更新・インストール、Cloudflare設定、GAS／Sheets変更、旧アプリ削除、望月版／出展者データ変更、Issue作成、mainへのmergeは行わない。

### 調査開始時の記録

| 項目 | 記録 |
| --- | --- |
| 調査日 | 2026-09-28（Asia/Tokyo） |
| Repository | `mejiro-hamura-project/hamura-map-app` |
| main取得 | `git fetch origin main` 成功。取得時のlocal mainとorigin/mainは同一 |
| Base main SHA | `3e2099a37eb7de49eb0bf1ea1fe921d6ce981aa7` |
| 開始時branch／作業ツリー | `main`、`git status --porcelain=v1` は空（clean） |
| 計画branch | `work/stamp-rally-unification-plan`。取得したorigin/mainから作成 |
| 変更を許可された範囲 | 本計画と必要最小限の計画文書のみ。本作業では本計画1ファイル |
| ローカル環境 | Node `v22.17.0`、npm `10.9.2`、両アプリにnode_modulesなし |

### 関連ルール・仕様・既存計画

- [CLAUDE.md](../../CLAUDE.md)：既存ラリーの内部ロジックを作り替えない、単一の状態、地図は読み取り用I/F経由、ストレージは共有ユーティリティ経由、共通taxonomyを維持。
- [仕様書](../市民祭りアプリ_仕様書.md)：4タブ、7か所のQR表示と取得状況の同期、通常のスマホWebから利用可能。
- [開発手順書](../市民祭りアプリ_開発手順書.md)：M0〜M7、M3の地図連携、M6のPWA・品質。本計画のPhaseはこのマイルストーン番号とは別。
- [integration-notes.md](../integration-notes.md)：独立ラリーの調査記録。ただしチェックポイント／QRの説明は現コードより古い（3章参照）。
- [stamp_rally_prompt.md](../stamp_rally_prompt.md)：元仕様。登録項目・QR値・表示順・交換操作等は現コードと差があり、今回の互換基準は実コード。
- [root README](../../README.md)、[Sheet連携説明](../../stamp-rally/README-sheet-sync.md)：現在の独立ビルドと任意のGAS連携。両アプリのREADMEは主にViteテンプレート。
- Repositoryおよび確認した祖先ディレクトリに適用対象の `AGENTS.md` は見つからなかった。既存branch例 `work/integrate-sasaki-hasegawa-20260927` に合わせ `work/` を使用。

## 2. Current Architecture

| 観点 | `app/` | `stamp-rally/` |
| --- | --- | --- |
| React entry | `src/main.tsx`：StrictMode → App | `src/main.tsx`：StrictMode → I18nProvider → App |
| Router | `src/App.tsx` のBrowserRouter、4ルート | `src/App.tsx` のHashRouter、AppLayout配下の8画面＋redirect |
| Provider | DevClockProvider → MapProviderRoot | AppLayoutでuseStampRallyを1回呼びOutlet contextに渡す |
| 画面構成 | `features/map`、`events`、`posts`、`stamprally` | `screens/`、`components/`、`hooks/`、`data/`、`i18n/`、`lib/`、`types.ts` |
| スタンプ受け皿 | `features/stamprally/StampRallyScreen.tsx` はPlaceholderScreenのみ | 注意事項→遊び方→登録→収集→獲得演出→並べ替え→交換を実装 |
| 地図連携 | `shared/integrations/stampRally/` にReadPortと常にnullを返すplaceholder。QrPopupのカメラボタンはdisabled | 公開読み取り関数なし。状態はuseStampRally内 |
| データ/API | `src/api/useMaps.ts`、`useSpots.ts` 等はモックを約200ms後に返す。`mocks/data/` のJSON、共通型・taxonomy・map抽象化あり | 5コース、共通QR7種類、年齢検証、localStorage、任意のsheetApi |
| UI shell | 中央max幅420px、h-dvh、flex-column、常時BottomNav | PageContainerが各画面でh-dvh、最大420px、独自footer。カメラは黒背景 |
| Build | `tsc -b && vite build`、dist。React/Tailwind/PWA plugin | 同じbuildコマンド／dist。React/Tailwind plugin、base `./`、端末確認用host設定 |
| PWA | VitePWA、autoUpdate、dev有効、仮SVG icon、start_url `/` | manifest／Service Worker／PWA pluginなし |
| TS／Lint | ES2023、bundler、vite/client、未使用検出、JSON import有効。oxlint | 同様、JSON import設定なし。oxlint設定は同一 |
| Assets | public/maps、public/icons、favicon.svg | src/assets/answersのJPEG4枚、publicのPNG／SVG3件 |

`app/src/shared/` はtypes、taxonomy、map、storage、ui、context、utils、integrationsに分離済み。現在のpostsは画面内stateで、ラリー登録とUser／投稿者を結び付ける認証機能はない。今回その統合は行わない。

TypeScript strictはCLAUDE.mdの方針だが、両tsconfigに `strict: true` の明示はない。今回の計画で既存設定を「strict有効」と扱わず、移植と全アプリのstrict化を同時に行う前提にも置かない。

## 3. Findings

| Finding | 実コード根拠 | 移行への影響 |
| --- | --- | --- |
| appは機能分割されたシェルだがラリーは未接続 | `app/src/App.tsx`、`features/stamprally/StampRallyScreen.tsx`、`shared/integrations/stampRally/placeholderPort.ts` | 配置場所と入口はある。nested routes、state、CSS、assetsの受け入れ処理は新たに必要 |
| 7地点と取得IDは同義ではない | `stamp-rally/src/data/checkpoints.ts`：5コース、IDは `(courseNumber - 1) * chars.length + i + 1`、QRは `stamp-rally-position-1`〜`7` | course2の1地点目は取得ID8。地図のID1と単純比較できない |
| 古い連携メモのCHECKPOINTS／STAMP_01は現仕様ではない | 同ファイルはCOURSES、STAMP_QR_VALUESとcourseId引数付き検索をexport | 古いメモからデータやQRを再生成せず、現在の関数と値を移す |
| Routerを丸ごと入れると二重になる | ラリーAppがHashRouterを生成、各画面が `/rally` 等の絶対パスに遷移 | HashRouterを廃止し、すべての遷移先を `/stamprally/...` に変更 |
| 画面高さの二重確保 | app shellとPageContainerが双方h-dvh、双方footerを持つ | ナビを表示する画面は残り高さにPageContainerを収める必要 |
| 色token名に現時点の重複なし。ただしbodyは競合 | 両index.css：appの `#f4f4f1/#2b2f36` とラリーの `#f7f3ec/#2f2a24` | CSS全文連結は不可。共通baseとfeature側の背景・文字色を分離 |
| 翻訳Providerがグローバルへ書く | `i18n/context.tsx` が `document.documentElement.lang = locale` | feature配下へ置くだけでは日本語の地図にlangが漏れる |
| state以外にも保存キーあり | useStampRallyのparticipantCounter、sheetApiのsheetSyncQueue | 3キーを維持。resetはカウンターやキューを消さない |
| 同一キー維持だけでは別ドメインへ引継げない | storageがブラウザlocalStorage、サーバーからの復元なし | 公開origin確定がリリースの前提。7章参照 |
| Sheets説明やコメントに旧仕様が残る | useStampRally.exchangePrizeのコメントとExchangeScreen実処理が不一致。sheetApiは登録5項目と旧イベント、READMEのGASは旧イベントを無視 | 実挙動を基準とする。交換はローカル確定で送信結果を待たない |
| appの.env保護が不足 | `app/.gitignore` は `*.local` のみ。ラリー側は `.env` を明示除外 | 設定例移動と同時にapp側.env除外を整える。実値は移植しない |
| 端末テスト設定は自動移植不要 | basic-sslは依存にあるがvite.configで未使用。host／allowedHosts設定は独立開発用 | 必要なHTTPS検証方法だけ継承し、独立サーバー設定は捨てる |

`isCheckpointCollected()` は同期的な読取で購読を持たず、現在は必ずfalseになる。統合後の最小要件はラリーから地図へ戻った時の再読取。別タブ等の継続購読は状態の二重管理を増やさず別途判断する。

## 4. Target Architecture

**Recommended：appを統合先にする。** 既存4タブ、BrowserRouter、map抽象化、共通taxonomy、API／mock境界、PWAをそのまま土台にし、ラリーの業務ロジックのみfeatureへ適合する。共通ツールチェーンはappの方が新しく、別のシェルを再構築する必要がない。

| Alternative | Reason（不採用理由） |
| --- | --- |
| stamp-rallyをシェルにして地図等を移す | feature／shared分離、BrowserRouter、BottomNav、map／clock Provider、PWAを再導入する範囲が大きい |
| 新しい第3アプリを作る | 既存のmapや共通層を再配置し、build／設定を再作成する。安全性の利点がコードから確認できない |
| 2アプリ＋リンク／iframeを残す | 単一Router／サイト／PWAの目的を満たさず、stateとカメラ導線の問題が残る |

予定構成（`*` は新設・置換対象の例）：

```text
app/
  package.json / package-lock.json / vite.config.ts / index.html
  .env.example *
  scripts/stamprally/generate-qrcodes.ts *
  qrcodes/                       # 生成物・gitignore対象
  public/stamprally/app-icon.png *
  src/
    App.tsx                     # 唯一のルート宣言
    features/
      map/ events/ posts/       # 既存機能を維持
      stamprally/
        StampRallyLayout.tsx *  # I18nProvider + 1つのuseStampRally + Outlet
        RootRedirect.tsx *
        routes.ts *            # feature絶対URL定数
        stamprally.css *
        screens/ components/ hooks/ data/ i18n/ lib/ assets/ types.ts
        lib/stateStorage.ts *   # 保存形式の復元／読取を再利用
        integrations/readPort.ts *
    shared/
      storage/storage.ts        # raw操作の小さな共通APIを追加
      integrations/stampRally/   # 地図に公開するread契約
      ui/BottomNav.tsx
      map/ context/ types/ taxonomy/ utils/
docs/stamprally/sheet-sync.md *
```

実行階層：StrictMode → BrowserRouter → DevClockProvider → MapProviderRoot → app shell。通常画面は既存4タブ、`/stamprally` の親RouteだけがStampRallyLayoutを生成する。子画面は直下のOutletから既存 `UseStampRally` を受け取る。カメラ等でナビ表示が変わっても親Routeは交換せず、stateの再生成を避ける。

app側はルート、build、共通層、map連携を担当し、ラリー側はfeature内の画面、state、翻訳、QR判定、交換を担当できる。不要なroot state管理ライブラリや新しいRouterは追加しない。

## 5. Migration Mapping

表中の移行元は `stamp-rally/` 相対、移行先の `feature/` は `app/src/features/stamprally/`。分類は責務単位であり、移植ファイルにもimport／遷移先の機械的変更はある。

| 分類 | 実ファイル／責務 | 移行先／扱い |
| --- | --- | --- |
| 移植 | `src/screens/NoticeScreen.tsx`、`HowToPlayScreen.tsx`、`RegisterScreen.tsx`、`RallyScreen.tsx`、`CameraScreen.tsx`、`StampRevealScreen.tsx`、`PhraseChallengeScreen.tsx`、`ExchangeScreen.tsx` | `feature/screens/`。8画面の順序、登録検証、カメラ、演出、並べ替え、長押し交換を維持 |
| 移植 | `src/components/Button.tsx`、`Header.tsx`、`StampGrid.tsx`、`StampFlyOverlay.tsx` | `feature/components/`。feature専用UIとして保持、shared UIへ無理に統合しない |
| 移植 | `src/hooks/useStampRally.ts`、`useLongPress.ts` | `feature/hooks/`。状態遷移は保持、ストレージ操作だけ共通窓口へ |
| 移植 | `src/data/checkpoints.ts`、`answers.ts`、`ageValidation.ts`、`answerImages.ts` | `feature/data/`。5コース・7位置QR・2つの小学生向けコースを維持 |
| 移植 | `src/i18n/index.ts`、`I18nContext.ts`、`useI18n.ts`、`useDisplayMessages.ts`、`elementaryMode.ts`、`locales/*.ts`（75ファイル） | `feature/i18n/`。glob相対構造、ja fallback、小学生表示を維持 |
| 移植 | `src/lib/random.ts`、`src/types.ts` | `feature/lib/random.ts`、`feature/types.ts`。汎用User型へ登録型を混ぜない |
| 移植 | `src/assets/answers/*.jpg`（4枚） | `feature/assets/answers/`。answerImagesの相対importを維持 |
| 統合・書換 | `src/App.tsx` のAppLayout／RootRedirect／Route | LayoutとRootRedirectをfeatureへ抽出、Route宣言はapp/Appに統合。HashRouter部分は廃止 |
| 統合・書換 | `src/components/PageContainer.tsx` | feature側に残し、h-dvhを親の残り高さに従うflex／h-fullへ。max幅420px、内部scroll／footerを維持 |
| 統合・書換 | `src/components/DemoResetButton.tsx` | featureだけに表示。reset後の遷移先をprefix付きへ。常時表示という現仕様を維持 |
| 統合・書換 | `src/i18n/context.tsx` | feature親に配置し、html.lang変更をfeature wrapperのlang属性へ置換 |
| 統合・書換 | `src/index.css` | Tailwind入口／共通baseをappに集約。token、scanner、staff、animationは9章の境界で移す |
| 統合・書換 | `src/lib/sheetApi.ts`、`.env.example` | sheetApiをfeatureへ、設定例をappへ。3保存キー・payload・任意送信を維持。shared storage経由へ |
| 統合・書換 | `scripts/generate-qrcodes.ts`、`package.json` のgenerate:qr | `app/scripts/stamprally/`。import先／生成先とnpm scriptだけ変更。QR値を変えない |
| 統合・書換 | `public/app-icon.png` | `app/public/stamprally/app-icon.png`。NoticeのBASE_URL参照を変更 |
| 統合・書換 | `README-sheet-sync.md`、`.gitignore` | 説明を `docs/stamprally/sheet-sync.md` へ。appに.env／qrcodes除外を統合 |
| 統合・書換 | package／lock／TS／oxlint／Viteの必要設定 | appの設定を正本に依存だけ追加。独立設定ファイル自体は残さない |
| 廃止 | `src/main.tsx`、HashRouter、独立App root、`index.html` | React root／HTML entryはappの1個に統一 |
| 廃止 | `vite.config.ts`、`tsconfig*.json`、`.oxlintrc.json`、`package.json`、`package-lock.json`、独立build／preview | appへ必要項目を統合後、独立runtimeとともに削除 |
| 廃止 | `public/favicon.svg`、`public/icons.svg` | 現ソース／HTMLからicons.svgの参照なし。faviconはapp既存を使用。実装時に全参照再検索してから削除 |
| 廃止 | テンプレート `README.md`、生成dist／node_modules／qrcodes | 運用説明・印刷生成物を保全してから旧ディレクトリごと削除。生成物は再生成可能でGit管理しない |

app側で置換するのはStampRallyScreenのplaceholder、stampRallyPortのplaceholder binding、QrPopupのdisabled導線と連携待ち文言。map座標、出展者JSON、他の投稿／地図ロジックは移植対象ではない。

## 6. Routing

正式案はBrowserRouterを1つ維持し、app/Appに `path="stamprally"` の親Routeと相対子Routeを置く。親のelementはStampRallyLayout、入口はindex RouteのRootRedirect。画面からの遷移はfeatureのURL定数を用いた絶対パスで統一する。

| 旧hash内パス | 正式パス | 動作 |
| --- | --- | --- |
| `/` | `/stamprally` | 登録済みならrally、未登録ならnoticeへNavigate replace |
| `/notice` | `/stamprally/notice` | 注意事項 |
| `/howto` | `/stamprally/howto` | 遊び方 |
| `/register` | `/stamprally/register` | 登録。既登録ならrallyへreplace |
| `/rally` | `/stamprally/rally` | 進行状態 |
| `/camera` | `/stamprally/camera` | カメラ |
| `/reveal` | `/stamprally/reveal` | GET演出。location.state欠落時はrallyへreplace |
| `/challenge` | `/stamprally/challenge` | 7つ未収集ならrally、入場時点で解答済みならexchange |
| `/exchange` | `/stamprally/exchange` | 未解答／courseなしならrally、交換済み表示を維持 |
| `/result` | `/stamprally/result` | exchangeへNavigate replaceする互換alias |
| `*` | `/stamprally/*` の未知の子パス | `/stamprally` へreplaceし入口判定に戻す |

appの `/`、`/events`、`/posts` は維持。ラリーのcatch-allをapp全体へ置かない。app全体の未知URLは既存の他ルートと衝突しない最小のfallbackでホームへ戻す。

### 変更箇所と履歴

- `App.tsx` のNavigate／RootRedirect／result alias、全8画面のuseNavigate、DemoResetButtonの絶対パスを表に従って変更する。`navigate(-1)` へ一括置換しない。
- Outletは親に1個。画面側の `useOutletContext<UseStampRally>()` を維持。中間のRoute elementを足す場合はcontext転送が必要なので、今回の標準構成では加えない。
- 未登録でrally／camera／reveal／challenge／exchangeへ直接来た場合は、親Layoutでnoticeへreplaceする最小の入場ガードを置く。登録済みの状態やcourseを勝手に再発行しない。
- challengeの「画面内で正解した瞬間に追い出さない」入場時判定、Registerの二重submitガード、Cameraの二重decodeガードを保持する。
- 既存のreplace指定と `location.state` のcheckpointId／justCollectedId／startRect／reducedMotionをそのまま維持。reveal→rally後のブラウザbackではカメラへ戻る可能性があり、再取得しないことと再起動／停止を検証する。
- 画面の「戻る」は既存どおりrallyを指定。ブラウザbackは履歴に従う。全画面UIからホームへ抜ける小さな内部Linkを用意する（14章）。

### 旧URLとreload

旧 `/#/notice` 等を同じ公開originで受ける場合、BrowserRouterが処理する前に、既知の旧hashパスだけ正式パスへreplaceする短い互換処理を設ける。未知hashを任意のパスへ転送しない。旧originが異なる場合、サーバーはURL fragmentを読めないため、redirectだけで旧hash／保存状態が移るとは扱わない。旧公開URLの実情と7章の引継ぎ方針を確定してから互換経路を選ぶ。

BrowserRouterは `/stamprally/register` 等の直アクセス／reloadでindex.htmlへのfallbackを要する。RepositoryにWrangler設定、Pages redirects／headers、配信workflowは見つからず、root READMEとSheet READMEだけではPagesかWorkersか断定できない。

- Pagesの場合、top-level `404.html` がない構成ではSPA fallbackが提供される。独自ルート／Functionsの有無も実環境で確認する。[Cloudflare Pages公式](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- Workers Static Assetsの場合、将来の配信設定で `assets.not_found_handling = "single-page-application"` 等を確認する。Pagesの既定動作をWorkersへ当てはめない。[Cloudflare Workers公式](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)

今回は設定変更もdeploymentも行わない。将来のpreview環境でSWを無効にした直アクセス／reloadを先に確認し、SWのnavigation fallbackでサーバー不備が隠れないようにする。

## 7. State / localStorage

**親StampRallyLayoutでuseStampRallyを1回だけ生成し、Outlet contextを維持する。** feature Providerへの全面変更やrootの状態管理ライブラリ追加は不要。子ルート遷移では親を保持し、地図等へ退出したらunmount、再入場時に保存状態から復元する。

| キー | 保存内容 | 維持条件 |
| --- | --- | --- |
| `stampRally.v1` | registration、participantId、participantNumber、courseId、collectedIds、phraseSlots、phraseSolved、prizeExchanged、startedAt | キー・JSON構造・既存補完処理を維持。コースの順番／ID／QR値も変更しない |
| `stampRally.participantCounter.v1` | 次に払い出す参加者番号の数値文字列 | rawの文字列形式を維持。resetAll／resetProgressで削除しない |
| `stampRally.sheetSyncQueue.v1` | 登録payload／旧progress・exchange payloadの配列 | 起動／online再送を維持。resetで勝手に消さない |

`loadState()` はphraseSlotsを7件に整え、不足フィールドをnull等で補う。JSON破損／読取例外ではEMPTY_STATE。registerは既存participantId等を優先し、addStampは重複を追加しない。resetProgressは登録を残し、resetAllは主状態だけをEMPTY_STATEへ。採番はRegisterScreenのイベントで1回実行し、StrictModeで二重評価されるstate updater内へ入れない。

### 共有storageへの適合

CLAUDE.mdの直接storage操作禁止に合わせ、現loadStateの正規化を `feature/lib/stateStorage.ts` へ抽出し、hookとread adapterで再利用する。既存 `shared/storage/storage.ts` に必要最小限のraw read/write窓口を追加し、番号のNumber(raw)判定／String保存、JSONの旧形式、各呼出箇所のtry/catchの意味を維持する。既存get/set利用者の挙動を一括変更しない。

現hookのstate保存effectには書込失敗のcatchがなく、shared storageも全例外を吸収する設計ではない。統合で「ストレージ禁止でも永続化できる」とは保証しない。利用不能時の既存挙動を記録し、追加改善は別扱いにする。

### 地図への読み取り

`Spot.stampCheckpointId` とReadPortの1〜7は、外部向けの**設置位置番号**として扱う。内部のcourse固有取得IDと区別するコメント／契約説明を更新し、型名や出展データの大幅変更は不要。

feature側のread adapterは保存されたcourseIdから `getCourseById()` を参照し、位置pに対して `phraseIndex === p - 1` のcheckpointを見つけ、`collectedIds.includes(checkpoint.id)` を返す。例：course2、位置1、collectedIdsに8なら地図位置1は取得済み。コース未登録／不明はnullを返し、既存の安全側fallbackを利用する。

appのcomposition箇所でshared read契約へfeature adapterを接続する。依存の向きはfeature→shared契約、app→両者とし、sharedがfeatureのUIやhookをimportする循環を作らない。地図でuseStampRallyをもう1回呼ばず、直接localStorageも読まない。

ラリー保存effectが完了した状態を、Home再mount時にread adapterから読む。取得→地図、reset→地図、course2〜5の各位置を検証する。別タブの自動再描画は現Portに無いため、必要ならsharedの読取購読へstorage eventを追加する別判断とし、v1の保証は同一タブの退出・再入場に限定する。

### 公開originと進行引継ぎ

localStorageはscheme／host／port単位で、pathやRouter方式の違いでは分離されない。同じoriginを維持してHashRouterからBrowserRouterへ変える場合、キー／構造／IDを保持すれば現行状態を復元できる。別originの新サイトから旧localStorageは読めない。[MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

**推奨は旧ラリー参加者が利用中のoriginを維持し、そのoriginへ単一appを配信すること。** メイン側originが必須なら、実利用者の有無を確認し、開始前切替か、旧origin上の移行専用ページでの書き出し／新originでの取り込み等を別設計する。進行中利用者がいるのに未決のまま公開切替しない。移行用ページは一時的な互換手段であり、第2のラリーruntimeを恒久運用するものではない。

旧 `stampRally.v1` でもregistrationあり／courseIdなしの形式は、現loadStateが読めても収集継続できるとは限らない。実データの版は未確認。現行5コース形式の互換は維持し、さらに古いID形式の移行は実サンプル確認後に判断する。推測でcourseを割り当てて進行を上書きしない。

## 8. i18n

**feature親だけに既存I18nProviderを置く。** root配置は祭り全体へ翻訳依存を広げる一方、地図等の日本語は翻訳されないため今回の利点が小さい。将来の全体多言語化は別計画。

75件のlocale、 `import.meta.glob('./locales/*.ts', { eager: true, import: 'default' })`、navigatorの言語解決、中国語script／region判定、jaへのdeepMerge fallback、languagechange購読を保持する。localeのlocalStorage保存は現実装にないので新しいキーは作らない。日本語で小学生登録した場合のひらがなoverrideと小学生向け2コース限定を保持する。

Providerの `document.documentElement.lang` 書換は廃止し、feature wrapperへ `lang={locale}` を付ける。HTML root／BottomNavはjaを維持する。Provider退出時のglobal lang復元に頼るより、最初から副作用をfeature内へ閉じる。日／英／簡体・繁体／未対応言語、小学生／一般、日本語画面への戻りを検証する。原文で日本語のまま残る年齢エラーや答え紹介文まで追加翻訳する作業は含めない。

## 9. CSS / Tailwind

Tailwind importとpluginはappの1つだけを維持し、元ラリーCSSを全文追加しない。

| 対象 | 比較結果 | 正式方針 |
| --- | --- | --- |
| @theme／色token | appはbg/card/ink/sub/line、brand-*。ラリーはnotice/howto/register/cta/camera/collected/exchange-link/exchange-btn/exchanged。名称重複なし | 値を変えず `--color-stamprally-notice` 等のprefixへ移し、featureのbg/text/border utilityを対応更新。tokenの正本はapp/index.cssの1か所 |
| html/body/#root | 両方height:100%。body背景／文字色は異なる | 共通baseはappのまま1回。feature wrapperで旧背景と文字色を設定 |
| button | 両方font-family:inherit | appの共通定義のみ |
| PageContainer | 旧h-dvhはナビ込みshellより高い | app shell直下に `flex-1 min-h-0` のcontent領域、feature root／PageContainerは `h-full min-h-0`。元の内側scrollとsticky CTAを保持 |
| 暗いCamera | PageContainer darkで黒、文字白 | featureだけ黒。ナビ非表示時はcontentがshell全高を占める |
| scanner | `#qr-scanner-region` と挿入videoへのabsolute／object-fit cover | feature CSS内で `.stamprally #qr-scanner-region` に限定。DOMのidとhtml5-qrcode設定を維持 |
| スタッフ長押し | `.staff-long-press` の選択／callout抑止 | `.stamprally .staff-long-press` へ限定 |
| keyframes | appはnudge、ラリーはstamp-pop-bounce、glow-pulse、ring-expand、title-drop、sparkle-float、fly-to-slot、land-bounceの7件。重複なし | feature CSSにstamp-*を保持。animation utilityをfeature範囲に限定、nudgeはappに残す |
| utilities | Buttonのvariant mapに完全なbg-*文字列、scannerの手動CSS、inline arbitrary colors、飛行の--dx/--dy/--land-scale | prefix更新後も完全なclass文字列にする。Tailwind走査で欠落しないことをbuild／表示で確認 |
| reduced motion | CSSでGET演出停止、JSで飛行情報を渡さない | 両方保持。移植時に片方だけ落とさない |

`feature/stamprally.css` をapp/index.cssから一度importし、共通token→feature rulesの順に整理する。feature wrapperに `.stamprally` を置く。confettiはbodyにcanvasを追加するためwrapper限定CSSで閉じない。退出時のresetとtimer解除を確認し、演出中にホームへ戻ってもcanvasが残らない最小のcleanupを行う。

BottomNavは高さを固定計算せずflexで確保し、shrink-0とsafe-areaの余白を検証する。両footerを画面下の同一座標へfixed配置しない。Noticeの50%領域、Registerのキーボード、challengeの7文字タイル、exchangeのmodal、最大420px、地図のzoom／FABを比較する。

## 10. Dependencies

宣言値は両package.json、解決値は各package-lock.json（lockfileVersion 3）。これは現mainの値であり、最新版へ更新する指示ではない。

### Runtime dependency

| Package | app宣言 → lock | ラリー宣言 → lock | 統合案 |
| --- | --- | --- | --- |
| react | ^19.2.8 → 19.2.8 | ^19.2.7 → 19.2.7 | app維持 |
| react-dom | ^19.2.8 → 19.2.8 | ^19.2.7 → 19.2.7 | app維持、reactと揃える |
| react-router-dom | ^7.18.2 → 7.18.2 | ^7.18.1 → 7.18.1 | app維持、Router1つ |
| tailwindcss | ^4.3.3 → 4.3.3 | ^4.3.2 → 4.3.2 | app維持 |
| @tailwindcss/vite | ^4.3.3 → 4.3.3 | ^4.3.2 → 4.3.2 | app維持、plugin1つ |
| html5-qrcode | なし | ^2.3.8 → 2.3.8 | appへ追加、既存カメラを移す |
| canvas-confetti | なし | ^1.9.4 → 1.9.4 | appへ追加 |

### devDependency

| Package | app宣言 → lock | ラリー宣言 → lock | 統合案 |
| --- | --- | --- | --- |
| @types/node | ^24.13.3 → 24.13.3 | ^24.13.2 → 24.13.3 | app維持 |
| @types/react | ^19.2.17 → 19.2.18 | ^19.2.17 → 19.2.17 | app維持 |
| @types/react-dom | ^19.2.3 → 19.2.4 | ^19.2.3 → 19.2.3 | app維持 |
| @vitejs/plugin-react | ^6.0.4 → 6.0.5 | ^6.0.3 → 6.0.3 | app維持 |
| oxlint | ^1.75.0 → 1.78.0 | ^1.71.0 → 1.73.0 | app維持、同一rules |
| typescript | ~6.0.2 → 6.0.3 | ~6.0.2 → 6.0.3 | app維持 |
| vite | ^8.2.0 → 8.2.1 | ^8.1.1 → 8.1.4 | app維持 |
| vite-plugin-pwa | ^1.3.0 → 1.3.0 | なし | appだけ維持 |
| @types/canvas-confetti | なし | ^1.9.0 → 1.9.0 | appへ追加 |
| qrcode | なし | ^1.5.4 → 1.5.4 | app devへ追加、運営script専用 |
| @types/qrcode | なし | ^1.5.6 → 1.5.6 | app devへ追加 |
| tsx | なし | ^4.23.1 → 4.23.1 | app devへ追加 |
| @vitejs/plugin-basic-ssl | なし | ^2.3.0 → 2.3.0 | 未使用なので追加しない。HTTPS試験方法は別途確保 |

将来の実装時にapp/package.jsonへ不足項目のみ追加しappのlockを更新、`npm ci` で再現性を確認する。旧lockの上書き、共通versionのdowngrade、両lockの手編集マージ、QR生成依存をruntimeに入れることは避ける。root package／workspaceを新設せず、運営scriptもappの同じdev環境で実行する。

解決済みVite／React plugin／oxlintのNode enginesは `^20.19.0 || >=22.12.0`。今回のNode22.17.0は該当するが、Cloudflare buildのNode版は未確認。実装時の静的検証環境はこの要件を満たすものとする。

## 11. Assets / Scripts

- JPEG4枚はfeature/assets/answersへ移し、answerImages.tsのstatic importを保持する。サイズは約143〜424KiB。red-panda画像は現実装に存在せず、移行時に新しい画像を作らない。
- `public/app-icon.png`（814,978 bytes）は `app/public/stamprally/app-icon.png` へ。Noticeは `${import.meta.env.BASE_URL}stamprally/app-icon.png` を参照し、深いURLからも取得できるようにする。これは注意事項のイラストで、統合PWAの正式iconとは別責務。
- 既存app/favicon、public/maps、public/iconsは維持。旧faviconの同名上書きを避ける。旧icons.svgは参照再確認後に廃止。
- QR生成は画面runtimeから独立したNodeの運営ツール。`app/scripts/stamprally/generate-qrcodes.ts` へ移し、`../../src/features/stamprally/data/checkpoints` をimportする。出力は `app/qrcodes/` に固定し、app/packageの `generate:qr` を `tsx scripts/stamprally/generate-qrcodes.ts` に変える。
- 現scriptの `__dirname/..` をそのまま使うと `app/scripts/qrcodes/` になるため、出力pathを明示変更する。QR PNG7枚、print.html、5コース文字対応表を維持する。
- answers.ts／checkpoints.tsはNodeから読める純粋なデータと関数を保つ。Vite専用JPEG importやimport.meta.globを混ぜない。画像はanswerImages.tsへ分離したまま。
- 将来、`cd app` → `npm run generate:qr` の結果を既存の7文字列と照合する。読み取り値はURLではないため、サイトURL変更に伴うQR値変更や印刷し直しは不要。旧STAMP_01版が現地で使われているかは未確認。

## 12. GAS / Sheets

`feature/lib/sheetApi.ts` に既存実装を移し、`VITE_SHEET_WEBHOOK_URL` の名前、ビルド時読込み、Google script hostname検査、no-corsのPOST、text/plain payload、任意送信を維持する。app/.env.exampleは値が空の設定例のみ。app/.gitignoreへ.env類の除外を加え、.env.exampleはGit管理できるようにする。

登録はparticipantNumber／gender／age／student／studentCategoryの5項目を日本語ラベルで送る。画面言語に依存させない。progress／exchangeも現コードでは送るが、README掲載GASはparticipantNumberのないイベントを無視する。移行でシート列やpayloadを再設計しない。

未設定／不正URLなら送信せず、通信失敗ならキューに残す。登録・取得・交換はローカルstateで成立し、送信結果を待たない。fetch成功でもopaque応答でGASの成功／失敗を読めないため、送達保証や一度だけのappendは保証しない。再送による重複の可能性を現仕様として残す。

AppLayout由来のflushQueuedSyncはfeature親の初回mountとonline復帰に引き継ぎ、cleanupでlistenerを外す。homeのみ滞在中の再送は今回保証せず、全appへの拡張は不要。キューはstate resetと別扱いにする。

説明を `docs/stamprally/sheet-sync.md` へ移し、appからの設定手順と再buildの必要性を記す。将来のCloudflare配信時にappのbuild環境へ同名変数を設定できるよう計画するが、**今回は実URLの取得・設定、GAS deploy、Sheets作成・編集、実POSTを行わない。** 検証時の実送信は運営管理の検証用endpointを使う別作業とする。

## 13. PWA

appのVitePWAだけを維持する。既存autoUpdate、manifest名／start_url `/`、仮favicon、devOptionsを基準とし、ラリー専用manifestやSWは作らない。正式iconの追加制作／大幅なPWA改修は今回の目的外。

現vite.configには画像用globPatterns／includeAssets指定がない。公式既定のprecache対象はjs/css/htmlとmanifest iconで、JPEGやNotice画像を自動で完全cacheするとは判断できない。[Vite PWA static assets](https://vite-pwa-org.netlify.app/guide/static-assets)

将来の最小変更は `workbox.globPatterns` にjs/css/htmlを保持したまま `assets/*.{jpg,jpeg,png,svg}`、`stamprally/*.png`、既存 `maps/*.png`／`icons/*.png` 等の必要な配信assetを追加する。実際のdistとprecache manifestを照合し、不要な印刷用qrcodesはpublic／distへ入れない。

写真とNotice iconは現在すべて2MiB未満。最大のvenue-all.pngも1,772,328 bytesだが、統合後のbundleサイズは未計測。1ファイルの既定上限2MiBを超えた場合は必要なsplit／asset最適化を判断し、無条件に上限を増やさない。[Vite PWA FAQ](https://vite-pwa-org.netlify.app/guide/faq)

| 利用条件 | v1で計画する保証 |
| --- | --- |
| 通常Web、SW未登録、PWA未install | オンラインで全主要機能を使える。install必須の導線は設けない |
| オンラインでSWと対象assetのcache完了後 | app表示、モック地図／イベント、ローカル登録・収集・解答・交換、答え写真をofflineで確認 |
| 初回のofflineアクセス／cache未完了 | 保証外 |
| Camera | HTTPS、権限、端末APIが利用可能ならローカルQR判定可能。SWは権限を与えない |
| GAS | offline送信成功は保証しない。キュー再送もfeatureのmount／online時だけ |
| ブラウザデータ削除／OSによる保存領域消去 | localStorage復元を保証しない。SW cacheと進行保存は別 |

autoUpdateは更新時にページをreloadし得るため、登録未submitのフォームや一時的な演出状態は失われ得る。保存済み進行、カメラ停止、古いbundle参照が残らないことをA→B更新で確認する。[Vite PWA automatic reload](https://vite-pwa-org.netlify.app/guide/auto-update)

Service Workerの自動登録方法／生成物は実装時のbuild後に確認する。rootの新しい登録コードを既存pluginの登録と重ねない。旧ラリーにSWはなく、新しいroot SWとの競合を前提にしないが、実配信の既存scope／cacheは確認する。

## 14. UX / Bottom Navigation

BottomNavはrouteで切替える。StampRallyLayoutを2つに分割してstateを再mountする方法は採用しない。

| 場面 | BottomNav | 理由／退出方法 |
| --- | --- | --- |
| Home／Events／Posts | 表示 | 既存4タブを維持 |
| ラリー入口／notice／howto | 表示 | 参加前でも祭り案内へ容易に戻れる |
| register | 表示 | 入力操作を残り高さでscroll。未submitの入力は退出で破棄する既存画面stateのまま |
| rally | 表示 | 地図へ戻って残り地点を確認。ラリーtabはprefix matchでactive |
| camera | 非表示 | 黒いfull-height表示とスキャン領域を確保。既存の戻るはrallyへ |
| reveal | 非表示 | GET演出を維持し、650ms程度でrallyへ戻る |
| challenge | 表示 | 解答中のphraseSlotsは保存され、地図へ退出して再開できる |
| exchange／result alias | 非表示 | スタッフに渡す券面・長押し・確認modalを優先。小さな戻る／ホームLinkを追加 |

非表示画面のheader付近に、主操作と競合しない内部の退出導線を置く。cameraはrallyへの戻るを保持し、必要なホーム導線を追加。revealは自動帰還を主とし、交換画面はrally／ホームへ確実に戻れるようにする。退出時はカメラと演出をcleanupする。

現ラリー内に「祭り案内へ戻る」という外部リンクは確認できなかった。存在しないリンクを削除対象にせず、新たな退出導線を内部Linkで実現する。地図QrPopupのdisabledボタンは、登録済みなら `/stamprally/camera`、未登録なら `/stamprally` へ接続し、既存カメラのみ起動する。登録終了後は既存どおりrallyへ進め、戻り先管理の新しいstateは不要。

DemoResetButtonとrallyのデモ用3ボタンは現仕様どおりfeature内に残す。デモ／本番の出し分け変更やラリー全体のUI再設計は別判断。

## 15. Legacy stamp-rally Cleanup

**最終状態はrootのstamp-rallyディレクトリを削除する。** runtimeはappの1つだけ、運営scriptはapp/scripts/stamprally、設定手順はdocs/stamprallyへ残す。

Phase 1〜2の実装branchでは、比較とrollback用に旧ディレクトリを一時保全する。旧側を新機能の正本として継続編集せず、featureへの切替地点を担当者に共有する。Phase 3で全検証と公開切替の条件が揃った後、削除を独立commitにする。

削除前条件は、画面・3保存キー・実機Camera・GAS設定口・画像・QR生成・PWA・旧URL方針が検証／確認済みであること。旧配信だけがstamp-rallyをroot directoryとして使用中なら、先に配信管理者が単一appのbuildへ切り替えるか旧配信を停止する。Repository削除がまだ稼働する旧buildを壊す順序にしない。

root README、integration-notes、必要な仕様リンクの独立ビルド記述を実装時に更新する。`rg` で旧import／script／説明のパスを確認し、履歴説明以外のruntime参照をゼロにする。旧git履歴は復元元として残るため、恒久legacyコピーや重複packageは不要。

削除commitだけはrevertで復旧できる。公開切替のrollbackは別に既知のdeploymentへ戻し、same-originの保存キーを消さない。原則、利用者の進行データを巻き戻さない。

## 16. Implementation Phases

**3段階を推奨する。** 別々の実装commitでreview／rollback境界を作るが、各段階を必ず本番公開する必要はない。ルートとstateを未完成な形で一般公開しない。

### Phase 1 — Dependencies / Feature shell

- 変更範囲：appの不足dependencies／devDependenciesとlock、URL定数、親Route／Layout骨格、ナビ表示とcontent高さの境界。旧runtimeは保全。未移植の子画面は公開しない。
- 完了条件：単一BrowserRouterの構成がbuildでき、Home／Events／Postsが従来どおり動く。ラリー入口の準備ができ、二重Routerやrootがない。
- 検証：appでnpm ci／build／lint、4タブ、地図／イベント／投稿のviewportとscroll。共通versionのdowngradeがないことをlock diffで確認。
- rollback境界：依存とshellを1まとまりでrevertする。旧ラリーと保存キーには触れず、プレースホルダーへ戻せる。

### Phase 2 — Feature migration / Integration verification

- 変更範囲：8画面、components、hooks、types、5コース、i18n、CSS、画像、sheetApi、3キー対応、QR script、read adapter、地図camera導線、最小cleanup／入場ガード、PWA cache対象。将来の設定例／運用説明も移す。
- 完了条件：appだけで登録から交換まで完結し、既存の進行が復元される。位置とcourse固有IDが正しく対応する。必要画像／印刷QRが揃い、通常Webでカメラを使用できる。
- 検証：17章の全セットをpreviewで実施。まず未設定GASで完結すること、次に許可された検証endpointで送信と再送。iOS／Android、SW更新、offlineを確認。
- rollback境界：移植・導線・cache変更をまとめてrevertしPhase 1の入口準備まで戻せる。旧runtimeを削除せず、同じJSON形式のため旧版も保存済み進行を読む。スキーマ変更やkey変更を同時に入れない。

### Phase 3 — Release gate / Legacy cleanup

- 変更範囲：実運用origin／Pages・Workers／SPA fallback／旧URL方針の確定、単一appへの公開切替は配信管理作業として実施。その後の独立commitで旧stamp-rally削除、README／調査メモの更新、残存参照の清掃。
- 完了条件：進行引継ぎ条件を満たし、深いURLのreloadが成功、配信buildがapp/distだけを参照。stamp-rally runtime／二重package／二重正本が残らない。
- 検証：統合appのnpm ci／build／lint、削除後QR生成、主要Web／実機smoke、SWなしdeep link、保存状態付き旧URL、旧パスの参照検索。公開切替時も動作確認する。
- rollback境界：まず削除commitをrevert。必要なら既知deploymentへ戻す。originや配信設定の復旧手順は管理者が切替前に記録し、localStorage／キューを削除しない。

Phase 3の外部配信操作は今回の作業範囲外で、実装時にも権限・担当を確認して実行する。計画作成を理由に今回先行実行しない。

## 17. Verification Plan

本計画作成時は依存インストール禁止かつnode_modules不在のため、npm ci／build／lint、browser／実機／GAS／PWA検証は**未実行**。実施した確認はコード・設定・lockの読取と本計画の整合確認。既存buildが成功しているとは断定しない。

実装時は以下の静的3コマンド、PCでの手動smoke、iOS Safari／Android Chromeの実機、production相当previewのPWA確認を最小セットとする。重いE2E環境の新設は要求しない。

### Static

appディレクトリで順に `npm ci`、`npm run build`、`npm run lint`。Windowsでnpm.ps1制限があればnpm.cmdを用いる。buildに `tsc -b` が含まれるため型チェックも兼ねる。Phase 1の最初に旧2アプリもこの3コマンドでbaselineを記録し、既存エラー／警告と今回の差分を区別する。禁止されている今回の調査中には実行しない。

確認内容はReact／Router／Tailwindの重複・downgradeなし、欠落importなし、PWA cache警告、各画像とSW／manifestの生成。実装後 `npm run generate:qr` も実施しPNG7枚／print.html／5コース対応表を確認する。

### Browser / routing / layout

| 対象 | 最小シナリオ／期待結果 |
| --- | --- |
| Home | 全体・会場切替、zoom／pan、検索、既存マーカー／FAB。ラリー取得後に戻ると対象位置が✓ |
| Events | カテゴリとタイムテーブル、時計Providerの表示を確認 |
| Posts | フィード／フィルター／作成の既存smoke。ラリー登録と投稿者を勝手に連動させない |
| 入口 | 空storageはnotice、登録済みはrally。BottomNav activeとroot homeのend指定 |
| Notice／HowTo | 注意欄のscroll／確認、画像、CTAで順にregisterへ |
| Register | 必須・年齢1〜110・学校区分整合、通常／小学生コース、連打の採番／送信重複なし |
| Rally | 0〜7個、取得順グリッド、CTA切替、デモreset、地図との往復 |
| Camera | 正常QR、重複QR、対象外、拒否／利用不可表示、戻る時の停止 |
| Reveal | checkpointId／飛行情報を保持してrallyへ。直アクセス／state欠落で安全にrallyへ戻る |
| Challenge | 未完成guard、タイル配置／外し、誤答／正答、正答表示が途中で消えない |
| Exchange | 未解答guard、短tapで確定不可、長押し→cancel／confirm、二重確定不可、退出Link |
| ナビ／履歴 | 各14章の表示条件、内部戻る、ブラウザback／forward、camera再入場と同QR再判定 |
| Reload／旧URL | SWを無効にして全深いrouteを直接開く。result alias／未知子パス、許可された旧hash経路 |
| 見た目／言語 | 320／375／420pxとPC幅、safe-area、キーボード、長い注意文。日／英／中国語とja fallback、feature退出後のlang |
| 演出／staff | reduced motion、演出中の退出、canvas／timer残存なし、長押し中のスクロール取消／選択抑止 |

### State

コピーした検証用ブラウザprofileへ、既存の**架空登録**を含むJSONを投入して比較する。実利用者データをplanやGitへ保存しない。

| Fixture／操作 | 合格条件 |
| --- | --- |
| 空／現行登録直後のreload | 空は新規開始、登録後は同じparticipantId／番号／course／開始時刻でrallyへ |
| 途中取得・phraseSlots途中 | 取得順／選択位置がreload・地図往復で維持される |
| 解答済み／交換済み | 再登録・再発行なし。交換済みが残り二重確定しない |
| course2〜5で各QR position1〜7 | course固有IDを追加し、地図の同じ位置番号だけ取得済みになる |
| resetProgress | 登録／番号／courseを残して取得・解答・交換だけクリア |
| resetAll | 主状態をクリア、次の登録番号は継続。キューも既存方針どおり維持 |
| 旧キー／不足フィールド／破損JSON | 既存loadStateと同じ補完／fallback。courseなしの旧版は別判定し、勝手に上書きしない |
| Sheet queueあり、offline→online | local動作を止めず、feature初回／onlineで再送。新schemaへ置換しない |
| origin差／storage禁止 | originを変えて自動復元できると誤認しない。保存禁止時の現挙動を記録 |

最小の追加自動テストを行うなら、course2〜5の位置→ID変換、旧JSON復元、reset後の採番の境界に限定する。既存runnerがないため新規の大規模テスト基盤は必須としない。

### Mobile camera

HTTPS preview／端末から到達するHTTPS tunnelを用いる。localhost以外の通常HTTPだけで成功すると期待しない。getUserMediaにはsecure contextと利用者の権限が必要。[MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

iOS SafariとAndroid Chromeで許可／拒否、背面カメラ、アドレスバー伸縮／回転／safe-area、registerキーボード、連続開閉を検証する。background→foregroundでtrackが終了した場合の再入場を確認し、両OSで同じ権限再確認挙動とは仮定しない。StrictModeのstart未解決時cleanup、成功／失敗後のstop／clear、画面退出後カメラインジケータ消灯、ホームへ戻ってもstreamが残らないことを実測する。

### PWA / update

通常Webからinstallなしでsmokeし、production buildのSW登録・scopeが1つであること、manifest／precache対象／画像を確認する。cache完了後にネットワークを切って13章の保証範囲を試す。developmentのSWだけで判定しない。

保存状態付きbuild AからBへ更新し、BのHTML／JS／CSSへ揃って切り替わり、古いbundleを要求して404にならず、3保存キーが維持されることを確認する。Aには新PWA対象画像を入れ、Bで一部を変更してcache更新も確認する。SWを無効にしたオンラインdeep-link試験を別に実施する。

## 18. Parallel Development / Merge Strategy

`hamura-map-app/main` を全員の正本とする。実装開始直前に最新mainと担当branchの必要修正を取り込み、対象SHAを記録する。移植開始前にラリー側の改善を一度まとめて取り込み、コピー元を確定する。

| 責任境界 | 主な範囲 |
| --- | --- |
| app／統合担当（佐々木側等） | app/App、package／lock、vite、index.css、BottomNav／共通storage、shared read契約、map接続 |
| ラリー担当（長谷川側等） | app/src/features/stamprally、運営QR script、Sheet手順。course／state仕様の正本 |

Phase 2開始時に編集先をfeatureへ切り替え、旧stamp-rallyの並行機能開発は止める。途中で旧branchの修正が必要になったら、移植後pathへ小さく適用し、旧ディレクトリ一式を再importしない。package／lock、共通CSS、app/Appは統合担当に変更をまとめて依頼する。

各Phaseのreview前と最終削除前にmainとの差分を取り込み、同じ静的／関連smokeを再確認する。運営の5コース／QR定義はfeatureの1か所だけに残し、地図側が再定義しない。旧削除に新しい業務修正を混ぜず、path移動と共有ファイルの競合が判断しやすいcommitに分ける。

## 19. Risks / Open Questions

| 重要度 | 未確定事項／リスク | 判断時点・担当 |
| --- | --- | --- |
| 公開前必須 | 旧ラリーとメインの公開origin、利用中参加者の有無、保持すべきprogress。別originなら引継ぎ方式が必要 | Phase 2検証前に運営／配信担当が確認。未決なら公開切替を保留 |
| 公開前必須 | CloudflareがPagesかWorkersか、SPA fallback、buildのNode版、root directory、preview／productionのenv | Phase 3切替前、配信担当。今回は設定を読んだ／変更したとは扱わない |
| 公開前必須 | 現利用者のstampRally.v1が現5コース形式か、courseIdなし／旧STAMP_01版が残るか | Phase 2開始時、ラリー担当。旧データfixtureを確認して変換要否を決める |
| 実装注意 | 位置番号とcourse固有IDの混同 | Phase 2でread adapterを実装し、course2〜5を検証。地図の出展データを書き換えて合わせない |
| 実装注意 | ナビ込み高さ、cameraとexchangeのfull-height、i18nのhtml.lang漏れ、confettiの退出cleanup | Phase 2のmobile／layout検証で解消 |
| 検証待ち | 統合bundleと画像cacheのサイズ、autoUpdate時のフォーム／Camera、現app manifest iconの実機install品質 | Phase 2のbuild／PWA検証。正式icon制作は別作業 |
| 運用確認 | Sheetsの実payloadと現在deploy済みGASの一致、再送重複、検証endpoint | 任意連携を使う場合に運営が確認。migration中に本番GAS／列を作り替えない |
| 現仕様の制約 | 取得状態の別タブ購読なし、storage失敗時の保存保証なし、デモreset常時表示 | v1で勝手に全面改善しない。必要なら別タスク化 |

不明事項が残っていても計画文書は完成できる。ただし上表の公開前必須項目が未解決なら、実装後の公開受入を完了としない。

## 20. Acceptance Criteria

### 今回の計画作業

- [x] fetchしたmain SHAとcleanな開始状態を記録し、最新mainからwork branchを作成した。
- [x] 両アプリのentry、Router／Provider、CSS、TS、public／assets、API／mock、ラリー全画面・components・hooks・data・i18n・sheetApi・QR scriptを読んだ。
- [x] appを統合先にするRecommended／Alternative／Reasonを実コードで評価した。
- [x] 移植／書換／廃止を実ファイルと移行先で分類した。
- [x] Router、Outlet、state、3保存キー、origin互換、i18n、CSS、dependencies、assets／scripts、GAS、単一PWA、BottomNavの判断を記した。
- [x] 旧ディレクトリ削除の条件、3Phaseの範囲／完了／検証／rollback、最小検証セット、並行開発の責任境界を記した。
- [x] 未確認事項をOpen Questionsとして残し、実装や未実施検証を完了扱いにしていない。
- [x] 本計画以外にアプリ本体、package／lock、設定、データを変更しない作業範囲で作成した。

Git受入は、本計画の自己reviewと `git diff --check` を行い、この1ファイルだけをcommitしてoriginへpush、mainへmergeしないこと。最終commit SHA／push結果／作業ツリー状態は完了報告で提示する（commit SHAを文書に自己参照で埋め込まない）。

### 将来の実装完了条件

- [ ] appだけをrootとしてnpm ci／build／lintが成功し、旧スタンプruntimeや二重Router／Provider stateが残らない。
- [ ] Home／Events／Postsと8ラリー画面が同じWebサイトで動き、全正式URLのreload／back／fallbackが検証済み。
- [ ] 現利用者のorigin／旧データ形式を確認し、進行・番号・course・並べ替え・交換状態・再送キューを失わない切替を行った。
- [ ] 7位置とcourse固有取得IDのread adapterが正しく、地図への戻りで取得／resetを反映する。
- [ ] 既存翻訳／小学生仕様、画像、QR生成、任意GAS設定口を維持し、地図のCSS／taxonomy／出展者データを壊していない。
- [ ] 実機cameraの許可／拒否／重複／退出cleanup、長押し交換、BottomNavの境界を確認した。
- [ ] 通常Webはinstall不要で使え、SW1個の登録・更新・限定したoffline保証を確認した。
- [ ] 配信切替が済み、script／運用docsを保全してstamp-rallyを削除し、runtimeの正本がappに1つだけある。
