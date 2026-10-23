/**
 * Option C palette: sky blue (#2C87E8, as bright as the NISA blob) as the one
 * accent on cool greys, black buttons and a black-to-blue gradient for the
 * NISA priority card; navy in dark (html.option-c.theme-dark). The design
 * tokens live in option-c.css as CSS variables; OC_COLORS below hands them to
 * JS as var() strings, plus the shared gradients.
 */
/** The light palette as hex, for reference only: it does not follow dark, so code uses OC_COLORS */
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
 * (--oc-sky) fading into the cool grey page, with a soft white haze; in dark a
 * subtle deep-blue glow fading into the navy page. Defined in option-c.css
 * (--oc-page-background) so it follows the theme.
 */
export const OC_BACKGROUND = 'var(--oc-page-background)';

/** Kept for the background component: no sheen in Option C */
export const OC_SHEEN = 'none';

/** NISA (AI), wide: deep navy into blue from left to right */
export const OC_AI_GRADIENT = 'var(--oc-ai-gradient)';

/** NISA priority card: deep navy at the top into blue, lighter at the bottom right (the "Kresna" card) */
export const OC_AI_SOLID = 'var(--oc-ai-gradient-tall)';

/** Same as OC_AI_SOLID; kept for the old call sites */
export const OC_AI_SOFT = OC_AI_SOLID;

/**
 * The CSS design tokens in option-c.css (html.option-c --oc-*), as `var()`
 * strings for code that sets a colour in JS (inline styles, SVG fill / stroke /
 * stop-color, recharts props). Being variables, they follow light and dark
 * (html.option-c.theme-dark) on their own. They are not hex: to fade one, use
 * color-mix(in srgb, <value> 20%, transparent), never string maths.
 * Tailwind classes use the variables directly, e.g. text-(--oc-text-strong).
 * The comments describe the light values. Keep both lists in step.
 */
