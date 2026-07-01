"use client"

import { cx } from "@/utils/cx"
import { ContentCard } from "@/components/ContentCard"
import type { ContentCardProps } from "@/components/ContentCard"

// ── Public types ──────────────────────────────────────────────────────────────

export type FeedCallbacks = {
  onPlay?: (id: string) => void
  onUnlock?: (id: string) => void
  onWishlist?: (id: string) => void
  onOptions?: (id: string) => void
  onComment?: (id: string) => void
  onShare?: (id: string) => void
  onLike?: (id: string) => void
  onZap?: (id: string) => void
  onCardClick?: (id: string) => void
}

export type FeedProps = FeedCallbacks & {
  cards: ContentCardProps[]
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Feed({
  cards,
  onPlay,
  onUnlock,
  onWishlist,
  onOptions,
  onComment,
  onShare,
  onLike,
  onZap,
  onCardClick,
  className,
}: FeedProps) {
  return (
    <div
      role="feed"
      aria-label="Content feed"
      className={cx(
        // Mobile: no gap, thin border between cards (cards themselves are
        // borderless below `sm`, so this is the only post-to-post separator).
        // Desktop: 16 px gap; each card has its own bg-primary border so no
        // divider is needed.
        "flex flex-col divide-y divide-app-border sm:divide-y-0 sm:gap-4",
        className
      )}>
      {cards.map(card => (
        <ContentCard
          key={card.id}
          {...card}
          onPlay={onPlay ? () => onPlay(card.id) : undefined}
          onUnlock={onUnlock ? () => onUnlock(card.id) : undefined}
          onWishlist={onWishlist ? () => onWishlist(card.id) : undefined}
          onOptions={onOptions ? () => onOptions(card.id) : undefined}
          onComment={onComment ? () => onComment(card.id) : undefined}
          onShare={onShare ? () => onShare(card.id) : undefined}
          onLike={onLike ? () => onLike(card.id) : undefined}
          onZap={onZap ? () => onZap(card.id) : undefined}
          onCardClick={onCardClick ? () => onCardClick(card.id) : undefined}
        />
      ))}
    </div>
  )
}
