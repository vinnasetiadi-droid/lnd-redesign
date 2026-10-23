/**
 * Option B palette: one blue, #1A73E8, on neutral greys (Finora-style white
 * cards). The design tokens live in option-b.css as CSS variables; OB_COLORS
 * below is their documented mirror, plus the shared gradients.
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
 * Page background: near-white with #1A73E8 glows at 11% (the "Opacity 11%"
 * swatch), so the blue stays a hint behind the white cards.
 */
export const OB_BACKGROUND = [
  'radial-gradient(55% 60% at 0% 0%, rgba(26, 115, 232, 0.11) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(50% 55% at 100% 100%, rgba(26, 115, 232, 0.09) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(40% 45% at 100% 0%, rgba(26, 115, 232, 0.05) 0%, rgba(26, 115, 232, 0) 70%)',
  '#F7F9FC',
].join(', ');

/** Faint diagonal sheen over the background. Plain gradient: a blur filter here stops the content from painting. */
export const OB_SHEEN =
  'linear-gradient(115deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.55) 48%, rgba(255, 255, 255, 0) 66%)';

/**
 * AI frame gradient from the #1A73E8 swatches: white at the top left, through
 * 11% and 57%, to the full colour at the bottom right.
 */
export const OB_AI_GRADIENT = [
  'radial-gradient(110% 110% at 0% 0%, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 25%, rgba(255, 255, 255, 0) 60%)',
  'radial-gradient(95% 95% at 100% 100%, #1A73E8 0%, rgba(26, 115, 232, 0.57) 45%, rgba(26, 115, 232, 0.11) 85%)',
  '#E8F0FE',
].join(', ');

/** Solid blue for the NISA card (white text on top): soft light at the top left */
export const OB_AI_SOLID = [
  'radial-gradient(120% 80% at 0% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 55%)',
  'linear-gradient(160deg, #2F80F0 0%, #1A73E8 45%, #1764D0 100%)',
].join(', ');

/** Mostly white with a soft blue glow on the right (NISA card, dark text on top) */
export const OB_AI_SOFT = [
  'radial-gradient(85% 65% at 100% 0%, rgba(26, 115, 232, 0.16) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(75% 55% at 100% 100%, rgba(26, 115, 232, 0.12) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(60% 40% at 0% 100%, rgba(138, 180, 248, 0.10) 0%, rgba(138, 180, 248, 0) 70%)',
  '#FFFFFF',
].join(', ');

/**
 * Mirror of the CSS design tokens in option-b.css (html.option-b --ob-*).
 * Tailwind classes use the variables, e.g. text-(--ob-text-strong); code that
 * needs a plain colour string (SVG attributes, recharts props) uses these.
 * Keep both lists in step.
 */
/** Geist Mono for numbers drawn in SVG (chart ticks and labels); CSS uses .ob-num */
export const OB_NUM_FONT = "'Geist Mono', ui-monospace, monospace";

export const OB_COLORS = {
  primary: '#1A73E8', // The one accent: buttons, selected states, chart highlight
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
  borderStrong: '#E4E6EA', // Progress tracks
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
  success200: '#A6F4C5', // Pale green band of the learning funnel (self-paced)
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

export type OBColor = keyof typeof OB_COLORS;

/** The CSS variable for a token, for inline styles: obVar('primary') → 'var(--ob-primary)' */
export function obVar(token: OBColor): string {
  return `var(--ob-${token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()})`;
}
