// Course status chip, drawn from the one source (COURSE_STATUS_META): a round
// pill in a tint of the status colour, with dark text.

import { cn } from '@/lib/utils';
import { COURSE_STATUS_META, type CourseStatus } from '../data/courses.mock';

function StatusChip({ status, className }: { status: CourseStatus; className?: string }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        // Same size as Home's chips (30px tall, 14px sides), but round
        'inline-flex h-[30px] w-fit items-center whitespace-nowrap rounded-full px-3.5 text-[12px] leading-none',
        status === 'inactive' ? 'text-(--oa-text-muted)' : 'text-(--oa-text-strong)',
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
 * For badges. On a photo: a white pill with the label in the status colour
 * (no dot), so it holds on any image; elsewhere the tinted chip.
 */
export function StatusBadge({ status, onImage, className }: { status: CourseStatus; onImage?: boolean; className?: string }) {
  if (!onImage) return <StatusChip status={status} className={className} />;
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex h-[30px] w-fit items-center whitespace-nowrap rounded-full bg-(--oa-white) px-3.5 text-[12px] leading-none shadow-[0_1px_3px_rgba(16,24,40,0.16)]',
        className,
      )}
      style={{ color: meta.text }}
    >
      {meta.label}
    </span>
  );
}
