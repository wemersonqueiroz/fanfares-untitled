"use client"

import { Lock01, Play } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"

// ── Public types ──────────────────────────────────────────────────────────────

export type SeriesEpisode = {
  id: string
  title: string
  creatorName: string
  thumbnailUrl?: string
  isOwned: boolean
}

export type SeriesSeason = {
  id: string
  title: string
  /** When false the whole season is locked — shows "Unlock Season X" CTA */
  isOwned?: boolean
  price?: string
  episodes: SeriesEpisode[]
}

export type SeriesEpisodeGridProps = {
  seasons: SeriesSeason[]
  onPlayEpisode?: (episodeId: string) => void
  onUnlockSeason?: (seasonId: string) => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

function EpisodeCard({
  episode,
  locked,
  onPlay,
}: {
  episode: SeriesEpisode
  locked: boolean
  onPlay?: () => void
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-2",
        !locked && "cursor-pointer group"
      )}
      onClick={!locked ? onPlay : undefined}>
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-app-surface border border-black/10">
        {episode.thumbnailUrl ? (
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="size-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-[#12192a] via-[#0e1520] to-[#080d14]" />
        )}

        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Lock01 size={20} color="white" aria-hidden="true" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div className={cx(
              "flex items-center justify-center size-10 rounded-full",
              "bg-white/15 backdrop-blur-sm border border-white/20"
            )}>
              <Play size={16} color="white" className="ml-0.5" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-semibold text-text-secondary truncate leading-snug">
          {episode.title}
        </p>
        <p className="text-xs text-text-tertiary truncate">{episode.creatorName}</p>
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SeriesEpisodeGrid({
  seasons,
  onPlayEpisode,
  onUnlockSeason,
  className,
}: SeriesEpisodeGridProps) {
  return (
    <div className={cx("flex flex-col gap-8", className)}>
      {seasons.map(season => {
        const seasonLocked = season.isOwned === false

        return (
          <div key={season.id} className="flex flex-col gap-4">
            {/* Season header */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-heading-list-item-strong text-text-primary">
                {season.title}
              </p>
              {seasonLocked && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onUnlockSeason?.(season.id)}>
                  Unlock {season.title}
                  {season.price && (
                    <span className="ml-1 opacity-70">— {season.price}</span>
                  )}
                </Button>
              )}
            </div>

            {/* Episode grid — 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {season.episodes.map(ep => (
                <EpisodeCard
                  key={ep.id}
                  episode={ep}
                  locked={seasonLocked || !ep.isOwned}
                  onPlay={() => onPlayEpisode?.(ep.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
