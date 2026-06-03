import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";

export function useSwipeBack(containerRef: React.RefObject<HTMLDivElement | null>) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useRef({ startX: 0, startY: 0, swiping: false, offset: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const s = state.current;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      s.startX = e.touches[0].clientX;
      s.startY = e.touches[0].clientY;
      s.offset = 0;
      s.swiping = s.startX < 24; // only from left edge
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!s.swiping) return;
      const dx = e.touches[0].clientX - s.startX;
      const dy = Math.abs(e.touches[0].clientY - s.startY);
      if (dy > dx * 1.5) { s.swiping = false; return; } // vertical scroll wins
      if (dx < 0) { s.swiping = false; return; }
      s.offset = Math.min(dx, el.offsetWidth);
      el.style.transform = `translateX(${s.offset}px)`;
      el.style.transition = 'none';
    };

    const onTouchEnd = () => {
      if (!s.swiping) return;
      s.swiping = false;
      if (s.offset > el.offsetWidth * 0.3) {
        el.style.transform = `translateX(${el.offsetWidth}px)`;
        el.style.transition = 'transform 0.25s ease-out';
        setTimeout(() => {
          el.style.transform = '';
          el.style.transition = '';
          navigate(-1);
        }, 250);
      } else {
        el.style.transform = '';
        el.style.transition = 'transform 0.2s ease-out';
        setTimeout(() => { el.style.transition = ''; }, 200);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [navigate, containerRef]);

  // Don't show back gesture on home page
  return location.pathname !== '/';
}
