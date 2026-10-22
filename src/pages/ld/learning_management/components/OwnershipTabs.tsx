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

export function OwnershipTabs({ items, value, onChange, me, allLabel }: OwnershipTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-[#E9EAEB]">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'relative pb-3 text-[14px] transition-colors cursor-pointer',
            value === tab.key
              ? 'text-[#0001FE] after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-[#0001FE] after:rounded-full'
              : 'text-[#717680] hover:text-[#414651]',
          )}
        >
          {tab.key === 'all' && allLabel ? allLabel : tab.label}
          <span className="ml-1.5 text-[12px] text-[#A4A7AE]">
            {items.filter((i) => matchesOwnership(i, tab.key, me)).length}
          </span>
        </button>
      ))}
    </div>
  );
}
