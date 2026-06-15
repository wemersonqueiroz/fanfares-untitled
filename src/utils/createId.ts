/**
 * Monotonically increasing client-side ID factory.
 * Use for stable list keys and DOM IDs in Compose* forms.
 *
 * Do NOT use for server-rendered IDs — use React's `useId()` for those.
 *
 * @example
 *   createId("creator")  // → "creator-1", "creator-2", …
 */
let counter = 0
export function createId(prefix: string): string {
  return `${prefix}-${++counter}`
}
