// Option B motion: short, eased, run once. Cards rise in from a soft blur,
// charts draw themselves when they scroll into view, numbers count up.
// MotionConfig in DashboardLayout turns all of it off for reduced motion.

import type { Variants } from 'motion/react';

/** Fast start, long soft landing */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Page grid: reveals its cards one after another */
export const revealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** One card: rises 14px out of a light blur */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    // A leftover filter would make the card a containing block for fixed children
    transitionEnd: { filter: 'none' },
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};
