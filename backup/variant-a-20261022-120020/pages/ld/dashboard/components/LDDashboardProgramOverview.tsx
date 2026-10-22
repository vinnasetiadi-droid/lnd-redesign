import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { ChartDataPoint } from '../types/dashboard.types';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';
import { CardHeader, Trend } from '@/variants/a/components/ui/kit';
import { AIInsightLine } from '@/variants/a/components/ui/ai-insight-banner';
import { AXIS_TICK, FOLD_BAR_SHARE, foldBar, foldBarDefs, pillLabel, useChartIds } from '@/variants/a/components/ui/chart';
import { currentMonthIndex, periodLabel } from '../period';

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
  className?: string;
}

type Metric = 'participants' | 'launched' | 'completed';

/**
 * The summary tiles double as the metric picker: participants (hundreds) and
 * programs (tens) are on different scales, so the chart shows one at a time.
 * "New participants" keeps this apart from the total in the KPI row above.
 */
const METRICS: { key: Metric; label: string; unit: string }[] = [
  { key: 'participants', label: 'New participants',   unit: 'participants' },
  { key: 'launched',     label: 'Programs launched',  unit: 'launched' },
  { key: 'completed',    label: 'Programs completed', unit: 'completed' },
];

/** One-line insights; the full text from the mock shows on hover */
const SHORT_INSIGHT: Record<ProgramScope, string> = {
  all:     'Leadership Development hits 94% completion. Consider adding 20 seats to Digital Literacy.',
  course:  'Courses carry two-thirds of the year. Consider adding one compliance course in Q1.',
  journey: 'Journeys hold at one to two launches a month. Start the next cohort in October.',
};

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
  const BarShape = useMemo(() => foldBar(ids, (i) => i === selected), [ids, selected]);
  const PillLabel = useMemo(
    () => pillLabel(selected, series.length, (v) => `${v} ${metricInfo.unit}`, FOLD_BAR_SHARE),
    [selected, metricInfo.unit, series.length],
  );

  const totals = useMemo(
    () => METRICS.map((m) => ({ ...m, total: sum(data, m.key), trend: calcTrend(data, m.key) })),
    [data],
  );

  const range = periodLabel(data);
  const fullInsight = activeScope === 'course' ? courseInsight ?? insight : activeScope === 'journey' ? journeyInsight ?? insight : insight;

  return (
    <div className={cn('relative flex flex-col gap-5 bg-white rounded-[18px] p-5', className)}>
      {/* ── Header: title + period, scope tabs on the right ── */}
      <CardHeader
        title="Program overview"
        subtitle={range}
        extra={hasScopes ? <ProgramScopeTabs id="program-overview-scope" value={scope} onChange={setScope} /> : undefined}
      />

      {/* ── Summary tiles: also pick the chart's metric ─────── */}
      <div className="grid grid-cols-3 gap-3" role="tablist" aria-label="Chart metric">
        {totals.map((m) => {
          const isSelected = m.key === metric;
          const positive = m.trend >= 0;
          return (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setMetric(m.key)}
              className={cn(
                'rounded-[14px] border p-4 text-left transition-colors cursor-pointer',
                // Selected: the sidebar's active tint, no outline
                isSelected ? 'border-transparent bg-[#1A73E8]/[0.07]' : 'border-[#EDEEF1] hover:bg-[#F9FAFB]',
              )}
            >
              <p className="text-[13px] leading-[18px] text-[#535862]">{m.label}</p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[24px] leading-[32px] text-[#181D27]"><FadeValue k={m.total}>{m.total}</FadeValue></span>
                {m.trend !== 0 && (
                  <Trend positive={positive}>
                    <FadeValue k={m.trend}>{positive ? '+' : ''}{m.trend}%</FadeValue>
                  </Trend>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Chart: one metric, one highlighted month ────────── */}
      <div className="w-full min-w-0" style={{ height: '252px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={252}>
          <BarChart data={series} margin={{ top: 52, right: 8, left: -16, bottom: 0 }} barCategoryGap={0}>
            <defs>{foldBarDefs(ids)}</defs>
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
                  fill={props.index === selected ? '#181D27' : AXIS_TICK.fill}
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
      <AIInsightLine text={SHORT_INSIGHT[activeScope]} fullText={fullInsight} />
    </div>
  );
}
