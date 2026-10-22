// ============================================================
// Mock data — Course Library
// ============================================================

import { daysAgo, daysFromNow } from '@/variants/a/pages/ld/dashboard/period';

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

export interface CourseItem {
  id: string;
  title: string;
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
  trainees: number;
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
  /** Why the reviewer sent this back — set when status is 'need-revision'. */
  rejectionReason?: string;
  /** Mandatory vs Open Program. */
  programType?: 'Mandatory' | 'Open Program';
  /** Seat cap for the course. */
  maxCapacity?: number;
  /** Last change (YYYY-MM-DD), relative to today so the list never looks stale */
  updatedOn?: string;
  /** When it was sent for review (in review only) */
  submittedOn?: string;
  /** First session, for courses that are approved or in review but not running yet */
  startsOn?: string;
}

/** Status labels and dot colours (CSS tokens), shared by the tabs, table and cards */
export const COURSE_STATUS_META: Record<CourseStatus, { label: string; dot: string }> = {
  'on-draft':         { label: 'Draft',          dot: 'var(--oa-text-subtle)' },
  'waiting-approval': { label: 'In review',      dot: 'var(--oa-warning)' },
  'need-revision':    { label: 'Needs revision', dot: 'var(--oa-danger-bright)' },
  approved:           { label: 'Approved',       dot: 'var(--oa-success-bright)' },
  active:             { label: 'Active',         dot: 'var(--oa-primary)' },
  inactive:           { label: 'Inactive',       dot: 'var(--oa-border-control)' },
};

/** Statuses that are not live yet: nobody can be enrolled */
export const NOT_LIVE: CourseStatus[] = ['on-draft', 'waiting-approval', 'need-revision'];

