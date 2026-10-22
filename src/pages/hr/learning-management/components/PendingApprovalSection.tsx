import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '@/components/ui/category-icon';
import { useNavigate } from 'react-router';
import {
  Clock,
  CheckCircle2,
  TriangleAlert,
  CalendarClock,
} from 'lucide-react';
import type { PendingApprovalCourse } from '../types/course.types';

interface PendingApprovalSectionProps {
  courses: PendingApprovalCourse[];
  className?: string;
  /** Base route for the review page. Defaults to '/hr/learning-management' */
  routePrefix?: string;
}

// Today = 2026-03-03
const TODAY = new Date('2026-03-03');

/** Deadline = H-1 of proposedStartDate (1 day before start) */
function getDeadlineDate(proposedStartDate: string): Date {
  const start = new Date(proposedStartDate);
  start.setDate(start.getDate() - 1);
  return start;
}

function getDaysRemaining(proposedStartDate: string): number {
  const deadline = getDeadlineDate(proposedStartDate);
  const diffMs = deadline.getTime() - TODAY.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

type UrgencyLevel = 'overdue' | 'critical' | 'urgent' | 'soon' | 'normal';

function getUrgency(daysRemaining: number): {
  level: UrgencyLevel;
  label: string;
  dot: string;
  bg: string;
  text: string;
} {
  if (daysRemaining < 0) {
    return {
      level: 'overdue',
      label: 'Overdue',
      dot: 'bg-red-600',
      bg: 'bg-red-50',
      text: 'text-red-700',
    };
  }
  if (daysRemaining <= 3) {
    return {
      level: 'critical',
      label: `${daysRemaining}d left`,
      dot: 'bg-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
    };
  }
  if (daysRemaining <= 7) {
    return {
      level: 'urgent',
      label: `${daysRemaining}d left`,
      dot: 'bg-orange-500',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
    };
  }
  if (daysRemaining <= 14) {
    return {
      level: 'soon',
      label: `${daysRemaining}d left`,
      dot: 'bg-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    };
  }
  return {
    level: 'normal',
    label: `${daysRemaining}d left`,
    dot: 'bg-green-500',
    bg: 'bg-green-50',
    text: 'text-green-700',
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDeadlineDate(proposedStartDate: string) {
  const dl = getDeadlineDate(proposedStartDate);
  return dl.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function PendingApprovalSection({
  courses,
  className,
  routePrefix = '/hr/learning-management',
}: PendingApprovalSectionProps) {
  const navigate = useNavigate();
  const [actionedIds, setActionedIds] = useState<Set<string>>(new Set());
  const [actionType, setActionType] = useState<
    Record<string, 'approved' | 'rejected'>
  >({});

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setActionedIds((prev) => new Set(prev).add(id));
    setActionType((prev) => ({ ...prev, [id]: action }));
  };

  const visibleCourses = useMemo(() => {
    let list = courses.filter((c) => !actionedIds.has(c.id));

    // Sort by closest deadline (most urgent first)
    list.sort(
      (a, b) =>
        getDaysRemaining(a.proposedStartDate) -
        getDaysRemaining(b.proposedStartDate)
    );

    return list;
  }, [courses, actionedIds]);

  const actionedCourses = courses.filter((c) => actionedIds.has(c.id));

  return (
    <div
      className={cn(
        'relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden',
        className
      )}
    >
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="relative z-[1] flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <CategoryIcon icon={Clock} size="default" />
          <div className="space-y-0.5 min-w-0">
            <h2 className="font-semibold text-xl text-[#252B37] tracking-tight">
              Pending Approval
            </h2>
            <p className="text-sm text-[#717680] font-medium">
              {visibleCourses.length} course
              {visibleCourses.length !== 1 ? 's' : ''} awaiting your review
              &middot; sorted by closest deadline
            </p>
          </div>
        </div>
        {actionedCourses.length > 0 && (
          <span className="text-xs text-[#A4A7AE]">
            {actionedCourses.length} processed
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="relative z-[1] space-y-3">
        {visibleCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
            <p className="text-[#414651] font-medium">All caught up!</p>
            <p className="text-sm text-[#A4A7AE] mt-1">
              No pending courses to review right now.
            </p>
          </div>
        ) : (
          visibleCourses.map((course) => {
            const daysLeft = getDaysRemaining(course.proposedStartDate);
            const urgency = getUrgency(daysLeft);

            return (
              <div
                key={course.id}
                className={cn(
                  'rounded-2xl border overflow-hidden transition-all',
                  urgency.level === 'overdue' || urgency.level === 'critical'
                    ? 'bg-red-50/40 border-red-100'
                    : urgency.level === 'urgent'
                      ? 'bg-orange-50/30 border-orange-100'
                      : 'bg-gray-50/70 border-gray-100'
                )}
              >
                {/* Card row */}
                <button
                  type="button"
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-100/60 transition-colors"
                  onClick={() =>
                    navigate(`${routePrefix}/${course.id}/review`)
                  }
                >
                  {/* Deadline indicator */}
                  <div className="flex flex-col items-center shrink-0 w-16">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center mb-1',
                        urgency.bg
                      )}
                    >
                      {urgency.level === 'overdue' ||
                      urgency.level === 'critical' ? (
                        <TriangleAlert
                          className={cn('w-5 h-5', urgency.text)}
                        />
                      ) : (
                        <CalendarClock
                          className={cn('w-5 h-5', urgency.text)}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-semibold whitespace-nowrap',
                        urgency.text
                      )}
                    >
                      {urgency.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[15px] font-semibold text-[#252B37] truncate text-[14px]">
                        {course.title}
                      </span>
                      <span
                        className={cn("px-2 py-0.5 rounded-full font-medium capitalize text-[12px]", course.type === 'journey'
        ? 'bg-sky-50 text-sky-700'
        : 'bg-emerald-50 text-emerald-700')}
                      >
                        {course.type}
                      </span>
                      <span className="text-[#A4A7AE] font-mono text-[12px]">
                        {course.approvalId}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#717680] mb-0.5">
                      Created by{' '}
                      <span className="font-medium text-[#414651]">
                        {course.requestedBy.name}
                      </span>{' '}
                      · Start{' '}
                      <span className="font-medium text-[#414651]">
                        {formatDate(course.proposedStartDate)}
                      </span>{' '}
                      ·{' '}
                      <span className="font-medium text-[#414651]">
                        {course.learningMode === 'blended' ? 'Blended Learning' : 'Self Learning'}
                      </span>{' '}
                      ·{' '}
                      <span className="font-medium text-[#414651]">
                        {course.trainingType === 'compliance' ? 'Compliance' : 'Skill Training'}
                      </span>
                    </p>
                    <p className="text-[13px] text-[#A4A7AE]">
                      Latest activity: Submitted on {formatDate(course.submittedAt)}
                    </p>
                  </div>

                  {/* Review CTA */}
                  <span className="px-5 py-2.5 rounded-lg text-base font-medium bg-[#0001FE] text-white hover:bg-[#0001d4] transition-colors shrink-0">
                    {course.type === 'journey' ? 'Review Journey' : 'Review Course'}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}