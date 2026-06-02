// Simple global auth state via localStorage + custom events
const AUTH_KEY = 'pawgram_auth';

export function isLoggedIn(): boolean {
  return localStorage.getItem(AUTH_KEY) === '1';
}

export function login() {
  localStorage.setItem(AUTH_KEY, '1');
  window.dispatchEvent(new Event('pawgram:auth-change'));
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('pawgram:auth-change'));
}
