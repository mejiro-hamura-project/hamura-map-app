import { useI18n } from '../i18n/useI18n';

function mainAppUrl(): string | null {
  const value = import.meta.env.VITE_MAIN_APP_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

interface HeaderProps {
  dark?: boolean;
}

export default function Header({ dark = false }: HeaderProps) {
  const { m } = useI18n();
  const mainUrl = mainAppUrl();
  return (
    <header
      className={`shrink-0 py-4 text-center font-bold leading-tight ${dark ? 'text-white' : 'text-[#2f2a24]'}`}
    >
      <p className="text-lg">{m.header.line1}</p>
      <p className="text-lg">{m.header.line2}</p>
      {mainUrl && (
        <a
          href={mainUrl}
          className={`mt-1 inline-block text-xs underline underline-offset-2 ${dark ? 'text-white/80' : 'text-[#6b625b]'}`}
        >
          祭り案内へ戻る
        </a>
      )}
    </header>
  );
}
