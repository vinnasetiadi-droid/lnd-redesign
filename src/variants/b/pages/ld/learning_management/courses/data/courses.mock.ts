// ============================================================
// Mock data — Course Library
//
// One entry per course. Its status is the live version's status; newer
// draft versions sit in `versions` and show up in the Draft tab as
// "Version N of <course>". Every date is relative to today, every count is
// derived from this list.
// ============================================================

import { daysAgo, daysFromNow, formatDate, timeAgo } from '@/variants/b/pages/ld/dashboard/period';
// Covers from the project's own images (resized copies), so no two courses share a photo
import coverComplianceManual from '@/variants/b/assets/courses/compliance-manual.jpg';
import coverPlanningDesk from '@/variants/b/assets/courses/planning-desk.jpg';
import coverTeamWhiteboard from '@/variants/b/assets/courses/team-whiteboard.jpg';
import coverAbstractShapes from '@/variants/b/assets/courses/abstract-shapes.jpg';

export type CourseStatus =
  | 'on-draft'
  | 'waiting-approval'
  | 'need-revision'
  | 'approved'
  | 'active'
  | 'inactive';

export type CourseLearningType =
  | 'Blended Learning'
  | 'Self Learning';

export type CourseCategory =
  | 'Compliance'
  | 'Onboarding'
  | 'Upskill';

/** One version of a course; older ones are archived, a newer unpublished one is a draft */
export interface CourseVersion {
  version: number;
  status: CourseStatus | 'archived';
  owner: string;
  ownerRole?: 'admin' | 'trainer';
  /** YYYY-MM-DD */
  updatedOn: string;
  /** Drafts: how many sections are ready */
  sectionsReady?: number;
  sectionsTotal?: number;
}

export interface ReviewComment {
  author: string;
  text: string;
}

export interface CourseItem {
  id: string;
  title: string;
  /** Empty when the course has no cover yet (the card draws a fallback) */
  image: string;
  dateRange: string;
  rating: number;
  reviewCount: number;
  status: CourseStatus;
  learningType: CourseLearningType;
  category: CourseCategory;
  level: string;
  description: string;
  updatedAt: string;
  /** Enrolled trainees; always 0 while the course is not live, never above maxCapacity */
  trainees: number;
  /** Active: average completion in percent */
  avgCompletion: number;
  department?: string;
  division?: string;
  duration?: string;
  creator?: string;
  accessFor?: string;
  createdDate?: string;
  /** Who authored the course — decides which admin POV the detail page uses. */
  creatorRole?: 'admin' | 'trainer';
  /** Set when a trainer was invited onto someone else's course — holds the inviter's name. */
  invitedBy?: string;
  /** Admin who signed off the current version, if any. */
  approvedBy?: string;
  approvedDate?: string;
  /** Mandatory vs Open Program. */
  programType?: 'Mandatory' | 'Open Program';
  /** Seat cap for the course. */
  maxCapacity?: number;
  /** Last change (YYYY-MM-DD) */
  updatedOn?: string;
  /** In review: when it was sent for review */
  submittedOn?: string;
  /** In review and approved: first session, always in the future */
  startsOn?: string;
  /** Inactive: when it ended, and how many of the enrolled trainees completed */
  endedOn?: string;
  completed?: number;
  /** Needs revision: what the reviewers asked for */
  reviewComments?: ReviewComment[];
  /** Draft: section completeness */
  sectionsReady?: number;
  sectionsTotal?: number;
  /** Version history, including the live version */
  versions?: CourseVersion[];
  /** Set on a draft version shown as its own list item */
  draftOf?: { courseId: string; version: number };
}

/** Status labels and chip tints (CSS tokens), shared by the tabs, table and cards */
/** bg: the chip tint in tables; text: the label colour on the white badge over a photo */
export const COURSE_STATUS_META: Record<CourseStatus, { label: string; bg: string; text: string }> = {
  'on-draft':         { label: 'Draft',          bg: 'var(--ob-status-draft-bg)',    text: 'var(--ob-text-secondary)' },
  'waiting-approval': { label: 'In review',      bg: 'var(--ob-status-review-bg)',   text: 'var(--ob-attention-text)' },
  'need-revision':    { label: 'Needs revision', bg: 'var(--ob-status-revision-bg)', text: 'var(--ob-danger)' },
  approved:           { label: 'Approved',       bg: 'var(--ob-status-approved-bg)', text: 'var(--ob-success-strong)' },
  active:             { label: 'Active',         bg: 'var(--ob-status-active-bg)',   text: 'var(--ob-primary-strong)' },
  inactive:           { label: 'Inactive',       bg: 'var(--ob-status-inactive-bg)', text: 'var(--ob-text-muted)' },
};

