"use client"

import { type ReactNode } from "react"
import { ChevronDown, ChevronUp } from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type AccordionPanelProps = {
  number: number
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AccordionPanel({
  number,
  title,
  open,
  onToggle,
  children,
  className,
}: AccordionPanelProps) {
  return (
    <div className={cx("flex flex-col rounded-xl border border-app-border bg-app-card overflow-hidden", className)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between px-4 py-4 text-left cursor-pointer hover:bg-app-card-active transition-colors duration-150 focus-visible:outline-none">
        <span className="text-heading-list-item text-text-primary">
          {number}. {title}
        </span>
        {open
          ? <ChevronUp  size={20} color="var(--color-text-tertiary)" aria-hidden="true" />
          : <ChevronDown size={20} color="var(--color-text-tertiary)" aria-hidden="true" />}
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-5">
          <div className="border-t border-app-border -mx-4 mb-1" />
          {children}
        </div>
      )}
    </div>
  )
}
