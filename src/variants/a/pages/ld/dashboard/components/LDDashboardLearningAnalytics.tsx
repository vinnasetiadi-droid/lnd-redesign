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
import { periodLabel } from '../period';
import { LAST_QUARTER, MONTHS, NOW, attendance as attendanceSeries, completion, hours as hoursOf } from '../data/core.mock';
import { OA_COLORS } from '@/variants/a/theme';

// ── Data: everything comes from the shared core figures ──────

interface MonthlyCompletion {
  month: string;
  blended: number;
  self: number;
}

function completionSeries(scope: ProgramScope): MonthlyCompletion[] {
  const blended = completion(scope, 'blended');
  const self = completion(scope, 'self');
  return MONTHS.map((month, i) => ({ month, blended: Math.round(blended[i]), self: Math.round(self[i]) }));
}

// ── Config ───────────────────────────────────────────────────

const MODES = [
  { key: 'blended', label: 'Blended',    color: OA_COLORS.primary },
  { key: 'self',    label: 'Self-paced', color: OA_COLORS.modeSelf },
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
  // Blended live sessions only: self-paced has no attendance
  const attendanceByMonth = attendanceSeries(scope);
  const attendance = { ...attendanceByMonth[NOW], trend: attendanceByMonth[NOW].rate - attendanceByMonth[LAST_QUARTER].rate };
  const hours = hoursOf(scope);
  const totalHours = hours.blended + hours.self;
  const blendedShare = Math.round((hours.blended / totalHours) * 100);

  // Same months as Program overview: January up to the current month.
  const data = useMemo(() => completionSeries(scope).slice(0, NOW + 1), [scope]);
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {/* Attendance: blended sessions only */}
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-(--oa-text-secondary)">
            Attendance rate <span className="text-(--oa-text-subtle)">· blended sessions</span>
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[24px] leading-[32px] text-(--oa-text-strong)">
              <FadeValue k={`${scope}-rate`}>{attendance.rate}</FadeValue>
              <span className="text-[13px] text-(--oa-text-muted)">%</span>
            </span>
            {attendance.trend !== 0 && (
              <Trend positive={attendance.trend > 0}>
                <FadeValue k={`${scope}-trend`}>{attendance.trend > 0 ? '+' : ''}{attendance.trend} pts</FadeValue>
              </Trend>
            )}
          </div>
          <GradientProgress value={attendance.rate} className="mt-3 h-2" />
          <p className="mt-2 text-[12px] text-(--oa-text-muted)">
            <FadeValue k={`${scope}-att`}>{attendance.attending} of {attendance.enrolled} enrolled attending</FadeValue>
          </p>
        </div>

        {/* Hours: one bar split by mode */}
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-(--oa-text-secondary)">Total learning hours</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[24px] leading-[32px] text-(--oa-text-strong)">
              <FadeValue k={`${scope}-hours`}>{totalHours.toLocaleString('en-US')}</FadeValue>
              <span className="text-[13px] text-(--oa-text-muted)">h</span>
            </span>
          </div>
          <div className="mt-3 flex h-2 w-full gap-1">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${blendedShare}%`, background: MODES[0].color }}
            />
            <div className="h-full flex-1 rounded-full" style={{ background: MODES[1].color }} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-(--oa-text-muted)">
            {MODES.map((m) => (
              <span key={m.key} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="size-2 shrink-0 rounded-full" style={{ background: m.color }} />
                {m.label}
                <FadeValue k={`${scope}-${m.key}`} className="text-(--oa-text-body)">{hours[m.key].toLocaleString('en-US')}h</FadeValue>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Completion over time ──────────────────────────────── */}
      <div className="border-t border-(--oa-border) pt-5">
        <h4 className="text-[14px] leading-[20px] text-(--oa-text-strong)">Completion over time</h4>
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
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: OA_COLORS.line, strokeDasharray: '4 4' }} />
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
