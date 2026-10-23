// The dashboard's shared period: every chart on Home covers the same months,
// from January of the mock data's year up to the current month.

/** The mock data covers 2026 */
export const DATA_YEAR = 2026;

/** Index of the last month to show (0 = Jan): the current month in 2026, December otherwise */
export function currentMonthIndex(): number {
  const now = new Date();
  if (now.getFullYear() !== DATA_YEAR) return 11;
  return now.getMonth();
}

/** e.g. "Jan to Oct 2026" for a series sliced to the period */
export function periodLabel(data: { month: string }[]): string {
  return `${data[0]?.month} to ${data[data.length - 1]?.month} ${DATA_YEAR}`;
}

// ── Dates relative to today, so the demo never looks stale ────

function isoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Today minus `n` days, as YYYY-MM-DD */
export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoDate(d);
}

/** Today plus `n` days, as YYYY-MM-DD */
export function daysFromNow(n: number): string {
  return daysAgo(-n);
}

/** Whole days from today to a YYYY-MM-DD date (negative when it has passed) */
export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${iso}T00:00:00`).getTime() - today.getTime()) / 86_400_000);
}

/** "3 Mar 2026" */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "Today", "4d ago", "2w ago", "1mo ago" */
export function timeAgo(iso: string): string {
  const days = -daysUntil(iso);
  if (days <= 0) return 'Today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
