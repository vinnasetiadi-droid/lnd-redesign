// Achievement badges from the original L&D profile header (src/pages): three
// hexagons (medal, star, trophy) and a stack of three with "5+", ported for
// Option D. Same shapes and gradients; colours come from OD_BADGES in
// theme.ts, ids are unique per instance and the size is a prop (56px in the
// original).

import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import svgPaths from '@/imports/svg-funnql1szj';
import { OD_BADGES, type OdBadgeTone } from '@/variants/d/theme';

/** The hexagon's drawing space; the visible hexagon is `size` wide, the rest is room for its shadow */
const VIEWBOX = '0 0 80.4974 84.2872';
const HEX_INSET = '-10.97% -21.87% -39.54% -21.87%';

function Hexagon({ tone, size, glowY = 62.1436, glowOpacity = 0.75, children }: {
  tone: OdBadgeTone;
  size: number;
  /** Where the white glow sits (the star's is a little higher) */
  glowY?: number;
  glowOpacity?: number;
  /** Extra paths in the hexagon's drawing space (the star, the trophy); `id` prefixes their gradients */
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
            <path d={svgPaths.p367cf1f0} fill={`url(#${id}-fill)`} />
            <path d={svgPaths.p367cf1f0} fill={`url(#${id}-glow)`} fillOpacity={glowOpacity} />
            <path d={svgPaths.p2a5ab800} stroke={`url(#${id}-edge)`} />
          </g>
          {children?.(id)}
        </svg>
      </div>
    </div>
  );
}

/** A white-to-tint gradient for an icon drawn in the hexagon's space */
function iconGradient(id: string, to: string, y1: number, y2: number) {
  return (
    <linearGradient id={id} x1="40.2487" x2="40.2487" y1={y1} y2={y2} gradientUnits="userSpaceOnUse">
      <stop stopColor={OD_BADGES.white} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

/** The medal sits in its own small drawing space in the middle of the hexagon */
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

/**
 * The profile's achievement badges: medal, star, trophy, then a stack of
 * three with "5+". `size` is one hexagon's width (the original used 56px).
 */
export function ProfileBadges({ size = 56, className }: { size?: number; className?: string }) {
  const k = size / 56;
  return (
    <div className={cn('flex w-fit shrink-0 items-end', className)} aria-label="Achievement badges" role="img">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <Hexagon tone={OD_BADGES.medal} size={size} />
        <MedalIcon size={size} />
      </div>
      <div style={{ marginLeft: -4 * k }}>
        <Hexagon tone={OD_BADGES.star} size={size} glowY={60.6436}>
          {(id) => (
            <>
              <defs>{iconGradient(`${id}-icon`, OD_BADGES.star.icon, 32.1436, 54.1436)}</defs>
              <path d={svgPaths.p68e2400} fill={`url(#${id}-icon)`} />
            </>
          )}
        </Hexagon>
      </div>
      <div style={{ marginLeft: -4 * k }}>
        <Hexagon tone={OD_BADGES.trophy} size={size}>
          {(id) => (
            <>
              <defs>{iconGradient(`${id}-icon`, OD_BADGES.trophy.icon, 30.1436, 61.6436)}</defs>
              <path d={svgPaths.p1cba6f80} fill={`url(#${id}-icon)`} />
            </>
          )}
        </Hexagon>
      </div>
      {/* "5+ more": three hexagons stacked, 12px apart at full size */}
      <div className="relative shrink-0" style={{ width: 78 * k, height: size, marginLeft: -4 * k }}>
        {[OD_BADGES.stack3, OD_BADGES.stack2, OD_BADGES.stack1].map((tone, i) => (
          <div key={i} className="absolute top-0" style={{ left: 12 * k * i, zIndex: i }}>
            <Hexagon tone={tone} size={size} glowOpacity={0.6} />
          </div>
        ))}
        <span
          className="absolute top-0 z-10 flex items-center justify-center font-medium text-(--od-white) drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          style={{ left: 24 * k, width: size, height: size, fontSize: 16 * k }}
        >
          5+
        </span>
      </div>
    </div>
  );
}
