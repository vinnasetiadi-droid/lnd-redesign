import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';
import { CardHeader, Trend } from '@/variants/c/components/ui/kit';
import { AIInsightLine } from '@/variants/c/components/ui/ai-insight-banner';
import { currentMonthIndex, periodLabel } from '../period';
import { MONTHS, enrolled } from '../data/core.mock';
import { AXIS_TICK, CHART_BLUE, ChartTooltipCard, GRID_PROPS, areaGradient, useChartIds, ChartOnView } from '@/variants/c/components/ui/chart';
import { OC_COLORS } from '@/variants/c/theme';

// Enrolled trainees per month, from the shared core figures (the same series
// behind the Learning participants KPI).
const COURSE = enrolled('course');

const TRAINEES_GROWTH_DATA: Record<ProgramScope, { month: string; value: number }[]> = {
  all:     MONTHS.map((month, i) => ({ month, value: enrolled('all')[i] })),
  course:  MONTHS.map((month, i) => ({ month, value: COURSE[i] })),
  journey: MONTHS.map((month, i) => ({ month, value: enrolled('journey')[i] })),
};

/** Round-number Y axis around a series, so each tab fills the chart. */
function niceAxis(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const raw = (max - min) / 3 || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 4, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const lo = Math.max(0, Math.floor((min - step / 4) / step) * step);
  const hi = Math.ceil((max + step / 4) / step) * step;
  const ticks: number[] = [];
  for (let t = lo; t <= hi + 1e-9; t += step) ticks.push(Math.round(t));
  return { domain: [lo, hi] as [number, number], ticks };
}

interface LDDashboardTraineesGrowthProps {
  className?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipCard title={label} rows={[{ label: 'Trainees', value: payload[0].value, color: CHART_BLUE }]} />
  );
}

export function LDDashboardTraineesGrowth({ className }: LDDashboardTraineesGrowthProps) {
  const [scope, setScope] = useState<ProgramScope>('all');
  // Same months as Program overview: January up to the current month.
  const data = useMemo(() => TRAINEES_GROWTH_DATA[scope].slice(0, currentMonthIndex() + 1), [scope]);
  const axis = useMemo(() => niceAxis(data.map((d) => d.value)), [data]);
  const first = data[0].value;
  const last = data[data.length - 1].value;
  const growthPercent = Math.round(((last - first) / first) * 100);
  const growthAbs = last - first;
  const chartIds = useChartIds('trainees-growth');

  // How much of the growth came from courses vs journeys (All Program only)
  const courseShare = useMemo(() => {
    const n = data.length - 1;
    const total = TRAINEES_GROWTH_DATA.all[n].value - TRAINEES_GROWTH_DATA.all[0].value;
    return Math.round(((COURSE[n] - COURSE[0]) / total) * 100);
  }, [data.length]);
  const insight =
    scope === 'all'
      ? `Enrollment grew ${growthPercent}% since ${data[0].month}. Courses brought ${courseShare}% of the new trainees.`
      : `${scope === 'course' ? 'Courses' : 'Journeys'} added ${growthAbs} trainees since ${data[0].month}, up ${growthPercent}%.`;

  const STATS: { key: string; label: string; value: string; trend?: string }[] = [
    { key: 'current', label: 'Enrolled now',               value: `${last}`, trend: `+${growthPercent}%` },
    { key: 'growth',  label: `New since ${data[0].month}`, value: `+${growthAbs}` },
    { key: 'monthly', label: 'Average per month',          value: `+${Math.round(growthAbs / Math.max(1, data.length - 1))}` },
  ];

  return (
    <div className={cn('relative flex flex-col gap-5 rounded-(--oc-radius-card) bg-(--oc-white) ring-1 ring-(--oc-border) p-5', className)}>
      {/* Header: title + period, scope tabs on the right */}
      <CardHeader
        title="Trainees growth trend"
        subtitle={`Total enrolled trainees · ${periodLabel(data)}`}
        extra={<ProgramScopeTabs id="trainees-growth-scope" value={scope} onChange={setScope} />}
      />

      {/* Summary tiles, same as Program overview */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map((stat) => (
          <div key={stat.key} className="rounded-(--oc-radius-card) border border-(--oc-border) p-4">
            <p className="text-[13px] leading-[18px] text-(--oc-text-secondary)">{stat.label}</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-[24px] leading-[32px] text-(--oc-text-strong)"><FadeValue k={`${scope}-${stat.value}`}>{stat.value}</FadeValue></span>
              {stat.trend && <Trend><FadeValue k={`${scope}-trend`}>{stat.trend}</FadeValue></Trend>}
            </div>
          </div>
        ))}
      </div>

      {/* Chart — stays mounted so the line morphs to the new tab's data */}
      <ChartOnView height={220}>
        <ResponsiveContainer width="100%" height={220} minWidth={0}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>{areaGradient(chartIds.area)}</defs>
            <CartesianGrid key="grid" {...GRID_PROPS} />
            <XAxis
              key="xaxis"
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
            />
            <YAxis
              key="yaxis"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              domain={axis.domain}
              ticks={axis.ticks}
            />
            <Tooltip key="tooltip" content={<CustomTooltip />} cursor={{ stroke: OC_COLORS.borderControl, strokeDasharray: '4 4' }} />
            <Area
              key="trainees-growth-line"
              type="monotone"
              dataKey="value"
              stroke={CHART_BLUE}
              strokeWidth={2}
              fill={`url(#${chartIds.area})`}
              dot={false}
              activeDot={{ r: 4, fill: CHART_BLUE, stroke: '#fff', strokeWidth: 2 }}
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartOnView>

      {/* AI insight: one line */}
      <AIInsightLine text={insight} />
    </div>
  );
}