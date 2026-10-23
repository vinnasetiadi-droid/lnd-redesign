import { OC_BACKGROUND, OC_SHEEN } from '../theme';

/** Option C: iridescent blue background behind the sidebar and content */
export function ResponsiveBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ background: OC_BACKGROUND }}>
      <div className="absolute inset-0" style={{ background: OC_SHEEN }} />
    </div>
  );
}
