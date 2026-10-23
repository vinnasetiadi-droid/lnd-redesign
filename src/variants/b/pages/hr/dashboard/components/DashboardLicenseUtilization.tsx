import { useMemo, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { KeyRound } from '@/variants/b/icons';
import { cn } from '@/lib/utils';
import { AIInsightLine } from '@/variants/b/components/ui/ai-insight-banner';
import { ATTENTION, CARD, CardHeader, NumText } from '@/variants/b/components/ui/kit';
import { CHART_BLUE, ChartTooltipCard } from '@/variants/b/components/ui/chart';
import { CountUp, GROW } from '@/variants/b/components/ui/count-up';
import { daysFromNow, daysUntil } from '@/variants/b/pages/ld/dashboard/period';
import { OB_COLORS } from '@/variants/b/theme';

// ── Mock data ──────────────────────────────────────────────────

export interface License {
  name: string;
  /** Shown in the small circle in front of the name */
  initials: string;
  used: number;
  total: number;
  /**
   * Contract renewal date (dummy dates relative to today until contract data
   * lives in the platform). `null` means the license never renews; leave it
   * out when the renewal isn't known, and the row shows no renewal line.
   */
  renewsOn?: string | null;
}

/** Home's licenses; other pages pass their own through `licenses` */
const LICENSES: License[] = [
  { name: "O'Reilly",          initials: 'OR', used: 1, total: 15, renewsOn: daysFromNow(21) },
  { name: 'LinkedIn Learning', initials: 'in', used: 2, total: 15, renewsOn: daysFromNow(104) },
  { name: 'Internal L&D',      initials: 'LX', used: 6, total: 15, renewsOn: null },
];

/** A license needs action when it is barely used and renews soon */
const LOW_USAGE = 25;
const RENEWS_SOON_DAYS = 45;
/** Segments in the gauge */
const SEGMENTS = 20;

function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** "in 3 weeks", "in 5 days" */
function inTime(days: number): string {
  if (days < 14) return `in ${days} day${days === 1 ? '' : 's'}`;
  return `in ${Math.round(days / 7)} weeks`;
}

// ── Gauge ────────────────────────────────────────────────────

/**
 * Half-circle gauge of rounded segments, filled left to right. It is honest to
 * the number: 20% lights up 4 of 20 segments, so the idle seats read at a
 * glance. The segments light up one after another the first time it is seen.
 */
function SegmentGauge({ pct, start, color }: { pct: number; start: boolean; color: string }) {
  const filled = Math.round((pct / 100) * SEGMENTS);
  const cx = 120;
  const cy = 118;
  const outer = 110;
  const inner = 82;
  return (
    <svg viewBox="0 0 240 126" className="w-full max-w-[200px]" aria-hidden>
      {Array.from({ length: SEGMENTS }, (_, i) => {
        // From the left end (180°) to the right end (0°)
        const angle = Math.PI - (i * Math.PI) / (SEGMENTS - 1);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const on = i < filled;
        return (
          <motion.line
            key={i}
            x1={cx + inner * cos}
            y1={cy - inner * sin}
            x2={cx + outer * cos}
            y2={cy - outer * sin}
            strokeWidth={9}
            strokeLinecap="round"
            initial={{ stroke: OB_COLORS.border }}
            animate={{ stroke: start && on ? color : OB_COLORS.border }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: start && on ? 0.15 + i * 0.08 : 0 }}
          />
        );
      })}
    </svg>
  );
}

/**
 * Home's reference-style gauge: thin ticks along a 240° arc, coloured up to
 * the share in use (pale at the start, deepening towards the rate) and grey
 * for the rest, fading out towards the end, inside a faint outer ring. The
 * ticks light up one after another. Orange only when usage is low (it needs
 * attention), blue otherwise.
 */
