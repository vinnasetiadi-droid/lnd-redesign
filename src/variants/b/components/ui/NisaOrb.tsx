import { cn } from '@/lib/utils';
import { OB_HEX } from '@/variants/b/theme';

/**
 * NISA's avatar in Option B: a soft blue orb (the reference blob, recoloured
 * to the --ob-primary family). Strong blue across the top and on the bottom
 * right edge, lighter blue in the middle, fading to pale at the bottom. A white inner shadow
 * keeps its edge visible on the blue NISA card.
 */
// The light blues as fixed values: the orb sits on the blue NISA card in both
// themes, so it keeps its pale bottom in dark too (the dark tokens are washes)
const ORB = { primary: OB_HEX.primary, p400: OB_HEX.primary400, p100: OB_HEX.primary100, tint: OB_HEX.primaryTint };
const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
const ORB_BACKGROUND = [
  `radial-gradient(70% 60% at 30% 22%, ${ORB.primary} 0%, transparent 75%)`,
  `radial-gradient(55% 45% at 62% 48%, ${mix(ORB.p400, 85)} 0%, transparent 75%)`,
  `radial-gradient(40% 40% at 92% 88%, ${ORB.primary} 0%, transparent 70%)`,
  `radial-gradient(60% 45% at 50% 100%, ${ORB.tint} 0%, transparent 75%)`,
  `radial-gradient(35% 45% at 100% 30%, ${mix(ORB.p100, 90)} 0%, transparent 70%)`,
  `linear-gradient(180deg, ${ORB.primary} 0%, ${ORB.p400} 50%, ${ORB.p100} 100%)`,
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
