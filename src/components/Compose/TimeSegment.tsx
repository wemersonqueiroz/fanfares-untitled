"use client"

import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type TimeSegmentProps = {
  value: number
  max: number
  label: string
  onChange: (v: number) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TimeSegment({ value, max, label, onChange }: TimeSegmentProps) {
  return (
    <input
      type="number"
      min={0}
      max={max}
      value={String(value).padStart(2, "0")}
      onChange={e => onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
      aria-label={label}
      className={cx(
        "w-12 text-center text-sm font-semibold text-text-primary",
        "bg-app-card border border-app-border rounded-lg px-1 py-2",
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      )}
    />
  )
}
