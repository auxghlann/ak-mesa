export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="material-symbols-rounded animate-spin text-primary text-[48px]">
        progress_activity
      </span>
    </div>
  );
}
