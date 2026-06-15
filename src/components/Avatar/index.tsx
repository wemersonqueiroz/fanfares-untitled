"use client"

import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

/**
 * Avatar size scale.
 * xs  → 24 px  (small stacks, mutual followers)
 * sm  → 32 px  (nested comments, compact lists)
 * md  → 40 px  (content-card creator row, nav, reply inputs)
 * lg  → 48 px  (content page creator header)
 * xl  → 64 px  (profile cards)
 * 2xl → 128 px (profile header)
 */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export type AvatarProps = {
  /** Display name — used to derive initials when no image is available */
  name?: string
  /** Image URL — when provided the image is shown; otherwise initials are shown */
  src?: string
  size?: AvatarSize
  /** Extra classes — use this to add border rings, z-index, margins, etc. */
  className?: string
}

export type AvatarGroupProps = {
  /** URLs (or undefined for placeholder gradient) for each avatar in the stack */
  avatarUrls: (string | undefined)[]
  /** Maximum visible avatars before showing +N (default 3) */
  max?: number
  /**
   * Ring border class applied between overlapping circles.
   * Default `"border-2 border-app-card"` same as feed-card surfaces.
   * Override to `"border-2 border-app-bg"` for page-level use.
   */
  ringClassName?: string
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

const SIZE_CLASS: Record<AvatarSize, string> = {
  xs: "size-6  text-2xs",
  sm: "size-8  text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-xl",
  "2xl": "size-32 text-3xl",
}

/** Derives up to two initials from a display name. Returns "" for empty input. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ── Avatar ────────────────────────────────────────────────────────────────────

/**
 * Circular avatar — shows a user photo or falls back to initials on a brand
 * gradient background.
 *
 * @example
 * // Profile header (128 px + punch-out ring)
 * <Avatar src={user.avatarUrl} name={user.name} size="2xl" className="border-8 border-app-bg" />
 *
 * // Feed card creator (40 px + subtle border)
 * <Avatar src={creator.avatarUrl} name={creator.name} size="md" className="border border-black/10" />
 *
 * // Mutual followers stack (24 px + ring shadow)
 * <Avatar src={url} size="xs" className="shadow-[0px_0px_0px_1.5px_var(--color-app-bg)]" />
 */
export function Avatar({
  name = "",
  src,
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(name)

  return (
    <div
      className={cx(
        "rounded-full shrink-0 overflow-hidden",
        "bg-gradient-to-br from-brand-400 to-brand-700",
        SIZE_CLASS[size],
        className
      )}>
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="size-full object-cover"
        />
      ) : (
        <div className="size-full flex items-center justify-center text-white font-semibold leading-none select-none">
          {initials}
        </div>
      )}
    </div>
  )
}

// ── AvatarGroup ───────────────────────────────────────────────────────────────

/**
 * Overlapping circular avatar stack — shows up to `max` avatars (default 3),
 * then a "+N" overflow indicator.
 *
 * @example
 * // Feed card supporter stack (default ring = border-app-card)
 * <AvatarGroup avatarUrls={supporterAvatarUrls} />
 *
 * // Page-level stack (ring matches page bg)
 * <AvatarGroup avatarUrls={urls} ringClassName="border-2 border-app-bg" />
 */
export function AvatarGroup({
  avatarUrls,
  max = 3,
  ringClassName = "border-2 border-app-card",
  className,
}: AvatarGroupProps) {
  if (avatarUrls.length === 0) return null
  const visible = avatarUrls.slice(0, max)
  const overflow = avatarUrls.length - visible.length

  return (
    <div className={cx("flex items-center", className)}>
      {visible.map((url, i) => (
        <Avatar
          key={i}
          src={url ?? undefined}
          size="xs"
          className={cx(ringClassName, i > 0 && "-ml-2")}
        />
      ))}
      {overflow > 0 && (
        <span className="ml-1.5 text-xs font-medium text-text-tertiary">
          +{overflow}
        </span>
      )}
    </div>
  )
}
