# 統合appの任意Sheets連携

スタンプラリーの登録・取得・合言葉・交換は端末内の保存で完結します。`VITE_SHEET_WEBHOOK_URL` が空の場合は送信やキューの再送を行いません。統合によって送信仕様やGASのコードは変更していません。

## 設定口

統合appで使う環境変数名は従来と同じ `VITE_SHEET_WEBHOOK_URL` です。ローカルで設定する場合のファイルは `app/.env.local`、空の設定例は `app/.env.example` にあります。Viteのビルド時に読み込まれるため、値を変更した場合は開発サーバーの再起動または再ビルドが必要です。環境ファイルはGitに含めません。

今回の移植では実際のURLを設定しておらず、GAS・Sheets・Cloudflareへの操作も行っていません。運営が連携を利用する場合は、検証用endpointと現在のGASを確認してから設定してください。

## 従来のデータ形式

実装は `app/src/features/stamprally/lib/sheetApi.ts` です。

| 登録payloadのキー | 内容 |
| --- | --- |
| `participantNumber` | この端末で発行した参加者番号 |
| `gender` | 登録選択肢の日本語表記 |
| `age` | 年齢（数値） |
| `student` | はい／いいえ |
| `studentCategory` | 学校区分の日本語表記、該当しない場合は空欄 |

ニックネームとコースは登録payloadに含みません。進行・交換は従来の `event` / `participantId` / `progress` 形式を維持しています。比較元のGAS例は登録payloadだけを行に追加し、進行・交換イベントは記録しません。

送信は従来どおり `POST` / `mode: 'no-cors'` / `text/plain;charset=utf-8` です。レスポンスの本文を読めないため、fetchの完了はシートへの記録成功を保証しません。通信がrejectした場合は `stampRally.sheetSyncQueue.v1` に残し、ラリーの初回入場時と `online` イベントで再送します。再送でGAS側の行が重複する可能性も従来どおりです。

## 保存と引継ぎ

`stampRally.v1`、`stampRally.participantCounter.v1`、`stampRally.sheetSyncQueue.v1` のキーと形式を維持しています。リセットは参加者番号カウンターと再送キューを削除しません。同じoriginの保存データは読み直せますが、別originのデータは自動取得できません。

GASを新規に準備する場合の従来のコード例は [比較用の旧設定説明](../../stamp-rally/README-sheet-sync.md) にあります。旧説明の `stamp-rally/.env` や独立appのビルド先は比較元の記述です。統合appにはこの文書の設定口を使います。旧ディレクトリを削除するPhase 3ではGAS例の保全も確認してください。
