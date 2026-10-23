import type { ComponentType } from 'react';
import { BarChart2, BookOpen, Home, type LucideIcon } from 'lucide-react';
import OptionAHomePage from '@/variants/a/pages/ld/dashboard/page';
import OptionAAnalyticsPage from '@/variants/a/pages/ld/analytics/course/page';
import OptionAUpskillPage from '@/variants/a/pages/ld/learning_management/courses/page';
import OptionBHomePage from '@/variants/b/pages/ld/dashboard/page';
import OptionBAnalyticsPage from '@/variants/b/pages/ld/analytics/course/page';
import OptionBUpskillPage from '@/variants/b/pages/ld/learning_management/courses/page';
import OptionCHomePage from '@/variants/c/pages/ld/dashboard/page';
import OptionCAnalyticsPage from '@/variants/c/pages/ld/analytics/course/page';
import OptionCUpskillPage from '@/variants/c/pages/ld/learning_management/courses/page';
import OptionDHomePage from '@/variants/d/pages/ld/dashboard/page';
import OptionDAnalyticsPage from '@/variants/d/pages/ld/analytics/course/page';
import OptionDUpskillPage from '@/variants/d/pages/ld/learning_management/courses/page';

export type PageKey = 'home' | 'analytics' | 'upskill';

export interface PageInfo {
  key: PageKey;
  /** Route inside an option, without the option prefix */
  path: string;
  title: string;
  icon: LucideIcon;
}

/** The three Admin (L&D) pages every option contains */
export const PAGES: PageInfo[] = [
  { key: 'home',      path: '/ld/dashboard',                   title: 'Home Admin',                 icon: Home },
  { key: 'analytics', path: '/ld/analytics/course',            title: 'Program Analytics',          icon: BarChart2 },
  { key: 'upskill',   path: '/ld/learning-management/courses', title: 'Upskill Studio',             icon: BookOpen },
];

export interface Variant {
  /** URL prefix: /a/ld/dashboard */
  key: string;
  name: string;
  description: string;
  pages: Record<PageKey, ComponentType>;
}

// Each option has its own copy of the pages in src/variants/<key>/, so
// restyling one option never changes the others. The original design stays in
// src/pages/.

export const VARIANTS: Variant[] = [
  {
    key: 'a',
    name: 'Option A',
    description: 'Redesign in progress.',
    // Own copy of the pages, layout and sidebar: src/variants/a/
    pages: { home: OptionAHomePage, analytics: OptionAAnalyticsPage, upskill: OptionAUpskillPage },
  },
  {
    key: 'b',
    name: 'Option B',
    description: 'Starts from a copy of Option A.',
    // Own copy, made from Option A (tokens renamed to --ob-*): src/variants/b/
    pages: { home: OptionBHomePage, analytics: OptionBAnalyticsPage, upskill: OptionBUpskillPage },
  },
  {
    key: 'c',
    name: 'Option C',
    description: 'Starts from a copy of Option A.',
    // Own copy, made from Option A (tokens renamed to --oc-*): src/variants/c/
    pages: { home: OptionCHomePage, analytics: OptionCAnalyticsPage, upskill: OptionCUpskillPage },
  },
  {
    key: 'd',
    name: 'Option D',
    description: 'Starts from a copy of Option A.',
    // Own copy, made from Option A (tokens renamed to --od-*): src/variants/d/
    pages: { home: OptionDHomePage, analytics: OptionDAnalyticsPage, upskill: OptionDUpskillPage },
  },
];

export function variantHref(variant: Variant, pagePath: string = PAGES[0].path): string {
  return `/${variant.key}${pagePath}`;
}