/** Statuses that are not live yet: nobody can be enrolled */
export const NOT_LIVE: CourseStatus[] = ['on-draft', 'waiting-approval', 'need-revision'];

const range = (startDaysAgo: number, endDaysFromNow: number) =>
  `${formatDate(daysAgo(startDaysAgo))} – ${formatDate(daysFromNow(endDaysFromNow))}`;

const COURSES: Omit<CourseItem, 'updatedAt'>[] = [
  {
    id: 'course-9',
    title: 'AI Ethics & Responsible AI Implementation',
    // Abstract shapes instead of a product screenshot: no third-party branding
    image: coverAbstractShapes,
    dateRange: range(60, 30),
    rating: 5.0,
    reviewCount: 8,
    status: 'active',
    learningType: 'Blended Learning',
    category: 'Compliance',
    level: 'Beginner',
    description:
      'Understand the fundamentals of AI ethics and learn practical frameworks for responsible AI deployment in your workplace.',
    trainees: 25,
    avgCompletion: 80,
    department: 'Marketing',
    division: 'Corporate Strategy',
    duration: '6 Hours',
    creator: 'Michael Torres',
    creatorRole: 'trainer',
    approvedBy: 'Marcus Webb',
    approvedDate: formatDate(daysAgo(62)),
    programType: 'Mandatory',
    maxCapacity: 60,
    accessFor: 'All Employee',
    createdDate: formatDate(daysAgo(200)),
    updatedOn: daysAgo(1),
    // Live v3 by Michael Torres; Diana is drafting v4
    versions: [
      { version: 1, status: 'archived', owner: 'Michael Torres', ownerRole: 'trainer', updatedOn: daysAgo(200) },
      { version: 2, status: 'archived', owner: 'Michael Torres', ownerRole: 'trainer', updatedOn: daysAgo(140) },
      { version: 3, status: 'active', owner: 'Michael Torres', ownerRole: 'trainer', updatedOn: daysAgo(1) },
      { version: 4, status: 'on-draft', owner: 'Diana Hartwell', ownerRole: 'admin', updatedOn: daysAgo(0), sectionsReady: 3, sectionsTotal: 6 },
    ],
  },
  {
    id: 'course-11',
    title: 'Data Privacy Essentials',
    image: coverComplianceManual,
    dateRange: range(240, 45),
    rating: 4.6,
    reviewCount: 12,
    status: 'active',
    learningType: 'Self Learning',
    category: 'Compliance',
    level: 'Beginner',
    description:
      'Version 2 of the privacy essentials course is being drafted while Version 1 stays live for enrolled trainees.',
    trainees: 32,
    avgCompletion: 74,
    department: 'Legal',
    division: 'Corporate Strategy',
    duration: '3 Hours',
    creator: 'Diana Hartwell',
    creatorRole: 'admin',
    approvedBy: 'Marcus Webb',
    approvedDate: formatDate(daysAgo(245)),
    programType: 'Mandatory',
    maxCapacity: 60,
    accessFor: 'All Employee',
    createdDate: formatDate(daysAgo(250)),
    updatedOn: daysAgo(7),
    // Live v1; v2 is a draft
    versions: [
      { version: 1, status: 'active', owner: 'Diana Hartwell', ownerRole: 'admin', updatedOn: daysAgo(240) },
      { version: 2, status: 'on-draft', owner: 'Diana Hartwell', ownerRole: 'admin', updatedOn: daysAgo(7), sectionsReady: 4, sectionsTotal: 5 },
    ],
  },
  {
    id: 'course-2',
    title: 'Marketing Fundamentals Bootcamp',
    image: 'https://images.unsplash.com/photo-1759393851741-674ee71fb498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBzdHJhdGVneSUyMGRpZ2l0YWwlMjBjYW1wYWlnbnxlbnwxfHx8fDE3NzI2MTQwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: range(-12, 40),
    rating: 4.8,
    reviewCount: 12,
    status: 'approved',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Master the fundamentals of modern marketing including branding, digital campaigns, customer acquisition, and marketing analytics.',
    // Pre-registered seats before the start date
    trainees: 22,
    avgCompletion: 0,
    department: 'Marketing',
    division: 'Commercial',
    duration: '6 Hours',
    creator: 'Marcus Webb',
    creatorRole: 'admin',
    approvedBy: 'Diana Hartwell',
    approvedDate: formatDate(daysAgo(8)),
    programType: 'Open Program',
    maxCapacity: 25,
    accessFor: 'Singapore, Turkey, Dubai',
    createdDate: formatDate(daysAgo(60)),
    updatedOn: daysAgo(8),
    startsOn: daysFromNow(12),
    versions: [
      { version: 1, status: 'archived', owner: 'Marcus Webb', ownerRole: 'admin', updatedOn: daysAgo(45) },
      { version: 2, status: 'approved', owner: 'Marcus Webb', ownerRole: 'admin', updatedOn: daysAgo(8) },
    ],
  },
  {
    id: 'course-3',
    title: 'Cybersecurity Awareness',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZGlnaXRhbCUyMHByb3RlY3Rpb24lMjBzaGllbGR8ZW58MXx8fHwxNzcyNTI5NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: range(30, 60),
    rating: 4.9,
    reviewCount: 15,
    status: 'active',
    learningType: 'Self Learning',
    category: 'Compliance',
    level: 'Beginner',
    description:
      'Learn essential cybersecurity practices to protect company data, recognize threats, and maintain a secure digital workplace.',
    trainees: 45,
    avgCompletion: 64,
    department: 'IT',
    division: 'Technology',
    duration: '4 Hours',
    creator: 'Diana Hartwell',
    creatorRole: 'admin',
    approvedBy: 'Marcus Webb',
    approvedDate: formatDate(daysAgo(32)),
    programType: 'Mandatory',
    maxCapacity: 60,
    accessFor: 'Grade 1, Grade 2, Grade 3',
    createdDate: formatDate(daysAgo(150)),
    updatedOn: daysAgo(4),
    versions: [
      { version: 1, status: 'archived', owner: 'Diana Hartwell', ownerRole: 'admin', updatedOn: daysAgo(150) },
      { version: 2, status: 'archived', owner: 'Diana Hartwell', ownerRole: 'admin', updatedOn: daysAgo(90) },
      { version: 3, status: 'active', owner: 'Diana Hartwell', ownerRole: 'admin', updatedOn: daysAgo(4) },
    ],
  },
  {
    id: 'course-4',
    title: 'Excellent Customer Service',
    image: 'https://images.unsplash.com/photo-1772464843208-ec4fa4785431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0JTIwdGVhbXxlbnwxfHx8fDE3NzI1NDQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: `${formatDate(daysAgo(100))} – ${formatDate(daysAgo(40))}`,
    rating: 4.7,
    reviewCount: 20,
    status: 'inactive',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Develop exceptional customer service skills including empathy, problem resolution, and creating memorable customer experiences.',
    trainees: 35,
    avgCompletion: 89,
    department: 'Customer Experience',
    division: 'Service',
    duration: '5 Hours',
    creator: 'Marcus Webb',
    creatorRole: 'admin',
    approvedBy: 'Diana Hartwell',
    approvedDate: formatDate(daysAgo(105)),
    programType: 'Open Program',
    maxCapacity: 40,
    accessFor: 'Selected People',
    createdDate: formatDate(daysAgo(160)),
    updatedOn: daysAgo(32),
    endedOn: daysAgo(40),
    completed: 31,
    versions: [
      { version: 1, status: 'archived', owner: 'Marcus Webb', ownerRole: 'admin', updatedOn: daysAgo(160) },
      { version: 2, status: 'inactive', owner: 'Marcus Webb', ownerRole: 'admin', updatedOn: daysAgo(32) },
    ],
  },
  {
    id: 'course-6',
    title: 'Digital Marketing Essentials',
    image: 'https://images.unsplash.com/photo-1762341112870-1eb70d45b23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2R1Y3Rpdml0eSUyMGRpZ2l0YWwlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzcyNjExOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: range(-12, 42),
    rating: 4.4,
    reviewCount: 8,
    status: 'waiting-approval',
    learningType: 'Self Learning',
    category: 'Upskill',
    level: 'Beginner',
    description:
      'Learn the essentials of digital marketing including SEO, SEM, social media advertising, and content marketing strategies.',
    trainees: 0,
    avgCompletion: 0,
    department: 'Marketing',
    division: 'Commercial',
    duration: '5 Hours',
    creator: 'Rina Wijaya',
    creatorRole: 'trainer',
    programType: 'Open Program',
    maxCapacity: 35,
    accessFor: 'Marketing, Commercial',
    createdDate: formatDate(daysAgo(20)),
    updatedOn: daysAgo(2),
    submittedOn: daysAgo(2),
    startsOn: daysFromNow(12),
  },
  {
    id: 'course-12',
    title: 'Business Writing for Managers',
    image: coverPlanningDesk,
    dateRange: range(-20, 50),
    rating: 0,
    reviewCount: 0,
    status: 'waiting-approval',
    learningType: 'Self Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Write clear updates, proposals and feedback that busy stakeholders read and act on.',
    trainees: 0,
    avgCompletion: 0,
    department: 'People Development',
    division: 'Corporate Strategy',
    duration: '4 Hours',
    // Diana's own submission: another admin has to review it
    creator: 'Diana Hartwell',
    creatorRole: 'admin',
    programType: 'Open Program',
    maxCapacity: 30,
    accessFor: 'All Employee',
    createdDate: formatDate(daysAgo(14)),
    updatedOn: daysAgo(1),
    submittedOn: daysAgo(1),
    startsOn: daysFromNow(20),
  },
  {
    id: 'course-7',
    title: 'Marketing Analytics & Performance Tracking',
    image: 'https://images.unsplash.com/photo-1739298061740-5ed03045b280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZSUyMG1lZXRpbmd8ZW58MXx8fHwxNzcyNTk4MDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: range(-30, 60),
    rating: 4.6,
    reviewCount: 14,
    status: 'need-revision',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Master marketing analytics tools and techniques to track campaign performance, measure ROI, and optimize marketing strategies.',
    trainees: 0,
    avgCompletion: 0,
    department: 'Marketing',
    division: 'Commercial',
    duration: '6 Hours',
    creator: 'Kevin Brooks',
    creatorRole: 'trainer',
    programType: 'Mandatory',
    maxCapacity: 40,
    accessFor: 'Marketing, Commercial, Sales',
    createdDate: formatDate(daysAgo(30)),
    updatedOn: daysAgo(5),
    reviewComments: [
      { author: 'Diana Hartwell', text: 'Module 3 needs a worked ROI example before learners try the exercise.' },
      { author: 'Marcus Webb', text: 'Add the campaign dashboard screenshots the quiz refers to.' },
    ],
  },
  {
    id: 'course-13',
    title: 'Customer Onboarding Playbook',
    image: coverTeamWhiteboard,
    dateRange: range(-25, 45),
    rating: 0,
    reviewCount: 0,
    status: 'need-revision',
    learningType: 'Blended Learning',
    category: 'Onboarding',
    level: 'Beginner',
    description:
      'A step-by-step playbook for welcoming new customers, from the kickoff call to the first business review.',
    trainees: 0,
    avgCompletion: 0,
    department: 'Customer Experience',
    division: 'Service',
    duration: '3 Hours',
    creator: 'Liam Martinez',
    creatorRole: 'trainer',
    programType: 'Open Program',
    maxCapacity: 20,
    accessFor: 'Customer Experience',
    createdDate: formatDate(daysAgo(18)),
    updatedOn: daysAgo(3),
    reviewComments: [
      { author: 'Marcus Webb', text: 'The welcome call script is missing; trainees need it before session 2.' },
    ],
  },
  {
    id: 'course-8',
    title: 'Developing Organizational Culture & Leadership',
    image: 'https://images.unsplash.com/photo-1764908912200-a516ab1a9b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwdHJhaW5pbmclMjBwcm9mZXNzaW9uYWwlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzI2MTE5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: range(-19, 60),
    rating: 4.7,
    reviewCount: 18,
    status: 'approved',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Develop essential leadership competencies, organizational culture strategies, and professional growth mindset to advance your career.',
    trainees: 12,
    avgCompletion: 0,
    department: 'HR',
    division: 'People Development',
    duration: '6 Hours',
    creator: 'Maria Gonzalez',
    creatorRole: 'trainer',
    approvedBy: 'Marcus Webb',
    approvedDate: formatDate(daysAgo(14)),
    programType: 'Open Program',
    maxCapacity: 25,
    accessFor: 'All Employee',
    createdDate: formatDate(daysAgo(40)),
    updatedOn: daysAgo(14),
    startsOn: daysFromNow(19),
    versions: [
      { version: 1, status: 'approved', owner: 'Maria Gonzalez', ownerRole: 'trainer', updatedOn: daysAgo(14) },
    ],
  },
  {
    id: 'course-10',
    title: 'Metabase 101',
    image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzJTIwc2NyZWVufGVufDF8fHx8MTc3MjUzODMzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: `${formatDate(daysAgo(80))} – ${formatDate(daysAgo(25))}`,
    rating: 4.6,
    reviewCount: 5,
    status: 'inactive',
    learningType: 'Self Learning',
    category: 'Onboarding',
    level: 'Beginner',
    description:
      'Get started with Metabase for data exploration, building dashboards, and sharing insights across your team.',
    trainees: 16,
    avgCompletion: 75,
    department: 'Data & Insight',
    division: 'Data Analytic',
    duration: '3 Hours',
    creator: 'Fatima Al-Rashid',
    creatorRole: 'trainer',
    approvedBy: 'Marcus Webb',
    approvedDate: formatDate(daysAgo(85)),
    programType: 'Open Program',
    maxCapacity: 30,
    accessFor: 'Data & Insight, Product, Engineering',
    createdDate: formatDate(daysAgo(120)),
    updatedOn: daysAgo(21),
    endedOn: daysAgo(25),
    completed: 12,
    versions: [
      { version: 1, status: 'archived', owner: 'Fatima Al-Rashid', ownerRole: 'trainer', updatedOn: daysAgo(120) },
      { version: 2, status: 'inactive', owner: 'Fatima Al-Rashid', ownerRole: 'trainer', updatedOn: daysAgo(21) },
    ],
  },
];

