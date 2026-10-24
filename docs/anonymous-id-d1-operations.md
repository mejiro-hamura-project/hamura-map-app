# 共通匿名ID・D1運用手順（2026-10-25）

対象は `integration/stamp-rally-preview`。口コミとスタンプラリーは同じ端末の匿名UUIDを使い、同じD1の `posts` と `participants` に保存する。実D1への接続・remote migration・secret設定・本番公開は今回行わない。

## 識別と端末保存

- 共通IDはUUID v4。`app.anonymousId.v1` にJSON文字列として保存し、口コミ・ラリーのどちらが先でも再利用する。
- `crypto.randomUUID()` 非対応時は `crypto.getRandomValues()` でUUID v4を生成する。通常のlocalStorageが利用できれば、画面遷移・再読み込み・ブラウザ再起動・PWA更新後も継続する。
- localStorageが禁止されている場合は同じページ内だけIDを保持する。ブラウザデータ消去・別origin・プライベートブラウズ終了後などの保持は保証しない。
- 旧テスト用の `posts.deviceUserId`、`stampRally.v1` は移行しない。ラリーは `stampRally.v2` を使用し、表示用 `stampRally.participantCounter.v1` は維持する。無関係なlocalStorageは削除しない。
- ラリーの `participantId` は共通UUID。表示用参加者番号はD1の識別に使用しない。
- サーバーはUUIDを小文字に揃え、共通の `POST_RATE_LIMIT_SECRET` でHMAC-SHA256を生成する。`posts.author_hash` と `participants.participant_key` が同じ内部キーになる。生UUIDはDBに保存せず、公開APIにも返さない。
- UUIDは本人認証ではない。利用者がデータを消去・書換すると別の利用者として振る舞える。完全な荒らし防止や景品交換の本人確認を保証しない。

## 保存・通信契約

| 対象 | 保存・API |
| --- | --- |
| 口コミ | `POST /api/posts` に共通ID・投稿先・本文を送り、従来のIdempotency-Keyを使用。公開GETは内部キーを返さない |
| 投稿制限 | 同じ匿名IDから60秒5件。同一IPの別IDは独立。HMAC化する対象はIPではなく共通UUID |
| ラリー | `POST /api/stamprally/participant` に登録日時、性別、年齢、学生区分、学校区分、コース、交換日時の完全なsnapshotを送る |
| participants | 内部キーが主キー。交換snapshotが先着しても作成でき、古い登録の再送で交換済みを未交換へ戻さない |
| 送らない情報 | ニックネーム、画面用参加者番号、個別スタンプ取得履歴、解答途中の状態 |
| 端末での継続 | 登録・QR取得・解答・交換はlocalStorageで完結。D1失敗・未接続でも進行を止めない |
| 再送 | 最新の登録／交換snapshot一件だけを `stampRally.d1Sync.v1` に保持し、起動・オンライン復帰時に再送。サーバーへの必達保証は設けない |

GAS通信・旧Sheets送信キューの利用は廃止した。実際のGASやSheetsは削除しない。いいね表示・ボタン・送信は廃止し、写真投稿・管理者Web画面は追加しない。APIはno-store、PWAは `/api` をNetworkOnlyとしてSPA fallbackから除外する。

**D1の交換日時は端末からの補助記録。正式な現地管理は紙・Googleフォーム等で行う。** 公開の参加者取得APIは存在せず、D1記録を利用者が閲覧する画面も設けない。

## ローカル検証

`app/` で既存のローカル設定を使う。実DB IDは記載しない。

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run test:identity
npm.cmd run test:stamprally
npm.cmd run check:worker
npm.cmd run test:posts:unit
npm.cmd run test:posts:integration
node --test scripts/data/export-csv.test.mjs
```

結合試験は専用runtimeのローカルD1にmigrationを適用し、再適用時に既適用分を重複実行しないことを検証する。高件数fixtureはAPI試験だけに使い、ブラウザ前に取り除く。通常ブラウザ・既存開発サーバーは使用しない。

## 大嶋先生の環境で後日接続する手順

以下は運営が対象環境を確定してから行う将来の操作であり、今回の実行内容ではない。

1. Cloudflareのログイン先、対象Worker、対象DB名、Previewか本番かを確定する。受付・同期フラグは停止状態のままにする。
2. 大嶋先生のアカウントでD1を作成し、同じアカウントの対象Worker環境にbinding `DB` を設定する。DB ID・実secretはGitへ追加しない。`wrangler.local.jsonc` を公開しない。
3. `0001_posts.sql`、後続の参加者migrationを番号順に適用する。既存の0001を編集・再作成しない。初期テストデータを実DBへ投入しない。
4. 共通secret `POST_RATE_LIMIT_SECRET` を十分なランダム値（32文字以上）で設定する。両機能で同じ値を使う。途中変更すると内部キーが変わり、過去の関連付けや直近の制限を引き継がない。
5. PRの承認と対象コードの公開を別途完了してから、投稿を有効にする環境だけ `POSTS_ENABLED=true`、ラリー補助保存を有効にする環境だけ `RALLY_SYNC_ENABLED=true` を設定する。DB・secretが不足している場合はAPIが503となる。
6. API・非表示・再公開・再送・画面継続を運営の検証データで受入し、アクセス権・保持期限・非表示担当を決めてから利用開始する。

remote migrationの形式は以下。DB名・設定ファイルは確認済みのものへ置き換える。今回これらは実行しない。

```powershell
npx.cmd wrangler d1 migrations list <確認済みDB名> --remote --config <対象環境の設定ファイル>
npx.cmd wrangler d1 migrations apply <確認済みDB名> --remote --config <対象環境の設定ファイル>
```

[Cloudflare migrations仕様](https://developers.cloudflare.com/d1/reference/migrations/)では、適用済みmigrationは管理テーブルに記録される。コマンドはbinding名でも指定できるが、環境の取り違えを避けるため運営手順では実DB名を確認して使う。

## 不正投稿の非表示・再公開

D1 Dashboardで対象DBを選び、まず投稿ID・本文・日時を確認する。以下の `確認済み投稿ID` は実値へ置き換える。通常運用ではDELETEせず、hiddenを使う。

```sql
SELECT id, spot_id, caption, created_at, status
FROM posts ORDER BY created_at DESC, id DESC LIMIT 50;

