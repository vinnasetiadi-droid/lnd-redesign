import { cn } from '@/lib/utils';
import { BarChart2, BookOpen, CheckCircle2, Users, type LucideIcon } from '@/variants/b/icons';
import type { LDProfile, LDMetricCard } from '../types/dashboard.types';
import { CARD, DeltaChip } from '@/variants/b/components/ui/kit';
import { CountUpText } from '@/variants/b/components/ui/count-up';
// Background removed from the original profile photo (figma:asset/a28eddf0…png)
import profileCutout from '@/variants/b/assets/profile-cutout.png';

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
      <span className="size-[54px] shrink-0 overflow-hidden rounded-full bg-(--ob-primary-50)">
        <img src={profileCutout} alt="" className="size-full object-cover object-top" />
      </span>
      <div className="min-w-0">
        <h1 className="text-[24px] leading-[32px] text-(--ob-text-strong)">
          {greetingFor(now.getHours())}, {firstName}
        </h1>
        <p className="mt-0.5 text-[13px] leading-[20px] text-(--ob-text-muted)">
          {[date.replace(/^(\w+) /, '$1, '), profile.company].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}

// ── KPI row ──────────────────────────────────────────────────

interface LDDashboardHeaderProps {
  metrics: LDMetricCard[];
  /** Inside Home's single frame: plain columns split by vertical hairlines, no card frames or icons */
  flat?: boolean;
  className?: string;
}

/** "+13% vs last month" → chip "13%" and "vs last month" */
function splitTrend(trend: string): { change: string; compare: string } {
  const m = /^[+-]?(\d+(?:\.\d+)?(?:%| pts)?)\s+(.*)$/.exec(trend);
  return m ? { change: m[1], compare: m[2] } : { change: trend, compare: '' };
}

/**
 * The three KPI cards, reference style: title with a small blue icon on the
 * right, the number with a green or red change chip, then what it is
 * compared with.
 */
export function LDDashboardHeader({ metrics, flat, className }: LDDashboardHeaderProps) {
  if (flat) {
    return (
      <div className={cn('grid grid-cols-1 divide-y divide-(--ob-border) md:grid-cols-3 md:divide-x md:divide-y-0', className)}>
        {metrics.map((card) => {
          const { change, compare } = splitTrend(card.trend);
          return (
            <div key={card.key} className="flex min-w-0 flex-col gap-2.5 px-8 py-1 max-md:py-5 md:first:pl-0 md:last:pr-0" title={card.hint}>
              <p className="text-[13px] leading-[18px] text-(--ob-text-muted)">{card.title}</p>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[30px] leading-[36px] tabular-nums text-(--ob-text-strong)"><CountUpText value={String(card.value)} /></h3>
                <DeltaChip positive={card.trendPositive}>{change}</DeltaChip>
              </div>
              <p className="text-[12px] leading-[16px] text-(--ob-text-muted)">
                {compare}{card.hint && <span className="text-(--ob-text-subtle)"> · {card.hint.toLowerCase()}</span>}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-3', className)}>
      {metrics.map((card) => {
        const Icon = METRIC_ICON[card.key] ?? BarChart2;
        const { change, compare } = splitTrend(card.trend);
        return (
          <div key={card.key} className={cn(CARD, 'ob-lift flex flex-col gap-3 p-5')}>
            <div className="flex items-start justify-between gap-2" title={card.hint}>
              <p className="min-w-0 text-[14px] leading-[20px] text-(--ob-text-strong)">{card.title}</p>
              <Icon size={18} className="shrink-0 text-(--ob-primary)" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[28px] leading-[34px] tabular-nums text-(--ob-text-strong)"><CountUpText value={String(card.value)} /></h3>
              <DeltaChip positive={card.trendPositive}>{change}</DeltaChip>
            </div>
            <p className="text-[12px] leading-[16px] text-(--ob-text-muted)">
              {compare}{card.hint && <span className="text-(--ob-text-subtle)"> · {card.hint.toLowerCase()}</span>}
            </p>
          </div>
        );
      })}
    </div>
  );
}
