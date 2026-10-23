import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/variants/b/icons';

interface CategoryIconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'default';
  className?: string;
}

const sizeMap = {
  sm: {
    wrapper: 'w-8 h-8 rounded-(--ob-radius-control)',
    icon: 'w-4 h-4',
  },
  md: {
    wrapper: 'w-10 h-10 rounded-(--ob-radius-control)',
    icon: 'w-5 h-5',
  },
  default: {
    wrapper: 'w-12 h-12 rounded-(--ob-radius-control)',
    icon: 'w-5 h-5',
  },
};

export function CategoryIcon({ icon: Icon, size = 'default', className }: CategoryIconProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        s.wrapper,
        'border border-(--ob-border) bg-(--ob-white) flex items-center justify-center shrink-0',
        className
      )}
    >
      <Icon className={cn(s.icon, 'text-(--ob-primary-text)')} strokeWidth={2} />
    </div>
  );
}
