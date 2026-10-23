import type {
  LDProfile,
  LDMetricCard,
  ProgramOverview,
  ActivityItem,
  QuickAction,
  ChartDataPoint,
  CourseApproval,
  RecentCourse,
  CourseAttention,
  NisaInsight,
} from '../types/dashboard.types';
import { MOCK_DIVISION_PERFORMANCES } from '@/variants/c/pages/hr/dashboard/data/dashboard.mock';
import { daysAgo, daysFromNow, formatDate } from '../period';
import {
  LAST_QUARTER,
  MONTHS,
  NOW,
  completed,
  completion,
  enrolled,
  launched,
  newEnrollments,
  orgCompletionRate,
  type Scope,
} from './core.mock';

// ── L&D Profile ───────────────────────────────────────────────

export const MOCK_LD_PROFILE: LDProfile = {
  name: 'Diana Hartwell',
  role: 'Admin',
  position: 'HR manager',
  department: 'Learning & Development',
  phone: '+971 2 555 0148',
  email: 'diana@presight.com',
  location: 'Abu Dhabi',
  company: 'Presight',
  stats: {
    tenure: { value: 5, unit: 'Years' },
    programsManaged: 3,
    instructorsManaged: 6,
  },
};

// ── Programs ─────────────────────────────────────────────────
// Every date is relative to today. `risk` carries the attention flags that
// used to live in a separate "Programs needing attention" list.

const ends = (days: number) => ({ endsOn: daysFromNow(days), endDate: formatDate(daysFromNow(days)) });
const starts = (days: number) => ({ startDate: formatDate(daysAgo(days)) });