// Relative "updated" text follows the date, so the two never disagree
export const COURSES_MOCK: CourseItem[] = COURSES.map((c) => ({ ...c, updatedAt: c.updatedOn ? timeAgo(c.updatedOn) : '' }));

// ── Covers ───────────────────────────────────────────────────

const imageUses = COURSES_MOCK.reduce(
  (uses, c) => (c.image ? uses.set(c.image, (uses.get(c.image) ?? 0) + 1) : uses),
  new Map<string, number>(),
);

/** The course's own photo, or '' when it has none or shares it with another course (the UI draws a tinted cover) */
export function coverImageOf(c: CourseItem): string {
  return c.image && imageUses.get(c.image) === 1 ? c.image : '';
}

// ── Versions ─────────────────────────────────────────────────

/** The live version's number (the one the course row is about) */
export function liveVersionOf(c: CourseItem): number {
  if (c.draftOf) return c.draftOf.version;
  const versions = c.versions ?? [];
  const live = versions.filter((v) => v.status !== 'on-draft' && v.status !== 'archived');
  const pool = live.length ? live : versions;
  return pool.length ? Math.max(...pool.map((v) => v.version)) : 1;
}

/** Draft versions newer than the live one */
export function draftVersionsOf(c: CourseItem): CourseVersion[] {
  const live = liveVersionOf(c);
  return (c.versions ?? []).filter((v) => v.status === 'on-draft' && v.version > live);
}