// A trainer's draft is private to that trainer — it only reaches the admin
// library once it has been submitted for approval.
export const COURSES_MOCK: CourseItem[] = [
  {
    id: 'course-1',
    updatedOn: daysAgo(0),
    title: 'AI Ethics & Responsible AI Implementation',
    image:
      'https://images.unsplash.com/photo-1675557009483-e6cf3867976b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBtYWNoaW5lJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcyNjExOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '16 March 2026 – 17 March 2026',
    rating: 5.0,
    reviewCount: 8,
    status: 'on-draft',
    learningType: 'Blended Learning',
    category: 'Compliance',
    level: 'Beginner',
    description:
      'Understand the fundamentals of AI ethics and learn practical frameworks for responsible AI deployment in your workplace.',
    updatedAt: 'Today',
    trainees: 25,
    avgCompletion: 80,
    department: 'Marketing',
    division: 'Corporate Strategy',
    duration: '6 Hours',
    creator: 'Diana Hartwell',
    creatorRole: 'admin',
    programType: 'Mandatory',
    maxCapacity: 40,
    accessFor: 'All Employee',
    createdDate: '17-03-2026',
  },
  {
    id: 'course-11',
    updatedOn: daysAgo(7),
    title: 'Data Privacy Essentials',
    image:
      'https://images.unsplash.com/photo-1675557009483-e6cf3867976b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBtYWNoaW5lJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcyNjExOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '12 February 2026 – 12 March 2026',
    rating: 4.6,
    reviewCount: 12,
    status: 'on-draft',
    learningType: 'Self Learning',
    category: 'Compliance',
    level: 'Beginner',
    description:
      'Version 2 of the privacy essentials course is being drafted while Version 1 stays live for enrolled trainees.',
    updatedAt: 'Today',
    trainees: 32,
    avgCompletion: 74,
    department: 'Legal',
    division: 'Corporate Strategy',
    duration: '3 Hours',
    creator: 'Diana Hartwell',
    creatorRole: 'admin',
    programType: 'Mandatory',
    maxCapacity: 60,
    accessFor: 'All Employee',
    createdDate: '12-02-2026',
  },
  {
    id: 'course-2',
    updatedOn: daysAgo(8),
    startsOn: daysFromNow(12),
    title: 'Marketing Fundamentals Bootcamp',
    image:
      'https://images.unsplash.com/photo-1759393851741-674ee71fb498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBzdHJhdGVneSUyMGRpZ2l0YWwlMjBjYW1wYWlnbnxlbnwxfHx8fDE3NzI2MTQwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '24 February 2026 – 24 March 2026',
    rating: 4.8,
    reviewCount: 12,
    status: 'approved',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Master the fundamentals of modern marketing including branding, digital campaigns, customer acquisition, and marketing analytics.',
    updatedAt: '17 days ago',
    trainees: 30,
    avgCompletion: 0,
    department: 'Marketing',
    division: 'Commercial',
    duration: '6 Hours',
    creator: 'Marcus Webb',
    creatorRole: 'admin',
    approvedBy: 'Diana Hartwell',
    approvedDate: '12 April 2026',
    programType: 'Open Program',
    maxCapacity: 25,
    accessFor: 'Singapore, Turkey, Dubai',
    createdDate: '24-02-2026',
  },
  {
    id: 'course-3',
    updatedOn: daysAgo(4),
    title: 'Cybersecurity Awareness',
    image:
      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZGlnaXRhbCUyMHByb3RlY3Rpb24lMjBzaGllbGR8ZW58MXx8fHwxNzcyNTI5NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '17 February 2026 – 17 March 2026',
    rating: 4.9,
    reviewCount: 15,
    status: 'active',
    learningType: 'Self Learning',
    category: 'Compliance',
    level: 'Beginner',
    description:
      'Learn essential cybersecurity practices to protect company data, recognize threats, and maintain a secure digital workplace.',
    updatedAt: '1 month ago',
    trainees: 45,
    avgCompletion: 0,
    department: 'IT',
    division: 'Technology',
    duration: '4 Hours',
    creator: 'Diana Hartwell',
    creatorRole: 'admin',
    approvedBy: 'Diana Hartwell',
    approvedDate: '12 April 2026',
    programType: 'Mandatory',
    maxCapacity: 60,
    accessFor: 'Grade 1, Grade 2, Grade 3',
    createdDate: '17-02-2026',
  },
  {
    id: 'course-4',
    updatedOn: daysAgo(32),
    title: 'Excellent Customer Service',
    image:
      'https://images.unsplash.com/photo-1772464843208-ec4fa4785431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0JTIwdGVhbXxlbnwxfHx8fDE3NzI1NDQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '17 January 2026 – 17 February 2026',
    rating: 4.7,
    reviewCount: 20,
    status: 'inactive',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Develop exceptional customer service skills including empathy, problem resolution, and creating memorable customer experiences.',
    updatedAt: '2 months ago',
    trainees: 35,
    avgCompletion: 0,
    department: 'Customer Experience',
    division: 'Service',
    duration: '5 Hours',
    creator: 'Marcus Webb',
    creatorRole: 'admin',
    approvedBy: 'Diana Hartwell',
    approvedDate: '12 April 2026',
    programType: 'Open Program',
    maxCapacity: 30,
    accessFor: 'Selected People',
    createdDate: '17-01-2026',
  },
  {
    id: 'course-6',
    updatedOn: daysAgo(2),
    submittedOn: daysAgo(2),
    startsOn: daysFromNow(12),
    title: 'Digital Marketing Essentials',
    image:
      'https://images.unsplash.com/photo-1762341112870-1eb70d45b23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2R1Y3Rpdml0eSUyMGRpZ2l0YWwlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzcyNjExOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '17 November 2025 – 17 December 2025',
    rating: 4.4,
    reviewCount: 8,
    status: 'waiting-approval',
    learningType: 'Self Learning',
    category: 'Upskill',
    level: 'Beginner',
    description:
      'Learn the essentials of digital marketing including SEO, SEM, social media advertising, and content marketing strategies.',
    updatedAt: '2 months ago',
    trainees: 22,
    avgCompletion: 100,
    department: 'Marketing',
    division: 'Commercial',
    duration: '5 Hours',
    creator: 'Rina Wijaya',
    creatorRole: 'trainer',
    programType: 'Open Program',
    maxCapacity: 35,
    accessFor: 'Marketing, Commercial',
    createdDate: '17-11-2025',
  },
  {
    id: 'course-7',
    updatedOn: daysAgo(5),
    title: 'Marketing Analytics & Performance Tracking',
    image:
      'https://images.unsplash.com/photo-1739298061740-5ed03045b280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZSUyMG1lZXRpbmd8ZW58MXx8fHwxNzcyNTk4MDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '5 October 2025 – 5 November 2025',
    rating: 4.6,
    reviewCount: 14,
    status: 'need-revision',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Master marketing analytics tools and techniques to track campaign performance, measure ROI, and optimize marketing strategies.',
    updatedAt: '4 months ago',
    trainees: 28,
    avgCompletion: 36,
    department: 'Marketing',
    division: 'Commercial',
    duration: '6 Hours',
    creator: 'Kevin Brooks',
    creatorRole: 'trainer',
    programType: 'Mandatory',
    maxCapacity: 40,
    accessFor: 'Marketing, Commercial, Sales',
    createdDate: '05-10-2025',
  },
  {
    id: 'course-8',
    updatedOn: daysAgo(14),
    startsOn: daysFromNow(19),
    title: 'Developing Organizational Culture & Leadership',
    image:
      'https://images.unsplash.com/photo-1764908912200-a516ab1a9b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwdHJhaW5pbmclMjBwcm9mZXNzaW9uYWwlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzI2MTE5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '5 January 2026 – 5 March 2026',
    rating: 4.7,
    reviewCount: 18,
    status: 'approved',
    learningType: 'Blended Learning',
    category: 'Upskill',
    level: 'Intermediate',
    description:
      'Develop essential leadership competencies, organizational culture strategies, and professional growth mindset to advance your career.',
    updatedAt: '2 months ago',
    trainees: 12,
    avgCompletion: 80,
    department: 'HR',
    division: 'People Development',
    duration: '6 Hours',
    creator: 'Maria Gonzalez',
    creatorRole: 'trainer',
    approvedBy: 'Marcus Webb',
    approvedDate: '12 April 2026',
    programType: 'Open Program',
    maxCapacity: 25,
    accessFor: 'All Employee',
    createdDate: '05-01-2026',
  },
  {
    id: 'course-9',
    updatedOn: daysAgo(1),
    title: 'AI Ethics & Responsible AI Implementation',
    image:
      'https://images.unsplash.com/photo-1675557009483-e6cf3867976b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBtYWNoaW5lJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcyNjExOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '16 March 2026 – 17 March 2026',
    rating: 5.0,
    reviewCount: 8,
    status: 'active',
    learningType: 'Blended Learning',
    category: 'Compliance',
    level: 'Beginner',
    description:
      'Understand the fundamentals of AI ethics and learn practical frameworks for responsible AI deployment in your workplace.',
    updatedAt: 'Today',
    trainees: 25,
    avgCompletion: 80,
    department: 'Marketing',
    division: 'Corporate Strategy',
    duration: '6 Hours',
    creator: 'Michael Torres',
    creatorRole: 'trainer',
    approvedBy: 'Marcus Webb',
    approvedDate: '12 April 2026',
    programType: 'Mandatory',
    maxCapacity: 60,
    accessFor: 'All Employee',
    createdDate: '17-03-2026',
  },
  {
    id: 'course-10',
    updatedOn: daysAgo(21),
    title: 'Metabase 101',
    image:
      'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzJTIwc2NyZWVufGVufDF8fHx8MTc3MjUzODMzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    dateRange: '28 February 2026 – 28 March 2026',
    rating: 4.6,
    reviewCount: 5,
    status: 'inactive',
    learningType: 'Self Learning',
    category: 'Onboarding',
    level: 'Beginner',
    description:
      'Get started with Metabase for data exploration, building dashboards, and sharing insights across your team.',
    updatedAt: '2 days ago',
    trainees: 16,
    avgCompletion: 50,
    department: 'Data & Insight',
    division: 'Data Analytic',
    duration: '3 Hours',
    creator: 'Fatima Al-Rashid',
    creatorRole: 'trainer',
    approvedBy: 'Marcus Webb',
    approvedDate: '12 April 2026',
    programType: 'Open Program',
    maxCapacity: 30,
    accessFor: 'Data & Insight, Product, Engineering',
    createdDate: '28-02-2026',
  },

];

