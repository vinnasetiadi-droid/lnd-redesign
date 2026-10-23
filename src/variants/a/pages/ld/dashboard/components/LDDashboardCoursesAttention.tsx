import { AlertTriangle } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import type { CourseAttention, AttentionFlag } from '../types/dashboard.types';
import { CardHeader } from '@/variants/a/components/ui/kit';

interface LDDashboardCoursesAttentionProps {
  courses: CourseAttention[];
  className?: string;
}

// Same soft amber as the at-risk row in Active programs
const FLAG_LABEL: Record<AttentionFlag, string> = {
  'low-completion': 'Low completion',
  'low-rating': 'Low rating',
  'high-dropoff': 'High drop-off',
};

export function LDDashboardCoursesAttention({ courses, className }: LDDashboardCoursesAttentionProps) {
  return (
    <div className={cn('relative bg-(--oa-white) rounded-[18px] p-5', className)}>
      <CardHeader
        title="Programs needing attention"
        subtitle="Flagged due to low completion, low rating, or high drop-off"
        icon={AlertTriangle}
      />

      {/* Same row frames as Active programs */}
      <div className="mt-4 flex flex-col gap-2">
        {courses.map((course) => (
          <div key={course.id} className="rounded-[14px] bg-(--oa-surface-muted) p-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="min-w-0 flex-1 truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={course.name}>
                {course.name}
              </p>
              <span className="shrink-0 text-[12px] text-(--oa-attention-text)">{FLAG_LABEL[course.flag]}</span>
            </div>
            <p className="mt-0.5 text-[12px] leading-[18px] text-(--oa-text-muted)">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