SELECT id, spot_id, caption, created_at, status
FROM posts WHERE id = '確認済み投稿ID';

UPDATE posts SET status = 'hidden'
WHERE id = '確認済み投稿ID' AND status = 'visible';

SELECT id, status FROM posts WHERE id = '確認済み投稿ID';
```

再公開は責任者が本文を再確認してから行う。

```sql
UPDATE posts SET status = 'visible'
WHERE id = '確認済み投稿ID' AND status = 'hidden';
SELECT id, status FROM posts WHERE id = '確認済み投稿ID';
```

同じSQLをWranglerで実行する場合は、確認したSQLだけをローカルの `moderation.sql` に保存し、次の形式を使う。本文・内部キー・request_keyをログやチャットへ貼らない。公開画面への反映は次回取得・手動更新時であり、開いたままの画面への即時push更新ではない。

```powershell
npx.cmd wrangler d1 execute <確認済みDB名> --remote --config <対象環境の設定ファイル> --file moderation.sql
```

完全削除が必要な場合も、最初に同じIDのSELECTで対象を確認し、責任者の判断で単一IDへ限定する。公開削除APIは設けない。

## SQL・JSON・CSVの取り出し

出力先はリポジトリの外にある運営専用フォルダーにする。以下はそのフォルダーを出力先として確定した後、`app/` から実行する例。実データをGit・公開URLへ置かない。

```powershell
# テーブルをSQLとして取り出す（バックアップには内部キーも含まれる）
npx.cmd wrangler d1 export <確認済みDB名> --remote --config <対象環境の設定ファイル> --table posts --table participants --output <運営専用フォルダー>/festival.sql

# 運営が必要な列だけをJSON取得する。PowerShell 7のUTF-8出力を使用する。
npx.cmd wrangler d1 execute <確認済みDB名> --remote --config <対象環境の設定ファイル> --command "SELECT id,spot_id,caption,created_at,status FROM posts ORDER BY created_at DESC,id DESC" --json | Set-Content -Encoding utf8 <運営専用フォルダー>/posts.json
npx.cmd wrangler d1 execute <確認済みDB名> --remote --config <対象環境の設定ファイル> --command "SELECT registered_at,gender,age,is_student,student_category,course_id,exchanged_at FROM participants ORDER BY registered_at" --json | Set-Content -Encoding utf8 <運営専用フォルダー>/participants.json

# CSVへ変換（既存の出力ファイルは上書きしない）
node scripts/data/export-csv.mjs <運営専用フォルダー>/posts.json <運営専用フォルダー>/posts.csv
node scripts/data/export-csv.mjs <運営専用フォルダー>/participants.json <運営専用フォルダー>/participants.csv
```

CSVはUTF-8 BOM付き、引用符・改行をエスケープする。表計算ソフトで数式になり得る文字列は先頭へアポストロフィを付け、元のJSONは加工しない。内部キーでの関連付けが必要なら、権限のある運営者だけが `posts.author_hash = participants.participant_key` でSQL結合する。通常の集計CSVには内部キーを含めない。

コマンドの選択肢は同梱Wrangler 4.142.0のhelpと[公式D1コマンド](https://developers.cloudflare.com/d1/wrangler-commands/)で確認した。

## アクセス制限とイベント終了後の整理

- 登録情報は性別・年齢・学校区分を含む。D1のDashboard、SQL実行、secret、exportファイルへのアクセスは運営者に限定し、必要なCloudflare権限だけを割り当てる。
- ブラウザへsecretやDB管理権限を渡さない。参加者の公開一覧・取得API、管理者ログイン画面は追加しない。
- 運営はイベント終了前に保存の目的・責任者・削除予定日を決める。集計は必要な列だけで行い、不要な個別登録データを残さない。
- 終了後はまず `RALLY_SYNC_ENABLED=false` として新しい補助記録を止める。集計・必要な保存を確認した後、対象期間をSELECTで確認してから同じ条件で削除する。

```sql
SELECT COUNT(*) FROM participants
WHERE registered_at < '確認済みの削除境界日時'
  AND strftime('%Y-%m-%dT%H:%M:%fZ', '確認済みの削除境界日時') = '確認済みの削除境界日時';
-- 対象件数・期間を確認した運営者だけが実行する
DELETE FROM participants
WHERE registered_at < '確認済みの削除境界日時'
  AND strftime('%Y-%m-%dT%H:%M:%fZ', '確認済みの削除境界日時') = '確認済みの削除境界日時';
SELECT COUNT(*) FROM participants
WHERE registered_at < '確認済みの削除境界日時'
  AND strftime('%Y-%m-%dT%H:%M:%fZ', '確認済みの削除境界日時') = '確認済みの削除境界日時';
```

削除境界は運営が決めたUTC ISO日時（ミリ秒3桁、末尾Z）へ全箇所を置換する。未置換・不正な日時では上記の形式確認条件により対象ゼロとなる。運営用JSON・CSV・SQLの複製にも同じ保持期限を適用する。D1の復旧履歴やバックアップの保持は別途確認し、行削除を既存バックアップの即時消去とは扱わない。口コミの完全削除やDB自体の削除は別の運営判断とし、今回の作業では行わない。
