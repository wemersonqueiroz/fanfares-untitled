"use client"

import type { ReactNode } from "react"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"

// ── Public types ──────────────────────────────────────────────────────────────

export type BrowseSectionProps = {
  /** Section heading — e.g. "Trending", "Best Sellers", "Music" */
  title: string
  /** When provided, a "Show all" link is rendered to the right of the title. */
  onShowAll?: () => void
  /** Card row — pass <BrowseCard> elements directly as children. */
  children: ReactNode
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BrowseSection({
  title,
  onShowAll,
  children,
  className,
}: BrowseSectionProps) {
  return (
    <section
      className={cx("flex flex-col gap-2", className)}
      aria-label={title}>
      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-heading-list-item-strong sm:text-heading-section-strong text-text-primary">
          {title}
        </h2>

        {onShowAll && (
          <Button variant="tertiary" size="sm" onClick={onShowAll}>
            Show all
          </Button>
        )}
      </div>

      {/* ── Horizontally scrolling card row ─────────────────────────────── */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-1">
        {children}
      </div>
    </section>
  )
}
