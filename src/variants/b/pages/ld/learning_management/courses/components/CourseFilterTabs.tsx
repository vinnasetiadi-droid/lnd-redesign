import { cn } from '@/lib/utils';

export type CourseFilter = 'all' | 'on-draft' | 'waiting-approval' | 'need-revision' | 'approved' | 'active' | 'inactive';

interface CourseFilterTabsProps {
  active: CourseFilter;
  onChange: (filter: CourseFilter) => void;
}

const FILTERS: { key: CourseFilter; label: string }[] = [
  { key: 'all', label: 'All Course' },
  { key: 'on-draft', label: 'On Draft' },
  { key: 'waiting-approval', label: 'Waiting Approval' },
  { key: 'need-revision', label: 'Need Revision' },
  { key: 'approved', label: 'Approved' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
];

/** Option B outlined filter buttons: white, hairline, 6px corners; the picked one has a blue border and blue text */
export function CourseFilterTabs({ active, onChange }: CourseFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          aria-pressed={active === f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            'h-7 rounded-(--ob-radius-control) border bg-(--ob-white) px-2.5 text-[12px] transition-colors duration-200 cursor-pointer',
            active === f.key
              ? 'border-(--ob-primary) text-(--ob-primary-strong)'
              : 'border-(--ob-border) text-(--ob-text-secondary) hover:border-(--ob-border-control) hover:text-(--ob-text-strong)',
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
