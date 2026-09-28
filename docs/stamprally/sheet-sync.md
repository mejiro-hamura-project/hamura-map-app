# 統合appの任意Sheets連携

スタンプラリーの登録・取得・合言葉・交換は端末内の保存で完結します。`VITE_SHEET_WEBHOOK_URL` が空の場合は送信やキューの再送を行いません。統合によって送信仕様やGASのコードは変更していません。

## 設定口

統合appで使う環境変数名は従来と同じ `VITE_SHEET_WEBHOOK_URL` です。ローカルで設定する場合のファイルは `app/.env.local`、空の設定例は `app/.env.example` にあります。Viteのビルド時に読み込まれるため、値を変更した場合は開発サーバーの再起動または再ビルドが必要です。環境ファイルはGitに含めません。

GAS / Google Sheets実接続は未確認です。このrepository整理では実際のURL設定やGAS・Sheetsへの操作を行っていません。運営が連携を利用する場合は、検証用endpointと現在のGASを確認してから設定してください。Cloudflareへのbuild-time設定は [公開構成](../cloudflare-workers-static-assets.md) を参照してください。

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

## GASコード例の保全

以下は旧runtimeの設定説明から保全したコード例です。repository整理でコードは変更しておらず、現在のGAS実装との一致や実接続は未検証です。登録だけを最初の既存シートへ追加し、進行・交換イベントには行を追加しません。

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // 参加者登録以外（旧仕様の進行状況・景品交換イベントなど）は何もせず正常応答だけ返す。
    // participantNumber が無いリクエストは登録イベントとして扱わない。
    if (typeof data.participantNumber === 'undefined') {
      return jsonOut(200, { success: true });
    }

    // 新しいシートは作らず、このスプレッドシートの最初の（既存の）シートを使う。
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['参加者番号', '性別', '年齢', '学生', '学生の区分']);
    }

    sheet.appendRow([
      data.participantNumber,
      data.gender || '',
      typeof data.age === 'number' ? data.age : '',
      data.student || '',
      data.studentCategory || '',
    ]);

    return jsonOut(200, { success: true });
  } catch (err) {
    // Apps Script のウェブアプリは仕様上つねにHTTP 200で応答するため、失敗時も
    // ステータスコード自体は200のままですが、レスポンス本文は success:false にします。
    return jsonOut(500, { success: false });
  }
}

function jsonOut(statusCode, obj) {
  // ContentService は任意のHTTPステータスコードを設定できない（Apps Scriptの
  // ウェブアプリは常に200を返す仕様）ため、statusCode はレスポンス本文の参考用。
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

## 検証用Sheets / GASを準備する場合

1. 運営が検証用スプレッドシートを用意し、**拡張機能 → Apps Script** から紐付くscriptを開きます。既存scriptがある場合は内容を確認してからコード例を適用します。
2. 保存後、**デプロイ → 新しいデプロイ → ウェブアプリ** を選び、実行ユーザーを自分、アクセスできるユーザーを全員に設定します。初回は自分が管理するscriptと要求権限を確認して承認し、発行されたWeb App URLを控えます。
3. コード変更時は **デプロイを管理 → 編集 → 新しいバージョン → デプロイ** を行います。保存だけでは公開中のコードは更新されません。
4. A〜E列は参加者番号・性別・年齢・学生・学生の区分です。旧列構成のシートを使う場合は、既存データを保全して列を合わせるか、空の検証シートで確認します。参加者番号は端末内で発行するため、全端末で一意な番号ではありません。
5. `app/.env.example` を `app/.env.local` としてコピーし、`VITE_SHEET_WEBHOOK_URL=` に実値を設定してViteを再起動します。Cloudflareではbuild-time変数を設定し、再ビルドが必要です。実値はGitへ含めません。
6. 検証環境で登録し、`/stamprally/rally` へ進めることと、シートに入力どおりの5列が追加されることをそれぞれ確認します。アプリの完了表示だけでは送信成功を判断できません。

全員アクセスのendpointはURLを知る人が送信できる構成です。利用する場合は運営がアクセス範囲とデータ管理を確認してください。この手順は今回GASを作成・公開したことを意味しません。

## 反映されない場合の確認

- `VITE_SHEET_WEBHOOK_URL` がbuild時に設定されていたか、対象のCloudflare build環境を確認します。設定後の再ビルドが必要で、runtime Secretだけでは反映されません。
- URLがWeb Appの `/exec` endpointか確認します。`sheetApi.ts` の形式検査に通らない値は未設定扱いです。
- ブラウザconsoleの `[sheetApi]` メッセージで未設定・形式不正を確認します。実値や参加者情報をログへ追加しないでください。
- GAS側の公開バージョン・アクセス設定と、Apps Scriptの「実行数」からエラーを確認します。`no-cors` のためアプリからGASの応答内容は読めません。
- 通信がrejectした場合は、次回ラリー入場時またはonline復帰時にキューの再送を試みます。シート側で重複行の有無も確認します。

## イベント終了後の管理

運営が定めた保存期間を過ぎたら、権限を持つ管理者がシートの対象データ削除、不要なスプレッドシートの削除、Apps Scriptのデプロイ無効化（デプロイを管理 → アーカイブ）を判断します。このrepository整理では参加者データや外部デプロイを変更しません。
