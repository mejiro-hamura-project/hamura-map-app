# 一覧番号・会場文言修正とデザイン統一監査（2026-10-25）

## 対象と結論

- 対象：`app/`。開始基準：最新 `main` の `f48e5a4d2a6358bd8055befcf1fac826503efee6`。
- 実装はイベント一覧の重複番号削除と、日本語・英語の明確な会場／操作案内の誤りの修正に限定した。
- デザインは調査・提案のみ。CSS、地図座標、検索・タップ、カテゴリ色、データや画面遷移は変更していない。
- 他73言語の宗教施設を前提とする文言は未修正。現在表示される安全案内を優先して、言語ごとの翻訳確認が必要。

## A. イベント一覧

`EventListItem.tsx` の名前上の通し番号と `index` props、`EventsScreen.tsx` の呼出側のindexを削除。
`spot.name` 自体は変更していないため「1：orangesデリカキッチン」のブース番号は残る。
説明、ジャンル画像、カテゴリ切替、配列の並び順、ステージの日時、ラリーの進捗番号は対象外。

## B. 表示文言監査

### 修正したキーと使用状況

| キー | 日本語・英語での修正 | 現在の使用状況 |
| --- | --- | --- |
| `notice.safetyBody` | 境内／参拝者、shrine groundsを会場／参加者に変更。歩きスマホ禁止の案内は維持 | 使用中。`NoticeScreen.tsx` が表示 |
| `howto.steps[0].title/body` | QR探索場所を会場内へ | 旧互換キー。現在の遊び方は `flow.steps` を表示 |
| `howto.steps[3].body`（英語） | main hallへの移動を削除し、お題完成後スタッフへの画面提示を案内 | 同上 |
| `rally.phraseSolvedBanner` | 本殿／main hallでの交換を削除し、画面をスタッフに見せる案内へ | 現在の画面から参照なし。旧互換キー |
| `jaElementaryOverride.rally.phraseSolvedBanner` | 小学生向け文言も同じ意味に修正 | 上記キーの年齢別上書き。現在の直接参照なし |
| `exchange.staffNotice2`（英語） | 端末を渡す指示から、画面を見せる案内へ | 現在未使用。交換画面では `handToStaff` と `staffNotice1` を使用 |

i18nキー・配列構造・補間・操作判定は維持。未使用キーも互換性のため削除しない。
現在のラリー・お題正解後の案内は `flow.steps`、`rally.phraseSolvedNext`、`challenge.nextStep`、`exchange.handToStaff` 等で、スタッフへの画面提示を案内している。
交換確定はスタッフの長押し操作であり、利用者へ渡す操作や交換場所を新たに設定していない。

### 他言語：調査済み、未修正

localeファイルは75件（日英＋その他73件）。その他の全73localeで、使用中の `notice.safetyBody` に宗教施設・参拝者を前提とする訳が残る。
旧 `howto.steps` と `rally.phraseSolvedBanner` にも境内・本殿・main hall等に相当する表現が残る。
各言語の自然な表現を確証なく一括置換しないため、今回は変更していない。全翻訳の品質を保証する監査ではない。

未修正localeコード：

`af, am, ar, az, be, bg, bn, bs, ca, cs, da, de, el, es, et, eu, fa, fi, fil, fr, gl, gu, he, hi, hr, hu, hy, id, is, it, ka, kk, km, kn, ko, ky, lo, lt, lv, mk, ml, mr, ms, my, nb, ne, nl, nn, no, pa, pl, pt, ro, ru, si, sk, sl, sq, sr, sv, sw, ta, te, th, tl, tr, uk, ur, uz, vi, zh-Hans, zh-Hant, zu`

代表例（`app/src/features/stamprally/i18n/locales/`配下）：

| 言語 | 使用中の安全案内 | 未使用の交換案内 |
| --- | --- | --- |
| de | `de.ts:22` の Schreingelände | `de.ts:79` の Haupthalle |
| es | `es.ts:22` の recinto del santuario | `es.ts:79` の pabellón principal |
| ko | `ko.ts:23` の 경내／참배객 | `ko.ts:84` の 본전 |
| zh-Hans | `zh-Hans.ts:21` の 神社／参拜者 | `zh-Hans.ts:77` の 正殿 |
| zh-Hant | `zh-Hant.ts:21` の 神社／參拜者 | `zh-Hant.ts:77` の 正殿 |

