// Course status chip, drawn from the one source (COURSE_STATUS_META): a round
// pill in a tint of the status colour, with dark text.

import { cn } from '@/lib/utils';
import { COURSE_STATUS_META, type CourseStatus } from '../data/courses.mock';

/** Frosted white over the photo, shared by the status badge and the menu button */
export const GLASS = 'rounded-full bg-(--od-card)/70 ring-1 ring-(--od-card)/60 backdrop-blur-md shadow-(--od-shadow-glass)';

function StatusChip({ status, className }: { status: CourseStatus; className?: string }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        // Same size as Home's chips (30px tall, 14px sides), but round
        'inline-flex h-[30px] w-fit items-center whitespace-nowrap rounded-full px-3.5 text-[12px] leading-none',
        status === 'inactive' ? 'text-(--od-text-muted)' : 'text-(--od-text-strong)',
        className,
      )}
      style={{ background: meta.bg }}
    >
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
