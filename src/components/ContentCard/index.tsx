"use client"

import type { FC, ReactNode, SVGProps } from "react"
import Link from "next/link"
import {
  BookOpen01,
  Bookmark,
  DotsVertical,
  Headphones01,
  Lightning01,
  Lock02,
  Microphone01,
  MusicNote01,
  Play,
  Rss01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar, AvatarGroup } from "@/components/Avatar"
import { CreatorByline } from "@/components/CreatorByline"
import { ContentTypeTag } from "./ContentTypeTag"
import type { ContentType } from "./ContentTypeTag"
import { CardSocialButtons } from "./CardSocialButtons"

// ── Public types ──────────────────────────────────────────────────────────────

export type CardCreator = {
  /** Display name shown on the card */
  name: string
  /** Optional @handle shown below the name */
  handle?: string
  /** Optional avatar image URL — falls back to initials */
  avatarUrl?: string
}

export type CardPurchase =
  | { state: "free" }
  | { state: "locked"; price?: string; label?: string }
  | { state: "unlocked" }

export type CardBooster = {
  name: string
  avatarUrl?: string
  /** Raw boost amount (e.g. sats). Displayed as formatted number. */
  amount: number
}

/**
 * Discriminated union — content body varies per type.
 * All types share `title` and `subtitle?`.
 */
export type CardContent =
  | {
      type: "video" | "video-show"
      title: string
      subtitle?: string
      thumbnailUrl?: string
      duration?: string
      episodeCount?: number
    }
  | {
      type: "article" | "note"
      title: string
      subtitle?: string
      excerpt: string
    }
  | {
      type: "podcast" | "podcast-show"
      title: string
      subtitle?: string
      thumbnailUrl?: string
      duration?: string
      episodeCount?: number
    }
  | {
      type: "audiobook"
      title: string
      subtitle?: string
      coverUrl?: string
      duration: string
      narrator?: string
    }
  | {
      type: "book"
      title: string
      subtitle?: string
      coverUrl?: string
      pageCount?: number
    }
  | {
      type: "song"
      title: string
      subtitle?: string
      coverUrl?: string
      duration: string
      /** Album the song belongs to */
      album?: string
    }
  | {
      type: "album"
      title: string
      subtitle?: string
      coverUrl?: string
      trackCount: number
    }
  | {
      type: "collection"
      title: string
      subtitle?: string
      /** Up to 4 cover images for the 2×2 mosaic */
      coverUrls?: string[]
      itemCount: number
    }

export type ContentCardProps = {
  id: string
  creator: CardCreator
  content: CardContent
  purchase: CardPurchase
  social: {
    comments: number
    shares: number
    likes: number
    boosts: number
  }
  /** Primary booster shown in the boost pill */
  topBooster?: CardBooster
  /** Avatar URLs for the supporter group (up to ~5; overflow shown as +N) */
  supporterAvatarUrls?: (string | undefined)[]
  /** Whether the current user has wishlisted this card */
  isWishlisted?: boolean
  // ── Callbacks ─────────────────────────────────────────────────────────────
  onUnlock?: () => void
  onWishlist?: () => void
  onOptions?: () => void
  onComment?: () => void
  onShare?: () => void
  onLike?: () => void
  onBoost?: () => void
  /** Fires when the card body/title area is clicked (not on action buttons) */
  onCardClick?: () => void
  /**
   * When set, the card title becomes a Next.js `<Link>` to this URL.
   * Takes precedence over `onCardClick` for the title element only.
   */
  href?: string
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

type IconComp = FC<SVGProps<SVGSVGElement> & { size?: number; color?: string }>

function fmtAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return n.toLocaleString()
}

/** Blurred glass mini button — 22 × 22 px, used on thumbnail overlays */
function GlassBtn({
  icon: Icon,
  label,
  active,
  onClick,
  className,
}: {
  icon: IconComp
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        onClick?.()
      }}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        "flex items-center justify-center size-overlay-btn rounded-md cursor-pointer shrink-0",
        "bg-overlay-btn backdrop-blur-sm",
        "transition-opacity duration-150 hover:opacity-80",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
        className
      )}>
      <Icon
        size={13}
        color={active ? "var(--color-brand-500)" : "var(--color-text-primary)"}
        aria-hidden="true"
      />
    </button>
  )
}

