"use client"

import { Download01, Lock02 } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { PlayCircle } from "@/components/PlayCircle"

// ── Public types ──────────────────────────────────────────────────────────────

export type SidebarEpisode = {
  id: string
  title: string
  /** e.g. "Chapter 1", "Segment 3" — shown next to duration. */
  chapterLabel?: string
  /** Display duration e.g. "08:23". */
  duration?: string
  state: "free-trailer" | "playable" | "locked"
  onPlay?: () => void
  onDownload?: () => void
}

export type EpisodesPanelProps = {
  episodes: SidebarEpisode[]
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EpisodeRow({ ep }: { ep: SidebarEpisode }) {
  const showPlay = ep.state === "free-trailer"
  const isLocked = ep.state === "locked"

  return (
    <div
      className={cx(
        "flex items-center gap-3 p-4 rounded-xl",
        "bg-app-card border border-app-border"
      )}>
      {showPlay && <PlayCircle size={40} label="Play trailer" onClick={ep.onPlay} />}

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-secondary leading-6 truncate">
          {ep.title}
        </p>
        {(ep.chapterLabel || ep.duration) && (
          <div className="flex items-center gap-2 text-xs text-text-tertiary leading-5">
            {ep.chapterLabel && <span className="truncate">{ep.chapterLabel}</span>}
            {ep.chapterLabel && ep.duration && (
              <span className="h-3 w-px bg-app-border" aria-hidden="true" />
            )}
            {ep.duration && <span className="truncate">{ep.duration}</span>}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={isLocked ? undefined : ep.onDownload}
        aria-label={isLocked ? "Locked" : "Download"}
        disabled={isLocked}
        className={cx(
          "flex items-center justify-center size-[18px] shrink-0",
          "text-text-tertiary hover:text-text-primary",
          "transition-colors duration-150",
          isLocked ? "cursor-default" : "cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded"
        )}>
        {isLocked ? (
          <Lock02 size={16} color="currentColor" aria-hidden="true" />
        ) : (
          <Download01 size={16} color="currentColor" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

/** Chapter / episode list rendered between the title block and the Creators panel. */
export function EpisodesPanel({ episodes }: EpisodesPanelProps) {
  return (
    <div className="flex flex-col gap-2 shrink-0 w-full">
      {episodes.map(ep => (
        <EpisodeRow key={ep.id} ep={ep} />
      ))}
    </div>
  )
}
