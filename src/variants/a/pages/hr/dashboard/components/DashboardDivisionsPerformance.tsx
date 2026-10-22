import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Building2 } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { AIInsightLine } from '@/variants/a/components/ui/ai-insight-banner';
import type { DivisionPerformance } from '../types/dashboard.types';
import { CardHeader, Trend } from '@/variants/a/components/ui/kit';
import { CHART_BLUE, HATCHED_TRACK } from '@/variants/a/components/ui/chart';
import { OA_COLORS } from '@/variants/a/theme';
import { CountUp, GROW } from '@/variants/a/components/ui/count-up';

interface DashboardDivisionsPerformanceProps {
  /** Completion rate per division; the card sorts them itself */
  divisions: DivisionPerformance[];
  /** Org completion rate this month (the Completion rate KPI), drawn as the benchmark */
  benchmark: number;
  /** Points the org rate moved since last quarter (same as the KPI trend) */
  benchmarkTrend?: number;
  /** @deprecated The lowest divisions now come from `divisions` */
  latestSupport?: string;
  insight?: string;
  className?: string;
}

/** How many divisions the Top and Needs support tiles pick out */
const GROUP_SIZE = 3;
const AXIS = [0, 25, 50, 75, 100];

/**
 * The tiles double as the chart's highlight, like the metric tiles in Program
 * overview: Org average shows every division, Top and Needs support light up
 * their three divisions and grey out the rest.
 */
type Group = 'average' | 'top' | 'support';

// ── Animation ────────────────────────────────────────────────

/** Each bar starts a little after the one above it */
const STAGGER = 0.07;

function DivisionBar({ name, score, index, highlighted, start }: {
  name: string;
  score: number;
  index: number;
  highlighted: boolean;
  start: boolean;
}) {
  const delay = index * STAGGER;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className={cn('whitespace-nowrap text-[12px] transition-colors duration-300', highlighted ? 'text-(--oa-text-body)' : 'text-(--oa-text-subtle)')}>
          {name}
        </span>
        <span className="text-[12px] tabular-nums text-(--oa-text-subtle)">
          <CountUp value={score} start={start} delay={delay} />%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={HATCHED_TRACK}>
        <motion.div
          className="relative h-full overflow-hidden rounded-full bg-(--oa-border-strong)"
          initial={{ width: 0 }}
          animate={{ width: start ? `${score}%` : 0 }}
          transition={{ ...GROW, delay }}
        >
          {/* Blue fill fades out to plain grey when this division is not highlighted */}
          <span
            className={cn('absolute inset-0 transition-opacity duration-300', highlighted ? 'opacity-100' : 'opacity-0')}
            style={{ backgroundImage: `linear-gradient(90deg, ${CHART_BLUE}, ${OA_COLORS.primary200})` }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────

export function DashboardDivisionsPerformance({ divisions, benchmark, benchmarkTrend, insight, className }: DashboardDivisionsPerformanceProps) {
  const [group, setGroup] = useState<Group>('average');
  // Bars grow in the first time the chart scrolls into view.
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartRef, { once: true, amount: 0.3 });

  // Best division first; scores rounded the way the chart shows them
  const rows = useMemo(
    () => [...divisions].sort((a, b) => b.percentage - a.percentage).map((d) => ({ name: d.name, score: Math.round(d.percentage) })),
    [divisions],
  );
  const top = rows.slice(0, GROUP_SIZE);
  const support = rows.slice(-GROUP_SIZE);
  const isHighlighted = (index: number) =>
    group === 'top' ? index < GROUP_SIZE : group === 'support' ? index >= rows.length - GROUP_SIZE : true;

  const tiles: { key: Group; label: string; value: string; note?: string }[] = [
    { key: 'average', label: 'Org average',   value: `${benchmark}%` },
    { key: 'top',     label: 'Top divisions', value: `${top.length}`,     note: `${Math.min(...top.map((d) => d.score))}% and up` },
    { key: 'support', label: 'Needs support', value: `${support.length}`, note: `${Math.max(...support.map((d) => d.score))}% and below` },
  ];

  // Names the divisions on the chart: the leader and the two lowest
  const [lowest, second] = [...support].reverse();
  const shortInsight = `${rows[0].name} leads at ${rows[0].score}%. ${lowest.name} and ${second.name} trail the ${benchmark}% org average by ${benchmark - lowest.score} and ${benchmark - second.score} pts.`;
  const fullInsight =
    insight ??
    `${shortInsight} ${support.map((d) => d.name).join(', ')} are the three divisions below ${Math.max(...support.map((d) => d.score)) + 1}%; a review with each division lead could show where learners drop off.`;

  return (
    <div className={cn('relative flex flex-col gap-5 bg-white rounded-[18px] p-5', className)}>
      {/* ── Header ─────────────────────────────────────────── */}
      <CardHeader
        title="Division completion"
        subtitle={`Completion rate per division vs the org average (${benchmark}%)`}
        icon={Building2}
      />

      {/* ── Summary tiles: also pick what the chart highlights ── */}
      <div className="grid grid-cols-3 gap-3" role="tablist" aria-label="Chart highlight">
        {tiles.map((tile) => {
          const isSelected = tile.key === group;
          return (
            <button
              key={tile.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setGroup(tile.key)}
              className={cn(
                'rounded-[14px] border p-4 text-left transition-colors cursor-pointer',
                isSelected ? 'border-transparent bg-(--oa-primary)/[0.07]' : 'border-(--oa-border) hover:bg-(--oa-surface-subtle)',
              )}
            >
              <p className="text-[13px] leading-[18px] text-(--oa-text-secondary)">{tile.label}</p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[24px] leading-[32px] text-(--oa-text-strong)">{tile.value}</span>
                {tile.key === 'average' ? (
                  benchmarkTrend !== undefined && benchmarkTrend !== 0 && (
                    <Trend positive={benchmarkTrend > 0}>{benchmarkTrend > 0 ? '+' : ''}{benchmarkTrend} pts</Trend>
                  )
                ) : (
                  <span className="text-[12px] text-(--oa-text-muted)">{tile.note}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Chart: one bar per division, org average as a dashed line ── */}
      <div ref={chartRef}>
        <div className="relative pt-5">
          <div
            className="pointer-events-none absolute top-0 bottom-0 z-[1] border-l border-dashed border-(--oa-text-subtle)"
            style={{ left: `${benchmark}%` }}
          >
            <span className="absolute -top-0.5 left-1.5 whitespace-nowrap text-[11px] leading-none text-(--oa-text-muted)">
              Org average {benchmark}%
            </span>
          </div>
          <div className="space-y-3.5">
            {rows.map((d, i) => (
              <DivisionBar
                key={d.name}
                name={d.name}
                score={d.score}
                index={i}
                highlighted={isHighlighted(i)}
                start={inView}
              />
            ))}
          </div>
        </div>

        {/* X axis: each label sits at its own value */}
        <div className="relative mt-3 h-4">
          {AXIS.map((v, i) => (
            <span
              key={v}
              className={cn(
                'absolute text-[11px] text-(--oa-text-subtle)',
                i === 0 ? 'left-0' : i === AXIS.length - 1 ? 'right-0' : '-translate-x-1/2',
              )}
              style={i === 0 || i === AXIS.length - 1 ? undefined : { left: `${v}%` }}
            >
              {v}%
            </span>
          ))}
        </div>
      </div>

      {/* ── AI insight: one line ─────────────────────────────── */}
      <AIInsightLine text={shortInsight} fullText={fullInsight} />
    </div>
  );
}