export const MOCK_PROGRAMS: ProgramOverview[] = [
  { kind: 'course', id: '0', name: 'Leadership Foundations', participants: 24, completionRate: 42, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', risk: 'Module 4 fail rate 58%', ...ends(29) },
  { kind: 'course', id: '1', name: 'Metabase 101',                                    participants: 16,  completionRate: 50,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '12 hours', ...ends(6) },
  { kind: 'course', id: '2', name: 'Mixpanel 101',                                    participants: 10,  completionRate: 23,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours', risk: 'Low completion after 4 weeks', riskFlag: 'low-completion', ...ends(24) },
  { kind: 'journey', id: '3', name: 'Data Literacy for Business',                      participants: 46,  completionRate: 62,  status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', ...starts(160), ...ends(40), modules: 5 },
  { kind: 'course', id: '4', name: 'Marketing Analytics & Performance Tracking',      participants: 28,  completionRate: 36,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', ...starts(90), ...ends(11) },
  { kind: 'course', id: '5', name: 'Digital Marketing Foundation',                    participants: 22,  completionRate: 10,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '15 hours' },
  { kind: 'journey', id: '6', name: 'Generative AI for Marketing Professionals',       participants: 50,  completionRate: 72,  status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', ...starts(120), ...ends(55) },
  { kind: 'course', id: '7', name: 'Social Media Marketing Trends',                   participants: 25,  completionRate: 80,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '8 hours' },
  { kind: 'course', id: '8', name: 'Becoming Irreplaceable in the Age of AI',         participants: 50,  completionRate: 86, status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', ...starts(200), ...ends(16) },
  { kind: 'course', id: '9', name: 'Prompting Bootcamp',                              participants: 50,  completionRate: 65,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', ...starts(75), ...ends(48) },
  { kind: 'journey', id: '10', name: 'Developing Organizational Culture & Leadership', participants: 12,  completionRate: 80,  status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', ...starts(60), ...ends(70) },
  { kind: 'journey', id: '11', name: 'Professional Development & Certifications: Data Analytics for Business Leaders', participants: 38, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '12', name: 'Customer Experience Excellence', participants: 24, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'journey', id: '13', name: 'Leadership Program: Building High-Performance Teams Across Regional Offices', participants: 31, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '14', name: 'SQL for Analysts', participants: 19, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'course', id: '15', name: 'Presentation Skills That Land With Senior Stakeholders and Executive Committees', participants: 27, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'journey', id: '16', name: 'Digital Transformation Path', participants: 44, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '17', name: 'Excel Power User', participants: 33, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours', risk: 'Rating dropped to 2.1/5', riskFlag: 'low-rating' },
  { kind: 'course', id: '18', name: 'Workplace Safety & Compliance 2026', participants: 58, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours', risk: '47% dropped off after module 2', riskFlag: 'high-dropoff' },
  { kind: 'journey', id: '19', name: 'New Manager Onboarding Journey', participants: 15, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '20', name: 'Negotiation Fundamentals', participants: 21, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '21', name: 'Cloud Basics for Non-Engineers', participants: 17, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'journey', id: '22', name: 'Customer Success Mastery: From First Call to Renewal and Expansion', participants: 26, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
];

/** Programs that are running (anything past planning): the Active programs KPI and card */
export function runningPrograms(programs: ProgramOverview[] = MOCK_PROGRAMS) {
  return programs.filter((p) => p.status !== 'planning');
}

// ── Metric Cards ─────────────────────────────────────────────
// All three are computed from the core figures and the program list.

const pct = (now: number, before: number) => Math.round(((now - before) / before) * 100);
const signed = (n: number) => `${n >= 0 ? '+' : ''}${n}`;

const enrolledAll = enrolled('all');
const completionAll = completion('all');
// Active programs a quarter ago: today's count minus the programs launched and
// completed since then
const netSinceLastQuarter =
  launched('all').slice(LAST_QUARTER + 1, NOW + 1).reduce((a, b) => a + b, 0) -
  completed('all').slice(LAST_QUARTER + 1, NOW + 1).reduce((a, b) => a + b, 0);
const participantsTrend = pct(enrolledAll[NOW], enrolledAll[NOW - 1]);
const completionTrend = Math.round(completionAll[NOW]) - Math.round(completionAll[LAST_QUARTER]);

/** Points the org completion rate moved since last quarter (KPI and Division card) */
export const ORG_COMPLETION_TREND = completionTrend;

export const MOCK_METRIC_CARDS: LDMetricCard[] = [
  {
    key: 'active-programs',
    title: 'Active programs',
    value: String(runningPrograms().length),
    trend: `${signed(netSinceLastQuarter)} vs last quarter`,
    trendPositive: netSinceLastQuarter >= 0,
  },
  {
    key: 'total-participants',
    title: 'Learning participants',
    hint: 'Unique trainees',
    value: String(enrolledAll[NOW]),
    trend: `${signed(participantsTrend)}% vs last month`,
    trendPositive: participantsTrend >= 0,
  },
  {
    key: 'completion-rate',
    title: 'Completion rate',
    value: `${orgCompletionRate()}%`,
    trend: `${signed(completionTrend)} pts vs last quarter`,
    trendPositive: completionTrend >= 0,
  },
];

// ── Program overview chart ───────────────────────────────────
// Course + Journey add up to All Program every month, by construction.

function chartData(scope: Scope): ChartDataPoint[] {
  const participants = newEnrollments(scope);
  const launchedPerMonth = launched(scope);
  const completedPerMonth = completed(scope);
  return MONTHS.map((month, i) => ({
    month,
    participants: participants[i],
    launched: launchedPerMonth[i],
    completed: completedPerMonth[i],
  }));
}

export const MOCK_CHART_DATA: ChartDataPoint[] = chartData('all');
export const MOCK_CHART_DATA_COURSE: ChartDataPoint[] = chartData('course');
export const MOCK_CHART_DATA_JOURNEY: ChartDataPoint[] = chartData('journey');

// ── Program overview insights ────────────────────────────────
// Written from the same chart data and program list, so every name and
// figure in them is on the page.

function overviewInsight(scope: Scope) {
  const data = chartData(scope).slice(0, NOW + 1);
  const peak = data.reduce((best, d) => (d.participants > best.participants ? d : best), data[0]);
  const total = (key: 'launched' | 'completed') => data.reduce((s, d) => s + d[key], 0);
  const programs = runningPrograms().filter((p) => scope === 'all' || p.kind === scope);
  const top = programs.reduce((best, p) => (p.completionRate > best.completionRate ? p : best), programs[0]);
  const peakLine = `${peak.month} brought ${peak.participants} new participants, the most this year.`;
  const topLine = `${top.name} leads at ${top.completionRate}% completion.`;
  return {
    short: `${peakLine} ${topLine}`,
    full: `${total('launched')} programs launched and ${total('completed')} completed from ${data[0].month} to ${data[data.length - 1].month}. ${peakLine} ${topLine}`,
  };
}

const INSIGHTS = { all: overviewInsight('all'), course: overviewInsight('course'), journey: overviewInsight('journey') };

export const MOCK_CHART_INSIGHT = INSIGHTS.all.full;
export const MOCK_CHART_INSIGHT_COURSE = INSIGHTS.course.full;
export const MOCK_CHART_INSIGHT_JOURNEY = INSIGHTS.journey.full;
/** One-line versions for the insight row under the chart */
export const MOCK_CHART_SHORT_INSIGHT: Record<Scope, string> = {
  all: INSIGHTS.all.short,
  course: INSIGHTS.course.short,
  journey: INSIGHTS.journey.short,
};

// ── NISA priority insights ───────────────────────────────────
// Built from the program list and the division data on the page.

const atRisk = runningPrograms().find((p) => p.risk && !p.riskFlag) ?? runningPrograms().find((p) => p.risk);
const lowestDivision = [...MOCK_DIVISION_PERFORMANCES].sort((a, b) => a.percentage - b.percentage)[0];
const orgRate = orgCompletionRate();

export const MOCK_NISA_INSIGHTS: NisaInsight[] = [
  ...(atRisk
    ? [{
        title: 'Course at risk',
        description: `${atRisk.name} is at ${atRisk.completionRate}% completion: ${atRisk.risk!.charAt(0).toLowerCase()}${atRisk.risk!.slice(1)}. Consider splitting the hardest module into two shorter ones.`,
        cta: 'Review module',
      }]
    : []),
  {
    title: 'Needs attention',
    description: `${lowestDivision.name} has the lowest completion rate at ${Math.round(lowestDivision.percentage)}%, ${orgRate - Math.round(lowestDivision.percentage)} pts below the org average. Consider a review with the division lead.`,
    cta: 'View division',
  },
  {
    title: 'Trainer rating',
    description: "Trainer Budi Santoso's last two events averaged 3.1/5.0, due to low engagement scores. Consider scheduling a review.",
    cta: 'View trainer',
  },
];

// ── Activity Feed ─────────────────────────────────────────────

export const MOCK_ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: '1',
    personName: 'Trainer Kevin',
    action: 'completed delivery of Leadership Module 5',
    timeAgo: '15 min',
    colorScheme: 'green',
  },
  {
    id: '2',
    personName: 'System',
    action: '42 new participants enrolled in Technical Upskilling',
    timeAgo: '1 hr',
    colorScheme: 'blue',
  },
  {
    id: '3',
    personName: 'Trainer Aisha',
    action: 'submitted post-training evaluation report',
    timeAgo: '2 hrs',
    colorScheme: 'purple',
  },
  {
    id: '4',
    personName: 'You',
    action: 'approved Project Management Basics program draft',
    timeAgo: '4 hrs',
    colorScheme: 'green',
  },
];

// ── Quick Actions ─────────────────────────────────────────────

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  { id: '1', label: 'New program',     iconName: 'Plus'      },
  { id: '2', label: 'Add trainer',     iconName: 'UserPlus'  },
  { id: '3', label: 'View reports',    iconName: 'BarChart3' },
  { id: '4', label: 'Announcement',    iconName: 'Bell'      },
];

// ── HR Approval Progress ──────────────────────────────────────

export const MOCK_COURSE_APPROVALS: CourseApproval[] = [
  {
    id: '1',
    programName: 'AI Ethics in Business',
    programType: 'Course',
    approvalId: 'CA-2026-0041',
    status: 'Under Review',
    submissionDate: daysAgo(2),
    latestActivity: 'Under review by HR Manager',
    latestActivityTime: '2 hrs ago',
  },
  {
    id: '2',
    programName: 'Marketing Analytics Fundamentals',
    programType: 'Course',
    approvalId: 'CA-2026-0042',
    status: 'Approved',
    submissionDate: daysAgo(4),
    latestActivity: 'Approved by HR Manager',
    latestActivityTime: '1 day ago',
  },
  {
    id: '3',
    programName: 'Cybersecurity Awareness Training',
    programType: 'Course',
    approvalId: 'CA-2026-0043',
    status: 'Pending Review',
    submissionDate: daysAgo(1),
    latestActivity: 'Submitted for review',
    latestActivityTime: '4 hrs ago',
  },
];

// ── Recent Programs ───────────────────────────────────────────

export const MOCK_RECENT_COURSES: RecentCourse[] = [
  {
    id: '1',
    kind: 'course',
    name: 'Data Analytics Fundamentals',
    type: 'launched',
    date: daysAgo(1),
    creator: 'Kevin Ramirez',
  },
  {
    id: '2',
    kind: 'course',
    name: 'Leadership Development Masterclass',
    type: 'updated',
    date: daysAgo(2),
    creator: 'Aisha Patel',
    version: 'Version 3',
  },
  {
    id: '3',
    kind: 'journey',
    name: 'Professional Development & Certifications: Data Analytics',
    type: 'launched',
    date: daysAgo(3),
    creator: 'Diana Hartwell',
  },
  {
    id: '4',
    kind: 'course',
    name: 'Technical Writing Essentials',
    type: 'launched',
    date: daysAgo(4),
    creator: 'Marcus Chen',
  },
  {
    id: '5',
    kind: 'journey',
    name: 'Leadership Program: Building High-Performance Teams Across Regional Offices',
    type: 'updated',
    date: daysAgo(5),
    creator: 'Liam Martinez',
    version: 'Version 2',
  },
  {
    id: '6',
    kind: 'course',
    name: 'Agile Project Management',
    type: 'updated',
    date: daysAgo(5),
    creator: 'Sofia Torres',
    version: 'Version 4',
  },
  {
    id: '7',
    kind: 'course',
    name: 'Presentation Skills That Land With Senior Stakeholders and Executive Committees',
    type: 'launched',
    date: daysAgo(7),
    creator: 'Rina Wijaya',
  },
  {
    id: '8',
    kind: 'journey',
    name: 'Customer Experience Excellence Path',
    type: 'updated',
    date: daysAgo(8),
    creator: 'Rina Wijaya',
    version: 'Version 2',
  },
  {
    id: '9',
    kind: 'course',
    name: 'SQL for Analysts',
    type: 'launched',
    date: daysAgo(10),
    creator: 'Kevin Brooks',
  },
  {
    id: '10',
    kind: 'journey',
    name: 'Digital Transformation Path',
    type: 'launched',
    date: daysAgo(12),
    creator: 'Olivia Johnson',
  },
  {
    id: '11',
    kind: 'course',
    name: 'Workplace Safety & Compliance 2026',
    type: 'updated',
    date: daysAgo(14),
    creator: 'Diana Hartwell',
    version: 'Version 5',
  },
  {
    id: '12',
    kind: 'course',
    name: 'Negotiation Fundamentals',
    type: 'launched',
    date: daysAgo(16),
    creator: 'Maria Gonzalez',
  },
  {
    id: '13',
    kind: 'journey',
    name: 'New Manager Onboarding Journey',
    type: 'updated',
    date: daysAgo(18),
    creator: 'Sarah Lee',
    version: 'Version 3',
  },
  {
    id: '14',
    kind: 'course',
    name: 'Cloud Basics for Non-Engineers',
    type: 'launched',
    date: daysAgo(20),
    creator: 'Kevin Ramirez',
  },
  {
    id: '15',
    kind: 'journey',
    name: 'Customer Success Mastery: From First Call to Renewal and Expansion',
    type: 'launched',
    date: daysAgo(22),
    creator: 'Aisha Patel',
  },
  {
    id: '16',
    kind: 'course',
    name: 'Excel Power User',
    type: 'updated',
    date: daysAgo(24),
    creator: 'Marcus Chen',
    version: 'Version 2',
  },
];

// ── Courses Needing Attention ────────────────────────────────
// Derived from the risk flags on MOCK_PROGRAMS (the card is no longer on Home).

export const MOCK_COURSES_ATTENTION: CourseAttention[] = MOCK_PROGRAMS
  .filter((p) => p.riskFlag)
  .map((p) => ({
    id: p.id,
    name: p.name,
    flag: p.riskFlag!,
    value: `${p.completionRate}%`,
    description: p.risk!,
  }));
