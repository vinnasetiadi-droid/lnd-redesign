/**
 * Option C palette: sky blue (#2D86E8, as bright as the NISA blob) as the one
 * accent on cool greys, black buttons and a black-to-blue gradient for the
 * NISA priority card. The design tokens live in
 * option-c.css as CSS variables; OC_COLORS below is their documented mirror,
 * plus the shared gradients.
 */
export const OC = {
  primary: {
    50: '#EDF5FE',
    100: '#DAEBFD',
    200: '#B7D6FA',
    300: '#88BBF5',
    400: '#5BA1EF',
    500: '#2D86E8', // main
    700: '#1F6CC4',
    900: '#123E73',
  },
  neutral: {
    surface: '#F1F3F7',
    subtle: '#F8F9FB',
    border: '#E6E9EF',
    borderStrong: '#DDE2E9',
  },
  text: { strong: '#13223A', body: '#34455F', muted: '#66778F' },
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
  primary: '#2D86E8', // Sky blue: selected states, chart highlight, links
  primaryStrong: '#1F6CC4', // Blue text on a tint, link hover
  primary50: '#EDF5FE', // Lightest tint (chips, selected rows)
  primary100: '#DAEBFD',
  primary200: '#B7D6FA',
  primary300: '#88BBF5',
  primary400: '#5BA1EF',
  primary900: '#123E73',
  primaryTint: '#F4F9FE',
  sky: '#C2DCF6', // The light sky blue at the top of the page
  textStrong: '#13223A', // Titles and values: dark navy
  textHeading: '#1A2B45',
  textInk: '#0C1729', // Near-black navy: primary buttons, tooltips, the value pill
  textBody: '#34455F', // Body text
  textSecondary: '#4A5B75', // Labels
  textMuted: '#66778F', // Secondary text
  textSubtle: '#9AA8BC', // Axis ticks, hints
  textAi: '#1A2B45',
  border: '#E6E9EF', // Card outlines, dividers
  borderStrong: '#DDE2E9', // Progress tracks
  borderControl: '#CDD3DC',
  line: '#D3D9E1', // Chart cursor
  surface: '#F1F3F7', // Segmented controls, icon boxes, card header bands
  surfaceMuted: '#F5F7FA', // Row frames
  surfaceSubtle: '#F8F9FB', // Hover
  buttonSecondary: '#FFFFFF', // White with a hairline
  buttonSecondaryHover: '#F5F7FA',
  buttonPrimary: '#0C1729', // = textInk: primary buttons are near-black navy
  buttonPrimaryHover: '#1B2C47',
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
  modeSelf: '#88BBF5', // Self-paced series: = primary300, the light blue
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
  statusDraftBg: '#F2F4F7',
  statusDraft: '#98A2B3',
  statusReviewBg: '#F4EBFF',
  statusReview: '#9E77ED',
  statusRevisionBg: '#FEE4E2',
  statusRevision: '#F97066',
  statusApprovedBg: '#DCFAE6',
  statusApproved: '#17B26A',
  statusActiveBg: '#DAEBFD',
  statusActive: '#2D86E8',
  statusInactiveBg: '#F2F4F7',
  statusInactive: '#D0D5DD',
} as const;

export type OCColor = keyof typeof OC_COLORS;

/** The CSS variable for a token, for inline styles: ocVar('primary') → 'var(--oc-primary)' */
export function ocVar(token: OCColor): string {
  return `var(--oc-${token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()})`;
}
