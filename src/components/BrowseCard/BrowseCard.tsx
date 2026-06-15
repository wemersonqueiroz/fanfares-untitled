"use client"

import type { FC, SVGProps } from "react"
import {
  BookOpen01,
  Download01,
  DotsVertical,
  File06,
  FileHeart02,
  Film01,
  Grid01,
  Headphones01,
  Lock02,
  Microphone01,
  MusicNote02,
  Share06,
  Star01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type BrowseVariant =
  | "article"
  | "podcast-episode"
  | "podcast-episode-no-video"
  | "book"
  | "audiobook"
  | "song"
  | "album"
  | "creator"
  | "collection"
  | "podcast-show"
  | "video"
  | "video-show"

/** lg = full-size card (260px wide / 160px portrait/square) — default
 *  md = dense card (192px wide / 90px portrait / 120px square)
 *  sm = horizontal list row (48×48 thumbnail, no overlay buttons) */
export type BrowseCardSize = "lg" | "md" | "sm"

export type BrowseCardProps = {
  variant: BrowseVariant
  /** Visual size of the card. Defaults to "lg". */
  size?: BrowseCardSize
  title: string
  /** Creator name for content cards; content type list for creator cards */
  subtitle: string
  coverUrl?: string
  /**
   * Whether to show the lock overlay (content is behind a paywall).
   * Locked cards always render ⋯ + FileHeart02 (wishlist only).
   * Ignored for the `creator` variant.
   */
  isLocked?: boolean
  onPlay?: () => void
  onOptions?: () => void
  /** Wishlist / save (FileHeart02 icon) — shown on Explore cards and locked cards */
  onWishlist?: () => void
  /** Share (Share06 icon) — shown on Library unlocked cards */
  onShare?: () => void
  /** Favourite (Star01 icon) — shown on Library unlocked cards */
  onFavourite?: () => void
  /** Download (Download01 icon) — shown on Library unlocked cards */
  onDownload?: () => void
  onClick?: () => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

type IconComponent = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>

type BadgeConfig = {
  Icon: IconComponent
  scheme: "orange" | "blue" | "brand" | "pink" | "gray" | "purple"
}

const BADGE_CONFIG: Record<Exclude<BrowseVariant, "creator">, BadgeConfig> = {
  article:                    { Icon: File06,        scheme: "orange" },
  "podcast-episode":          { Icon: Microphone01,  scheme: "pink"   },
  "podcast-episode-no-video": { Icon: Microphone01,  scheme: "pink"   },
  "podcast-show":             { Icon: Microphone01,  scheme: "pink"   },
  book:                       { Icon: BookOpen01,    scheme: "blue"   },
  audiobook:                  { Icon: Headphones01,  scheme: "brand"  },
  song:                       { Icon: MusicNote02,   scheme: "brand"  },
  album:                      { Icon: MusicNote02,   scheme: "brand"  },
  collection:                 { Icon: Grid01,        scheme: "gray"   },
  video:                      { Icon: Film01,        scheme: "purple" },
  "video-show":               { Icon: Film01,        scheme: "purple" },
}

/**
 * Uses Untitled UI `utility-*` semantic tokens which auto-flip light↔dark.
 */
const BADGE_SCHEME: Record<BadgeConfig["scheme"], string> = {
  orange: "bg-utility-orange-50  border-utility-orange-200  text-utility-orange-700",
  blue:   "bg-utility-blue-50    border-utility-blue-200    text-utility-blue-700",
  brand:  "bg-utility-brand-50   border-utility-brand-200   text-utility-brand-700",
  pink:   "bg-utility-pink-50    border-utility-pink-200    text-utility-pink-700",
  // gray is used on collection cards whose cover is always a dark gradient —
  // use frosted-glass white overlay so the icon is visible in any mode
  gray:   "bg-white/15 border-white/20 text-white",
  purple: "bg-utility-purple-50  border-utility-purple-200  text-utility-purple-700",
}

/**
 * Cover aspect ratio per variant.
 * - Wide: article is extra-wide (~5:2), podcast/video variants are 16:9
 * - Portrait: book is portrait (4:5)
 * - Everything else: square
 */
const COVER_ASPECT: Record<BrowseVariant, string> = {
  article:                    "aspect-[5/2]",
  "podcast-episode":          "aspect-video",
  "podcast-episode-no-video": "aspect-video",
  "podcast-show":             "aspect-video",
  video:                      "aspect-video",
  "video-show":               "aspect-video",
  book:                       "aspect-[4/5]",
  audiobook:                  "aspect-square",
  song:                       "aspect-square",
  album:                      "aspect-square",
  creator:                    "aspect-square",
  collection:                 "aspect-square",
}

/** Wide-cover variants — get extra width at lg/md */
const WIDE_VARIANTS = new Set<BrowseVariant>([
  "article",
  "podcast-episode",
  "podcast-episode-no-video",
  "podcast-show",
  "video",
  "video-show",
])

/** Portrait variants — use narrower width at md */
const PORTRAIT_VARIANTS = new Set<BrowseVariant>(["book"])

/** Return the Tailwind width class for this size + variant combination. */
function cardWidthClass(size: BrowseCardSize, variant: BrowseVariant): string {
  if (size === "sm") return "w-full"

  const isWide = WIDE_VARIANTS.has(variant)
  const isPortrait = PORTRAIT_VARIANTS.has(variant)

  if (size === "md") {
    if (isWide) return "w-48"
    if (isPortrait) return "w-card-portrait-md"
    return "w-card-square-md" // square & creator at md
  }

  // lg (default) — slightly smaller on mobile to fit the horizontal scroll
  if (isWide) return "w-card-wide-default sm:w-card-wide"
  return "w-card-square sm:w-40"
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Small icon badge shown top-left on non-creator cards */
function TypeBadge({
  variant,
}: {
  variant: Exclude<BrowseVariant, "creator">
}) {
  const { Icon, scheme } = BADGE_CONFIG[variant]
  return (
    <div
      aria-hidden="true"
      className={cx(
        "flex items-center justify-center p-2 rounded-full border shrink-0",
        BADGE_SCHEME[scheme]
      )}>
      <Icon size={12} color="currentColor" />
    </div>
  )
}

/** 22×22 blurred glass button — used in the top-right button stack */
function GlassMiniBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: IconComponent
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.()
      }}
      className={cx(
        "flex items-center justify-center size-overlay-btn rounded cursor-pointer shrink-0",
        "bg-overlay-btn backdrop-blur",
        "hover:opacity-80 transition-opacity duration-150",
        "focus-visible:outline-none"
      )}>
      <Icon size={14} color="white" aria-hidden="true" />
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BrowseCard({
  variant,
  size = "lg",
  title,
  subtitle,
  coverUrl,
  isLocked = false,
  onPlay,
  onOptions,
  onWishlist,
  onShare,
  onFavourite,
  onDownload,
  onClick,
  className,
}: BrowseCardProps) {
  const isCreator = variant === "creator"

  // Button logic (Figma spec):
  //   Locked   → ⋯ + FileHeart02              (2 buttons — can wishlist, can't share/download)
  //   Unlocked + library callbacks → ⋯ + Share06 + Star01 + Download01  (4 buttons)
  //   Unlocked + no library callbacks → ⋯ + FileHeart02                 (2 buttons)
  const isLibraryMode =
    !isLocked &&
    (onShare !== undefined ||
      onFavourite !== undefined ||
      onDownload !== undefined)

  // ── sm: horizontal list row ────────────────────────────────────────────────
  if (size === "sm") {
    return (
      <div
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? e => {
                if (e.key === "Enter" || e.key === " ") onClick()
              }
            : undefined
        }
        className={cx(
          "flex items-center gap-3 w-full",
          onClick && "cursor-pointer",
          className
        )}>
        {/* 48×48 square thumbnail — always square regardless of variant */}
        <div
          className={cx(
            "relative size-12 rounded-md shrink-0 overflow-hidden border border-black/10",
            isCreator && "rounded-full"
          )}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#27115f] to-[#1a0a40]" />
          )}
          <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
          {/* Lock overlay on sm cards */}
          {isLocked && !isCreator && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock02 size={16} color="white" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Text — fills remaining space */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate leading-5">
            {title}
          </p>
          <p className="text-xs font-medium text-text-tertiary truncate">
            {subtitle}
          </p>
        </div>
      </div>
    )
  }

  // ── lg / md: standard card layout ─────────────────────────────────────────
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === "Enter" || e.key === " ") onClick()
            }
          : undefined
      }
      className={cx(
        "flex flex-col gap-2 items-start shrink-0",
        cardWidthClass(size, variant),
        onClick && "cursor-pointer",
        className
      )}>
      {/* ── Cover / avatar area ──────────────────────────────────────────── */}
      <div
        className={cx(
          "relative w-full overflow-hidden border border-black/10",
          isCreator ? "rounded-full" : "rounded-md",
          COVER_ASPECT[variant]
        )}>
        {/* Background — image or gradient placeholder */}
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#27115f] to-[#1a0a40]" />
        )}

        {/* Subtle dark overlay over cover art */}
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

        {/* Type badge — top-left (not shown on creator) */}
        {!isCreator && (
          <div className="absolute top-2 left-2">
            <TypeBadge
              variant={variant as Exclude<BrowseVariant, "creator">}
            />
          </div>
        )}

        {/* Glass buttons — top-right stack (not shown on creator) */}
        {!isCreator && (
          <div className="absolute top-2 right-2 flex flex-col gap-0.5">
            <GlassMiniBtn
              icon={DotsVertical}
              label="Options"
              onClick={onOptions}
            />
            {isLibraryMode ? (
              /* Unlocked + library: Share, Favourite, Download */
              <>
                <GlassMiniBtn
                  icon={Share06}
                  label="Share"
                  onClick={onShare}
                />
                <GlassMiniBtn
                  icon={Star01}
                  label="Add to favourites"
                  onClick={onFavourite}
                />
                <GlassMiniBtn
                  icon={Download01}
                  label="Download"
                  onClick={onDownload}
                />
              </>
            ) : (
              /* Locked OR explore mode: Wishlist only */
              <GlassMiniBtn
                icon={FileHeart02}
                label="Add to wishlist"
                onClick={onWishlist}
              />
            )}
          </div>
        )}

        {/* Center action — lock icon or play button (not shown on creator) */}
        {!isCreator && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isLocked ? (
              /* Lock overlay — blurred glass circle */
              <div
                className={cx(
                  "flex items-center justify-center size-12 rounded-full",
                  "bg-overlay-btn backdrop-blur-md"
                )}>
                <Lock02 size={24} color="white" aria-hidden="true" />
              </div>
            ) : (
              /* Play button */
              <button
                type="button"
                aria-label={`Play ${title}`}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  onPlay?.()
                }}
                className={cx(
                  "flex items-center justify-center size-12 rounded-full cursor-pointer",
                  "bg-overlay-btn backdrop-blur-md",
                  "hover:bg-[rgba(91,90,87,0.65)] transition-colors duration-150",
                  "focus-visible:outline-none"
                )}>
                {/* Play triangle */}
                <span className="text-white text-lg ml-0.5" aria-hidden="true">
                  ▶
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Title + subtitle ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5 w-full">
        <p className="text-base font-semibold text-text-primary truncate leading-6">
          {title}
        </p>
        <p className="text-xs font-medium text-text-tertiary truncate">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
