/**
 * 市民祭りアプリ：口コミ管理シート用 Apps Script
 *
 * - アプリから投稿された口コミを「口コミ」シートに1行ずつ追加する（doPost）
 * - アプリはこのシートの内容を読み込んで表示する（doGet）
 * - 不適切な投稿は、その行の「本文」のセルを選んで削除（Delete キー）するか、行ごと削除すると、
 *   アプリから消える（遅くとも約1分後。アプリを開き直すとすぐ反映）
 *
 * 設定手順は docs/posts/posts-sheet.md を参照。
 */

const SHEET_NAME = '口コミ';
const HEADERS = ['投稿ID', '投稿日時', '投稿先ID', '投稿先', '投稿者ID', '本文'];
const MAX_CAPTION_LENGTH = 200;
const MAX_FIELD_LENGTH = 100;

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

// セルに書く文字列の先頭が = + - @ だと数式として扱われてしまうため、先頭に ' を付けて文字として書く
function asText_(value, maxLength) {
  const text = String(value == null ? '' : value).trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/** アプリが口コミ一覧を読み込む。本文が空の行（運営が削除した行）は返さない */
function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1);
  const posts = rows
    .filter(function (row) {
      return String(row[0]).trim() !== '' && String(row[5]).trim() !== '';
    })
    .map(function (row) {
      return {
        id: String(row[0]),
        createdAt: row[1] instanceof Date ? row[1].toISOString() : String(row[1]),
        spotId: String(row[2]),
        userId: String(row[4]),
        caption: String(row[5]),
      };
    });
  return json_({ posts: posts });
}

/** アプリから口コミが投稿されたとき、シートに1行追加する */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const id = asText_(body.id, MAX_FIELD_LENGTH);
    const spotId = asText_(body.spotId, MAX_FIELD_LENGTH);
    const caption = asText_(body.caption, MAX_CAPTION_LENGTH);
    if (!id || !spotId || !caption) return json_({ ok: false });

    const sheet = getSheet_();
    // 同じ投稿が二重に送られても1行だけにする
    const exists = sheet.getRange('A:A').createTextFinder(id).matchEntireCell(true).findNext();
    if (exists) return json_({ ok: true });

    sheet.appendRow([
      id,
      new Date(),
      spotId,
      asText_(body.spotName, MAX_FIELD_LENGTH),
      asText_(body.userId, MAX_FIELD_LENGTH),
      caption,
    ]);
    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false });
  } finally {
    lock.releaseLock();
  }
}
