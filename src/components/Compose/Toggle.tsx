"use client"

import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type ToggleProps = {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent shrink-0",
        "transition-colors duration-200",
        checked ? "bg-brand-600" : "bg-app-border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      )}>
      <span
        className={cx(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0",
          "transform transition duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}
