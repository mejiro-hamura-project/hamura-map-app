import { useI18n } from '../i18n/useI18n';

interface HeaderProps {
  dark?: boolean;
}

export default function Header({ dark = false }: HeaderProps) {
  const { m } = useI18n();
  return (
    <header
      className={`shrink-0 py-4 text-center font-bold leading-tight ${dark ? 'text-white' : 'text-[#2f2a24]'}`}
    >
      <p className="text-lg">{m.header.line1}</p>
      <p className="text-lg">{m.header.line2}</p>
    </header>
  );
}
