import { cn } from '@/lib/utils';
import { BarChart2, BookOpen, CheckCircle2, Users, type LucideIcon } from '@/variants/a/icons';
import type { LDProfile, LDMetricCard } from '../types/dashboard.types';
import { IconCircle, Trend } from '@/variants/a/components/ui/kit';
import { CountUpText } from '@/variants/a/components/ui/count-up';
// Background removed from the original profile photo (figma:asset/a28eddf0…png)
import profileCutout from '@/variants/a/assets/profile-cutout.png';

/** Icon per metric card, by its key in the mock data */
const METRIC_ICON: Record<string, LucideIcon> = {
  'active-programs':    BookOpen,
  'total-participants': Users,
  'completion-rate':    CheckCircle2,
};

// ── Greeting ─────────────────────────────────────────────────

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Compact greeting above both columns: a small photo, the name, today's date
 * and the org.
 */
export function LDDashboardGreeting({ profile, className }: { profile: LDProfile; className?: string }) {
  const now = new Date();
  const firstName = profile.name.split(' ')[0];
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className={cn('flex min-h-0 items-center gap-3', className)}>
      {/* Small photo, as tall as the two lines beside it */}
      <span className="size-[54px] shrink-0 overflow-hidden rounded-full bg-(--oa-primary-50)">
        <img src={profileCutout} alt="" className="size-full object-cover object-top" />
      </span>
      <div className="min-w-0">
        <h1 className="text-[24px] leading-[32px] text-(--oa-text-strong)">
          {greetingFor(now.getHours())}, {firstName}
        </h1>
        <p className="mt-0.5 text-[13px] leading-[20px] text-(--oa-text-muted)">
          {[date.replace(/^(\w+) /, '$1, '), profile.company].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}

// ── KPI row ──────────────────────────────────────────────────

interface LDDashboardHeaderProps {
  metrics: LDMetricCard[];
  className?: string;
}

/** The three KPI cards (the profile card is gone; see LDDashboardGreeting) */
export function LDDashboardHeader({ metrics, className }: LDDashboardHeaderProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-3', className)}>
      {metrics.map((card) => (
        <div key={card.key} className="oa-lift rounded-[18px] bg-white p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            {/* Title, plus a one-line hint when the number needs it; together as tall as the icon circle */}
            <div className="min-w-0" title={card.hint}>
              <p className="text-[13px] leading-[18px] text-(--oa-text-secondary)">{card.title}</p>
              {card.hint && <p className="text-[11px] leading-[14px] text-(--oa-text-subtle)">{card.hint}</p>}
            </div>
            <IconCircle icon={METRIC_ICON[card.key] ?? BarChart2} />
          </div>
          <h3 className="text-[24px] leading-[32px] text-(--oa-text-strong)"><CountUpText value={String(card.value)} /></h3>
          <Trend positive={card.trendPositive} className="mt-1">{card.trend}</Trend>
        </div>
      ))}
    </div>
  );
}
