import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Loader2, Search, type LucideIcon } from '@/variants/c/icons';
import { OC_COLORS } from '@/variants/c/theme';

/**
 * Option C building blocks, shaped after the "Dashboard Overview" reference:
 * pill buttons and chips, plain green/red trend text, and a small grey icon
 * circle on the right of each card title.
 */

/** Small grey circle holding a card's icon (top right of the card) */
export function IconCircle({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full bg-(--oc-surface) text-(--oc-text-ai)', className)}>
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
        <h3 className="text-[16px] leading-[24px] text-(--oc-text-strong)">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] leading-[18px] text-(--oc-text-muted)">{subtitle}</p>}
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
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--oc-text-muted)" />
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-full bg-(--oc-surface) pl-11 pr-10 text-[13px] text-(--oc-text-strong) outline-none transition-colors placeholder:text-(--oc-text-subtle) focus:bg-(--oc-white) focus:ring-2 focus:ring-(--oc-primary)/25"
      />
      {loading && <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-(--oc-primary)" />}
    </div>
  );
}

/** Framed table: a grey header row, then hairline rows (list tables share it) */
export const TABLE = {
  frame: 'overflow-hidden rounded-[14px] border border-(--oc-border)',
  head: 'min-h-11 bg-(--oc-surface-muted) text-[13px] text-(--oc-text-secondary)',
  row: 'border-t border-(--oc-border) transition-colors hover:bg-(--oc-surface-subtle)',
} as const;

/** Soft amber for anything that needs attention (at-risk programs, licenses about to renew unused) */
export const ATTENTION = { text: 'text-(--oc-attention-text)', frame: 'bg-(--oc-attention-surface)', bar: OC_COLORS.attentionBar, track: 'bg-(--oc-attention-track)' } as const;

type ChipTone = 'neutral' | 'blue' | 'yellow' | 'green' | 'red';

const CHIP_TONE: Record<ChipTone, string> = {
  neutral: 'bg-(--oc-surface) text-(--oc-text-body)',
  blue:    'bg-(--oc-primary-50) text-(--oc-primary-strong)',
  yellow:  'bg-(--oc-yellow) text-(--oc-yellow-text)',
  green:   'bg-(--oc-success-surface) text-(--oc-success-strong)',
  red:     'bg-(--oc-danger-surface) text-(--oc-danger-strong)',
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
    <span className={cn('inline-flex items-center gap-0.5 text-[12px]', positive ? 'text-(--oc-success)' : 'text-(--oc-danger)', className)}>
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
        'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-[13px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oc-primary)/25 focus-visible:ring-offset-1',
        variant === 'primary'
          ? 'bg-(--oc-button-primary) text-white hover:bg-(--oc-button-primary-hover)'
          : variant === 'tint'
            ? 'bg-(--oc-primary-50) text-(--oc-primary-strong) hover:bg-(--oc-primary-100)'
            : 'bg-(--oc-button-secondary) text-(--oc-text-strong) hover:bg-(--oc-button-secondary-hover)',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
