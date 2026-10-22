// ============================================================
// Analytics > Learning program (Option A)
// Visual pass A1–A4: the same cards and numbers as before, drawn with Home's
// pieces: KPI cards, hairline rows, round chips, one blue, the shared license
// card and the one-line NISA insight.
// ============================================================

import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { DashboardLayout } from '@/variants/a/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { ProgramScopeTabs, PROGRAM_TYPE_TABS, FadeValue, type ScopeTab } from '@/variants/a/pages/ld/dashboard/components/ProgramScopeTabs';
import { ATTENTION, CardHeader, IconCircle, Trend } from '@/variants/a/components/ui/kit';
import { ChartTooltipCard, LegendMark } from '@/variants/a/components/ui/chart';
import { LearningProgressFunnel } from './components/LearningProgressFunnel';
import { DashboardLicenseUtilization, type License } from '@/variants/a/pages/hr/dashboard/components/DashboardLicenseUtilization';
import { revealContainer, revealItem } from '@/variants/a/motion';
import { OA_COLORS } from '@/variants/a/theme';
import {
  BookOpen, CheckCircle2, Star, Search, Users, Trophy, TrendingDown, CalendarClock,
  ShieldAlert, RefreshCw, GraduationCap, MessageSquareText, ChevronDown, ArrowUpDown, ChevronUp,
  Layers, Zap, ChevronLeft, ChevronRight, Loader2, Route,
} from '@/variants/a/icons';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

// ── Program Type Copy ────────────────────────────────────────

type ProgramType = 'course' | 'journey';
type ProgramMode = 'Self Learning' | 'Blended Learning';

// Every course/journey word on the page reads from here, so copy follows the active tab
const PROGRAM_NOUN = {
  course:  { one: 'course',  many: 'courses',  One: 'Course',  Many: 'Courses',  icon: BookOpen },
  journey: { one: 'journey', many: 'journeys', One: 'Journey', Many: 'Journeys', icon: Route },
};
type ProgramNoun = (typeof PROGRAM_NOUN)[ProgramType];

type ProgramRow = {
  id: string; name: string; category: string; type: string; mode: ProgramMode;
  duration?: string; startDate?: string; endDate?: string;
  enrolled: number; completion: number; rating: number; status: 'active';
};
type NotStartedRow = {
  id: string; name: string; category: string; type: string; mode: ProgramMode;
  duration?: string; startDate?: string; endDate?: string;
  assignedTo: number; assignedDate: string; daysIdle: number;
};
type FeedbackRow = {
  id: string; name: string; program: string; type: string; mode: ProgramMode;
  startDate?: string; endDate?: string; programDuration?: string;
  rating: number; feedback: string; relevancy: number; duration: number; submittedDate: string;
};

/** Self-paced programs show their length, blended ones their run dates. */
function programSchedule(p: { mode: ProgramMode; duration?: string; startDate?: string; endDate?: string }) {
  return p.mode === 'Self Learning'
    ? p.duration ?? '—'
    : `${p.startDate ?? '—'} – ${p.endDate ?? '—'}`;
}

// ── Mock Data: Courses ───────────────────────────────────────

const COURSE_KPI = {
  total:      { value: '64',  change: +10 },
  avgEnroll:  { value: '88',  change: +8  },
  completion: { value: '76%', change: +4  },
  rating:     { value: '4.5', change: +2  },
  score:      { value: '81',  change: +5  },
};

const COURSE_MODE_BREAKDOWN = [
  { mode: 'Self Learning' as const,    active: 18, inactive: 10, completed: 0 },
  { mode: 'Blended Learning' as const, active: 24, inactive: 12, completed: 8 },
];

const COURSE_MODE_PIE = [
  { name: 'Self Learning',    value: 28, color: OA_COLORS.primary200 },
  { name: 'Blended Learning', value: 36, color: OA_COLORS.primary },
];

