// src/pages/ld/learning_management/components/OwnershipTabs.tsx
// All / Created by me / Created by Admin / Created by Trainer — shared by the
// admin Upskill and Journey libraries.

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export type OwnershipFilter = 'all' | 'mine' | 'admin' | 'trainer';

interface Owned {
  creator?: string;
  creatorRole?: 'admin' | 'trainer';
}

/** "Created by Admin" means other admins in the org — my own work sits under "Created by me". */
export function matchesOwnership(item: Owned, filter: OwnershipFilter, me: string): boolean {
  if (filter === 'all') return true;
  if (filter === 'trainer') return item.creatorRole === 'trainer';
  if (item.creatorRole !== 'admin') return false;
  return filter === 'mine' ? item.creator === me : item.creator !== me;
}

export function useCurrentUserName(): string {
  return useAuthStore((s) => s.user?.name) ?? 'Diana Hartwell';
}

const TABS: { key: OwnershipFilter; label: string }[] = [
  { key: 'all', label: 'All Course' },
  { key: 'mine', label: 'Created by Me' },
  { key: 'admin', label: 'Created by Admin' },
  { key: 'trainer', label: 'Created by Trainer' },
];

interface OwnershipTabsProps {
  items: Owned[];
  value: OwnershipFilter;
  onChange: (value: OwnershipFilter) => void;
  me: string;
  /** Overrides the first tab's label, e.g. "All Journey". */
  allLabel?: string;
}

/** Segmented pill tabs (Option D), each with its item count */
export function OwnershipTabs({ items, value, onChange, me, allLabel }: OwnershipTabsProps) {
  return (
    <div className="flex w-fit items-center gap-0.5 rounded-full bg-[#F5F6F8] p-1">
      {TABS.map((tab) => {
        const active = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] transition-colors cursor-pointer',
              active
                ? 'bg-white text-[#181D27] shadow-[0_1px_2px_rgba(16,24,40,0.08),0_1px_3px_rgba(16,24,40,0.06)]'
                : 'text-[#717680] hover:text-[#414651]',
            )}
          >
            {tab.key === 'all' && allLabel ? allLabel : tab.label}
            <span className="text-[12px] text-[#A4A7AE]">
              {items.filter((i) => matchesOwnership(i, tab.key, me)).length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
