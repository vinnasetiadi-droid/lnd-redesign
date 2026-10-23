import { cn } from '@/lib/utils';

/**
 * NISA's avatar in Option B: a soft blue orb (the reference blob, recoloured
 * to the --ob-primary family). Strong blue across the top and on the bottom
 * right edge, lighter blue in the middle, fading to pale at the bottom. A white inner shadow
 * keeps its edge visible on the blue NISA card.
 */
const mix = (token: string, pct: number) => `color-mix(in srgb, var(--ob-${token}) ${pct}%, transparent)`;
const ORB_BACKGROUND = [
  'radial-gradient(70% 60% at 30% 22%, var(--ob-primary) 0%, transparent 75%)',
  `radial-gradient(55% 45% at 62% 48%, ${mix('primary-400', 85)} 0%, transparent 75%)`,
  'radial-gradient(40% 40% at 92% 88%, var(--ob-primary) 0%, transparent 70%)',
  'radial-gradient(60% 45% at 50% 100%, var(--ob-primary-tint) 0%, transparent 75%)',
  `radial-gradient(35% 45% at 100% 30%, ${mix('primary-100', 90)} 0%, transparent 70%)`,
  'linear-gradient(180deg, var(--ob-primary) 0%, var(--ob-primary-400) 50%, var(--ob-primary-100) 100%)',
].join(', ');

const ORB_INNER_SHADOW = [
  'inset 0 0 0 1px rgba(255, 255, 255, 0.55)',
  'inset 0 2px 6px rgba(255, 255, 255, 0.75)',
  'inset 0 -2px 8px rgba(255, 255, 255, 0.4)',
].join(', ');

export function NisaOrb({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 rounded-full', className)}
      style={{ width: size, height: size, background: ORB_BACKGROUND, boxShadow: ORB_INNER_SHADOW }}
    />
  );
}
