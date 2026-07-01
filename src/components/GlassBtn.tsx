"use client"

import type { FC, SVGProps } from "react"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type IconComp = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>

export type GlassBtnProps = {
  icon: IconComp
  /** Accessible label — required since the button has no visible text. */
  label: string
  /** When true, icon switches to the brand color (e.g. wishlisted/active state). */
  active?: boolean
  /** When true, the button uses a destructive red background. */
  danger?: boolean
  onClick?: () => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * 22 × 22 frosted-glass mini button used on thumbnail / cover overlays.
 * Click bubbling is stopped so the button works inside larger clickable cards.
 */
export function GlassBtn({
  icon: Icon,
  label,
  active,
  danger,
  onClick,
  className,
}: GlassBtnProps) {
  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        onClick?.()
      }}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        "flex items-center justify-center size-overlay-btn rounded-[4px] shrink-0 cursor-pointer",
        "backdrop-blur-[8px] hover:opacity-80 transition-opacity duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
        danger ? "bg-red-900/70" : "bg-overlay-btn",
        className
      )}>
      <Icon
        size={13}
        color={active ? "var(--color-brand-500)" : "var(--color-text-primary)"}
        aria-hidden="true"
      />
    </button>
  )
}
