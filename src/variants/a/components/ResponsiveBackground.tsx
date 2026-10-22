import { OA_BACKGROUND, OA_SHEEN } from '../theme';

/** Option A: iridescent blue background behind the sidebar and content */
export function ResponsiveBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ background: OA_BACKGROUND }}>
      <div className="absolute inset-0" style={{ background: OA_SHEEN }} />
    </div>
  );
}
