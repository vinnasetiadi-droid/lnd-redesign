import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { revealContainer, revealItem } from '@/variants/b/motion';
import { DashboardLayout } from '@/variants/b/layouts/DashboardLayout';
import { useDashboard } from './hooks/useDashboard';
import { LDDashboardHeader } from './components/LDDashboardHeader';
import { ProfileHeroCard, PROFILE_HEADROOM } from '@/variants/b/concepts/ProfileHeroCard';
import { LDDashboardProgramOverview } from './components/LDDashboardProgramOverview';
import { LDDashboardActivePrograms }  from './components/LDDashboardActivePrograms';
import { LDDashboardNissaInsight }     from './components/LDDashboardNissaInsight';
import { LDDashboardLearningAnalytics } from './components/LDDashboardLearningAnalytics';
import { DashboardDivisionsPerformance } from '@/variants/b/pages/hr/dashboard/components/DashboardDivisionsPerformance';
import { DashboardLicenseUtilization }   from '@/variants/b/pages/hr/dashboard/components/DashboardLicenseUtilization';

/**
 * L&D Team Dashboard Page
 *
 * Orchestrator only — no inline business logic.
 * All data comes from useDashboard(); all UI lives in components/.
 * Footer is auto-included by DashboardLayout.
 *
 * Visual style after the reference dashboard (hairline-framed white cards on
 * a plain page, small blue KPI icons, green/red change chips, rounded bars);
 * the cards and their content are the same as Option A's Home. The profile
 * card with the photo rising above it is back at the top of the left column.
 *
 * Not rendered here any more (files kept): LDDashboardGreeting (the profile
 * card is back in its place), LDDashboardCoursesAttention (folded
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
      {/* The photo's head rises into the space above the profile card */}
      <div className="w-full min-w-0 -mt-2">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3"
          variants={revealContainer}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left column ── */}
          <div className="flex flex-col gap-3 min-w-0">
            <motion.div variants={revealItem}>
              <ProfileHeroCard person={ldProfile} />
            </motion.div>

            <motion.div variants={revealItem}>
              <LDDashboardHeader metrics={metricCards} />
            </motion.div>

            <motion.div variants={revealItem} className="ob-lift">
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

            <motion.div variants={revealItem} className="ob-lift">
              <LDDashboardLearningAnalytics />
            </motion.div>

            <motion.div variants={revealItem} className="ob-lift">
              <DashboardDivisionsPerformance
                divisions={divisions}
                benchmark={orgCompletion}
                benchmarkTrend={orgCompletionTrend}
              />
            </motion.div>
          </div>

          {/* ── Right column: starts level with the profile card, below the photo's headroom ── */}
          <div
            className="flex flex-col gap-3 min-w-0 lg:pt-[var(--profile-headroom)]"
            style={{ '--profile-headroom': `${PROFILE_HEADROOM}px` } as CSSProperties}
          >
            <motion.div variants={revealItem} className="ob-lift">
              <LDDashboardNissaInsight insights={nisaInsights} />
            </motion.div>

            <motion.div variants={revealItem} className="ob-lift">
              <LDDashboardActivePrograms programs={programs} />
            </motion.div>

            <motion.div variants={revealItem} className="ob-lift">
              <DashboardLicenseUtilization variant="reference" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
