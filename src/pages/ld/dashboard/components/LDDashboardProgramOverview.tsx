import { useMemo, useState } from 'react';
import { BookMarked, Rocket, CheckCircle2, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import type { ChartDataPoint } from '../types/dashboard.types';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';

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

/* ── helpers ─────────────────────────────────────────────────── */

function sum(data: ChartDataPoint[], key: 'launched' | 'completed' | 'participants') {
  return data.reduce((acc, d) => acc + d[key], 0);
}

/** Round a series maximum up to a readable axis top, leaving headroom. */
function axisMax(values: number[], step: number) {
  const peak = Math.max(...values, 0);
  return Math.max(step, Math.ceil((peak * 1.15) / step) * step);
}

function calcTrend(data: ChartDataPoint[], key: 'launched' | 'completed' | 'participants') {
  if (data.length < 2) return 0;
  const prev = data[data.length - 2][key];
  const curr = data[data.length - 1][key];
  if (prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 100);
}

/* ── custom tooltip ──────────────────────────────────────────── */

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-[8px] border border-[#E9EAEB] shadow-[0_12px_16px_rgba(16,24,40,0.08),0_4px_6px_rgba(16,24,40,0.03)] px-4 py-3 min-w-[180px]">
      <p className="text-[12px] font-semibold text-[#181D27] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-[12px] text-[#717680]">{entry.name}</span>
          </div>
          <span className="text-[12px] font-semibold text-[#181D27]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── custom legend ───────────────────────────────────────────── */

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string; type: string }> }) {
  if (!payload) return null;
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          {entry.type === 'rect' ? (
            <span className="w-3 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
          ) : (
            <span className="w-3 h-[3px] rounded-full" style={{ backgroundColor: entry.color }} />
          )}
          <span className="text-[12px] text-[#717680]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── KPI config ──────────────────────────────────────────────── */

const KPI_CONFIG = [
  { key: 'launched'     as const, label: 'Programs Launched',  color: '#1570EF', bg: 'from-[#D1E9FF] to-[#EFF8FF]/40', icon: Rocket,       iconColor: 'text-[#1570EF]' },
  { key: 'completed'    as const, label: 'Programs Completed', color: '#2DD4BF', bg: 'from-[#CCFBF1] to-[#CCFBF1]/40', icon: CheckCircle2, iconColor: 'text-[#14B8A6]' },
  { key: 'participants' as const, label: 'Participants Joined', color: '#53B1FD', bg: 'from-[#EFF8FF] to-[#EFF8FF]/40', icon: Users,        iconColor: 'text-[#53B1FD]' },
] as const;

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

  const data = !hasScopes || scope === 'all' ? chartData : scope === 'course' ? courseData! : journeyData!;

  // Journeys launch far less often than courses, so each tab gets an axis
  // scaled to its own numbers instead of one fixed range.
  const leftMax = useMemo(() => axisMax(data.flatMap((d) => [d.launched, d.completed]), 2), [data]);
  const rightMax = useMemo(() => axisMax(data.map((d) => d.participants), 10), [data]);

  const kpis = useMemo(() =>
    KPI_CONFIG.map((cfg) => ({
      ...cfg,
      total: sum(data, cfg.key),
      trend: calcTrend(data, cfg.key),
    })),
    [data],
  );

  return (
    <div className={cn('relative bg-white rounded-[12px] p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)] border border-[#E9EAEB] overflow-hidden', className)}>
      {/* decorative blob */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#EFF8FF]/50 to-[#E0EAFF]/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-[10px] border border-[#E9EAEB] bg-white flex items-center justify-center shrink-0">
            <BookMarked className="w-6 h-6 text-[#1570EF]" strokeWidth={2} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[#181D27] tracking-tight">Program Overview</h3>
            <p className="text-[14px] text-[#717680]">Monthly program launches, completions, and participant trends</p>
          </div>
        </div>

        {/* ── Scope tabs — all programs, or one program type ── */}
        {hasScopes && <ProgramScopeTabs id="program-overview-scope" value={scope} onChange={setScope} />}

        {/* AI Insight */}
        <div className="relative rounded-[12px] bg-gradient-to-br from-[#EEF4FF]/50 via-[#F4F3FF]/30 to-white p-4 border border-[#C7D7FE]/50 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E0EAFF]/40 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
          <div className="relative flex gap-3 items-start">
            <div className="shrink-0 p-2 bg-white rounded-[8px] shadow-[0_2px_8px_rgba(68,76,231,0.15)] border border-[#EEF4FF] text-[#444CE7]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-[10px] text-[#2D3282] uppercase tracking-widest">AI Insight Analysis</h4>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
              </div>
              {/* Every tab's insight shares one grid cell, so the box is always
                  as tall as the longest text and the card never jumps. */}
              <p className="grid text-[12px] text-[#535862] leading-relaxed">
                {(hasScopes
                  ? ([['all', insight], ['course', courseInsight ?? insight], ['journey', journeyInsight ?? insight]] as const)
                  : ([['all', insight]] as const)
                ).map(([key, text]) => (
                  <span
                    key={key}
                    className="[grid-area:1/1] transition-opacity duration-300"
                    style={{ opacity: key === (hasScopes ? scope : 'all') ? 1 : 0 }}
                    aria-hidden={key !== (hasScopes ? scope : 'all')}
                  >
                    {text}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The chart stays mounted across tabs so recharts morphs it to the new
          data; only the numbers fade. */}
        <div>
          {/* ── KPI Summary Cards ──────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              const isPositive = kpi.trend >= 0;
              const TrendIcon = isPositive ? TrendingUp : TrendingDown;
              return (
                <div
                  key={kpi.key}
                  className={cn(
                    'relative rounded-[12px] p-4 overflow-hidden border border-[#E9EAEB]/80',
                    'bg-gradient-to-br', kpi.bg,
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('flex items-center justify-center w-10 h-10 rounded-[8px] bg-white/80 shadow-sm', kpi.iconColor)}>
                      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    </div>
                    {kpi.trend !== 0 && (
                      <div className={cn(
                        'flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] text-[12px] font-medium',
                        isPositive ? 'bg-[#D1FADF]/60 text-[#027A48]' : 'bg-[#FEE4E2]/60 text-[#B42318]',
                      )}>
                        <TrendIcon className="w-3 h-3" />
                        <FadeValue k={kpi.trend}>{isPositive ? '+' : ''}{kpi.trend}%</FadeValue>
                      </div>
                    )}
                  </div>
                  <p className="text-[24px] font-semibold text-[#181D27] leading-none tracking-tight"><FadeValue k={kpi.total}>{kpi.total}</FadeValue></p>
                  <p className="text-[12px] text-[#717680] mt-1">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          {/* ── Combo Chart ────────────────────────────────────── */}
          <div className="w-full min-w-0" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
              <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                <XAxis
                  key="xaxis"
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9AA0AC', fontSize: 11 }}
                  dy={8}
                />
                {/* Left Y — programs */}
                <YAxis
                  key="yaxis-left"
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9AA0AC', fontSize: 11 }}
                  domain={[0, leftMax]}
                  allowDecimals={false}
                />
                {/* Right Y — participants */}
                <YAxis
                  key="yaxis-right"
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9AA0AC', fontSize: 11 }}
                  domain={[0, rightMax]}
                  allowDecimals={false}
                />
                <Tooltip key="tooltip" content={<CustomTooltip />} cursor={{ fill: 'rgba(21,112,239,0.04)' }} />
                <Legend key="legend" content={<CustomLegend />} />

                {/* Bars — Participants (right axis) */}
                <Bar
                  key="bar-participants"
                  animationDuration={600}
                  animationEasing="ease-in-out"
                  yAxisId="right"
                  dataKey="participants"
                  name="Participants Joined"
                  fill="#53B1FD"
                  fillOpacity={0.13}
                  stroke="#53B1FD"
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />

                {/* Line — Programs Launched (left axis) */}
                <Line
                  key="line-launched"
                  animationDuration={600}
                  animationEasing="ease-in-out"
                  yAxisId="left"
                  type="monotone"
                  dataKey="launched"
                  name="Programs Launched"
                  stroke="#1570EF"
                  strokeWidth={2}
                  dot={{ fill: '#1570EF', r: 3.5, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                />

                {/* Line — Programs Completed (left axis) */}
                <Line
                  key="line-completed"
                  animationDuration={600}
                  animationEasing="ease-in-out"
                  yAxisId="left"
                  type="monotone"
                  dataKey="completed"
                  name="Programs Completed"
                  stroke="#2DD4BF"
                  strokeWidth={2}
                  dot={{ fill: '#2DD4BF', r: 3.5, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
}