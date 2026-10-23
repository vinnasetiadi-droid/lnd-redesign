// Option B course status tag, drawn from the one source (COURSE_STATUS_META):
// outlined on white, 22px tall with 6px corners, the label in the status
// colour and a 1px border in a tint of it. No fill, no dot. The same tag in
// the table and on the card photos (there with a very soft shadow).

import { cn } from '@/lib/utils';
import { COURSE_STATUS_META, type CourseStatus } from '../data/courses.mock';

/** White control on a photo: 6px corners, a hairline and a very soft shadow (status tag, card menu button) */
export const ON_PHOTO = 'rounded-(--ob-radius-control) bg-(--ob-white) shadow-[0_1px_2px_rgba(16,24,40,0.08),0_2px_6px_-2px_rgba(16,24,40,0.12)]';

function StatusTag({ status, onImage, className }: { status: CourseStatus; onImage?: boolean; className?: string }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex h-[22px] w-fit items-center whitespace-nowrap rounded-(--ob-radius-control) border bg-(--ob-white) px-2 text-[12px] leading-none font-medium',
        onImage && ON_PHOTO,
        className,
      )}
      style={{ color: meta.text, borderColor: meta.border }}
    >
      {meta.label}
    </span>
  );
}

/** For table cells */
export function StatusLabel({ status, className }: { status: CourseStatus; className?: string }) {
  return <StatusTag status={status} className={className} />;
}

/** For badges: the same tag; `onImage` adds the soft shadow so it reads on any photo */
export function StatusBadge({ status, onImage, className }: { status: CourseStatus; onImage?: boolean; className?: string }) {
  return <StatusTag status={status} onImage={onImage} className={className} />;
}
