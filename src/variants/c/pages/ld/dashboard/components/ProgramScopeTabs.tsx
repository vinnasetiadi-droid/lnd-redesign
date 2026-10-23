// All programs / Course / Journey pill tabs shared by the L&D dashboard cards.
// The active pill slides between tabs; each card fades its own content in.

import { motion } from 'motion/react';
import { Layers, BookOpen, Route } from '@/variants/c/icons';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/variants/c/motion';

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
    // Segmented control with half-round corners: a grey track, the active tab a white box
    <div className={cn('flex items-center gap-0.5 p-1 rounded-(--oc-radius-control) bg-(--oc-surface)', stretch ? 'w-full' : 'w-fit', className)}>
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
              'relative flex items-center gap-1.5 py-1.5 rounded-(--oc-radius-chip) text-[13px] whitespace-nowrap transition-colors duration-200 cursor-pointer',
              stretch ? 'flex-1 justify-center px-2' : 'px-3.5',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-(--oc-primary)/40 focus-visible:ring-offset-1 focus-visible:ring-offset-(color:--oc-card)',
              // Active: strong text, medium; inactive: secondary text, regular
              isActive ? 'text-(--oc-text-strong)' : 'text-(--oc-text-secondary) hover:text-(--oc-text-body)',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={id}
                className="absolute inset-0 z-[1] rounded-(--oc-radius-chip) bg-(--oc-thumb) shadow-(--oc-shadow-thumb)"
                // A visible glide: long enough to follow, eased out at the end
                transition={{ duration: 0.38, ease: EASE_OUT }}
              />
            )}
            <span className="relative z-[2] flex items-center">
              {/* The medium label sits over a hidden medium copy, so the tab keeps
                  one width whether it is picked or not and nothing shifts */}
              <span className="grid">
                <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">{label}</span>
                <span className={cn('col-start-1 row-start-1 text-center', isActive ? 'font-medium' : 'font-normal')}>{label}</span>
              </span>
              {count !== undefined && <span className="ml-1.5 tabular-nums text-(--oc-text-subtle)">{count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
