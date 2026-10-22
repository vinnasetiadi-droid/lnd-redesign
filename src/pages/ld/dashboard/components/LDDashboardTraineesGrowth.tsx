import { useMemo, useState } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ProgramScopeTabs, FadeValue, type ProgramScope } from './ProgramScopeTabs';

// Course + Journey add up to All Program every month.
const TRAINEES_GROWTH_DATA: Record<ProgramScope, { month: string; value: number }[]> = {
  all: [
    { month: 'Oct 2025', value: 282 },
    { month: 'Nov 2025', value: 300 },
    { month: 'Dec 2025', value: 348 },
    { month: 'Jan 2026', value: 358 },
    { month: 'Feb 2026', value: 370 },
    { month: 'Mar 2026', value: 396 },
  ],
  course: [
    { month: 'Oct 2025', value: 190 },
    { month: 'Nov 2025', value: 202 },
    { month: 'Dec 2025', value: 236 },
    { month: 'Jan 2026', value: 242 },
    { month: 'Feb 2026', value: 250 },
    { month: 'Mar 2026', value: 268 },
  ],
  journey: [
    { month: 'Oct 2025', value: 92 },
    { month: 'Nov 2025', value: 98 },
    { month: 'Dec 2025', value: 112 },
    { month: 'Jan 2026', value: 116 },
    { month: 'Feb 2026', value: 120 },
    { month: 'Mar 2026', value: 128 },
  ],
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
    <div className="rounded-[12px] border border-[#E9EAEB] bg-white px-3 py-2 shadow-lg">
      <p className="text-[11px] text-[#717680] mb-0.5" style={{ fontWeight: 600 }}>{label}</p>
      <p className="text-[14px] text-[#181D27]" style={{ fontWeight: 700 }}>{payload[0].value} trainees</p>
    </div>
  );
}

export function LDDashboardTraineesGrowth({ className }: LDDashboardTraineesGrowthProps) {
  const [scope, setScope] = useState<ProgramScope>('all');
  const data = TRAINEES_GROWTH_DATA[scope];
  const axis = useMemo(() => niceAxis(data.map((d) => d.value)), [data]);
  const first = data[0].value;
  const last = data[data.length - 1].value;
  const growthPercent = Math.round(((last - first) / first) * 100);
  const growthAbs = last - first;

  return (
    <div
      className={cn(
        'rounded-[12px] bg-white border border-[#E9EAEB] shadow-[0_1px_3px_rgba(16,24,40,0.06)] p-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] border border-[#E9EAEB] bg-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-[#1570EF]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[#181D27] text-[20px] mb-6" style={{ fontWeight: 600, lineHeight: '20px' }}>
              Trainees Growth Trend
            </h3>
            <p className="text-[#717680] mt-0.5 text-[14px]" style={{ fontWeight: 400, lineHeight: '16px' }}>
              Total enrolled trainees over time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[12px] px-2 py-[2px] rounded-[4px] bg-[#D1FADF] text-[#027A48]" style={{ fontWeight: 500 }}>
          <ArrowUpRight className="w-3 h-3" />
          <FadeValue k={growthPercent}>+{growthPercent}%</FadeValue>
        </div>
      </div>

      <ProgramScopeTabs id="trainees-growth-scope" value={scope} onChange={setScope} className="mb-4" />

      {/* Chart — stays mounted so the line morphs to the new tab's data */}
      <div className="min-w-0" style={{ height: '220px', width: '100%' }}>
        <ResponsiveContainer width="100%" height={220} minWidth={0}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F2F4F7" vertical={false} />
            <XAxis
              key="xaxis"
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9AA0AC', fontWeight: 500 }}
              tickFormatter={(v: string) => {
                const parts = v.split(' ');
                return parts[0].substring(0, 3);
              }}
            />
            <YAxis
              key="yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9AA0AC', fontWeight: 500 }}
              domain={axis.domain}
              ticks={axis.ticks}
            />
            <Tooltip key="tooltip" content={<CustomTooltip />} />
            <Line
              key="trainees-growth-line"
              type="monotone"
              dataKey="value"
              stroke="#1570EF"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#1570EF', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#1570EF', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E9EAEB]">
        <div className="text-center p-2 rounded-[10px] bg-[#F8F9FC] border border-[#D5D7DA]">
          <p className="text-[14px] text-[#1570EF]" style={{ fontWeight: 700 }}><FadeValue k={last}>{last}</FadeValue></p>
          <p className="text-[9px] text-[#717680] uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Current
          </p>
        </div>
        <div className="text-center p-2 rounded-[10px] bg-[#F8F9FC] border border-[#D5D7DA]">
          <p className="text-[14px] text-[#039855]" style={{ fontWeight: 700 }}><FadeValue k={growthAbs}>+{growthAbs}</FadeValue></p>
          <p className="text-[9px] text-[#717680] uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Growth
          </p>
        </div>
        <div className="text-center p-2 rounded-[10px] bg-[#F8F9FC] border border-[#D5D7DA]">
          <p className="text-[14px] text-[#1570EF]" style={{ fontWeight: 700 }}><FadeValue k={growthPercent}>+{growthPercent}%</FadeValue></p>
          <p className="text-[9px] text-[#717680] uppercase tracking-wider" style={{ fontWeight: 600 }}>
            6M Rate
          </p>
        </div>
      </div>
    </div>
  );
}