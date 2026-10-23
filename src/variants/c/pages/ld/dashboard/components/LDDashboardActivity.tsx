import { Activity } from '@/variants/c/icons';
import { cn } from '@/lib/utils';
import type { ActivityItem, ActivityColorScheme } from '../types/dashboard.types';

const COLOR_SCHEMES: Record<ActivityColorScheme, { bg: string; icon: string }> = {
  blue:   { bg: 'bg-(--oc-primary-100)',    icon: 'text-(--oc-primary-text)'    },
  green:  { bg: 'bg-(--oc-success-100)', icon: 'text-(--oc-success)' },
  purple: { bg: 'bg-(--oc-primary-50)',  icon: 'text-(--oc-primary-text)'  },
};

interface LDDashboardActivityProps {
  activities: ActivityItem[];
  className?: string;
}

export function LDDashboardActivity({ activities, className }: LDDashboardActivityProps) {
  return (
    <div className={cn('relative rounded-(--oc-radius-card) oc-surface p-5 overflow-hidden', className)}>

      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-(--oc-primary-50)/50 to-(--oc-primary-100)/50 rounded-(--oc-radius-chip) blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-(--oc-radius-control) border border-(--oc-border) bg-(--oc-card) flex items-center justify-center shrink-0">
          <Activity className="w-6 h-6 text-(--oc-text-body)" strokeWidth={1.75} />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-(--oc-text-strong)">Latest Activity</h3>
          <p className="text-[13px] text-(--oc-text-muted)">Recent program and trainer updates</p>
        </div>
      </div>

      <div className="bg-(--oc-card) rounded-(--oc-radius-card) border border-(--oc-border) p-4">
        <div className="space-y-4">
          {activities.map((activity) => {
            const colors = COLOR_SCHEMES[activity.colorScheme];
            return (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className={cn('flex-shrink-0 w-9 h-9 rounded-(--oc-radius-control) flex items-center justify-center', colors.bg)}>
                  <Activity className={cn('w-4 h-4', colors.icon)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-(--oc-text-heading)">
                    <span className="">{activity.personName}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-[12px] text-(--oc-text-subtle) mt-0.5">{activity.timeAgo} ago</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}