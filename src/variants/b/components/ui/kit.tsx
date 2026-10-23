import { Children, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Loader2, Search, type LucideIcon } from '@/variants/b/icons';
import { OB_COLORS } from '@/variants/b/theme';

/**
 * Option B building blocks, shaped after the "Dashboard Overview" reference:
 * 3D buttons, squarer chips (--ob-radius-control), plain green/red trend
 * text, and numbers in Geist Mono (.ob-num).
 */

/** Digit runs ("68%", "+14", "1,234", "3/5") in a string; everything else is text */
const NUMBER_RUN = /([+\-−]?\d[\d,.]*(?:\/\d[\d,.]*)?%?)/;

/**
 * Text with its numbers in Geist Mono: "36 participants" → "36" in .ob-num,
 * " participants" stays Inter. Takes plain strings and numbers (or a list of
 * them, as JSX gives for `{n} pts`); anything else passes through unchanged.
 */
export function NumText({ children }: { children: ReactNode }) {
  return (
    <>
      {Children.toArray(children).map((child, i) =>
        typeof child === 'string' || typeof child === 'number'
          ? String(child).split(NUMBER_RUN).map((part, j) =>
              j % 2 ? <span key={`${i}-${j}`} className="ob-num">{part}</span> : part,
            )
          : child,
      )}
    </>
  );
}

/** Small grey 6px square holding an icon (round shapes are for people) */
export function IconCircle({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    // The icon is in the accent blue: an icon circle marks something to look at
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-(--ob-radius-control) bg-(--ob-surface) text-(--ob-primary)', className)}>
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
        <h3 className="text-[18px] leading-[26px] text-(--ob-text-strong)">{title}</h3>
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

/** The one search field for tables and card lists: 40px tall like the buttons */
export function SearchField({ value, onChange, placeholder, loading, variant = 'field', className }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Shows a spinner while results update */
  loading?: boolean;
  /** `field`: a white box with a hairline and 6px corners. `bar`: a flat segment of a hairline toolbar (no fill, no rounding), 48px tall */
  variant?: 'field' | 'bar';
  className?: string;
}) {
  const bar = variant === 'bar';
  return (
    <div className={cn('relative', className)}>
      <Search className={cn('pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-(--ob-text-muted)', bar ? 'left-0' : 'left-4')} />
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full text-[13px] text-(--ob-text-strong) outline-none transition-colors placeholder:text-(--ob-text-subtle)',
          bar
            ? 'h-12 bg-transparent pl-7 pr-10'
            : 'h-10 rounded-(--ob-radius-control) bg-(--ob-white) pl-11 pr-10 ring-1 ring-inset ring-(--ob-border) focus:ring-(--ob-primary)',
        )}
      />
      {loading && <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-(--ob-primary)" />}
    </div>
  );
}

/** Framed table: a grey header row, then hairline rows (list tables share it) */
export const TABLE = {
  frame: 'overflow-hidden rounded-(--ob-radius-card) border border-(--ob-border)',
  head: 'min-h-11 bg-(--ob-surface-muted) text-[13px] text-(--ob-text-secondary)',
  row: 'border-t border-(--ob-border) transition-colors hover:bg-(--ob-surface-subtle)',
} as const;

/** Orange for anything that needs attention (at-risk programs, licenses about to renew unused): the License gauge's family */
export const ATTENTION = { text: 'text-(--ob-attention-text)', frame: 'bg-(--ob-attention-surface)', bar: OB_COLORS.attentionBar, track: 'bg-(--ob-attention-track)' } as const;

type ChipTone = 'neutral' | 'blue' | 'yellow' | 'green' | 'red';

const CHIP_TONE: Record<ChipTone, string> = {
  neutral: 'bg-(--ob-surface) text-(--ob-text-body)',
  blue:    'bg-(--ob-primary-50) text-(--ob-primary-strong)',
  yellow:  'bg-(--ob-attention-surface) text-(--ob-attention-text)', // attention, same as ATTENTION
  green:   'bg-(--ob-success-surface) text-(--ob-success-strong)',
  red:     'bg-(--ob-danger-surface) text-(--ob-danger-strong)',
};

