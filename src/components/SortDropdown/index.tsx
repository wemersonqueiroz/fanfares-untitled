"use client"

import { Check, FilterLines } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"
import { Dropdown } from "@/components/Dropdown"

// ── Public types ──────────────────────────────────────────────────────────────

export type SortOption = {
  label: string
  value: string
}

/**
 * Default sort options shared by all browseable list pages
 * (Library, Wishlist, Explore). Pass directly to SortDropdown's `options`.
 */
export const DEFAULT_BROWSE_SORT_OPTIONS: SortOption[] = [
  { label: "Date Added",                value: "date-added"   },
  { label: "Price (Low To High)",       value: "price-asc"    },
  { label: "Price (High To Low)",       value: "price-desc"   },
  { label: "Alphabetical",              value: "alphabetical" },
  { label: "Recents (Interacted With)", value: "recents"      },
]

export type SortDropdownProps = {
  options: SortOption[]
  /** Currently selected value. Pass an empty string for no selection. */
  value: string
  onChange: (value: string) => void
  /**
   * Trigger button label shown when nothing is selected yet.
   * Once an option is chosen the trigger reflects the selection label.
   * @default "Sort by"
   */
  placeholder?: string
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SortDropdown({
  options,
  value,
  onChange,
  placeholder = "Sort by",
  className,
}: SortDropdownProps) {
  const selected = options.find(o => o.value === value)
  const triggerLabel = selected?.label ?? placeholder

  return (
    <Dropdown
      className={className}
      trigger={(open, toggle) => (
        <Button
          variant="secondary"
          size="sm"
          iconLeft={FilterLines}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggle}
          className={cx(
            "px-3.5 py-2.5 whitespace-nowrap",
            open && "bg-app-card-active"
          )}>
          {triggerLabel}
        </Button>
      )}>
      {close => (
        <div
          role="listbox"
          aria-label="Sort options"
          className="flex flex-col py-1 min-w-dropdown">
          {options.map(option => {
            const isSelected = option.value === value
            return (
              <div key={option.value} className="px-1.5 py-px">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value)
                    close()
                  }}
                  className={cx(
                    "flex items-center gap-2 w-full px-2.5 py-2 rounded-md",
                    "text-sm font-semibold text-left",
                    "transition-colors duration-100 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                    isSelected
                      ? "text-text-primary bg-app-border/40"
                      : "text-text-secondary hover:bg-app-border/60 hover:text-text-primary"
                  )}>
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <Check
                      size={14}
                      color="currentColor"
                      aria-hidden="true"
                      className="shrink-0"
                    />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Dropdown>
  )
}
