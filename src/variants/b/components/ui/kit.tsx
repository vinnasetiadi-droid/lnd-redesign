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
        <h3 className="text-[15px] leading-[22px] text-(--ob-text-strong)">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[12px] leading-[16px] text-(--ob-text-muted)">{subtitle}</p>}
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

/** Card frame: white, 18px corners, a hairline border and the faintest shadow. Inside `.ob-flat` (Home's one frame) it drops its frame. */
export const CARD = 'ob-card rounded-[18px] bg-(--ob-white) ring-1 ring-(--ob-border) shadow-[0_1px_2px_rgba(16,24,40,0.04)]';

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
 * Summary tile that also picks what a chart shows: a loose column with no
 * frame, the value with a small icon in the tile's colour, and a bar along
 * the bottom in that colour (full strength when picked).
 */
export function MetricTile({ selected, onClick, label, children, color = OB_COLORS.primary, share, icon: Icon, className }: {
  selected: boolean;
  onClick: () => void;
  label: ReactNode;
  /** The value row */
  children: ReactNode;
  /** The tile's own colour for its line, bar and wash */
  color?: string;
  /** 0-100: fills that much of the bottom bar on a grey track, like the reference's segments; full when left out */
  share?: number;
  /** Small icon in the tile's colour before the value */
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      // No frame: a loose column (the parent splits tiles with vertical hairlines);
      // a column layout, so the bar sits at the bottom whatever the tile's height
      // The hairline is set here, not with divide-x on the parent: the button reset would cancel that
      className={cn('group relative flex min-w-0 flex-col justify-between gap-3 border-(--ob-border) px-6 text-left cursor-pointer first:pl-0 last:pr-0 not-first:border-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/30', className)}
    >
      <div>
        <p className={cn('truncate text-[12px] leading-[16px] transition-colors duration-300', selected ? 'text-(--ob-text-strong)' : 'text-(--ob-text-muted) group-hover:text-(--ob-text-body)')}>{label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {Icon && <Icon size={16} className="shrink-0" style={{ color }} />}
          {children}
        </div>
      </div>
      {/* Bar: the colour fades lighter to the right, on a grey track; quieter when not picked */}
      <span className="relative block h-2 overflow-hidden rounded-[4px] bg-(--ob-surface)">
        <span
          className="block h-full rounded-[4px] transition-[width,opacity] duration-500"
          style={{
            width: `${Math.max(0, Math.min(100, share ?? 100))}%`,
            background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 65%, white))`,
            opacity: selected ? 1 : 0.5,
          }}
        />
      </span>
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

/** Pill button, reference style: 3D blue primary, white secondary, or a blue tint */
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
        // The 3D look (gradient, white lip, hairline, shadow) lives in option-b.css
        'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-medium transition-[background,box-shadow] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/25 focus-visible:ring-offset-1',
        variant === 'primary' ? 'ob-btn-primary' : variant === 'tint' ? 'ob-btn-tint' : 'ob-btn-secondary',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
