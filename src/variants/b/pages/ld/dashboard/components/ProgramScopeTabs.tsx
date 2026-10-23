// All programs / Course / Journey pill tabs shared by the L&D dashboard cards.
// The active pill slides between tabs; each card fades its own content in.

import { motion } from 'motion/react';
import { Layers, BookOpen, Route } from '@/variants/b/icons';
import { cn } from '@/lib/utils';

export type ProgramScope = 'all' | 'course' | 'journey';

export type ScopeTab<K extends string = ProgramScope> = {
  key: K;
  label: string;
  icon?: React.ElementType;
  /** Shown after the label in a muted colour, e.g. "Draft 2" */
  count?: number;
};

export const SCOPE_TABS: ScopeTab[] = [
  { key: 'all',     label: 'All programs', icon: Layers },
  { key: 'course',  label: 'Course',      icon: BookOpen },
  { key: 'journey', label: 'Journey',     icon: Route },
];

/**
 * Fades one value in whenever it changes. Use it on numbers and copy under the
 * tabs; charts should stay mounted so recharts can morph them to the new data
 * (remounting a chart re-measures it from zero width and redraws from scratch).
 */
export function FadeValue({ k, children, className }: { k: string | number; children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      key={k}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.span>
  );
}

/** @deprecated Remounting a block with charts looks broken — use FadeValue. */
export const scopeFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
};

/** Courses / Journeys only — for pages that have no combined view. */
export const PROGRAM_TYPE_TABS: ScopeTab<'course' | 'journey'>[] = [
  { key: 'course',  label: 'Courses',  icon: BookOpen },
  { key: 'journey', label: 'Journeys', icon: Route },
];

interface ProgramScopeTabsProps<K extends string> {
  /** Unique per card, so each card's highlight slides on its own. */
  id: string;
  value: K;
  onChange: (scope: K) => void;
  /** Defaults to All programs / Course / Journey. */
  tabs?: ScopeTab<K>[];
  /** Fill the parent's width, tabs sharing it equally (for narrow cards). */
  stretch?: boolean;
  className?: string;
}

export function ProgramScopeTabs<K extends string = ProgramScope>({ id, value, onChange, tabs, stretch, className }: ProgramScopeTabsProps<K>) {
  const options = (tabs ?? SCOPE_TABS) as ScopeTab<K>[];
  return (
    <div className={cn('flex items-center gap-0.5 p-1 rounded-full bg-(--ob-surface)', stretch ? 'w-full' : 'w-fit', className)}>
      {options.map(({ key, label, count }) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            className={cn(
              // No z-index here: the pill (z-[1]) must paint over the grey
              // background of whichever tab it is sliding across.
              'relative flex items-center gap-1.5 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors duration-200 cursor-pointer',
              stretch ? 'flex-1 justify-center px-2' : 'px-3.5',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/40 focus-visible:ring-offset-1',
              isActive ? 'text-(--ob-text-strong)' : 'text-(--ob-text-muted) hover:text-(--ob-text-body)',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={id}
                className="absolute inset-0 z-[1] rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08),0_1px_3px_rgba(16,24,40,0.06)]"
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
              />
            )}
            <span className="relative z-[2]">
              {label}
              {count !== undefined && <span className="ml-1.5 tabular-nums text-(--ob-text-subtle)">{count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
