// Course cover: the course's own photo, or a tinted cover with its category
// icon when it has none or shares the photo with another course.

import { BookOpen, GraduationCap, Rocket, ShieldCheck, type LucideIcon } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { CategoryIcon } from '@/variants/a/components/ui/category-icon';
import { coverImageOf, type CourseCategory, type CourseItem } from '../data/courses.mock';

const CATEGORY_ICON: Record<CourseCategory, LucideIcon> = {
  Compliance: ShieldCheck,
  Onboarding: Rocket,
  Upskill: GraduationCap,
};

/** `size="sm"` for table rows (icon only), `"lg"` for card covers (category icon tile) */
export function CourseCover({ course, size, className }: { course: CourseItem; size: 'sm' | 'lg'; className?: string }) {
  const src = coverImageOf(course);
  const Icon = CATEGORY_ICON[course.category] ?? BookOpen;
  if (src) return <ImageWithFallback src={src} alt="" className={cn('object-cover', className)} />;
  return (
    <div className={cn('flex items-center justify-center bg-(--oa-surface-subtle)', className)} aria-hidden>
      {size === 'lg' ? <CategoryIcon icon={Icon} size="md" /> : <Icon size={14} className="text-(--oa-primary)" />}
    </div>
  );
}
