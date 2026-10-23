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
 * Visual style after the reference dashboards: a white page with no card
 * frames, its sections split by hairlines (only NISA keeps a card), KPI and
 * summary columns split by vertical hairlines, green/red change chips and
 * rounded bars. The cards and their content are the same as Option A's Home.
 * The profile with the cut-out photo sits top left.
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
    <DashboardLayout whitePage>
      {/* No frames: the sections sit on the white page, split by hairlines
          (reference style); only NISA keeps a card. Pulled out to the page
          edges so the sections' own padding lines up with the top bar. */}
      <motion.div
        className="ob-flat relative -mx-6 -mt-6 min-w-0 pt-6"
        variants={revealContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* ── Left column ── */}
          <div className="min-w-0">
            <motion.div variants={revealItem}>
              <ProfileHeroCard person={ldProfile} className="px-8" />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem} className="px-8 py-8">
              <LDDashboardHeader metrics={metricCards} flat />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <LDDashboardProgramOverview
                chartData={chartData}
                insight={chartInsight}
                courseData={courseChartData}
                courseInsight={courseChartInsight}
                journeyData={journeyChartData}
                journeyInsight={journeyChartInsight}
                shortInsights={chartShortInsights}
                className="px-8 py-8"
              />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <LDDashboardLearningAnalytics className="px-8 py-8" />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <DashboardDivisionsPerformance
                divisions={divisions}
                benchmark={orgCompletion}
                benchmarkTrend={orgCompletionTrend}
                className="px-8 py-8"
              />
            </motion.div>
          </div>

          {/* ── Right column, split from the left by a hairline ── */}
          <div className="min-w-0 border-t border-(--ob-border) lg:border-l lg:border-t-0">
            {/* Level with the profile, below the photo's headroom */}
            <motion.div variants={revealItem} className="px-6 pb-6" style={{ paddingTop: PROFILE_HEADROOM }}>
              <LDDashboardNissaInsight insights={nisaInsights} />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <LDDashboardActivePrograms programs={programs} className="px-8 py-8" />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <DashboardLicenseUtilization variant="reference" className="px-8 py-8" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

/** Hairline between two sections, inset to the content edges */
function Rule() {
  return <div className="mx-8 h-px bg-(--ob-border)" aria-hidden />;
}
