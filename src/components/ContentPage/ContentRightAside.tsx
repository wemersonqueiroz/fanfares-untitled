"use client"

import { RightSidebar } from "@/components/RightSidebar"
import type { RightSidebarProps } from "@/components/RightSidebar"

// ── Public types ──────────────────────────────────────────────────────────────

export type ContentRightAsideProps = RightSidebarProps

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Positional wrapper for RightSidebar.
 * Hidden below xl breakpoint; renders the sidebar with consistent 16px padding.
 * Use this everywhere a right content panel is needed — feed, content pages, etc.
 */
export function ContentRightAside(props: ContentRightAsideProps) {
  return (
    <aside className="hidden xl:flex p-4 h-full shrink-0">
      <RightSidebar {...props} />
    </aside>
  )
}
