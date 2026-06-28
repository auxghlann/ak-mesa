import type { ReactNode } from 'react';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date: string;
  children?: ReactNode;
  isLast?: boolean;
}

export function TimelineItem({ title, subtitle, date, children, isLast = false }: TimelineItemProps) {
  return (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      {/* Date (Desktop) */}
      <div className="hidden sm:flex flex-col items-start absolute left-0 text-sm font-medium text-on-surface-variant mt-1 w-24">
        {date}
      </div>

      {/* Timeline Line & Dot */}
      <div className="absolute left-0 sm:left-28 h-full flex flex-col items-center">
        <div className="w-3 h-3 bg-gray-200 rounded-full mt-1.5 group-hover:bg-google-blue transition-colors shadow-sm ring-4 ring-white" />
        {!isLast && <div className="w-0.5 h-full bg-gray-100 mt-2" />}
      </div>

      {/* Content */}
      <div className="flex flex-col items-start">
        <h3 className="text-xl font-display font-semibold text-gray-900">{title}</h3>
        <p className="text-md text-google-blue font-medium mb-1">{subtitle}</p>
        <span className="sm:hidden text-sm text-on-surface-variant mb-3">{date}</span>
        <div className="mt-2 text-gray-600 leading-relaxed text-sm sm:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Timeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}
