"use client"

import type { FC, SVGProps } from "react"
import { Lock02 } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { coverAspectFor } from "@/utils/coverAspect"
import { PlayCircle } from "@/components/PlayCircle"
import type { ContentType } from "./ContentTypeTag"

// Re-exports kept for backwards-compat with ContentCard internals callers.
export { GlassBtn } from "@/components/GlassBtn"
export { fmtCount as fmtAmount } from "@/utils/fmtCount"

// ── Public types ──────────────────────────────────────────────────────────────

export type IconComp = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>

// ── LockedPricePill ──────────────────────────────────────────────────────────

/** Solid (filled) lightning bolt in a configurable color — used in
 *  `LockedPricePill`. The `@untitledui/icons` lightning glyphs are
 *  stroke-only and hard to read at small sizes; this is the filled twin. */
function FilledBolt({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true">
      <path d="M13 2 4.093 12.688c-.348.418-.523.628-.525.804a.5.5 0 0 0 .185.397c.138.111.41.111.955.111H12l-1 8 8.907-10.688c.348-.418.523-.628.525-.804a.5.5 0 0 0-.185-.397c-.138-.111-.41-.111-.955-.111H12l1-8Z" />
    </svg>
  )
}

/**
 * Glass-pill overlay shown on locked thumbnails:
 *   [ 🔒 purple circle ]  ⚡(gold zap)  {price}
 *
 * Surfaces the cost up-front so the viewer can decide before tapping Unlock.
 */
export function LockedPricePill({ price }: { price?: string }) {
  return (
    <div
      className={cx(
        "flex items-center gap-2 pl-1 pr-4 py-1 rounded-full",
        "bg-black/70 backdrop-blur-sm border border-brand-500 shrink-0"
      )}>
      <span className="flex items-center justify-center size-8 rounded-full bg-brand-500 shrink-0">
        <Lock02 size={16} color="white" aria-hidden="true" />
      </span>
      <FilledBolt size={18} color="#FACC15" />
      <span className="text-base font-semibold text-white whitespace-nowrap">
        {price ?? "Unlock"}
      </span>
    </div>
  )
}

// ── MediaThumbnail ───────────────────────────────────────────────────────────

/** Placeholder gradient per content variant — shown when no cover URL is set. */
const MEDIA_GRADIENT: Record<ContentType, string> = {
  article:        "from-[#141820] to-[#080a0d]",
  note:           "from-[#102a56] to-[#091a38]",
  book:           "from-[#2e1410] to-[#180a08]",
  audiobook:      "from-[#102a18] to-[#081710]",
  song:           "from-[#2a1f10] to-[#170f08]",
  album:          "from-[#2a1f10] to-[#170f08]",
  collection:     "from-[#27115f] to-[#1a0a40]",
  podcast:        "from-[#1a1226] to-[#0e0a18]",
  "podcast-show": "from-[#1a1226] to-[#0e0a18]",
  video:          "from-[#12192a] to-[#080d14]",
  "video-show":   "from-[#12192a] to-[#080d14]",
}

/**
 * Full-width cover thumbnail. Aspect ratio is derived from `contentType` via
 * the shared `coverAspectFor` util — same map used by `BrowseCard` — so a Book
 * is portrait everywhere, a Video is 16:9 everywhere, etc.
 *
 * Optional lock overlay (centered `LockedPricePill`) and a bottom-left play
 * button for media that supports inline playback.
 */
export function MediaThumbnail({
  url,
  contentType,
  isLocked,
  price,
  showPlay = false,
  onPlay,
}: {
  url?: string
  contentType: ContentType
  isLocked: boolean
  /** Unlock price — when provided alongside `isLocked`, the centered lock is
   *  replaced by a `LockedPricePill`. */
  price?: string
  showPlay?: boolean
  /** Fires when the centered play button is clicked. */
  onPlay?: () => void
}) {
  return (
    <div
      className={cx(
        "relative w-full rounded-xl overflow-hidden",
        coverAspectFor(contentType)
      )}>
      {url ? (
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <div
          className={cx("size-full bg-gradient-to-br", MEDIA_GRADIENT[contentType])}
        />
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <LockedPricePill price={price} />
        </div>
      )}

      {showPlay && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle size={48} onClick={onPlay} />
        </div>
      )}
    </div>
  )
}

