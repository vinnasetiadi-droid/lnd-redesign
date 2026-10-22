// ============================================================
// Learning Mode Analytics — Attendance, Hours & Progress by mode
// Unique metrics NOT already on the dashboard:
//   - Attendance Rate (Enrolled vs Attending) — per mode
//   - Total Learning Hours — per mode
//   - Learning Progress Over Time — broken down by program type and mode
// (Total Trainees & Completion Rate already in Header + ProgramOverview)
// Scoped by program type (All Program / Course / Journey); the chart splits
// each program into its two delivery modes.
// ============================================================

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { UserCheck, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';

// ── Types ────────────────────────────────────────────────────

type LearningMode = 'all' | 'blended' | 'self-paced';

interface ModeData {
  enrolled: number;
  attending: number;
  attendanceRate: number;
  totalHours: number;
}

/** One completion % per program type × mode. */
interface MonthlyProgress {
  month: string;
  'course-blended': number;
  'journey-blended': number;
  'course-self': number;
  'journey-self': number;
}

type SeriesKey = Exclude<keyof MonthlyProgress, 'month'>;

// ── Mock Data ────────────────────────────────────────────────
// Course + Journey add up to All Program for every mode.

const MODE_DATA: Record<ProgramScope, Record<LearningMode, ModeData>> = {
  all: {
    all:          { enrolled: 386, attending: 351, attendanceRate: 91, totalHours: 4820 },
    blended:      { enrolled: 172, attending: 152, attendanceRate: 88, totalHours: 2670 },
    'self-paced': { enrolled: 214, attending: 201, attendanceRate: 94, totalHours: 2150 },
  },
  course: {
    all:          { enrolled: 260, attending: 241, attendanceRate: 93, totalHours: 3020 },
    blended:      { enrolled: 110, attending: 99,  attendanceRate: 90, totalHours: 1640 },
    'self-paced': { enrolled: 150, attending: 142, attendanceRate: 95, totalHours: 1380 },
  },
  journey: {
    all:          { enrolled: 126, attending: 112, attendanceRate: 89, totalHours: 1800 },
    blended:      { enrolled: 62,  attending: 53,  attendanceRate: 85, totalHours: 1030 },
    'self-paced': { enrolled: 64,  attending: 59,  attendanceRate: 92, totalHours: 770 },
  },
};

const MONTHLY_PROGRESS: MonthlyProgress[] = [
  { month: 'Sep', 'course-blended': 46, 'journey-blended': 36, 'course-self': 61, 'journey-self': 53 },
  { month: 'Oct', 'course-blended': 52, 'journey-blended': 42, 'course-self': 65, 'journey-self': 57 },
  { month: 'Nov', 'course-blended': 54, 'journey-blended': 44, 'course-self': 68, 'journey-self': 60 },
  { month: 'Dec', 'course-blended': 51, 'journey-blended': 43, 'course-self': 63, 'journey-self': 55 },
  { month: 'Jan', 'course-blended': 59, 'journey-blended': 49, 'course-self': 74, 'journey-self': 66 },
  { month: 'Feb', 'course-blended': 64, 'journey-blended': 54, 'course-self': 79, 'journey-self': 71 },
  { month: 'Mar', 'course-blended': 72, 'journey-blended': 62, 'course-self': 85, 'journey-self': 77 },
];

// ── Config ───────────────────────────────────────────────────

// Purple = blended, blue = self-paced; light = course, dark = journey.
const SERIES: { key: SeriesKey; label: string; color: string; scope: Exclude<ProgramScope, 'all'> }[] = [
  { key: 'course-blended',  label: 'Course · Blended Learning',  color: '#A78BFA', scope: 'course' },
  { key: 'journey-blended', label: 'Journey · Blended Learning', color: '#5B21B6', scope: 'journey' },
  { key: 'course-self',     label: 'Course · Self Learning',     color: '#53B1FD', scope: 'course' },
  { key: 'journey-self',    label: 'Journey · Self Learning',    color: '#1849A9', scope: 'journey' },
];

/** Dot colour for the hours breakdown — follows the scope's shade. */
const MODE_DOT: Record<ProgramScope, Record<'blended' | 'self-paced', string>> = {
  all:     { blended: '#7C3AED', 'self-paced': '#1570EF' },
  course:  { blended: '#A78BFA', 'self-paced': '#53B1FD' },
  journey: { blended: '#5B21B6', 'self-paced': '#1849A9' },
};

// ── Custom Tooltip ───────────────────────────────────────────

function ChartTooltip({ active, payload, label, visibleKeys }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
  visibleKeys: Set<string>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-[8px] border border-[#E9EAEB] shadow-[0_12px_16px_rgba(16,24,40,0.08),0_4px_6px_rgba(16,24,40,0.03)] px-4 py-3 min-w-[160px]">
      <p className="text-[12px] font-semibold text-[#181D27] mb-2">{label}</p>
      {payload.filter((e) => visibleKeys.has(e.dataKey)).map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-[12px] text-[#717680]">{entry.name}</span>
          </div>
          <span className="text-[12px] font-semibold text-[#181D27]">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

export function LDDashboardLearningAnalytics({ className }: { className?: string }) {
  const [scope, setScope] = useState<ProgramScope>('all');
  const data = MODE_DATA[scope].all;

  // All four lines stay mounted; the tab only fades the other program's
  // lines out, so switching never redraws the chart from scratch.
  const visibleKeys = useMemo(
    () => new Set<string>(SERIES.filter((sr) => scope === 'all' || sr.scope === scope).map((sr) => sr.key)),
    [scope],
  );
  // Gradients only read well under one or two lines; four stay as plain lines.
  const showFill = visibleKeys.size <= 2;

  return (
    <div className={cn('bg-white rounded-[12px] border border-[#E9EAEB] shadow-[0_1px_3px_rgba(16,24,40,0.06)] overflow-hidden', className)}>
      {/* Header + Program Tabs */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-[#181D27]">Learning Mode Analytics</h3>
            <p className="text-[13px] text-[#717680] mt-0.5">Attendance, hours & progress by delivery mode</p>
          </div>
        </div>
        <ProgramScopeTabs id="learning-analytics-scope" value={scope} onChange={setScope} />
      </div>

      {/* Line, dot and fill opacity ease between tabs. */}
      <style>{`
        .la-series path, .la-series circle { transition: stroke-opacity 300ms ease, fill-opacity 300ms ease; }
      `}</style>
      {/* Attendance + Hours metrics */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-5">
        {/* Attendance Rate */}
        <div className="bg-[#FAFAFA] rounded-lg px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[10px] bg-white border border-[#E9EAEB] shadow-[0_1px_3px_rgba(16,24,40,0.06)] flex items-center justify-center shrink-0">
              <UserCheck className="w-[18px] h-[18px] text-[#1570EF]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[12px] text-[#717680] uppercase tracking-wider">Attendance Rate</p>
              <p className="text-[24px] font-bold text-[#181D27] leading-tight"><FadeValue k={data.attendanceRate}>{data.attendanceRate}</FadeValue><span className="text-[14px] font-semibold text-[#717680]">%</span></p>
            </div>
          </div>
          {/* Enrolled vs Attending bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#717680]">Enrolled</span>
              <span className="font-semibold text-[#181D27]"><FadeValue k={data.enrolled}>{data.enrolled}</FadeValue></span>
            </div>
            <div className="w-full h-2 bg-[#E9EAEB] rounded-full overflow-hidden">
              <div className="h-full bg-[#1570EF] rounded-full transition-all duration-500" style={{ width: '100%' }} />
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#717680]">Attending</span>
              <span className="font-semibold text-[#181D27]"><FadeValue k={data.attending}>{data.attending}</FadeValue></span>
            </div>
            <div className="w-full h-2 bg-[#E9EAEB] rounded-full overflow-hidden">
              <div className="h-full bg-[#2DD4BF] rounded-full transition-all duration-500" style={{ width: `${data.attendanceRate}%` }} />
            </div>
          </div>
        </div>

        {/* Learning Hours — broken down by mode */}
        <div className="bg-[#FAFAFA] rounded-lg px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[10px] bg-white border border-[#E9EAEB] shadow-[0_1px_3px_rgba(16,24,40,0.06)] flex items-center justify-center shrink-0">
              <Clock className="w-[18px] h-[18px] text-[#1570EF]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[12px] text-[#717680] uppercase tracking-wider">Total Learning Hours</p>
              <p className="text-[24px] font-bold text-[#181D27] leading-tight"><FadeValue k={data.totalHours}>{data.totalHours.toLocaleString()}</FadeValue><span className="text-[14px] font-semibold text-[#717680]">h</span></p>
            </div>
          </div>
          <div className="space-y-2">
            {(['blended', 'self-paced'] as const).map((mode) => {
              const modeData = MODE_DATA[scope][mode];
              const pct = Math.round((modeData.totalHours / data.totalHours) * 100);
              const label = mode === 'self-paced' ? 'Self-paced' : 'Blended';
              return (
                <div key={mode} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0 transition-colors duration-300" style={{ backgroundColor: MODE_DOT[scope][mode] }} />
                  <span className="text-[12px] text-[#717680] flex-1">{label}</span>
                  <span className="text-[12px] font-semibold text-[#181D27]"><FadeValue k={modeData.totalHours}>{modeData.totalHours.toLocaleString()}h</FadeValue></span>
                  <span className="text-[11px] text-[#A4A7AE] w-8 text-right"><FadeValue k={pct}>{pct}%</FadeValue></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Over Time Chart */}
      <div className="px-5 pb-5">
        <div className="bg-[#FAFAFA] rounded-lg border border-[#E9EAEB] p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[13px] font-semibold text-[#181D27]">Learning Progress Over Time</h4>
            <span className="text-[11px] text-[#A4A7AE]">Completion % by program type & mode per month</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_PROGRESS} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
              <defs>
                {SERIES.map((sr) => (
                  <linearGradient key={sr.key} id={`laGrad-${sr.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sr.color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={sr.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717680' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717680' }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip content={<ChartTooltip visibleKeys={visibleKeys} />} />
              {SERIES.map((sr) => {
                const on = visibleKeys.has(sr.key);
                return (
                  <Area
                    key={sr.key}
                    className="la-series"
                    type="monotone"
                    dataKey={sr.key}
                    name={sr.label}
                    stroke={sr.color}
                    strokeWidth={2}
                    strokeOpacity={on ? 1 : 0}
                    fill={`url(#laGrad-${sr.key})`}
                    fillOpacity={on && showFill ? 1 : 0}
                    dot={{ r: 3, fill: sr.color, fillOpacity: on ? 1 : 0, strokeWidth: 0 }}
                    activeDot={on ? { r: 5, fill: sr.color, stroke: '#fff', strokeWidth: 2 } : false}
                    isAnimationActive={false}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
          {/* Legend lists all four so it never reflows; the other program dims. */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2">
            {SERIES.map((sr) => (
              <div
                key={sr.key}
                className="flex items-center gap-1.5 transition-opacity duration-300"
                style={{ opacity: visibleKeys.has(sr.key) ? 1 : 0.35 }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sr.color }} />
                <span className="text-[12px]" style={{ color: sr.color }}>{sr.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
