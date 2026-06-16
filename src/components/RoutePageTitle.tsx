"use client"

import type { ReactNode } from "react"
import { ArrowNarrowLeft } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { IconButton } from "@/components/IconButton"

// ── Public types ──────────────────────────────────────────────────────────────

export type RoutePageTitleProps = {
  title: string
  /** When provided, renders a back arrow before the title. */
  onBack?: () => void
  /** Optional content rendered on the right side (e.g. search bar, actions). */
  action?: ReactNode
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Standardized top-of-page heading used by every route — Library, Wishlist,
 * Explore, Settings, Settings sub-sections, etc. One source of truth so all
 * route titles render with the same scale, weight, and alignment.
 */
export function RoutePageTitle({
  title,
  onBack,
  action,
  className,
}: RoutePageTitleProps) {
  return (
    <div
      className={cx(
        "flex items-center justify-between gap-4 shrink-0 w-full",
        className
      )}>
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <IconButton
            icon={ArrowNarrowLeft}
            label="Go back"
            variant="ghost-primary"
            size="md"
            onClick={onBack}
          />
        )}
        <h1 className="text-heading-section-strong text-text-primary truncate">
          {title}
        </h1>
      </div>
      {action}
    </div>
  )
}
