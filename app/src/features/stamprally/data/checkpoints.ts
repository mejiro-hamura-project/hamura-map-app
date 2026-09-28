import type { Checkpoint, Course } from '../types';
import { NORMAL_KEYWORDS, isElementaryKeyword, type AnswerDefinition } from './answers';

// QRコードは「お題の何文字目か（位置）」だけを表す共通の7種類。キーワードごとに
// 別のQRコードは用意しない。position-N を読み取ると、参加者に割り当てられた
// お題（コース）のN文字目が表示される。
export const STAMP_QR_VALUES: readonly string[] = Array.from(
  { length: 7 },
  (_, i) => `stamp-rally-position-${i + 1}`,
);

function buildCourse(courseNumber: number, answer: AnswerDefinition): Course {
  const chars = [...answer.text];
  const checkpoints: Checkpoint[] = chars.map((char, i) => ({
    id: (courseNumber - 1) * chars.length + i + 1,
    qrValue: STAMP_QR_VALUES[i],
    char,
    phraseIndex: i,
  }));
  return { id: courseNumber, answerId: answer.id, checkpoints };
}

export const COURSES: Course[] = NORMAL_KEYWORDS.map((answer, i) => buildCourse(i + 1, answer));

export const TOTAL_STAMPS = COURSES[0].checkpoints.length;

export function getCourseById(courseId: number): Course | undefined {
  return COURSES.find((c) => c.id === courseId);
}

export function getAnswerForCourse(courseId: number): AnswerDefinition | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  return NORMAL_KEYWORDS.find((a) => a.id === course.answerId);
}

const ELEMENTARY_SAFE_COURSE_IDS = COURSES.filter((c) => {
  const answer = NORMAL_KEYWORDS.find((a) => a.id === c.answerId);
  return answer ? isElementaryKeyword(answer) : false;
}).map((c) => c.id);

const ALL_COURSE_IDS = COURSES.map((c) => c.id);

// 参加者に割り当てるコースを1つ、ランダムに選ぶ。
// 小学生（elementaryOnly）には、答えに漢字を含まない（ひらがな表示と一致する）コースだけを割り当てる。
export function pickRandomCourseId(elementaryOnly: boolean): number {
  const pool = elementaryOnly ? ELEMENTARY_SAFE_COURSE_IDS : ALL_COURSE_IDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getPhraseCheckpoints(courseId: number): Checkpoint[] {
  const course = getCourseById(courseId);
  if (!course) return [];
  return [...course.checkpoints].sort((a, b) => a.phraseIndex - b.phraseIndex);
}

export function findCheckpointByQrValue(courseId: number, qrValue: string): Checkpoint | undefined {
  return getCourseById(courseId)?.checkpoints.find((c) => c.qrValue === qrValue);
}

export function getCorrectPhrase(courseId: number): string {
  return getPhraseCheckpoints(courseId)
    .map((c) => c.char)
    .join('');
}
