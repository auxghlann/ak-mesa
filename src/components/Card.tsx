import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const baseClasses = "bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-300";
  const interactiveClasses = onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-gray-200" : "";
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
