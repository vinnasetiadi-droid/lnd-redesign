// ============================================================
// L&D Team Dashboard — Type Definitions
// ============================================================

export interface LDProfile {
  name: string;
  role: string;
  position?: string;
  department: string;
  phone?: string;
  email?: string;
  location?: string;
  company?: string;
  stats: {
    tenure: { value: number; unit: string };
    programsManaged: number;
    instructorsManaged: number;
  };
}

export interface LDMetricCard {
  key: string;
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  /** Short hint under the title, e.g. what the number counts */
  hint?: string;
}

export interface NisaInsight {
  title: string;
  description: string;
  cta: string;
}

export type ProgramStatus = 'active' | 'planning' | 'completed' | 'paused';

export type ProgramType = 'Skill Training' | 'Compliance';
export type ProgramMode = 'Self Learning' | 'Blended Learning';

/** A dashboard program is either a single course or a multi-course journey. */
export type ProgramKind = 'course' | 'journey';

export interface ProgramOverview {
  id: string;
  kind: ProgramKind;
  name: string;
  participants: number;
  completionRate: number;
  status: ProgramStatus;
  instructorsCount: number;
  type: ProgramType;
  mode: ProgramMode;
  duration?: string;
  startDate?: string;
  endDate?: string;
  /** Why the program needs attention; shown in the attention orange */
  risk?: string;
  /** Kind of problem behind `risk`, when it is one of the attention flags */
  riskFlag?: AttentionFlag;
  /** Journeys: number of modules, for the segmented progress bar */
  modules?: number;
  /** Next end date (YYYY-MM-DD), for "ends 28 Oct" and the Ending soon filter */
  endsOn?: string;
}

export type ActivityColorScheme = 'blue' | 'green' | 'purple';

export interface ActivityItem {
  id: string;
  personName: string;
  action: string;
  timeAgo: string;
  colorScheme: ActivityColorScheme;
}

export type QuickActionIcon = 'Plus' | 'UserPlus' | 'BarChart3' | 'Bell';

export interface QuickAction {
  id: string;
  label: string;
  iconName: QuickActionIcon;
}

export interface ChartDataPoint {
  month: string;
  launched: number;
  completed: number;
  participants: number;
}

// ── HR Approval Progress ──────────────────────────────────────

export type CourseApprovalStatus =
  | 'On Draft'
  | 'Waiting for Approval'
  | 'Need Revision'
  | 'Approved'
  | 'Active'
  | 'Inactive'
  | 'Under Review'
  | 'Pending Review';

export type ProgramApprovalType = 'Journey' | 'Course';

export interface CourseApproval {
  id: string;
  programName: string;
  programType: ProgramApprovalType;
  approvalId: string;
  status: CourseApprovalStatus;
  submissionDate: string;
  latestActivity: string;
  latestActivityTime: string;
}

// ── Recent Courses ────────────────────────────────────────────

export interface RecentCourse {
  id: string;
  kind: ProgramKind;
  name: string;
  type: 'launched' | 'updated';
  /** Date this program (or, when updated, this version) was published. */
  date: string;
  /** Who created the program. */
  creator: string;
  /** Only set for updated programs, e.g. "Version 3". */
  version?: string;
}

// ── Courses Needing Attention ─────────────────────────────────

export type AttentionFlag = 'low-completion' | 'low-rating' | 'high-dropoff';

export interface CourseAttention {
  id: string;
  name: string;
  flag: AttentionFlag;
  value: string;
  description: string;
}