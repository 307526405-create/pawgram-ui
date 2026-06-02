import { useState, useEffect, useCallback } from 'react';

type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'pawgram-theme';
const EVENT_KEY = 'pawgram-theme-change';

function getStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'system' || v === 'light' || v === 'dark') return v;
  } catch {}
  return 'system';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function useDarkMode() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyTheme(resolveTheme(theme));
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Sync across hook instances via custom event
  useEffect(() => {
    const onThemeChange = (e: CustomEvent<Theme>) => {
      const newTheme = e.detail;
      applyTheme(resolveTheme(newTheme));
      setThemeState(newTheme);
    };
    window.addEventListener(EVENT_KEY, onThemeChange as EventListener);
    return () => window.removeEventListener(EVENT_KEY, onThemeChange as EventListener);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: t }));
  }, []);

  return { theme, setTheme, resolved: resolveTheme(theme) };
}
