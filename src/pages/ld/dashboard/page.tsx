import { motion } from 'motion/react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useDashboard } from './hooks/useDashboard';
import { LDDashboardHeader }          from './components/LDDashboardHeader';
import { LDDashboardProgramOverview } from './components/LDDashboardProgramOverview';
import { LDDashboardActivePrograms }  from './components/LDDashboardActivePrograms';
import { LDDashboardActivity }        from './components/LDDashboardActivity';
import { LDDashboardApprovalProgress } from './components/LDDashboardApprovalProgress';
import { LDDashboardRecentCourses }    from './components/LDDashboardRecentCourses';
import { LDDashboardCoursesAttention } from './components/LDDashboardCoursesAttention';
import { LDDashboardNissaInsight }     from './components/LDDashboardNissaInsight';
import { LDDashboardTraineesGrowth }   from './components/LDDashboardTraineesGrowth';
import { LDDashboardLearningAnalytics } from './components/LDDashboardLearningAnalytics';
import { DashboardDivisionsPerformance } from '@/pages/hr/dashboard/components/DashboardDivisionsPerformance';
import { DashboardLicenseUtilization }   from '@/pages/hr/dashboard/components/DashboardLicenseUtilization';
import { MOCK_DIVISION_PERFORMANCES, MOCK_LATEST_SUPPORT_DIVISION } from '@/pages/hr/dashboard/data/dashboard.mock';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  exit:    { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  exit:    { y: -20, opacity: 0 },
};

/**
 * L&D Team Dashboard Page
 *
 * Orchestrator only — no inline business logic.
 * All data comes from useDashboard(); all UI lives in components/.
 * Footer is auto-included by DashboardLayout.
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
    programs,
    activityItems,
    courseApprovals,
    recentCourses,
    coursesAttention,
  } = useDashboard();

  return (
    <DashboardLayout>
      <div className="w-full min-w-0">
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── Left column ── */}
          <div className="flex flex-col gap-5 min-w-0">
            <motion.div variants={itemVariants}>
              <LDDashboardHeader profile={ldProfile} metrics={metricCards} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <LDDashboardProgramOverview
                chartData={chartData}
                insight={chartInsight}
                courseData={courseChartData}
                courseInsight={courseChartInsight}
                journeyData={journeyChartData}
                journeyInsight={journeyChartInsight}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <LDDashboardLearningAnalytics />
            </motion.div>

            <motion.div variants={itemVariants}>
              <DashboardDivisionsPerformance
                divisions={MOCK_DIVISION_PERFORMANCES}
                latestSupport={MOCK_LATEST_SUPPORT_DIVISION}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <LDDashboardTraineesGrowth />
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-5 min-w-0">
            <motion.div variants={itemVariants}>
              <LDDashboardNissaInsight />
            </motion.div>

            <motion.div variants={itemVariants}>
              <LDDashboardActivePrograms programs={programs} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <LDDashboardCoursesAttention courses={coursesAttention} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <LDDashboardRecentCourses courses={recentCourses} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <DashboardLicenseUtilization showProgramTabs />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}