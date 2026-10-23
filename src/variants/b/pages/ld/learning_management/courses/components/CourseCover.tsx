// Course cover: the course's own photo, or a tinted cover with its category
// icon when it has none or shares the photo with another course.

import { BookOpen, GraduationCap, Rocket, ShieldCheck, type LucideIcon } from '@/variants/b/icons';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { CategoryIcon } from '@/variants/b/components/ui/category-icon';
import { coverImageOf, type CourseCategory, type CourseItem } from '../data/courses.mock';

/** Icon per course category, shared by covers and the cards */
export const CATEGORY_ICON: Record<CourseCategory, LucideIcon> = {
  Compliance: ShieldCheck,
  Onboarding: Rocket,
  Upskill: GraduationCap,
};

/** `size="sm"` for table rows (icon only), `"lg"` for card covers (category icon tile) */
export function CourseCover({ course, size, className }: { course: CourseItem; size: 'sm' | 'lg'; className?: string }) {
  const src = coverImageOf(course);
  const Icon = CATEGORY_ICON[course.category] ?? BookOpen;
  // One shared treatment so the photos read as a set: slightly desaturated
  if (src) return <ImageWithFallback src={src} alt="" className={cn('object-cover saturate-[.8]', className)} />;
  return (
    <div className={cn('flex items-center justify-center bg-(--ob-surface-subtle)', className)} aria-hidden>
      {size === 'lg' ? <CategoryIcon icon={Icon} size="md" /> : <Icon size={14} className="text-(--ob-primary-text)" />}
    </div>
  );
}