const TICKS = 44;
const TICK_SWEEP = 240;
function TickGauge({ pct, start, color }: { pct: number; start: boolean; color: string }) {
  const filled = Math.round((pct / 100) * TICKS);
  const size = 200;
  const c = size / 2;
  const from = 90 + (360 - TICK_SWEEP) / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size * 0.86}`} className="w-full max-w-[200px]" aria-hidden>
      {/* Faint outer ring along the same arc */}
      <path
        d={`M ${c + 97 * Math.cos((from * Math.PI) / 180)} ${c + 97 * Math.sin((from * Math.PI) / 180)} A 97 97 0 1 1 ${c + 97 * Math.cos(((from + TICK_SWEEP) * Math.PI) / 180)} ${c + 97 * Math.sin(((from + TICK_SWEEP) * Math.PI) / 180)}`}
        fill="none"
        stroke={OB_COLORS.border}
        strokeWidth={1}
      />
      {Array.from({ length: TICKS }, (_, i) => {
        const angle = ((from + (i / (TICKS - 1)) * TICK_SWEEP) * Math.PI) / 180;
        const on = i < filled;
        const inner = on ? 66 : 72;
        const outer = 90;
        return (
          <motion.line
            key={i}
            x1={c + inner * Math.cos(angle)}
            y1={c + inner * Math.sin(angle)}
            x2={c + outer * Math.cos(angle)}
            y2={c + outer * Math.sin(angle)}
            strokeWidth={4}
            strokeLinecap="round"
            // Filled ticks deepen towards the rate; the grey ones fade towards the end
            strokeOpacity={on ? 0.3 + 0.7 * (i / Math.max(1, filled - 1)) : 1 - 0.6 * ((i - filled) / Math.max(1, TICKS - filled - 1))}
            initial={{ stroke: OB_COLORS.borderStrong }}
            animate={{ stroke: start && on ? color : OB_COLORS.borderStrong }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: start && on ? 0.15 + i * 0.03 : 0 }}
          />
        );
      })}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────

export function DashboardLicenseUtilization({ licenses = LICENSES, variant = 'default', wide = false, showInsight = true, className }: {
  licenses?: License[];
  /** `reference`: Home's look (hairline frame, no icon, tick gauge); other pages keep the default */
  variant?: 'default' | 'reference';
  /** Full-width slot: gauge on the left, the license rows on the right (lg and up), so the section stays short */
  wide?: boolean;
  /** The one-line NISA insight under the licenses (on by default) */
  showInsight?: boolean;
  className?: string;
}) {
  const reference = variant === 'reference';
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  // Lowest usage first, so the most wasted license is on top.
  const rows = useMemo(
    () =>
      licenses.map((l) => {
        const pct = Math.round((l.used / l.total) * 100);
        const days = l.renewsOn ? daysUntil(l.renewsOn) : undefined;
        const needsAction = pct < LOW_USAGE && days !== undefined && days >= 0 && days <= RENEWS_SOON_DAYS;
        return { ...l, pct, days, needsAction };
      }).sort((a, b) => a.pct - b.pct),
    [licenses],
  );

  const used = rows.reduce((s, l) => s + l.used, 0);
  const total = rows.reduce((s, l) => s + l.total, 0);
  const idle = total - used;
  const pct = Math.round((used / total) * 100);
  // Orange means attention only: below the low-usage line the gauge (and the idle count) turn orange
  const lowUsage = pct < LOW_USAGE;
  const gaugeColor = lowUsage ? OB_COLORS.orange : CHART_BLUE;

  // Points at a decision: the license that renews soon while barely used.
  const urgent = rows.find((l) => l.needsAction);
  const insight = urgent
    ? `${urgent.name} renews ${inTime(urgent.days!)} at ${urgent.pct}% usage. Assign seats or downsize.`
    : `${idle} seats are idle across ${rows.length} licenses. Assign them before the next renewal.`;

  return (
    <div className={cn('relative flex flex-col p-5', reference ? cn(CARD, 'gap-5') : 'gap-3 rounded-(--ob-radius-card) bg-(--ob-white)', className)}>
      <CardHeader
        title="License utilization"
        subtitle="Purchased seats actively used by trainees"
        icon={reference ? undefined : KeyRound}
      />

      <div className={cn(wide && 'lg:grid lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-center lg:gap-12')}>
      {/* ── Gauge with the total in the middle ─────────────── */}
      <div ref={ref} className="flex flex-col items-center">
        <div className="group relative flex w-full justify-center">
          <div className="pointer-events-none absolute z-30 hidden group-hover:block right-0 top-0">
            <ChartTooltipCard rows={[{ label: 'Seats used', value: `${used} of ${total}`, color: gaugeColor }, { label: 'Idle', value: idle, color: OB_COLORS.track }]} />
          </div>
          {reference ? <TickGauge pct={pct} start={inView} color={gaugeColor} /> : <SegmentGauge pct={pct} start={inView} color={gaugeColor} />}
          <p className={cn('absolute text-(--ob-text-strong)', reference ? 'top-[38%] text-[30px] leading-[36px] font-semibold' : 'bottom-0 text-[24px] leading-[28px]')}>
            <span className="ob-num"><CountUp value={pct} start={inView} /></span>
            <span className="text-[13px] font-semibold text-(--ob-text-muted)">%</span>
          </p>
        </div>
        <p className="mt-1 text-[12px] text-(--ob-text-muted)">
          <NumText>{`${used} of ${total} seats used · `}</NumText>
          <span className={lowUsage ? ATTENTION.text : undefined}><NumText>{`${idle} idle`}</NumText></span>
        </p>
      </div>

      {/* ── One row per license ────────────────────────────── */}
      <div className={cn('divide-y border-t', wide && 'max-lg:mt-3 lg:border-t-0', reference ? 'divide-(--ob-border-subtle) border-(--ob-border-subtle)' : 'divide-(--ob-border) border-(--ob-border)')}>
        {rows.map((l, i) => (
          <div key={l.name} className="flex gap-3 py-2.5">
            {/* A license, not a person: a 6px rounded square */}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-(--ob-radius-control) bg-(--ob-surface) text-[11px] text-(--ob-text-body)">
              {l.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-[13px] leading-[20px] text-(--ob-text-strong)">{l.name}</p>
                <span className={cn('ob-num shrink-0 text-[13px]', l.needsAction ? ATTENTION.text : 'text-(--ob-text-body)')}>
                  {l.pct}%
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-[12px] leading-[16px]">
                <span className="truncate text-(--ob-text-muted)"><NumText>{`${l.used} of ${l.total} seats · ${l.total - l.used} idle`}</NumText></span>
                <span className={cn('shrink-0', l.needsAction ? ATTENTION.text : 'text-(--ob-text-muted)')}>
                  {l.renewsOn ? `Renews ${shortDate(l.renewsOn)}` : l.renewsOn === null ? 'No renewal' : ''}
                </span>
              </div>
              <div className={cn('mt-1 h-1 w-full overflow-hidden rounded-[2px]', l.needsAction ? ATTENTION.track : 'bg-(--ob-track)')}>
                <motion.div
                  className="h-full rounded-[2px]"
                  style={{ background: l.needsAction ? ATTENTION.bar : CHART_BLUE }}
                  initial={{ width: 0 }}
                  animate={{ width: inView ? `${l.pct}%` : 0 }}
                  transition={{ ...GROW, delay: 0.3 + i * 0.1 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>

      {/* ── AI insight: points at the decision ────────────────── */}
      {showInsight && <AIInsightLine text={insight} lines={wide ? 1 : 2} />}
    </div>
  );
}
