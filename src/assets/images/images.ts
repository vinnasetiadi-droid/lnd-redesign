/**
 * Image Assets - External URLs
 *
 * IMPORTANT - Figma Make Environment:
 * External URLs dari API/CDN HARUS menggunakan ImageWithFallback component
 * agar bisa handle CORS dan loading states dengan baik.
 *
 * Untuk stock images, gunakan unsplash_tool di Figma Make.
 *
 * Usage:
 * ```tsx
 * import { IMAGES } from '@/assets/images';
 * import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
 *
 * <ImageWithFallback src={IMAGES.icons.collapse_lx} alt="Collapse" />
 * ```
 *
 * NOTE: Jangan gunakan <img> tag langsung untuk external URLs!
 */

const BASE_URL =
  "https://api-ajari-develop.ajari.app/v1/lx-upload/fetch/assets";

/**
 * Helper function untuk generate full URL
 */
const getAssetUrl = (filename: string): string => {
  return `${BASE_URL}/${filename}`;
};

/**
 * Image URLs organized by category
 *
 * FIGMA MAKE NOTES:
 * - Semua URLs ini adalah external URLs dari API/CDN
 * - Harus digunakan dengan ImageWithFallback component
 * - Untuk Figma imported assets, gunakan: import img from "figma:asset/07ec84b99e2f9fd69d33426f63cc109462d5040c.png"
 */
export const IMAGES = {
  /**
   * Icons & UI Elements
   */
  icons: {
    // Copy only: the asset server (api-ajari-develop) was down, so the sidebar logos are bundled in public/assets/logos
    collapse_lx: "/assets/logos/collapse_lx.png",
    white_lx: "/assets/logos/white_lx.png",
    black_lx: getAssetUrl("black_lx.png"),
    white_ajari: getAssetUrl("white_ajari.png"),
    black_ajari: getAssetUrl("black_ajari.png"),
    login_bg: getAssetUrl("login_bg.png"),
    presight_logo: getAssetUrl("presight_logo.png"),
    white_logo_ajari: getAssetUrl("white_ajari.png"),
    // Tambahkan icon lainnya di sini
    // expand_lx: getAssetUrl('expand_lx.png'),
  },

  /**
   * Logos
   */
  logos: {
    // main_logo: getAssetUrl('logo.png'),
    // logo_white: getAssetUrl('logo_white.png'),
  },

  /**
   * Backgrounds
   */
  backgrounds: {
    footer_bg: getAssetUrl("footer_bg.png"),
    sidebar_accent: getAssetUrl("sidebar_accent.png"),
    background: getAssetUrl("background.png"),
    // hero_bg: getAssetUrl('hero_background.png'),
    // pattern_bg: getAssetUrl('pattern.png'),
  },

  /**
   * Illustrations
   */
  illustrations: {
    student_profile: getAssetUrl("student_profile.png"),
    // empty_state: getAssetUrl('empty_state.svg'),
    // error_404: getAssetUrl('404.svg'),
  },

  /**
   * Avatars & Placeholders
   *
   * NOTE: Untuk stock images/placeholders, pertimbangkan gunakan unsplash_tool
   */
  placeholders: {
    // avatar_default: getAssetUrl('avatar_placeholder.png'),
    // image_placeholder: getAssetUrl('image_placeholder.png'),
  },

  /**
   * Other Assets
   */
  misc: {
    // tambahkan assets lain yang tidak masuk kategori di atas
  },
} as const;

/**
 * Type-safe image keys untuk autocomplete
 */
export type ImageCategory = keyof typeof IMAGES;
export type IconKey = keyof typeof IMAGES.icons;
export type LogoKey = keyof typeof IMAGES.logos;
export type BackgroundKey = keyof typeof IMAGES.backgrounds;
export type IllustrationKey = keyof typeof IMAGES.illustrations;
export type PlaceholderKey = keyof typeof IMAGES.placeholders;

/**
 * Helper function untuk get image by category dan key
 * Dengan type safety
 */
export function getImage(
  category: "icons",
  key: IconKey,
): string;
export function getImage(
  category: "logos",
  key: LogoKey,
): string;
export function getImage(
  category: "backgrounds",
  key: BackgroundKey,
): string;
export function getImage(
  category: "illustrations",
  key: IllustrationKey,
): string;
export function getImage(
  category: "placeholders",
  key: PlaceholderKey,
): string;
export function getImage(
  category: ImageCategory,
  key: string,
): string {
  return (IMAGES[category] as any)[key] || "";
}

/**
 * Export BASE_URL untuk custom usage
 */
export { BASE_URL, getAssetUrl };