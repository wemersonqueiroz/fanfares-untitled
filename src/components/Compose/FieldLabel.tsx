"use client"

import type { ReactNode } from "react"

// ── Public types ──────────────────────────────────────────────────────────────

export type FieldLabelProps = {
  children: ReactNode
  htmlFor?: string
  required?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FieldLabel({ children, htmlFor, required }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-text-secondary block mb-1.5">
      {children}
      {required && <span className="text-brand-500 ml-0.5">*</span>}
    </label>
  )
}
