import type { StudentCategory } from '../types';

// 年齢として受け付ける範囲。
export const MIN_AGE = 1;
export const MAX_AGE = 110;

// 学校区分ごとに認める年齢の範囲（多少の余裕を持たせている）。
// 登録画面のリアルタイムチェックと、送信直前の最終チェックの両方から
// この同じ定義を参照することで、判定ルールが重複しないようにしている。
export const STUDENT_AGE_RANGE: Record<StudentCategory, [number, number]> = {
  elementary: [6, 13],
  juniorHigh: [11, 16],
  highSchool: [14, 19],
  university: [17, 30],
};

export const STUDENT_CATEGORY_LABEL: Record<StudentCategory, string> = {
  elementary: '小学生',
  juniorHigh: '中学生',
  highSchool: '高校生',
  university: '大学生',
};

/** 年齢と学校区分が対応しているかどうか。 */
export function isAgeStudentCategoryValid(age: number, category: StudentCategory): boolean {
  const [min, max] = STUDENT_AGE_RANGE[category];
  return age >= min && age <= max;
}

/** 何が間違っているかを具体的に示すエラー文を作る（利用者に分かりやすい自然な日本語を使う）。 */
export function ageStudentCategoryErrorMessage(age: number, category: StudentCategory): string {
  const [min, max] = STUDENT_AGE_RANGE[category];
  const label = STUDENT_CATEGORY_LABEL[category];
  return `年齢（${age}歳）が「${label}」と合っていないようです。${label}の場合、${min}歳から${max}歳までが目安です。年齢か学校区分を見直してください。`;
}
