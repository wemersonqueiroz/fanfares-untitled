"use client"

import { MediaThumbnail } from "./internals"

export type AlbumBodyProps = {
  coverUrl?: string
  isLocked: boolean
  price?: string
  onPlay?: () => void
}

/** Body for `content.type === "album"` — full-width square cover. */
export function AlbumBody({ coverUrl, isLocked, price, onPlay }: AlbumBodyProps) {
  return (
    <MediaThumbnail
      url={coverUrl}
      contentType="album"
      isLocked={isLocked}
      price={price}
      showPlay
      onPlay={onPlay}
    />
  )
}
