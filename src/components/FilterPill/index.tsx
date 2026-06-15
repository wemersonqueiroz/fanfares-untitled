"use client"

import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type FilterPillProps = {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Active / inactive toggle pill used in category filter rows.
 *
 * Active  → brand-500 fill, white text, skeuomorphic shadow.
 * Inactive → app-surface, grey border, hover: app-card-active.
 */
export function FilterPill({ label, isActive, onClick, className }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cx(
        "flex items-center justify-center shrink-0",
        "px-3 py-2 rounded-md text-sm font-semibold",
        "cursor-pointer transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
        "shadow-[inset_0px_0px_0px_1px_rgba(12,14,18,0.18),inset_0px_-2px_0px_0px_rgba(12,14,18,0.05)]",
        isActive
          ? "bg-brand-500 text-white border-2 border-white/12"
          : "bg-app-surface text-text-secondary border border-app-border hover:bg-app-card-active",
        className
      )}>
      {label}
    </button>
  )
}
