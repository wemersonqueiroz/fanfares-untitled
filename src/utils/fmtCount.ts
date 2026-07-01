/**
 * Compact-format a count for UI display:
 *   1234     → "1K"
 *   1_234_567 → "1.2M"
 *   42       → "42"
 */
export function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}
