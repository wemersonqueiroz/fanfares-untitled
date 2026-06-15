"use client"

import {
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from "react"
import { XClose } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { IconButton } from "@/components/IconButton"

// ── Public types ──────────────────────────────────────────────────────────────

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  /** Content rendered inside the modal card */
  children: ReactNode
  /** Extra classes applied to the modal card div */
  className?: string
  /** Whether to show the X close button at the top-left — default true */
  showClose?: boolean
  /** Tailwind max-width class for the card — default "max-w-modal" (760px) */
  maxWidth?: string
  /** Accessible label for the dialog */
  ariaLabel?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Generic modal shell.
 *
 * Provides:
 *   - Full-screen frosted-glass overlay (click-outside → close)
 *   - `rounded-2xl bg-app-surface` card with configurable max-width
 *   - Optional X close button (top-left row, not absolutely-positioned)
 *   - Escape key → close
 *   - Focus trap via autoFocus on the card
 *
 * Pass any content via `children`.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  className,
  showClose = true,
  maxWidth = "max-w-modal",
  ariaLabel = "Dialog",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Focus the card so Escape works immediately
  useEffect(() => {
    if (isOpen) cardRef.current?.focus()
  }, [isOpen])

  // Escape → close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  // Click on overlay backdrop (not on the card) → close
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  if (!isOpen) return null

  return (
    /* ── Overlay ──────────────────────────────────────────────────────────── */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      className={cx(
        "fixed inset-0 z-50",
        "flex items-center justify-center p-6 sm:p-12 lg:p-16",
        "bg-overlay-btn backdrop-blur-sm"
      )}>

      {/* ── Modal card ──────────────────────────────────────────────────── */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={cx(
          "relative flex flex-col gap-6",
          "w-full",
          maxWidth,
          "rounded-2xl bg-app-surface",
          "p-4",
          "focus:outline-none",
          className
        )}>

        {/* X close button — own row at top-left */}
        {showClose && (
          <div className="flex items-start shrink-0">
            <IconButton
              icon={XClose}
              label="Close"
              variant="ghost"
              size="sm"
              iconSize={24}
              onClick={onClose}
              className="rounded"
            />
          </div>
        )}

        {/* Slot — pass any children here */}
        {children}

      </div>
    </div>
  )
}
