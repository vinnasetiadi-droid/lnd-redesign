/**
 * Option B palette: one blue, #1A73E8, on neutral greys (Finora-style white
 * cards), with a near-black dark version. The design tokens live in
 * option-b.css as CSS variables (light on html.option-b, dark on
 * html.option-b.theme-dark); OB_HEX below lists their light values, OB_COLORS
 * and the shared gradients point at the variables so they follow the theme.
 * OB_PALETTE is the light reference scale (not drawn anywhere).
 */
export const OB_PALETTE = {
  primary: {
    50: '#E8F0FE',
    100: '#D2E3FC',
    200: '#AECBFA',
    300: '#8AB4F8',
    400: '#669DF6',
    500: '#4285F4',
    600: '#1A73E8', // main
    700: '#1967D2',
    800: '#185ABC',
    900: '#174EA6',
  },
  neutral: {
    surface: '#F5F6F8',
    subtle: '#F9FAFB',
    border: '#EDEEF1',
    borderStrong: '#E4E6EA',
  },
  text: { strong: '#181D27', body: '#414651', muted: '#717680' },
} as const;

/**
 * The shared gradients. Each reads a CSS variable from option-b.css, so it
 * follows the light/dark theme; the light values there are the originals:
 *
 * - OB_BACKGROUND: near-white with #1A73E8 glows at 11% (the "Opacity 11%"
 *   swatch), so the blue stays a hint behind the white cards
 * - OB_SHEEN: faint diagonal sheen over the background (a plain gradient: a
 *   blur filter here stops the content from painting)
 * - OB_AI_GRADIENT: AI frame gradient from the #1A73E8 swatches, white at the
 *   top left, through 11% and 57%, to the full colour at the bottom right
 * - OB_AI_SOLID: solid blue for the NISA card (white text on top), soft light
 *   at the top left
 * - OB_AI_SOFT: mostly white with a soft blue glow on the right (NISA card,
 *   dark text on top)
 */
export const OB_BACKGROUND = 'var(--ob-background)';
export const OB_SHEEN = 'var(--ob-sheen)';
export const OB_AI_GRADIENT = 'var(--ob-ai-gradient)';
export const OB_AI_SOLID = 'var(--ob-ai-solid)';
export const OB_AI_SOFT = 'var(--ob-ai-soft)';

/** Geist Mono for numbers drawn in SVG (chart ticks and labels); CSS uses .ob-num */
export const OB_NUM_FONT = "'Geist Mono', ui-monospace, monospace";

/**
 * The light values of the CSS design tokens in option-b.css (html.option-b
 * --ob-*), as plain hex: the documented palette, and the fixed colours of the
 * achievement badges (which look the same in both themes). Keep both lists in
 * step. Anything drawn on the page uses OB_COLORS below instead, so it follows
 * the theme.
 */
