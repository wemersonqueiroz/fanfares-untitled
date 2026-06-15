"use client"

import { FilterPill } from "@/components/FilterPill"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type CategoryPillsRowProps<T extends string> = {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Horizontal-scrollable row of FilterPills — used as the top filter row
 * in Library, Wishlist, Explore, and any other browsable list page.
 */
export function CategoryPillsRow<T extends string>({
  options,
  value,
  onChange,
  className,
}: CategoryPillsRowProps<T>) {
  return (
    <div className={cx("overflow-x-auto scrollbar-hide", className)}>
      <div className="flex gap-2 items-center w-max">
        {options.map(opt => (
          <FilterPill
            key={opt}
            label={opt}
            isActive={value === opt}
            onClick={() => onChange(opt)}
          />
        ))}
      </div>
    </div>
  )
}
