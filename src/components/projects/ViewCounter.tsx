'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ViewCounterProps = {
  slug: string;
  initialViews?: number;
  className?: string;
};

export default function ViewCounter({
  slug,
  initialViews = 0,
  className = '',
}: ViewCounterProps) {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    const sessionKey = `viewed_project_${slug}`;

    // Deduplicate within browser session to prevent reload inflation
    if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');

      const incrementView = async () => {
        try {
          const { data, error } = await supabase.rpc('increment_project_views', {
            project_slug: slug,
          });

          if (!error && typeof data === 'number') {
            setViews(data);
          } else {
            // Fallback if RPC is pending: local increment visual feedback
            setViews((prev) => prev + 1);
          }
        } catch {
          // Graceful fallback
          setViews((prev) => prev + 1);
        }
      };

      incrementView();
    }
  }, [slug]);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs text-on-surface-variant ${className}`}
      title={`${views} views`}
    >
      <span className="material-symbols-rounded">visibility</span>
      <span className="font-mono text-xs">{views}</span>
    </span>
  );
}