export const OB_HEX = {
  primary: '#1A73E8', // The one accent: buttons, selected states, chart highlight
  primaryText: '#1A73E8', // = primary in light; a lighter blue in dark, where blue is text or an icon
  primaryStrong: '#1967D2', // Blue text on a blue tint, link hover
  primary50: '#E8F0FE', // Lightest blue tint (pills, chips)
  primary100: '#D2E3FC',
  primary200: '#AECBFA',
  primary300: '#8AB4F8',
  primary400: '#669DF6',
  primary900: '#174EA6',
  primaryTint: '#F5F9FE', // AI insight row background
  textStrong: '#181D27', // Titles and values
  textHeading: '#252B37',
  textInk: '#0A0D12', // Tooltip background
  textBody: '#414651', // Body text
  textSecondary: '#535862', // Labels
  textMuted: '#717680', // Secondary text
  textSubtle: '#A4A7AE', // Axis ticks, hints
  textAi: '#282828', // Text on the NISA card
  border: '#EDEEF1', // Card dividers, tile outlines
  borderSubtle: '#F1F2F5', // Lines inside a section
  borderStrong: '#E4E6EA',
  track: '#EBEDF0', // Every progress track and empty or unselected bar
  borderControl: '#D0D5DD',
  line: '#D5D7DA', // Chart cursor
  surface: '#F5F6F8', // Segmented controls, icon circles
  surfaceMuted: '#F7F8FA', // Row frames
  surfaceSubtle: '#F9FAFB', // Hover
  buttonSecondary: '#F0F1F3',
  buttonSecondaryHover: '#E6E8EB',
  buttonPrimary: '#1A73E8', // = primary
  buttonPrimaryHover: '#1967D2', // = primaryStrong
  white: '#FFFFFF',
  // Attention = the orange family (the License gauge); one warm warning colour
  attentionText: '#C4320A', // = orangeStrong, readable on white
  attentionSurface: '#FFF6ED', // = orange50
  attentionBar: '#FB6514', // = orange
  attentionTrack: '#FFEAD5', // = orangeSurface
  warning: '#FB6514', // = attentionBar
  orange: '#FB6514',
  orangeStrong: '#C4320A',
  orangeSurface: '#FFEAD5',
  orange50: '#FFF6ED',
  success: '#039855', // Positive trends
  successStrong: '#027A48',
  successSurface: '#ECFDF3',
  success100: '#D1FADF',
  successBright: '#32D583',
  modeSelf: '#AECBFA', // Self-paced series: = primary200, the pale blue (green is only for positive trends)
  danger: '#D92D20', // Negative trends
  dangerStrong: '#B42318',
  dangerSurface: '#FEF3F2',
  danger100: '#FEE4E2',
  dangerBright: '#F97066',
  yellow: '#FFEAD5', // = attentionTrack
  yellowText: '#C4320A', // = attentionText
  brandLinkedin: '#0A66C2', // LinkedIn's own blue, on the LinkedIn creator mark
  avatarPeach: '#FFE4D5', // Avatar pastels
  avatarLilac: '#E9D7FE',
  avatarPink: '#FCE7F6',
  avatarCyan: '#CFF9FE',
  // Course status tags (the borders are color-mix tints in option-b.css)
  statusReview: '#9E77ED', // Violet
  statusReviewText: '#6941C6',
} as const;

export type OBColor = keyof typeof OB_HEX;

/** The CSS variable for a token, for inline styles: obVar('primary') → 'var(--ob-primary)' */
export function obVar(token: OBColor): string {
  return `var(--ob-${token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()})`;
}

/**
 * Every token as its CSS variable, e.g. OB_COLORS.primary = 'var(--ob-primary)'.
 * Tailwind classes use the variables directly (text-(--ob-text-strong)); code
 * that needs a colour string (SVG attributes, recharts props, inline styles)
 * uses these, so it switches with the light/dark theme. They are not hex, so
 * never append an alpha to them or parse them: tint with
 * `color-mix(in srgb, ${color} 20%, transparent)` instead. An SVG mask needs
 * real white, not OB_COLORS.white (the page colour, dark in dark mode).
 */
export const OB_COLORS = Object.fromEntries(
  (Object.keys(OB_HEX) as OBColor[]).map((token) => [token, obVar(token)]),
) as { readonly [K in OBColor]: string };

/** One achievement badge: its gradient, drop shadow, white glow size and (for the ones with one) its icon tint */
export interface ObBadgeTone {
  from: string;
  to: string;
  shadow: string;
  shadowOpacity: number;
  glow: number;
  icon?: string;
}

/**
 * The profile's achievement badges (components/ui/profile-badges): three round
 * badges in Option B's blue scale, from deep to light, so they read as one
 * set with the page's accent. Fixed hex (OB_HEX): blue gradients with a white
 * glow read the same on the light and the dark page.
 */
export const OB_BADGES = {
  white: OB_HEX.white,
  ink: OB_HEX.textInk,
  medal:  { from: OB_HEX.primary900, to: OB_HEX.primary400, shadow: OB_HEX.primary900, shadowOpacity: 0.2, glow: 23, icon: OB_HEX.primary200 },
  star:   { from: OB_HEX.primary, to: OB_HEX.primary300, shadow: OB_HEX.primary900, shadowOpacity: 0.18, glow: 25, icon: OB_HEX.primary100 },
  trophy: { from: OB_HEX.primary400, to: OB_HEX.primary100, shadow: OB_HEX.primary, shadowOpacity: 0.16, glow: 20, icon: OB_HEX.primary50 },
} satisfies Record<string, string | ObBadgeTone>;