// Avatar and AvatarGroup are imported from @/components/Avatar

// ── Media thumbnail (Video / VideoShow / Podcast preview) ─────────────────────

function MediaThumbnail({
  url,
  contentType,
  isLocked,
  showPlay = false,
}: {
  url?: string
  contentType: ContentType
  isLocked: boolean
  showPlay?: boolean
}) {
  const GRADIENT: Partial<Record<ContentType, string>> = {
    video: "from-[#12192a] to-[#080d14]",
    "video-show": "from-[#12192a] to-[#080d14]",
    podcast: "from-[#1a1226] to-[#0e0a18]",
    "podcast-show": "from-[#1a1226] to-[#0e0a18]",
  }
  const gradient = GRADIENT[contentType] ?? "from-[#141820] to-[#080a0d]"

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      {url ? (
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <div className={cx("size-full bg-gradient-to-br", gradient)} />
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="flex items-center justify-center size-12 rounded-full bg-overlay-btn backdrop-blur-sm">
            <Lock02 size={22} color="white" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Play button — only when unlocked/free */}
      {showPlay && !isLocked && (
        <button
          type="button"
          aria-label="Play"
          onClick={e => e.stopPropagation()}
          className={cx(
            "absolute bottom-3 left-3",
            "flex items-center justify-center size-10 rounded-full cursor-pointer",
            "bg-overlay-btn backdrop-blur-sm",
            "hover:opacity-80 transition-opacity duration-150"
          )}>
          <Play size={18} color="white" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

// ── Cover + metadata side-by-side (Audiobook / Book / Song / Album / Podcast) ─

function CoverWithMeta({
  coverUrl,
  gradient,
  isLocked,
  children,
}: {
  coverUrl?: string
  gradient: string
  isLocked: boolean
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Cover square */}
      <div
        className={cx(
          "relative shrink-0 size-content-thumb rounded-xl overflow-hidden",
          isLocked && "opacity-60"
        )}>
        {coverUrl ? (
          <img src={coverUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className={cx("size-full bg-gradient-to-br", gradient)} />
        )}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Lock02 size={14} color="white" aria-hidden="true" />
          </div>
        )}
      </div>
      {/* Meta text */}
      <div className="flex flex-col gap-1 min-w-0 flex-1 pt-1">{children}</div>
    </div>
  )
}

function MetaLabel({
  icon: Icon,
  children,
}: {
  icon: IconComp
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={12} color="var(--color-text-tertiary)" aria-hidden="true" />
      <span className="text-xs text-text-tertiary uppercase font-medium tracking-wide">
        {children}
      </span>
    </div>
  )
}

// ── Per-type body renderer ────────────────────────────────────────────────────

function CardBody({
  content,
  isLocked,
}: {
  content: CardContent
  isLocked: boolean
}) {
  switch (content.type) {
    // ── Video / Video Show ──────────────────────────────────────────────────
    case "video":
    case "video-show":
      return (
        <MediaThumbnail
          url={content.thumbnailUrl}
          contentType={content.type}
          isLocked={isLocked}
          showPlay={true}
        />
      )

    // ── Article / Note ──────────────────────────────────────────────────────
    case "article":
    case "note": {
      const isNote = content.type === "note"
      return (
        <div
          className={cx(
            "relative rounded-xl overflow-hidden p-4",
            isNote
              ? "bg-app-note-bg border border-blue-800/30"
              : "bg-app-card border border-app-border"
          )}>
          <p
            className={cx(
              "text-sm leading-relaxed",
              isLocked
                ? "line-clamp-2 text-text-tertiary"
                : "line-clamp-5 text-text-secondary"
            )}>
            {content.excerpt}
          </p>
          {isLocked && (
            <div className="absolute inset-x-0 bottom-0 h-12 flex items-end px-4 pb-3 bg-gradient-to-t from-app-bg to-transparent">
              <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <Lock02 size={11} color="currentColor" aria-hidden="true" />
                Unlock to read
              </div>
            </div>
          )}
        </div>
      )
    }

    // ── Podcast / Podcast Show ──────────────────────────────────────────────
    case "podcast":
    case "podcast-show":
      return (
        <CoverWithMeta
          coverUrl={content.thumbnailUrl}
          gradient="from-[#1a1226] to-[#0e0a18]"
          isLocked={isLocked}>
          <MetaLabel
            icon={content.type === "podcast-show" ? Rss01 : Microphone01}>
            {content.type === "podcast-show"
              ? "Podcast Show"
              : "Podcast Episode"}
          </MetaLabel>
          {content.episodeCount !== undefined && (
            <p className="text-sm text-text-secondary">
              {content.episodeCount} episodes
            </p>
          )}
          {content.duration && (
            <p className="text-sm text-text-tertiary">{content.duration}</p>
          )}
        </CoverWithMeta>
      )

    // ── Audiobook ──────────────────────────────────────────────────────────
    case "audiobook":
      return (
        <CoverWithMeta
          coverUrl={content.coverUrl}
          gradient="from-[#102a18] to-[#081710]"
          isLocked={isLocked}>
          <MetaLabel icon={Headphones01}>Audiobook</MetaLabel>
          <p className="text-sm text-text-secondary">{content.duration}</p>
          {content.narrator && (
            <p className="text-sm text-text-tertiary">
              Narrated by {content.narrator}
            </p>
          )}
        </CoverWithMeta>
      )

    // ── Book ──────────────────────────────────────────────────────────────
    case "book":
      return (
        <CoverWithMeta
          coverUrl={content.coverUrl}
          gradient="from-[#2e1410] to-[#180a08]"
          isLocked={isLocked}>
          <MetaLabel icon={BookOpen01}>Book</MetaLabel>
          {content.pageCount && (
            <p className="text-sm text-text-secondary">
              {content.pageCount} pages
            </p>
          )}
        </CoverWithMeta>
      )

    // ── Song ─────────────────────────────────────────────────────────────
    case "song":
      return (
        <CoverWithMeta
          coverUrl={content.coverUrl}
          gradient="from-[#2a1f10] to-[#170f08]"
          isLocked={isLocked}>
          <MetaLabel icon={MusicNote01}>Song</MetaLabel>
          {content.album && (
            <p className="text-sm text-text-secondary">{content.album}</p>
          )}
          <p className="text-sm text-text-tertiary">{content.duration}</p>
        </CoverWithMeta>
      )

    // ── Album ─────────────────────────────────────────────────────────────
    case "album":
      return (
        <CoverWithMeta
          coverUrl={content.coverUrl}
          gradient="from-[#2a1f10] to-[#170f08]"
          isLocked={isLocked}>
          <MetaLabel icon={MusicNote01}>Album</MetaLabel>
          <p className="text-sm text-text-secondary">
            {content.trackCount} tracks
          </p>
        </CoverWithMeta>
      )

    // ── Collection ────────────────────────────────────────────────────────
    case "collection": {
      const CELL_GRADIENTS = [
        "from-[#27115f] to-[#1a0a40]",
        "from-[#102a56] to-[#091a38]",
        "from-[#102a18] to-[#081710]",
        "from-[#2a1f10] to-[#170f08]",
      ]
      return (
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-2 size-full gap-px bg-app-border">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={cx(
                  "overflow-hidden bg-gradient-to-br",
                  CELL_GRADIENTS[i]
                )}>
                {content.coverUrls?.[i] && (
                  <img
                    src={content.coverUrls[i]}
                    alt=""
                    className="size-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <div className="flex items-center justify-center size-12 rounded-full bg-[rgba(91,90,87,0.5)] backdrop-blur-sm">
                <Lock02 size={22} color="white" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ContentCard({
  creator,
  content,
  purchase,
  social,
  topBooster,
  supporterAvatarUrls = [],
  isWishlisted,
  onUnlock,
  onWishlist,
  onOptions,
  onComment,
  onShare,
  onLike,
  onBoost,
  onCardClick,
  href,
  className,
}: ContentCardProps) {
  const isLocked = purchase.state === "locked"

  return (
    <article
      className={cx(
        "flex flex-col gap-4 p-5",
        "bg-bg-primary border border-app-border rounded-2xl",
        "cursor-default",
        className
      )}
      onClick={onCardClick}>
      {/* ── Row 1: Creator + actions ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <CreatorByline
          name={creator.name}
          handle={creator.handle}
          avatarUrl={creator.avatarUrl}
          size="md"
          nameColor="secondary"
        />
        {/* Kebab menu */}
        <GlassBtn
          icon={DotsVertical}
          label="More options"
          onClick={onOptions}
        />
      </div>

      {/* ── Row 2: Title + badge + wishlist + unlock ─────────────────────── */}
      {/*   Mobile: stacked (title full-width → actions below)             */}
      {/*   sm+:    side-by-side (current design)                          */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        {/* Title — Link when href provided, plain heading otherwise */}
        {href ? (
          <Link
            href={href}
            onClick={e => e.stopPropagation()}
            className="flex-1 text-lg font-semibold text-text-primary leading-snug hover:text-text-secondary hover:underline underline-offset-2 transition-colors">
            {content.title}
          </Link>
        ) : (
          <h3
            className="flex-1 text-lg font-semibold text-text-primary leading-snug cursor-pointer hover:underline underline-offset-2"
            onClick={e => {
              e.stopPropagation()
              onCardClick?.()
            }}>
            {content.title}
          </h3>
        )}
        {/* Right cluster */}
        <div className="flex items-center gap-2 shrink-0 sm:pt-0.5">
          <ContentTypeTag type={content.type} />
          <GlassBtn
            icon={Bookmark}
            label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            active={isWishlisted}
            onClick={onWishlist}
          />
          {isLocked && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onUnlock?.()
              }}
              className={cx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0",
                "bg-brand-600 hover:bg-brand-700 active:bg-brand-800",
                "text-white text-xs font-semibold cursor-pointer",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-brand-400 focus-visible:ring-offset-1 focus-visible:ring-offset-app-card"
              )}>
              <Lock02 size={12} color="currentColor" aria-hidden="true" />
              {purchase.label ?? "Unlock"}
            </button>
          )}
        </div>
      </div>

      {/* ── Row 3: Subtitle ──────────────────────────────────────────────── */}
      {content.subtitle && (
        <p className="-mt-2 text-sm text-text-tertiary leading-relaxed">
          {content.subtitle}
        </p>
      )}

      {/* ── Row 4: Content body ──────────────────────────────────────────── */}
      <CardBody content={content} isLocked={isLocked} />

      {/* ── Row 5–6: Footer ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 -mb-1">
        {/* Boost pill + supporter avatars */}
        {(topBooster || supporterAvatarUrls.length > 0) && (
          <div className="flex items-center justify-between gap-3">
            {topBooster ? (
              <div className="flex items-center gap-2">
                <Avatar
                  name={topBooster.name}
                  src={topBooster.avatarUrl}
                  size="xs"
                  className="border border-black/10"
                />
                <Lightning01
                  size={14}
                  color="var(--color-brand-400)"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-text-primary">
                  {fmtAmount(topBooster.amount)}
                </span>
                <span className="text-xs text-text-tertiary">boosted</span>
              </div>
            ) : (
              <div />
            )}
            {supporterAvatarUrls.length > 0 && (
              <AvatarGroup avatarUrls={supporterAvatarUrls} />
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-app-border" />

        {/* Social buttons */}
        <div className="flex items-center justify-between">
          <CardSocialButtons
            comments={social.comments}
            shares={social.shares}
            likes={social.likes}
            boosts={social.boosts}
            onComment={onComment}
            onShare={onShare}
            onLike={onLike}
            onBoost={onBoost}
          />
        </div>
      </div>
    </article>
  )
}
