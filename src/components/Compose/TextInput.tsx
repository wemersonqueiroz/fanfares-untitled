"use client"

import { forwardRef, type InputHTMLAttributes } from "react"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Visual height. `md` = h-10 (default), `sm` = h-9. */
  size?: "sm" | "md"
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Standard text input used in every Compose* form.
 * Replaces the `"w-full px-3 h-10 rounded-lg border border-app-border bg-app-surface…"`
 * incantation duplicated across SetupForm files.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className, size = "md", type = "text", ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cx(
          "w-full px-3 rounded-lg border border-app-border bg-app-surface",
          "text-sm text-text-primary placeholder:text-text-placeholder",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
          "transition-colors duration-150",
          size === "sm" ? "h-9" : "h-10",
          className
        )}
        {...rest}
      />
    )
  }
)
