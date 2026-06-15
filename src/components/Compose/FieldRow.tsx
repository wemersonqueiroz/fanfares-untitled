"use client"

import type { ReactNode } from "react"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type FieldRowProps = {
  children: ReactNode
  /** Visual height. `md` = h-10 (default), `sm` = h-9. */
  size?: "sm" | "md"
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Bordered horizontal row used to wrap compound inputs in Compose* forms —
 * e.g. icon + native select, icon + input + button. Inherits focus styling
 * from its descendant via `focus-within`.
 */
export function FieldRow({ children, size = "md", className }: FieldRowProps) {
  return (
    <div
      className={cx(
        "flex items-center gap-2 px-3 rounded-lg",
        "border border-app-border bg-app-surface",
        "focus-within:ring-2 focus-within:ring-brand-500/50",
        "transition-colors duration-150",
        size === "sm" ? "h-9" : "h-10",
        className
      )}>
      {children}
    </div>
  )
}
