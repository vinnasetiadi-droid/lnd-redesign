import { motion } from 'motion/react';
import { useState } from 'react';
import { DashboardLayout } from '@/variants/a/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { ProgramScopeTabs, PROGRAM_TYPE_TABS, FadeValue } from '@/variants/a/pages/ld/dashboard/components/ProgramScopeTabs';
import { CardHeader, Chip, IconCircle, PillButton, Trend } from '@/variants/a/components/ui/kit';
import { AXIS_TICK, CHART_BLUE, ChartTooltipCard, GRID_PROPS, GradientProgress, LegendMark } from '@/variants/a/components/ui/chart';
import { LearningProgressFunnel } from './components/LearningProgressFunnel';
import {
  BookOpen, CheckCircle2, Star, TrendingUp, Clock,
  ArrowUpRight, ArrowDownRight, Search, Users, Trophy, Crown, TrendingDown, AlertTriangle, CalendarClock,
  KeyRound, ShieldAlert, UserCheck, LogOut, RefreshCw, GraduationCap, FileWarning, Calendar,
  MessageSquareText, ChevronDown, ArrowUpDown, ChevronUp, Layers, Monitor, UsersRound, Zap, Eye,
  ChevronLeft, ChevronRight, Sparkles, Loader2, Route,
} from '@/variants/a/icons';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from 'recharts';

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
  { name: 'Self Learning',    value: 28, color: '#1A73E8' },
  { name: 'Blended Learning', value: 36, color: '#8AB4F8' },
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
  { name: 'Self Learning',    value: 7,  color: '#1A73E8' },
  { name: 'Blended Learning', value: 11, color: '#8AB4F8' },
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
  { id: 'l1', platform: 'LinkedIn Learning', purchased: 200, active: 168, utilization: 84, color: '#1A73E8' },
  { id: 'l2', platform: "O'Reilly",          purchased: 80,  active: 52,  utilization: 65, color: '#8AB4F8' },
  { id: 'l3', platform: 'MS Learn',          purchased: 300, active: 245, utilization: 82, color: '#669DF6' },
  { id: 'l4', platform: 'Coursera',          purchased: 150, active: 89,  utilization: 59, color: '#AECBFA' },
];
const SOURCE_TOTAL_PURCHASED = SOURCE_MAPPING.reduce((s, l) => s + l.purchased, 0);
const SOURCE_TOTAL_ACTIVE = SOURCE_MAPPING.reduce((s, l) => s + l.active, 0);
const SOURCE_UTILIZATION_PCT = Math.round((SOURCE_TOTAL_ACTIVE / SOURCE_TOTAL_PURCHASED) * 100);
const SOURCE_PIE_DATA = SOURCE_MAPPING.map((s) => ({ name: s.platform, value: s.active, color: s.color }));
const SOURCE_PIE_UNUSED = { name: 'Unused', value: SOURCE_TOTAL_PURCHASED - SOURCE_TOTAL_ACTIVE, color: '#F0F1F3' };

const EXPIRED_CERTIFICATIONS = [
  { id: 'ec1', name: 'AWS Solutions Architect',      holder: 'James Wilson',     expiredDate: 'Jan 15, 2026', daysExpired: 49 },
  { id: 'ec2', name: 'PMP Certification',            holder: 'Sarah Chen',       expiredDate: 'Feb 01, 2026', daysExpired: 32 },
  { id: 'ec3', name: 'Google Cloud Professional',    holder: 'Michael Torres',   expiredDate: 'Feb 10, 2026', daysExpired: 23 },
  { id: 'ec4', name: 'CISSP Security',               holder: 'Emily Park',       expiredDate: 'Feb 20, 2026', daysExpired: 13 },
  { id: 'ec5', name: 'Scrum Master (CSM)',           holder: 'David Kim',        expiredDate: 'Mar 01, 2026', daysExpired: 4  },
];

// ── Variants ───────────────────────────────────────────

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 16 } },
};

const colorMap: Record<string, { bg: string; text: string }> = {
  blue:    { bg: 'bg-white',    text: 'text-[#1A73E8]'    },
  emerald: { bg: 'bg-white', text: 'text-[#1A73E8]' },
  violet:  { bg: 'bg-white',  text: 'text-[#1A73E8]'  },
  amber:   { bg: 'bg-white',   text: 'text-[#1A73E8]'   },
  indigo:  { bg: 'bg-white',  text: 'text-[#1A73E8]'  },
};

