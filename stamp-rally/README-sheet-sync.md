# 参加者登録をGoogleスプレッドシートに連携する

登録画面（③）で「参加する」を押した瞬間に、ニックネーム・性別・年代・登録日時を1行として
Googleスプレッドシートに送信します。バックエンドサーバーは使わず、**Google Apps Script を
「ウェブアプリ」として公開する**方法で実現しています。

送信は失敗してもアプリの動作をブロックしません（電波が悪い境内でも、参加者側の進行は
localStorageにローカル保存されるのでアプリは通常通り遊べます。スプレッドシートへの反映が
ベストエフォートになるだけです）。

## 1. スプレッドシートを用意する

1. https://sheets.google.com で新しいスプレッドシートを作成（例：「スタンプラリー参加者登録」）

## 2. Apps Script を貼り付ける

1. スプレッドシートのメニューから **拡張機能 → Apps Script**
2. デフォルトで入っているコードを全部消して、以下を貼り付ける

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('参加者登録')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('参加者登録');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['登録日時', 'ニックネーム', '性別', '年代']);
  }

  var data = JSON.parse(e.postData.contents);

  var genderLabel = { male: '男性', female: '女性', other: 'その他' }[data.gender] || data.gender;
  var ageLabel = {
    student: '学生', '10s': '10代', '20s': '20代', '30s': '30代',
    '40s': '40代', '50s': '50代', '60plus': '60代以上'
  }[data.ageGroup] || data.ageGroup;

  sheet.appendRow([
    new Date(data.timestamp || Date.now()),
    data.nickname || '',
    genderLabel,
    ageLabel,
  ]);

  return ContentService.createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. 保存（フロッピーアイコン、プロジェクト名は何でもOK）

## 3. ウェブアプリとしてデプロイする

1. 右上の **デプロイ → 新しいデプロイ**
2. 「種類の選択」の歯車アイコン → **ウェブアプリ**
3. 設定:
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員**
4. **デプロイ** をクリック
5. 初回は権限承認を求められます。**アクセスを承認 → Googleアカウントを選択 → 「詳細」→
   「（プロジェクト名）に移動（安全ではありません）」→ 許可**
   （これは自分自身が書いた未公開スクリプトだから出る警告で、Googleに未申請なだけです。問題ありません）
6. 発行された **ウェブアプリのURL**（`https://script.google.com/macros/s/.../exec` の形）をコピー

## 4. アプリ側にURLを設定する

1. `stamp-rally/.env.example` を `stamp-rally/.env` としてコピー
2. `.env` の中の `VITE_SHEET_WEBHOOK_URL=` に、3.で発行したURLを貼り付け
3. 開発サーバーを再起動（`npm run dev`）— 環境変数は起動時にしか読み込まれません
4. アプリの参加者登録画面から実際に登録して、スプレッドシートに1行増えるか確認

## 補足

- Apps Scriptのコードを編集したら、**必ず「デプロイを管理」から新しいバージョンとして再デプロイ**してください。編集しただけでは公開中のURLには反映されません。
- 送信できているか怪しいときは、Apps Scriptエディタの左側「実行数」からログ・エラーを確認できます。
- 「アクセスできるユーザー: 全員」にしているため、理論上はこのURLを知っていれば誰でも行を追加できてしまいます（削除や既存データの閲覧はできません）。荒らし対策をしたい場合は合言葉のようなトークンチェックを追加できるので、必要であれば声をかけてください。
- 今回同期しているのは「登録した瞬間」のデータのみです。「7つ集め終わった」「景品交換した」といった後続イベントも記録したい場合は追加実装できます。
