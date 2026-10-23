import { Clock } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import type { RecentCourse } from '../types/dashboard.types';
import { InfiniteListBody, InfiniteListFooter, TruncatedTitle, useInfiniteList } from './ProgramListParts';
import { CardHeader } from '@/variants/a/components/ui/kit';

interface LDDashboardRecentCoursesProps {
  courses: RecentCourse[];
  className?: string;
}

function formatPublished(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// New vs updated reads as small coloured text on the right, like the value in Active programs
const STATUS = {
  launched: { label: 'New', className: 'text-(--oa-success-strong)' },
  updated: { label: 'Updated', className: 'text-(--oa-primary-strong)' },
};

export function LDDashboardRecentCourses({ courses, className }: LDDashboardRecentCoursesProps) {
  const list = useInfiniteList(courses, { initial: 4, step: 4 });

  return (
    <div className={cn('relative bg-(--oa-white) rounded-[18px] p-5 overflow-hidden', className)}>
      <CardHeader
        title="Recent programs"
        subtitle="Newly launched or recently updated courses and journeys"
        icon={Clock}
      />

      {/* Same row frames as Active programs */}
      <InfiniteListBody list={list} className="mt-4 flex flex-col gap-2">
        {list.visible.map((item) => {
          const status = STATUS[item.type];
          // Type · creator · (version) · published date
          const meta = [
            item.kind === 'course' ? 'Course' : 'Journey',
            item.creator,
            item.type === 'updated' ? item.version : undefined,
            formatPublished(item.date),
          ].filter(Boolean).join(' · ');
          return (
            <div key={item.id} className="rounded-[14px] bg-(--oa-surface-muted) p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <TruncatedTitle text={item.name} className="min-w-0 flex-1 text-[13px] leading-[20px] text-(--oa-text-strong)" />
                <span className={cn('shrink-0 text-[12px]', status.className)}>{status.label}</span>
              </div>
              <p className="mt-0.5 truncate text-[12px] leading-[18px] text-(--oa-text-muted)" title={meta}>{meta}</p>
            </div>
          );
        })}
      </InfiniteListBody>

      <InfiniteListFooter list={list} total={courses.length} noun="programs" />
    </div>
  );
}
