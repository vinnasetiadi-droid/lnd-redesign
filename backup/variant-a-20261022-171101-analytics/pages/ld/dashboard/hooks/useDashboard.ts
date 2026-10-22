import {
  MOCK_LD_PROFILE,
  MOCK_METRIC_CARDS,
  MOCK_CHART_DATA,
  MOCK_CHART_DATA_COURSE,
  MOCK_CHART_DATA_JOURNEY,
  MOCK_CHART_INSIGHT,
  MOCK_CHART_INSIGHT_COURSE,
  MOCK_CHART_INSIGHT_JOURNEY,
  MOCK_CHART_SHORT_INSIGHT,
  MOCK_NISA_INSIGHTS,
  MOCK_PROGRAMS,
  MOCK_ACTIVITY_ITEMS,
  MOCK_QUICK_ACTIONS,
  MOCK_COURSE_APPROVALS,
  MOCK_RECENT_COURSES,
  MOCK_COURSES_ATTENTION,
  ORG_COMPLETION_TREND,
} from '../data/dashboard.mock';
import { MOCK_DIVISION_PERFORMANCES } from '@/variants/a/pages/hr/dashboard/data/dashboard.mock';
import { orgCompletionRate } from '../data/core.mock';

/**
 * useLDDashboard
 * Central hook for the L&D Team Dashboard page. Every figure comes from
 * data/core.mock.ts (through dashboard.mock.ts), so the cards agree.
 * TODO: Replace with real API calls when backend is ready.
 *   - ldProfile       → GET /api/ld/profile
 *   - metricCards     → GET /api/ld/metrics
 *   - chartData       → GET /api/ld/program-trends
 *   - programs        → GET /api/ld/programs
 *   - activityItems   → GET /api/ld/activities
 */
export function useDashboard() {
  return {
    isLoading:        false,
    ldProfile:        MOCK_LD_PROFILE,
    metricCards:      MOCK_METRIC_CARDS,
    chartData:        MOCK_CHART_DATA,
    chartInsight:     MOCK_CHART_INSIGHT,
    courseChartData:    MOCK_CHART_DATA_COURSE,
    courseChartInsight: MOCK_CHART_INSIGHT_COURSE,
    journeyChartData:   MOCK_CHART_DATA_JOURNEY,
    journeyChartInsight: MOCK_CHART_INSIGHT_JOURNEY,
    chartShortInsights: MOCK_CHART_SHORT_INSIGHT,
    nisaInsights:     MOCK_NISA_INSIGHTS,
    programs:         MOCK_PROGRAMS,
    divisions:        MOCK_DIVISION_PERFORMANCES,
    orgCompletion:    orgCompletionRate(),
    orgCompletionTrend: ORG_COMPLETION_TREND,
    activityItems:    MOCK_ACTIVITY_ITEMS,
    quickActions:     MOCK_QUICK_ACTIONS,
    courseApprovals:   MOCK_COURSE_APPROVALS,
    recentCourses:    MOCK_RECENT_COURSES,
    coursesAttention: MOCK_COURSES_ATTENTION,
  };
}
