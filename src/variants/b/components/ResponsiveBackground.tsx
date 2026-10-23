import { OB_BACKGROUND, OB_SHEEN } from '../theme';

/** Option B: iridescent blue background behind the sidebar and content */
export function ResponsiveBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ background: OB_BACKGROUND }}>
      <div className="absolute inset-0" style={{ background: OB_SHEEN }} />
    </div>
  );
}
