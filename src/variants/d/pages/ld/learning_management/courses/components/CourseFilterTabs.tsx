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

export function CourseFilterTabs({ active, onChange }: CourseFilterTabsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            "px-2 py-[2px] rounded-[4px] text-[12px] transition-all duration-200 cursor-pointer border",
            active === f.key
              ? 'bg-[#0E85B4] text-white border-[#0E85B4]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600',
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}