import assert from 'node:assert/strict';
import { test } from 'node:test';
import { queryRows, toCsv } from './export-csv.mjs';

test('Wrangler result blocks become UTF-8 BOM CSV with quoted Japanese and newlines', () => {
  const rows = queryRows([{ results: [{ id: 'sample', caption: '感想,"引用"\n2行目', age: 20 }] }]);
  assert.equal(toCsv(rows), '\ufeff"id","caption","age"\r\n"sample","感想,""引用""\n2行目","20"\r\n');
});
test('untrusted formula strings are neutralized without changing source rows', () => {
  const rows = [{ caption: '=1+1', other: ' \t@SUM(1)', number: -2 }];
  const csv = toCsv(rows);
  assert.ok(csv.includes('"\'=1+1"')); assert.ok(csv.includes('"\' \t@SUM(1)"'));
  assert.ok(csv.includes('"-2"')); assert.equal(rows[0].caption, '=1+1');
});
test('empty results are allowed and unrelated JSON is rejected', () => {
  assert.equal(toCsv(queryRows([{ results: [] }])), '\ufeff');
  assert.throws(() => queryRows({ token: 'synthetic' }));
  assert.throws(() => queryRows([{ results: [null] }]));
});
