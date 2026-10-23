/**
 * Option C palette: sky blue (#2C87E8, as bright as the NISA blob) as the one
 * accent on cool greys, black buttons and a black-to-blue gradient for the
 * NISA priority card. The design tokens live in
 * option-c.css as CSS variables; OC_COLORS below is their documented mirror,
 * plus the shared gradients.
 */
export const OC = {
  primary: {
    50: '#F0F7FE',
    100: '#DDEDFD',
    200: '#BCDAFB',
    300: '#8EC0F6',
    400: '#5DA3EF',
    500: '#2C87E8', // main
    700: '#1D6DC3',
    900: '#113C69',
  },
  neutral: {
    surface: '#EFF3F8',
    subtle: '#F8F9FB',
    border: '#E2E9F0',
    borderStrong: '#D8E0E9',
  },
  text: { strong: '#12263A', body: '#374C62', muted: '#6B7C8E' },
} as const;

/**
 * Page background, after the sky reference: a light sky blue from the top
 * (--oc-sky) fading into the cool grey page, with a soft white haze.
 */
export const OC_BACKGROUND = [
  'radial-gradient(60% 34% at 18% 0%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%)',
  'radial-gradient(45% 30% at 82% 4%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)',
  'linear-gradient(180deg, var(--oc-sky) 0%, color-mix(in srgb, var(--oc-sky) 70%, var(--oc-surface-muted)) 200px, color-mix(in srgb, var(--oc-sky) 30%, var(--oc-surface-muted)) 380px, var(--oc-surface-muted) 560px)',
].join(', ');

/** Kept for the background component: no sheen in Option C */
export const OC_SHEEN = 'none';

/** NISA (AI), wide: deep navy into blue from left to right */
export const OC_AI_GRADIENT = 'var(--oc-ai-gradient)';

/** NISA priority card: deep navy at the top into blue, lighter at the bottom right (the "Kresna" card) */
export const OC_AI_SOLID = 'var(--oc-ai-gradient-tall)';

/** Same as OC_AI_SOLID; kept for the old call sites */
export const OC_AI_SOFT = OC_AI_SOLID;

/**
 * Mirror of the CSS design tokens in option-c.css (html.option-c --oc-*).
 * Tailwind classes use the variables, e.g. text-(--oc-text-strong); code that
 * needs a plain colour string (SVG attributes, recharts props) uses these.
 * Keep both lists in step.
 */
export const OC_COLORS = {
  primary: '#2C87E8', // Sky blue: selected states, chart highlight, links
  primaryStrong: '#1D6DC3', // Blue text on a tint, link hover
  primary50: '#F0F7FE', // Lightest tint (chips, selected rows)
  primary100: '#DDEDFD',
  primary200: '#BCDAFB',
  primary300: '#8EC0F6',
  primary400: '#5DA3EF',
  primary900: '#113C69',
  primaryTint: '#F8FBFF',
  sky: '#A5D0FD', // The light sky blue at the top of the page
  textStrong: '#12263A', // Titles and values: dark navy
  textHeading: '#1B3046',
  textInk: '#0A1929', // Near-black navy: primary buttons, tooltips, the value pill
  textBody: '#374C62', // Body text
  textSecondary: '#4E6074', // Labels
  textMuted: '#6B7C8E', // Secondary text
  textSubtle: '#9DAAB8', // Axis ticks, hints
  textAi: '#1B3046',
  border: '#E2E9F0', // Card outlines, dividers
  borderStrong: '#D8E0E9', // Progress tracks
  borderControl: '#C7D1DB',
  line: '#CDD6DF', // Chart cursor
  surface: '#EFF3F8', // Segmented controls, icon boxes, card header bands
  surfaceMuted: '#F4F7FA', // Row frames
  surfaceSubtle: '#F8FAFC', // Hover
  buttonSecondary: '#FFFFFF', // White with a hairline
  buttonSecondaryHover: '#F4F7FA',
  buttonPrimary: '#0A1929', // = textInk: primary buttons are near-black navy
  buttonPrimaryHover: '#172D45',
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
  modeSelf: '#8EC0F6', // Self-paced series: = primary300, the light blue
  danger: '#D92D20', // Negative trends
  dangerStrong: '#B42318',
  dangerSurface: '#FEF3F2',
  danger100: '#FEE4E2',
  dangerBright: '#F97066',
  yellow: '#FFE07A',
  yellowText: '#6B4F00',
  brandLinkedin: '#0A66C2', // LinkedIn's own blue, on the LinkedIn creator mark
  avatarPeach: '#FFE4D5', // Avatar pastels
  avatarLilac: '#E9D7FE',
  avatarPink: '#FCE7F6',
  avatarCyan: '#CFF9FE',
  // Course status chips: a tint and a stronger bar of the same hue
  statusDraftBg: '#EFF3F8',
  statusDraft: '#95A3B2',
  statusReviewBg: '#F4EBFF',
  statusReview: '#9E77ED',
  statusRevisionBg: '#FEE4E2',
  statusRevision: '#F97066',
  statusApprovedBg: '#DCFAE6',
  statusApproved: '#17B26A',
  statusActiveBg: '#DDEDFD',
  statusActive: '#2C87E8',
  statusInactiveBg: '#EFF3F8',
  statusInactive: '#C7D1DB',
} as const;

export type OCColor = keyof typeof OC_COLORS;

/** The CSS variable for a token, for inline styles: ocVar('primary') → 'var(--oc-primary)' */
export function ocVar(token: OCColor): string {
  return `var(--oc-${token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()})`;
}
