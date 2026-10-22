/**
 * Option A palette: one blue, #1A73E8, on neutral greys (Finora-style white
 * cards). Components use these hex values directly in Tailwind classes; this
 * file is the reference list plus the shared gradients.
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
 * swatch), so the blue stays a hint behind the white cards.
 */
export const OA_BACKGROUND = [
  'radial-gradient(55% 60% at 0% 0%, rgba(26, 115, 232, 0.11) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(50% 55% at 100% 100%, rgba(26, 115, 232, 0.09) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(40% 45% at 100% 0%, rgba(26, 115, 232, 0.05) 0%, rgba(26, 115, 232, 0) 70%)',
  '#F7F9FC',
].join(', ');

/** Faint diagonal sheen over the background. Plain gradient: a blur filter here stops the content from painting. */
export const OA_SHEEN =
  'linear-gradient(115deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.55) 48%, rgba(255, 255, 255, 0) 66%)';

/**
 * AI frame gradient from the #1A73E8 swatches: white at the top left, through
 * 11% and 57%, to the full colour at the bottom right.
 */
export const OA_AI_GRADIENT = [
  'radial-gradient(110% 110% at 0% 0%, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 25%, rgba(255, 255, 255, 0) 60%)',
  'radial-gradient(95% 95% at 100% 100%, #1A73E8 0%, rgba(26, 115, 232, 0.57) 45%, rgba(26, 115, 232, 0.11) 85%)',
  '#E8F0FE',
].join(', ');

/** Solid blue for the NISA card (white text on top): soft light at the top left */
export const OA_AI_SOLID = [
  'radial-gradient(120% 80% at 0% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 55%)',
  'linear-gradient(160deg, #2F80F0 0%, #1A73E8 45%, #1764D0 100%)',
].join(', ');

/** Mostly white with a soft blue glow on the right (NISA card, dark text on top) */
export const OA_AI_SOFT = [
  'radial-gradient(85% 65% at 100% 0%, rgba(26, 115, 232, 0.16) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(75% 55% at 100% 100%, rgba(26, 115, 232, 0.12) 0%, rgba(26, 115, 232, 0) 70%)',
  'radial-gradient(60% 40% at 0% 100%, rgba(138, 180, 248, 0.10) 0%, rgba(138, 180, 248, 0) 70%)',
  '#FFFFFF',
].join(', ');
