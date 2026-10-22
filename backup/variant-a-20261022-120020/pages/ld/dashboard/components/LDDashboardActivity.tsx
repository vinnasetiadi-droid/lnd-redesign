import { Activity } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import type { ActivityItem, ActivityColorScheme } from '../types/dashboard.types';

const COLOR_SCHEMES: Record<ActivityColorScheme, { bg: string; icon: string }> = {
  blue:   { bg: 'bg-[#D2E3FC]',    icon: 'text-[#1A73E8]'    },
  green:  { bg: 'bg-[#D1FADF]', icon: 'text-[#039855]' },
  purple: { bg: 'bg-[#E8F0FE]',  icon: 'text-[#1A73E8]'  },
};

interface LDDashboardActivityProps {
  activities: ActivityItem[];
  className?: string;
}

export function LDDashboardActivity({ activities, className }: LDDashboardActivityProps) {
  return (
    <div className={cn('relative bg-white rounded-[18px] p-5 overflow-hidden', className)}>

      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-[#E8F0FE]/50 to-[#D2E3FC]/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-[10px] border border-[#EDEEF1] bg-white flex items-center justify-center shrink-0">
          <Activity className="w-6 h-6 text-[#414651]" strokeWidth={1.75} />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[#181D27]">Latest Activity</h3>
          <p className="text-[13px] text-[#717680]">Recent program and trainer updates</p>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[#EDEEF1] p-4">
        <div className="space-y-4">
          {activities.map((activity) => {
            const colors = COLOR_SCHEMES[activity.colorScheme];
            return (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className={cn('flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center', colors.bg)}>
                  <Activity className={cn('w-4 h-4', colors.icon)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#252B37]">
                    <span className="">{activity.personName}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-[12px] text-[#A4A7AE] mt-0.5">{activity.timeAgo} ago</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}