翻訳時の優先順位：①各言語の `notice.safetyBody` → ②現在の `flow.steps` 等の未翻訳 → ③旧互換キー。
安全案内の意味は「会場は参加者で混雑する。周囲に注意し走らず、他の参加者にぶつからない。スマートフォンは立ち止まって使う」とする。
旧交換案内は「画面をスタッフに見せる」とし、確認できていない場所を指定しない。

### 表示経路と未翻訳の区別

- `i18n/index.ts` はlocaleを自動登録し、`ja` を土台に `deepMerge`。欠落キーは日本語へfallbackする。
- `HowToPlayScreen.tsx` と `StepProgress.tsx` は `flow.steps` を参照。`howto.steps` の画面参照はない。
- 英語に `flow` 定義がなく、現行の5段階の説明は日本語へfallbackする。旧英語 `howto.steps` を直しても現行説明の英訳にはならない。
- `NoticeScreen.tsx` の同意ラベル「確認しました」、共通ナビや地図・イベント・投稿の日本語固定文言も残る。今回の会場誤記とは別の翻訳課題。
- `exchange.title/title2/numberLabel` 等にも旧画面用キーが残る。キー名・文言の存在だけで現在表示中とは判定しない。

### 会場案内ではない宗教関連語

`data/answers.ts` の「まいまいず井戸」の紹介文に「五ノ神社境内」がある。これは正解後に表示される地域の見どころの所在地説明で、イベント会場や景品交換場所の案内ではないため維持した。
所在地の正確性は本調査では外部資料と照合していない。宗教語の機械的削除は地域紹介の意味を変えてしまう。

### 運営への確認事項（事実を補わず未変更）

| 項目 | コード上の記載・現状 | 必要な確認 |
| --- | --- | --- |
| 正式名称 | `mocks/events.ts` の `市民祭り2026` がイベント一覧に表示される | 正式表記。manifest/headerとも整合させるか |
| 開催日時 | 同ファイルは8/15 9:00〜17:00。`mocks/timetable.ts` は10/31・11/1で不一致 | 正式な開催日・時間。eventのstart/endは現在画面で未使用だが訂正が必要か |
| 仮説明 | `mocks/events.ts` の `会場全体で開催される祭り本体イベント（仮）` | 正式説明。現在そのdescriptionは画面で未使用 |
| 個人情報の利用目的 | JAは運営・交換確認のみ。ENには追加で `and statistics` がある | 実際の統計利用の有無、収集項目と匿名IDの扱い、第三者提供の説明が運用と一致するか |
| 保存・削除・問合せ | 注意事項は「運営が定める期間内」「運営まで」とする一般的表現 | 保存先・期限・削除方法・問合せ窓口。コードから期限を断定しない |
| 景品交換 | 現行はスタッフ提示と確認を案内、在庫切れ終了の可能性も記載 | 実際の場所、担当・受付時間、在庫切れ時の運用 |
| QR設置場所 | `mocks/spots.ts` に座標・会場番号は仮と明記 | 実設置場所との整合。今回座標は変更しない |
| 演目・地域紹介 | timetableに名称中の「（仮）」、answersにレッサーパンダ誕生6/28・お披露目9/19等の年月省略記述 | 運営承認済みの演目名と、地域紹介の年次・時制・数値の正確性 |

## C. 全体デザイン統一の提案（未実装）

### 現行資産と相違

基準は `features/stamprally/stamprally.css` と `components/`。既存UIプロトタイプ `docs/市民祭りアプリ_UIプロトタイプ.html` は色・レイアウトの比較資料として使用し、現行仕様の原本とは扱わない。

