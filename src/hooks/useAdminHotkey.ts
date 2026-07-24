import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAdminHotkey() {
  const navigate = useNavigate();
  const pressCount = useRef(0);
  const lastPress = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key !== 'b') {
        pressCount.current = 0;
        return;
      }

      const now = Date.now();
      if (now - lastPress.current > 2000) {
        pressCount.current = 0;
      }

      pressCount.current++;
      lastPress.current = now;

      if (pressCount.current >= 5) {
        pressCount.current = 0;
        navigate('/admin/login');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
}
