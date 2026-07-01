"use client"

import { Play } from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type PlayCircleProps = {
  /** Diameter in pixels — 40 px for inline rows, 48 px for cover/hero overlays. */
  size?: 40 | 48
  label?: string
  onClick?: () => void
  /** Caller-controlled positioning (e.g. `absolute bottom-3 left-3`). */
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Frosted-glass circular play button. Used as the centered overlay on cover
 * art and on episode/chapter rows. Caller positions it via `className`.
 */
export function PlayCircle({
  size = 48,
  label = "Play",
  onClick,
  className,
}: PlayCircleProps) {
  const containerCls = size === 40 ? "size-10" : "size-12"
  const iconSize = size === 40 ? 16 : 20

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        onClick?.()
      }}
      aria-label={label}
      className={cx(
        "flex items-center justify-center rounded-full cursor-pointer shrink-0",
        containerCls,
        "bg-overlay-btn backdrop-blur-sm",
        "hover:opacity-80 transition-opacity duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        className
      )}>
      <Play size={iconSize} color="white" aria-hidden="true" />
    </button>
  )
}
