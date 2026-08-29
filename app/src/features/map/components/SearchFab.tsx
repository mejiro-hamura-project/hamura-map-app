type SearchFabProps = {
  onClick: () => void;
};

export default function SearchFab({ onClick }: SearchFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="検索"
      className="absolute bottom-4 right-[22px] z-20 flex h-[54px] w-[54px] items-center justify-center rounded-full border border-line bg-card shadow-lg"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    </button>
  );
}
