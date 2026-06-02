import { useState, useEffect, useCallback } from 'react';

type Theme = 'system' | 'light' | 'dark';

function getStoredTheme(): Theme {
  try {
    const v = localStorage.getItem('pawgram-theme');
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
    try { localStorage.setItem('pawgram-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  return { theme, setTheme, resolved: resolveTheme(theme) };
}
