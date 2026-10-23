import { useEffect, useState } from 'react';
import { onThemeModeChange } from '@/variants/theme-mode';

/**
 * Option A palette: one blue, #1A73E8, on neutral greys (Finora-style white
 * cards). The design tokens live in option-a.css as CSS variables; OA_COLORS
 * below is their documented mirror, plus the shared gradients.
 */
export const OA = {
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
 * swatch), so the blue stays a hint behind the white cards. Near-black with
 * the same, fainter glows in dark. The gradients live in option-a.css.
 */
export const OA_BACKGROUND = 'var(--oa-page-bg)';

/** Faint diagonal sheen over the background. Plain gradient: a blur filter here stops the content from painting. */
export const OA_SHEEN = 'var(--oa-page-sheen)';

/**
 * AI frame gradient from the #1A73E8 swatches: white at the top left, through
 * 11% and 57%, to the full colour at the bottom right.
 */
export const OA_AI_GRADIENT = 'var(--oa-ai-gradient)';

/** Solid blue for the NISA card (white text on top): soft light at the top left */
export const OA_AI_SOLID = 'var(--oa-ai-solid)';

/** Mostly white with a soft blue glow on the right (NISA card, dark text on top) */
export const OA_AI_SOFT = 'var(--oa-ai-soft)';

/**
 * The CSS design tokens in option-a.css (html.option-a --oa-*) as var()
 * strings. Tailwind classes use the variables, e.g. text-(--oa-text-strong);
 * code that needs a colour string (SVG attributes, recharts props, inline
 * styles) uses these, so it follows the light/dark switch. They are not hex:
 * no string maths on them (use color-mix). Keep both lists in step.
 */
