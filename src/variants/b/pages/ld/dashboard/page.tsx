import { useStickyColumnTop } from '@/variants/b/hooks/useStickyColumnTop';
import { motion } from 'motion/react';
import { revealContainer, revealItem } from '@/variants/b/motion';
import { DashboardLayout } from '@/variants/b/layouts/DashboardLayout';
import { useDashboard } from './hooks/useDashboard';
import { LDDashboardHeader } from './components/LDDashboardHeader';
import { LDDashboardProfile } from './components/LDDashboardProfile';
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
 * frames, its sections split by hairlines (NISA is a solid blue section), KPI and
 * summary columns split by vertical hairlines, green/red change chips and
 * rounded bars. The cards and their content are the same as Option A's Home.
 * The profile sits top left: a small square photo as tall as its details.
 *
 * Not rendered here any more (files kept): concepts/ProfileHeroCard (the
 * "head pops out" card, replaced by LDDashboardProfile), LDDashboardGreeting,
 * LDDashboardCoursesAttention (folded into Active programs' "Needs
 * attention" tab), LDDashboardTraineesGrowth (its
 * figures now come from the core data) and LDDashboardRecentCourses
 * (may move to Upskill Studio).
 *
 * Route: /ld/dashboard  (registered in src/routes/AppRoutes.tsx)
 */
export default function LDDashboardPage() {
  const { ref: stickyRef, top: stickyTop } = useStickyColumnTop();
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
          (reference style); NISA's section is solid blue. Pulled out to the page
          edges so the sections' own padding lines up with the top bar. */}
      <motion.div
        className="ob-flat relative -mx-6 -mt-6 min-w-0"
        variants={revealContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* ── Left column ── */}
          <div className="min-w-0">
            <motion.div variants={revealItem} className={SECTION}>
              <LDDashboardProfile person={ldProfile} />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem} className={SECTION}>
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
                className={SECTION}
              />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <LDDashboardLearningAnalytics className={SECTION} />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <DashboardDivisionsPerformance
                divisions={divisions}
                benchmark={orgCompletion}
                benchmarkTrend={orgCompletionTrend}
                className={SECTION}
              />
            </motion.div>
          </div>

          {/* ── Right column, split from the left by a hairline. The hairline stays on
              this full-height cell; only the inner wrapper is sticky (lg and up). ── */}
          <div className="min-w-0 border-t border-(--ob-border) lg:border-l lg:border-t-0">
            <div ref={stickyRef} className="lg:sticky" style={{ top: stickyTop }}>
            {/* NISA: one solid blue section, edge to edge in its column (no card
                frame), with the same padding as the other sections */}
            <motion.div variants={revealItem}>
              <LDDashboardNissaInsight insights={nisaInsights} className={SECTION} />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <LDDashboardActivePrograms programs={programs} className={SECTION} />
            </motion.div>

            <Rule />
            <motion.div variants={revealItem}>
              <DashboardLicenseUtilization variant="reference" className={SECTION} />
            </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

/** Every section's padding: 40px top, 32px bottom, 32px sides */
const SECTION = 'px-8 pt-10 pb-8';

/**
 * Section rule: edge to edge across its column, so it meets the vertical line
 * between the columns. Lines inside a section are lighter and inset.
 */
function Rule() {
  return <div className="h-px bg-(--ob-border)" aria-hidden />;
}
