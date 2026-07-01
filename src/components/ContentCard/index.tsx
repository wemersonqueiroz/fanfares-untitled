"use client"

import Link from "next/link"
import {
  Bookmark,
  DotsVertical,
  Lightning01,
  Lock02,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar, AvatarGroup } from "@/components/Avatar"
import { CreatorByline } from "@/components/CreatorByline"
import { AlbumBody } from "./AlbumBody"
import { ArticleBody } from "./ArticleBody"
import { AudiobookBody } from "./AudiobookBody"
import { BookBody } from "./BookBody"
import { CardSocialButtons } from "./CardSocialButtons"
import { CollectionBody } from "./CollectionBody"
import { ContentTypeTag } from "./ContentTypeTag"
import { fmtAmount, GlassBtn } from "./internals"
import { PodcastBody } from "./PodcastBody"
import { SongBody } from "./SongBody"
import { VideoBody } from "./VideoBody"

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

export type CardZapper = {
  name: string
  avatarUrl?: string
  /** Raw zap amount (e.g. sats). Displayed as formatted number. */
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
    zaps: number
  }
  /** Primary zapper shown in the zap pill */
  topZapper?: CardZapper
  /** Avatar URLs for the supporter group (up to ~5; overflow shown as +N) */
  supporterAvatarUrls?: (string | undefined)[]
  /** Whether the current user has wishlisted this card */
  isWishlisted?: boolean
  // ── Callbacks ─────────────────────────────────────────────────────────────
  /** Fires when the centered play button on the cover thumbnail is clicked. */
  onPlay?: () => void
  onUnlock?: () => void
  onWishlist?: () => void
  onOptions?: () => void
  onComment?: () => void
  onShare?: () => void
  onLike?: () => void
  onZap?: () => void
  /** Fires when the card body/title area is clicked (not on action buttons) */
  onCardClick?: () => void
  /**
   * When set, the card title becomes a Next.js `<Link>` to this URL.
   * Takes precedence over `onCardClick` for the title element only.
   */
  href?: string
  className?: string
}

// ── Per-type body dispatcher ─────────────────────────────────────────────────

function CardBody({
  content,
  isLocked,
  price,
  onPlay,
}: {
  content: CardContent
  isLocked: boolean
  /** Unlock price — surfaced as a pill on locked thumbnails. */
  price?: string
  onPlay?: () => void
}) {
  switch (content.type) {
    case "video":
    case "video-show":
      return (
        <VideoBody
          type={content.type}
          thumbnailUrl={content.thumbnailUrl}
          isLocked={isLocked}
          price={price}
          onPlay={onPlay}
        />
      )

    case "article":
    case "note":
      return <ArticleBody type={content.type} excerpt={content.excerpt} isLocked={isLocked} />

    case "podcast":
    case "podcast-show":
      return (
        <PodcastBody
          type={content.type}
          thumbnailUrl={content.thumbnailUrl}
          isLocked={isLocked}
          price={price}
          onPlay={onPlay}
        />
      )

    case "audiobook":
      return (
        <AudiobookBody
          coverUrl={content.coverUrl}
          isLocked={isLocked}
          price={price}
          onPlay={onPlay}
        />
      )

    case "book":
      return (
        <BookBody
          coverUrl={content.coverUrl}
          isLocked={isLocked}
          price={price}
        />
      )

    case "song":
      return (
        <SongBody
          coverUrl={content.coverUrl}
          isLocked={isLocked}
          price={price}
          onPlay={onPlay}
        />
      )

    case "album":
      return (
        <AlbumBody
          coverUrl={content.coverUrl}
          isLocked={isLocked}
          price={price}
          onPlay={onPlay}
        />
      )

    case "collection":
      return (
        <CollectionBody
          coverUrls={content.coverUrls}
          isLocked={isLocked}
          price={price}
        />
      )

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
  topZapper,
  supporterAvatarUrls = [],
  isWishlisted,
  onPlay,
  onUnlock,
  onWishlist,
  onOptions,
  onComment,
  onShare,
  onLike,
  onZap,
  onCardClick,
  href,
  className,
}: ContentCardProps) {
  const isLocked = purchase.state === "locked"
  const lockedPrice = purchase.state === "locked" ? purchase.price : undefined

  return (
    <article
      className={cx(
        "flex flex-col gap-4 pt-4 pb-4 px-0 sm:px-4",
        "bg-bg-primary sm:border sm:border-app-border rounded-xl",
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
        <GlassBtn
          icon={DotsVertical}
          label="More options"
          onClick={onOptions}
        />
      </div>

      {/* ── Row 2: Title + badge + wishlist + unlock ─────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
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

      {/* ── Row 4: Content body — variant dispatcher ─────────────────────── */}
      <CardBody content={content} isLocked={isLocked} price={lockedPrice} onPlay={onPlay} />

      {/* ── Row 5–6: Footer ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 -mb-1">
        {(topZapper || supporterAvatarUrls.length > 0) && (
          <div className="flex items-center justify-between gap-3">
            {topZapper ? (
              <div className="flex items-center gap-2">
                <Avatar
                  name={topZapper.name}
                  src={topZapper.avatarUrl}
                  size="xs"
                  className="border border-black/10"
                />
                <Lightning01
                  size={14}
                  color="var(--color-brand-400)"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-text-primary">
                  {fmtAmount(topZapper.amount)}
                </span>
                <span className="text-xs text-text-tertiary">zapped</span>
              </div>
            ) : (
              <div />
            )}
            {supporterAvatarUrls.length > 0 && (
              <AvatarGroup avatarUrls={supporterAvatarUrls} />
            )}
          </div>
        )}

        <div className="border-t border-app-border" />

        <div className="flex items-center justify-between">
          <CardSocialButtons
            comments={social.comments}
            shares={social.shares}
            likes={social.likes}
            zaps={social.zaps}
            onComment={onComment}
            onShare={onShare}
            onLike={onLike}
            onZap={onZap}
          />
        </div>
      </div>
    </article>
  )
}
