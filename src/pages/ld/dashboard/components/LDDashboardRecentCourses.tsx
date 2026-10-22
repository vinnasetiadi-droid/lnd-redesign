import { BookOpen, Rocket, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RecentCourse } from '../types/dashboard.types';
import { InfiniteListBody, InfiniteListFooter, ProgramKindLabel, TruncatedTitle, useInfiniteList } from './ProgramListParts';

interface LDDashboardRecentCoursesProps {
  courses: RecentCourse[];
  className?: string;
}

function formatPublished(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function LDDashboardRecentCourses({ courses, className }: LDDashboardRecentCoursesProps) {
  const list = useInfiniteList(courses, { initial: 4, step: 4 });

  return (
    <div className={cn('relative bg-white rounded-[12px] p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)] border border-[#E9EAEB] overflow-hidden', className)}>
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-[#EFF8FF]/50 to-[#E0EAFF]/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="flex gap-3 items-center mb-5">
        <div className="w-12 h-12 rounded-[10px] border border-[#E9EAEB] bg-white flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-[#1570EF]" strokeWidth={2} />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[#181D27] tracking-tight">Recent Program</h3>
          <p className="text-[14px] text-[#717680]">Newly launched or recently updated courses and journeys</p>
        </div>
      </div>

      {/* Program List */}
      <InfiniteListBody list={list} className="space-y-3">
        {list.visible.map((item) => {
          const isNew = item.type === 'launched';
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-[8px] bg-[#FAFAFA] hover:bg-white hover:shadow-sm border border-[#E9EAEB] transition-all group/item"
            >
              {/* Info — name with the Course/Journey label right after it, then
                  the byline. New vs updated reads from the icon and the version. */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Shrinks (and truncates) before the label does */}
                  <div className="min-w-0">
                    <TruncatedTitle text={item.name} className="w-full text-[14px] font-semibold text-[#252B37]" />
                  </div>
                  <ProgramKindLabel kind={item.kind} />
                </div>
                {/* Creator · (Version) · Published date */}
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 text-[12px] text-[#A4A7AE]">
                  <span className="text-[#717680]">{item.creator}</span>
                  {!isNew && item.version && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="text-[#717680]">{item.version}</span>
                    </>
                  )}
                  <span aria-hidden>·</span>
                  <span>Published {formatPublished(item.date)}</span>
                </div>
              </div>

              {/* Type Icon — on the right */}
              <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-[8px] flex items-center justify-center',
                isNew ? 'bg-[#D1FADF]' : 'bg-[#D1E9FF]',
              )}>
                {isNew ? (
                  <Rocket className="w-4.5 h-4.5 text-[#039855]" />
                ) : (
                  <RefreshCw className="w-4.5 h-4.5 text-[#1570EF]" />
                )}
              </div>
            </div>
          );
        })}
      </InfiniteListBody>

      <InfiniteListFooter list={list} total={courses.length} noun="programs" />
    </div>
  );
}
