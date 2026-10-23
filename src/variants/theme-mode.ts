// Light or dark, shared by every option. The choice is kept per browser and
// applied as `theme-dark` on <html> before the first render (AppRoutes), so
// an option can scope its dark tokens with `html.option-x.theme-dark`.
// Not `.dark`: src/styles/theme.css already uses that for the shadcn tokens.

export type ThemeMode = 'light' | 'dark';

/** Options that have a dark version; the others always show light */
export const DARK_OPTIONS = new Set(['b', 'c', 'd']);

const KEY = 'lnd-theme';
const CLASS = 'theme-dark';
const EVENT = 'lnd-theme-change';

/** Storage can be blocked, so every access is guarded */
export function readThemeMode(): ThemeMode {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function applyThemeMode(mode: ThemeMode) {
  document.documentElement.classList.toggle(CLASS, mode === 'dark');
  document.documentElement.style.colorScheme = mode;
}

export function setThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* storage blocked: the choice lasts until the page reloads */
  }
  applyThemeMode(mode);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: mode }));
}

/** Calls back whenever the mode changes; returns the unsubscribe */
export function onThemeModeChange(callback: (mode: ThemeMode) => void) {
  const handler = (e: Event) => callback((e as CustomEvent<ThemeMode>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
