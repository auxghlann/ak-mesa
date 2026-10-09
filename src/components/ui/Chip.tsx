import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  color?: 'default' | 'blue' | 'red' | 'yellow' | 'green';
  className?: string;
}

export default function Chip({ children, color = 'default', className = '' }: ChipProps) {
  const colorStyles = {
    default: 'bg-surface-container border border-outline-variant/40 text-on-surface',
    blue: 'bg-surface-container-high border border-outline-variant/60 text-on-surface',
    red: 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant',
    yellow: 'bg-surface-container border border-outline-variant/50 text-on-surface',
    green: 'bg-surface-container-high border border-outline-variant/60 text-on-surface',
  };

  return (
    <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full font-mono text-xs transition-colors ${colorStyles[color]} ${className}`}>
      {children}
    </span>
  );
}
