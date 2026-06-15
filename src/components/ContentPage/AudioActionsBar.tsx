"use client"

import { cx } from "@/utils/cx"
import {
  Expand01,
  SkipBack,
  SkipForward,
  VolumeMax,
  VolumeX,
  Play,
} from "@untitledui/icons"
import { IconButton } from "@/components/IconButton"

// ── Public types ──────────────────────────────────────────────────────────────

export type AudioActionsBarProps = {
  title: string
  creatorName: string
  coverUrl?: string
  isPlaying: boolean
  /** Formatted current position — e.g. "12:34" */
  currentTime: string
  /** Formatted total duration — e.g. "1:23:45" */
  totalTime: string
  /**
   * Formatted remaining time — e.g. "26:21".
   * Shown as "-26:21" on the right of the bar.
   * Falls back to totalTime when omitted.
   */
  remainingTime?: string
  /** 0–100 */
  progressPercent: number
  /** Playback speed multiplier — e.g. 1, 1.25, 1.5, 2 */
  playbackSpeed: number
  /** 0–100 */
  volume: number
  // Callbacks
  onPlayPause?: () => void
  onSkipBack?: () => void
  onSkipForward?: () => void
  onSeek?: (percent: number) => void
  onSpeedToggle?: () => void
  onVolumeToggle?: () => void
  onVolumeChange?: (volume: number) => void
  onExpand?: () => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

/**
 * Thin seekable track — used for both the progress bar and the volume slider.
 * Renders a 2 px line with a white fill, a gray unplayed track, and an
 * always-visible white circle thumb.
 */
function SeekTrack({
  percent,
  onSeek,
  label,
  width,
  showThumb = false,
}: {
  percent: number
  onSeek?: (percent: number) => void
  label: string
  /** Optional fixed width class, e.g. "w-[80px]". Defaults to flex-1. */
  width?: string
  /** Show a white circle thumb at the current position (e.g. volume slider). Default false. */
  showThumb?: boolean
}) {
  const clamped = Math.max(0, Math.min(100, percent))

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return
    const rect = e.currentTarget.getBoundingClientRect()
    onSeek(
      Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    )
  }

  return (
    <div
      className={cx(
        "relative flex items-center cursor-pointer py-2",
        width ?? "flex-1"
      )}
      onClick={handleClick}
      role="slider"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}>
      {/* Track background (unplayed) */}
      <div className="relative w-full h-track rounded-full bg-app-track">
        {/* Filled / played portion — text-primary flips dark↔light automatically */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-text-primary"
          style={{ width: `${clamped}%` }}
        />
        {/* Optional thumb — visible on volume slider, hidden on progress bar */}
        {showThumb && (
          <div
            className="absolute top-1/2 size-3 rounded-full bg-text-primary shadow -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Plain two-bar pause icon — no circle/square wrapper,
 * "plain transport" style. Untitled UI only ships PauseCircle/PauseSquare,
 * so we render this inline.
 */
function PauseIcon({ size = 24 }: { size?: number }) {
  const barW = Math.round(size * 0.167) // ≈ 4px at 24px
  const barH = Math.round(size * 0.583) // ≈ 14px at 24px
  const gap = Math.round(size * 0.125) // ≈ 3px at 24px
  const totalW = barW * 2 + gap
  const x1 = (size - totalW) / 2
  const x2 = x1 + barW + gap
  const y = (size - barH) / 2
  const r = barW / 2
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="currentColor"
      aria-hidden="true">
      <rect x={x1} y={y} width={barW} height={barH} rx={r} />
      <rect x={x2} y={y} width={barW} height={barH} rx={r} />
    </svg>
  )
}

function fmtSpeed(s: number) {
  return Number.isInteger(s) ? `${s}×` : `${s}×`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AudioActionsBar({
  title,
  creatorName,
  coverUrl,
  isPlaying,
  currentTime,
  totalTime,
  remainingTime,
  progressPercent,
  playbackSpeed,
  volume,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onSeek,
  onSpeedToggle,
  onVolumeToggle,
  onVolumeChange,
  onExpand,
  className,
}: AudioActionsBarProps) {
  const rightTime = remainingTime ? `-${remainingTime}` : totalTime

  return (
    <div
      className={cx(
        "flex items-center gap-4 px-6",
        "h-audio-bar w-full shrink-0",
        "bg-app-surface border-t border-app-border",
        className
      )}
      role="region"
      aria-label="Audio player">
      {/* ── Left: mini cover + track info ──────────────────────────────── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="shrink-0 size-10 rounded-md overflow-hidden border border-black/10">
          {coverUrl ? (
            <img src={coverUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="size-full bg-gradient-to-br from-[#27115f] to-[#1a0a40]" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-bold text-text-primary truncate leading-snug">
            {title}
          </p>
          <p className="text-xs text-text-tertiary truncate leading-snug">
            {creatorName}
          </p>
        </div>
      </div>

      {/* ── Center: transport (top) + progress bar (bottom) ────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Transport controls — centred */}
        <div className="flex items-center justify-center gap-5">
          <IconButton
            icon={SkipBack}
            label="Skip back 15s"
            variant="ghost-primary"
            iconSize={18}
            onClick={onSkipBack}
          />

          {/* Play / Pause — plain icons, no circle wrapper */}
          <button
            type="button"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex items-center justify-center shrink-0 cursor-pointer text-text-primary hover:opacity-70 transition-opacity duration-150 focus-visible:outline-none">
            {isPlaying ? (
              <PauseIcon size={28} />
            ) : (
              <Play size={28} color="currentColor" aria-hidden="true" />
            )}
          </button>

          <IconButton
            icon={SkipForward}
            label="Skip forward 15s"
            variant="ghost-primary"
            iconSize={18}
            onClick={onSkipForward}
          />
        </div>

        {/* Progress track + timestamps */}
        <div className="flex items-center gap-2">
          <span className="text-2xs text-text-primary shrink-0 tabular-nums">
            {currentTime}
          </span>
          <SeekTrack
            percent={progressPercent}
            onSeek={onSeek}
            label="Playback position"
          />
          <span className="text-2xs text-text-primary shrink-0 tabular-nums">
            {rightTime}
          </span>
        </div>
      </div>

      {/* ── Right: speed + volume icon + volume slider + expand ────────── */}
      {/* bottom-aligned with the progress row */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        {/* Speed */}
        <button
          type="button"
          onClick={onSpeedToggle}
          aria-label={`Playback speed ${playbackSpeed}×`}
          className="flex items-center justify-center px-2 py-0.5 rounded-md shrink-0 text-2xs font-semibold text-text-primary cursor-pointer bg-app-border hover:bg-app-border-hover transition-colors focus-visible:outline-none">
          {fmtSpeed(playbackSpeed)}
        </button>

        {/* Volume icon (mute toggle) */}
        <IconButton
          icon={volume === 0 ? VolumeX : VolumeMax}
          label={volume === 0 ? "Unmute" : "Mute"}
          variant="ghost-primary"
          iconSize={18}
          onClick={onVolumeToggle}
        />

        {/* Volume slider — same SeekTrack style but with visible thumb */}
        <SeekTrack
          percent={volume}
          onSeek={v => onVolumeChange?.(v)}
          label="Volume"
          width="w-20"
          showThumb
        />

        {/* Expand */}
        <IconButton
          icon={Expand01}
          label="Expand player"
          variant="ghost-primary"
          iconSize={18}
          onClick={onExpand}
        />
      </div>
    </div>
  )
}
