import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function queryRows(data) {
  if (!Array.isArray(data) || !data.every((item) => item && Array.isArray(item.results))) {
    throw new Error('Wrangler d1 execute --json の出力を指定してください。');
  }
  const rows = data.flatMap((item) => item.results);
  if (!rows.every((row) => row && typeof row === 'object' && !Array.isArray(row))) {
    throw new Error('SQLの取得結果が行データではありません。');
  }
  return rows;
}

function cell(value) {
  let text = value == null ? '' : String(value);
  // 本文を表計算ソフトで開いても数式として実行しない。元のJSONは加工しない。
  if (typeof value === 'string' && /^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export function toCsv(rows) {
  if (!rows.length) return '\ufeff';
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return '\ufeff' + [columns.map(cell).join(','), ...rows.map((row) => columns.map((key) => cell(row[key])).join(','))].join('\r\n') + '\r\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [, , input, output] = process.argv;
  if (!input || !output || process.argv.length !== 4) {
    console.error('Usage: node scripts/data/export-csv.mjs input.json output.csv');
    process.exitCode = 1;
  } else {
    try {
      const rows = queryRows(JSON.parse(fs.readFileSync(input, 'utf8').replace(/^\ufeff/, '')));
      fs.writeFileSync(output, toCsv(rows), { encoding: 'utf8', flag: 'wx' });
      console.log(`CSVを${rows.length}行出力しました。`);
    } catch {
      console.error('CSVを作成できませんでした。入力形式・ファイルの権限・出力先の重複を確認してください。');
      process.exitCode = 1;
    }
  }
}
