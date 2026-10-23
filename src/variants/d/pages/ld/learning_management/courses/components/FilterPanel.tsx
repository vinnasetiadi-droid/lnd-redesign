// One "Filter" pill that opens a panel with every filter group (Owner, Type,
// Mode), each a short list of options. The pill carries a teal badge with the
// number of filters in use. FilterTags lists those filters under the toolbar,
// each removable, with Clear all.

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, SlidersHorizontal, X } from '@/variants/d/icons';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/variants/d/motion';
import type { ChipOption } from './FilterChip';

export interface FilterGroup {
  key: string;
  name: string;
  value: string;
  /** The first option is "not filtering" */
  options: ChipOption<string>[];
  onChange: (value: string) => void;
}

const isActive = (g: FilterGroup) => g.value !== g.options[0]?.value;

export function FilterPanel({ groups, onClear }: { groups: FilterGroup[]; onClear: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const used = groups.filter(isActive).length;

  // Close on a click outside or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] text-(--od-text-strong) transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--od-primary)/25',
          open ? 'bg-(--od-border)' : 'bg-(--od-surface) hover:bg-(--od-border)',
        )}
      >
        <SlidersHorizontal size={16} className="text-(--od-text-muted)" />
        Filter
        {used > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--od-primary) px-1.5 text-[11px] tabular-nums text-(--od-white)">
            {used}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Filters"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute left-0 top-full z-30 mt-1 w-[260px] origin-top-left rounded-[14px] bg-(--od-raised) p-1 shadow-(--od-shadow-menu)"
          >
            {groups.map((g, i) => (
              <div key={g.key} className={cn('py-1', i > 0 && 'border-t border-(--od-border)')}>
                <p className="px-3 pb-1 pt-1.5 text-[12px] text-(--od-text-muted)">{g.name}</p>
                {g.options.map((o) => {
                  const selected = o.value === g.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => g.onChange(o.value)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-1.5 text-left text-[13px] transition-colors cursor-pointer',
                        'focus-visible:outline-none focus-visible:bg-(--od-surface)',
                        selected ? 'text-(--od-text-strong)' : 'text-(--od-text-body) hover:bg-(--od-surface)',
                      )}
                    >
                      {o.label}
                      {selected && <Check size={14} className="text-(--od-primary-text)" />}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="flex justify-end border-t border-(--od-border) px-2 pb-1 pt-2">
              <button
                type="button"
                onClick={onClear}
                disabled={used === 0}
                className="rounded-[8px] px-2 py-1 text-[12px] text-(--od-primary-strong) transition-colors hover:bg-(--od-primary-50) disabled:text-(--od-text-subtle) disabled:hover:bg-transparent cursor-pointer disabled:cursor-default"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The filters in use, under the toolbar: "Owner: You ×", then Clear all. Nothing when none are in use. */
export function FilterTags({ groups, onClear }: { groups: FilterGroup[]; onClear: () => void }) {
  const used = groups.filter(isActive);
  return (
    <AnimatePresence initial={false}>
      {used.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="-mt-2 overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {used.map((g) => (
              <span key={g.key} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-(--od-primary-50) pl-3 pr-1 text-[12px] text-(--od-primary-strong)">
                {g.name}: {g.options.find((o) => o.value === g.value)?.label}
                <button
                  type="button"
                  aria-label={`Remove ${g.name} filter`}
                  onClick={() => g.onChange(g.options[0].value)}
                  className="flex size-5 items-center justify-center rounded-full transition-colors hover:bg-(--od-primary-100) cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <button type="button" onClick={onClear} className="px-1 text-[12px] text-(--od-text-muted) transition-colors hover:text-(--od-text-strong) cursor-pointer">
              Clear all
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
