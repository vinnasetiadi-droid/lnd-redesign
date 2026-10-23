import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Loader2, Search, type LucideIcon } from '@/variants/b/icons';
import { OB_COLORS } from '@/variants/b/theme';

/**
 * Option B building blocks, shaped after the "Dashboard Overview" reference:
 * pill buttons and chips, plain green/red trend text, and a small grey icon
 * circle on the right of each card title.
 */

/** Small grey circle holding a card's icon (top right of the card) */
export function IconCircle({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full bg-(--ob-surface) text-(--ob-text-ai)', className)}>
      <Icon size={16} />
    </span>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon;
  /** Chips or trend shown before the icon */
  extra?: ReactNode;
  className?: string;
}

/** Title (and subtitle) on the left, extras and the icon circle on the right */
export function CardHeader({ title, subtitle, icon, extra, className }: CardHeaderProps) {
  return (
    // Wraps on narrow screens so tabs in `extra` drop below the title instead of overflowing
    <div className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="text-[16px] leading-[24px] text-(--ob-text-strong)">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] leading-[18px] text-(--ob-text-muted)">{subtitle}</p>}
      </div>
      {(extra || icon) && (
        <div className="flex shrink-0 items-center gap-2">
          {extra}
          {icon && <IconCircle icon={icon} />}
        </div>
      )}
    </div>
  );
}

/** The one search pill for tables and card lists: 40px tall like the pill buttons */
export function SearchField({ value, onChange, placeholder, loading, className }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Shows a spinner while results update */
  loading?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--ob-text-muted)" />
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-full bg-(--ob-surface) pl-11 pr-10 text-[13px] text-(--ob-text-strong) outline-none transition-colors placeholder:text-(--ob-text-subtle) focus:bg-(--ob-white) focus:ring-2 focus:ring-(--ob-primary)/25"
      />
      {loading && <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-(--ob-primary)" />}
    </div>
  );
}

/** Framed table: a grey header row, then hairline rows (list tables share it) */
export const TABLE = {
  frame: 'overflow-hidden rounded-[14px] border border-(--ob-border)',
  head: 'min-h-11 bg-(--ob-surface-muted) text-[13px] text-(--ob-text-secondary)',
  row: 'border-t border-(--ob-border) transition-colors hover:bg-(--ob-surface-subtle)',
} as const;

/** Soft amber for anything that needs attention (at-risk programs, licenses about to renew unused) */
export const ATTENTION = { text: 'text-(--ob-attention-text)', frame: 'bg-(--ob-attention-surface)', bar: OB_COLORS.attentionBar, track: 'bg-(--ob-attention-track)' } as const;

type ChipTone = 'neutral' | 'blue' | 'yellow' | 'green' | 'red';

const CHIP_TONE: Record<ChipTone, string> = {
  neutral: 'bg-(--ob-surface) text-(--ob-text-body)',
  blue:    'bg-(--ob-primary-50) text-(--ob-primary-strong)',
  yellow:  'bg-(--ob-yellow) text-(--ob-yellow-text)',
  green:   'bg-(--ob-success-surface) text-(--ob-success-strong)',
  red:     'bg-(--ob-danger-surface) text-(--ob-danger-strong)',
};

/** Chip shaped like the reference's legend chips (30px tall, 14px side padding, 10px corners); `dot` adds a leading colour dot */
export function Chip({ children, tone = 'neutral', dot, icon: Icon, className }: {
  children: ReactNode;
  tone?: ChipTone;
  dot?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex h-[30px] shrink-0 items-center gap-2 rounded-[10px] px-3.5 text-[12px] leading-none', CHIP_TONE[tone], className)}>
      {dot && <span className="size-[7px] rounded-full" style={{ background: dot }} />}
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}

/** Home card frame: white, 18px corners, a hairline border and the faintest shadow (reference style) */
export const CARD = 'rounded-[18px] bg-(--ob-white) ring-1 ring-(--ob-border) shadow-[0_1px_2px_rgba(16,24,40,0.04)]';

/** Change chip beside a number: "▲ 15.5%" on green, "▼ 10.5%" on red */
export function DeltaChip({ children, positive = true, className }: { children: ReactNode; positive?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[12px] tabular-nums',
        positive ? 'bg-(--ob-success-surface) text-(--ob-success-strong)' : 'bg-(--ob-danger-surface) text-(--ob-danger-strong)',
        className,
      )}
    >
      <svg viewBox="0 0 8 6" className={cn('size-2', !positive && 'rotate-180')} aria-hidden>
        <path d="M4 0 8 6H0z" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}

/**
 * Summary tile that also picks what a chart shows, drawn like the
 * reference's segments: a thin line down the left, a bar along the bottom
 * and a soft wash of blue when selected.
 */
export function MetricTile({ selected, onClick, label, children, className }: {
  selected: boolean;
  onClick: () => void;
  label: ReactNode;
  /** The value row */
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn('group relative min-w-0 overflow-hidden rounded-t-[10px] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/30', className)}
    >
      <span
        aria-hidden
        className={cn('pointer-events-none absolute inset-0 transition-opacity duration-300', selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40')}
        style={{ background: `linear-gradient(to top, color-mix(in srgb, ${OB_COLORS.primary} 10%, transparent), transparent 80%)` }}
      />
      <div className={cn('relative border-l-2 px-3.5 pb-3 pt-2.5 transition-colors duration-300', selected ? 'border-(--ob-primary)' : 'border-(--ob-border-strong)')}>
        <p className="truncate text-[13px] leading-[18px] text-(--ob-text-secondary)">{label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">{children}</div>
      </div>
      <span className={cn('relative block h-1 rounded-full transition-colors duration-300', selected ? 'bg-(--ob-primary)' : 'bg-(--ob-border-strong)')} />
    </button>
  );
}

/** Plain trend text: "↗ 12.5%" in green, "↘" in red, no background */
export function Trend({ children, positive = true, className }: { children: ReactNode; positive?: boolean; className?: string }) {
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-[12px]', positive ? 'text-(--ob-success)' : 'text-(--ob-danger)', className)}>
      <Arrow size={14} />
      {children}
    </span>
  );
}

/** Pill button: light grey secondary, or black primary */
export function PillButton({ children, icon: Icon, variant = 'secondary', className, ...rest }: {
  children: ReactNode;
  icon?: LucideIcon;
  /** tint: a blue-tinted pill for the one action a card asks for (e.g. Review) */
  variant?: 'primary' | 'secondary' | 'tint';
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-[13px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/25 focus-visible:ring-offset-1',
        variant === 'primary'
          ? 'bg-(--ob-button-primary) text-white hover:bg-(--ob-button-primary-hover)'
          : variant === 'tint'
            ? 'bg-(--ob-primary-50) text-(--ob-primary-strong) hover:bg-(--ob-primary-100)'
            : 'bg-(--ob-button-secondary) text-(--ob-text-strong) hover:bg-(--ob-button-secondary-hover)',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
