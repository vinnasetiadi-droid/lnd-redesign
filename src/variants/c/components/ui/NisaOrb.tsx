import { cn } from '@/lib/utils';

/**
 * NISA's avatar in Option C: a soft blue orb (the reference blob, recoloured
 * to Option C's blue family). Strong blue across the top and on the bottom
 * right edge, lighter blue in the middle, fading to pale at the bottom. A white inner shadow
 * keeps its edge visible on the blue NISA card. Its pale parts are their own
 * tokens (--oc-orb-*), so it stays a luminous blue on navy in dark.
 */
const mix = (token: string, pct: number) => `color-mix(in srgb, var(--oc-${token}) ${pct}%, transparent)`;
const ORB_BACKGROUND = [
  'radial-gradient(70% 60% at 30% 22%, var(--oc-primary) 0%, transparent 75%)',
  `radial-gradient(55% 45% at 62% 48%, ${mix('primary-400', 85)} 0%, transparent 75%)`,
  'radial-gradient(40% 40% at 92% 88%, var(--oc-primary) 0%, transparent 70%)',
  'radial-gradient(60% 45% at 50% 100%, var(--oc-orb-pale) 0%, transparent 75%)',
  `radial-gradient(35% 45% at 100% 30%, ${mix('orb-soft', 90)} 0%, transparent 70%)`,
  'linear-gradient(180deg, var(--oc-primary) 0%, var(--oc-primary-400) 50%, var(--oc-orb-soft) 100%)',
].join(', ');

/** White inner edge (softer in dark, so it reads as an edge, not a glow); in option-c.css */
const ORB_INNER_SHADOW = 'var(--oc-orb-shadow)';

export function NisaOrb({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 rounded-full', className)}
      style={{ width: size, height: size, background: ORB_BACKGROUND, boxShadow: ORB_INNER_SHADOW }}
    />
  );
}
