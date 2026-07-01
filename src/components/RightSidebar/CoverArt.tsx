"use client"

import { Download01, FileHeart02, Star01 } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"
import { GlassBtn } from "@/components/GlassBtn"
import { PlayCircle } from "@/components/PlayCircle"
import { isWideCover } from "./internals"

export type CoverArtProps = {
  contentType: ContentType
  /** Cover image URL — falls back to a gradient placeholder. */
  coverUrl?: string
  title: string
  /** Override the auto-derived aspect ratio. */
  aspect?: "square" | "wide"
  isWishlisted?: boolean
  onPlay?: () => void
  onWishlist?: () => void
  onDownload?: () => void
}

export function CoverArt({
  contentType,
  coverUrl,
  title,
  aspect,
  isWishlisted,
  onPlay,
  onWishlist,
  onDownload,
}: CoverArtProps) {
  const resolvedAspect = aspect ?? (isWideCover(contentType) ? "wide" : "square")
  // Video uses a "File Heart" wishlist glyph; everything else uses the star.
  const WishlistIcon = contentType === "video" || contentType === "video-show" ? FileHeart02 : Star01

  return (
    <div
      className={cx(
        "relative shrink-0 w-full rounded-md overflow-hidden border border-black/10",
        resolvedAspect === "wide" ? "aspect-video" : "aspect-square"
      )}>
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="size-full object-cover" />
      ) : (
        <div className="size-full bg-gradient-to-br from-[#27115f] to-[#1a0a40]" />
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
        <PlayCircle size={48} onClick={onPlay} />
      </div>

      <div className="absolute top-0 right-0 flex flex-col gap-0.5 p-0.5">
        <GlassBtn
          icon={WishlistIcon}
          label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          active={isWishlisted}
          onClick={onWishlist}
        />
        <GlassBtn icon={Download01} label="Download" onClick={onDownload} />
      </div>
    </div>
  )
}
