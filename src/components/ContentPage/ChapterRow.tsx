"use client"

import { cx } from "@/utils/cx"
import { Download01, Lock01, Play } from "@untitledui/icons"

// ── Public types ──────────────────────────────────────────────────────────────

export type ChapterRowProps = {
  id: string
  title: string
  /** Short label shown below title — e.g. "Chapter 1" or "Ep. 42" */
  label: string
  duration: string
  /** 0–100; omit or set to 0 to hide */
  progressPercent?: number
  /** True = user owns this chapter; false = locked */
  isOwned: boolean
  onPlay?: (id: string) => void
  onDownload?: (id: string) => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ChapterRow({
  id,
  title,
  label,
  duration,
  progressPercent,
  isOwned,
  onPlay,
  onDownload,
  className,
}: ChapterRowProps) {
  return (
    <div
      className={cx(
        "flex items-center gap-3 p-4",
        "bg-app-card border border-app-border rounded-xl",
        className
      )}>
      {/* Play button (owned only) */}
      {isOwned && (
        <button
          type="button"
          onClick={() => onPlay?.(id)}
          aria-label={`Play ${title}`}
          className={cx(
            "flex items-center justify-center size-10 rounded-full shrink-0 cursor-pointer text-white",
            "bg-[rgba(91,90,87,0.4)] backdrop-blur-sm",
            "hover:bg-[rgba(91,90,87,0.65)] transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          )}>
          <Play size={16} color="currentColor" aria-hidden="true" />
        </button>
      )}

      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="text-xl font-bold text-text-secondary truncate leading-snug">
          {title}
        </p>
        <p className="text-sm text-text-tertiary">{label}</p>
      </div>

      {/* Right cluster: progress · duration · action */}
      <div className="flex items-center gap-3 shrink-0">
        {progressPercent !== undefined && progressPercent > 0 && (
          <>
            <span className="text-sm text-text-tertiary">
              {progressPercent}%
            </span>
            {/* Vertical separator */}
            <div className="w-px h-3 bg-app-border" aria-hidden="true" />
          </>
        )}
        <span className="text-sm text-text-tertiary">{duration}</span>

        {/* Action: download (owned) or lock icon (locked) */}
        {isOwned ? (
          <button
            type="button"
            onClick={() => onDownload?.(id)}
            aria-label={`Download ${title}`}
            className={cx(
              "flex items-center justify-center size-5 cursor-pointer",
              "text-text-success-primary hover:opacity-80 transition-opacity duration-150",
              "focus-visible:outline-none"
            )}>
            <Download01 size={16} color="currentColor" aria-hidden="true" />
          </button>
        ) : (
          <div
            className="flex items-center justify-center size-5 text-text-warning-primary"
            aria-label="Locked">
            <Lock01 size={16} color="currentColor" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}
