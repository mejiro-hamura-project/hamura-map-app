# 出展者詳細への接続条件

参照元 `festival-exhibitors-2026` の `docs/integration-contract.md`（main `d34921bc9215a12a31a8cf7d63f9fcecb31b25d8`）では、詳細ページの `id` queryに公開マスターの `exhibitor_id` と同じ値を渡す契約です。ブース番号や名前による突き合わせは認められていません。

現在の `app/src/mocks/data/stores-venue-1.json` は `style`、`code`、`name`、`genreId`、`detail` のみを持ちます。画面内で作る `store-${style}-${code}` は表示用の一時IDで、正式な `exhibitor_id` ではありません。このため「詳しく見る」はまだ表示しません。

次工程では、公開用マスターに `exhibitor_id` を設定し、メインアプリが読む店舗データに同じ値を含めてください。その値が望月版 `exhibitors[].id` と一致することを確認できたら、`VITE_EXHIBITOR_DETAIL_BASE_URL` を使い、`URL.searchParams.set('id', exhibitorId)` で詳細URLを組み立てられます。店舗データの正本化と配信方法は今回決めません。

望月版の契約書は、GitHub Pagesの公開URLとcross-origin GETも未検証としています。正式データ公開後に確認が必要です。
