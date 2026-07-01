"use client"

import { MediaThumbnail } from "./internals"

export type VideoBodyProps = {
  type: "video" | "video-show"
  thumbnailUrl?: string
  isLocked: boolean
  /** Unlock price — when locked, displayed in a centered pill instead of a lock icon. */
  price?: string
  onPlay?: () => void
}

/** Body for `content.type === "video" | "video-show"` — wide 16:9 thumbnail with play overlay. */
export function VideoBody({ type, thumbnailUrl, isLocked, price, onPlay }: VideoBodyProps) {
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
