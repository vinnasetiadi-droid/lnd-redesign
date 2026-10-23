// src/pages/ld/learning_management/components/OwnershipTabs.tsx
// All / Created by me / Created by Admin / Created by Trainer — shared by the
// admin Upskill and Journey libraries.

import { useAuthStore } from '@/store/useAuthStore';
import { ProgramScopeTabs, type ScopeTab } from '@/variants/b/pages/ld/dashboard/components/ProgramScopeTabs';

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

/** Option B underline tabs (the shared tab set), each with its item count */
export function OwnershipTabs({ items, value, onChange, me, allLabel }: OwnershipTabsProps) {
  const tabs: ScopeTab<OwnershipFilter>[] = TABS.map((tab) => ({
    key: tab.key,
    label: tab.key === 'all' && allLabel ? allLabel : tab.label,
    count: items.filter((i) => matchesOwnership(i, tab.key, me)).length,
  }));
  return <ProgramScopeTabs id="ownership-tabs" value={value} onChange={onChange} tabs={tabs} />;
}
