// Achievement badges from the original L&D profile header (src/pages), as
// three round badges (medal, star, trophy) for Option D. The original's
// gradient fill, white glow, white edge highlight, drop shadow and icons are
// kept; the hexagons became circles and the stack of extra badges was dropped
// (user's request). Colours come from OD_BADGES in theme.ts (Option D's blue
// scale), ids are unique per instance and the size is a prop (56px in the
// original).

import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import svgPaths from '@/imports/svg-funnql1szj';
import { OD_BADGES, type OdBadgeTone } from '@/variants/d/theme';

/** The badge's drawing space; the visible circle is `size` wide, the rest is room for its shadow */
const VIEWBOX = '0 0 80.4974 84.2872';
const HEX_INSET = '-10.97% -21.87% -39.54% -21.87%';
/** The circle in that space: the box the hexagon used to fill (x 12.25 to 68.25, y 6.14 to 62.14) */
const CIRCLE = { cx: 40.2487, cy: 34.1436, r: 28 };

function Badge({ tone, size, glowY = 62.1436, glowOpacity = 0.75, children }: {
  tone: OdBadgeTone;
  size: number;
  /** Where the white glow sits (the star's is a little higher) */
  glowY?: number;
  glowOpacity?: number;
  /** Extra paths in the badge's drawing space (the star, the trophy); `id` prefixes their gradients */
  children?: (id: string) => ReactNode;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute" style={{ inset: HEX_INSET }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={VIEWBOX} aria-hidden>
          <defs>
            <filter id={`${id}-shadow`} x="0" y="0" width="80.4974" height="84.2872" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor={tone.shadow} floodOpacity={tone.shadowOpacity} />
            </filter>
            <linearGradient id={`${id}-fill`} x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436" gradientUnits="userSpaceOnUse">
              <stop stopColor={tone.from} />
              <stop offset="1" stopColor={tone.to} />
            </linearGradient>
            <radialGradient id={`${id}-glow`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(40.2487 ${glowY}) rotate(-90) scale(${tone.glow})`}>
              <stop stopColor={OD_BADGES.white} />
              <stop offset="1" stopColor={OD_BADGES.white} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${id}-edge`} x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436" gradientUnits="userSpaceOnUse">
              <stop offset="0.552885" stopColor={OD_BADGES.white} />
              <stop offset="1" stopColor={OD_BADGES.white} stopOpacity="0" />
            </linearGradient>
          </defs>
          <g filter={`url(#${id}-shadow)`}>
            <circle {...CIRCLE} fill={`url(#${id}-fill)`} />
            <circle {...CIRCLE} fill={`url(#${id}-glow)`} fillOpacity={glowOpacity} />
            <circle {...CIRCLE} r={CIRCLE.r - 0.5} stroke={`url(#${id}-edge)`} />
          </g>
          {children?.(id)}
        </svg>
      </div>
    </div>
  );
}

/** A white-to-tint gradient for an icon drawn in the badge's space */
function iconGradient(id: string, to: string, y1: number, y2: number) {
  return (
    <linearGradient id={id} x1="40.2487" x2="40.2487" y1={y1} y2={y2} gradientUnits="userSpaceOnUse">
      <stop stopColor={OD_BADGES.white} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

/** The medal sits in its own small drawing space in the middle of the badge */
function MedalIcon({ size }: { size: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className="absolute" style={{ left: size / 4, top: size / 4, width: size / 2, height: size / 2 }}>
      <div className="absolute" style={{ inset: '0 16.67%' }}>
        <div className="absolute" style={{ inset: '-24.87% -42.86% -32.28% -42.86%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6667 44" aria-hidden>
            <defs>
              <filter id={`${id}-shadow`} x="0" y="0" width="34.6667" height="44.0001" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="1.03704" stdDeviation="4" floodColor={OD_BADGES.ink} floodOpacity="0.2" />
              </filter>
              <linearGradient id={`${id}-fill`} x1="17.3333" x2="17.3333" y1="16.5556" y2="48.1852" gradientUnits="userSpaceOnUse">
                <stop stopColor={OD_BADGES.white} />
                <stop offset="1" stopColor={OD_BADGES.medal.icon} />
              </linearGradient>
            </defs>
            <g filter={`url(#${id}-shadow)`}>
              <path d={svgPaths.p6a8ac00} fill={`url(#${id}-fill)`} />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

/** The profile's achievement badges: medal, star and trophy. `size` is one badge's width (the original used 56px). */
export function ProfileBadges({ size = 56, className }: { size?: number; className?: string }) {
  const k = size / 56;
  return (
    <div className={cn('flex w-fit shrink-0 items-end', className)} aria-label="Achievement badges" role="img">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <Badge tone={OD_BADGES.medal} size={size} />
        <MedalIcon size={size} />
      </div>
      <div style={{ marginLeft: 4 * k }}>
        <Badge tone={OD_BADGES.star} size={size} glowY={60.6436}>
          {(id) => (
            <>
              <defs>{iconGradient(`${id}-icon`, OD_BADGES.star.icon, 32.1436, 54.1436)}</defs>
              <path d={svgPaths.p68e2400} fill={`url(#${id}-icon)`} />
            </>
          )}
        </Badge>
      </div>
      <div style={{ marginLeft: 4 * k }}>
        <Badge tone={OD_BADGES.trophy} size={size}>
          {(id) => (
            <>
              <defs>{iconGradient(`${id}-icon`, OD_BADGES.trophy.icon, 30.1436, 61.6436)}</defs>
              <path d={svgPaths.p1cba6f80} fill={`url(#${id}-icon)`} />
            </>
          )}
        </Badge>
      </div>
    </div>
  );
}