/** A draft version as its own list item: Draft tab and version rows ("Version N of <course>") */
export function draftItemsOf(c: CourseItem): CourseItem[] {
  return draftVersionsOf(c).map((v) => ({
    ...c,
    id: `${c.id}-v${v.version}`,
    status: 'on-draft' as const,
    creator: v.owner,
    creatorRole: v.ownerRole ?? c.creatorRole,
    updatedOn: v.updatedOn,
    updatedAt: timeAgo(v.updatedOn),
    trainees: 0,
    avgCompletion: 0,
    sectionsReady: v.sectionsReady,
    sectionsTotal: v.sectionsTotal,
    draftOf: { courseId: c.id, version: v.version },
  }));
}

// Two or more courses (or draft versions) per status, so every tab has content.
// Counted from the list, so they always match it.
const countStatus = (status: CourseStatus) =>
  status === 'on-draft'
    ? COURSES_MOCK.reduce((n, c) => n + (c.status === 'on-draft' ? 1 : 0) + draftVersionsOf(c).length, 0)
    : COURSES_MOCK.filter((c) => c.status === status).length;
export const COURSE_STATS = {
  onDraft: countStatus('on-draft'),
  waitingApproval: countStatus('waiting-approval'),
  needRevision: countStatus('need-revision'),
  approved: countStatus('approved'),
  active: countStatus('active'),
  inactive: countStatus('inactive'),
};

