// Course status, drawn from the one source (COURSE_STATUS_META): a dot in the
// status colour plus the label. No coloured fills.

import { cn } from '@/lib/utils';
import { COURSE_STATUS_META, type CourseStatus } from '../data/courses.mock';

/** Dot and label, for table cells */
export function StatusLabel({ status, className }: { status: CourseStatus; className?: string }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span className={cn('flex items-center gap-2 text-[13px] text-(--oa-text-body)', className)}>
      <span className="size-2 shrink-0 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}

/** Dot and label on a neutral pill, for badges (white on covers, grey elsewhere) */
export function StatusBadge({ status, onImage, className }: { status: CourseStatus; onImage?: boolean; className?: string }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12px] leading-none text-(--oa-text-body)',
        onImage ? 'bg-(--oa-white)/95 shadow-[0_1px_2px_rgba(16,24,40,0.08)]' : 'bg-(--oa-surface)',
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}
