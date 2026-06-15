"use client"

import { useState } from "react"
import {
  Expand01,
  SkipBack,
  SkipForward,
  VolumeMax,
  VolumeX,
  Play,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { FadingDescription } from "@/components/FadingDescription"
import { HeroTitle } from "@/components/HeroTitle"
import { ContentPage } from "./index"
import type { ContentPageProps } from "./index"

// ── Public types ──────────────────────────────────────────────────────────────

export type VideoPageProps = Omit<
  ContentPageProps,
  | "contentType"
  | "topContent" // controlled internally
  | "showChaptersTab" // videos don't have chapters
> & {
  /** Video source URL (optional — shows poster/placeholder when omitted) */
  videoUrl?: string
  /** Poster/thumbnail image shown before playback starts */
  thumbnailUrl?: string
}

// ── Internal player sub-components ────────────────────────────────────────────

/** Inline SVG pause icon (no circle wrapper) */
function PauseIcon({ size = 20 }: { size?: number }) {
  const barW = Math.round(size * 0.167)
  const barH = Math.round(size * 0.583)
  const gap = Math.round(size * 0.125)
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

/** Thin seek bar with white filled-portion and white circle thumb */
function VideoSeekBar({
  percent,
  onSeek,
}: {
  percent: number
  onSeek?: (p: number) => void
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
      className="relative flex items-center flex-1 cursor-pointer py-2"
      onClick={handleClick}
      role="slider"
      aria-label="Video position"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}>
      <div className="relative w-full h-track rounded-full bg-white/25">
        {/* Played portion */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white"
          style={{ width: `${clamped}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 size-3 rounded-full bg-white shadow -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Embedded video player — purely presentational.
 * Shows a poster or gradient placeholder, a centered play overlay when paused,
 * and a gradient controls bar at the bottom.
 *
 * Controls fade out when the video is playing and the mouse leaves;
 * they reappear on hover.
 */
function VideoPlayer({
  thumbnailUrl,
  isPlaying,
  isMuted,
  progressPercent,
  currentTime,
  totalTime,
  onPlay,
  onPause,
  onSkipBack,
  onSkipForward,
  onSeek,
  onMuteToggle,
  onFullscreen,
}: {
  thumbnailUrl?: string
  isPlaying: boolean
  isMuted: boolean
  progressPercent: number
  currentTime: string
  totalTime: string
  onPlay?: () => void
  onPause?: () => void
  onSkipBack?: () => void
  onSkipForward?: () => void
  onSeek?: (p: number) => void
  onMuteToggle?: () => void
  onFullscreen?: () => void
}) {
  const [controlsVisible, setControlsVisible] = useState(true)

  const handleMainClick = () => {
    isPlaying ? onPause?.() : onPlay?.()
  }

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-black cursor-pointer select-none"
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => {
        if (isPlaying) setControlsVisible(false)
      }}
      onClick={handleMainClick}>
      {/* Poster image or dark gradient placeholder */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          className="size-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="size-full bg-gradient-to-br from-[#12192a] via-[#0e1520] to-[#080d14]" />
      )}

      {/* Paused: centered play circle */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            type="button"
            aria-label="Play video"
            onClick={e => {
              e.stopPropagation()
              onPlay?.()
            }}
            className={cx(
              "flex items-center justify-center size-16 rounded-full",
              "bg-white/15 backdrop-blur-sm border border-white/20",
              "hover:bg-white/25 transition-colors duration-150",
              "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            )}>
            <Play size={28} color="white" className="ml-1" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Controls bar — gradient overlay at the bottom */}
      <div
        className={cx(
          "absolute bottom-0 left-0 right-0",
          "px-4 pt-8 pb-3",
          "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
          "transition-opacity duration-200",
          controlsVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={e => e.stopPropagation()}>
        {/* Seek bar */}
        <VideoSeekBar percent={progressPercent} onSeek={onSeek} />

        {/* Button row */}
        <div className="flex items-center gap-3 mt-0.5">
          {/* Skip back */}
          <button
            type="button"
            aria-label="Skip back 15s"
            onClick={onSkipBack}
            className="text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none">
            <SkipBack size={18} color="currentColor" aria-hidden="true" />
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={() => (isPlaying ? onPause?.() : onPlay?.())}
            className="text-white hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-none">
            {isPlaying ? (
              <PauseIcon size={20} />
            ) : (
              <Play size={20} color="currentColor" aria-hidden="true" />
            )}
          </button>

          {/* Skip forward */}
          <button
            type="button"
            aria-label="Skip forward 15s"
            onClick={onSkipForward}
            className="text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none">
            <SkipForward size={18} color="currentColor" aria-hidden="true" />
          </button>

          {/* Timestamps */}
          <span className="text-white/80 text-xs tabular-nums ml-1 shrink-0">
            {currentTime} / {totalTime}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Mute */}
          <button
            type="button"
            aria-label={isMuted ? "Unmute" : "Mute"}
            onClick={onMuteToggle}
            className="text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none">
            {isMuted ? (
              <VolumeX size={18} color="currentColor" aria-hidden="true" />
            ) : (
              <VolumeMax size={18} color="currentColor" aria-hidden="true" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            aria-label="Fullscreen"
            onClick={onFullscreen}
            className="text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none">
            <Expand01 size={18} color="currentColor" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Video top section ─────────────────────────────────────────────────────────

function VideoContentTop({
  title,
  creatorName,
  description,
  thumbnailUrl,
}: {
  title: string
  creatorName: string
  description: string
  thumbnailUrl?: string
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  // Mock timestamps that advance when "playing" in a real implementation
  const currentTime = "0:00"
  const totalTime = "42:18"

  return (
    <div className="flex flex-col gap-4">
      {/* Video player */}
      <VideoPlayer
        thumbnailUrl={thumbnailUrl}
        isPlaying={isPlaying}
        isMuted={isMuted}
        progressPercent={progress}
        currentTime={currentTime}
        totalTime={totalTime}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onSkipBack={() => setProgress(p => Math.max(0, p - 6.4))} // ~15s back
        onSkipForward={() => setProgress(p => Math.min(100, p + 6.4))} // ~15s forward
        onSeek={p => setProgress(p)}
        onMuteToggle={() => setIsMuted(m => !m)}
        onFullscreen={() => console.log("→ fullscreen")}
      />

      <HeroTitle title={title} subtitle={creatorName} />

      <FadingDescription
        text={description}
        maxHeightClass="h-chapter-list"
        fadeHeightClass="h-14"
      />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VideoPage({
  title,
  creator,
  description,
  thumbnailUrl,
  activeTab = "comments",
  ...rest
}: VideoPageProps) {
  return (
    <ContentPage
      {...rest}
      contentType="video"
      title={title}
      creator={creator}
      description={description}
      activeTab={activeTab}
      showChaptersTab={false}
      chapters={[]}
      topContent={
        <VideoContentTop
          title={title}
          creatorName={creator.name}
          description={description}
          thumbnailUrl={thumbnailUrl}
        />
      }
    />
  )
}