const COURSE_TABLE: ProgramRow[] = [
  { id: '1',  name: 'Metabase 101',                                    category: 'Digital',     type: 'Skill Training', mode: 'Self Learning',    duration: '12 hours',                                enrolled: 16,  completion: 50,  rating: 4.5, status: 'active' },
  { id: '2',  name: 'Mixpanel 101',                                    category: 'Digital',     type: 'Skill Training', mode: 'Self Learning',    duration: '10 hours',                                enrolled: 10,  completion: 23,  rating: 4.3, status: 'active' },
  { id: '3',  name: 'Data Literacy for Business',                      category: 'Digital',     type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 15, 2026', endDate: 'Apr 30, 2026', enrolled: 46,  completion: 62,  rating: 4.7, status: 'active' },
  { id: '4',  name: 'Marketing Analytics & Performance Tracking',      category: 'Marketing',   type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 1, 2026',  endDate: 'May 15, 2026', enrolled: 28,  completion: 36,  rating: 4.4, status: 'active' },
  { id: '5',  name: 'Digital Marketing Foundation',                    category: 'Marketing',   type: 'Skill Training', mode: 'Self Learning',    duration: '15 hours',                                enrolled: 22,  completion: 10,  rating: 4.2, status: 'active' },
  { id: '6',  name: 'Generative AI for Marketing Professionals',       category: 'Marketing',   type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 20, 2026', endDate: 'Mar 31, 2026', enrolled: 50,  completion: 72,  rating: 4.8, status: 'active' },
  { id: '7',  name: 'Social Media Marketing Trends',                   category: 'Marketing',   type: 'Skill Training', mode: 'Self Learning',    duration: '8 hours',                                 enrolled: 25,  completion: 80,  rating: 4.6, status: 'active' },
  { id: '8',  name: 'Becoming Irreplaceable in the Age of AI',         category: 'Leadership',  type: 'Skill Training', mode: 'Blended Learning', startDate: 'Nov 1, 2025',  endDate: 'Feb 28, 2026', enrolled: 50,  completion: 100, rating: 4.9, status: 'active' },
  { id: '9',  name: 'Prompting Bootcamp',                              category: 'Technical',   type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 10, 2026', endDate: 'May 20, 2026', enrolled: 50,  completion: 65,  rating: 4.6, status: 'active' },
  { id: '10', name: 'Developing Organizational Culture & Leadership',  category: 'Leadership',  type: 'Skill Training', mode: 'Blended Learning', startDate: 'Mar 1, 2026',  endDate: 'Jun 15, 2026', enrolled: 12,  completion: 80,  rating: 4.7, status: 'active' },
];

const NOT_STARTED_COURSES: NotStartedRow[] = [
  { id: 'ns1', name: 'Strategic Thinking Workshop',       category: 'Leadership',  type: 'Skill Training', mode: 'Blended Learning', startDate: 'Mar 10, 2026', endDate: 'Apr 10, 2026', assignedTo: 38,  assignedDate: 'Feb 18, 2026', daysIdle: 15 },
  { id: 'ns2', name: 'Crisis Management Essentials',      category: 'Management',  type: 'Skill Training', mode: 'Self Learning',    duration: '8 hours',                                assignedTo: 24,  assignedDate: 'Feb 22, 2026', daysIdle: 11 },
  { id: 'ns3', name: 'Advanced Negotiation Techniques',   category: 'Soft Skills', type: 'Skill Training', mode: 'Blended Learning', startDate: 'Mar 15, 2026', endDate: 'Apr 05, 2026', assignedTo: 16,  assignedDate: 'Feb 25, 2026', daysIdle: 8  },
  { id: 'ns4', name: 'Cybersecurity Awareness Training',  category: 'Compliance',  type: 'Compliance',     mode: 'Self Learning',    duration: '4 hours',                                assignedTo: 52,  assignedDate: 'Mar 01, 2026', daysIdle: 4  },
  { id: 'ns5', name: 'AI & Machine Learning Basics',      category: 'Technical',   type: 'Skill Training', mode: 'Self Learning',    duration: '12 hours',                               assignedTo: 30,  assignedDate: 'Mar 03, 2026', daysIdle: 2  },
];

const COURSE_FEEDBACK: FeedbackRow[] = [
  { id: 'fb1',  name: 'Sarah Chen',       program: 'Leadership Development Masterclass', type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 10, 2026', endDate: 'Mar 10, 2026', rating: 5, feedback: 'Extremely insightful, changed how I approach team dynamics.',          relevancy: 5, duration: 4, submittedDate: 'Mar 05, 2026' },
  { id: 'fb2',  name: 'James Wilson',      program: 'Advanced Python for Data Science',   type: 'Skill Training', mode: 'Self Learning',    programDuration: '12 hours',                                    rating: 4, feedback: 'Great content but some sections felt rushed toward the end.',         relevancy: 4, duration: 3, submittedDate: 'Mar 04, 2026' },
  { id: 'fb3',  name: 'Emily Park',        program: 'Effective Communication Skills',      type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 03, 2026', endDate: 'Mar 03, 2026', rating: 5, feedback: 'Very practical exercises, I use these techniques daily now.',         relevancy: 5, duration: 5, submittedDate: 'Mar 04, 2026' },
  { id: 'fb4',  name: 'Michael Torres',    program: 'Regulatory Compliance 2026',          type: 'Compliance',     mode: 'Self Learning',    programDuration: '4 hours',                                     rating: 3, feedback: 'Necessary but could be more engaging with real-world examples.',     relevancy: 3, duration: 2, submittedDate: 'Mar 03, 2026' },
  { id: 'fb5',  name: 'David Kim',         program: 'Digital Literacy Fundamentals',       type: 'Skill Training', mode: 'Self Learning',    programDuration: '6 hours',                                     rating: 4, feedback: 'Good foundational course, perfect for beginners in our team.',       relevancy: 4, duration: 4, submittedDate: 'Mar 03, 2026' },
  { id: 'fb6',  name: 'Ava Thompson',      program: 'Customer Service Excellence',         type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 20, 2026', endDate: 'Feb 20, 2026', rating: 5, feedback: 'Loved the role-play scenarios, very realistic and actionable.',      relevancy: 5, duration: 5, submittedDate: 'Mar 02, 2026' },
  { id: 'fb7',  name: 'Daniel Lee',        program: 'Cloud Architecture Essentials',       type: 'Skill Training', mode: 'Self Learning',    programDuration: '10 hours',                                    rating: 3, feedback: 'Decent overview but lacked depth on multi-cloud strategies.',        relevancy: 3, duration: 3, submittedDate: 'Mar 01, 2026' },
  { id: 'fb8',  name: 'Olivia Martinez',   program: 'Data Analytics Bootcamp',             type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 01, 2026', endDate: 'Mar 01, 2026', rating: 4, feedback: 'Hands-on projects were the highlight, very well structured.',        relevancy: 4, duration: 2, submittedDate: 'Feb 28, 2026' },
  { id: 'fb9',  name: 'Ethan Brown',       program: 'Leadership Development Masterclass', type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 10, 2026', endDate: 'Mar 10, 2026', rating: 4, feedback: 'Solid program, would appreciate more case studies from our industry.', relevancy: 4, duration: 4, submittedDate: 'Feb 27, 2026' },
  { id: 'fb10', name: 'Sophia Garcia',     program: 'Effective Communication Skills',      type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 03, 2026', endDate: 'Mar 03, 2026', rating: 5, feedback: 'Best course I have taken this year, highly recommend to everyone.',  relevancy: 5, duration: 5, submittedDate: 'Feb 26, 2026' },
];

const COURSE_LAST_UPDATED = [
  { name: 'Regulatory Compliance 2026',          date: 'Mar 04, 2026', time: '14:32', type: 'Content' },
  { name: 'Advanced Python for Data Science',    date: 'Mar 03, 2026', time: '09:15', type: 'Structure' },
  { name: 'Leadership Development Masterclass',  date: 'Mar 02, 2026', time: '16:48', type: 'Assessment' },
  { name: 'Digital Literacy Fundamentals',       date: 'Mar 01, 2026', time: '11:22', type: 'Content' },
  { name: 'Customer Service Excellence',         date: 'Feb 28, 2026', time: '08:05', type: 'Structure' },
];

// ── Mock Data: Journeys ──────────────────────────────────────
// Fewer, longer programs: higher enrollment per journey, slightly lower completion

const JOURNEY_KPI = {
  total:      { value: '18',  change: +6  },
  avgEnroll:  { value: '142', change: +12 },
  completion: { value: '68%', change: +3  },
  rating:     { value: '4.6', change: +4  },
  score:      { value: '78',  change: +3  },
};

const JOURNEY_MODE_BREAKDOWN = [
  { mode: 'Self Learning' as const,    active: 5, inactive: 2, completed: 0 },
  { mode: 'Blended Learning' as const, active: 8, inactive: 3, completed: 2 },
];

const JOURNEY_MODE_PIE = [
  { name: 'Self Learning',    value: 7,  color: OA_COLORS.primary200 },
  { name: 'Blended Learning', value: 11, color: OA_COLORS.primary },
];

const JOURNEY_TABLE: ProgramRow[] = [
  { id: 'j1', name: 'Professional Development & Certifications: Data Analytics', category: 'Digital',          type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 6, 2026',  endDate: 'Jun 30, 2026', enrolled: 186, completion: 64, rating: 4.7, status: 'active' },
  { id: 'j2', name: 'Leadership Program: Marketing Division',                    category: 'Leadership',       type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 2, 2026',  endDate: 'Jul 31, 2026', enrolled: 72,  completion: 58, rating: 4.6, status: 'active' },
  { id: 'j3', name: 'Customer Experience Excellence Path',                       category: 'Customer Service', type: 'Skill Training', mode: 'Self Learning',    duration: '36 hours',                                enrolled: 214, completion: 81, rating: 4.8, status: 'active' },
  { id: 'j4', name: 'Digital Transformation Path',                               category: 'Digital',          type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 20, 2026', endDate: 'May 29, 2026', enrolled: 158, completion: 69, rating: 4.5, status: 'active' },
  { id: 'j5', name: 'New Manager Onboarding Journey',                            category: 'Management',       type: 'Onboarding',     mode: 'Self Learning',    duration: '20 hours',                                enrolled: 64,  completion: 92, rating: 4.9, status: 'active' },
  { id: 'j6', name: 'Data Storytelling & Visualisation Path',                    category: 'Digital',          type: 'Skill Training', mode: 'Self Learning',    duration: '28 hours',                                enrolled: 118, completion: 47, rating: 4.4, status: 'active' },
  { id: 'j7', name: 'Sales Enablement Journey',                                  category: 'Sales',            type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 16, 2026', endDate: 'Jun 12, 2026', enrolled: 96,  completion: 55, rating: 4.3, status: 'active' },
  { id: 'j8', name: 'Compliance & Ethics Essentials Path',                       category: 'Compliance',       type: 'Compliance',     mode: 'Self Learning',    duration: '14 hours',                                enrolled: 240, completion: 86, rating: 4.2, status: 'active' },
];

const NOT_STARTED_JOURNEYS: NotStartedRow[] = [
  { id: 'nj1', name: 'Executive Presence Journey',            category: 'Leadership', type: 'Skill Training', mode: 'Blended Learning', startDate: 'Apr 6, 2026',  endDate: 'Jul 31, 2026', assignedTo: 22, assignedDate: 'Feb 16, 2026', daysIdle: 17 },
  { id: 'nj2', name: 'Product Management Fundamentals Path',  category: 'Product',    type: 'Skill Training', mode: 'Self Learning',    duration: '30 hours',                                assignedTo: 45, assignedDate: 'Feb 21, 2026', daysIdle: 12 },
  { id: 'nj3', name: 'Hybrid Team Leadership Journey',        category: 'Management', type: 'Skill Training', mode: 'Blended Learning', startDate: 'Apr 13, 2026', endDate: 'Jul 10, 2026', assignedTo: 18, assignedDate: 'Feb 26, 2026', daysIdle: 7  },
  { id: 'nj4', name: 'Information Security Awareness Path',   category: 'Compliance', type: 'Compliance',     mode: 'Self Learning',    duration: '10 hours',                                assignedTo: 64, assignedDate: 'Mar 02, 2026', daysIdle: 3  },
];

const JOURNEY_FEEDBACK: FeedbackRow[] = [
  { id: 'jfb1', name: 'Sarah Chen',       program: 'Leadership Program: Marketing Division',                    type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 2, 2026',  endDate: 'Jul 31, 2026', rating: 5, feedback: 'The cohort sessions tied every stage together, great mix of theory and practice.', relevancy: 5, duration: 4, submittedDate: 'Mar 05, 2026' },
  { id: 'jfb2', name: 'James Wilson',     program: 'Professional Development & Certifications: Data Analytics', type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 6, 2026',  endDate: 'Jun 30, 2026', rating: 4, feedback: 'Clear path to certification, though the SQL stage needs more practice labs.',     relevancy: 5, duration: 3, submittedDate: 'Mar 04, 2026' },
  { id: 'jfb3', name: 'Emily Park',       program: 'Customer Experience Excellence Path',                       type: 'Skill Training', mode: 'Self Learning',    programDuration: '36 hours',                                    rating: 5, feedback: 'Each step builds on the last, I could apply it with customers right away.',      relevancy: 5, duration: 5, submittedDate: 'Mar 04, 2026' },
  { id: 'jfb4', name: 'Michael Torres',   program: 'Compliance & Ethics Essentials Path',                       type: 'Compliance',     mode: 'Self Learning',    programDuration: '14 hours',                                    rating: 3, feedback: 'Useful, but the later modules repeat a lot of the earlier ones.',                relevancy: 3, duration: 2, submittedDate: 'Mar 03, 2026' },
  { id: 'jfb5', name: 'David Kim',        program: 'New Manager Onboarding Journey',                            type: 'Onboarding',     mode: 'Self Learning',    programDuration: '20 hours',                                    rating: 5, feedback: 'Exactly what I needed in my first month as a team lead.',                        relevancy: 5, duration: 5, submittedDate: 'Mar 03, 2026' },
  { id: 'jfb6', name: 'Ava Thompson',     program: 'Digital Transformation Path',                               type: 'Skill Training', mode: 'Blended Learning', startDate: 'Jan 20, 2026', endDate: 'May 29, 2026', rating: 4, feedback: 'Strong case studies, but the pacing between stages felt a bit uneven.',          relevancy: 4, duration: 3, submittedDate: 'Mar 02, 2026' },
  { id: 'jfb7', name: 'Daniel Lee',       program: 'Data Storytelling & Visualisation Path',                    type: 'Skill Training', mode: 'Self Learning',    programDuration: '28 hours',                                    rating: 3, feedback: 'Good dashboard module, but the path is long to finish alongside daily work.',   relevancy: 4, duration: 2, submittedDate: 'Mar 01, 2026' },
  { id: 'jfb8', name: 'Olivia Martinez',  program: 'Sales Enablement Journey',                                  type: 'Skill Training', mode: 'Blended Learning', startDate: 'Feb 16, 2026', endDate: 'Jun 12, 2026', rating: 4, feedback: 'Role-play stages were the highlight, would love more product deep-dives.',      relevancy: 4, duration: 4, submittedDate: 'Feb 28, 2026' },
];

const JOURNEY_LAST_UPDATED = [
  { name: 'Digital Transformation Path',                               date: 'Mar 04, 2026', time: '10:12', type: 'Structure' },
  { name: 'Professional Development & Certifications: Data Analytics', date: 'Mar 03, 2026', time: '15:40', type: 'Assessment' },
  { name: 'New Manager Onboarding Journey',                            date: 'Mar 02, 2026', time: '09:05', type: 'Content' },
  { name: 'Leadership Program: Marketing Division',                    date: 'Mar 01, 2026', time: '13:27', type: 'Structure' },
  { name: 'Customer Experience Excellence Path',                       date: 'Feb 27, 2026', time: '17:50', type: 'Content' },
];

const PROGRAM_DATA = {
  course: {
    kpi: COURSE_KPI, modeBreakdown: COURSE_MODE_BREAKDOWN, modePie: COURSE_MODE_PIE, table: COURSE_TABLE,
    notStarted: NOT_STARTED_COURSES, feedback: COURSE_FEEDBACK, lastUpdated: COURSE_LAST_UPDATED,
  },
  journey: {
    kpi: JOURNEY_KPI, modeBreakdown: JOURNEY_MODE_BREAKDOWN, modePie: JOURNEY_MODE_PIE, table: JOURNEY_TABLE,
    notStarted: NOT_STARTED_JOURNEYS, feedback: JOURNEY_FEEDBACK, lastUpdated: JOURNEY_LAST_UPDATED,
  },
};

// ── Shared Mock Data (not program-type specific) ─────────────

const SOURCE_MAPPING = [
  { id: 'l1', platform: 'LinkedIn Learning', purchased: 200, active: 168, utilization: 84, color: OA_COLORS.primary },
  { id: 'l2', platform: "O'Reilly",          purchased: 80,  active: 52,  utilization: 65, color: OA_COLORS.primary300 },
  { id: 'l3', platform: 'MS Learn',          purchased: 300, active: 245, utilization: 82, color: OA_COLORS.primary400 },
  { id: 'l4', platform: 'Coursera',          purchased: 150, active: 89,  utilization: 59, color: OA_COLORS.primary200 },
];
const EXPIRED_CERTIFICATIONS = [
  { id: 'ec1', name: 'AWS Solutions Architect',      holder: 'James Wilson',     expiredDate: 'Jan 15, 2026', daysExpired: 49 },
  { id: 'ec2', name: 'PMP Certification',            holder: 'Sarah Chen',       expiredDate: 'Feb 01, 2026', daysExpired: 32 },
  { id: 'ec3', name: 'Google Cloud Professional',    holder: 'Michael Torres',   expiredDate: 'Feb 10, 2026', daysExpired: 23 },
  { id: 'ec4', name: 'CISSP Security',               holder: 'Emily Park',       expiredDate: 'Feb 20, 2026', daysExpired: 13 },
  { id: 'ec5', name: 'Scrum Master (CSM)',           holder: 'David Kim',        expiredDate: 'Mar 01, 2026', daysExpired: 4  },
];

// ── Display helpers (data values stay as they are) ───────────

/** Same words as Home */
const modeLabel = (m: ProgramMode) => (m === 'Self Learning' ? 'Self-paced' : 'Blended');
const typeLabel = (t: string) => (t === 'Skill Training' ? 'Skill training' : t);

/** Blended is the deep blue, self-paced the pale one (as in the learning funnel) */
const MODE_COLOR: Record<ProgramMode, string> = { 'Blended Learning': OA_COLORS.primary, 'Self Learning': OA_COLORS.primary200 };
const MODE_DONE_COLOR: Record<ProgramMode, string> = { 'Blended Learning': OA_COLORS.primary300, 'Self Learning': OA_COLORS.primary100 };

const metaLine = (p: { category?: string; type: string; mode: ProgramMode; duration?: string; startDate?: string; endDate?: string }) =>
  [p.category, typeLabel(p.type), modeLabel(p.mode), programSchedule(p)].filter(Boolean).join(' · ');

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** "Mar 04, 2026" + "14:32" → "4 Mar 2026, 14:32" */
function stamp(date: string, time?: string) {
  const d = new Date(date);
  const day = Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return time ? `${day}, ${time}` : day;
}

/** Licenses from this page's source mapping, in the shared license card's shape */
const SOURCE_INITIALS: Record<string, string> = { 'LinkedIn Learning': 'in', "O'Reilly": 'OR', 'MS Learn': 'MS', Coursera: 'Co' };
const SOURCE_LICENSES: License[] = SOURCE_MAPPING.map((s) => ({
  name: s.platform,
  initials: SOURCE_INITIALS[s.platform] ?? initials(s.platform),
  used: s.active,
  total: s.purchased,
}));

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25';

// ── Small shared pieces ──────────────────────────────────────

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={revealItem} className={cn('oa-lift relative flex flex-col gap-4 rounded-[18px] bg-white p-5', className)}>
      {children}
    </motion.div>
  );
}

function RoundChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'attention' }) {
  return (
    <span className={cn(
      'inline-flex h-[30px] shrink-0 items-center whitespace-nowrap rounded-full px-3.5 text-[12px] leading-none',
      tone === 'attention' ? 'bg-(--oa-attention-surface) text-(--oa-attention-text)' : 'bg-(--oa-surface) text-(--oa-text-body)',
    )}>
      {children}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--oa-surface) text-[11px] text-(--oa-text-body)">
      {initials(name)}
    </span>
  );
}

function ThinBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-full bg-(--oa-border-strong)', className)}>
      <div className="h-full rounded-full bg-(--oa-primary) transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Rating({ value }: { value: number }) {
  if (!value) return <span className="text-[13px] text-(--oa-text-subtle)">—</span>;
  return (
    <span className="inline-flex items-center gap-1 text-[13px] tabular-nums text-(--oa-text-strong)">
      <Star className="size-3.5 fill-(--oa-text-subtle) text-(--oa-text-subtle)" />
      {value.toFixed(1)}
    </span>
  );
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  const arrow = cn('flex size-8 items-center justify-center rounded-full text-(--oa-text-body) transition-colors hover:bg-(--oa-surface) disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer', FOCUS);
  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label="Previous page" onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className={arrow}>
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'flex size-8 items-center justify-center rounded-full text-[12px] transition-colors cursor-pointer',
            FOCUS,
            p === page ? 'bg-(--oa-primary-50) text-(--oa-primary-strong)' : 'text-(--oa-text-secondary) hover:bg-(--oa-surface)',
          )}
        >
          {p}
        </button>
      ))}
      <button type="button" aria-label="Next page" onClick={() => onPage(Math.min(total, page + 1))} disabled={page === total} className={arrow}>
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

// ── Active programs table (same rhythm as the Upskill Studio table) ──

// Hidden for now: both are work lists rather than analysis, and Home already has
// them (Active programs, Programs needing attention). Set to true to bring one back.
const SHOW_ACTIVE_LIST = false;
const SHOW_NOT_STARTED = false;

const ACTIVE_PROGRAMS_PER_PAGE = 5;
const ACTIVE_GRID = 'grid grid-cols-[minmax(0,1fr)_88px_140px_72px] items-center gap-4';

function ActiveProgramsTable({ programType, programs, noun }: { programType: ProgramType; programs: ProgramRow[]; noun: ProgramNoun }) {
  const activePrograms = programs.filter((p) => p.status === 'active');
  const totalPages = Math.max(1, Math.ceil(activePrograms.length / ACTIVE_PROGRAMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);

  // Back to page 1 whenever the Courses / Journeys tab changes (reset during render, no stale-page flash)
  const [pageScope, setPageScope] = useState(programType);
  if (pageScope !== programType) {
    setPageScope(programType);
    setCurrentPage(1);
  }

  const startIdx = (currentPage - 1) * ACTIVE_PROGRAMS_PER_PAGE;
  const paged = activePrograms.slice(startIdx, startIdx + ACTIVE_PROGRAMS_PER_PAGE);

  return (
    <Card>
      <CardHeader
        title={<FadeValue k={programType}>Active {noun.many}</FadeValue>}
        subtitle={<FadeValue k={programType}>Currently running {noun.many} with enrollment and completion data</FadeValue>}
        icon={Zap}
      />

      <FadeValue k={programType} className="block w-full">
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className={cn(ACTIVE_GRID, 'border-b border-(--oa-border) px-3 pb-2.5 text-[12px] text-(--oa-text-muted)')}>
              <span>{noun.One}</span>
              <span className="text-right">Enrolled</span>
              <span>Completion</span>
              <span className="text-right">Rating</span>
            </div>
            {paged.map((program) => (
              <div key={`${programType}-${program.id}`} className={cn(ACTIVE_GRID, 'min-h-14 border-b border-(--oa-border) px-3 py-2.5 transition-colors last:border-b-0 hover:bg-(--oa-surface-subtle)')}>
                <div className="min-w-0">
                  <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={program.name}>{program.name}</p>
                  <p className="truncate text-[12px] leading-[18px] text-(--oa-text-muted)">{metaLine(program)}</p>
                </div>
                <span className="text-right text-[13px] tabular-nums text-(--oa-text-strong)">{program.enrolled}</span>
                <span className="flex items-center gap-2">
                  <ThinBar value={program.completion} className="w-20" />
                  <span className="text-[12px] tabular-nums text-(--oa-text-body)">{program.completion}%</span>
                </span>
                <span className="text-right"><Rating value={program.rating} /></span>
              </div>
            ))}
          </div>
        </div>
      </FadeValue>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-(--oa-text-muted)">
            Showing {startIdx + 1} to {Math.min(startIdx + ACTIVE_PROGRAMS_PER_PAGE, activePrograms.length)} of {activePrograms.length} {noun.many}
          </p>
          <Pagination page={currentPage} total={totalPages} onPage={setCurrentPage} />
        </div>
      )}
    </Card>
  );
}

// ── Ranked lists (Top / Bottom) ──────────────────────────────

type RankMetric = 'enrollment' | 'completion' | 'rating';

/** The value on the right of a ranked row is the metric the tab picks */
function RankValue({ program, metric }: { program: ProgramRow; metric: RankMetric }) {
  if (metric === 'completion') {
    return (
      <span className="flex shrink-0 items-center gap-2">
        <ThinBar value={program.completion} className="w-16" />
        <span className="w-9 text-right text-[13px] tabular-nums text-(--oa-text-strong)">{program.completion}%</span>
      </span>
    );
  }
  if (metric === 'rating') return <span className="shrink-0"><Rating value={program.rating} /></span>;
  return (
    <span className="shrink-0 text-[13px] tabular-nums text-(--oa-text-strong)">
      {program.enrolled} <span className="text-[12px] text-(--oa-text-muted)">enrolled</span>
    </span>
  );
}

function RankedList({ programType, rows, metric }: { programType: ProgramType; rows: ProgramRow[]; metric: RankMetric }) {
  return (
    <FadeValue k={`${programType}-${metric}`} className="block w-full">
      <div>
        {rows.map((program, idx) => (
          <div key={`${programType}-${program.id}`} className="flex items-center gap-3 border-b border-(--oa-border) py-2.5 last:border-b-0">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--oa-surface) text-[12px] tabular-nums text-(--oa-text-body)">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={program.name}>{program.name}</p>
              <p className="truncate text-[12px] leading-[18px] text-(--oa-text-muted)">
                {[typeLabel(program.type), modeLabel(program.mode), programSchedule(program)].join(' · ')}
              </p>
            </div>
            <RankValue program={program} metric={metric} />
          </div>
        ))}
      </div>
    </FadeValue>
  );
}

const TOP_TABS: ScopeTab<RankMetric>[] = [
  { key: 'enrollment', label: 'Highest enrollment' },
  { key: 'completion', label: 'Highest completion' },
  { key: 'rating',     label: 'Highest rating' },
];
const BOTTOM_TABS: ScopeTab<RankMetric>[] = [
  { key: 'enrollment', label: 'Lowest enrollment' },
  { key: 'completion', label: 'Lowest completion' },
  { key: 'rating',     label: 'Lowest rating' },
];

// ── Page ────────────────────────────────────────────────────

type SortKey = 'rating' | 'relevancy' | 'duration';

export default function LearningProgramAnalyticsPage() {
  const [programType, setProgramType] = useState<ProgramType>('course');
  const noun = PROGRAM_NOUN[programType];
  const data = PROGRAM_DATA[programType];
  const modeTotal = data.modePie.reduce((sum, m) => sum + m.value, 0);

  // Rating trend in points: the data holds the change in percent
  const ratingNow = Number(data.kpi.rating.value);
  const ratingPoints = Math.round((ratingNow - ratingNow / (1 + data.kpi.rating.change / 100)) * 10) / 10;
  const kpiCards = [
    { key: 'total',      label: `Total ${noun.many}`,      value: data.kpi.total.value,      unit: '',               trend: `${data.kpi.total.change >= 0 ? '+' : ''}${data.kpi.total.change}% vs last quarter`,           positive: data.kpi.total.change >= 0,      icon: noun.icon },
    { key: 'avgEnroll',  label: 'Avg. enrollment',          value: data.kpi.avgEnroll.value,  unit: `per ${noun.one}`, trend: `${data.kpi.avgEnroll.change >= 0 ? '+' : ''}${data.kpi.avgEnroll.change}% vs last quarter`,   positive: data.kpi.avgEnroll.change >= 0,  icon: Users },
    { key: 'completion', label: 'Avg. completion',          value: data.kpi.completion.value, unit: '',               trend: `${data.kpi.completion.change >= 0 ? '+' : ''}${data.kpi.completion.change}% vs last quarter`, positive: data.kpi.completion.change >= 0, icon: CheckCircle2 },
    { key: 'rating',     label: `Avg. ${noun.one} rating`,  value: data.kpi.rating.value,     unit: '/ 5',            trend: `${ratingPoints >= 0 ? '+' : ''}${ratingPoints.toFixed(1)} vs last quarter`,                 positive: ratingPoints >= 0,               icon: Star },
    { key: 'score',      label: 'Average score',            value: data.kpi.score.value,      unit: '/ 100',          trend: `${data.kpi.score.change >= 0 ? '+' : ''}${data.kpi.score.change}% vs last quarter`,           positive: data.kpi.score.change >= 0,      icon: GraduationCap },
  ];

  const [popularFilter, setPopularFilter] = useState<RankMetric>('enrollment');
  const [bottomFilter, setBottomFilter] = useState<RankMetric>('completion');
  const [fbSearch, setFbSearch] = useState('');
  const fbIsSearching = useSimulatedLoading(fbSearch);
  const [fbSortBy, setFbSortBy] = useState<SortKey | null>(null);
  const [fbSortDir, setFbSortDir] = useState<'asc' | 'desc'>('desc');

  const rank = (metric: RankMetric, dir: 1 | -1) =>
    [...data.table]
      .filter((c) => (metric === 'rating' ? c.rating > 0 : true))
      .sort((a, b) => dir * (metric === 'enrollment' ? b.enrolled - a.enrolled : metric === 'completion' ? b.completion - a.completion : b.rating - a.rating))
      .slice(0, 5);
  const popularSorted = rank(popularFilter, 1);
  const bottomSorted = rank(bottomFilter, -1);

  const filteredFeedback = data.feedback
    .filter((fb) => {
      if (!fbSearch) return true;
      const q = fbSearch.toLowerCase();
      return fb.program.toLowerCase().includes(q) || fb.name.toLowerCase().includes(q) || fb.feedback.toLowerCase().includes(q);
    })
    .sort((a, b) => (fbSortBy ? (fbSortDir === 'asc' ? a[fbSortBy] - b[fbSortBy] : b[fbSortBy] - a[fbSortBy]) : 0));

  const handleFbSort = (col: SortKey) => {
    if (fbSortBy === col) setFbSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    else {
      setFbSortBy(col);
      setFbSortDir('desc');
    }
  };

  const sortHeader = (col: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => handleFbSort(col)}
      className={cn('inline-flex items-center gap-1 rounded-full transition-colors cursor-pointer', FOCUS, fbSortBy === col ? 'text-(--oa-text-strong)' : 'hover:text-(--oa-text-body)')}
    >
      {label}
      {fbSortBy === col ? (fbSortDir === 'desc' ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />) : <ArrowUpDown className="size-3" />}
    </button>
  );

  const idleCount = data.notStarted.length;
  const FEEDBACK_GRID = 'grid grid-cols-[88px_minmax(180px,1fr)_minmax(240px,2fr)_64px_72px_64px] items-start gap-4';

  return (
    <DashboardLayout>
      <motion.div className="w-full min-w-0 space-y-3" variants={revealContainer} initial="hidden" animate="visible">
        {/* Page header; the Courses / Journeys tab drives every card below */}
        <motion.div variants={revealItem} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] leading-[32px] text-(--oa-text-strong)">Learning program analytics</h1>
            <p className="mt-0.5 text-[13px] text-(--oa-text-muted)">
              <FadeValue k={programType}>Track {noun.one} performance, enrollment trends and completion</FadeValue>
            </p>
          </div>
          <ProgramScopeTabs id="learning-program-type" tabs={PROGRAM_TYPE_TABS} value={programType} onChange={setProgramType} />
        </motion.div>

        {/* KPI cards, exactly like Home's */}
        <motion.div variants={revealItem} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {kpiCards.map((kpi) => (
            <div key={kpi.key} className="oa-lift rounded-[18px] bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-[13px] leading-[18px] text-(--oa-text-secondary)"><FadeValue k={kpi.label}>{kpi.label}</FadeValue></p>
                <IconCircle icon={kpi.icon} />
              </div>
              <p className="text-[24px] leading-[32px] text-(--oa-text-strong)">
                <FadeValue k={kpi.value}>{kpi.value}</FadeValue>
                {kpi.unit && <span className="ml-1 text-[13px] text-(--oa-text-muted)"><FadeValue k={kpi.unit}>{kpi.unit}</FadeValue></span>}
              </p>
              <Trend positive={kpi.positive} className="mt-1"><FadeValue k={kpi.trend}>{kpi.trend}</FadeValue></Trend>
            </div>
          ))}
        </motion.div>

        {/* Courses by mode + learning funnel */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader title={<FadeValue k={programType}>{noun.One}s by mode</FadeValue>} subtitle="Self-paced vs blended" icon={Layers} />
            <div className="flex flex-col items-center gap-4">
              <div className="relative size-[200px] shrink-0">
                <PieChart width={200} height={200}>
                  <Pie data={data.modePie} cx="50%" cy="50%" innerRadius={74} outerRadius={90} paddingAngle={3} cornerRadius={6} dataKey="value" strokeWidth={0} animationDuration={700}>
                    {data.modePie.map((entry) => (<Cell key={`program-mode-${entry.name}`} fill={MODE_COLOR[entry.name as ProgramMode]} />))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <ChartTooltipCard
                          rows={[{
                            label: modeLabel(String(payload[0].name) as ProgramMode),
                            value: `${payload[0].value} ${payload[0].value === 1 ? noun.one : noun.many}`,
                            color: MODE_COLOR[String(payload[0].name) as ProgramMode],
                          }]}
                        />
                      ) : null
                    }
                  />
                </PieChart>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] leading-[32px] text-(--oa-text-strong)"><FadeValue k={modeTotal}>{modeTotal}</FadeValue></span>
                  <span className="text-[12px] text-(--oa-text-muted)">Total</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                {data.modePie.map((item) => (
                  <span key={item.name} className="flex items-center gap-1.5 text-[12px] text-(--oa-text-muted)">
                    <LegendMark color={MODE_COLOR[item.name as ProgramMode]} />
                    {modeLabel(item.name as ProgramMode)}
                    <span className="text-(--oa-text-strong)"><FadeValue k={item.value}>{item.value}</FadeValue></span>
                  </span>
                ))}
              </div>
            </div>
            {/* One row per mode: a stacked bar of active, done and inactive */}
            <div className="border-t border-(--oa-border)">
              {data.modeBreakdown.map((item) => {
                const total = item.active + item.inactive + item.completed;
                const pct = (n: number) => Math.round((n / total) * 100);
                return (
                  <div key={item.mode} className="border-b border-(--oa-border) py-3 last:border-b-0">
                    <div className="flex items-baseline justify-between text-[13px]">
                      <span className="text-(--oa-text-body)">{modeLabel(item.mode)}</span>
                      <span className="text-[12px] text-(--oa-text-muted)">
                        <span className="text-(--oa-text-strong)"><FadeValue k={pct(item.active)}>{pct(item.active)}% active</FadeValue></span>
                        {' · '}{total} total
                      </span>
                    </div>
                    <div className="mt-2 flex h-2 w-full gap-0.5 overflow-hidden rounded-full">
                      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct(item.active)}%`, background: MODE_COLOR[item.mode] }} />
                      {item.completed > 0 && <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct(item.completed)}%`, background: MODE_DONE_COLOR[item.mode] }} />}
                      <div className="h-full flex-1 rounded-full bg-(--oa-border-strong)" />
                    </div>
                    <p className="mt-1.5 text-[12px] text-(--oa-text-muted)">
                      Active {item.active}{item.completed > 0 ? ` · Done ${item.completed}` : ''} · Inactive {item.inactive}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
          <motion.div variants={revealItem} className="oa-lift rounded-[18px] lg:col-span-2">
            <LearningProgressFunnel programType={programType} className="h-full" />
          </motion.div>
        </div>

        {SHOW_ACTIVE_LIST && <ActiveProgramsTable programType={programType} programs={data.table} noun={noun} />}

        {/* Top and bottom programs */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card>
            <CardHeader
              title={<FadeValue k={programType}>Top {noun.many}</FadeValue>}
              subtitle={<FadeValue k={programType}>Top 5 {noun.many} ranked by the selected metric</FadeValue>}
              icon={Trophy}
            />
            <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
              <ProgramScopeTabs id="top-programs-metric" value={popularFilter} onChange={setPopularFilter} tabs={TOP_TABS} />
            </div>
            <RankedList programType={programType} rows={popularSorted} metric={popularFilter} />
          </Card>
          <Card>
            <CardHeader
              title={<FadeValue k={programType}>Bottom {noun.many}</FadeValue>}
              subtitle={<FadeValue k={programType}>Bottom 5 {noun.many} ranked by the selected metric</FadeValue>}
              icon={TrendingDown}
            />
            <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
              <ProgramScopeTabs id="bottom-programs-metric" value={bottomFilter} onChange={setBottomFilter} tabs={BOTTOM_TABS} />
            </div>
            <RankedList programType={programType} rows={bottomSorted} metric={bottomFilter} />
          </Card>
        </div>

        {/* Assigned but not started: the amber chip is the only warning signal */}
        {SHOW_NOT_STARTED && (
          <Card>
            <CardHeader
              title={<FadeValue k={programType}>{noun.One}s assigned but not started</FadeValue>}
              subtitle={<FadeValue k={programType}>Assigned {noun.many} with zero progress</FadeValue>}
              extra={<RoundChip tone="attention"><FadeValue k={programType}>{idleCount} {idleCount === 1 ? noun.one : noun.many} idle</FadeValue></RoundChip>}
              icon={CalendarClock}
            />
            <FadeValue k={programType} className="block w-full">
              <div>
                {data.notStarted.map((program) => (
                  <div key={`${programType}-${program.id}`} className="flex items-center gap-4 border-b border-(--oa-border) py-3 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={program.name}>{program.name}</p>
                      <p className="truncate text-[12px] leading-[18px] text-(--oa-text-muted)">
                        {[typeLabel(program.type), modeLabel(program.mode), programSchedule(program)].join(' · ')}
                      </p>
                    </div>
                    <span className="shrink-0 text-[13px] tabular-nums text-(--oa-text-strong)">
                      {program.assignedTo} <span className="text-[12px] text-(--oa-text-muted)">assigned</span>
                    </span>
                    <span className={cn('w-16 shrink-0 text-right text-[13px] tabular-nums', program.daysIdle >= 10 ? ATTENTION.text : 'text-(--oa-text-muted)')}>
                      {program.daysIdle}d idle
                    </span>
                  </div>
                ))}
              </div>
            </FadeValue>
          </Card>
        )}

        {/* Licenses, last updated, expired certifications */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <motion.div variants={revealItem} className="oa-lift rounded-[18px]">
            {/* Same card as Home, with this page's licenses */}
            <DashboardLicenseUtilization licenses={SOURCE_LICENSES} className="h-full" />
          </motion.div>

          <Card>
            <CardHeader title="Last updated" subtitle="Recent content changes" icon={RefreshCw} />
            <FadeValue k={programType} className="block w-full">
              <div>
                {data.lastUpdated.map((item) => (
                  <div key={`${programType}-${item.name}`} className="flex items-center gap-3 border-b border-(--oa-border) py-3 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={item.name}>{item.name}</p>
                      <p className="text-[12px] leading-[18px] text-(--oa-text-muted)">{stamp(item.date, item.time)}</p>
                    </div>
                    <RoundChip>{item.type}</RoundChip>
                  </div>
                ))}
              </div>
            </FadeValue>
          </Card>

          <Card>
            <CardHeader
              title="Expired certifications"
              subtitle="Certifications past their validity date"
              extra={<RoundChip>{EXPIRED_CERTIFICATIONS.length} expired</RoundChip>}
              icon={ShieldAlert}
            />
            <div>
              {EXPIRED_CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="flex items-center gap-3 border-b border-(--oa-border) py-3 last:border-b-0">
                  <Avatar name={cert.holder} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={cert.name}>{cert.name}</p>
                    <p className="truncate text-[12px] leading-[18px] text-(--oa-text-muted)">{cert.holder} · expired {stamp(cert.expiredDate)}</p>
                  </div>
                  <span className={cn('shrink-0 text-[13px] tabular-nums', cert.daysExpired >= 30 ? ATTENTION.text : 'text-(--oa-text-muted)')}>
                    {cert.daysExpired}d
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Learner feedback: who, about what, said what */}
        <Card>
          <CardHeader
            title="Recent learner feedback"
            subtitle={<FadeValue k={programType}>Recent feedback from {noun.one} participants</FadeValue>}
            extra={<RoundChip><FadeValue k={programType}>{filteredFeedback.length} of {data.feedback.length}</FadeValue></RoundChip>}
            icon={MessageSquareText}
          />
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--oa-text-muted)" />
            <input
              type="text"
              placeholder={`Search ${noun.one} or trainee`}
              value={fbSearch}
              onChange={(e) => setFbSearch(e.target.value)}
              className="h-9 w-full rounded-full bg-(--oa-surface) pl-10 pr-9 text-[13px] text-(--oa-text-strong) outline-none transition-colors placeholder:text-(--oa-text-subtle) focus:bg-white focus:ring-2 focus:ring-(--oa-primary)/25"
            />
            {fbIsSearching && <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-(--oa-primary)" />}
          </div>
          <FadeValue k={programType} className="block w-full">
            <div className="overflow-x-auto">
              <div className="min-w-[820px]">
                <div className={cn(FEEDBACK_GRID, 'border-b border-(--oa-border) px-3 pb-2.5 text-[12px] text-(--oa-text-muted)')}>
                  <span>Date</span>
                  <span>Trainee</span>
                  <span>Feedback</span>
                  <span className="justify-self-center">{sortHeader('rating', 'Rating')}</span>
                  <span className="justify-self-center">{sortHeader('relevancy', 'Relevancy')}</span>
                  <span className="justify-self-center">{sortHeader('duration', 'Duration')}</span>
                </div>
                {filteredFeedback.length === 0 ? (
                  <p className="py-8 text-center text-[13px] text-(--oa-text-muted)">No feedback matches this search.</p>
                ) : (
                  filteredFeedback.map((fb) => (
                    <div key={`${programType}-${fb.id}`} className={cn(FEEDBACK_GRID, 'border-b border-(--oa-border) px-3 py-3 transition-colors last:border-b-0 hover:bg-(--oa-surface-subtle)')}>
                      <span className="whitespace-nowrap pt-1 text-[12px] text-(--oa-text-muted)">{stamp(fb.submittedDate)}</span>
                      <div className="flex min-w-0 items-start gap-2.5">
                        <Avatar name={fb.name} />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)">{fb.name}</p>
                          <p className="truncate text-[12px] leading-[18px] text-(--oa-text-muted)" title={fb.program}>{fb.program}</p>
                        </div>
                      </div>
                      <p className="line-clamp-2 pt-0.5 text-[13px] leading-[20px] text-(--oa-text-body)" title={fb.feedback}>{fb.feedback}</p>
                      {[fb.rating, fb.relevancy, fb.duration].map((score, i) => (
                        <span key={i} className="justify-self-center rounded-full bg-(--oa-surface) px-2.5 py-1 text-[12px] tabular-nums text-(--oa-text-strong)">
                          {score.toFixed(1)}
                        </span>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </FadeValue>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
