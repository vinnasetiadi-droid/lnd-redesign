import { Children, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Loader2, Search, type LucideIcon } from '@/variants/c/icons';
import { OC_COLORS } from '@/variants/c/theme';

/**
 * Option C building blocks, after the user's references: half-round corners
 * everywhere (--oc-radius-*), black primary and white hairline secondary
 * buttons, plain green/red trend text, and a small grey icon box on the right
 * of each card title.
 */

/** Small grey box holding a card's icon (top right of the card), 8px corners */
export function IconCircle({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-(--oc-radius-chip) bg-(--oc-surface) text-(--oc-text-ai)', className)}>
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

/** The one search field for tables and card lists: white with a hairline, 40px tall like the buttons */
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
        className="h-10 w-full rounded-(--oc-radius-control) bg-(--oc-white) pl-11 pr-10 text-[13px] text-(--oc-text-strong) outline-none ring-1 ring-inset ring-(--oc-border) transition-shadow placeholder:text-(--oc-text-subtle) focus:ring-2 focus:ring-(--oc-primary)/40"
      />
      {loading && <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-(--oc-primary)" />}
    </div>
  );
}

/** Framed table: a grey header row, then hairline rows (list tables share it) */
export const TABLE = {
  frame: 'overflow-hidden rounded-(--oc-radius-card) border border-(--oc-border)',
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

/** Chip shaped like the reference's legend chips (30px tall, 14px side padding, 8px corners); `dot` adds a leading colour dot */
export function Chip({ children, tone = 'neutral', dot, icon: Icon, className }: {
  children: ReactNode;
  tone?: ChipTone;
  dot?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex h-[30px] shrink-0 items-center gap-2 rounded-(--oc-radius-chip) px-3.5 text-[12px] leading-none', CHIP_TONE[tone], className)}>
      {dot && <span className="size-[7px] rounded-full" style={{ background: dot }} />}
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}

/** "+13% vs last month" → change "+13%" and comparison "vs last month" */
const TREND_SPLIT = /^([+\-−]?\d[\d.,]*(?:%| pts)?)\s+(vs\b.*)$/;

/**
 * Trend after the references: the change in a small tinted chip with an arrow
 * (green up, red down, 8px corners), then what it is compared with in muted
 * text. Plain text children are split automatically ("+13% vs last month").
 */
export function Trend({ children, positive = true, className }: { children: ReactNode; positive?: boolean; className?: string }) {
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;
  const parts = Children.toArray(children);
  const text = parts.every((c) => typeof c === 'string' || typeof c === 'number') ? parts.join('') : null;
  const m = text ? TREND_SPLIT.exec(text) : null;
  return (
    <span className={cn('inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px]', className)}>
      <span
        className={cn(
          'inline-flex h-6 items-center gap-0.5 rounded-(--oc-radius-chip) px-1.5 tabular-nums',
          positive ? 'bg-(--oc-success-surface) text-(--oc-success-strong)' : 'bg-(--oc-danger-surface) text-(--oc-danger-strong)',
        )}
      >
        <Arrow size={13} />
        {m ? m[1] : children}
      </span>
      {m?.[2] && <span className="text-(--oc-text-muted)">{m[2]}</span>}
    </span>
  );
}

/** Button with half-round corners: black primary, white secondary with a hairline, or a light blue tint */
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
        'inline-flex h-10 items-center justify-center gap-2 rounded-(--oc-radius-control) px-5 text-[13px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oc-primary)/25 focus-visible:ring-offset-1',
        variant === 'primary'
          ? 'oc-btn-primary'
          : variant === 'tint'
            ? 'bg-(--oc-primary-50) text-(--oc-primary-strong) hover:bg-(--oc-primary-100)'
            : 'oc-btn-secondary',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
