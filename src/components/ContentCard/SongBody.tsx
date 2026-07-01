"use client"

import { MediaThumbnail } from "./internals"

export type SongBodyProps = {
  coverUrl?: string
  isLocked: boolean
  price?: string
  onPlay?: () => void
}

/** Body for `content.type === "song"` — full-width square cover. */
export function SongBody({ coverUrl, isLocked, price, onPlay }: SongBodyProps) {
  return (
    <MediaThumbnail
      url={coverUrl}
      contentType="song"
      isLocked={isLocked}
      price={price}
      showPlay
      onPlay={onPlay}
    />
  )
}
