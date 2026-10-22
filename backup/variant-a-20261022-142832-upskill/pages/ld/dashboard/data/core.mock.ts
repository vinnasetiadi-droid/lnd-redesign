// ============================================================
// Home's core figures: the single source for every number that shows up on
// more than one card. Cards never type these numbers; they call the helpers
// below. Everything is kept per program type and learning mode, so the All
// tab is always exactly Course + Journey.
// ============================================================

import { currentMonthIndex } from '../period';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type Scope = 'all' | 'course' | 'journey';
export type ProgramType = Exclude<Scope, 'all'>;
export type Mode = 'blended' | 'self';

const TYPES: ProgramType[] = ['course', 'journey'];
const MODES: Mode[] = ['blended', 'self'];

// ── Raw data, January to December 2026 ───────────────────────

/** New enrollments per month */
const NEW_ENROLLMENTS: Record<ProgramType, Record<Mode, number[]>> = {
  course: {
    blended: [4, 5, 7, 6, 8, 10, 12, 7, 10, 12, 10, 13],
    self:    [4, 5, 6, 6, 8, 8, 10, 7, 10, 11, 10, 12],
  },
  journey: {
    blended: [2, 3, 4, 3, 5, 6, 7, 5, 6, 7, 6, 7],
    self:    [2, 2, 3, 3, 4, 4, 5, 3, 4, 6, 5, 6],
  },
};

/** Trainees already enrolled on 1 January */
const ENROLLED_AT_START: Record<ProgramType, Record<Mode, number>> = {
  course:  { blended: 29, self: 16 },
  journey: { blended: 14, self: 10 },
};

/** Programs launched and completed per month */
const LAUNCHED: Record<ProgramType, number[]> = {
  course:  [2, 3, 3, 2, 3, 3, 4, 2, 3, 3, 3, 4],
  journey: [1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2],
};
const COMPLETED: Record<ProgramType, number[]> = {
  course:  [1, 1, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3],
  journey: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
};

/** Completion % per month */
const COMPLETION: Record<ProgramType, Record<Mode, number[]>> = {
  course: {
    blended: [58, 59, 61, 62, 63, 66, 69, 71, 75, 79, 81, 82],
    self:    [44, 46, 47, 49, 50, 52, 55, 57, 60, 63, 65, 66],
  },
  journey: {
    blended: [44, 45, 46, 49, 48, 51, 54, 58, 62, 66, 68, 70],
    self:    [31, 33, 33, 37, 39, 42, 46, 50, 54, 57, 59, 60],
  },
};

/** Blended trainees who attend their live sessions, per month (self-paced has no sessions) */
const ATTENDING: Record<ProgramType, number[]> = {
  course:  [27, 30, 35, 40, 46, 54, 69, 74, 84, 99, 107, 118],
  journey: [12, 14, 17, 20, 24, 30, 36, 40, 46, 53, 58, 64],
};

/** Learning hours so far this year */
const HOURS: Record<ProgramType, Record<Mode, number>> = {
  course:  { blended: 1640, self: 1380 },
  journey: { blended: 1030, self: 770 },
};

// ── Helpers ──────────────────────────────────────────────────

/** Index of the current month in the series */
export const NOW = currentMonthIndex();
/** One quarter before the current month */
export const LAST_QUARTER = Math.max(0, NOW - 3);

const typesOf = (scope: Scope): ProgramType[] => (scope === 'all' ? TYPES : [scope]);
const sum = (arrays: number[][]) => arrays[0].map((_, i) => arrays.reduce((s, a) => s + a[i], 0));
const running = (start: number, monthly: number[]) => {
  let total = start;
  return monthly.map((v) => (total += v));
};

/** New enrollments per month (one mode, or both) */
export function newEnrollments(scope: Scope, mode?: Mode): number[] {
  return sum(typesOf(scope).flatMap((t) => (mode ? [mode] : MODES).map((m) => NEW_ENROLLMENTS[t][m])));
}

/** Enrolled trainees at the end of each month: starting base plus the running sum of new enrollments */
export function enrolled(scope: Scope, mode?: Mode): number[] {
  return sum(
    typesOf(scope).flatMap((t) =>
      (mode ? [mode] : MODES).map((m) => running(ENROLLED_AT_START[t][m], NEW_ENROLLMENTS[t][m])),
    ),
  );
}

export function launched(scope: Scope): number[] {
  return sum(typesOf(scope).map((t) => LAUNCHED[t]));
}

export function completed(scope: Scope): number[] {
  return sum(typesOf(scope).map((t) => COMPLETED[t]));
}

/**
 * Completion % per month, weighted by enrollment: across program types for
 * All, and across modes too when no mode is given.
 */
export function completion(scope: Scope, mode?: Mode): number[] {
  const cells = typesOf(scope).flatMap((t) => (mode ? [mode] : MODES).map((m) => ({ t, m })));
  const weights = cells.map(({ t, m }) => running(ENROLLED_AT_START[t][m], NEW_ENROLLMENTS[t][m]));
  return MONTHS.map((_, i) => {
    const total = weights.reduce((s, w) => s + w[i], 0);
    return cells.reduce((s, { t, m }, c) => s + COMPLETION[t][m][i] * weights[c][i], 0) / total;
  });
}

/** Blended live-session attendance: attending, enrolled and rate per month */
export function attendance(scope: Scope) {
  const attending = sum(typesOf(scope).map((t) => ATTENDING[t]));
  const blended = enrolled(scope, 'blended');
  return attending.map((a, i) => ({ attending: a, enrolled: blended[i], rate: Math.round((a / blended[i]) * 100) }));
}

export function hours(scope: Scope): Record<Mode, number> {
  const types = typesOf(scope);
  return {
    blended: types.reduce((s, t) => s + HOURS[t].blended, 0),
    self: types.reduce((s, t) => s + HOURS[t].self, 0),
  };
}

/** The organisation's completion rate this month, as shown in the KPI card */
export function orgCompletionRate(): number {
  return Math.round(completion('all')[NOW]);
}
