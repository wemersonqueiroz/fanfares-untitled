"use client"

import { MediaThumbnail } from "./internals"

export type BookBodyProps = {
  coverUrl?: string
  isLocked: boolean
  /** Unlock price — when locked, displayed in a centered pill instead of a lock icon. */
  price?: string
}

/** Body for `content.type === "book"` — full-width portrait (4:5) cover. */
export function BookBody({ coverUrl, isLocked, price }: BookBodyProps) {
  return (
    <MediaThumbnail
      url={coverUrl}
      contentType="book"
      isLocked={isLocked}
      price={price}
    />
  )
}
