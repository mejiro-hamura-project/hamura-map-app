import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { CHECKPOINTS } from '../src/data/checkpoints';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'qrcodes');

async function main() {
  await mkdir(outDir, { recursive: true });

  const cards: { id: number; qrValue: string; char: string; dataUrl: string }[] = [];

  for (const checkpoint of CHECKPOINTS) {
    const filePath = path.join(outDir, `${checkpoint.qrValue}.png`);
    await QRCode.toFile(filePath, checkpoint.qrValue, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const dataUrl = await QRCode.toDataURL(checkpoint.qrValue, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    cards.push({ id: checkpoint.id, qrValue: checkpoint.qrValue, char: checkpoint.char, dataUrl });
    console.log(`generated ${filePath}`);
  }

  const html = buildPrintSheet(cards);
  const printPath = path.join(outDir, 'print.html');
  await writeFile(printPath, html, 'utf-8');
  console.log(`generated ${printPath}`);
}

function buildPrintSheet(cards: { id: number; qrValue: string; char: string; dataUrl: string }[]) {
  const cardsHtml = cards
    .map(
      (c) => `
      <div class="card">
        <img src="${c.dataUrl}" alt="${c.qrValue}" />
        <p class="value">${c.qrValue}</p>
        <p class="char">文字：${c.char}（No.${c.id}）</p>
      </div>`,
    )
    .join('\n');

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
  .char { color: #555; margin: 0; }
  @media print {
    .card { border: 1px dashed #999; }
  }
</style>
</head>
<body>
  <h1>スタンプラリー QRコード（設置用・印刷用）</h1>
  <p>※ 実際の設置場所・仮の文字/QR値は checkpoints.ts を確認・差し替えてください。</p>
  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>
`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
