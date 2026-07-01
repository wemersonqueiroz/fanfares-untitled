"use client"

import { MediaThumbnail } from "./internals"

export type PodcastBodyProps = {
  type: "podcast" | "podcast-show"
  thumbnailUrl?: string
  isLocked: boolean
  price?: string
  onPlay?: () => void
}

/** Body for `content.type === "podcast" | "podcast-show"` — full-width 16:9 cover. */
export function PodcastBody({ type, thumbnailUrl, isLocked, price, onPlay }: PodcastBodyProps) {
  return (
    <MediaThumbnail
      url={thumbnailUrl}
      contentType={type}
      isLocked={isLocked}
      price={price}
      showPlay
      onPlay={onPlay}
    />
  )
}
