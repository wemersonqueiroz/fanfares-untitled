"use client"

import { SearchLg } from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  /** Show the ⌘K keyboard-hint badge on the right. Defaults to true. */
  showShortcut?: boolean
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * App-wide search input with a leading magnifying glass and an optional
 * ⌘K shortcut badge. Used in Library, Wishlist, Explore, Settings, etc.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  ariaLabel = "Search",
  showShortcut = true,
  className,
}: SearchInputProps) {
  return (
    <div
      className={cx(
        "flex flex-1 min-w-0 items-center gap-2 px-3 py-2 rounded-md",
        "bg-app-surface border border-app-border",
        className
      )}>
      <SearchLg
        size={20}
        color="var(--color-text-tertiary)"
        aria-hidden="true"
        className="shrink-0"
      />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cx(
          "flex-1 min-w-0 bg-transparent outline-none",
          "text-base font-normal text-text-primary",
          "placeholder:text-text-quaternary"
        )}
      />
      {showShortcut && (
        <div className="shrink-0 flex items-center border border-app-border rounded px-1 py-px">
          <span className="text-xs font-medium text-text-quaternary whitespace-nowrap">
            ⌘K
          </span>
        </div>
      )}
    </div>
  )
}
