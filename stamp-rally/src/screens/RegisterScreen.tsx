import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import type { UseStampRally } from '../hooks/useStampRally';
import type { AgeGroup, Gender } from '../types';
import { syncRegistrationToSheet } from '../lib/sheetSync';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
];

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: 'student', label: '学生' },
  { value: '10s', label: '10代' },
  { value: '20s', label: '20代' },
  { value: '30s', label: '30代' },
  { value: '40s', label: '40代' },
  { value: '50s', label: '50代' },
  { value: '60plus', label: '60代以上' },
];

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { registration: existingRegistration, register } = useOutletContext<UseStampRally>();

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
  const [showErrors, setShowErrors] = useState(false);

  // already registered (e.g. reached here via a stale bookmark/back button) —
  // don't let a resubmit silently overwrite it and fire a duplicate sheet sync
  useEffect(() => {
    if (existingRegistration) {
      navigate('/rally', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (existingRegistration) return null;

  const genderInvalid = showErrors && gender === '';
  const ageGroupInvalid = showErrors && ageGroup === '';

  const handleSubmit = () => {
    if (gender === '' || ageGroup === '') {
      setShowErrors(true);
      return;
    }
    const registration = { nickname: nickname.trim(), gender, ageGroup };
    register(registration);
    syncRegistrationToSheet(registration);
    navigate('/rally');
  };

  const fieldClass = (invalid: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-base focus:outline-none ${
      invalid ? 'border-notice focus:border-notice' : 'border-[#ddd] focus:border-register'
    }`;

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-8">
        <div className="rounded-2xl border-2 border-[#e0c94f] bg-[#fdf9e6] px-4 py-3">
          <h1 className="text-center text-lg font-bold text-[#8a7412]">参加者登録</h1>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-[#4a4038]">
            ニックネーム（任意）
          </span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="例：まつりびと"
            className={fieldClass(false)}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-[#4a4038]">
            性別 <span className="text-notice">必須</span>
          </span>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className={fieldClass(genderInvalid)}
          >
            <option value="">選択してください</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {genderInvalid && (
            <p className="mt-1 text-xs font-bold text-notice">性別を選択してください</p>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-[#4a4038]">
            年代 <span className="text-notice">必須</span>
          </span>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
            className={fieldClass(ageGroupInvalid)}
          >
            <option value="">選択してください</option>
            {AGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {ageGroupInvalid && (
            <p className="mt-1 text-xs font-bold text-notice">年代を選択してください</p>
          )}
        </label>
      </main>

      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        <Button variant="register" onClick={handleSubmit}>
          参加する
        </Button>
      </div>
    </PageContainer>
  );
}
