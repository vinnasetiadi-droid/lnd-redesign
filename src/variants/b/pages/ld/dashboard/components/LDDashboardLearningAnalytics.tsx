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
import { CARD, CardHeader, DeltaChip, NumText } from '@/variants/b/components/ui/kit';
import { AIInsightLine } from '@/variants/b/components/ui/ai-insight-banner';
import { AXIS_TICK, ChartTooltipCard, GRID_PROPS, GradientProgress, LegendMark, NUM_TICK, areaGradient, useChartIds, ChartOnView } from '@/variants/b/components/ui/chart';
import { Area, AreaChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';
import { periodLabel } from '../period';
import { LAST_QUARTER, MONTHS, NOW, attendance as attendanceSeries, completion, hours as hoursOf } from '../data/core.mock';
import { OB_COLORS, OB_NUM_FONT } from '@/variants/b/theme';

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

// One blue: blended the deep blue, self-paced the pale one (as on Analytics).
// `line` draws the line (the pale tint is too light for a 2px line, so
// self-paced uses primary-300 and keeps the tint for its area and bar);
// `text` is the end label's colour.
const MODES = [
  { key: 'blended', label: 'Blended',    color: OB_COLORS.primary,  line: OB_COLORS.primary,    text: OB_COLORS.primary },
  { key: 'self',    label: 'Self-paced', color: OB_COLORS.modeSelf, line: OB_COLORS.primary300, text: OB_COLORS.textMuted },
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

/** `LabelList content`: a dot with a white ring on the last point, then the line's name (the value in Geist Mono) */
function endLabel(label: string, color: string, text: string, lastIndex: number) {
  return function EndLabel(props: { x?: number | string; y?: number | string; value?: number | string; index?: number }) {
    if (props.index !== lastIndex) return null;
    const x = Number(props.x);
    const y = Number(props.y);
    return (
      <g>
        <circle cx={x} cy={y} r={5} fill={color} stroke={OB_COLORS.white} strokeWidth={2} style={{ filter: `drop-shadow(0 2px 4px color-mix(in srgb, ${color} 45%, transparent))` }} />
        <text x={x + 10} y={y + 4} fill={text} fontSize={12} fontFamily="Inter, sans-serif">
          {label} <tspan fontFamily={OB_NUM_FONT}>{props.value}%</tspan>
        </text>
      </g>
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
    () => Object.fromEntries(MODES.map((m) => [m.key, endLabel(m.label, m.line, m.text, lastIndex)])),
    [lastIndex],
  );

  return (
    <div className={cn(CARD, 'relative flex flex-col gap-5 p-5', className)}>
      <CardHeader
        title="Learning mode analytics"
        subtitle={`Blended vs self-paced · ${periodLabel(data)}`}
        className="items-center"
        extra={<ProgramScopeTabs id="learning-analytics-scope" value={scope} onChange={setScope} />}
      />

      {/* ── Two stats, straight on the card ─────────────────── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {/* Attendance: blended sessions only */}
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-(--ob-text-muted)">
            Attendance rate <span className="text-(--ob-text-subtle)">· blended sessions</span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-semibold text-[24px] leading-[32px] text-(--ob-text-strong)">
              <FadeValue k={`${scope}-rate`} className="ob-num">{attendance.rate}</FadeValue>
              <span className="text-[13px] font-semibold text-(--ob-text-muted)">%</span>
            </span>
            {attendance.trend !== 0 && (
              <DeltaChip positive={attendance.trend > 0}>
                <FadeValue k={`${scope}-trend`}><NumText>{Math.abs(attendance.trend)} pts</NumText></FadeValue>
              </DeltaChip>
            )}
          </div>
          <GradientProgress value={attendance.rate} className="mt-1.5" />
          <p className="mt-1 text-[12px] leading-[16px] text-(--ob-text-muted)">
            <FadeValue k={`${scope}-att`}><NumText>{attendance.attending} of {attendance.enrolled} enrolled attending</NumText></FadeValue>
          </p>
        </div>

        {/* Hours: one bar split by mode */}
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-(--ob-text-muted)">Total learning hours</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold text-[24px] leading-[32px] text-(--ob-text-strong)">
              <FadeValue k={`${scope}-hours`} className="ob-num">{totalHours.toLocaleString('en-US')}</FadeValue>
              <span className="text-[13px] font-semibold text-(--ob-text-muted)">h</span>
            </span>
          </div>
          {/* 4px tall with 2px corners, like every progress bar in B */}
          <div className="mt-1.5 flex h-1 w-full gap-1">
            <div
              className="h-full rounded-[2px] transition-[width] duration-500 ease-out"
              style={{ width: `${blendedShare}%`, background: MODES[0].color }}
            />
            <div className="h-full flex-1 rounded-[2px]" style={{ background: MODES[1].color }} />
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 text-[12px] leading-[16px] text-(--ob-text-muted)">
            {MODES.map((m) => (
              <span key={m.key} className="flex items-center gap-1.5 whitespace-nowrap">
                <LegendMark color={m.color} />
                {m.label}
                <FadeValue k={`${scope}-${m.key}`} className="text-(--ob-text-body)"><NumText>{`${hours[m.key].toLocaleString('en-US')}h`}</NumText></FadeValue>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Completion over time ──────────────────────────────── */}
      {/* Spacing instead of a line: 20px gap + 4px = 24px */}
      <div className="mt-1">
        <h4 className="text-[14px] leading-[18px] text-(--ob-text-strong)">Completion over time</h4>
        <ChartOnView height={180} className="mt-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
            <AreaChart data={data} margin={{ top: 8, right: 100, bottom: 0, left: -16 }}>
              <defs>
                {MODES.map((m) => <Fragment key={m.key}>{areaGradient(`${ids.area}-${m.key}`, m.color, 0.22)}</Fragment>)}
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis
                tick={NUM_TICK}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: OB_COLORS.line, strokeDasharray: '4 4' }} />
              {MODES.map((m) => (
                <Area
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.line}
                  strokeWidth={2}
                  fill={`url(#${ids.area}-${m.key})`}
                  dot={false}
                  activeDot={{ r: 4, fill: m.line, stroke: OB_COLORS.white, strokeWidth: 2 }}
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
