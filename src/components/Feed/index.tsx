"use client"

import { cx } from "@/utils/cx"
import { ContentCard } from "@/components/ContentCard"
import type { ContentCardProps } from "@/components/ContentCard"

// ── Public types ──────────────────────────────────────────────────────────────

export type FeedCallbacks = {
  onUnlock?: (id: string) => void
  onWishlist?: (id: string) => void
  onOptions?: (id: string) => void
  onComment?: (id: string) => void
  onShare?: (id: string) => void
  onLike?: (id: string) => void
  onBoost?: (id: string) => void
  onCardClick?: (id: string) => void
}

export type FeedProps = FeedCallbacks & {
  cards: ContentCardProps[]
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Feed({
  cards,
  onUnlock,
  onWishlist,
  onOptions,
  onComment,
  onShare,
  onLike,
  onBoost,
  onCardClick,
  className,
}: FeedProps) {
  return (
    <div
      role="feed"
      aria-label="Content feed"
      className={cx("flex flex-col gap-4", className)}>
      {cards.map(card => (
        <ContentCard
          key={card.id}
          {...card}
          onUnlock={onUnlock ? () => onUnlock(card.id) : undefined}
          onWishlist={onWishlist ? () => onWishlist(card.id) : undefined}
          onOptions={onOptions ? () => onOptions(card.id) : undefined}
          onComment={onComment ? () => onComment(card.id) : undefined}
          onShare={onShare ? () => onShare(card.id) : undefined}
          onLike={onLike ? () => onLike(card.id) : undefined}
          onBoost={onBoost ? () => onBoost(card.id) : undefined}
          onCardClick={onCardClick ? () => onCardClick(card.id) : undefined}
        />
      ))}
    </div>
  )
}
