import { OD_BACKGROUND, OD_SHEEN } from '../theme';

/** Option D: iridescent blue background behind the sidebar and content */
export function ResponsiveBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ background: OD_BACKGROUND }}>
      <div className="absolute inset-0" style={{ background: OD_SHEEN }} />
    </div>
  );
}
