// ============================================================
// The profile card whose cut-out photo rises above the card's top edge (the
// "head pops out" look). Option C's Home renders it at the top of the left
// column. See ./README.md for how to place it.
// ============================================================

import { Building2, Mail, MapPin, Phone, type LucideIcon } from '@/variants/c/icons';
// Background removed from the original profile photo (figma:asset/a28eddf0…png)
import profileCutout from '@/variants/c/assets/profile-cutout.png';

export interface ProfileHeroPerson {
  name: string;
  /** Job title; `role` is the fallback */
  position?: string;
  role?: string;
  company?: string;
  email?: string;
  location?: string;
  phone?: string;
}

interface ProfileHeroCardProps {
  person: ProfileHeroPerson;
  /** Cut-out photo with a transparent background; defaults to Diana's */
  photo?: string;
  className?: string;
}

/** Photo column: the cut-out fills the card height plus the headroom, shoulders included */
export const PROFILE_PHOTO_WIDTH = 220;
/** Room above the card for the head to rise into */
export const PROFILE_HEADROOM = 28;

export function ProfileHeroCard({ person, photo = profileCutout, className }: ProfileHeroCardProps) {
  const { name, role, position, company, email, location, phone } = person;

  const contacts = [
    { icon: Building2, text: company },
    { icon: Mail,      text: email },
    { icon: MapPin,    text: location },
    { icon: Phone,     text: phone },
  ].filter((c): c is { icon: LucideIcon; text: string } => !!c.text);

  return (
    // The padding is the headroom the head rises into
    <div className={className} style={{ paddingTop: PROFILE_HEADROOM }}>
      <div className="relative min-h-[176px] rounded-(--oc-radius-card) oc-surface">
        {/* Photo: as tall as the card plus the headroom, sitting on the card's bottom edge */}
        <div
          className="absolute left-0 bottom-0"
          style={{
            width: PROFILE_PHOTO_WIDTH,
            top: -PROFILE_HEADROOM,
            clipPath: 'inset(0 0 0 0 round 0 0 0 var(--oc-radius-card))',
          }}
        >
          <img src={photo} alt={name} className="block size-full object-cover object-bottom" />
        </div>

        {/* Details: name, role and up to four contact details */}
        <div className="min-w-0 py-6 pl-6 pr-6" style={{ marginLeft: PROFILE_PHOTO_WIDTH }}>
          <h2 className="text-[28px] leading-[36px] text-(--oc-text-strong)">{name}</h2>
          <p className="mt-1 text-[16px] leading-[24px] text-(--oc-text-secondary)">{position || role}</p>

          <div className="mt-4 grid max-w-[480px] grid-cols-2 gap-x-8 gap-y-2.5">
            {contacts.map(({ icon: Icon, text }) => (
              <div key={text} className="flex min-w-0 items-center gap-2.5">
                <Icon size={18} className="shrink-0 text-(--oc-text-subtle)" />
                <span className="truncate text-[13px] leading-[20px] text-(--oc-text-strong)">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
