export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-variant/30 rounded-xl ${className}`} />
  );
}
