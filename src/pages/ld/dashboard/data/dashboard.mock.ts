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
} from '../types/dashboard.types';

// ── L&D Profile ───────────────────────────────────────────────

export const MOCK_LD_PROFILE: LDProfile = {
  name: 'Diana Hartwell',
  role: 'Admin',
  position: 'HR Manager',
  department: 'Learning & Development',
  phone: '+62 123 4567 8900',
  email: 'diana@presight.com',
  location: 'Jakarta',
  company: 'Bright Company',
  stats: {
    tenure: { value: 5, unit: 'Years' },
    programsManaged: 3,
    instructorsManaged: 6,
  },
};

// ── Metric Cards ─────────────────────────────────────────────

export const MOCK_METRIC_CARDS: LDMetricCard[] = [
  {
    key: 'active-programs',
    title: 'Active Programs',
    value: '15',
    trend: '+3 this quarter',
    trendPositive: true,
  },
  {
    key: 'total-participants',
    title: 'Learning Participant',
    value: '309',
    trend: '+18% this month',
    trendPositive: true,
  },
  {
    key: 'completion-rate',
    title: 'Completion Rate',
    value: '80%',
    trend: '+5% vs last quarter',
    trendPositive: true,
  },
];

// ── AI Insight ─────────────────────────────────────────────

export const MOCK_CHART_INSIGHT =
  'Leadership Development program has the highest ROI at 94% completion. Technical Upskilling shows a 28% increase in participant satisfaction. Recommend expanding the Digital Literacy cohort by 20 seats next month.';

// ── Program Overview ──────────────────────────────────────────

