// Course status chip, drawn from the one source (COURSE_STATUS_META): a tint of
// the status colour with a short bar in the stronger shade, and dark text.

import { cn } from '@/lib/utils';
import { COURSE_STATUS_META, type CourseStatus } from '../data/courses.mock';

function StatusChip({ status, className }: { status: CourseStatus; className?: string }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit items-center gap-1.5 whitespace-nowrap rounded-[6px] pl-1.5 pr-2 text-[12px] leading-none',
        status === 'inactive' ? 'text-(--oa-text-muted)' : 'text-(--oa-text-strong)',
        className,
      )}
      style={{ background: meta.bg }}
    >
      <span className="h-3 w-[3px] shrink-0 rounded-full" style={{ background: meta.bar }} aria-hidden />
      {meta.label}
    </span>
  );
}

/** For table cells */
export function StatusLabel({ status, className }: { status: CourseStatus; className?: string }) {
  return <StatusChip status={status} className={className} />;
}

/** For badges on covers: the same chip with a soft shadow so it holds on a photo */
export function StatusBadge({ status, onImage, className }: { status: CourseStatus; onImage?: boolean; className?: string }) {
  return <StatusChip status={status} className={cn(onImage && 'shadow-[0_1px_3px_rgba(16,24,40,0.16)]', className)} />;
}
