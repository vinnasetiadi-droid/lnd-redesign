import { ListChecks, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgramOverview } from '../types/dashboard.types';
import { InfiniteListBody, InfiniteListFooter, ProgramKindLabel, TruncatedTitle, useInfiniteList } from './ProgramListParts';

interface LDDashboardActiveProgramsProps {
  programs: ProgramOverview[];
  /** Trainer dashboard: add each program's completion bar under its row. */
  showCompletion?: boolean;
  className?: string;
}

export function LDDashboardActivePrograms({ programs, showCompletion = false, className }: LDDashboardActiveProgramsProps) {
  const filtered = programs.filter((p) => p.status !== 'planning');
  const list = useInfiniteList(filtered);

  return (
    <div className={cn('relative bg-white rounded-[12px] p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)] border border-[#E9EAEB] overflow-hidden', className)}>
      {/* Header */}
      <div className="flex gap-3 items-center mb-4">
        <div className="w-10 h-10 rounded-[10px] border border-[#E9EAEB] bg-white flex items-center justify-center shrink-0">
          <ListChecks className="w-5 h-5 text-[#1570EF]" strokeWidth={2} />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-[#181D27] tracking-tight">Active Programs</h3>
          <p className="text-xs text-[#717680]">{filtered.length} programs running</p>
        </div>
      </div>

      {/* Program List — label, name, enrolled trainees */}
      <InfiniteListBody list={list} className="flex flex-col gap-2">
        {list.visible.map((program) => (
          <div
            key={program.id}
            className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E9EAEB] hover:bg-[#F2F4F7] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Name first, then the Course/Journey label */}
              <div className="flex-1 min-w-0 flex flex-col items-start gap-1.5">
                <TruncatedTitle text={program.name} className="w-full text-[13px] font-medium text-[#252B37]" />
                <ProgramKindLabel kind={program.kind} />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5" title={`${program.participants} enrolled trainees`}>
                <Users className="w-3.5 h-3.5 text-[#A4A7AE]" />
                <span className="text-[13px] font-semibold text-[#414651]">{program.participants}</span>
                <span className="text-[12px] text-[#A4A7AE]">enrolled</span>
              </div>
            </div>

            {/* Completion bar — blue for courses, green for journeys */}
            {showCompletion && (
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-2 bg-[#E9EAEB] rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', program.kind === 'journey' ? 'bg-emerald-500' : 'bg-[#1570EF]')}
                    style={{ width: `${program.completionRate}%` }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-[#414651] tabular-nums w-9 text-right">
                  {program.completionRate}%
                </span>
              </div>
            )}
          </div>
        ))}
      </InfiniteListBody>

      <InfiniteListFooter list={list} total={filtered.length} noun="programs" />
    </div>
  );
}
