import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { revealContainer, revealItem } from '@/variants/a/motion';
import { DashboardLayout } from '@/variants/a/layouts/DashboardLayout';
import { useDashboard } from './hooks/useDashboard';
import { LDDashboardHeader, PHOTO_HEADROOM } from './components/LDDashboardHeader';
import { LDDashboardProgramOverview } from './components/LDDashboardProgramOverview';
import { LDDashboardActivePrograms }  from './components/LDDashboardActivePrograms';
import { LDDashboardNissaInsight }     from './components/LDDashboardNissaInsight';
import { LDDashboardLearningAnalytics } from './components/LDDashboardLearningAnalytics';
import { DashboardDivisionsPerformance } from '@/variants/a/pages/hr/dashboard/components/DashboardDivisionsPerformance';
import { DashboardLicenseUtilization }   from '@/variants/a/pages/hr/dashboard/components/DashboardLicenseUtilization';

/**
 * L&D Team Dashboard Page
 *
 * Orchestrator only — no inline business logic.
 * All data comes from useDashboard(); all UI lives in components/.
 * Footer is auto-included by DashboardLayout.
 *
 * Not rendered here any more (files kept): LDDashboardCoursesAttention (folded
 * into Active programs' "Needs attention" tab), LDDashboardTraineesGrowth (its
 * figures now come from the core data) and LDDashboardRecentCourses
 * (may move to Upskill Studio).
 *
 * Route: /ld/dashboard  (registered in src/routes/AppRoutes.tsx)
 */
export default function LDDashboardPage() {
  const {
    ldProfile,
    metricCards,
    chartData,
    chartInsight,
    courseChartData,
    courseChartInsight,
    journeyChartData,
    journeyChartInsight,
    chartShortInsights,
    nisaInsights,
    programs,
    divisions,
    orgCompletion,
    orgCompletionTrend,
  } = useDashboard();

  return (
    <DashboardLayout>
      {/* Pulled up by the photo headroom: Diana's head rises into the empty left of the top bar row,
          and the profile and NISA cards start one 12px gap below it */}
      <div className="w-full min-w-0 -mt-7">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3"
          variants={revealContainer}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left column ── */}
          <div className="flex flex-col gap-3 min-w-0">
            <motion.div variants={revealItem}>
              <LDDashboardHeader profile={ldProfile} metrics={metricCards} />
            </motion.div>

            <motion.div variants={revealItem} className="oa-lift">
              <LDDashboardProgramOverview
                chartData={chartData}
                insight={chartInsight}
                courseData={courseChartData}
                courseInsight={courseChartInsight}
                journeyData={journeyChartData}
                journeyInsight={journeyChartInsight}
                shortInsights={chartShortInsights}
              />
            </motion.div>

            <motion.div variants={revealItem} className="oa-lift">
              <LDDashboardLearningAnalytics />
            </motion.div>

            <motion.div variants={revealItem} className="oa-lift">
              <DashboardDivisionsPerformance
                divisions={divisions}
                benchmark={orgCompletion}
                benchmarkTrend={orgCompletionTrend}
              />
            </motion.div>
          </div>

          {/* ── Right column: starts level with the profile card, below the photo's headroom ── */}
          <div className="flex flex-col gap-3 min-w-0 lg:pt-[var(--profile-headroom)]" style={{ '--profile-headroom': `${PHOTO_HEADROOM}px` } as CSSProperties}>
            <motion.div variants={revealItem} className="oa-lift">
              <LDDashboardNissaInsight insights={nisaInsights} />
            </motion.div>

            <motion.div variants={revealItem} className="oa-lift">
              <LDDashboardActivePrograms programs={programs} />
            </motion.div>

            <motion.div variants={revealItem} className="oa-lift">
              <DashboardLicenseUtilization />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
