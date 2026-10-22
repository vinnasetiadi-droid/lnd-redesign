import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { KeyRound } from 'lucide-react';
import { AIInsightBanner } from '@/components/ui/ai-insight-banner';
import { useMemo, useState } from 'react';
import { ProgramScopeTabs, FadeValue, SCOPE_TABS, type ProgramScope } from '@/pages/ld/dashboard/components/ProgramScopeTabs';

/** Source Mapping only splits by program type — no "All Program" tab. */
const SOURCE_TABS = SCOPE_TABS.filter((t) => t.key !== 'all');

// ── Mock Data ──────────────────────────────────────────────────

interface LicenseItem {
  name: string;
  used: number;
  total: number;
  color: string;
}

// Seats are bought per source (15 each); "used" splits by where the trainee
// learns — Course + Journey add up to All Program.
const LICENSES_BY_SCOPE: Record<ProgramScope, LicenseItem[]> = {
  all: [
    { name: 'LinkedIn',     used: 3,  total: 15, color: '#4B7BF5' },
    { name: "O'Reilly",     used: 2,  total: 15, color: '#3DBDB5' },
    { name: 'Internal LnD', used: 10, total: 15, color: '#6DD4CC' },
  ],
  course: [
    { name: 'LinkedIn',     used: 2,  total: 15, color: '#4B7BF5' },
    { name: "O'Reilly",     used: 1,  total: 15, color: '#3DBDB5' },
    { name: 'Internal LnD', used: 6,  total: 15, color: '#6DD4CC' },
  ],
  journey: [
    { name: 'LinkedIn',     used: 1,  total: 15, color: '#4B7BF5' },
    { name: "O'Reilly",     used: 1,  total: 15, color: '#3DBDB5' },
    { name: 'Internal LnD', used: 4,  total: 15, color: '#6DD4CC' },
  ],
};

const AI_INSIGHT: Record<ProgramScope, string> = {
  all:
    "Internal LnD dominates as the primary learning source at 67%, while LinkedIn and O'Reilly have minimal adoption. Consider boosting external platform engagement through targeted campaigns — leveraging external resources could diversify skill development and improve learning outcomes.",
  course:
    "Courses draw most of their seats from Internal LnD (6 of 9 in use), with LinkedIn at 2 and O'Reilly at 1. Linking LinkedIn modules to existing courses would put more of the idle seats to work.",
  journey:
    "Journeys use 6 seats in total, 4 of them Internal LnD. Adding one external course per journey stage would bring LinkedIn and O'Reilly into the path and lift utilisation.",
};

// ── Main Component ─────────────────────────────────────────────

interface DashboardLicenseUtilizationProps {
  className?: string;
  /** L&D dashboard: split usage into Course / Journey tabs. */
  showProgramTabs?: boolean;
}

export function DashboardLicenseUtilization({
  className,
  showProgramTabs = false,
}: DashboardLicenseUtilizationProps) {
  const [scope, setScope] = useState<ProgramScope>(showProgramTabs ? 'course' : 'all');
  const LICENSES = LICENSES_BY_SCOPE[showProgramTabs ? scope : 'all'];
  const insight = AI_INSIGHT[showProgramTabs ? scope : 'all'];
  const totalUsed = useMemo(() => LICENSES.reduce((s, l) => s + l.used, 0), [LICENSES]);
  const totalAll = useMemo(() => LICENSES.reduce((s, l) => s + l.total, 0), [LICENSES]);
  const overallPct = Math.round((totalUsed / totalAll) * 100);

  const pieData = useMemo(
    () =>
      LICENSES.map((l) => ({
        name: l.name,
        value: l.used,
        color: l.color,
      })),
    [LICENSES],
  );

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 shadow-sm border border-gray-100',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <KeyRound className="w-5 h-5 text-blue-500" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#181D27] text-[16px] leading-tight">
            Source Mapping
          </h3>
          <p className="text-[#A4A7AE] text-[13px] mt-0.5 leading-snug">
            Percentage of purchased licenses actively used by trainees
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 text-[#414651] px-3 py-1.5 rounded-full border border-[#E9EAEB] shrink-0">
          <KeyRound className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold"><FadeValue k={totalUsed}>{totalUsed}/{totalAll}</FadeValue></span>
        </div>
      </div>

      {showProgramTabs && (
        <ProgramScopeTabs id="source-mapping-scope" value={scope} onChange={setScope} tabs={SOURCE_TABS} className="mb-5" />
      )}

      {/* Donut, bars and numbers stay mounted and animate to the new tab. */}
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="w-[180px] h-[180px] flex-shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
                animationDuration={600}
                animationEasing="ease-in-out"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} licenses used`,
                  name,
                ]}
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #E9EAEB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-semibold text-[#252B37]"><FadeValue k={overallPct}>{overallPct}%</FadeValue></span>
            <span className="text-[10px] text-[#717680]">Utilized</span>
          </div>
        </div>

        {/* Legend + bars */}
        <div className="flex-1 space-y-3">
          {LICENSES.map((license) => {
            const pct = Math.round((license.used / license.total) * 100);
            return (
              <div key={license.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: license.color }}
                    />
                    <span className="text-xs text-[#535862] font-medium">
                      {license.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#414651] font-semibold">
                    <FadeValue k={license.used}>{license.used}/{license.total} ({pct}%)</FadeValue>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: license.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insight */}
      <AIInsightBanner className="mt-5">
        {showProgramTabs ? (
          // Every tab's insight sits in the same grid cell, so the banner is
          // always as tall as the longest one and the card never jumps.
          <span className="grid">
            {SOURCE_TABS.map(({ key }) => (
              <span key={key} className="[grid-area:1/1] transition-opacity duration-300" style={{ opacity: key === scope ? 1 : 0 }} aria-hidden={key !== scope}>
                {AI_INSIGHT[key]}
              </span>
            ))}
          </span>
        ) : (
          insight
        )}
      </AIInsightBanner>
    </div>
  );
}