// Two courses per lifecycle status: one authored by the admin team, one by a
// trainer. Counted from the list, so they always match it.
const countStatus = (status: CourseStatus) => COURSES_MOCK.filter((c) => c.status === status).length;
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

export const ADMIN_COURSE_VERSIONS: Record<string, AdminCourseVersion[]> = {
  // An admin course with a second version still in draft: Version 1 is live,
  // Version 2 is the draft — deleting it leaves the course on Version 1.
  'course-11': [
    { version: 1, label: 'Version 1', lastUpdated: '12 February 2026', status: 'current' },
    { version: 2, label: 'Version 2', lastUpdated: 'Today', status: 'latest' },
  ],
  // Only courses that have cleared review carry a version history. Drafts and
  // submissions still under review have nothing to switch between yet.
  'course-2': [
    { version: 1, label: 'Version 1', lastUpdated: '28 February 2026', status: 'archived' },
    { version: 2, label: 'Version 2', lastUpdated: '20 March 2026', status: 'current' },
  ],
  'course-3': [
    { version: 1, label: 'Version 1', lastUpdated: '10 January 2026', status: 'archived' },
    { version: 2, label: 'Version 2', lastUpdated: '5 February 2026', status: 'archived' },
    { version: 3, label: 'Version 3', lastUpdated: '1 March 2026', status: 'current' },
  ],
  'course-4': [
    { version: 1, label: 'Version 1', lastUpdated: '12 January 2026', status: 'archived' },
    { version: 2, label: 'Version 2', lastUpdated: '18 February 2026', status: 'current' },
  ],
  'course-8': [
    { version: 1, label: 'Version 1', lastUpdated: '2 March 2026', status: 'current' },
  ],
  'course-9': [
    { version: 1, label: 'Version 1', lastUpdated: '28 February 2026', status: 'archived' },
    { version: 2, label: 'Version 2', lastUpdated: '15 March 2026', status: 'current' },
    { version: 3, label: 'Version 3', lastUpdated: '10 April 2026', status: 'latest' },
  ],
  'course-10': [
    { version: 1, label: 'Version 1', lastUpdated: '20 January 2026', status: 'archived' },
    { version: 2, label: 'Version 2', lastUpdated: '26 February 2026', status: 'current' },
  ],
};

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