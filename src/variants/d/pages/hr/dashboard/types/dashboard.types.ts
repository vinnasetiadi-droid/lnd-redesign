// ============================================================
// HR Dashboard — Type Definitions
// ============================================================

export interface UserProfile {
  name: string;
  role: string;
  department: string;
  phone?: string;
  location?: string;
  email?: string;
  company?: string;
  avatarSrc?: string;
  stats: {
    workDuration: { value: number; unit: string };
    certifications: number;
    courses: number;
  };
}

// ── Metric Cards ─────────────────────────────────────────────

export type MetricCardKey = 'active-programs' | 'participants' | 'total-instructors' | 'total-employees';

export interface DashboardMetricCard {
  key: MetricCardKey;
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
}

// ── Progress & Performance ───────────────────────────────────

export interface TopDivision {
  id: string;
  rank: 1 | 2 | 3;
  name: string;
  completionRate: number;
  /** Flexible stats rows (label/value pairs differ per division) */
  stats: { label: string; value: number | string }[];
}

// ── Division Performance Bars ────────────────────────────────

export type DivisionPerformanceStatus = 'success' | 'info' | 'warning' | 'danger';

export interface DivisionPerformance {
  id: string;
  name: string;
  percentage: number;
  status: DivisionPerformanceStatus;
}

// ── Activity Feed ────────────────────────────────────────────

export type ActivityColorScheme = 'blue' | 'green' | 'purple';

export interface ActivityItem {
  id: string;
  personName: string;
  action: string;
  timeAgo: string;
  colorScheme: ActivityColorScheme;
}

// ── NISA Recommendations ─────────────────────────────────────

export interface NisaRecommendation {
  id: string;
  title: string;
  description: string;
  /** Hex colour for the recommendation icon fill */
  iconColor: string;
  /** Lucide icon name for the recommendation */
  iconName: 'AlertTriangle' | 'Eye' | 'Star';
  /** Action link label */
  actionLabel: string;
  /** Action link route */
  actionRoute: string;
}

// ── Quick Actions ────────────────────────────────────────────

export type QuickActionIcon = 'Calendar' | 'BarChart3' | 'Bell' | 'MessageSquare';

export interface QuickAction {
  id: string;
  label: string;
  iconName: QuickActionIcon;
}