"use client"

import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type SegmentedControlProps<T extends string = string> = {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  /** Additional class applied to the outer container */
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Bordered segmented button group.
 *
 * Active  → bg-app-card-active, text-text-primary.
 * Inactive → bg-app-surface, text-text-secondary, hover: bg-app-card.
 *
 * Usage:
 * ```tsx
 * <SegmentedControl
 *   options={["View all", "Created By Me"]}
 *   value={viewFilter}
 *   onChange={setViewFilter}
 * />
 * ```
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cx(
        "flex shrink-0 border border-app-border rounded-md overflow-hidden isolate",
        className
      )}>
      {options.map((option, i) => {
        const isActive = value === option
        const isLast = i === options.length - 1

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={cx(
              "flex items-center justify-center shrink-0",
              "min-h-10 px-4 py-2",
              "text-sm font-semibold",
              "cursor-pointer transition-colors duration-150",
              "focus-visible:outline-none",
              !isLast && "border-r border-app-border",
              isActive
                ? "bg-app-card-active text-text-primary"
                : "bg-app-surface text-text-secondary hover:bg-app-card"
            )}>
            {option}
          </button>
        )
      })}
    </div>
  )
}
