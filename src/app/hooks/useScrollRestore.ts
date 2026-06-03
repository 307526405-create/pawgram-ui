import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router';

const PREFIX = 'pawgram_scroll_';

export function useScrollRestore(ready = true) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const key = PREFIX + location.pathname;
  const restoredRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const target = Number(saved);
      if (target > 0) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = target;
            restoredRef.current = true;
          }
        });
      }
    }
  }, [key, ready]);

  useEffect(() => {
    return () => {
      const el = containerRef.current;
      if (el && el.scrollTop > 0) {
        sessionStorage.setItem(key, String(el.scrollTop));
      }
    };
  }, [key]);

  const onScroll = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const el = containerRef.current;
      if (el && el.scrollTop > 0) {
        sessionStorage.setItem(key, String(el.scrollTop));
      }
    }, 100);
  }, [key]);

  return { containerRef, onScroll };
}
