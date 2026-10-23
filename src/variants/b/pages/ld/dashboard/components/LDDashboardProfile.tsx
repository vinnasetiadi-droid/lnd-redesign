// Home's profile section: a small square photo, then a greeting above the name
// and role with the original L&D achievement badges under them, and on the
// right the four contact details in one column (split off by a light
// hairline), so the row is filled edge to edge. The "head pops out" card it
// replaces is kept in src/variants/b/concepts/ProfileHeroCard.tsx.

import { cn } from '@/lib/utils';
import { Building2, Mail, MapPin, Phone, type LucideIcon } from '@/variants/b/icons';
import profilePhoto from '@/variants/b/assets/profile-photo.jpg';
import { ProfileBadges } from '@/variants/b/components/ui/profile-badges';
import type { LDProfile } from '../types/dashboard.types';

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function LDDashboardProfile({ person, className }: { person: LDProfile; className?: string }) {
  const { name, role, position, company, email, location, phone } = person;

  // Company, location, email, phone: one per line
  const contacts = [
    { icon: Building2, text: company },
    { icon: MapPin, text: location },
    { icon: Mail, text: email },
    { icon: Phone, text: phone },
  ].filter((c): c is { icon: LucideIcon; text: string } => !!c.text);

  return (
    <div className={cn('flex flex-wrap items-center gap-6', className)}>
      {/* 130px square */}
      <div className="relative size-[130px] shrink-0 overflow-hidden rounded-[16px] bg-(--ob-primary-50) ring-1 ring-(--ob-border)">
        <img src={profilePhoto} alt={name} className="absolute inset-0 size-full object-cover" />
      </div>

      {/* Greeting (by the time of day), name, role and the achievement badges */}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-[20px] text-(--ob-text-muted)">{greetingFor(new Date().getHours())}</p>
        <h2 className="mt-0.5 text-[28px] leading-[36px] text-(--ob-text-strong)">{name}</h2>
        <p className="mt-1 text-[16px] leading-[24px] text-(--ob-text-secondary)">{position || role}</p>
        <ProfileBadges size={40} className="mt-3" />
      </div>

      {/* Contact details on the right, one per line, after a light hairline */}
      <div className="flex min-w-[220px] flex-col gap-2.5 border-l border-(--ob-border-subtle) pl-8 max-md:basis-full max-md:border-l-0 max-md:pl-0">
        {contacts.map(({ icon: Icon, text }) => (
          <div key={text} className="flex min-w-0 items-center gap-2.5">
            <Icon size={18} className="shrink-0 text-(--ob-text-subtle)" />
            <span className="truncate text-[13px] leading-[20px] text-(--ob-text-strong)">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