| 要素 | スタンプラリー基準 | 地図・イベント・投稿の現状 |
| --- | --- | --- |
| 背景 | `--color-sr-bg: #fffdf8`。ただし `i18n/context.tsx` の画面ルートは `#f7f3ec` | `index.css` の `--color-bg: #f4f4f1`、白カード |
| 本文／補助／線 | `#315563`／`#5a7379`／`#dcdccf` | `#2b2f36`／`#8b929c`／`#e9ebee` |
| 主色 | 赤 `#e95f68`、緑 `#6faf70`、黄 `#f4c64e`、青緑 `#35b3b8`。白文字用は濃色variant | 青・ピンク・紫・橙・マゼンタ・緑等にカテゴリ／操作上の意味あり |
| 文字 | scope内 `text-xs`14px、sm16px、base17px、見出し24〜30px | イベント12〜15px、投稿本文13px、ナビ11px、地図ラベル10〜11px |
| 形状 | CTAはpill・44px以上、カード12〜16px相当、スタンプは円形 | チップpill、FAB54px円形、イベント／投稿は下線区切り、地図パネルに角丸 |
| 装飾 | `PageContainer` の `CornerSprig`、`Sprig`、線画の花葉 | 共通装飾なし、絵文字ナビ、地図固有のピンとハイライト |

`app/public/stamprally/S__8216579.jpg` は赤・黄・緑・青緑の花葉の線画で、注意事項・交換画面に使用中。
`app-icon.png` は赤紫・金の縁、花葉、祭りの人物や神輿等を含む紋章調ロゴ。画像の主張が強いため入口・完了等の節目での限定利用を推奨する。
`app/src`、`app/index.html`、Vite manifest設定で、このPNGをアプリの現行アイコンとして使う参照は確認できない（manifestは `favicon.svg`）。
ロゴ画像から会場や運営場所を推測しない。全画面へのロゴ・花葉配置は必要ない。

### 画面別の現状・方針・影響範囲

| 画面／優先度 | 現状と改善方針 | 主な影響範囲・守る条件 |
| --- | --- | --- |
| イベント／高 | 小さい本文・下線一覧。背景、文字、線、タブの押下状態・44px操作領域を基準へ寄せる。一覧の全面カード化は不要 | `EventsScreen`, `EventListItem`, `CategoryTabs`, `StageTimetable`。カテゴリ意味色、並び、横スクロール、時刻・現在時刻線を維持 |
| ホーム地図／高（慎重に段階導入） | ティールの会場見出し、地図専用の面・ピン。まず地図外のヘッダー・検索シート・ポップアップの線／面／文字／ボタンを揃える | `VenueHeader`, `MapCanvas`, `SearchSheet`, `SpotPopup`, `QrMarker`。地図面積、画像の比率・座標変換、ブース位置、検索結果とタップ領域は固定 |
| 投稿／中 | 下線一覧、42pxアバター、13px本文、青54pxFAB。線・面・角丸・押下／disabled状態を統一 | `FeedItem`, `PostCreateFab`, `PostFilterFab`, `PostCreateSheet`, `PostFilterSheet`。本文密度、画像比率、投稿先選択・送信状態、青の操作意味を維持 |
| 共通ナビ／中 | 絵文字・11px・青選択。文字、選択状態、safe area、操作領域を規則化 | `shared/ui/BottomNav.tsx`。配置・画面遷移を維持。アイコン置換は別途ラベル／視認性検証 |
| スタンプ／基準 | 既に局所的な部品体系あり。背景値の不一致は仕様としてどちらを採用するか決める | `stamprally.css`, `Button`, `Header`, `PageContainer`, `StepProgress`, `i18n/context.tsx`。scope内文字サイズ上書きを全体へ一気に適用しない |

### 共通デザイントークン候補

- 面：`surface-app`、`surface-card`、`surface-warm`。暖色基準を `#fffdf8` と `#f7f3ec` のどちらにするか先に決める。
- 文字：`text-primary: #315563`、`text-secondary: #5a7379`、線：`border-soft: #dcdccf` を候補とし、背景とのコントラストを確認する。
- ブランド色とカテゴリ意味色は別tokenとする。地図の青／ピンク／緑／橙、QRの状態色、ステージ青／橙・現在時刻赤を一律に赤や青緑へ置換しない。
- 形：`radius-control: 999px`、card12px、panel16px、FAB円形。操作領域44px以上を目安にする。
- 余白：4／8px単位を基本とし、見出し・本文・操作群ごとの間隔を定義。地図ラベル等は情報密度による例外とする。
- 文字：本文16px前後、補助14px前後、見出し24〜30pxを基準候補とし、地図内の10〜11px等は限定例外。日本語・英語の折返し、行間、長い名称を確認する。
- 状態：focus、active、selected、disabled、success、error、reduced motionを共通に定義する。

