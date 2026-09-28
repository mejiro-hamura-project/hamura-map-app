# 統合スタンプラリーと地図の連携

Phase 1・2で独立ラリーを `app/src/features/stamprally/` に移植しました。実装の正本はこのfeatureです。`stamp-rally/` は変更せず比較・復旧用として残しています。

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

3つの保存キーと元のJSON／数値文字列を維持し、共有storageユーティリティ経由でアクセスします。旧originが異なる場合の自動引継ぎは行いません。任意のSheets設定は [sheet-sync.md](stamprally/sheet-sync.md)、受入結果と残作業は [実装メモ](plans/stamp-rally-unification-v1-implementation-notes.md) を参照してください。
