import type { ReactNode } from 'react';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date: string;
  children?: ReactNode;
  isLast?: boolean;
}

export function TimelineItem({ title, subtitle, date, children, isLast = false }: TimelineItemProps) {
  // We'll use a generic blue dot for all items here, but you can pass colors as props if needed
  return (
    <div className={`relative ${isLast ? 'mb-0' : 'mb-10'}`}>
      <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface"></span>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
        <div className="font-label-sm text-label-sm text-on-surface-variant pt-1 uppercase tracking-wider">
          {date}
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-1 text-[20px] leading-tight">{title}</h3>
          <p className="font-label-lg text-label-lg text-primary mb-3">{subtitle}</p>
          <div className="font-body-md text-body-md text-on-surface-variant space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Timeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative pl-6 border-l-2 border-surface-variant ml-6">
      {children}
    </div>
  );
}
