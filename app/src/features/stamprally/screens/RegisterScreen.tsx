import { STAMP_RALLY_ROUTES } from '../routes';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { issueNextParticipantNumber, type UseStampRally } from '../hooks/useStampRally';
import type { Gender, Registration, StudentCategory } from '../types';
import { syncRegistrationToSheet } from '../lib/sheetApi';
import { pickRandomCourseId } from '../data/checkpoints';
import { useI18n } from '../i18n/useI18n';
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

    const participantId = crypto.randomUUID();
    // 参加者番号（この端末でスタンプラリーを開始した順の通し番号）。サーバーは使わず、
    // この端末のlocalStorageだけで1から採番する。
    const participantNumber = issueNextParticipantNumber();
    const startedAt = new Date().toISOString();
    const courseId = pickRandomCourseId(isStudent && studentCategory === 'elementary');

    // 登録自体はlocalStorageだけで完結する。Googleスプレッドシートへの送信は
    // 「あれば送る」ベストエフォートで、URL未設定・通信失敗のいずれでも
    // 参加登録の成否には一切影響しない。
    register(registration, participantId, participantNumber, courseId, startedAt);
    syncRegistrationToSheet(registration, participantNumber);
    navigate(STAMP_RALLY_ROUTES.rally);
  };

  const fieldClass = (invalid: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-base focus:outline-none ${
      invalid ? 'border-stamprally-notice focus:border-stamprally-notice' : 'border-[#ddd] focus:border-stamprally-register'
    }`;

  return (
    <PageContainer>
      <Header />
      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pb-8">
        <div className="rounded-2xl border-2 border-[#e0c94f] bg-[#fdf9e6] px-4 py-3">
          <h1 className="text-center text-lg font-bold text-[#8a7412]">{m.register.title}</h1>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-[#4a4038]">
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

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-[#4a4038]">
            {m.register.genderLabel} <span className="text-stamprally-notice">{m.register.required}</span>
          </span>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className={fieldClass(genderInvalid)}
          >
            <option value="">{m.register.selectPlaceholder}</option>
            {GENDER_VALUES.map((value) => (
              <option key={value} value={value}>
                {m.register.gender[value]}
              </option>
            ))}
          </select>
          {genderInvalid && (
            <p className="mt-1 text-xs font-bold text-stamprally-notice">{m.register.genderError}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-[#4a4038]">
            {m.register.ageLabel} <span className="text-stamprally-notice">{m.register.required}</span>
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
          {ageInvalid && <p className="mt-1 text-xs font-bold text-stamprally-notice">{m.register.ageError}</p>}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-[#4a4038]">
            {m.register.isStudentLabel}{' '}
            <span className="text-stamprally-notice">{m.register.required}</span>
          </span>
          <select
            value={isStudent === '' ? '' : isStudent ? 'yes' : 'no'}
            onChange={(e) => handleIsStudentChange(e.target.value === 'yes')}
            className={fieldClass(isStudentInvalid)}
          >
            <option value="">{m.register.selectPlaceholder}</option>
            <option value="yes">{m.register.isStudentYes}</option>
            <option value="no">{m.register.isStudentNo}</option>
          </select>
          {isStudentInvalid && (
            <p className="mt-1 text-xs font-bold text-stamprally-notice">{m.register.isStudentError}</p>
          )}
        </label>

        {isStudent === true && (
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-[#4a4038]">
              {m.register.studentCategoryLabel}{' '}
              <span className="text-stamprally-notice">{m.register.required}</span>
            </span>
            <select
              value={studentCategory}
              onChange={(e) => setStudentCategory(e.target.value as StudentCategory)}
              className={fieldClass(studentCategoryInvalid || ageCategoryMismatch)}
            >
              <option value="">{m.register.selectPlaceholder}</option>
              {STUDENT_CATEGORY_VALUES.map((value) => (
                <option key={value} value={value}>
                  {m.register.studentCategory[value]}
                </option>
              ))}
            </select>
            {studentCategoryInvalid && (
              <p className="mt-1 text-xs font-bold text-stamprally-notice">
                {m.register.studentCategoryError}
              </p>
            )}
            {!studentCategoryInvalid && ageCategoryMismatch && (
              <p className="mt-1 text-xs font-bold text-stamprally-notice">
                {ageStudentCategoryErrorMessage(parsedAge!, studentCategory as StudentCategory)}
              </p>
            )}
          </label>
        )}
      </main>

      <div className="sticky bottom-0 shrink-0 border-t border-[#eee] bg-white px-6 py-4">
        <Button variant="register" onClick={handleSubmit} disabled={formHasError}>
          {m.register.submit}
        </Button>
      </div>
    </PageContainer>
  );
}
