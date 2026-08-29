type PostCreateFabProps = {
  onClick: () => void;
};

export default function PostCreateFab({ onClick }: PostCreateFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-4 right-5 z-20 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-brand-blue shadow-lg"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
