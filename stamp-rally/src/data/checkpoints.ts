import type { Checkpoint } from '../types';

// TODO: 実際のQR値・文字・お題の言葉は運営確定後に差し替え（現在は仮）
// 仮のお題: 「たなばたまつり」（7文字）
export const CHECKPOINTS: Checkpoint[] = [
  { id: 1, qrValue: 'STAMP_01', char: 'つ', phraseIndex: 5 },
  { id: 2, qrValue: 'STAMP_02', char: 'な', phraseIndex: 1 },
  { id: 3, qrValue: 'STAMP_03', char: 'ま', phraseIndex: 4 },
  { id: 4, qrValue: 'STAMP_04', char: 'り', phraseIndex: 6 },
  { id: 5, qrValue: 'STAMP_05', char: 'た', phraseIndex: 3 },
  { id: 6, qrValue: 'STAMP_06', char: 'た', phraseIndex: 0 },
  { id: 7, qrValue: 'STAMP_07', char: 'ば', phraseIndex: 2 },
];

export const TOTAL_STAMPS = CHECKPOINTS.length;

export function getPhraseCheckpoints(): Checkpoint[] {
  return [...CHECKPOINTS].sort((a, b) => a.phraseIndex - b.phraseIndex);
}

export function findCheckpointByQrValue(qrValue: string): Checkpoint | undefined {
  return CHECKPOINTS.find((c) => c.qrValue === qrValue);
}

export function getCorrectPhrase(): string {
  return getPhraseCheckpoints()
    .map((c) => c.char)
    .join('');
}
