// ============================================================
// Learning funnel — from assignment to completion, per learning mode.
// A horizontal flow: one band per mode (blended in the middle, self-paced
// split above and below), narrowing at each stage. A line at each stage
// carries the total (top pill) and the share kept from the stage before
// (bottom pill). The table underneath lines its columns up with the lines.
// ============================================================

import { useId, useMemo, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { TrendingDown } from '@/variants/a/icons';
import { CardHeader, ATTENTION } from '@/variants/a/components/ui/kit';
import { LegendMark } from '@/variants/a/components/ui/chart';
import { EASE_OUT } from '@/variants/a/motion';
import { OA_COLORS } from '@/variants/a/theme';

type ProgramType = 'course' | 'journey';
type Mode = 'blended' | 'self';

const STAGES = ['Assigned', 'Enrolled', 'Started', 'Completed'] as const;

/** Learners per stage and mode this quarter; blended + self-paced = the totals */
const FUNNEL: Record<ProgramType, Record<Mode, number[]>> = {
  course: {
    blended: [78, 70, 62, 48],
    self:    [62, 50, 38, 24],
  },
  journey: {
    blended: [110, 96, 80, 66],
    self:    [80, 64, 48, 36],
  },
};

// Same colours as Learning mode analytics on Home
const MODES: { key: Mode; label: string; color: string }[] = [
  { key: 'blended', label: 'Blended',    color: OA_COLORS.primary },
  { key: 'self',    label: 'Self-paced', color: OA_COLORS.modeSelf },
];

// Layout: a label column, then one column per stage. Stage lines sit in the
// middle of their column, so the table below lines up with them.
const LABEL_COL = 1.2;
const TOTAL_COLS = LABEL_COL + STAGES.length;
const stageX = (i: number) => ((LABEL_COL + i + 0.5) / TOTAL_COLS) * 100; // percent

// SVG space: 1000 wide (stretched to the card), H tall
const W = 1000;
const H = 220;
const MAX_BAND = H * 0.74;
const PLATEAU = 38; // half-width of the flat part around each stage, in SVG units

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Value at x: flat around each stage, an S-curve between stages, flat out to the edges */
function valueAt(x: number, values: number[]) {
  const xs = values.map((_, i) => (stageX(i) / 100) * W);
  if (x <= xs[0] + PLATEAU) return values[0];
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i] + PLATEAU;
    const b = xs[i + 1] - PLATEAU;
    if (x <= a) return values[i];
    if (x < b) return values[i] + (values[i + 1] - values[i]) * smooth((x - a) / (b - a));
  }
  return values[values.length - 1];
}

/** Closed path between two edges, sampled across the width */
function bandPath(top: (x: number) => number, bottom: (x: number) => number) {
  const steps = 120;
  const xs = Array.from({ length: steps + 1 }, (_, i) => (i / steps) * W);
  const upper = xs.map((x) => `${x.toFixed(1)},${top(x).toFixed(1)}`);
  const lower = [...xs].reverse().map((x) => `${x.toFixed(1)},${bottom(x).toFixed(1)}`);
  return `M${upper.join(' L')} L${lower.join(' L')} Z`;
}

