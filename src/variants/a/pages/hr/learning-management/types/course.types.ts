// ============================================================
// HR Learning Management — Type Definitions
// ============================================================

export type CourseStatus = 'active' | 'pending' | 'completed' | 'draft' | 'rejected' | 'approved' | 'inactive' | 'waiting_approval' | 'need_revision';
export type CoursePriority = 'high' | 'medium' | 'low';
export type CourseType = 'journey' | 'course';
export type LearningMode = 'blended' | 'self-learning';
export type TrainingType = 'compliance' | 'skill';
export type CourseRule = 'mandatory' | 'optional';
export type CourseSource = 'LnD' | 'LinkedIn' | "O'Reilly";

export interface CourseInstructor {
  id: string;
  name: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  type: CourseType;
  status: CourseStatus;
  priority: CoursePriority;
  department: string;
  learningCategory?: string;
  rule?: CourseRule;
  learningStyle?: LearningMode;
  source?: CourseSource;
  createdBy?: string;
  division?: string;
  enrolledCount: number;
  maxCapacity: number;
  completionRate: number;
  startDate: string;
  endDate: string;
  duration: string;
  createdAt: string;
  description?: string;
}

export interface PendingApprovalCourse {
  id: string;
  title: string;
  type: CourseType;
  approvalId: string;
  requestedBy: CourseInstructor;
  department: string;
  estimatedParticipants: number;
  proposedStartDate: string;
  proposedEndDate: string;
  duration: string;
  priority: CoursePriority;
  submittedAt: string;
  description: string;
  budget?: string;
  learningMode: LearningMode;
  trainingType: TrainingType;
}

export interface CourseStats {
  onDraft: number;
  waitingApproval: number;
  needRevision: number;
  approved: number;
  active: number;
  inactive: number;
  /** @deprecated kept for backward compat — derive from above if needed */
  pendingApproval: number;
  totalJourneys: number;
  totalCourses: number;
}

export type CourseFilterTab = 'journey' | 'course';