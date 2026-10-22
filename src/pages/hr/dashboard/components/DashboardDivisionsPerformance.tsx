import { BarChart2, Trophy, AlertCircle } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/category-icon';
import { cn } from '@/lib/utils';
import { AIInsightBanner } from '@/components/ui/ai-insight-banner';
import type { DivisionPerformance } from '../types/dashboard.types';

// ── Local types ──────────────────────────────────────────────

interface NeedsSupportDivision {
  name: string;
  percentage: number;
}

interface DashboardDivisionsPerformanceProps {
  divisions: DivisionPerformance[];
  latestSupport: string;
  insight?: string;
  className?: string;
}

// ── Static chart data (matching Figma) ───────────────────────

const CHART_DIVISIONS = [
  { name: 'Data & Analytics', percentage: 92 },
  { name: 'Product', percentage: 87 },
  { name: 'DevOps', percentage: 84 },
  { name: 'Strategy & Operation', percentage: 81 },
  { name: 'IT', percentage: 76 },
  { name: 'HR', percentage: 74 },
  { name: 'Marketing', percentage: 68 },
  { name: 'Business', percentage: 64 },
];

const TOP_DIVISIONS_DATA = [
  { rank: 1, name: 'Data & Analytics', percentage: 92 },
  { rank: 2, name: 'Product', percentage: 87 },
  { rank: 3, name: 'DevOps', percentage: 84 },
];

const NEEDS_SUPPORT_DATA: NeedsSupportDivision[] = [
  { name: 'Business', percentage: 64 },
  { name: 'Marketing', percentage: 68 },
  { name: 'HR', percentage: 74 },
];

const AVG_SCORE = 78;
const INSIGHT_TEXT =
  'Overall division performance is up 6.2% from last year — Data & Analytics and Product lead the way. Business and Marketing may need extra support through workload redistribution or team-building initiatives.';

// ── Component ────────────────────────────────────────────────

export function DashboardDivisionsPerformance({
  className,
}: DashboardDivisionsPerformanceProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl p-8 shadow-sm border border-gray-100',
        className,
      )}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <CategoryIcon icon={BarChart2} size="default" />
          <div>
            <h2 className="font-semibold text-[18px] text-[#181D27]">
              Division Top Performance
            </h2>
            <p className="text-[13px] text-[#717680] mt-0.5">
              Self-assessment score vs HR benchmark (80%)
            </p>
          </div>
        </div>

        {/* Avg badge */}
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 shrink-0">
          <span className="text-[13px] text-[#535862]">Avg</span>
          <span className="text-[16px] font-semibold text-green-600">
            {AVG_SCORE}%
          </span>
        </div>
      </div>

      {/* ── Body: Chart + Side cards ───────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left — Horizontal Bar Chart */}
        <div className="flex-1 min-w-0">
          <div className="space-y-3.5">
            {CHART_DIVISIONS.map((div) => (
              <div key={div.name}>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-[13px] font-medium text-[#414651] whitespace-nowrap">
                    {div.name}
                  </span>
                  <span className="text-[12px] text-[#A4A7AE]">
                    {div.percentage}%
                  </span>
                </div>
                <div className="h-[10px] w-full bg-[#F2F4F7] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#528BFF]"
                    style={{ width: `${div.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-3 px-0.5">
            {['25%', '50%', '75%', '100%'].map((label) => (
              <span key={label} className="text-[11px] text-[#A4A7AE]">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Top Divisions + Needs Support */}
        <div className="flex flex-col gap-4 lg:w-[240px] shrink-0">
          {/* Top Divisions Card */}
          <div className="border border-[#E9EAEB] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-semibold text-[#535862] uppercase tracking-wider">
                Top Divisions
              </span>
            </div>
            <div className="space-y-3">
              {TOP_DIVISIONS_DATA.map((div) => (
                <div
                  key={div.rank}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[12px] text-[#A4A7AE] w-3 text-center">
                      {div.rank}
                    </span>
                    <span className="text-[13px] font-medium text-[#414651]">
                      {div.name}
                    </span>
                  </div>
                  <span className="text-[14px] font-semibold text-[#1570EF]">
                    {div.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Support Card */}
          <div className="border border-[#E9EAEB] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-[11px] font-semibold text-[#535862] uppercase tracking-wider">
                Needs Support
              </span>
            </div>
            <div className="space-y-3">
              {NEEDS_SUPPORT_DATA.map((div) => (
                <div
                  key={div.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-red-400 shrink-0"
                    >
                      <path
                        d="M7 7l10 10M7 7v10M7 7h10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="rotate(90 12 12)"
                      />
                    </svg>
                    <span className="text-[13px] font-medium text-[#414651]">
                      {div.name}
                    </span>
                  </div>
                  <span className="text-[14px] font-semibold text-red-500">
                    {div.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Insight Banner ──────────────────────────────── */}
      <AIInsightBanner className="mt-6">{INSIGHT_TEXT}</AIInsightBanner>
    </div>
  );
}