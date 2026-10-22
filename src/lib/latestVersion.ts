// ============================================================
// Latest version number for a course or journey
//
// Anything that has never been revised is still on Version 1, which
// is what the detail pages show, so the cards say the same.
// ============================================================

interface HasVersion { version: number }

export function latestVersionOf(
  map: Record<string, HasVersion[] | undefined> | undefined,
  id: string,
): number {
  const versions = map?.[id];
  if (!versions?.length) return 1;
  return versions.reduce((max, v) => (v.version > max ? v.version : max), 1);
}