export const OC_COLORS = {
  primary: 'var(--oc-primary)', // Sky blue: selected states, chart highlight, links
  primaryStrong: 'var(--oc-primary-strong)', // Blue text on a tint, link hover
  primary50: 'var(--oc-primary-50)', // Lightest tint (chips, selected rows)
  primary100: 'var(--oc-primary-100)',
  primary200: 'var(--oc-primary-200)',
  primary300: 'var(--oc-primary-300)',
  primary400: 'var(--oc-primary-400)',
  primary900: 'var(--oc-primary-900)',
  primaryTint: 'var(--oc-primary-tint)',
  sky: 'var(--oc-sky)', // The light sky blue at the top of the page
  textStrong: 'var(--oc-text-strong)', // Titles and values: dark navy
  textHeading: 'var(--oc-text-heading)',
  textInk: 'var(--oc-text-ink)', // Near-black navy: primary buttons, tooltips, the value pill
  textBody: 'var(--oc-text-body)', // Body text
  textSecondary: 'var(--oc-text-secondary)', // Labels
  textMuted: 'var(--oc-text-muted)', // Secondary text
  textSubtle: 'var(--oc-text-subtle)', // Axis ticks, hints
  textAi: 'var(--oc-text-ai)',
  border: 'var(--oc-border)', // Card outlines, dividers
  borderStrong: 'var(--oc-border-strong)', // Progress tracks
  borderControl: 'var(--oc-border-control)',
  line: 'var(--oc-line)', // Chart cursor
  surface: 'var(--oc-surface)', // Segmented controls, icon boxes, card header bands
  surfaceMuted: 'var(--oc-surface-muted)', // Row frames
  surfaceSubtle: 'var(--oc-surface-subtle)', // Hover
  buttonSecondary: 'var(--oc-button-secondary)', // White with a hairline
  buttonSecondaryHover: 'var(--oc-button-secondary-hover)',
  buttonPrimary: 'var(--oc-button-primary)', // = textInk: primary buttons are near-black navy
  buttonPrimaryHover: 'var(--oc-button-primary-hover)',
  white: 'var(--oc-white)',
  attentionText: 'var(--oc-attention-text)', // Amber, only for things that need attention
  attentionSurface: 'var(--oc-attention-surface)',
  attentionBar: 'var(--oc-attention-bar)',
  attentionTrack: 'var(--oc-attention-track)',
  warning: 'var(--oc-warning)',
  orange: 'var(--oc-orange)',
  orangeStrong: 'var(--oc-orange-strong)',
  orangeSurface: 'var(--oc-orange-surface)',
  success: 'var(--oc-success)', // Positive trends
  successStrong: 'var(--oc-success-strong)',
  successSurface: 'var(--oc-success-surface)',
  success100: 'var(--oc-success-100)',
  successBright: 'var(--oc-success-bright)',
  modeSelf: 'var(--oc-mode-self)', // Self-paced series: = primary300, the light blue
  danger: 'var(--oc-danger)', // Negative trends
  dangerStrong: 'var(--oc-danger-strong)',
  dangerSurface: 'var(--oc-danger-surface)',
  danger100: 'var(--oc-danger-100)',
  dangerBright: 'var(--oc-danger-bright)',
  yellow: 'var(--oc-yellow)',
  yellowText: 'var(--oc-yellow-text)',
  brandLinkedin: 'var(--oc-brand-linkedin)', // LinkedIn's own blue, on the LinkedIn creator mark
  avatarPeach: 'var(--oc-avatar-peach)', // Avatar pastels
  avatarLilac: 'var(--oc-avatar-lilac)',
  avatarPink: 'var(--oc-avatar-pink)',
  avatarCyan: 'var(--oc-avatar-cyan)',
  // Course status chips: a tint and a stronger bar of the same hue
  statusDraftBg: 'var(--oc-status-draft-bg)',
  statusDraft: 'var(--oc-status-draft)',
  statusReviewBg: 'var(--oc-status-review-bg)',
  statusReview: 'var(--oc-status-review)',
  statusRevisionBg: 'var(--oc-status-revision-bg)',
  statusRevision: 'var(--oc-status-revision)',
  statusApprovedBg: 'var(--oc-status-approved-bg)',
  statusApproved: 'var(--oc-status-approved)',
  statusActiveBg: 'var(--oc-status-active-bg)',
  statusActive: 'var(--oc-status-active)',
  statusInactiveBg: 'var(--oc-status-inactive-bg)',
  statusInactive: 'var(--oc-status-inactive)',
  // Roles that switch in dark (light: the value each place used before)
  page: 'var(--oc-page)', // The page under the sky gradient
  card: 'var(--oc-card)', // Cards, the sidebar, tiles: white, navy in dark
  raised: 'var(--oc-raised)', // Menus and dialogs
  thumb: 'var(--oc-thumb)', // Picked box of a segmented control
  primaryText: 'var(--oc-primary-text)', // Blue as text or an icon (lighter in dark)
  dangerFill: 'var(--oc-danger-fill)',
  attentionFill: 'var(--oc-attention-fill)',
  tooltip: 'var(--oc-tooltip)',
  onInk: 'var(--oc-on-ink)', // Text on tooltips and the photo badge
  badge: 'var(--oc-badge)',
  pill: 'var(--oc-pill)', // Value pill: near-black in light, off-white in dark
  pillText: 'var(--oc-pill-text)',
  progressEnd: 'var(--oc-progress-end)', // Right end of the progress gradient (= primary200 in light)
  modeSelfDone: 'var(--oc-mode-self-done)', // Completed self-paced share (= primary100 in light)
} as const;

export type OCColor = keyof typeof OC_COLORS;

/** The CSS variable for a token, for inline styles: ocVar('primary') → 'var(--oc-primary)' */
export function ocVar(token: OCColor): string {
  return `var(--oc-${token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()})`;
}
