import { cn } from '@/lib/utils';
import { BarChart2, BookOpen, Building2, CheckCircle2, Mail, MapPin, Phone, Users, type LucideIcon } from '@/variants/a/icons';
import type { LDProfile, LDMetricCard } from '../types/dashboard.types';
import { IconCircle, Trend } from '@/variants/a/components/ui/kit';
import { CountUpText } from '@/variants/a/components/ui/count-up';
// Background removed from the original profile photo (figma:asset/a28eddf0…png)
import profileCutout from '@/variants/a/assets/profile-cutout.png';

interface LDDashboardHeaderProps {
  profile: LDProfile;
  metrics?: LDMetricCard[];
  className?: string;
}

/** Icon per metric card, by its key in the mock data */
const METRIC_ICON: Record<string, LucideIcon> = {
  'active-programs':    BookOpen,
  'total-participants': Users,
  'completion-rate':    CheckCircle2,
};

/** Photo column: the cut-out fills the card height plus the headroom, shoulders included */
const PHOTO_WIDTH = 220;
/** Room above the card for the head to rise into */
export const PHOTO_HEADROOM = 28;

// ── Component ───────────────────────────────────────────────

export function LDDashboardHeader({ profile, metrics, className }: LDDashboardHeaderProps) {
  // Company and city are fixed in the original header too, not read from the mock
  const { name, role, position, phone, email } = profile;

  const contacts = [
    { icon: Building2, text: 'Presight' },
    { icon: Mail,      text: email ?? 'diana@presight.com' },
    { icon: MapPin,    text: 'Istanbul' },
    { icon: Phone,     text: phone ?? '+62 123 4567 8900' },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {/* ── Profile Card: cut-out photo, head rising slightly above the card ── */}
      <div style={{ paddingTop: PHOTO_HEADROOM }}>
        <div className="relative min-h-[176px] rounded-[18px] bg-white">
          {/* Photo: as tall as the card plus the headroom, sitting on the card's bottom edge */}
          <div
            className="absolute left-0 bottom-0"
            style={{
              width: PHOTO_WIDTH,
              top: -PHOTO_HEADROOM,
              clipPath: 'inset(0 0 0 0 round 0 0 0 18px)',
            }}
          >
            <img src={profileCutout} alt={name} className="block size-full object-cover object-bottom" />
          </div>

          {/* Details: name, role and four contact details */}
          <div className="min-w-0 py-6 pl-6 pr-6" style={{ marginLeft: PHOTO_WIDTH }}>
            <h2 className="text-[28px] leading-[36px] text-[#181D27]">{name}</h2>

            <p className="mt-1 text-[16px] leading-[24px] text-[#535862]">{position || role}</p>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5 max-w-[480px]">
              {contacts.map(({ icon: Icon, text }) => (
                <div key={text} className="flex min-w-0 items-center gap-2.5">
                  <Icon size={18} className="shrink-0 text-[#A4A7AE]" />
                  <span className="truncate text-[13px] leading-[20px] text-[#181D27]">{text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Metric Cards (outside profile card) ───────────────── */}
      {metrics && metrics.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {metrics.map((card) => {
              return (
                <div key={card.key} className="oa-lift rounded-[18px] bg-white p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-[13px] leading-[18px] text-[#535862]">{card.title}</p>
                    <IconCircle icon={METRIC_ICON[card.key] ?? BarChart2} />
                  </div>
                  <h3 className="text-[24px] leading-[32px] text-[#181D27]"><CountUpText value={String(card.value)} /></h3>
                  <Trend positive={card.trendPositive} className="mt-1">{card.trend}</Trend>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
