// All programs / Course / Journey tabs shared by the L&D dashboard cards (and
// every other tab set in Option B): underline tabs whose blue underline slides
// between tabs; each card fades its own content in.

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
  /** Unique per card, so each card's underline slides on its own. */
  id: string;
  value: K;
  onChange: (scope: K) => void;
  /** Defaults to All programs / Course / Journey. */
  tabs?: ScopeTab<K>[];
  /** Fill the parent's width, tabs sharing it equally (for narrow cards). */
  stretch?: boolean;
  className?: string;
}

/**
 * Option B underline tabs: plain text labels on a hairline, the active one in
 * strong text with a 2px blue underline that slides between tabs. No pill
 * background. Counts (e.g. "Draft 2") sit after the label in Geist Mono.
 */
export function ProgramScopeTabs<K extends string = ProgramScope>({ id, value, onChange, tabs, stretch, className }: ProgramScopeTabsProps<K>) {
  const options = (tabs ?? SCOPE_TABS) as ScopeTab<K>[];
  return (
    <div
      role="tablist"
      className={cn('flex items-stretch gap-5 border-b border-(--ob-border)', stretch ? 'w-full gap-0' : 'w-fit', className)}
    >
      {options.map(({ key, label, count }) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            onClick={() => onChange(key)}
            aria-selected={isActive}
            className={cn(
              'relative flex items-center gap-1.5 pb-2.5 pt-1 text-[13px] leading-[18px] whitespace-nowrap transition-colors duration-200 cursor-pointer',
              stretch && 'flex-1 justify-center px-2',
              'rounded-t-(--ob-radius-control) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/30',
              isActive ? 'text-(--ob-text-strong)' : 'text-(--ob-text-muted) hover:text-(--ob-text-body)',
            )}
          >
            {label}
            {count !== undefined && <span className="ob-num text-(--ob-text-subtle)">{count}</span>}
            {/* Sits on the row's hairline */}
            {isActive && (
              <motion.span
                layoutId={id}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-[1px] bg-(--ob-primary)"
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
