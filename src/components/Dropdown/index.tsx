"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type DropdownProps = {
  /**
   * Render prop for the trigger element.
   * - `open`   — whether the panel is visible; use for `aria-expanded` and active styling
   * - `toggle` — call this on the trigger's `onClick`
   */
  trigger: (open: boolean, toggle: () => void) => ReactNode
  /**
   * Render prop for the panel body.
   * - `close` — call this after an action to dismiss the panel (e.g. on item select)
   */
  children: (close: () => void) => ReactNode
  /** Which edge of the trigger the panel aligns to. @default "right" */
  align?: "left" | "right"
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = () => setOpen(o => !o)
  const close  = () => setOpen(false)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div ref={containerRef} className={cx("relative shrink-0", className)}>
      {/* ── Trigger ── */}
      {trigger(open, toggle)}

      {/* ── Panel ── */}
      {open && (
        <div
          className={cx(
            "absolute z-20 top-full mt-1.5",
            align === "right" ? "right-0" : "left-0",
            "bg-app-card border border-app-border rounded-lg shadow-lg",
            "animate-in fade-in slide-in-from-top-1 duration-150 ease-out"
          )}>
          {children(close)}
        </div>
      )}
    </div>
  )
}
