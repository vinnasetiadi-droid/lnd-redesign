/**
 * Option D palette: one teal blue, #0E85B4 (after the Ultraleads reference), on neutral greys (Finora-style white
 * cards). The design tokens live in option-d.css as CSS variables, with a dark
 * set under html.option-d.theme-dark; OD_COLORS and the gradients below point
 * at them. OD is the fixed light scale, for things that never change theme.
 */
export const OD = {
  primary: {
    50: '#EAF6FB',
    100: '#D4EEF8',
    200: '#A9DDF1',
    300: '#7DCBE9',
    400: '#45B2DC',
    500: '#1E9ED0',
    600: '#0E85B4', // main
    700: '#0B6B91',
    800: '#0A5A7C',
    900: '#0A4A66',
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
 * The shared gradients. Their values live in option-d.css (light on
 * html.option-d, dark on html.option-d.theme-dark), so these are CSS variables
 * and switch with the theme on their own.
 *
 * - OD_BACKGROUND: page background. Light: near-white with #0E85B4 glows at
 *   11% (the "Opacity 11%" swatch). Dark: near-black with very faint glows.
 * - OD_SHEEN: faint diagonal sheen over the background. Plain gradient: a blur
 *   filter here stops the content from painting.
 * - OD_AI_GRADIENT: AI frame gradient from the #0E85B4 swatches, from the card
 *   colour at the top left to the full colour at the bottom right.
 * - OD_AI_SOLID: solid blue for the NISA card (white text on top).
 * - OD_AI_SOFT: the card colour with a soft blue glow on the right (NISA card).
 */
export const OD_BACKGROUND = 'var(--od-page-bg)';
export const OD_SHEEN = 'var(--od-page-sheen)';
export const OD_AI_GRADIENT = 'var(--od-ai-gradient)';
export const OD_AI_SOLID = 'var(--od-ai-solid)';
export const OD_AI_SOFT = 'var(--od-ai-soft)';

/**
 * The CSS design tokens in option-d.css (html.option-d --od-*), as `var()`
 * strings for code that takes a colour string (SVG attributes, recharts props,
 * inline styles), so those follow the light/dark theme too. Tailwind classes
 * use the variables directly, e.g. text-(--od-text-strong).
 * The values are CSS, not hex: never append an alpha or parse them; mix with
 * `color-mix(in srgb, var(--od-x) 20%, transparent)` instead.
 */
export const OD_COLORS = {
  primary: 'var(--od-primary)', // The one accent: buttons, selected states, chart highlight
  primaryStrong: 'var(--od-primary-strong)', // Blue text on a blue tint, link hover
  primary50: 'var(--od-primary-50)', // Lightest blue tint (pills, chips)
  primary100: 'var(--od-primary-100)',
  primary200: 'var(--od-primary-200)',
  primary300: 'var(--od-primary-300)',
  primary400: 'var(--od-primary-400)',
  primary900: 'var(--od-primary-900)',
  primaryTint: 'var(--od-primary-tint)', // AI insight row background
  primaryText: 'var(--od-primary-text)', // The accent as text (brighter in dark)
  textStrong: 'var(--od-text-strong)', // Titles and values
  textHeading: 'var(--od-text-heading)',
  textInk: 'var(--od-text-ink)', // Darkest text
  textBody: 'var(--od-text-body)', // Body text
  textSecondary: 'var(--od-text-secondary)', // Labels
  textMuted: 'var(--od-text-muted)', // Secondary text
  textSubtle: 'var(--od-text-subtle)', // Axis ticks, hints
  textAi: 'var(--od-text-ai)', // Text on the NISA card
  border: 'var(--od-border)', // Card dividers, tile outlines
  borderStrong: 'var(--od-border-strong)', // Progress tracks
  borderControl: 'var(--od-border-control)',
  line: 'var(--od-line)', // Chart cursor
  surface: 'var(--od-surface)', // Segmented controls, icon circles
  surfaceMuted: 'var(--od-surface-muted)', // Row frames
  surfaceSubtle: 'var(--od-surface-subtle)', // Hover
  buttonSecondary: 'var(--od-button-secondary)',
  buttonSecondaryHover: 'var(--od-button-secondary-hover)',
  buttonPrimary: 'var(--od-button-primary)', // = primary
  buttonPrimaryHover: 'var(--od-button-primary-hover)', // = primaryStrong
  white: 'var(--od-white)', // Always white: text on the accent, SVG masks
  card: 'var(--od-card)', // Card surface (white in light)
  raised: 'var(--od-raised)', // Menus, tooltips, floating pills
  attentionText: 'var(--od-attention-text)', // Amber, only for things that need attention
  attentionSurface: 'var(--od-attention-surface)',
  attentionBar: 'var(--od-attention-bar)',
  attentionTrack: 'var(--od-attention-track)',
  warning: 'var(--od-warning)',
  orange: 'var(--od-orange)',
  orangeStrong: 'var(--od-orange-strong)',
  orangeSurface: 'var(--od-orange-surface)',
  success: 'var(--od-success)', // Positive trends
  successStrong: 'var(--od-success-strong)',
  successSurface: 'var(--od-success-surface)',
  success100: 'var(--od-success-100)',
  successBright: 'var(--od-success-bright)',
  modeSelf: 'var(--od-mode-self)', // Self-paced series
  danger: 'var(--od-danger)', // Negative trends
  dangerStrong: 'var(--od-danger-strong)',
  dangerSurface: 'var(--od-danger-surface)',
  danger100: 'var(--od-danger-100)',
  dangerBright: 'var(--od-danger-bright)',
  yellow: 'var(--od-yellow)',
  yellowText: 'var(--od-yellow-text)',
  avatarPeach: 'var(--od-avatar-peach)', // Avatar pastels
  avatarLilac: 'var(--od-avatar-lilac)',
  avatarPink: 'var(--od-avatar-pink)',
  avatarCyan: 'var(--od-avatar-cyan)',
  // Course status chips: a tint and a stronger bar of the same hue
  statusDraftBg: 'var(--od-status-draft-bg)',
  statusDraft: 'var(--od-status-draft)',
  statusReviewBg: 'var(--od-status-review-bg)',
  statusReview: 'var(--od-status-review)',
  statusRevisionBg: 'var(--od-status-revision-bg)',
  statusRevision: 'var(--od-status-revision)',
  statusApprovedBg: 'var(--od-status-approved-bg)',
  statusApproved: 'var(--od-status-approved)',
  statusActiveBg: 'var(--od-status-active-bg)',
  statusActive: 'var(--od-status-active)',
  statusInactiveBg: 'var(--od-status-inactive-bg)',
  statusInactive: 'var(--od-status-inactive)',
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
 * The profile's achievement badges (components/ui/profile-badges): three round
 * badges in Option D's blue scale, from deep to light, so they read as one
 * set with the page's accent. Fixed hex from OD (not the themed tokens): the
 * badges look the same in light and dark.
 */
export const OD_BADGES = {
  white: '#FFFFFF',
  ink: '#0A0D12',
  medal:  { from: OD.primary[900], to: OD.primary[400], shadow: OD.primary[900], shadowOpacity: 0.2, glow: 23, icon: OD.primary[200] },
  star:   { from: OD.primary[600], to: OD.primary[300], shadow: OD.primary[900], shadowOpacity: 0.18, glow: 25, icon: OD.primary[100] },
  trophy: { from: OD.primary[400], to: OD.primary[100], shadow: OD.primary[600], shadowOpacity: 0.16, glow: 20, icon: OD.primary[50] },
} satisfies Record<string, string | OdBadgeTone>;
