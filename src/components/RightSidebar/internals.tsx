"use client"

import type { ReactNode } from "react"
import { cx } from "@/utils/cx"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"

// ── Variant derivation ───────────────────────────────────────────────────────

/** Content types whose cover art renders in a 16:9 wide aspect (vs square). */
const WIDE_COVER_TYPES = new Set<ContentType>(["video", "video-show", "podcast", "podcast-show"])

/** Content types whose creator role label renders bold (vs regular). */
const BOLD_ROLE_TYPES = new Set<ContentType>(["video", "video-show", "podcast", "podcast-show"])

export function isWideCover(contentType: ContentType): boolean {
  return WIDE_COVER_TYPES.has(contentType)
}

export function isBoldRole(contentType: ContentType): boolean {
  return BOLD_ROLE_TYPES.has(contentType)
}

// ── FollowBtn ────────────────────────────────────────────────────────────────

/** Brand-bordered Follow pill used in the Creators panel rows. */
export function FollowBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center shrink-0",
        "px-3 py-2 rounded-md text-sm font-semibold text-text-secondary",
        "border border-brand-500 bg-app-card",
        "hover:bg-utility-brand-50 transition-colors duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      )}>
      Follow
    </button>
  )
}

// ── Panel ────────────────────────────────────────────────────────────────────

/** Shared panel wrapper for Creators / About / Info / Episodes sections. */
export function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 px-4 py-3 rounded-md overflow-hidden",
        "bg-app-card",
        className
      )}>
      {children}
    </div>
  )
}

export function PanelHeading({ children }: { children: ReactNode }) {
  return <p className="text-subhead text-text-primary">{children}</p>
}
