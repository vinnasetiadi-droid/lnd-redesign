/**
 * Option D palette: one blue, #1A73E8, on neutral greys (Finora-style white
 * cards). The design tokens live in option-d.css as CSS variables; OD_COLORS
 * below is their documented mirror, plus the shared gradients.
 */
export const OD = {
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
export const OD_BACKGROUND = [
  'radial-gradient(55% 60% at 0% 0%, rgba(26, 115, 232, 0.11) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(50% 55% at 100% 100%, rgba(26, 115, 232, 0.09) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(40% 45% at 100% 0%, rgba(26, 115, 232, 0.05) 0%, rgba(26, 115, 232, 0) 70%)',
  '#F7F9FC',
].join(', ');

/** Faint diagonal sheen over the background. Plain gradient: a blur filter here stops the content from painting. */
export const OD_SHEEN =
  'linear-gradient(115deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.55) 48%, rgba(255, 255, 255, 0) 66%)';

/**
 * AI frame gradient from the #1A73E8 swatches: white at the top left, through
 * 11% and 57%, to the full colour at the bottom right.
 */
export const OD_AI_GRADIENT = [
  'radial-gradient(110% 110% at 0% 0%, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 25%, rgba(255, 255, 255, 0) 60%)',
  'radial-gradient(95% 95% at 100% 100%, #1A73E8 0%, rgba(26, 115, 232, 0.57) 45%, rgba(26, 115, 232, 0.11) 85%)',
  '#E8F0FE',
].join(', ');

/** Solid blue for the NISA card (white text on top): soft light at the top left */
export const OD_AI_SOLID = [
  'radial-gradient(120% 80% at 0% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 55%)',
  'linear-gradient(160deg, #2F80F0 0%, #1A73E8 45%, #1764D0 100%)',
].join(', ');

/** Mostly white with a soft blue glow on the right (NISA card, dark text on top) */
export const OD_AI_SOFT = [
  'radial-gradient(85% 65% at 100% 0%, rgba(26, 115, 232, 0.16) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(75% 55% at 100% 100%, rgba(26, 115, 232, 0.12) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(60% 40% at 0% 100%, rgba(138, 180, 248, 0.10) 0%, rgba(138, 180, 248, 0) 70%)',
  '#FFFFFF',
].join(', ');

/**
 * Mirror of the CSS design tokens in option-d.css (html.option-d --od-*).
 * Tailwind classes use the variables, e.g. text-(--od-text-strong); code that
 * needs a plain colour string (SVG attributes, recharts props) uses these.
 * Keep both lists in step.
 */
export const OD_COLORS = {
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
  attentionText: '#B54708', // Amber, only for things that need attention
  attentionSurface: '#FFFAEB',
  attentionBar: '#FEC84B',
  attentionTrack: '#FEF0C7',
  warning: '#FDB022',
  orange: '#FB6514',
  orangeStrong: '#C4320A',
  orangeSurface: '#FFEAD5',
  success: '#039855', // Positive trends
  successStrong: '#027A48',
  successSurface: '#ECFDF3',
  success100: '#D1FADF',
  successBright: '#32D583',
  modeSelf: '#34A853', // Self-paced series
  danger: '#D92D20', // Negative trends
  dangerStrong: '#B42318',
  dangerSurface: '#FEF3F2',
  danger100: '#FEE4E2',
  dangerBright: '#F97066',
  yellow: '#FFE07A',
  yellowText: '#6B4F00',
  avatarPeach: '#FFE4D5', // Avatar pastels
  avatarLilac: '#E9D7FE',
  avatarPink: '#FCE7F6',
  avatarCyan: '#CFF9FE',
  // Course status chips: a tint and a stronger bar of the same hue
  statusDraftBg: '#F2F4F7',
  statusDraft: '#98A2B3',
  statusReviewBg: '#F4EBFF',
  statusReview: '#9E77ED',
  statusRevisionBg: '#FEE4E2',
  statusRevision: '#F97066',
  statusApprovedBg: '#DCFAE6',
  statusApproved: '#17B26A',
  statusActiveBg: '#DCE8FC',
  statusActive: '#1A73E8',
  statusInactiveBg: '#F2F4F7',
  statusInactive: '#D0D5DD',
} as const;

export type ODColor = keyof typeof OD_COLORS;

/** The CSS variable for a token, for inline styles: odVar('primary') → 'var(--od-primary)' */
export function odVar(token: ODColor): string {
  return `var(--od-${token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()})`;
}

/** One achievement badge: its gradient, drop shadow, white glow size and (for the ones with one) its icon tint */
export interface OdBadgeTone {
  from: string;
  to: string;
  shadow: string;
  shadowOpacity: number;
  glow: number;
  icon?: string;
}

/**
 * The original L&D profile's achievement badges (components/ui/profile-badges),
 * with the colours they had there: a purple medal, a blue star, a cyan trophy
 * and a stack of three soft hexagons behind "5+".
 */
export const OD_BADGES = {
  white: '#FFFFFF',
  ink: '#000000',
  medal:  { from: '#9F8FFE', to: '#D1B6FC', shadow: '#575FCF', shadowOpacity: 0.175, glow: 23, icon: '#C0A0FA' },
  star:   { from: '#1056D9', to: '#4DA9FF', shadow: '#1E3799', shadowOpacity: 0.175, glow: 25, icon: '#459DFA' },
  trophy: { from: '#56B3F2', to: '#50E5FB', shadow: '#1E3799', shadowOpacity: 0.175, glow: 20, icon: '#CDF5FE' },
  stack3: { from: '#93C5FD', to: '#BFDBFE', shadow: '#6673D9', shadowOpacity: 0.1, glow: 23 },
  stack2: { from: '#818CF8', to: '#A5B4FC', shadow: '#5959CC', shadowOpacity: 0.12, glow: 23 },
  stack1: { from: '#7C6BF0', to: '#A78BFA', shadow: '#4D40BF', shadowOpacity: 0.15, glow: 23 },
} satisfies Record<string, string | OdBadgeTone>;
