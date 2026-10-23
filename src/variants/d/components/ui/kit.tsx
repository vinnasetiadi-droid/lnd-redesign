import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Loader2, Search, type LucideIcon } from '@/variants/d/icons';
import { OD_COLORS } from '@/variants/d/theme';

/**
 * Option D building blocks, shaped after the "Dashboard Overview" reference:
 * pill buttons and chips, plain green/red trend text, and a small grey icon
 * circle on the right of each card title.
 */

/** Small grey circle holding a card's icon (top right of the card) */
export function IconCircle({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full bg-(--od-surface) text-(--od-text-ai)', className)}>
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
        <h3 className="text-[16px] leading-[24px] text-(--od-text-strong)">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] leading-[18px] text-(--od-text-muted)">{subtitle}</p>}
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
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--od-text-muted)" />
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-full bg-(--od-surface) pl-11 pr-10 text-[13px] text-(--od-text-strong) outline-none transition-colors placeholder:text-(--od-text-subtle) focus:bg-(--od-card) focus:ring-2 focus:ring-(--od-primary)/25"
      />
      {loading && <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-(--od-primary-text)" />}
    </div>
  );
}

/** Framed table: a grey header row, then hairline rows (list tables share it) */
export const TABLE = {
  frame: 'overflow-hidden rounded-[14px] border border-(--od-border)',
  head: 'min-h-11 bg-(--od-surface-muted) text-[13px] text-(--od-text-secondary)',
  row: 'border-t border-(--od-border) transition-colors hover:bg-(--od-surface-subtle)',
} as const;

/** Soft amber for anything that needs attention (at-risk programs, licenses about to renew unused) */
export const ATTENTION = { text: 'text-(--od-attention-text)', frame: 'bg-(--od-attention-surface)', bar: OD_COLORS.attentionBar, track: 'bg-(--od-attention-track)' } as const;

type ChipTone = 'neutral' | 'blue' | 'yellow' | 'green' | 'red';

const CHIP_TONE: Record<ChipTone, string> = {
  neutral: 'bg-(--od-surface) text-(--od-text-body)',
  blue:    'bg-(--od-primary-50) text-(--od-primary-strong)',
  yellow:  'bg-(--od-yellow) text-(--od-yellow-text)',
  green:   'bg-(--od-success-surface) text-(--od-success-strong)',
  red:     'bg-(--od-danger-surface) text-(--od-danger-strong)',
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

/** Plain trend text: "↗ 12.5%" in green, "↘" in red, no background */
export function Trend({ children, positive = true, className }: { children: ReactNode; positive?: boolean; className?: string }) {
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-[12px]', positive ? 'text-(--od-success)' : 'text-(--od-danger)', className)}>
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
        'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-[13px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--od-primary)/25 focus-visible:ring-offset-1',
        variant === 'primary'
          ? 'bg-(--od-button-primary) text-white hover:bg-(--od-button-primary-hover)'
          : variant === 'tint'
            ? 'bg-(--od-primary-50) text-(--od-primary-strong) hover:bg-(--od-primary-100)'
            : 'bg-(--od-button-secondary) text-(--od-text-strong) hover:bg-(--od-button-secondary-hover)',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
