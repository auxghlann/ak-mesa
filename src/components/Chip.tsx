import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  color?: 'default' | 'blue' | 'red' | 'yellow' | 'green';
  className?: string;
}

export default function Chip({ children, color = 'default', className = '' }: ChipProps) {
  const colorStyles = {
    default: 'bg-surface-container text-on-surface',
    blue: 'bg-primary-fixed text-on-primary-fixed-variant',
    red: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    yellow: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    green: 'bg-surface-container-high text-on-surface', // Used for education in stitch
  };

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-label-sm text-label-sm ${colorStyles[color]} ${className}`}>
      {children}
    </span>
  );
}
