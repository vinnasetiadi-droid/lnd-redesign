// ============================================================
// Learning mode analytics — blended vs self-paced
//   - Attendance rate: live sessions only, so blended programs only
//   - Total learning hours: split by mode in one stacked bar
//   - Completion over time: one line per mode
// The tabs pick the program type, so the chart never repeats it.
// Same period as Program overview (see ../period).
// ============================================================

import { Fragment, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { CardHeader, Trend } from '@/variants/a/components/ui/kit';
import { AIInsightLine } from '@/variants/a/components/ui/ai-insight-banner';
import { AXIS_TICK, ChartTooltipCard, GRID_PROPS, GradientProgress, areaGradient, useChartIds, ChartOnView } from '@/variants/a/components/ui/chart';
import { Area, AreaChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';
import { currentMonthIndex, periodLabel } from '../period';

// ── Mock data ────────────────────────────────────────────────

interface ScopeStats {
  /** Blended programs only: self-paced has no live sessions to attend */
  attendance: { enrolled: number; attending: number; rate: number; trend: number };
  hours: { blended: number; self: number };
}

const STATS: Record<ProgramScope, ScopeStats> = {
  all:     { attendance: { enrolled: 172, attending: 152, rate: 88, trend: 3 },  hours: { blended: 2670, self: 2150 } },
  course:  { attendance: { enrolled: 110, attending: 99,  rate: 90, trend: 2 },  hours: { blended: 1640, self: 1380 } },
  journey: { attendance: { enrolled: 62,  attending: 53,  rate: 85, trend: -1 }, hours: { blended: 1030, self: 770 } },
};

interface MonthlyCompletion {
  month: string;
  blended: number;
  self: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Completion % per month, January to December 2026 */
const COMPLETION: Record<ProgramScope, { blended: number[]; self: number[] }> = {
  all: {
    blended: [53, 54, 55, 57, 57, 60, 63, 66, 70, 74, 76, 78],
    self:    [39, 41, 41, 44, 45, 47, 50, 52, 55, 58, 60, 61],
  },
  course: {
    blended: [58, 59, 61, 62, 63, 66, 69, 71, 75, 79, 81, 82],
    self:    [44, 46, 47, 49, 50, 52, 55, 57, 60, 63, 65, 66],
  },
  journey: {
    blended: [44, 45, 46, 49, 48, 51, 54, 58, 62, 66, 68, 70],
    self:    [31, 33, 33, 37, 39, 42, 46, 50, 54, 57, 59, 60],
  },
};

function completionSeries(scope: ProgramScope): MonthlyCompletion[] {
  const { blended, self } = COMPLETION[scope];
  return MONTHS.map((month, i) => ({ month, blended: blended[i], self: self[i] }));
}

// ── Config ───────────────────────────────────────────────────

const MODES = [
  { key: 'blended', label: 'Blended',    color: '#1A73E8' },
  { key: 'self',    label: 'Self-paced', color: '#34A853' },
] as const;

/** One line comparing the two modes at the end of the period */
function completionInsight(data: MonthlyCompletion[]): string {
  const first = data[0];
  const last = data[data.length - 1];
  const gap = last.blended - last.self;
  const change = gap - (first.blended - first.self);
  const [ahead, behind] = gap >= 0 ? ['Blended', 'self-paced'] : ['Self-paced', 'blended'];
  const trend = Math.abs(change) <= 3 ? 'The gap is stable, not closing.' : change < 0 ? 'The gap is closing.' : 'The gap is widening.';
  return `${ahead} completes ${Math.abs(gap)} pts higher than ${behind}. ${trend}`;
}

/** `LabelList content`: names the line at its last point, in its own colour */
function endLabel(label: string, color: string, lastIndex: number) {
  return function EndLabel(props: { x?: number | string; y?: number | string; value?: number | string; index?: number }) {
    if (props.index !== lastIndex) return null;
    return (
      <text x={Number(props.x) + 8} y={Number(props.y) + 4} fill={color} fontSize={12} fontFamily="DM Sans, sans-serif">
        {label} {props.value}%
      </text>
    );
  };
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipCard
      title={label}
      rows={payload.map((entry) => ({ label: entry.name, value: `${entry.value}%`, color: entry.color, line: true }))}
    />
  );
}

// ── Main component ───────────────────────────────────────────

export function LDDashboardLearningAnalytics({ className }: { className?: string }) {
  const [scope, setScope] = useState<ProgramScope>('all');
  const { attendance, hours } = STATS[scope];
  const totalHours = hours.blended + hours.self;
  const blendedShare = Math.round((hours.blended / totalHours) * 100);

  // Same months as Program overview: January up to the current month.
  const data = useMemo(() => completionSeries(scope).slice(0, currentMonthIndex() + 1), [scope]);
  const lastIndex = data.length - 1;
  const ids = useChartIds('learning-mode');
  const labels = useMemo(
    () => Object.fromEntries(MODES.map((m) => [m.key, endLabel(m.label, m.color, lastIndex)])),
    [lastIndex],
  );

  return (
    <div className={cn('relative flex flex-col gap-5 bg-white rounded-[18px] p-5', className)}>
      <CardHeader
        title="Learning mode analytics"
        subtitle={`Blended vs self-paced · ${periodLabel(data)}`}
        extra={<ProgramScopeTabs id="learning-analytics-scope" value={scope} onChange={setScope} />}
      />

      {/* ── Two stats, straight on the card ─────────────────── */}
      <div className="grid grid-cols-2 gap-8">
        {/* Attendance: blended sessions only */}
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-[#535862]">
            Attendance rate <span className="text-[#A4A7AE]">· blended sessions</span>
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[24px] leading-[32px] text-[#181D27]">
              <FadeValue k={`${scope}-rate`}>{attendance.rate}</FadeValue>
              <span className="text-[13px] text-[#717680]">%</span>
            </span>
            {attendance.trend !== 0 && (
              <Trend positive={attendance.trend > 0}>
                <FadeValue k={`${scope}-trend`}>{attendance.trend > 0 ? '+' : ''}{attendance.trend}%</FadeValue>
              </Trend>
            )}
          </div>
          <GradientProgress value={attendance.rate} className="mt-3 h-2" />
          <p className="mt-2 text-[12px] text-[#717680]">
            <FadeValue k={`${scope}-att`}>{attendance.attending} of {attendance.enrolled} enrolled attending</FadeValue>
          </p>
        </div>

        {/* Hours: one bar split by mode */}
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-[#535862]">Total learning hours</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[24px] leading-[32px] text-[#181D27]">
              <FadeValue k={`${scope}-hours`}>{totalHours.toLocaleString('en-US')}</FadeValue>
              <span className="text-[13px] text-[#717680]">h</span>
            </span>
          </div>
          <div className="mt-3 flex h-2 w-full gap-1">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${blendedShare}%`, background: MODES[0].color }}
            />
            <div className="h-full flex-1 rounded-full" style={{ background: MODES[1].color }} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-[#717680]">
            {MODES.map((m) => (
              <span key={m.key} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="size-2 shrink-0 rounded-full" style={{ background: m.color }} />
                {m.label}
                <FadeValue k={`${scope}-${m.key}`} className="text-[#414651]">{hours[m.key].toLocaleString('en-US')}h</FadeValue>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Completion over time ──────────────────────────────── */}
      <div className="border-t border-[#EDEEF1] pt-5">
        <h4 className="text-[14px] leading-[20px] text-[#181D27]">Completion over time</h4>
        <ChartOnView height={220} className="mt-3">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <AreaChart data={data} margin={{ top: 8, right: 100, bottom: 0, left: -16 }}>
              <defs>
                {MODES.map((m) => <Fragment key={m.key}>{areaGradient(`${ids.area}-${m.key}`, m.color, 0.14)}</Fragment>)}
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#D5D7DA', strokeDasharray: '4 4' }} />
              {MODES.map((m) => (
                <Area
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  fill={`url(#${ids.area}-${m.key})`}
                  dot={false}
                  activeDot={{ r: 4, fill: m.color, stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={600}
                  animationEasing="ease-out"
                >
                  <LabelList dataKey={m.key} content={labels[m.key]} />
                </Area>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartOnView>
      </div>

      {/* ── AI insight: one line ─────────────────────────────── */}
      <AIInsightLine text={completionInsight(data)} />
    </div>
  );
}
