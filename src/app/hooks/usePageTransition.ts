import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';

export function usePageTransition() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  const handleBack = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => navigate(-1), 280);
  }, [navigate, exiting]);

  return {
    animClass: exiting ? 'page-exit' : 'page-enter',
    handleBack,
  };
}
