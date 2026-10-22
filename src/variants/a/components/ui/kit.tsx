import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from '@/variants/a/icons';
import { OA_COLORS } from '@/variants/a/theme';

/**
 * Option A building blocks, shaped after the "Dashboard Overview" reference:
 * pill buttons and chips, plain green/red trend text, and a small grey icon
 * circle on the right of each card title.
 */

/** Small grey circle holding a card's icon (top right of the card) */
export function IconCircle({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full bg-(--oa-surface) text-(--oa-text-ai)', className)}>
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
        <h3 className="text-[16px] leading-[24px] text-(--oa-text-strong)">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] leading-[18px] text-(--oa-text-muted)">{subtitle}</p>}
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

/** Soft amber for anything that needs attention (at-risk programs, licenses about to renew unused) */
export const ATTENTION = { text: 'text-(--oa-attention-text)', frame: 'bg-(--oa-attention-surface)', bar: OA_COLORS.attentionBar, track: 'bg-(--oa-attention-track)' } as const;

type ChipTone = 'neutral' | 'blue' | 'yellow' | 'green' | 'red';

const CHIP_TONE: Record<ChipTone, string> = {
  neutral: 'bg-(--oa-surface) text-(--oa-text-body)',
  blue:    'bg-(--oa-primary-50) text-(--oa-primary-strong)',
  yellow:  'bg-(--oa-yellow) text-(--oa-yellow-text)',
  green:   'bg-(--oa-success-surface) text-(--oa-success-strong)',
  red:     'bg-(--oa-danger-surface) text-(--oa-danger-strong)',
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
    <span className={cn('inline-flex items-center gap-0.5 text-[12px]', positive ? 'text-(--oa-success)' : 'text-(--oa-danger)', className)}>
      <Arrow size={14} />
      {children}
    </span>
  );
}

/** Pill button: light grey secondary, or black primary */
export function PillButton({ children, icon: Icon, variant = 'secondary', className, ...rest }: {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-[13px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25 focus-visible:ring-offset-1',
        variant === 'primary'
          ? 'bg-(--oa-button-primary) text-white hover:bg-(--oa-button-primary-hover)'
          : 'bg-(--oa-button-secondary) text-(--oa-text-strong) hover:bg-(--oa-button-secondary-hover)',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
