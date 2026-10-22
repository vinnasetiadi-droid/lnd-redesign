import { AlertTriangle, TrendingDown, Star, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CourseAttention, AttentionFlag } from '../types/dashboard.types';

interface LDDashboardCoursesAttentionProps {
  courses: CourseAttention[];
  className?: string;
}

const FLAG_CONFIG: Record<AttentionFlag, { icon: typeof TrendingDown; bg: string; iconColor: string; label: string; border: string }> = {
  'low-completion': {
    icon: TrendingDown,
    bg: 'bg-[#FFEAD5]',
    iconColor: 'text-[#EC4A0A]',
    label: 'Low Completion',
    border: 'border-[#FEB273]',
  },
  'low-rating': {
    icon: Star,
    bg: 'bg-[#FEE4E2]',
    iconColor: 'text-[#B42318]',
    label: 'Low Rating',
    border: 'border-[#FDA29B]',
  },
  'high-dropoff': {
    icon: UserX,
    bg: 'bg-[#FEF0C7]',
    iconColor: 'text-[#DC6803]',
    label: 'High Drop-off',
    border: 'border-[#FEDF89]',
  },
};

export function LDDashboardCoursesAttention({ courses, className }: LDDashboardCoursesAttentionProps) {
  return (
    <div className={cn('relative bg-white rounded-[12px] p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)] border border-[#E9EAEB] overflow-hidden', className)}>
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-[#FFEAD5]/30 to-[#FEF3F2]/30 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="flex gap-3 items-center mb-5">
        <div className="w-12 h-12 rounded-[10px] border border-[#E9EAEB] bg-white flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-[#1570EF]" strokeWidth={2} />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[#181D27] tracking-tight">Programs Needing Attention</h3>
          <p className="text-[14px] text-[#717680]">Flagged due to low completion, low rating, or high drop-off</p>
        </div>
      </div>

      {/* Alert List */}
            <div className="space-y-3">
        {courses.map((course) => {
          const config = FLAG_CONFIG[course.flag];
          const FlagIcon = config.icon;
          return (
            <div
              key={course.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-[8px] border transition-all hover:shadow-sm',
                'bg-[#FFFBFA] border-[#FEE4E2]' // Error.25 background and Error.100 border
              )}
            >
              {/* Flag Icon */}
              <div className={cn('flex-shrink-0 w-10 h-10 rounded-[8px] bg-white flex items-center justify-center shadow-sm')}>
                <FlagIcon className={cn('w-4.5 h-4.5 text-[#D92D20]')} /> {/* Error.600 for icon */}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[14px] font-semibold text-[#252B37] truncate">{course.name}</p>
                </div>
                <p className="text-[12px] text-[#535862]">{course.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}