export function LearningProgressFunnel({ programType, className }: { programType: ProgramType; className?: string }) {
  const data = FUNNEL[programType];
  const totals = STAGES.map((_, i) => data.blended[i] + data.self[i]);
  const scale = MAX_BAND / Math.max(...totals);
  const c = H / 2;

  // Self-paced wraps blended: half above, half below
  const paths = useMemo(() => {
    const t = (x: number) => valueAt(x, totals) * scale;
    const b = (x: number) => valueAt(x, data.blended) * scale;
    return {
      selfTop: bandPath((x) => c - t(x) / 2, (x) => c - b(x) / 2),
      blended: bandPath((x) => c - b(x) / 2, (x) => c + b(x) / 2),
      selfBottom: bandPath((x) => c + b(x) / 2, (x) => c + t(x) / 2),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programType]);

  // The weakest cell: the mode and stage with the lowest share kept from the stage before
  const weakest = useMemo(() => {
    let worst = { mode: 'blended' as Mode, stage: 1, rate: 1 };
    for (const m of MODES) {
      for (let i = 1; i < STAGES.length; i++) {
        const rate = data[m.key][i] / data[m.key][i - 1];
        if (rate < worst.rate) worst = { mode: m.key, stage: i, rate };
      }
    }
    return worst;
  }, [data]);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');

  const columns = { gridTemplateColumns: `${LABEL_COL}fr repeat(${STAGES.length}, 1fr)` };

  return (
    <div className={cn('relative flex flex-col gap-5 rounded-[18px] bg-white p-5', className)}>
      <CardHeader
        title="Learning funnel"
        subtitle="From assignment to completion · this quarter"
        icon={TrendingDown}
        extra={
          <div className="flex items-center gap-4 pr-1">
            {MODES.map((m) => (
              <span key={m.key} className="flex items-center gap-1.5 text-[12px] text-(--oa-text-muted)">
                <LegendMark color={m.color} />
                {m.label}
              </span>
            ))}
          </div>
        }
      />

      {/* ── Flow ─────────────────────────────────────────── */}
      <div ref={ref} className="relative" style={{ height: H + 56 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-7 w-full"
          style={{ height: H }}
          aria-hidden
        >
          <defs>
            {/* The flow fades in from the left edge */}
            <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={OA_COLORS.white} stopOpacity="0" />
              <stop offset={String(stageX(0) / 100)} stopColor={OA_COLORS.white} stopOpacity="1" />
            </linearGradient>
            <mask id={`${id}-mask`}>
              <rect width={W} height={H} fill={`url(#${id}-fade)`} />
            </mask>
            {/* Draws in from left to right the first time it is seen */}
            <clipPath id={`${id}-reveal`}>
              <motion.rect
                y={0}
                height={H}
                initial={{ width: 0 }}
                animate={{ width: inView ? W : 0 }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
              />
            </clipPath>
          </defs>
          <g mask={`url(#${id}-mask)`} clipPath={`url(#${id}-reveal)`}>
            <motion.path d={paths.selfTop} fill={OA_COLORS.modeSelf} fillOpacity={0.45} animate={{ d: paths.selfTop }} transition={{ duration: 0.5, ease: EASE_OUT }} />
            <motion.path d={paths.selfBottom} fill={OA_COLORS.modeSelf} fillOpacity={0.45} animate={{ d: paths.selfBottom }} transition={{ duration: 0.5, ease: EASE_OUT }} />
            <motion.path d={paths.blended} fill={OA_COLORS.primary} fillOpacity={0.85} animate={{ d: paths.blended }} transition={{ duration: 0.5, ease: EASE_OUT }} />
          </g>
        </svg>

        {/* Stage lines with the total on top and the share kept below */}
        {STAGES.map((stage, i) => {
          const kept = i === 0 ? 100 : Math.round((totals[i] / totals[i - 1]) * 100);
          return (
            <motion.div
              key={stage}
              className="absolute inset-y-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${stageX(i)}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.15 }}
            >
              <span className="whitespace-nowrap rounded-full bg-(--oa-white) px-3 py-1 text-[13px] tabular-nums text-(--oa-text-strong) shadow-[0_2px_8px_-2px_rgba(16,24,40,0.14)]">
                {totals[i]}
              </span>
              <span className="w-0.5 flex-1 bg-(--oa-white)" />
              <span className="whitespace-nowrap rounded-full bg-(--oa-white) px-3 py-1 text-[12px] tabular-nums text-(--oa-text-muted) shadow-[0_2px_8px_-2px_rgba(16,24,40,0.14)]">
                {i === 0 ? 'All assigned' : `${kept}% kept`}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Table, columns under the stage lines ───────────── */}
      <div className="text-[13px]">
        <div className="grid border-b border-(--oa-border) pb-2.5 text-[12px] text-(--oa-text-muted)" style={columns}>
          <span />
          {STAGES.map((s) => <span key={s} className="text-center">{s}</span>)}
        </div>
        {MODES.map((m) => (
          <div key={m.key} className="grid items-center border-b border-(--oa-border) py-3" style={columns}>
            <span className="flex items-center gap-2 text-(--oa-text-body)">
              <LegendMark color={m.color} />
              {m.label}
            </span>
            {data[m.key].map((v, i) => (
              <span
                key={i}
                className={cn(
                  'text-center tabular-nums',
                  weakest.mode === m.key && weakest.stage === i ? ATTENTION.text : 'text-(--oa-text-strong)',
                )}
                title={weakest.mode === m.key && weakest.stage === i ? `Biggest drop: ${Math.round((1 - weakest.rate) * 100)}% lost from ${STAGES[i - 1].toLowerCase()}` : undefined}
              >
                {v}
              </span>
            ))}
          </div>
        ))}
        <div className="grid items-center pt-3" style={columns}>
          <span className="text-(--oa-text-secondary)">Total</span>
          {totals.map((v, i) => <span key={i} className="text-center tabular-nums text-(--oa-text-secondary)">{v}</span>)}
        </div>
      </div>
    </div>
  );
}
