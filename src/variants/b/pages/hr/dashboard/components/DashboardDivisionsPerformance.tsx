import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { AIInsightLine } from '@/variants/b/components/ui/ai-insight-banner';
import type { DivisionPerformance } from '../types/dashboard.types';
import { CARD, CardHeader, DeltaChip, MetricTile, NumText } from '@/variants/b/components/ui/kit';
import { TRACK } from '@/variants/b/components/ui/chart';
import { AlertTriangle, BarChart2, Trophy, type LucideIcon } from '@/variants/b/icons';
import { OB_COLORS } from '@/variants/b/theme';
import { CountUp, GROW } from '@/variants/b/components/ui/count-up';

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

const GROUP_ICON: Record<Group, LucideIcon> = { average: BarChart2, top: Trophy, support: AlertTriangle };

// ── Animation ────────────────────────────────────────────────

/** Each bar starts a little after the one above it */
const STAGGER = 0.07;

/** Name column and value column widths; the bar, benchmark line and axis share what is left */
const NAME_COL = 150;
const VALUE_COL = 40;
/** Insets that line the benchmark line and the axis up with the bar column */
const BAR_INSET = { left: NAME_COL + 12, right: VALUE_COL + 12 };

/** Highlighted bars: the blue gradient (blue is the one accent) */
const BAR_GRADIENT = `linear-gradient(90deg, color-mix(in srgb, ${OB_COLORS.primary} 55%, white), ${OB_COLORS.primary})`;

function DivisionBar({ name, score, index, highlighted, start }: {
  name: string;
  score: number;
  index: number;
  highlighted: boolean;
  start: boolean;
}) {
  const delay = index * STAGGER;
  return (
    // Static class: Tailwind cannot see column widths built at runtime (NAME_COL, VALUE_COL)
    <div className="grid grid-cols-[150px_minmax(0,1fr)_40px] items-center gap-3">
      <span
        className={cn('truncate text-[12px] leading-[20px] transition-colors duration-300', highlighted ? 'text-(--ob-text-body)' : 'text-(--ob-text-subtle)')}
        title={name}
      >
        {name}
      </span>
      {/* 4px tall with 2px corners, like every bar in B */}
      <div className="h-1 w-full overflow-hidden rounded-[2px]" style={TRACK}>
        <motion.div
          className="relative h-full overflow-hidden rounded-[2px] bg-(--ob-border-control)"
          initial={{ width: 0 }}
          animate={{ width: start ? `${score}%` : 0 }}
          transition={{ ...GROW, delay }}
        >
          {/* The blue fades out to plain grey when this division is not highlighted */}
          <span
            className={cn('absolute inset-0 transition-opacity duration-300', highlighted ? 'opacity-100' : 'opacity-0')}
            style={{ backgroundImage: BAR_GRADIENT }}
          />
        </motion.div>
      </div>
      <span className="ob-num text-right text-[12px] leading-[20px] text-(--ob-text-body)">
        <CountUp value={score} start={start} delay={delay} />%
      </span>
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

  // `share` fills the tile's bar: the org rate, or the group's share of the divisions
  const tiles: { key: Group; label: string; value: string; note?: string; share: number }[] = [
    { key: 'average', label: 'Org average',   value: `${benchmark}%`, share: benchmark },
    { key: 'top',     label: 'Top divisions', value: `${top.length}`,     note: `${Math.min(...top.map((d) => d.score))}% and up`, share: (top.length / rows.length) * 100 },
    { key: 'support', label: 'Needs support', value: `${support.length}`, note: `${Math.max(...support.map((d) => d.score))}% and below`, share: (support.length / rows.length) * 100 },
  ];

  // Names the divisions on the chart: the leader and the two lowest
  const [lowest, second] = [...support].reverse();
  const shortInsight = `${rows[0].name} leads at ${rows[0].score}%. ${lowest.name} and ${second.name} trail the ${benchmark}% org average by ${benchmark - lowest.score} and ${benchmark - second.score} pts.`;
  const fullInsight =
    insight ??
    `${shortInsight} ${support.map((d) => d.name).join(', ')} are the three divisions below ${Math.max(...support.map((d) => d.score)) + 1}%; a review with each division lead could show where learners drop off.`;

  return (
    <div className={cn(CARD, 'relative flex flex-col gap-5 p-5', className)}>
      {/* ── Header ─────────────────────────────────────────── */}
      <CardHeader
        title="Division completion"
        subtitle={`Completion rate per division vs the org average (${benchmark}%)`}
      />

      {/* ── Summary tiles: also pick what the chart highlights ── */}
      <div className="grid grid-cols-3" role="tablist" aria-label="Chart highlight">
        {tiles.map((tile) => (
          <MetricTile key={tile.key} selected={tile.key === group} onClick={() => setGroup(tile.key)} label={tile.label} share={tile.share} icon={GROUP_ICON[tile.key]}>
            <span className="ob-num font-semibold text-[24px] leading-[32px] text-(--ob-text-strong)">{tile.value}</span>
            {tile.key === 'average' ? (
              benchmarkTrend !== undefined && benchmarkTrend !== 0 && (
                <DeltaChip positive={benchmarkTrend > 0}>{Math.abs(benchmarkTrend)} pts</DeltaChip>
              )
            ) : (
              <span className="text-[12px] text-(--ob-text-muted)"><NumText>{tile.note}</NumText></span>
            )}
          </MetricTile>
        ))}
      </div>

      {/* ── Chart: one bar per division, org average as a dashed line ── */}
      {/* Extra room above, so the tiles and the chart read as two blocks */}
      <div ref={chartRef} className="mt-6">
        <div className="relative pt-4">
          {/* Org average: dashed line over the bar column only */}
          <div className="pointer-events-none absolute top-0 bottom-0 z-[1]" style={BAR_INSET}>
            {/* A 1px line with the chart grid's 4 4 dash */}
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${benchmark}%`, backgroundImage: 'repeating-linear-gradient(to bottom, var(--ob-text-subtle) 0 4px, transparent 4px 8px)' }}
            >
              <span className="absolute -top-0.5 left-1.5 whitespace-nowrap text-[11px] leading-none text-(--ob-text-muted)">
                Org average <span className="ob-num">{benchmark}%</span>
              </span>
            </div>
          </div>
          <div className="space-y-2">
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

        {/* X axis under the bar column: each label sits at its own value */}
        <div className="relative mt-2 h-4" style={{ marginLeft: BAR_INSET.left, marginRight: BAR_INSET.right }}>
          {AXIS.map((v, i) => (
            <span
              key={v}
              className={cn(
                'ob-num absolute text-[11px] text-(--ob-text-subtle)',
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