export const OA_COLORS = {
  primary: 'var(--oa-primary)', // The one accent: buttons, selected states, chart highlight (#1A73E8 in light)
  primaryStrong: 'var(--oa-primary-strong)', // Blue text on a blue tint, link hover (#1967D2 in light)
  primary50: 'var(--oa-primary-50)', // Lightest blue tint (pills, chips) (#E8F0FE in light)
  primary100: 'var(--oa-primary-100)', // #D2E3FC
  primary200: 'var(--oa-primary-200)', // #AECBFA
  primary300: 'var(--oa-primary-300)', // #8AB4F8
  primary400: 'var(--oa-primary-400)', // #669DF6
  primary900: 'var(--oa-primary-900)', // #174EA6
  primaryTint: 'var(--oa-primary-tint)', // AI insight row background (#F5F9FE in light)
  textStrong: 'var(--oa-text-strong)', // Titles and values (#181D27 in light)
  textHeading: 'var(--oa-text-heading)', // #252B37
  textInk: 'var(--oa-text-ink)', // Tooltip background (#0A0D12 in light)
  textBody: 'var(--oa-text-body)', // Body text (#414651 in light)
  textSecondary: 'var(--oa-text-secondary)', // Labels (#535862 in light)
  textMuted: 'var(--oa-text-muted)', // Secondary text (#717680 in light)
  textSubtle: 'var(--oa-text-subtle)', // Axis ticks, hints (#A4A7AE in light)
  textAi: 'var(--oa-text-ai)', // Text on the NISA card (#282828 in light)
  border: 'var(--oa-border)', // Card dividers, tile outlines (#EDEEF1 in light)
  borderStrong: 'var(--oa-border-strong)', // Progress tracks (#E4E6EA in light)
  borderControl: 'var(--oa-border-control)', // #D0D5DD
  line: 'var(--oa-line)', // Chart cursor (#D5D7DA in light)
  surface: 'var(--oa-surface)', // Segmented controls, icon circles (#F5F6F8 in light)
  surfaceMuted: 'var(--oa-surface-muted)', // Row frames (#F7F8FA in light)
  surfaceSubtle: 'var(--oa-surface-subtle)', // Hover (#F9FAFB in light)
  buttonSecondary: 'var(--oa-button-secondary)', // #F0F1F3
  buttonSecondaryHover: 'var(--oa-button-secondary-hover)', // #E6E8EB
  buttonPrimary: 'var(--oa-button-primary)', // = primary (#1A73E8 in light)
  buttonPrimaryHover: 'var(--oa-button-primary-hover)', // = primaryStrong (#1967D2 in light)
  white: 'var(--oa-white)', // #FFFFFF in light; the card surface (dark card in dark)
  primaryText: 'var(--oa-primary-text)', // Blue as text or a thin line (#1A73E8 in light)
  raised: 'var(--oa-raised)', // Menus and tooltips (#FFFFFF in light)
  attentionText: 'var(--oa-attention-text)', // Amber, only for things that need attention (#B54708 in light)
  attentionSurface: 'var(--oa-attention-surface)', // #FFFAEB
  attentionBar: 'var(--oa-attention-bar)', // #FEC84B
  attentionTrack: 'var(--oa-attention-track)', // #FEF0C7
  warning: 'var(--oa-warning)', // #FDB022
  orange: 'var(--oa-orange)', // #FB6514
  orangeStrong: 'var(--oa-orange-strong)', // #C4320A
  orangeSurface: 'var(--oa-orange-surface)', // #FFEAD5
  success: 'var(--oa-success)', // Positive trends (#039855 in light)
  successStrong: 'var(--oa-success-strong)', // #027A48
  successSurface: 'var(--oa-success-surface)', // #ECFDF3
  success100: 'var(--oa-success-100)', // #D1FADF
  successBright: 'var(--oa-success-bright)', // #32D583
  modeSelf: 'var(--oa-mode-self)', // Self-paced series (#34A853 in light)
  danger: 'var(--oa-danger)', // Negative trends (#D92D20 in light)
  dangerStrong: 'var(--oa-danger-strong)', // #B42318
  dangerSurface: 'var(--oa-danger-surface)', // #FEF3F2
  danger100: 'var(--oa-danger-100)', // #FEE4E2
  dangerBright: 'var(--oa-danger-bright)', // #F97066
  yellow: 'var(--oa-yellow)', // #FFE07A
  yellowText: 'var(--oa-yellow-text)', // #6B4F00
  avatarPeach: 'var(--oa-avatar-peach)', // Avatar pastels (#FFE4D5 in light)
  avatarLilac: 'var(--oa-avatar-lilac)', // #E9D7FE
  avatarPink: 'var(--oa-avatar-pink)', // #FCE7F6
  avatarCyan: 'var(--oa-avatar-cyan)', // #CFF9FE
  // Course status chips: a tint and a stronger bar of the same hue
  statusDraftBg: 'var(--oa-status-draft-bg)', // #F2F4F7
  statusDraft: 'var(--oa-status-draft)', // #98A2B3
  statusReviewBg: 'var(--oa-status-review-bg)', // #F4EBFF
  statusReview: 'var(--oa-status-review)', // #9E77ED
  statusRevisionBg: 'var(--oa-status-revision-bg)', // #FEE4E2
  statusRevision: 'var(--oa-status-revision)', // #F97066
  statusApprovedBg: 'var(--oa-status-approved-bg)', // #DCFAE6
  statusApproved: 'var(--oa-status-approved)', // #17B26A
  statusActiveBg: 'var(--oa-status-active-bg)', // #DCE8FC
  statusActive: 'var(--oa-status-active)', // #1A73E8
  statusInactiveBg: 'var(--oa-status-inactive-bg)', // #F2F4F7
  statusInactive: 'var(--oa-status-inactive)', // #D0D5DD
} as const;

export type OAColor = keyof typeof OA_COLORS;

/** The CSS variable for a token, for inline styles: oaVar('primary') → 'var(--oa-primary)' */
export function oaVar(token: OAColor): string {
  return `var(--oa-${token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()})`;
}

/**
 * True while the dark version is on (`theme-dark` on <html>). Only for code
 * that needs plain hex instead of the CSS variables, e.g. motion colour tweens.
 */
export function useOaDark(): boolean {
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('theme-dark'));
  useEffect(() => onThemeModeChange((mode) => setDark(mode === 'dark')), []);
  return dark;
}
