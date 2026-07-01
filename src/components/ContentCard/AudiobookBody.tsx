"use client"

import { MediaThumbnail } from "./internals"

export type AudiobookBodyProps = {
  coverUrl?: string
  isLocked: boolean
  price?: string
  onPlay?: () => void
}

/** Body for `content.type === "audiobook"` — full-width square cover. */
export function AudiobookBody({ coverUrl, isLocked, price, onPlay }: AudiobookBodyProps) {
  return (
    <MediaThumbnail
      url={coverUrl}
      contentType="audiobook"
      isLocked={isLocked}
      price={price}
      showPlay
      onPlay={onPlay}
    />
  )
}
