import { cn } from '@/lib/utils';

/**
 * NISA's avatar in Option D: a soft blue orb (the reference blob, recoloured
 * to the #0E85B4 palette). Strong blue across the top and on the bottom
 * right edge, lighter blue in the middle, fading to pale at the bottom. A white inner shadow
 * keeps its edge visible on the blue NISA card.
 */
const ORB_BACKGROUND = [
  'radial-gradient(70% 60% at 30% 22%, #0E85B4 0%, rgba(14, 133, 180, 0) 75%)',
  'radial-gradient(55% 45% at 62% 48%, rgba(69, 178, 220, 0.85) 0%, rgba(69, 178, 220, 0) 75%)',
  'radial-gradient(40% 40% at 92% 88%, #0E85B4 0%, rgba(14, 133, 180, 0) 70%)',
  'radial-gradient(60% 45% at 50% 100%, #EDF8FC 0%, rgba(237, 248, 252, 0) 75%)',
  'radial-gradient(35% 45% at 100% 30%, rgba(212, 238, 248, 0.9) 0%, rgba(212, 238, 248, 0) 70%)',
  'linear-gradient(180deg, #1E9ED0 0%, #62C0E4 50%, #CDEBF6 100%)',
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