/** Chip shaped like the reference's legend chips (30px tall, 14px side padding, 6px corners); `dot` adds a leading colour dot */
export function Chip({ children, tone = 'neutral', dot, icon: Icon, className }: {
  children: ReactNode;
  tone?: ChipTone;
  dot?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex h-[30px] shrink-0 items-center gap-2 rounded-(--ob-radius-control) px-3.5 text-[12px] leading-none', CHIP_TONE[tone], className)}>
      {dot && <span className="size-[7px] rounded-full" style={{ background: dot }} />}
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}

/** Card frame: white, 12px corners, a hairline border and the faintest shadow. Inside `.ob-flat` (Home's one frame) it drops its frame. */
export const CARD = 'ob-card rounded-(--ob-radius-card) bg-(--ob-white) ring-1 ring-(--ob-border) shadow-[0_1px_2px_rgba(16,24,40,0.04)]';

/** Change chip beside a number: "▲ 15.5%" on green, "▼ 10.5%" on red; the number in Geist Mono, "pts" in Inter */
export function DeltaChip({ children, positive = true, className }: { children: ReactNode; positive?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1 rounded-(--ob-radius-control) px-2 text-[12px]',
        positive ? 'bg-(--ob-success-surface) text-(--ob-success-strong)' : 'bg-(--ob-danger-surface) text-(--ob-danger-strong)',
        className,
      )}
    >
      <svg viewBox="0 0 8 6" className={cn('size-2', !positive && 'rotate-180')} aria-hidden>
        <path d="M4 0 8 6H0z" fill="currentColor" />
      </svg>
      <NumText>{children}</NumText>
    </span>
  );
}

/**
 * Summary tile that also picks what a chart shows: a loose column with no
 * frame, the value with a small icon, and a bar along the bottom. Blue is
 * the one accent: only the picked tile's icon and bar are blue.
 */
export function MetricTile({ selected, onClick, label, children, share, icon: Icon, className }: {
  selected: boolean;
  onClick: () => void;
  label: ReactNode;
  /** The value row */
  children: ReactNode;
  /** 0-100: fills that much of the bottom bar on a grey track, like the reference's segments; full when left out */
  share?: number;
  /** Small icon before the value: blue when picked, grey otherwise */
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      // No frame: a loose column; a column layout, so the bar sits at the bottom whatever the tile's height
      className={cn('group relative flex min-w-0 flex-col justify-between gap-3 px-6 text-left cursor-pointer first:pl-0 last:pr-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/30', className)}
    >
      {/* Divider before every tile but the first: a lighter line, stopping 4px short of the top and bottom */}
      <span aria-hidden className="pointer-events-none absolute bottom-1 left-0 top-1 w-px bg-(--ob-border-subtle) group-first:hidden" />
      <div>
        <p className={cn('truncate text-[13px] leading-[18px] transition-colors duration-300', selected ? 'text-(--ob-text-strong)' : 'text-(--ob-text-muted) group-hover:text-(--ob-text-body)')}>{label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {Icon && (
            <Icon
              size={16}
              className={cn('shrink-0 transition-colors duration-300', selected ? 'text-(--ob-primary)' : 'text-(--ob-text-subtle) group-hover:text-(--ob-text-muted)')}
            />
          )}
          {children}
        </div>
      </div>
      {/* Bar on the track, 4px tall with 2px corners: solid blue when picked, grey otherwise (one accent) */}
      <span className="relative block h-1 overflow-hidden rounded-[2px] bg-(--ob-track)">
        <span
          className={cn('block h-full rounded-[2px] transition-[width,background-color] duration-500', selected ? 'bg-(--ob-primary)' : 'bg-(--ob-border-control)')}
          style={{ width: `${Math.max(0, Math.min(100, share ?? 100))}%` }}
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

/** Button, reference style: 3D blue primary or white secondary (no tinted fills); square with big, almost round corners */
export function PillButton({ children, icon: Icon, variant = 'secondary', className, ...rest }: {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        // The 3D look (gradient, white lip, hairline, shadow) lives in option-b.css
        'inline-flex h-10 items-center justify-center gap-2 rounded-(--ob-radius-button) px-5 text-[13px] font-medium transition-[background,box-shadow] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/25 focus-visible:ring-offset-1',
        variant === 'primary' ? 'ob-btn-primary' : 'ob-btn-secondary',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
