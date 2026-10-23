// Course status chip, drawn from the one source (COURSE_STATUS_META), after
// the references' "• Active" chips: a tint of the status colour, a small dot
// in the status colour and the label in it, 8px corners.

import { cn } from '@/lib/utils';
import { COURSE_STATUS_META, type CourseStatus } from '../data/courses.mock';

/** Frosted white over the photo, shared by the status badge and the menu button */
export const GLASS = 'rounded-(--oc-radius-chip) bg-(--oc-white)/70 ring-1 ring-(--oc-white)/60 backdrop-blur-md shadow-[0_1px_3px_rgba(10,25,41,0.12)]';

/** The stronger shade of each status, for the dot */
const STATUS_DOT: Record<CourseStatus, string> = {
  'on-draft': 'var(--oc-status-draft)',
  'waiting-approval': 'var(--oc-status-review)',
  'need-revision': 'var(--oc-status-revision)',
  approved: 'var(--oc-status-approved)',
  active: 'var(--oc-status-active)',
  inactive: 'var(--oc-status-inactive)',
};

function StatusChip({ status, className }: { status: CourseStatus; className?: string }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex h-[26px] w-fit items-center gap-1.5 whitespace-nowrap rounded-(--oc-radius-chip) px-2.5 text-[12px] leading-none',
        className,
      )}
      style={{ background: meta.bg, color: meta.text }}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: STATUS_DOT[status] }} />
      {meta.label}
    </span>
  );
}

/** For table cells */
export function StatusLabel({ status, className }: { status: CourseStatus; className?: string }) {
  return <StatusChip status={status} className={className} />;
}

/**
 * For badges. On a photo: a frosted glass pill with the label in the status
 * colour (no dot); elsewhere the tinted chip.
 */
export function StatusBadge({ status, onImage, className }: { status: CourseStatus; onImage?: boolean; className?: string }) {
  if (!onImage) return <StatusChip status={status} className={className} />;
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex h-[30px] w-fit items-center whitespace-nowrap px-3.5 text-[12px] leading-none',
        GLASS,
        className,
      )}
      style={{ color: meta.text }}
    >
      {meta.label}
    </span>
  );
}