// ── Active Programs Table (Dashboard-style) ─────────────────

const ACTIVE_PROGRAMS_PER_PAGE = 5;

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
    <motion.div
      variants={itemVariants}
      className="relative bg-white rounded-[18px] p-5 overflow-hidden"
    >

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="space-y-0.5">
          <h3 className="text-[#181D27]"><FadeValue k={programType}>Active {noun.Many}</FadeValue></h3>
          <p className="text-[13px] text-[#717680]"><FadeValue k={programType}>Currently running {noun.many} with enrollment and completion data</FadeValue></p>
        </div>
        <IconCircle icon={Zap} />
      </div>

      {/* Table */}
      <FadeValue k={programType} className="block w-full">
        <div className="rounded-[14px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F8FA] text-left">
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px]">{noun.One}</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px] text-center">Enrolled</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px] text-center">Completion</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px] text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEEF1]">
              {paged.map((program) => (
                <tr key={`${programType}-${program.id}`} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 max-w-[360px]">
                    <p className="text-[13px] text-[#252B37] truncate">{program.name}</p>
                    <p className="text-[12px] text-[#A4A7AE] mt-0.5 truncate">
                      {program.category} · {program.type} · {program.mode} · {programSchedule(program)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center text-[13px] text-[#535862]">{program.enrolled}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[12px] text-[#414651]">{program.completion}%</span>
                      <div className="w-16 h-[4px] rounded-full bg-[#F5F6F8] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${program.completion}%`,
                            background: program.completion >= 80
                              ? 'linear-gradient(90deg, #4285F4, #8AB4F8)'
                              : program.completion >= 50 ? '#669DF6' : '#AECBFA',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {program.rating > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 text-[#4285F4] fill-[#4285F4]" />
                        <span className="text-[13px] text-[#252B37]">{program.rating}</span>
                      </div>
                    ) : (
                      <span className="text-[13px] text-[#A4A7AE]">{'—'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeValue>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-[12px] text-[#A4A7AE]">
            Showing {startIdx + 1}{'–'}{Math.min(startIdx + ACTIVE_PROGRAMS_PER_PAGE, activePrograms.length)} of {activePrograms.length} {noun.many}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                'flex size-8 items-center justify-center rounded-full bg-[#F5F6F8] transition-colors',
                currentPage === 1
                  ? 'text-[#E4E6EA] cursor-not-allowed'
                  : 'text-[#717680] hover:bg-[#F5F6F8] hover:text-[#414651]'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'size-8 rounded-full text-[12px] transition-colors',
                  page === currentPage
                    ? 'bg-(--oa-primary-50) text-(--oa-primary-strong)'
                    : 'text-[#717680] hover:bg-[#F5F6F8] hover:text-[#414651]'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'flex size-8 items-center justify-center rounded-full bg-[#F5F6F8] transition-colors',
                currentPage === totalPages
                  ? 'text-[#E4E6EA] cursor-not-allowed'
                  : 'text-[#717680] hover:bg-[#F5F6F8] hover:text-[#414651]'
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Page ────────────────────────────────────────────────────

export default function LearningProgramAnalyticsPage() {
  const [programType, setProgramType] = useState<ProgramType>('course');
  const noun = PROGRAM_NOUN[programType];
  const data = PROGRAM_DATA[programType];
  const modeTotal = data.modePie.reduce((sum, m) => sum + m.value, 0);
  const kpiCards = [
    { key: 'total',      label: `Total ${noun.Many}`,        ...data.kpi.total,      icon: noun.icon,    color: 'blue'   },
    { key: 'avgEnroll',  label: 'Avg. Enrollment',            ...data.kpi.avgEnroll,  icon: Users,        color: 'indigo' },
    { key: 'completion', label: 'Avg. Completion',            ...data.kpi.completion, icon: CheckCircle2, color: 'violet' },
    { key: 'rating',     label: `Avg. ${noun.One} Rating`,   ...data.kpi.rating,     icon: Star,         color: 'amber'  },
  ];

  const [popularFilter, setPopularFilter] = useState<'enrollment' | 'completion' | 'rating'>('enrollment');
  const [bottomFilter, setBottomFilter] = useState<'enrollment' | 'completion' | 'rating'>('completion');
  const [fbSearch, setFbSearch] = useState('');
  const fbIsSearching = useSimulatedLoading(fbSearch);
  const [fbSortBy, setFbSortBy] = useState<'rating' | 'relevancy' | 'duration' | null>(null);
  const [fbSortDir, setFbSortDir] = useState<'asc' | 'desc'>('desc');

  const popularSorted = [...data.table]
    .filter((c) => popularFilter === 'rating' ? c.rating > 0 : true)
    .sort((a, b) =>
      popularFilter === 'enrollment'
        ? b.enrolled - a.enrolled
        : popularFilter === 'completion'
          ? b.completion - a.completion
          : b.rating - a.rating
    )
    .slice(0, 5);

  const bottomSorted = [...data.table]
    .filter((c) => bottomFilter === 'rating' ? c.rating > 0 : true)
    .sort((a, b) =>
      bottomFilter === 'enrollment'
        ? a.enrolled - b.enrolled
        : bottomFilter === 'completion'
          ? a.completion - b.completion
          : a.rating - b.rating
    )
    .slice(0, 5);

  const filteredFeedback = data.feedback
    .filter((fb) => {
      if (!fbSearch) return true;
      const q = fbSearch.toLowerCase();
      return fb.program.toLowerCase().includes(q) || fb.name.toLowerCase().includes(q) || fb.feedback.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!fbSortBy) return 0;
      const aValue = a[fbSortBy];
      const bValue = b[fbSortBy];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return fbSortDir === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  const handleFbSort = (col: 'rating' | 'relevancy' | 'duration') => {
    if (fbSortBy === col) {
      setFbSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setFbSortBy(col);
      setFbSortDir('desc');
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="w-full min-w-0 space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header; the Courses / Journeys tab on the right drives every card below */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] leading-[32px] text-[#181D27]">Learning program analytics</h1>
            <p className="text-[13px] text-[#717680] mt-0.5">
              <FadeValue k={programType}>Track {noun.one} performance, enrollment trends, and completion metrics</FadeValue>
            </p>
          </div>
          <ProgramScopeTabs id="learning-program-type" tabs={PROGRAM_TYPE_TABS} value={programType} onChange={setProgramType} />
        </motion.div>

        {/* KPI Cards: label + icon circle, value, plain trend (as on Home) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change >= 0;
            return (
              <div key={kpi.key} className="rounded-[18px] bg-white p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-[13px] leading-[18px] text-[#535862]"><FadeValue k={kpi.label}>{kpi.label}</FadeValue></p>
                  <IconCircle icon={Icon} />
                </div>
                <p className="text-[24px] leading-[32px] text-[#181D27]">
                  <FadeValue k={kpi.value}>{kpi.value}</FadeValue>
                  {kpi.key === 'avgEnroll' && <span className="text-[13px] text-[#A4A7AE] ml-1"><FadeValue k={programType}>per {noun.one}</FadeValue></span>}
                </p>
                <Trend positive={isPositive} className="mt-1">
                  <FadeValue k={kpi.change}>{isPositive ? '+' : ''}{kpi.change}%</FadeValue>
                </Trend>
              </div>
            );
          })}
          {/* Average Score */}
          <div className="rounded-[18px] bg-white p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[13px] leading-[18px] text-[#535862]">Average score</p>
              <IconCircle icon={GraduationCap} />
            </div>
            <p className="text-[24px] leading-[32px] text-[#181D27]">
              <FadeValue k={data.kpi.score.value}>{data.kpi.score.value}</FadeValue>
              <span className="text-[13px] text-[#A4A7AE] ml-1">/ 100</span>
            </p>
            <Trend className="mt-1">
              <FadeValue k={data.kpi.score.change}>+{data.kpi.score.change}%</FadeValue>
            </Trend>
          </div>
        </motion.div>

        {/* ── Total Programs by Mode + Learning Progress Funnel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <motion.div variants={itemVariants} className="lg:col-span-1 rounded-[18px] bg-white p-5 overflow-hidden relative flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="space-y-0.5 min-w-0">
                <h3 className="text-[#181D27]"><FadeValue k={programType}>{noun.Many} by Mode</FadeValue></h3>
                <p className="text-[13px] text-[#717680] truncate">Self-paced vs blended</p>
              </div>
              <IconCircle icon={Layers} />
            </div>
            <div className="flex flex-col items-center gap-4 flex-1">
              <div className="relative w-[200px] h-[200px] shrink-0">
                <PieChart width={200} height={200}>
                  <Pie data={data.modePie} cx="50%" cy="50%" innerRadius={74} outerRadius={90} paddingAngle={3} cornerRadius={6} dataKey="value" strokeWidth={0}>
                    {data.modePie.map((entry, idx) => (<Cell key={`program-mode-${entry.name}-${idx}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <ChartTooltipCard
                          rows={[{
                            label: String(payload[0].name),
                            value: `${payload[0].value} ${payload[0].value === 1 ? noun.one : noun.many}`,
                            color: (payload[0].payload as { color: string }).color,
                          }]}
                        />
                      ) : null
                    }
                  />
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl text-[#181D27]"><FadeValue k={modeTotal}>{modeTotal}</FadeValue></span>
                  <span className="text-[11px] text-[#717680]">Total</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                {data.modePie.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-[#717680]">{item.name}</span>
                    <span className="text-[11px] text-[#181D27]"><FadeValue k={item.value}>{item.value}</FadeValue></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5 mt-4">
              {data.modeBreakdown.map((item) => {
                const total = item.active + item.inactive;
                const activePercent = Math.round((item.active / total) * 100);
                return (
                  <div key={item.mode} className="p-3 rounded-[14px] bg-[#F7F8FA]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {item.mode === 'Self Learning' ? <Monitor className="w-3.5 h-3.5 text-[#1A73E8]" /> : <UsersRound className="w-3.5 h-3.5 text-[#8AB4F8]" />}
                        <span className="text-[11px] text-[#414651]">{item.mode}</span>
                      </div>
                      <span className="text-[12px] text-[#181D27]"><FadeValue k={total}>{total}</FadeValue></span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" /><span className="text-[11px] text-[#717680]"><FadeValue k={item.active}>Active {item.active}</FadeValue></span></div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#D0D5DD]" /><span className="text-[11px] text-[#717680]"><FadeValue k={item.inactive}>Inactive {item.inactive}</FadeValue></span></div>
                      {item.completed > 0 && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#669DF6]" /><span className="text-[11px] text-[#717680]"><FadeValue k={item.completed}>Done {item.completed}</FadeValue></span></div>}
                      <span className="ml-auto text-[11px] text-[#4285F4]"><FadeValue k={activePercent}>{activePercent}%</FadeValue></span>
                    </div>
                    <div className="mt-1.5 w-full bg-[#EDEEF1] rounded-full h-1 overflow-hidden flex">
                      <div className="h-full bg-[#1A73E8] rounded-l-full" style={{ width: `${Math.round((item.active / (item.active + item.inactive + item.completed)) * 100)}%` }} />
                      {item.completed > 0 && <div className="h-full bg-[#669DF6]" style={{ width: `${Math.round((item.completed / (item.active + item.inactive + item.completed)) * 100)}%` }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          <LearningProgressFunnel programType={programType} className="lg:col-span-2" />
        </div>

        {/* Active Programs Table — matches Dashboard Active Programs style */}
        <ActiveProgramsTable programType={programType} programs={data.table} noun={noun} />

        {/* Most Popular & Least Popular Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Top Programs */}
          <motion.div variants={itemVariants} className="rounded-[18px] bg-white p-5 overflow-hidden relative">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="space-y-1">
                <h3 className="text-[16px] text-[#181D27]"><FadeValue k={programType}>Top {noun.Many}</FadeValue></h3>
                <p className="text-[13px] text-[#717680]"><FadeValue k={programType}>Top 5 {noun.many} ranked by selected metric</FadeValue></p>
              </div>
              <IconCircle icon={Trophy} />
            </div>
            <div className="flex items-center gap-0.5 mb-5 p-1 bg-[#F5F6F8] rounded-full w-fit">
              {(['enrollment', 'completion', 'rating'] as const).map((tab) => (
                <button key={tab} onClick={() => setPopularFilter(tab)} className={cn('px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-200', popularFilter === tab ? 'bg-white text-[#181D27] shadow-[0_1px_2px_rgba(16,24,40,0.08),0_1px_3px_rgba(16,24,40,0.06)]' : 'text-[#717680] hover:text-[#414651]')}>
                  {tab === 'enrollment' ? 'Highest Enrollment' : tab === 'completion' ? 'Highest Completion' : 'Highest Rating'}
                </button>
              ))}
            </div>
            <FadeValue k={programType} className="block w-full">
            <div className="space-y-2">
              {popularSorted.map((program, idx) => (
                <div key={`${programType}-${program.id}`} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-[10px] border transition-all hover:shadow-sm', idx === 0 ? 'bg-[#F7F8FA] border-[#EDEEF1]' : 'bg-[#F9FAFB]/50 border-[#EDEEF1] hover:bg-white')}>
                  <div className={cn('flex-shrink-0 size-7 rounded-full flex items-center justify-center text-[12px]', idx === 0 ? 'bg-[#185ABC] text-white' : idx === 1 ? 'bg-[#4E5BA6] text-white' : idx === 2 ? 'bg-[#717BBC] text-white' : 'bg-[#EDEEF1] text-[#185ABC]')}>
                    {idx === 0 ? <Crown className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-[13px] truncate', idx === 0 ? 'text-[#185ABC]' : 'text-[#181D27]')}>{program.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[11px] text-[#717680]">{program.type}</span>
                      <span className="text-[11px] text-[#E4E6EA]">·</span>
                      <span className="text-[11px] text-[#717680]">{program.mode}</span>
                      <span className="text-[11px] text-[#E4E6EA]">·</span>
                      <span className="text-[11px] text-[#717680]">{programSchedule(program)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Users className="w-3.5 h-3.5 text-[#A4A7AE]" />
                    <span className={cn('text-[13px]', idx === 0 ? 'text-[#185ABC]' : 'text-[#414651]')}>{program.enrolled}</span>
                  </div>
                  {program.rating > 0 && (
                    <div className="shrink-0 flex items-center gap-1 text-[12px]">
                      <Star className="w-3.5 h-3.5 text-[#4285F4] fill-[#4285F4]" />
                      <span className="text-[#414651]">{program.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            </FadeValue>
          </motion.div>

          {/* Bottom Programs */}
          <motion.div variants={itemVariants} className="rounded-[18px] bg-white p-5 overflow-hidden relative">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="space-y-1">
                <h3 className="text-[16px] text-[#181D27]"><FadeValue k={programType}>Bottom {noun.Many}</FadeValue></h3>
                <p className="text-[13px] text-[#717680]"><FadeValue k={programType}>Bottom 5 {noun.many} ranked by selected metric</FadeValue></p>
              </div>
              <IconCircle icon={TrendingDown} />
            </div>
            <div className="flex items-center gap-0.5 mb-5 p-1 bg-[#F5F6F8] rounded-full w-fit">
              {(['enrollment', 'completion', 'rating'] as const).map((tab) => (
                <button key={tab} onClick={() => setBottomFilter(tab)} className={cn('px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-200', bottomFilter === tab ? 'bg-white text-[#181D27] shadow-[0_1px_2px_rgba(16,24,40,0.08),0_1px_3px_rgba(16,24,40,0.06)]' : 'text-[#717680] hover:text-[#414651]')}>
                  {tab === 'enrollment' ? 'Lowest Enrollment' : tab === 'completion' ? 'Lowest Completion' : 'Lowest Rating'}
                </button>
              ))}
            </div>
            <FadeValue k={programType} className="block w-full">
            <div className="space-y-2">
              {bottomSorted.map((program, idx) => (
                <div key={`${programType}-${program.id}`} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-[10px] border transition-all hover:shadow-sm', idx === 0 ? 'bg-[#F7F8FA] border-[#EDEEF1]' : 'bg-[#F9FAFB]/50 border-[#EDEEF1] hover:bg-white')}>
                  <div className={cn('flex-shrink-0 size-7 rounded-full flex items-center justify-center text-[12px]', idx === 0 ? 'bg-[#717680] text-white' : idx === 1 ? 'bg-[#A4A7AE] text-white' : idx === 2 ? 'bg-[#E4E6EA] text-white' : 'bg-[#EDEEF1] text-[#185ABC]')}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-[13px] truncate', idx === 0 ? 'text-[#185ABC]' : 'text-[#181D27]')}>{program.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[11px] text-[#717680]">{program.type}</span>
                      <span className="text-[11px] text-[#E4E6EA]">·</span>
                      <span className="text-[11px] text-[#717680]">{program.mode}</span>
                      <span className="text-[11px] text-[#E4E6EA]">·</span>
                      <span className="text-[11px] text-[#717680]">{programSchedule(program)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Users className="w-3.5 h-3.5 text-[#A4A7AE]" />
                    <span className={cn('text-[13px]', idx === 0 ? 'text-[#185ABC]' : 'text-[#414651]')}>{program.enrolled}</span>
                  </div>
                  {program.rating > 0 && (
                    <div className="shrink-0 flex items-center gap-1 text-[12px]">
                      <Star className="w-3.5 h-3.5 text-[#4285F4] fill-[#4285F4]" />
                      <span className="text-[#414651]">{program.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            </FadeValue>
          </motion.div>
        </div>

        {/* Programs Assigned but Not Started */}
        <motion.div variants={itemVariants} className="rounded-[18px] bg-white p-5 overflow-hidden relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-[16px] text-[#181D27]"><FadeValue k={programType}>{noun.Many} Assigned but Not Started</FadeValue></h3>
                <p className="text-[13px] text-[#717680]"><FadeValue k={programType}>Assigned {noun.many} with zero progress</FadeValue></p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="inline-flex h-[30px] items-center gap-2 bg-[#FEF0C7] px-3.5 rounded-[10px]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B54708]" />
                <span className="text-[12px] text-[#B54708]"><FadeValue k={programType}>{data.notStarted.length} {data.notStarted.length === 1 ? noun.one : noun.many} idle</FadeValue></span>
              </div>
              <IconCircle icon={AlertTriangle} />
            </div>
          </div>
          <FadeValue k={programType} className="block w-full">
          <div className="space-y-3">
            {data.notStarted.map((program) => (
              <div key={`${programType}-${program.id}`} className={cn('flex items-center gap-4 p-4 rounded-[14px] border transition-all hover:shadow-sm', program.daysIdle >= 10 ? 'bg-[#E8F0FE]/40 border-[#D2E3FC]' : program.daysIdle >= 5 ? 'bg-[#F5F9FE]/40 border-[#E8F0FE]' : 'bg-[#F9FAFB]/50 border-[#EDEEF1] hover:bg-white')}>
                <div className={cn('flex-shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center', 'bg-white border border-[#EDEEF1] text-[#1A73E8]')}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#181D27] truncate">{program.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[12px] text-[#717680]">{program.type}</span>
                    <span className="text-[12px] text-[#D0D5DD]">·</span>
                    <span className="text-[12px] text-[#717680]">{program.mode}</span>
                    <span className="text-[12px] text-[#D0D5DD]">·</span>
                    <span className="text-[12px] text-[#717680]">{programSchedule(program)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Users className="w-3.5 h-3.5 text-[#A4A7AE]" />
                  <span className="text-[13px] text-[#414651]">{program.assignedTo}</span>
                  <span className="text-[11px] text-[#A4A7AE]">Assigned</span>
                </div>
                <div className={cn('shrink-0 inline-flex h-[30px] items-center px-3.5 rounded-[10px] text-[12px]', program.daysIdle >= 10 ? 'bg-[#FEE4E2] text-[#B42318]' : program.daysIdle >= 5 ? 'bg-[#FEF0C7] text-[#B54708]' : 'bg-[#F5F6F8] text-[#0A0D12]')}>
                  {program.daysIdle}d idle
                </div>
              </div>
            ))}
          </div>
          </FadeValue>
        </motion.div>

        {/* License Utilization + Last Updated */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <motion.div variants={itemVariants} className="lg:col-span-2 rounded-[18px] bg-white p-5 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-[16px] text-[#181D27] leading-[24px]">Source mapping</h3>
                  <p className="text-[13px] text-[#717680] leading-[18px] mt-0.5">Percentage of purchased licenses actively used by trainees</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="inline-flex h-[30px] items-center gap-1.5 px-3.5 rounded-[10px] bg-[#F5F6F8] shrink-0">
                  <KeyRound className="w-3.5 h-3.5 text-[#414651]" strokeWidth={2} />
                  <span className="text-[12px] text-[#181D27]">{SOURCE_TOTAL_ACTIVE}/{SOURCE_TOTAL_PURCHASED}</span>
                </div>
                <IconCircle icon={KeyRound} />
              </div>
            </div>

            {/* Donut Chart + Legend */}
            <div className="flex items-center gap-8 mb-6">
              {/* Donut */}
              <div className="relative w-[180px] h-[180px] shrink-0">
                <PieChart width={180} height={180}>
                  <Pie
                    data={[...SOURCE_PIE_DATA, SOURCE_PIE_UNUSED]}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={82}
                    paddingAngle={3}
                    cornerRadius={6}
                    dataKey="value"
                    strokeWidth={0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {[...SOURCE_PIE_DATA, SOURCE_PIE_UNUSED].map((entry, idx) => (
                      <Cell key={`source-pie-${entry.name}-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[24px] text-[#181D27] leading-none">{SOURCE_UTILIZATION_PCT}%</span>
                  <span className="text-[11px] text-[#717680] mt-1">Utilized</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-4 flex-1">
                {SOURCE_MAPPING.map((src) => (
                  <div key={src.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                      <span className="text-[12px] text-[#414651] flex-1 min-w-0">{src.platform}</span>
                      <span className="text-[12px] text-[#181D27] text-right tabular-nums shrink-0">{src.active}/{src.purchased} ({src.utilization}%)</span>
                    </div>
                    <div className="bg-[#F0F1F3] rounded-full h-[5px] overflow-hidden ml-[18px]" style={{ width: 'calc(100% - 18px)' }}>
                      <div className="h-full rounded-full" style={{ width: `${src.utilization}%`, backgroundColor: src.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="rounded-[14px] bg-gradient-to-br from-white via-[#F5F9FE] to-[#E8F0FE] p-4">
              <h4 className="mb-1 text-[12px] text-[#1967D2]">AI Insight Analysis</h4>
              <p className="text-[13px] text-[#414651] leading-relaxed">
                LinkedIn Learning has the highest adoption rate at 84%, while Coursera is significantly underutilized at only 59%. Consider redistributing unused Coursera licenses or running an internal campaign to boost engagement — this could save up to 30% on renewal costs.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-[18px] bg-white p-5 overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="space-y-1">
                <h3 className="text-[16px] text-[#181D27]">Last updated</h3>
                <p className="text-[13px] text-[#717680]">Recent content modifications</p>
              </div>
              <IconCircle icon={RefreshCw} />
            </div>
            <FadeValue k={programType} className="block w-full">
            <div className="space-y-3">
              {data.lastUpdated.map((item) => (
                <div key={`${programType}-${item.name}`} className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F7F8FA] hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex-shrink-0 size-8 rounded-full bg-white flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#1A73E8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#181D27] truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-[#A4A7AE]">{item.date} at {item.time}</span>
                      <span className="text-[11px] text-[#1A73E8] bg-[#E8F0FE] px-1.5 py-0.5 rounded">{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </FadeValue>
          </motion.div>
        </div>

        {/* Expired Certifications */}
        <motion.div variants={itemVariants} className="rounded-[18px] bg-white p-5 overflow-hidden relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-[16px] text-[#181D27]">Expired certifications</h3>
                <p className="text-[13px] text-[#717680]">Certifications past their validity date</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="inline-flex h-[30px] items-center gap-2 bg-[#FEE4E2] px-3.5 rounded-[10px]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#B42318]" />
                <span className="text-[12px] text-[#B42318]">{EXPIRED_CERTIFICATIONS.length} expired</span>
              </div>
              <IconCircle icon={ShieldAlert} />
            </div>
          </div>
          <div className="space-y-3">
            {EXPIRED_CERTIFICATIONS.map((cert) => (
              <div key={cert.id} className={cn('flex items-center gap-4 p-4 rounded-[14px] border transition-all hover:shadow-sm', cert.daysExpired >= 30 ? 'bg-[#E8F0FE]/40 border-[#D2E3FC]' : cert.daysExpired >= 14 ? 'bg-[#F5F9FE]/40 border-[#E8F0FE]' : 'bg-[#F9FAFB]/50 border-[#EDEEF1] hover:bg-white')}>
                <div className={cn('flex-shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center', 'bg-white border border-[#EDEEF1] text-[#1A73E8]')}>
                  <FileWarning className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#181D27] truncate">{cert.name}</p>
                  <p className="text-[12px] text-[#A4A7AE] mt-0.5">Holder: {cert.holder}</p>
                </div>
                <div className={cn('shrink-0 inline-flex h-[30px] items-center px-3.5 rounded-[10px] text-[12px]', cert.daysExpired >= 30 ? 'bg-[#FEE4E2] text-[#B42318]' : cert.daysExpired >= 14 ? 'bg-[#FEF0C7] text-[#B54708]' : 'bg-[#F5F6F8] text-[#0A0D12]')}>
                  {cert.daysExpired}d expired
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learner Feedback */}
        <motion.div variants={itemVariants} className="rounded-[18px] bg-white p-5 overflow-hidden relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-[16px] text-[#181D27]">Recent learner feedback</h3>
                <p className="text-[13px] text-[#717680]"><FadeValue k={programType}>Recent feedback from {noun.one} participants</FadeValue></p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="inline-flex h-[30px] items-center gap-2 bg-[#E8F0FE] px-3.5 rounded-[10px]">
                <MessageSquareText className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span className="text-[12px] text-[#1A73E8]"><FadeValue k={programType}>{filteredFeedback.length} of {data.feedback.length}</FadeValue></span>
              </div>
              <IconCircle icon={MessageSquareText} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A4A7AE]" />
              <input type="text" placeholder={`Search ${noun.one} or trainee...`} value={fbSearch} onChange={(e) => setFbSearch(e.target.value)} className="w-full pl-9 pr-9 h-9 text-[13px] rounded-full bg-[#F5F6F8] text-[#181D27] placeholder:text-[#A4A7AE] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/25" />
              {fbIsSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1A73E8] animate-spin" />
              )}
            </div>
          </div>
          <FadeValue k={programType} className="block w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#EDEEF1]">
                  <th className="text-left text-[12px] text-[#717680] px-4 py-[10px]">Date</th>
                  <th className="text-left text-[12px] text-[#717680] px-4 py-[10px]">{noun.One}</th>
                  <th className="text-left text-[12px] text-[#717680] px-4 py-[10px]">Trainee</th>
                  <th className="text-left text-[12px] px-4 py-[10px]">
                    <button onClick={() => handleFbSort('rating')} className={cn('inline-flex items-center gap-1 hover:text-[#535862] transition-colors', fbSortBy === 'rating' ? 'text-[#1A73E8]' : 'text-[#717680]')}>
                      Rating {fbSortBy === 'rating' ? (fbSortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="text-center text-[12px] px-4 py-[10px]">
                    <button onClick={() => handleFbSort('relevancy')} className={cn('inline-flex items-center gap-1 hover:text-[#535862] transition-colors', fbSortBy === 'relevancy' ? 'text-[#1A73E8]' : 'text-[#717680]')}>
                      Relevancy {fbSortBy === 'relevancy' ? (fbSortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="text-center text-[12px] px-4 py-[10px]">
                    <button onClick={() => handleFbSort('duration')} className={cn('inline-flex items-center gap-1 hover:text-[#535862] transition-colors', fbSortBy === 'duration' ? 'text-[#4285F4]' : 'text-[#717680]')}>
                      Duration {fbSortBy === 'duration' ? (fbSortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="text-left text-[12px] text-[#717680] px-4 py-[10px]">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center"><p className="text-[13px] text-[#A4A7AE]">No feedback found matching your filters.</p></td></tr>
                ) : (
                  filteredFeedback.map((fb) => (
                    <tr key={`${programType}-${fb.id}`} className="border-b border-[#EDEEF1] hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3"><p className="text-[12px] text-[#A4A7AE] whitespace-nowrap">{fb.submittedDate}</p></td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] text-[#252B37] truncate max-w-[200px]">{fb.program}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[12px] text-[#717680]">{fb.type}</span>
                          <span className="text-[12px] text-[#E4E6EA]">·</span>
                          <span className="text-[12px] text-[#717680]">{fb.mode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><p className="text-[12px] text-[#717680] whitespace-nowrap">{fb.name}</p></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={cn('w-3.5 h-3.5', i < fb.rating ? 'text-[#4285F4] fill-[#4285F4]' : 'text-[#E4E6EA]')} />))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={cn('w-3 h-3', i < fb.relevancy ? 'text-[#4285F4] fill-[#4285F4]' : 'text-[#E4E6EA]')} />))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={cn('w-3 h-3', i < fb.duration ? 'text-[#8AB4F8] fill-[#8AB4F8]' : 'text-[#E4E6EA]')} />))}
                        </div>
                      </td>
                      <td className="px-4 py-3"><p className="text-[12px] text-[#717680] max-w-[260px] truncate">{fb.feedback}</p></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </FadeValue>
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
}