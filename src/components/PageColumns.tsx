import type { ReactNode } from "react"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type PageColumnsProps = {
  /** Left sidebar — FanfaresMenu. Hidden below lg breakpoint. */
  left: ReactNode
  /** Center scrollable column. Max-width, padding and scroll are owned here. */
  center: ReactNode
  /**
   * Right sidebar slot — optional. Consumer is responsible for the aside
   * wrapper and breakpoint visibility (e.g. ContentRightAside).
   */
  right?: ReactNode
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Shared 3-column page layout shell.
 * Owns the column widths and scroll behaviour for every page.
 * Width constraints live here — add max-w-content-center here, not on each page.
 */
export function PageColumns({ left, center, right, className }: PageColumnsProps) {
  return (
    <div className={cx("flex flex-1 min-h-0 overflow-hidden", className)}>
      {/* Left sidebar — hidden below lg */}
      <aside className="hidden lg:flex p-4 h-full shrink-0">{left}</aside>

      {/* Center column — max-width enforced here for all pages.
       * `xl:pr-0` only when a right sidebar is provided (xl+ shows the sidebar
       * which supplies its own padding). Without a right sidebar we keep `pr-6`
       * at every breakpoint so content never goes flush to the viewport edge. */}
      <main
        className={cx(
          "flex-1 min-w-0 w-full py-4 px-3 lg:pl-0 lg:pr-6 overflow-y-auto scrollbar-hide",
          right && "xl:pr-0"
        )}>
        {center}
      </main>

      {/* Right sidebar — consumer provides its own aside + breakpoint wrapper */}
      {right}
    </div>
  )
}
