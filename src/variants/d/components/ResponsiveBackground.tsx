import { OD_BACKGROUND, OD_SHEEN } from '../theme';

/** Option D: the page background behind the top navigation and content (light or dark, from option-d.css) */
export function ResponsiveBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ background: OD_BACKGROUND }}>
      <div className="absolute inset-0" style={{ background: OD_SHEEN }} />
    </div>
  );
}
