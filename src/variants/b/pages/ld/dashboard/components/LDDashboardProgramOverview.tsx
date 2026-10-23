import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { ChartDataPoint } from '../types/dashboard.types';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';
import { CARD, CardHeader, DeltaChip, MetricTile } from '@/variants/b/components/ui/kit';
import { AIInsightLine } from '@/variants/b/components/ui/ai-insight-banner';
import { AXIS_TICK, FOLD_BAR_SHARE, foldBar, foldBarDefs, pillLabel, useChartIds } from '@/variants/b/components/ui/chart';
import { currentMonthIndex, periodLabel } from '../period';
import { OB_COLORS } from '@/variants/b/theme';
import { CheckCircle2, Rocket, Users, type LucideIcon } from '@/variants/b/icons';

interface LDDashboardProgramOverviewProps {
  /** All Program — the course and journey series added together. */
  chartData: ChartDataPoint[];
  insight: string;
  /** Course-only series; omitting it hides the tabs. */
  courseData?: ChartDataPoint[];
  courseInsight?: string;
  /** Journey-only series; omitting it hides the tabs. */
  journeyData?: ChartDataPoint[];
  journeyInsight?: string;
  /** One-line insight per tab, for the row under the chart (full text on hover) */
  shortInsights: Record<ProgramScope, string>;
  className?: string;
}

type Metric = 'participants' | 'launched' | 'completed';

/**
 * The summary tiles double as the metric picker: participants (hundreds) and
 * programs (tens) are on different scales, so the chart shows one at a time.
 * "New participants" keeps this apart from the total in the KPI row above.
 */
const METRICS: { key: Metric; label: string; unit: string; color: string; icon: LucideIcon }[] = [
  { key: 'participants', label: 'New participants',   unit: 'participants', color: OB_COLORS.primary,  icon: Users },
  { key: 'launched',     label: 'Programs launched',  unit: 'launched',     color: OB_COLORS.modeSelf, icon: Rocket },
  { key: 'completed',    label: 'Programs completed', unit: 'completed',    color: OB_COLORS.orange,   icon: CheckCircle2 },
];

/* ── helpers ─────────────────────────────────────────────────── */

function sum(data: ChartDataPoint[], key: Metric) {
  return data.reduce((acc, d) => acc + d[key], 0);
}

/** Round a series maximum up to a readable axis top, leaving headroom. */
function axisMax(values: number[], step: number) {
  const peak = Math.max(...values, 0);
  return Math.max(step, Math.ceil((peak * 1.15) / step) * step);
}

/** This month against the one before, in percent */
function calcTrend(data: ChartDataPoint[], key: Metric) {
  if (data.length < 2) return 0;
  const prev = data[data.length - 2][key];
  const curr = data[data.length - 1][key];
  if (prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 100);
}

/* ── main component ──────────────────────────────────────────── */

export function LDDashboardProgramOverview({
  chartData,
  insight,
  courseData,
  courseInsight,
  journeyData,
  journeyInsight,
  shortInsights,
  className,
}: LDDashboardProgramOverviewProps) {
  const [scope, setScope] = useState<ProgramScope>('all');
  // Without a per-type breakdown there is nothing to switch between.
  const hasScopes = !!courseData && !!journeyData;
  const activeScope: ProgramScope = hasScopes ? scope : 'all';

  const fullYear = activeScope === 'course' ? courseData! : activeScope === 'journey' ? journeyData! : chartData;
  // Up to the current month only: later months have not happened yet.
  const data = useMemo(() => fullYear.slice(0, currentMonthIndex() + 1), [fullYear]);

  const [metric, setMetric] = useState<Metric>('participants');
  const metricInfo = METRICS.find((m) => m.key === metric)!;
  // Same `value` key for every metric, so switching animates the bars to their new heights.
  const series = useMemo(() => data.map((d) => ({ month: d.month, value: d[metric] })), [data, metric]);
  const yMax = useMemo(() => axisMax(series.map((d) => d.value), metric === 'participants' ? 10 : 2), [series, metric]);

  // The current month is highlighted until another bar is clicked.
  const [picked, setPicked] = useState<number | null>(null);
  const selected = picked ?? series.length - 1;

  const ids = useChartIds('program-overview');
  const BarShape = useMemo(() => foldBar(ids, (i) => i === selected, metricInfo.color), [ids, selected, metricInfo.color]);
  const PillLabel = useMemo(
    () => pillLabel(selected, series.length, (v) => `${v} ${metricInfo.unit}`, FOLD_BAR_SHARE),
    [selected, metricInfo.unit, series.length],
  );

  const totals = useMemo(
    () => METRICS.map((m) => ({ ...m, total: sum(data, m.key), trend: calcTrend(data, m.key) })),
    [data],
  );

  const range = periodLabel(data);
  const prevMonth = data[data.length - 2]?.month ?? '';
  const fullInsight = activeScope === 'course' ? courseInsight ?? insight : activeScope === 'journey' ? journeyInsight ?? insight : insight;

  return (
    <div className={cn(CARD, 'relative flex flex-col gap-5 p-5', className)}>
      {/* ── Header: title + period, scope tabs on the right ── */}
      <CardHeader
        title="Program overview"
        subtitle={range}
        extra={hasScopes ? <ProgramScopeTabs id="program-overview-scope" value={scope} onChange={setScope} /> : undefined}
      />

      {/* ── Summary tiles: also pick the chart's metric ─────── */}
      <div className="grid grid-cols-3" role="tablist" aria-label="Chart metric">
        {totals.map((m) => {
          const positive = m.trend >= 0;
          return (
            <MetricTile key={m.key} selected={m.key === metric} onClick={() => setMetric(m.key)} label={m.label} color={m.color} icon={m.icon}>
              <span className="font-semibold text-[24px] leading-[32px] tabular-nums text-(--ob-text-strong)"><FadeValue k={m.total}>{m.total}</FadeValue></span>
              {m.trend !== 0 && (
                // Totals are year to date; the change compares the last two months
                <span className="flex items-center gap-1.5">
                  <DeltaChip positive={positive}><FadeValue k={m.trend}>{Math.abs(m.trend)}%</FadeValue></DeltaChip>
                  <span className="text-[12px] text-(--ob-text-muted)">vs {prevMonth}</span>
                </span>
              )}
            </MetricTile>
          );
        })}
      </div>

      {/* ── Chart: one metric, one highlighted month ────────── */}
      {/* Extra room above, so the tiles and the chart read as two blocks */}
      <div className="mt-6 w-full min-w-0" style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          <BarChart data={series} margin={{ top: 28, right: 8, left: -16, bottom: 0 }} barCategoryGap={0}>
            <defs>{foldBarDefs(ids, metricInfo.color)}</defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={(props: { x: number; y: number; payload: { value: string }; index: number }) => (
                <text
                  x={props.x}
                  y={props.y}
                  dy={14}
                  textAnchor="middle"
                  fontSize={AXIS_TICK.fontSize}
                  fill={props.index === selected ? metricInfo.color : AXIS_TICK.fill}
                >
                  {props.payload.value}
                </text>
              )}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              domain={[0, yMax]}
              ticks={[0, Math.round(yMax / 2), yMax]}
              allowDecimals={false}
            />
            <Bar
              dataKey="value"
              name={metricInfo.label}
              shape={BarShape}
              onClick={(_: unknown, index: number) => setPicked(index)}
              animationDuration={500}
              animationEasing="ease-in-out"
            >
              <LabelList dataKey="value" content={PillLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── AI insight: one line ─────────────────────────────── */}
      <AIInsightLine text={shortInsights[activeScope]} fullText={fullInsight} />
    </div>
  );
}
