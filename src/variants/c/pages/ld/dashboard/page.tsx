import { motion } from 'motion/react';
import { revealContainer, revealItem } from '@/variants/c/motion';
import { DashboardLayout } from '@/variants/c/layouts/DashboardLayout';
import { useDashboard } from './hooks/useDashboard';
import { LDDashboardHeader } from './components/LDDashboardHeader';
import { ProfileHeroCard } from '@/variants/c/concepts/ProfileHeroCard';
import { LDDashboardProgramOverview } from './components/LDDashboardProgramOverview';
import { LDDashboardActivePrograms }  from './components/LDDashboardActivePrograms';
import { LDDashboardNissaInsight }     from './components/LDDashboardNissaInsight';
import { LDDashboardLearningAnalytics } from './components/LDDashboardLearningAnalytics';
import { DashboardDivisionsPerformance } from '@/variants/c/pages/hr/dashboard/components/DashboardDivisionsPerformance';
import { DashboardLicenseUtilization }   from '@/variants/c/pages/hr/dashboard/components/DashboardLicenseUtilization';

/**
 * L&D Team Dashboard Page
 *
 * Orchestrator only — no inline business logic.
 * All data comes from useDashboard(); all UI lives in components/.
 * Footer is auto-included by DashboardLayout.
 *
 * Option C: the profile card whose cut-out head rises above its top edge
 * (concepts/ProfileHeroCard) leads the left column; the right column starts
 * level with the card, below the head's headroom. LDDashboardGreeting is kept
 * in LDDashboardHeader.tsx but not rendered.
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
      <div className="w-full min-w-0">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3"
          variants={revealContainer}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left column ── */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Profile: the head rises into the headroom above the card */}
            <motion.div variants={revealItem}>
              <ProfileHeroCard person={ldProfile} />
            </motion.div>

            <motion.div variants={revealItem}>
              <LDDashboardHeader metrics={metricCards} />
            </motion.div>

            <motion.div variants={revealItem} className="oc-lift">
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

            <motion.div variants={revealItem} className="oc-lift">
              <LDDashboardLearningAnalytics />
            </motion.div>

            <motion.div variants={revealItem} className="oc-lift">
              <DashboardDivisionsPerformance
                divisions={divisions}
                benchmark={orgCompletion}
                benchmarkTrend={orgCompletionTrend}
              />
            </motion.div>
          </div>

          {/* ── Right column: starts level with the profile card, below the head's headroom ── */}
          {/* lg:pt-[28px] = PROFILE_HEADROOM (a literal, so Tailwind can see it) */}
          <div className="flex flex-col gap-3 min-w-0 lg:pt-[28px]">
            <motion.div variants={revealItem} className="oc-lift">
              <LDDashboardNissaInsight insights={nisaInsights} />
            </motion.div>

            <motion.div variants={revealItem} className="oc-lift">
              <LDDashboardActivePrograms programs={programs} />
            </motion.div>

            <motion.div variants={revealItem} className="oc-lift">
              <DashboardLicenseUtilization />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
