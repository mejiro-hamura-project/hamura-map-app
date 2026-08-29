type PostFilterFabProps = {
  activeCount: number;
  onClick: () => void;
};

export default function PostFilterFab({ activeCount, onClick }: PostFilterFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-4 left-5 z-20 flex h-[54px] w-[54px] items-center justify-center rounded-full border border-line bg-card shadow-lg"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 3H2l8 9.5V19l4 2v-8.5z" />
      </svg>
      {activeCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-magenta px-1 text-[10px] font-extrabold text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}
