import imgFrame1 from 'figma:asset/eb283f38669f10ecbb567cb68fcaf90faba0df96.png';
import imgFrame2 from 'figma:asset/7ee50193e61e4a6e26d6a7e66b8bec5f492f0c09.png';
import imgFrame3 from 'figma:asset/92759d9b9b6ac09d46982ccdfde883cd9b5d2c89.png';

import type {
  UserProfile,
  DashboardMetricCard,
  TopDivision,
  DivisionPerformance,
  ActivityItem,
  NisaRecommendation,
  QuickAction,
} from '../types/dashboard.types';

// ── User Profile ──────────────────────────────────────────────

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Sarah Johnson',
  role: 'HR Manager',
  department: 'People & Culture',
  phone: '+62 812 3456 7890',
  location: 'Jakarta',
  email: 'sarah.johnson@presight.com',
  company: 'Presight',
  stats: {
    workDuration: { value: 4, unit: 'Years' },
    certifications: 6,
    courses: 12,
  },
};

// ── Metric Cards ──────────────────────────────────────────────

export const MOCK_METRIC_CARDS: DashboardMetricCard[] = [
  {
    key: 'active-programs',
    title: 'ACTIVE PROGRAMS',
    value: '14',
    trend: '+3 this quarter',
    trendPositive: true,
  },
  {
    key: 'participants',
    title: 'PARTICIPANTS',
    value: '309',
    trend: '+42 this month',
    trendPositive: true,
  },
  {
    key: 'total-instructors',
    title: 'TOTAL INSTRUCTORS',
    value: '6',
    trend: '+4 this quarter',
    trendPositive: true,
  },
  {
    key: 'total-employees',
    title: 'TOTAL EMPLOYEES',
    value: '600',
    trend: '+18 this month',
    trendPositive: true,
  },
];

// ── Progress & Performance ────────────────────────────────────

export const MOCK_TOP_DIVISIONS: TopDivision[] = [
  {
    id: 'marketing',
    rank: 1,
    name: 'Marketing',
    completionRate: 96,
    stats: [
      { label: 'Courses', value: 45 },
      { label: 'Certificates', value: 32 },
    ],
  },
  {
    id: 'hr',
    rank: 2,
    name: 'Human Resource',
    completionRate: 86,
    stats: [
      { label: 'Courses', value: 32 },
      { label: 'Certificates', value: 22 },
    ],
  },
  {
    id: 'finance',
    rank: 3,
    name: 'Finance & Accounting',
    completionRate: 84,
    stats: [
      { label: 'Avg Completion Rate', value: 28 },
      { label: 'Certificates', value: 22 },
    ],
  },
];

export const MOCK_PERFORMANCE_INSIGHT =
  'Marketing division is on track (96% completion rate), while Finance & Accounting (84%) needs improvement. Finance & Accounting is closely but slightly behind to completion rate and course volume.';

// ── Division Performance Bars ─────────────────────────────────

// Completion rate per division this month. Their average matches the L&D
// Home's org completion rate (68%), which the card draws as its benchmark.
export const MOCK_DIVISION_PERFORMANCES: DivisionPerformance[] = [
  { id: 'marketing',   name: 'Marketing',            percentage: 82, status: 'success' },
  { id: 'engineering', name: 'Engineering',          percentage: 79, status: 'success' },
  { id: 'finance',     name: 'Finance & Accounting', percentage: 74, status: 'info'    },
  { id: 'hr',          name: 'Human Resource',       percentage: 70, status: 'info'    },
  { id: 'sales',       name: 'Sales',                percentage: 63, status: 'warning' },
  { id: 'operations',  name: 'Operations',           percentage: 58, status: 'warning' },
  { id: 'legal',       name: 'Legal',                percentage: 52, status: 'danger'  },
];

export const MOCK_LATEST_SUPPORT_DIVISION = 'Legal';

// ── Activity Feed ─────────────────────────────────────────────

export const MOCK_ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: '1',
    personName: 'Sarah',
    action: 'completed UX/UI Conversion Design Track Series',
    timeAgo: '1 min',
    colorScheme: 'blue',
  },
  {
    id: '2',
    personName: 'David',
    action: 'started track series',
    timeAgo: '12 min',
    colorScheme: 'green',
  },
  {
    id: '3',
    personName: 'HR-5',
    action: 'completed Builds Team',
    timeAgo: '23 min',
    colorScheme: 'purple',
  },
  {
    id: '4',
    personName: 'Thomas',
    action: 'Conversion Design Track Series',
    timeAgo: '1 hr',
    colorScheme: 'blue',
  },
];

// ── NISA Recommendations ──────────────────────────────────────

export const MOCK_NISA_RECOMMENDATIONS: NisaRecommendation[] = [
  {
    id: '1',
    title: 'Low Completion in Data Division',
    description: 'Only 42% completion rate — 18 employees behind schedule on mandatory courses',
    iconColor: '#EB3B5A',
    iconName: 'AlertTriangle',
    actionLabel: 'View Division Detail',
    actionRoute: '/hr/analytics/course-overview',
  },
  {
    id: '2',
    title: 'Upcoming Certification Expiry',
    description: '12 employees have certifications expiring within 30 days',
    iconColor: '#FECA57',
    iconName: 'Eye',
    actionLabel: 'Review Certifications',
    actionRoute: '/hr/employee-management',
  },
  {
    id: '3',
    title: 'Top Performer Recognition',
    description: '5 employees completed all assigned courses with 90%+ scores',
    iconColor: '#FECA57',
    iconName: 'Star',
    actionLabel: 'See Top Performers',
    actionRoute: '/hr/analytics/trainee-overview',
  },
];

// ── Quick Actions ─────────────────────────────────────────────

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  { id: '1', label: 'Schedule Check-ins', iconName: 'Calendar'     },
  { id: '2', label: 'View Analytics',     iconName: 'BarChart3'    },
  { id: '3', label: 'Set Alerts',         iconName: 'Bell'         },
  { id: '4', label: 'Bulk Message',       iconName: 'MessageSquare'},
];

// ── Workforce Growth ──────────────────────────────────────────

export const MOCK_WORKFORCE_INSIGHT =
  'New Hire rate in Nov-Dec (-35.75%), while onboarding data in May-Jun (-29%) with capacity ahead of 12 quota to keep attention on track and ensure smooth adjustment.';