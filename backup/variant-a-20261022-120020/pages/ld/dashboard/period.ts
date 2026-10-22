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
