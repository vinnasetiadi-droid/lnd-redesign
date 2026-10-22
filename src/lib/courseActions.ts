// ============================================================
// Course action matrix — which buttons are live for whom
//
// Three points of view share the versioned course pages, and each
// one unlocks a different set of actions depending on the status of
// the course's latest version. 'na' means the combination can't
// happen at all, so the button is not rendered rather than greyed.
// ============================================================

export type CourseLifecycleStatus =
  | 'on-draft'
  | 'waiting-approval'
  | 'need-revision'
  | 'approved'
  | 'active'
  | 'inactive';

export type CoursePov =
  /** Trainer looking at a course they own. */
  | 'trainer'
  /** Admin looking at a course the admin team authored. */
  | 'admin-own'
  /** Admin reviewing a course submitted by a trainer. */
  | 'admin-trainer';

export type ActionState = 'enabled' | 'disabled' | 'na';

export interface CourseActions {
  editCourse: ActionState;
  createNewVersion: ActionState;
  reject: ActionState;
  approve: ActionState;
}

const E: ActionState = 'enabled';
const D: ActionState = 'disabled';
const NA: ActionState = 'na';

type StatusMap = Record<CourseLifecycleStatus, CourseActions>;

const TRAINER: StatusMap = {
  'on-draft':         { editCourse: E,  createNewVersion: D,  reject: NA, approve: NA },
  'waiting-approval': { editCourse: D,  createNewVersion: D,  reject: NA, approve: NA },
  'need-revision':    { editCourse: E,  createNewVersion: D,  reject: NA, approve: NA },
  approved:           { editCourse: D,  createNewVersion: E,  reject: NA, approve: NA },
  active:             { editCourse: D,  createNewVersion: E,  reject: NA, approve: NA },
  inactive:           { editCourse: D,  createNewVersion: E,  reject: NA, approve: NA },
};

const ADMIN_OWN: StatusMap = {
  'on-draft':         { editCourse: E,  createNewVersion: D,  reject: NA, approve: NA },
  // An admin's own course is never reviewed by anyone, so it never sits in
  // waiting-approval or need-revision — it goes straight from draft to approved.
  'waiting-approval': { editCourse: NA, createNewVersion: NA, reject: NA, approve: NA },
  'need-revision':    { editCourse: NA, createNewVersion: NA, reject: NA, approve: NA },
  approved:           { editCourse: D,  createNewVersion: E,  reject: NA, approve: NA },
  active:             { editCourse: D,  createNewVersion: E,  reject: NA, approve: NA },
  inactive:           { editCourse: D,  createNewVersion: E,  reject: NA, approve: NA },
};

const ADMIN_TRAINER: StatusMap = {
  // A trainer's draft is never visible to the reviewing admin.
  'on-draft':         { editCourse: NA, createNewVersion: NA, reject: NA, approve: NA },
  // While a submission is under review there is nothing to branch from yet,
  // so Create New Version isn't offered at all.
  'waiting-approval': { editCourse: E,  createNewVersion: NA, reject: E,  approve: E },
  // Once sent back, the trainer owns the next move — the admin only watches.
  'need-revision':    { editCourse: NA, createNewVersion: NA, reject: NA, approve: NA },
  approved:           { editCourse: D,  createNewVersion: E,  reject: D,  approve: D },
  active:             { editCourse: D,  createNewVersion: E,  reject: D,  approve: D },
  inactive:           { editCourse: D,  createNewVersion: E,  reject: D,  approve: D },
};

const MATRIX: Record<CoursePov, StatusMap> = {
  trainer: TRAINER,
  'admin-own': ADMIN_OWN,
  'admin-trainer': ADMIN_TRAINER,
};

export function getCourseActions(pov: CoursePov, status: CourseLifecycleStatus): CourseActions {
  return MATRIX[pov][status];
}

/** Human label for a lifecycle status — used by the status chip. */
export const STATUS_LABEL: Record<CourseLifecycleStatus, string> = {
  'on-draft': 'Draft',
  'waiting-approval': 'Pending Approval',
  'need-revision': 'Need Revision',
  approved: 'Approved',
  active: 'Published',
  inactive: 'Inactive',
};

/** Tailwind classes for the status chip, keyed by lifecycle status. */
export const STATUS_CHIP_CLASS: Record<CourseLifecycleStatus, string> = {
  'on-draft': 'bg-gray-100 text-gray-600',
  'waiting-approval': 'bg-amber-50 text-amber-700',
  'need-revision': 'bg-orange-50 text-orange-700',
  approved: 'bg-blue-50 text-blue-700',
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-500',
};

/**
 * One-line summary shown on the left of the sticky action bar, explaining
 * what state the course is in and therefore what the buttons will do.
 */
export function getCourseStatusMessage(
  pov: CoursePov,
  status: CourseLifecycleStatus,
  ctx: { title?: string; author?: string } = {},
): string {
  const who = ctx.author ?? 'a trainer';
  if (pov === 'admin-trainer') {
    switch (status) {
      case 'waiting-approval': return `Submitted by ${who} and awaiting your approval.`;
      case 'need-revision':    return `Sent back to ${who} for revision — they take it from here.`;
      case 'approved':         return `Approved and ready to publish. You can start the next version from here.`;
      case 'active':           return `Published and running. Changes go into a new version.`;
      case 'inactive':         return `No longer running. Changes go into a new version.`;
      default:                 return `This course is not available for review yet.`;
    }
  }
  switch (status) {
    case 'on-draft':         return `Still a draft — it hasn't been submitted for approval yet.`;
    case 'waiting-approval': return `Submitted and awaiting approval. Nothing to change until it comes back.`;
    case 'need-revision':    return `Sent back for revision — update it and submit again.`;
    case 'approved':         return `Approved and ready to publish. Changes go into a new version.`;
    case 'active':           return `Published and running. Changes go into a new version.`;
    case 'inactive':         return `No longer running. Changes go into a new version.`;
  }
}
