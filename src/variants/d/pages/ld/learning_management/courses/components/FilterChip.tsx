// A pill that opens a small menu of options. Shows only its name while on the
// default option, and "Name: Value" otherwise (e.g. "Owner: You"). With
// `prefix` it always shows "Prefix Value · count" (the Status menu).

import { useEffect, useId, useRef, useState, type ElementType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from '@/variants/d/icons';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/variants/d/motion';

export interface ChipOption<V extends string> {
  value: V;
  label: string;
  /** Shown muted on the right of the option, and after the value with `prefix` */
  count?: number;
}

interface FilterChipProps<V extends string> {
  /** Shown alone on the default option, e.g. "Type" */
  name: string;
  value: V;
  options: ChipOption<V>[];
  onChange: (value: V) => void;
  /** The option that counts as "not filtering"; defaults to the first one */
  defaultValue?: V;
  /** Sort chips always show the current option, never "Name: …" */
  showValueOnly?: boolean;
  icon?: ElementType;
  /** Always show "Prefix Value · count", e.g. "Status All · 11" */
  prefix?: string;
}

export function FilterChip<V extends string>({
  name,
  value,
  options,
  onChange,
  defaultValue = options[0]?.value,
  showValueOnly,
  icon: Icon,
  prefix,
}: FilterChipProps<V>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const current = options.find((o) => o.value === value);
  const active = value !== defaultValue;
  const label = showValueOnly ? current?.label : active ? `${name}: ${current?.label}` : name;

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
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--od-primary)/25',
          active && !showValueOnly && !prefix
            ? 'bg-(--od-primary-50) text-(--od-primary-strong)'
            : 'bg-(--od-surface) text-(--od-text-strong) hover:bg-(--od-border)',
        )}
      >
        {Icon && <Icon size={14} className="text-(--od-text-muted)" />}
        {prefix ? (
          <span className="whitespace-nowrap">
            <span className="text-(--od-text-muted)">{prefix}</span> {current?.label}
            {current?.count !== undefined && <span className="text-(--od-text-subtle)"> · {current.count}</span>}
          </span>
        ) : (
          <span className="whitespace-nowrap">{label}</span>
        )}
        <ChevronDown size={14} className={cn('text-(--od-text-muted) transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute left-0 top-full z-30 mt-1 min-w-[180px] rounded-[14px] bg-(--od-white) p-1 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]"
          >
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] transition-colors cursor-pointer',
                    'focus-visible:outline-none focus-visible:bg-(--od-surface)',
                    selected ? 'text-(--od-text-strong)' : 'text-(--od-text-body) hover:bg-(--od-surface)',
                  )}
                >
                  <span>{o.label}</span>
                  <span className="flex items-center gap-2">
                    {o.count !== undefined && <span className="tabular-nums text-(--od-text-subtle)">{o.count}</span>}
                    <span className="flex w-[14px] justify-center">{selected && <Check size={14} className="text-(--od-primary)" />}</span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