// ── Course version data (for admin overview pages) ────────
export interface AdminCourseVersion {
  version: number;
  label: string;
  lastUpdated: string;
  status: 'current' | 'latest' | 'archived';
}

/** Derived from `versions`: the live version is current, a newer draft is latest */
export const ADMIN_COURSE_VERSIONS: Record<string, AdminCourseVersion[]> = Object.fromEntries(
  COURSES_MOCK.filter((c) => c.versions?.length).map((c) => [
    c.id,
    c.versions!.map((v) => ({
      version: v.version,
      label: `Version ${v.version}`,
      lastUpdated: formatDate(v.updatedOn),
      status: v.status === 'archived' ? 'archived' : v.status === 'on-draft' ? 'latest' : 'current',
    })),
  ]),
);

// ── Per-version content overrides (description / skills / objectives / topic count) ─
export interface CourseVersionOverride {
  description?: string;
  duration?: string;
  level?: string;
  objectives?: string[];
  skills?: string[];
  /** How many topics to show — slice from the full topic list. */
  topicCount?: number;
}

export const COURSE_VERSION_OVERRIDES: Record<string, Record<number, CourseVersionOverride>> = {
  'course-9': {
    1: {
      description:
        'Initial release of Metabase 101. Covers the basics of connecting a data source and running your first queries.',
      duration: '4h 30m',
      level: 'Beginner',
      objectives: [
        'Connect a data source to Metabase',
        'Run basic queries from the question builder',
        'Save and share simple charts',
      ],
      skills: ['Metabase Basics', 'SQL Fundamentals', 'Data Visualization'],
      topicCount: 1,
    },
    2: {
      description:
        'Expanded coverage with dashboards and collections. Adds collaborative features, scheduled reports, and an intro to permissions.',
      duration: '6h 15m',
      level: 'Beginner',
      objectives: [
        'Connect multiple data sources to Metabase',
        'Build interactive dashboards with filters',
        'Organize content using collections and pinned items',
        'Schedule reports and email digests',
      ],
      skills: ['Metabase Basics', 'SQL Fundamentals', 'Dashboard Building', 'Data Visualization', 'Collaboration'],
      topicCount: 2,
    },
    3: {
      description:
        'Full curriculum including admin tooling, embeddable dashboards, advanced SQL, and AI-assisted question generation. Recommended for new platform owners and lead analysts.',
      duration: '9h 45m',
      level: 'Intermediate',
      objectives: [
        'Connect and govern multiple production data sources',
        'Build interactive dashboards with parameterised filters',
        'Author advanced SQL questions with variables and snippets',
        'Configure permissions, sandboxing, and embedded analytics',
        'Use AI assist to generate and refine questions',
      ],
      skills: ['Metabase Admin', 'Advanced SQL', 'Dashboard Building', 'Embedded Analytics', 'Permissions Modeling', 'AI Assist', 'Data Storytelling'],
      topicCount: 3,
    },
  },
};