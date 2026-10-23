// Home's profile section: a small square photo as tall as the details beside
// it (name, role and up to four contact details). The "head pops out" card it
// replaces is kept in src/variants/b/concepts/ProfileHeroCard.tsx.

import { cn } from '@/lib/utils';
import { Building2, Mail, MapPin, Phone, type LucideIcon } from '@/variants/b/icons';
import profilePhoto from '@/variants/b/assets/profile-photo.jpg';
import type { LDProfile } from '../types/dashboard.types';

export function LDDashboardProfile({ person, className }: { person: LDProfile; className?: string }) {
  const { name, role, position, company, email, location, phone } = person;

  const contacts = [
    { icon: Building2, text: company },
    { icon: Mail, text: email },
    { icon: MapPin, text: location },
    { icon: Phone, text: phone },
  ].filter((c): c is { icon: LucideIcon; text: string } => !!c.text);

  return (
    <div className={cn('flex items-center gap-6', className)}>
      {/* 130px square: the height of the details beside it (name, role, two rows of contacts) */}
      <div className="relative size-[130px] shrink-0 overflow-hidden rounded-[16px] bg-(--ob-primary-50) ring-1 ring-(--ob-border)">
        <img src={profilePhoto} alt={name} className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-[28px] leading-[36px] text-(--ob-text-strong)">{name}</h2>
        <p className="mt-1 text-[16px] leading-[24px] text-(--ob-text-secondary)">{position || role}</p>

        <div className="mt-4 grid max-w-[480px] grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {contacts.map(({ icon: Icon, text }) => (
            <div key={text} className="flex min-w-0 items-center gap-2.5">
              <Icon size={18} className="shrink-0 text-(--ob-text-subtle)" />
              <span className="truncate text-[13px] leading-[20px] text-(--ob-text-strong)">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
