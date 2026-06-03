import { useState, useCallback, useEffect, useRef } from 'react';

type Stage = 'enter' | 'active' | 'exit';

export function usePageTransition() {
  const [stage, setStage] = useState<Stage>('enter');
  const callbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setStage('active');
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleBack = useCallback((callback?: () => void) => {
    if (stage !== 'active') return;
    callbackRef.current = callback ?? null;
    setStage('exit');
  }, [stage]);

  useEffect(() => {
    if (stage === 'exit') {
      const timer = setTimeout(() => {
        callbackRef.current?.();
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const className = `page-transition${stage === 'enter' ? ' page-enter' : stage === 'exit' ? ' page-exit' : ''}`;

  return { className, handleBack };
}