export const MOCK_PROGRAMS: ProgramOverview[] = [
  { kind: 'course', id: '1', name: 'Metabase 101',                                    participants: 16,  completionRate: 50,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '12 hours' },
  { kind: 'course', id: '2', name: 'Mixpanel 101',                                    participants: 10,  completionRate: 23,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'journey', id: '3', name: 'Data Literacy for Business',                      participants: 46,  completionRate: 62,  status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 15, 2026', endDate: 'Apr 30, 2026' },
  { kind: 'course', id: '4', name: 'Marketing Analytics & Performance Tracking',      participants: 28,  completionRate: 36,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 1, 2026', endDate: 'May 15, 2026' },
  { kind: 'course', id: '5', name: 'Digital Marketing Foundation',                    participants: 22,  completionRate: 10,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '15 hours' },
  { kind: 'journey', id: '6', name: 'Generative AI for Marketing Professionals',       participants: 50,  completionRate: 72,  status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 20, 2026', endDate: 'Mar 31, 2026' },
  { kind: 'course', id: '7', name: 'Social Media Marketing Trends',                   participants: 25,  completionRate: 80,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '8 hours' },
  { kind: 'course', id: '8', name: 'Becoming Irreplaceable in the Age of AI',         participants: 50,  completionRate: 100, status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', startDate: 'Nov 1, 2025', endDate: 'Feb 28, 2026' },
  { kind: 'course', id: '9', name: 'Prompting Bootcamp',                              participants: 50,  completionRate: 65,  status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 10, 2026', endDate: 'May 20, 2026' },
  { kind: 'journey', id: '10', name: 'Developing Organizational Culture & Leadership', participants: 12,  completionRate: 80,  status: 'active', instructorsCount: 2, type: 'Skill Training', mode: 'Blended Learning', startDate: 'Mar 1, 2026', endDate: 'Jun 15, 2026' },
  { kind: 'journey', id: '11', name: 'Professional Development & Certifications: Data Analytics for Business Leaders', participants: 38, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '12', name: 'Customer Experience Excellence', participants: 24, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'journey', id: '13', name: 'Leadership Program: Building High-Performance Teams Across Regional Offices', participants: 31, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '14', name: 'SQL for Analysts', participants: 19, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'course', id: '15', name: 'Presentation Skills That Land With Senior Stakeholders and Executive Committees', participants: 27, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'journey', id: '16', name: 'Digital Transformation Path', participants: 44, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '17', name: 'Excel Power User', participants: 33, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'course', id: '18', name: 'Workplace Safety & Compliance 2026', participants: 58, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'journey', id: '19', name: 'New Manager Onboarding Journey', participants: 15, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '20', name: 'Negotiation Fundamentals', participants: 21, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
  { kind: 'course', id: '21', name: 'Cloud Basics for Non-Engineers', participants: 17, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Self Learning', duration: '10 hours' },
  { kind: 'journey', id: '22', name: 'Customer Success Mastery: From First Call to Renewal and Expansion', participants: 26, completionRate: 40, status: 'active', instructorsCount: 1, type: 'Skill Training', mode: 'Blended Learning', duration: '10 hours' },
];

// ── Chart Data ───────────────────────────────────────────────

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { month: 'Jan', launched: 3, completed: 2, participants: 12  },
  { month: 'Feb', launched: 4, completed: 2, participants: 15  },
  { month: 'Mar', launched: 5, completed: 3, participants: 20  },
  { month: 'Apr', launched: 3, completed: 3, participants: 18  },
  { month: 'May', launched: 5, completed: 4, participants: 25  },
  { month: 'Jun', launched: 4, completed: 4, participants: 28  },
  { month: 'Jul', launched: 6, completed: 5, participants: 34  },
  { month: 'Aug', launched: 3, completed: 3, participants: 22  },
  { month: 'Sep', launched: 4, completed: 4, participants: 30  },
  { month: 'Oct', launched: 5, completed: 5, participants: 36  },
  { month: 'Nov', launched: 4, completed: 4, participants: 31  },
  { month: 'Dec', launched: 6, completed: 5, participants: 38  },
];

// Program Overview splits the same year into its two program types, so the
// All Program tab is exactly the sum of the Course and Journey tabs.

export const MOCK_CHART_DATA_COURSE: ChartDataPoint[] = [
  { month: 'Jan', launched: 2, completed: 1, participants: 8  },
  { month: 'Feb', launched: 3, completed: 1, participants: 10 },
  { month: 'Mar', launched: 3, completed: 2, participants: 13 },
  { month: 'Apr', launched: 2, completed: 2, participants: 12 },
  { month: 'May', launched: 3, completed: 3, participants: 16 },
  { month: 'Jun', launched: 3, completed: 3, participants: 18 },
  { month: 'Jul', launched: 4, completed: 3, participants: 22 },
  { month: 'Aug', launched: 2, completed: 2, participants: 14 },
  { month: 'Sep', launched: 3, completed: 3, participants: 20 },
  { month: 'Oct', launched: 3, completed: 3, participants: 23 },
  { month: 'Nov', launched: 3, completed: 3, participants: 20 },
  { month: 'Dec', launched: 4, completed: 3, participants: 25 },
];

export const MOCK_CHART_DATA_JOURNEY: ChartDataPoint[] = [
  { month: 'Jan', launched: 1, completed: 1, participants: 4  },
  { month: 'Feb', launched: 1, completed: 1, participants: 5  },
  { month: 'Mar', launched: 2, completed: 1, participants: 7  },
  { month: 'Apr', launched: 1, completed: 1, participants: 6  },
  { month: 'May', launched: 2, completed: 1, participants: 9  },
  { month: 'Jun', launched: 1, completed: 1, participants: 10 },
  { month: 'Jul', launched: 2, completed: 2, participants: 12 },
  { month: 'Aug', launched: 1, completed: 1, participants: 8  },
  { month: 'Sep', launched: 1, completed: 1, participants: 10 },
  { month: 'Oct', launched: 2, completed: 2, participants: 13 },
  { month: 'Nov', launched: 1, completed: 1, participants: 11 },
  { month: 'Dec', launched: 2, completed: 2, participants: 13 },
];

export const MOCK_CHART_INSIGHT_COURSE =
  'Courses carry two-thirds of the year: 35 launched and 29 completed. Prompting Bootcamp and Social Media Marketing Trends drive the December peak. Recommend keeping the December cadence and adding one compliance course in Q1.';

export const MOCK_CHART_INSIGHT_JOURNEY =
  'Journeys stay steady at one to two launches a month, but completion trails by a month because each journey runs several courses. Leadership Development leads at 94% completion. Recommend starting the next journey cohort in October, when participation peaks.';

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
  { id: '1', label: 'New Program',     iconName: 'Plus'      },
  { id: '2', label: 'Add Trainer',     iconName: 'UserPlus'  },
  { id: '3', label: 'View Reports',    iconName: 'BarChart3' },
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
    submissionDate: '2026-03-10',
    latestActivity: 'Under review by HR Manager',
    latestActivityTime: '2 hrs ago',
  },
  {
    id: '2',
    programName: 'Marketing Analytics Fundamentals',
    programType: 'Course',
    approvalId: 'CA-2026-0042',
    status: 'Approved',
    submissionDate: '2026-03-08',
    latestActivity: 'Approved by HR Manager',
    latestActivityTime: '1 day ago',
  },
  {
    id: '3',
    programName: 'Cybersecurity Awareness Training',
    programType: 'Course',
    approvalId: 'CA-2026-0043',
    status: 'Pending Review',
    submissionDate: '2026-03-12',
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
    date: '2026-03-03',
    creator: 'Kevin Ramirez',
  },
  {
    id: '2',
    kind: 'course',
    name: 'Leadership Development Masterclass',
    type: 'updated',
    date: '2026-03-02',
    creator: 'Aisha Patel',
    version: 'Version 3',
  },
  {
    id: '3',
    kind: 'journey',
    name: 'Professional Development & Certifications: Data Analytics',
    type: 'launched',
    date: '2026-03-01',
    creator: 'Diana Hartwell',
  },
  {
    id: '4',
    kind: 'course',
    name: 'Technical Writing Essentials',
    type: 'launched',
    date: '2026-02-28',
    creator: 'Marcus Chen',
  },
  {
    id: '5',
    kind: 'journey',
    name: 'Leadership Program: Building High-Performance Teams Across Regional Offices',
    type: 'updated',
    date: '2026-02-27',
    creator: 'Liam Martinez',
    version: 'Version 2',
  },
  {
    id: '6',
    kind: 'course',
    name: 'Agile Project Management',
    type: 'updated',
    date: '2026-02-27',
    creator: 'Sofia Torres',
    version: 'Version 4',
  },
  {
    id: '7',
    kind: 'course',
    name: 'Presentation Skills That Land With Senior Stakeholders and Executive Committees',
    type: 'launched',
    date: '2026-02-25',
    creator: 'Rina Wijaya',
  },
  {
    id: '8',
    kind: 'journey',
    name: 'Customer Experience Excellence Path',
    type: 'updated',
    date: '2026-02-24',
    creator: 'Rina Wijaya',
    version: 'Version 2',
  },
  {
    id: '9',
    kind: 'course',
    name: 'SQL for Analysts',
    type: 'launched',
    date: '2026-02-22',
    creator: 'Kevin Brooks',
  },
  {
    id: '10',
    kind: 'journey',
    name: 'Digital Transformation Path',
    type: 'launched',
    date: '2026-02-20',
    creator: 'Olivia Johnson',
  },
  {
    id: '11',
    kind: 'course',
    name: 'Workplace Safety & Compliance 2026',
    type: 'updated',
    date: '2026-02-18',
    creator: 'Diana Hartwell',
    version: 'Version 5',
  },
  {
    id: '12',
    kind: 'course',
    name: 'Negotiation Fundamentals',
    type: 'launched',
    date: '2026-02-16',
    creator: 'Maria Gonzalez',
  },
  {
    id: '13',
    kind: 'journey',
    name: 'New Manager Onboarding Journey',
    type: 'updated',
    date: '2026-02-14',
    creator: 'Sarah Lee',
    version: 'Version 3',
  },
  {
    id: '14',
    kind: 'course',
    name: 'Cloud Basics for Non-Engineers',
    type: 'launched',
    date: '2026-02-12',
    creator: 'Kevin Ramirez',
  },
  {
    id: '15',
    kind: 'journey',
    name: 'Customer Success Mastery: From First Call to Renewal and Expansion',
    type: 'launched',
    date: '2026-02-10',
    creator: 'Aisha Patel',
  },
  {
    id: '16',
    kind: 'course',
    name: 'Excel Power User',
    type: 'updated',
    date: '2026-02-08',
    creator: 'Marcus Chen',
    version: 'Version 2',
  },
];

// ── Courses Needing Attention ────────────────────────────────

export const MOCK_COURSES_ATTENTION: CourseAttention[] = [
  {
    id: '1',
    name: 'Communication Skills Workshop',
    flag: 'low-completion',
    value: '23%',
    description: 'Only 23% completion rate after 4 weeks',
  },
  {
    id: '2',
    name: 'Advanced Excel Training',
    flag: 'low-rating',
    value: '2.1/5',
    description: 'Average rating dropped below threshold',
  },
  {
    id: '3',
    name: 'Compliance & Ethics Module',
    flag: 'high-dropoff',
    value: '47%',
    description: '47% of trainees dropped off after Module 2',
  },
];