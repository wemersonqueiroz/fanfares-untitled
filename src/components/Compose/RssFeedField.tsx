"use client"

import { useId } from "react"
import { Rss01 } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { FieldLabel } from "./FieldLabel"
import { FieldRow } from "./FieldRow"

// ── Public types ──────────────────────────────────────────────────────────────

export type RssFeedFieldProps = {
  value: string
  onChange: (value: string) => void
  /** Label text. Defaults to "RSS Feed". */
  label?: string
  /** Show "(optional)" suffix next to the label. Defaults to true. */
  optional?: boolean
  placeholder?: string
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Standard RSS Feed field used in every Compose* SetupForm: a labelled,
 * icon-prefixed URL input. Owns the rss icon, the FieldRow wrapper, and the
 * htmlFor wiring.
 */
export function RssFeedField({
  value,
  onChange,
  label = "RSS Feed",
  optional = true,
  placeholder = "https://your-feed.com/rss",
  className,
}: RssFeedFieldProps) {
  const id = useId()
  return (
    <div className={cx(className)}>
      <FieldLabel htmlFor={id}>
        {label}
        {optional && (
          <span className="text-text-tertiary font-normal"> (optional)</span>
        )}
      </FieldLabel>
      <FieldRow>
        <Rss01
          size={16}
          color="var(--color-text-tertiary)"
          aria-hidden="true"
          className="shrink-0"
        />
        <input
          id={id}
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-placeholder"
        />
      </FieldRow>
    </div>
  )
}
