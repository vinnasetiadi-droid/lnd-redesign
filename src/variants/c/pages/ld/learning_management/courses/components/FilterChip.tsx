// A pill that opens a small menu of options. Shows only its name while on the
// default option, and "Name: Value" otherwise (e.g. "Owner: You").

import { useEffect, useId, useRef, useState, type ElementType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from '@/variants/c/icons';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/variants/c/motion';

export interface ChipOption<V extends string> {
  value: V;
  label: string;
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
}

export function FilterChip<V extends string>({
  name,
  value,
  options,
  onChange,
  defaultValue = options[0]?.value,
  showValueOnly,
  icon: Icon,
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
          'inline-flex h-10 items-center gap-1.5 rounded-(--oc-radius-control) px-4 text-[13px] transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oc-primary)/25',
          // White with a hairline (the references' "Filters" boxes); blue tint while it filters
          active && !showValueOnly
            ? 'bg-(--oc-primary-50) text-(--oc-primary-strong) ring-1 ring-inset ring-(--oc-primary-200)'
            : 'oc-btn-secondary',
        )}
      >
        {Icon && <Icon size={14} className="text-(--oc-text-muted)" />}
        <span className="whitespace-nowrap">{label}</span>
        <ChevronDown size={14} className={cn('text-(--oc-text-muted) transition-transform duration-200', open && 'rotate-180')} />
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
            className="absolute left-0 top-full z-30 mt-1 min-w-[180px] rounded-(--oc-radius-card) bg-(--oc-raised) p-1 shadow-(--oc-shadow-pop)"
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
                    'flex w-full items-center justify-between gap-3 rounded-(--oc-radius-control) px-3 py-2 text-left text-[13px] transition-colors cursor-pointer',
                    'focus-visible:outline-none focus-visible:bg-(--oc-surface)',
                    selected ? 'text-(--oc-text-strong)' : 'text-(--oc-text-body) hover:bg-(--oc-surface)',
                  )}
                >
                  {o.label}
                  {selected && <Check size={14} className="text-(--oc-primary-text)" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
