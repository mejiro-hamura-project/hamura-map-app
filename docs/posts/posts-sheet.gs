/**
 * 市民祭りアプリ：口コミ管理シート用 Apps Script
 *
 * - アプリから投稿された口コミを「口コミ」シートに1行ずつ追加する（doPost）
 * - アプリはこのシートの内容を読み込んで表示する（doGet）
 * - 不適切な投稿は、その行の「本文」のセルを選んで削除（Delete キー）するか、行ごと削除すると、
 *   アプリから消える（遅くとも約1分後。アプリを開き直すとすぐ反映）
 * - 「いいね」は「いいね」シートに「どの口コミに・どの端末が」押したかを1行ずつ記録し、読み込み時に数える
 *   （同じ端末が同じ口コミに押せるのは1回まで。もう一度押すと取り消し＝行を消す）
 *
 * 設定手順は docs/posts/posts-sheet.md を参照。
 */

const SHEET_NAME = '口コミ';
const HEADERS = ['投稿ID', '投稿日時', '投稿先ID', '投稿先', '投稿者ID', '本文'];
const LIKE_SHEET_NAME = 'いいね';
const LIKE_HEADERS = ['投稿ID', '押した端末のID', '日時'];
const MAX_CAPTION_LENGTH = 200;
const MAX_FIELD_LENGTH = 100;

function getSheetByName_(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getSheet_() {
  return getSheetByName_(SHEET_NAME, HEADERS);
}

function getLikeSheet_() {
  return getSheetByName_(LIKE_SHEET_NAME, LIKE_HEADERS);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

// セルに書く文字列の先頭が = + - @ だと数式として扱われてしまうため、先頭に ' を付けて文字として書く
function asText_(value, maxLength) {
  const text = String(value == null ? '' : value).trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/**
 * アプリが口コミ一覧を読み込む。本文が空の行（運営が削除した行）は返さない。
 * 各口コミの「いいね」の数と、問い合わせてきた端末（?userId=）が押しているかも一緒に返す
 */
function doGet(e) {
  const userId = String((e && e.parameter && e.parameter.userId) || '').slice(0, MAX_FIELD_LENGTH);
  const likeCounts = {};
  const likedByUser = {};
  getLikeSheet_()
    .getDataRange()
    .getValues()
    .slice(1)
    .forEach(function (row) {
      const postId = String(row[0]);
      if (!postId) return;
      likeCounts[postId] = (likeCounts[postId] || 0) + 1;
      if (userId && String(row[1]) === userId) likedByUser[postId] = true;
    });

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
        likeCount: likeCounts[String(row[0])] || 0,
        liked: likedByUser[String(row[0])] === true,
      };
    });
  return json_({ posts: posts });
}

/** 「いいね」を記録する（liked=true）／取り消す（liked=false）。同じ端末・同じ口コミは1行だけ */
function setLike_(body, liked) {
  const postId = String(body.postId == null ? '' : body.postId).trim().slice(0, MAX_FIELD_LENGTH);
  const userId = String(body.userId == null ? '' : body.userId).trim().slice(0, MAX_FIELD_LENGTH);
  if (!postId || !userId) return json_({ ok: false });

  const sheet = getLikeSheet_();
  const rows = sheet.getDataRange().getValues();
  // 下の行から消していく（上から消すと行番号がずれるため）
  let exists = false;
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === postId && String(rows[i][1]) === userId) {
      if (liked && !exists) {
        exists = true;
      } else {
        sheet.deleteRow(i + 1);
      }
    }
  }
  if (liked && !exists) sheet.appendRow([asText_(postId, MAX_FIELD_LENGTH), asText_(userId, MAX_FIELD_LENGTH), new Date()]);
  return json_({ ok: true });
}

/** アプリから口コミが投稿されたとき、シートに1行追加する。「いいね」の記録・取り消しもここで受ける */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.type === 'like') return setLike_(body, true);
    if (body.type === 'unlike') return setLike_(body, false);

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
