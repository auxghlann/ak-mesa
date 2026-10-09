'use client';

import { useState } from 'react';

export type ProjectIconProps = {
  appIconUrl?: string | null;
  icon?: string | null;
  title: string;
  className?: string;
  iconClassName?: string;
};

export default function ProjectIcon({
  appIconUrl,
  icon,
  title,
  className = 'w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-on-surface shadow-xs',
  iconClassName = 'text-[24px]',
}: ProjectIconProps) {
  const [imageError, setImageError] = useState(false);

  if (appIconUrl && !imageError) {
    return (
      <div className={`overflow-hidden shrink-0 ${className}`}>
        <img
          src={appIconUrl}
          alt={`${title} icon`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`shrink-0 ${className}`}>
      <span className={`material-symbols-rounded ${iconClassName}`}>
        {icon || 'code'}
      </span>
    </div>
  );
}
