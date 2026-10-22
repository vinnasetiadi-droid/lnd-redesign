import { useLocation } from 'react-router';
import { LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VARIANTS, variantHref } from './variants';

interface VariantSwitcherProps {
  currentKey: string;
}

/**
 * Floating pill shown inside an option: back to the option list, or open the
 * same page in another option. Each option is its own router (see AppRoutes),
 * so these are full page loads (<a>, not <Link>).
 */
export function VariantSwitcher({ currentKey }: VariantSwitcherProps) {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Design options"
      className="fixed bottom-5 right-5 z-[95] flex items-center gap-1 rounded-full border border-[#E9EAEB] bg-white/90 p-1 font-sans shadow-[0_8px_24px_rgba(16,24,40,0.10)] backdrop-blur"
    >
      <a
        href="/"
        title="All options"
        className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-[#414651] transition-colors hover:bg-[#F5F5F5]"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Options
      </a>
      <span className="h-5 w-px bg-[#E9EAEB]" />
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
              active ? 'bg-[#0001FE] text-white' : 'text-[#535862] hover:bg-[#F5F5F5]',
            )}
          >
            {v.key}
          </a>
        );
      })}
    </nav>
  );
}
