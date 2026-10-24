import { STAMP_RALLY_ROUTES } from '../routes';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { issueNextParticipantNumber, type UseStampRally } from '../hooks/useStampRally';
import type { Gender, Registration, StudentCategory } from '../types';
import { pickRandomCourseId } from '../data/checkpoints';
import { useI18n } from '../i18n/useI18n';
import Sprig from '../components/Sprig';
import { BUTTON_ICONS } from '../buttonIcons';
import { FLOW_STEP_BY_SCREEN } from '../howtoSteps';
import {
  MIN_AGE,
  MAX_AGE,
  isAgeStudentCategoryValid,
  ageStudentCategoryErrorMessage,
} from '../data/ageValidation';

const GENDER_VALUES: Gender[] = ['male', 'female', 'other'];

const STUDENT_CATEGORY_VALUES: StudentCategory[] = [
  'elementary',
  'juniorHigh',
  'highSchool',
  'university',
];

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { registration: existingRegistration, register } = useOutletContext<UseStampRally>();
  const { m } = useI18n();

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [ageInput, setAgeInput] = useState('');
  const [isStudent, setIsStudent] = useState<boolean | ''>('');
  const [studentCategory, setStudentCategory] = useState<StudentCategory | ''>('');
  const [showErrors, setShowErrors] = useState(false);
  // 連打による二重登録を防ぐための同期的なガード（stateだと再描画待ちで間に合わないため ref）。
  const submittedRef = useRef(false);

  // already registered (e.g. reached here via a stale bookmark/back button) —
  // don't let a resubmit silently overwrite it and fire a duplicate sheet sync
  useEffect(() => {
    if (existingRegistration) {
      navigate(STAMP_RALLY_ROUTES.rally, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (existingRegistration) return null;

  const parsedAge = ageInput.trim() === '' ? null : Number(ageInput);
  const ageValid =
    parsedAge !== null && Number.isInteger(parsedAge) && parsedAge >= MIN_AGE && parsedAge <= MAX_AGE;

  // 年齢・学校区分のどちらが変わっても、この同じ判定関数で再チェックする
  // （判定ルールを重複させない）。
  const ageCategoryMismatch =
    ageValid && isStudent === true && studentCategory !== ''
      ? !isAgeStudentCategoryValid(parsedAge!, studentCategory)
      : false;

  // 「学生ではない」を選んだら、学校区分の選択はクリアする
  const handleIsStudentChange = (value: boolean) => {
    setIsStudent(value);
    if (!value) setStudentCategory('');
  };

  const genderInvalid = showErrors && gender === '';
  const ageInvalid = showErrors && !ageValid;
  const isStudentInvalid = showErrors && isStudent === '';
  const studentCategoryInvalid = showErrors && isStudent === true && studentCategory === '';

  const formHasError =
    gender === '' ||
    !ageValid ||
    isStudent === '' ||
    (isStudent === true && studentCategory === '') ||
    ageCategoryMismatch;

  const handleSubmit = () => {
    if (submittedRef.current) return; // 連打による二重登録を防ぐ

    // 送信直前の最終チェック。表示用の disabled 判定（formHasError）と全く同じ
    // 共通ロジック（isAgeStudentCategoryValid）をこの場でもう一度呼び直し、
    // ここで問題があれば絶対に登録しない。
    if (
      gender === '' ||
      !ageValid ||
      isStudent === '' ||
      (isStudent === true && studentCategory === '') ||
      (isStudent === true &&
        studentCategory !== '' &&
        !isAgeStudentCategoryValid(parsedAge!, studentCategory))
    ) {
      setShowErrors(true);
      return;
    }

    submittedRef.current = true;

    const registration: Registration = {
      nickname: nickname.trim(),
      gender,
      age: parsedAge!,
      isStudent,
      studentCategory: isStudent && studentCategory !== '' ? studentCategory : undefined,
    };

    // 参加者番号（この端末でスタンプラリーを開始した順の通し番号）。サーバーは使わず、
    // この端末のlocalStorageだけで1から採番する。
    const participantNumber = issueNextParticipantNumber();
    const courseId = pickRandomCourseId(isStudent && studentCategory === 'elementary');

    // 登録自体はlocalStorageだけで完結し、D1への送信成否では進行を止めない。
    register(registration, participantNumber, courseId);
    navigate(STAMP_RALLY_ROUTES.rally);
  };

  // デザインA案の入力欄。filled（選択済み）は表示だけの区別で、入力チェック・登録処理には関わらない。
  const fieldClass = (invalid: boolean, filled = false) =>
    `w-full min-w-0 rounded-xl border px-3 py-2.5 text-base text-sr-ink focus:outline-none focus:ring-2 focus:ring-sr-teal/30 ${
      invalid
        ? 'border-sr-red bg-white focus:border-sr-red'
        : filled
          ? 'border-sr-green bg-sr-green-soft focus:border-sr-teal'
          : 'border-sr-line bg-white focus:border-sr-teal'
    }`;

  return (
    <PageContainer>
      <Header step={FLOW_STEP_BY_SCREEN.register} />
      {/* 1画面に収める配置（各入力欄の中身・並び順・処理は従来どおり）。
          高さ600px以下では見出しを省き（上部の操作指示「① 参加登録をしよう！」が同じ役割）、
          入力欄を2列に並べる。 */}
      {/* 内容全体を、中央より画面の高さの約5%上に置く（下側にだけ10dvh分の余白を足す）。
          進捗バーとの間は最低12px空ける。下の余白は高さが足りないときに真っ先に縮み、入力欄やボタンを押し出さない。 */}
      <div aria-hidden="true" className="min-h-3 grow" />
      <main className="flex min-h-0 flex-initial flex-col gap-3 overflow-y-auto px-5 pb-2">
        <div className="py-0.5 [@media(max-height:600px)]:sr-only">
          <h1 className="flex items-center justify-center gap-2 text-center text-[clamp(1.5rem,7.5vw,1.875rem)] leading-tight font-extrabold tracking-wide text-sr-ink">
            <Sprig />
            {/* 見出しの文言はそのまま */}
            <span className="min-w-0 text-balance">{m.register.title}</span>
            <Sprig flip />
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-x-3 gap-y-2 [@media(max-height:480px)]:grid-cols-2 [@media(max-height:480px)]:gap-y-1.5">
          <label className="block min-w-0">
            <span className="mb-0.5 block text-sm font-bold text-sr-ink">
              {m.register.nicknameLabel}
            </span>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={m.register.nicknamePlaceholder}
              className={fieldClass(false)}
            />
          </label>
          <label className="block min-w-0">
            <span className="mb-0.5 block text-sm font-bold text-sr-ink">
              {m.register.genderLabel} <span className="text-sr-red-strong">{m.register.required}</span>
            </span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className={fieldClass(genderInvalid, gender !== '')}
            >
              <option value="">{m.register.selectPlaceholder}</option>
              {GENDER_VALUES.map((value) => (
                <option key={value} value={value}>
                  {m.register.gender[value]}
                </option>
              ))}
            </select>
            {genderInvalid && (
              <p className="mt-1 text-xs font-bold text-sr-red-strong">{m.register.genderError}</p>
            )}
          </label>
          <label className="block min-w-0">
            <span className="mb-0.5 block text-sm font-bold text-sr-ink">
              {m.register.ageLabel} <span className="text-sr-red-strong">{m.register.required}</span>
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={MIN_AGE}
              max={MAX_AGE}
              step={1}
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              placeholder={m.register.agePlaceholder}
              className={fieldClass(ageInvalid)}
            />
            {ageInvalid && <p className="mt-1 text-xs font-bold text-sr-red-strong">{m.register.ageError}</p>}
          </label>
          <label className="block min-w-0">
            <span className="mb-0.5 block text-sm font-bold text-sr-ink">
              {m.register.isStudentLabel}{' '}
              <span className="text-sr-red-strong">{m.register.required}</span>
            </span>
            <select
              value={isStudent === '' ? '' : isStudent ? 'yes' : 'no'}
              onChange={(e) => handleIsStudentChange(e.target.value === 'yes')}
              className={fieldClass(isStudentInvalid, isStudent !== '')}
            >
              <option value="">{m.register.selectPlaceholder}</option>
              <option value="yes">{m.register.isStudentYes}</option>
              <option value="no">{m.register.isStudentNo}</option>
            </select>
            {isStudentInvalid && (
              <p className="mt-1 text-xs font-bold text-sr-red-strong">{m.register.isStudentError}</p>
            )}
          </label>
          {isStudent === true && (
            <label className="block min-w-0 [@media(max-height:480px)]:col-span-2">
              <span className="mb-0.5 block text-sm font-bold text-sr-ink">
                {m.register.studentCategoryLabel}{' '}
                <span className="text-sr-red-strong">{m.register.required}</span>
              </span>
              <select
                value={studentCategory}
                onChange={(e) => setStudentCategory(e.target.value as StudentCategory)}
                className={fieldClass(studentCategoryInvalid || ageCategoryMismatch, studentCategory !== '')}
              >
                <option value="">{m.register.selectPlaceholder}</option>
                {STUDENT_CATEGORY_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {m.register.studentCategory[value]}
                  </option>
                ))}
              </select>
              {studentCategoryInvalid && (
                <p className="mt-1 text-xs font-bold text-sr-red-strong">
                  {m.register.studentCategoryError}
                </p>
              )}
              {!studentCategoryInvalid && ageCategoryMismatch && (
                <p className="mt-1 text-xs font-bold text-sr-red-strong">
                  {ageStudentCategoryErrorMessage(parsedAge!, studentCategory as StudentCategory)}
                </p>
              )}
            </label>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 shrink-0 bg-sr-bg px-5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [@media(max-height:480px)]:pt-1.5 [@media(max-height:480px)]:pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        <Button variant="register" icon={BUTTON_ICONS.register} onClick={handleSubmit} disabled={formHasError}>
          {m.register.submit}
        </Button>
      </div>
      <div aria-hidden="true" className="grow" />
      <div aria-hidden="true" className="h-[10dvh] shrink-[100000]" />
    </PageContainer>
  );
}
