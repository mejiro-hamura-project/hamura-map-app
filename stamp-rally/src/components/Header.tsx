interface HeaderProps {
  dark?: boolean;
}

export default function Header({ dark = false }: HeaderProps) {
  return (
    <header
      className={`shrink-0 py-4 text-center font-bold leading-tight ${
        dark ? 'text-white' : 'text-[#2f2a24]'
      }`}
    >
      <p className="text-lg">お祭り</p>
      <p className="text-lg">スタンプラリー</p>
    </header>
  );
}
