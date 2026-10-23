import { useMemo, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { KeyRound } from '@/variants/b/icons';
import { cn } from '@/lib/utils';
import { AIInsightLine } from '@/variants/b/components/ui/ai-insight-banner';
import { ATTENTION, CardHeader } from '@/variants/b/components/ui/kit';
import { CHART_BLUE } from '@/variants/b/components/ui/chart';
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
function SegmentGauge({ pct, start }: { pct: number; start: boolean }) {
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
            animate={{ stroke: start && on ? CHART_BLUE : OB_COLORS.border }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: start && on ? 0.15 + i * 0.08 : 0 }}
          />
        );
      })}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────

export function DashboardLicenseUtilization({ licenses = LICENSES, className }: { licenses?: License[]; className?: string }) {
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

  // Points at a decision: the license that renews soon while barely used.
  const urgent = rows.find((l) => l.needsAction);
  const insight = urgent
    ? `${urgent.name} renews ${inTime(urgent.days!)} at ${urgent.pct}% usage. Assign seats or downsize.`
    : `${idle} seats are idle across ${rows.length} licenses. Assign them before the next renewal.`;

  return (
    <div className={cn('relative flex flex-col gap-3 bg-white rounded-[18px] p-5', className)}>
      <CardHeader
        title="License utilization"
        subtitle="Purchased seats actively used by trainees"
        icon={KeyRound}
      />

      {/* ── Gauge with the total in the middle ─────────────── */}
      <div ref={ref} className="flex flex-col items-center">
        <div className="relative flex w-full justify-center">
          <SegmentGauge pct={pct} start={inView} />
          <p className="absolute bottom-0 text-[24px] leading-[28px] text-(--ob-text-strong)">
            <CountUp value={pct} start={inView} />
            <span className="text-[13px] text-(--ob-text-muted)">%</span>
          </p>
        </div>
        <p className="mt-1 text-[12px] text-(--ob-text-muted)">
          {used} of {total} seats used · <span className={ATTENTION.text}>{idle} idle</span>
        </p>
      </div>

      {/* ── One row per license ────────────────────────────── */}
      <div className="divide-y divide-(--ob-border) border-t border-(--ob-border)">
        {rows.map((l, i) => (
          <div key={l.name} className="flex gap-3 py-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--ob-surface) text-[11px] text-(--ob-text-body)">
              {l.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-[13px] leading-[20px] text-(--ob-text-strong)">{l.name}</p>
                <span className={cn('shrink-0 text-[13px] tabular-nums', l.needsAction ? ATTENTION.text : 'text-(--ob-text-body)')}>
                  {l.pct}%
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-[12px] leading-[18px]">
                <span className="truncate text-(--ob-text-muted)">{l.used} of {l.total} seats · {l.total - l.used} idle</span>
                <span className={cn('shrink-0', l.needsAction ? ATTENTION.text : 'text-(--ob-text-muted)')}>
                  {l.renewsOn ? `Renews ${shortDate(l.renewsOn)}` : l.renewsOn === null ? 'No renewal' : ''}
                </span>
              </div>
              <div className={cn('mt-1 h-1.5 w-full overflow-hidden rounded-full', l.needsAction ? ATTENTION.track : 'bg-(--ob-border-strong)')}>
                <motion.div
                  className="h-full rounded-full"
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

      {/* ── AI insight: points at the decision ────────────────── */}
      <AIInsightLine text={insight} lines={2} />
    </div>
  );
}
