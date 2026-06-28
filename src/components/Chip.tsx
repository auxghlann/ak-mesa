import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  color?: 'default' | 'blue' | 'red' | 'yellow' | 'green';
  className?: string;
}

export default function Chip({ children, color = 'default', className = '' }: ChipProps) {
  const colorStyles = {
    default: 'bg-surface-hover text-on-surface border border-gray-200',
    blue: 'bg-blue-50 text-google-blue border border-blue-100',
    red: 'bg-red-50 text-google-red border border-red-100',
    yellow: 'bg-yellow-50 text-google-yellow border border-yellow-100',
    green: 'bg-green-50 text-google-green border border-green-100',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorStyles[color]} ${className}`}>
      {children}
    </span>
  );
}
