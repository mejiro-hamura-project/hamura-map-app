import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { STAMP_QR_VALUES, COURSES, getAnswerForCourse } from '../src/data/checkpoints';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'qrcodes');

interface PositionCard {
  position: number;
  qrValue: string;
  dataUrl: string;
}

async function main() {
  await mkdir(outDir, { recursive: true });

  // QRコードはキーワードごとではなく、7個の「位置」だけを表す共通コード。
  const cards: PositionCard[] = [];
  for (let i = 0; i < STAMP_QR_VALUES.length; i++) {
    const qrValue = STAMP_QR_VALUES[i];
    const filePath = path.join(outDir, `${qrValue}.png`);
    await QRCode.toFile(filePath, qrValue, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const dataUrl = await QRCode.toDataURL(qrValue, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    cards.push({ position: i + 1, qrValue, dataUrl });
    console.log(`generated ${filePath}`);
  }

  // 運営が「この位置に置いたQRは、お題によってどの文字になるか」を確認できるよう、
  // 全5お題の文字対応表もあわせて出力する（アプリ側の判定ロジックには使わない）。
  const keywordRows = COURSES.map((course) => ({
    text: getAnswerForCourse(course.id)?.text ?? '(不明)',
    chars: course.checkpoints.map((c) => c.char),
  }));

  const html = buildPrintSheet(cards, keywordRows);
  const printPath = path.join(outDir, 'print.html');
  await writeFile(printPath, html, 'utf-8');
  console.log(`generated ${printPath}`);
}

function buildPrintSheet(
  cards: PositionCard[],
  keywordRows: { text: string; chars: string[] }[],
) {
  const cardsHtml = cards
    .map(
      (c) => `
      <div class="card">
        <img src="${c.dataUrl}" alt="${c.qrValue}" />
        <p class="value">${c.qrValue}</p>
        <p class="position">設置場所 No.${c.position}（${c.position}文字目用）</p>
      </div>`,
    )
    .join('\n');

  const tableRowsHtml = keywordRows
    .map(
      (row) => `
      <tr>
        <th>${row.text}</th>
        ${row.chars.map((char) => `<td>${char}</td>`).join('')}
      </tr>`,
    )
    .join('\n');

  const tableHeaderHtml = cards.map((c) => `<th>${c.position}文字目</th>`).join('');

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>スタンプラリー QRコード印刷用シート</title>
<style>
  body { font-family: sans-serif; margin: 24px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .card { border: 1px solid #ccc; border-radius: 12px; padding: 16px; text-align: center; page-break-inside: avoid; }
  .card img { width: 100%; max-width: 240px; }
  .value { font-weight: bold; margin: 8px 0 2px; }
  .position { color: #555; margin: 0; }
  table { border-collapse: collapse; margin-top: 16px; }
  th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: center; }
  @media print {
    .card { border: 1px dashed #999; }
  }
</style>
</head>
<body>
  <h1>スタンプラリー QRコード（設置用・印刷用）</h1>
  <p>
    QRコードは全5つのお題で共通の7個だけです（お題ごとに別のQRコードは無く、
    「何文字目か」だけを表します）。実際の設置場所は運営で決めてください。
  </p>
  <div class="grid">
    ${cardsHtml}
  </div>

  <h2>参考：お題ごとの文字対応表（アプリが自動判定するため設置には不要）</h2>
  <table>
    <thead>
      <tr><th>お題</th>${tableHeaderHtml}</tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
  </table>
</body>
</html>
`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
