import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { LayoutGrid, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VARIANTS, variantHref } from './variants';
import { DARK_OPTIONS, onThemeModeChange, readThemeMode, setThemeMode, type ThemeMode } from './theme-mode';

interface VariantSwitcherProps {
  currentKey: string;
}

/**
 * Floating pill shown inside an option: back to the option list, or open the
 * same page in another option. Each option is its own router (see AppRoutes),
 * so these are full page loads (<a>, not <Link>). Options with a dark version
 * also get a light/dark switch; the choice carries over to the other options.
 * The pill itself turns dark with the page.
 */
export function VariantSwitcher({ currentKey }: VariantSwitcherProps) {
  const { pathname } = useLocation();
  const hasDark = DARK_OPTIONS.has(currentKey);
  const [mode, setMode] = useState<ThemeMode>(() => (hasDark ? readThemeMode() : 'light'));
  useEffect(() => onThemeModeChange(setMode), []);
  const dark = hasDark && mode === 'dark';

  return (
    <nav
      aria-label="Design options"
      className={cn(
        'fixed bottom-5 right-5 z-[95] flex items-center gap-1 rounded-full border p-1 font-sans backdrop-blur',
        dark
          ? 'border-[#2A2D33] bg-[#16181C]/90 shadow-[0_8px_24px_rgba(0,0,0,0.45)]'
          : 'border-[#E9EAEB] bg-white/90 shadow-[0_8px_24px_rgba(16,24,40,0.10)]',
      )}
    >
      <a
        href="/"
        title="All options"
        className={cn(
          'flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-colors',
          dark ? 'text-[#D0D5DD] hover:bg-white/10' : 'text-[#414651] hover:bg-[#F5F5F5]',
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Options
      </a>
      <span className={cn('h-5 w-px', dark ? 'bg-[#2A2D33]' : 'bg-[#E9EAEB]')} />
      {VARIANTS.map((v) => {
        const active = v.key === currentKey;
        return (
          <a
            key={v.key}
            href={variantHref(v, pathname)}
            title={`${v.name}: this page`}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold uppercase transition-colors',
              active ? 'bg-[#0001FE] text-white' : dark ? 'text-[#A4A7AE] hover:bg-white/10' : 'text-[#535862] hover:bg-[#F5F5F5]',
            )}
          >
            {v.key}
          </a>
        );
      })}
      {hasDark && (
        <>
          <span className={cn('h-5 w-px', dark ? 'bg-[#2A2D33]' : 'bg-[#E9EAEB]')} />
          <button
            type="button"
            onClick={() => setThemeMode(dark ? 'light' : 'dark')}
            aria-label={dark ? 'Switch to light' : 'Switch to dark'}
            title={dark ? 'Light version' : 'Dark version'}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer',
              dark ? 'text-[#FEC84B] hover:bg-white/10' : 'text-[#535862] hover:bg-[#F5F5F5]',
            )}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </>
      )}
    </nav>
  );
}
