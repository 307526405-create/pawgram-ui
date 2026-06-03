import { useCallback } from 'react';

export function usePageTransition() {
  const handleBack = useCallback((callback?: () => void) => {
    callback?.();
  }, []);

  return { className: '', handleBack };
}