### 小さく再利用できる部品

1. Button：既存スタンプ `Button` の44px・pill・押下／disabledを基礎に、用途別色variantを保つ。
2. SurfaceCard：白／暖色面・線・12〜16px角丸・内側余白を検索、ポップアップ、フォームで限定利用。
3. FilterChip：既存 `GenreChipRow` のpillと選択状態を基礎に、カテゴリ色を呼出側から渡す。
4. FloatingActionButton：既存54px円形を共通化し、投稿／検索のラベル・色・配置を維持。
5. SectionHeading：見出しの文字規則を共有。`Sprig` 装飾は任意で、通常の地図・一覧では装飾なしから始める。

スタンプ部品の全面移設や大規模な画面構造変更は不要。既存の `shared/ui/` へ必要な部品だけ段階的に追加する。

### 将来の `docs/design.md` 構成案

1. **目的・適用範囲**：スタンプのトーンを基準にすること、地図座標・操作・カテゴリ意味を守る原則。
2. **ブランド資産**：ロゴ／線画／花葉の用途、画像比率、装飾を使う節目と使わない高密度画面。
3. **色token**：surface／text／border／stateとカテゴリ色の意味表、文字と白文字ボタンのコントラスト基準。
4. **文字規則**：サイズ・太さ・行間、長い店名／多言語折返し、小ラベルの例外条件。
5. **余白・形状**：4／8px系、pill／card／panel／FAB、操作領域、safe area。
6. **部品と状態**：Button／Card／Chip／FAB／Heading／Progress、focus・selected・disabled・error等。
7. **画面別規則**：地図表示面積と座標固定、イベント時刻・カテゴリ、投稿密度、スタンプの基準部品。
8. **アクセシビリティ**：色以外の状態手掛かり、文字拡大、reduced motion、小画面・短い画面。
9. **導入・検証手順**：token追加→限定部品→画面単位の比較。地図検索・ピンタップ、カテゴリ、投稿フォームを回帰確認。

導入順は、tokenの合意 → イベント一覧の文字・操作 → 投稿の操作部品 → 地図周辺UI → 必要な節目だけ装飾、とする。
地図は利用頻度上の優先度は高いが、座標・表示面積に影響しない小さな単位で進める。

## 検証・反映記録

- `npm run build`：成功（TypeScript・Vite・PWA生成）。既存の500kB超バンドル警告あり。
- `npm run lint`：成功。既存の `DevClockContext.tsx` と `MapProviderContext.tsx` のFast Refresh警告2件あり。
- `git diff --check`：成功。
- production buildをlocalhostで配信し、隔離headless Chromium／新規context、390×844、JA・ENで検証。ユーザーの通常ブラウザは使用しない。
- グルメ66、紹介PR31、商品販売22、プレイランド5、特産品10、展示体験9の計143件：店名、順序、説明、ジャンル画像を照合し、単独通し番号がないことを確認。
- 「1：orangesデリカキッチン」のブース番号を維持。スクリーンショットでも単独番号の削除と店名・説明・アイコンを目視確認。
- ステージの日付・時刻表示、日英の修正済み安全案内、スクロール→同意→遊び方→登録の遷移、手順1〜5の維持を確認。JavaScript例外なし。
- テストからの外部通信は遮断、API書き込みは0件。browser/context/serverをfinallyで終了。一時検証スクリプト・画像は作業完了時に削除する。
- 今回変更していないD1処理・投稿機能全体・全言語の実機表示は未検証。多言語監査はソースと参照経路の調査であり、73言語すべてのネイティブ校正ではない。
- 最新 `origin/main` を再fetchし、変更前HEADと一致することを確認。ユーザー指定によりmainへ直接commit・pushする。commit hashとCloudflareの実際の反映結果は最終報告に記載する。

監査結果のために事実不明の文言やデザインを実装することはしない。
