// registration から小学生モードかどうかを判定する共通ロジック。
export function isElementaryMode(registration: { isStudent: boolean; studentCategory?: string } | null): boolean {
  return registration?.isStudent === true && registration.studentCategory === 'elementary';
}
